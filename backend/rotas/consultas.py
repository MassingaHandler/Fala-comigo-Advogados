"""
Rotas de Consultas/Casos
POST /consultations
GET /consultations/{orderId}
GET /users/{userId}/consultations
PATCH /consultations/{orderId}/status
POST /consultations/{orderId}/assign
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from database import get_db
from modelos.consultas import Order, Assignment, Session as ConsultationSession, OrderStatus
from modelos.usuarios import User
from modelos.advogados import Lawyer
from utils.dependencias import get_current_user, get_current_admin
from utils.helpers import generate_human_id

router = APIRouter(prefix="/consultations", tags=["Consultas"])


class CreateConsultationRequest(BaseModel):
    user_id: str
    topic: dict
    pkg: dict
    consultationType: str
    clientPhoneNumber: str
    selectedLawyerId: Optional[str] = None  # ID do advogado escolhido (ou None para auto)


class UpdateStatusRequest(BaseModel):
    status: str


class AssignLawyerRequest(BaseModel):
    lawyer_id: str


@router.post("")
async def create_consultation(
    request: CreateConsultationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Criar nova consulta com advogado e pagamento automático"""
    # Gerar ID legível
    human_id = generate_human_id("FC")
    
    # Determinar advogado
    lawyer_id = request.selectedLawyerId
    
    if not lawyer_id or lawyer_id == "auto":
        # Auto-atribuir: buscar advogado disponível da especialidade
        specialty = request.topic.get("name", "")
        available_lawyer = db.query(Lawyer).filter(
            Lawyer.especialidade == specialty,
            Lawyer.is_active == True,
            Lawyer.verification_status == "verified",
            Lawyer.is_online == True
        ).first()
        
        if not available_lawyer:
            # Se não houver online, pegar qualquer um verificado
            available_lawyer = db.query(Lawyer).filter(
                Lawyer.especialidade == specialty,
                Lawyer.is_active == True,
                Lawyer.verification_status == "verified"
            ).first()
        
        if not available_lawyer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Nenhum advogado disponível para {specialty}"
            )
        
        lawyer_id = str(available_lawyer.lawyer_id)
    
    # Verificar se advogado existe
    lawyer = db.query(Lawyer).filter(Lawyer.lawyer_id == lawyer_id).first()
    if not lawyer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advogado não encontrado"
        )
    
    # Criar order
    new_order = Order(
        human_id=human_id,
        order_id=human_id,
        user_id=request.user_id,
        client_phone_number=request.clientPhoneNumber,
        topic=request.topic,
        pkg=request.pkg,
        consultation_type=request.consultationType,
        status=OrderStatus.ASSIGNED.value,  # Já atribuído
        payment_status="confirmed",  # Pagamento automático (temporário)
        payment_method="auto"
    )
    
    db.add(new_order)
    db.flush()  # Para obter o ID
    
    # Criar assignment
    assignment = Assignment(
        order_id=str(new_order.id),
        lawyer_id=lawyer_id
    )
    
    db.add(assignment)
    db.commit()
    db.refresh(new_order)
    db.refresh(assignment)
    
    return {
        "success": True,
        "message": "Consulta criada e advogado atribuído com sucesso!",
        "order": new_order.to_dict(),
        "lawyer": lawyer.to_dict(),
        "assignment": assignment.to_dict()
    }


@router.get("/{order_id}")
async def get_consultation(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obter detalhes da consulta"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta não encontrada"
        )
    
    # Verificar permissão
    if str(order.user_id) != str(current_user.id) and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado"
        )
    
    result = order.to_dict()
    
    # Adicionar assignment se existir
    assignment = db.query(Assignment).filter(Assignment.order_id == order_id).first()
    if assignment:
        lawyer = db.query(Lawyer).filter(Lawyer.lawyer_id == assignment.lawyer_id).first()
        session = db.query(ConsultationSession).filter(ConsultationSession.assignment_id == assignment.assignment_id).first()
        
        result["assignment"] = {
            **assignment.to_dict(),
            "lawyer": lawyer.to_dict() if lawyer else None,
            "session": session.to_dict() if session else None
        }
    
    return result


@router.get("/users/{user_id}/consultations")
async def list_user_consultations(
    user_id: str,
    status_filter: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Listar consultas do usuário"""
    if str(current_user.id) != user_id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado"
        )
    
    query = db.query(Order).filter(Order.user_id == user_id)
    
    if status_filter:
        query = query.filter(Order.status == status_filter)
    
    total = query.count()
    orders = query.order_by(Order.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    return {
        "success": True,
        "data": [order.to_dict() for order in orders],
        "pagination": {
            "currentPage": page,
            "totalPages": (total + limit - 1) // limit,
            "totalItems": total,
            "itemsPerPage": limit
        }
    }


@router.patch("/{order_id}/status")
async def update_consultation_status(
    order_id: str,
    request: UpdateStatusRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualizar status da consulta"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta não encontrada"
        )
    
    order.status = request.status
    order.updated_at = datetime.utcnow()
    db.commit()
    
    return {
        "success": True,
        "message": "Status atualizado",
        "orderId": order_id,
        "newStatus": request.status
    }


@router.post("/{order_id}/assign")
async def assign_lawyer(
    order_id: str,
    request: AssignLawyerRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Atribuir advogado a uma consulta (Admin)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta não encontrada"
        )
    
    # Verificar se advogado existe
    lawyer = db.query(Lawyer).filter(Lawyer.lawyer_id == request.lawyer_id).first()
    if not lawyer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advogado não encontrado"
        )
    
    # Criar assignment
    assignment = Assignment(
        order_id=order_id,
        lawyer_id=request.lawyer_id
    )
    
    db.add(assignment)
    
    # Atualizar status do order
    order.status = OrderStatus.ASSIGNED.value
    
    db.commit()
    db.refresh(assignment)
    
    return {
        "success": True,
        "message": "Advogado atribuído com sucesso",
        "assignment": assignment.to_dict()
    }
