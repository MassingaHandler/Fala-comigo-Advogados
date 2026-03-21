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
from modelos.mensagens import ChatMessage, Document
from modelos.usuarios import User
from modelos.advogados import Lawyer
from utils.dependencias import get_current_user, get_current_admin, get_current_lawyer, get_current_active_entity
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

class UpdateNotesRequest(BaseModel):
    notes: str
    followUpRequested: Optional[bool] = None

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
    db.flush()  # Para obter o ID da atribuição
    
    # Criar sessão de chat
    session = ConsultationSession(
        assignment_id=assignment.assignment_id
    )
    db.add(session)
    db.flush()
    
    # Criar mensagem de boas-vindas
    welcome_text = f"Olá! Sou {lawyer.nome}, seu advogado. Recebemos o seu pagamento via M-Pesa. Como posso ajudar?"
    welcome_msg = ChatMessage(
        order_id=new_order.id,
        sender_id=lawyer.lawyer_id,
        sender="lawyer",
        text=welcome_text,
        type="text"
    )
    db.add(welcome_msg)
    
    db.commit()
    db.refresh(new_order)
    db.refresh(assignment)
    db.refresh(session)
    
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
    """Listar consultas do usuário com dados completos"""
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
    
    # Enriquecer dados com assignment
    result = []
    for order in orders:
        order_dict = order.to_dict()
        
        # Buscar assignment
        assignment = db.query(Assignment).filter(Assignment.order_id == str(order.id)).first()
        if assignment:
            # Buscar advogado
            lawyer = db.query(Lawyer).filter(Lawyer.lawyer_id == assignment.lawyer_id).first()
            
            order_dict["assignment"] = {
                "assignment_id": str(assignment.assignment_id),
                "assigned_at": assignment.assigned_at.isoformat() if assignment.assigned_at else None,
                "lawyer": lawyer.to_dict() if lawyer else None
            }
            
            # Buscar sessão
            session = db.query(ConsultationSession).filter(ConsultationSession.assignment_id == assignment.assignment_id).first()
            if not session:
                # Criar sessão preguiçosamente
                session = ConsultationSession(assignment_id=assignment.assignment_id)
                db.add(session)
                db.flush()
                
                # Mensagem inicial
                welcome_msg = ChatMessage(
                    order_id=order.id,
                    sender_id=lawyer.lawyer_id,
                    sender="lawyer",
                    text=f"Olá! Sou {lawyer.nome}, seu advogado. Como posso ajudar?",
                    type="text"
                )
                db.add(welcome_msg)
                db.commit()
                db.refresh(session)

            # Buscar mensagens e documentos
            messages = db.query(ChatMessage).filter(ChatMessage.order_id == order.id).order_by(ChatMessage.timestamp.asc()).all()
            docs = db.query(Document).filter(Document.order_id == order.id).all()
            
            order_dict["assignment"]["session"] = {
                "session_id": str(session.session_id),
                "startTime": session.start_time.isoformat() if session.start_time else None,
                "messages": [m.to_dict() for m in messages],
                "documents": [d.to_dict() for d in docs]
            }
        
        result.append(order_dict)
    
    return {
        "success": True,
        "data": result,
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
    current_entity = Depends(get_current_active_entity),
    db: Session = Depends(get_db)
):
    """Atualizar status da consulta"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta não encontrada"
        )
    
    # Verificar permissão (apenas advogado atribuído ou admin ou o próprio usuário se for pra cancelar - simplificado aqui)
    # Se for admin, permite tudo
    is_admin = getattr(current_entity, 'is_admin', False)
    
    if not is_admin:
        # Se for advogado, verificar se está atribuído
        if hasattr(current_entity, 'lawyer_id'):
            assignment = db.query(Assignment).filter(
                Assignment.order_id == order_id,
                Assignment.lawyer_id == current_entity.lawyer_id
            ).first()
            
            if not assignment:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Você não tem permissão para alterar o status desta consulta"
                )
        # Se for usuário comum, verificar se é o dono da consulta
        elif hasattr(current_entity, 'id'):
            if str(order.user_id) != str(current_entity.id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Você não tem permissão para alterar o status desta consulta"
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


@router.patch("/{order_id}/notes")
async def update_consultation_notes(
    order_id: str,
    request: UpdateNotesRequest,
    current_lawyer: Lawyer = Depends(get_current_lawyer),
    db: Session = Depends(get_db)
):
    """Atualizar notas do advogado e flag de acompanhamento"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta não encontrada"
        )
    
    # Verificar se o advogado está atribuído a este caso
    assignment = db.query(Assignment).filter(
        Assignment.order_id == order_id,
        Assignment.lawyer_id == current_lawyer.lawyer_id
    ).first()
    
    if not assignment and not current_lawyer.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para editar notas deste caso"
        )
    
    order.lawyer_notes = request.notes
    if request.followUpRequested is not None:
        order.follow_up_requested = request.followUpRequested
        
    order.updated_at = datetime.utcnow()
    db.commit()
    
    return {
        "success": True,
        "message": "Notas atualizadas com sucesso",
        "notes": order.lawyer_notes,
        "followUpRequested": order.follow_up_requested
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
    db.flush()
    
    # Criar sessão de chat
    session = ConsultationSession(
        assignment_id=assignment.assignment_id
    )
    db.add(session)
    db.flush()
    
    # Criar mensagem de boas-vindas
    welcome_text = f"Olá! Sou {lawyer.nome}, seu advogado. Recebemos o seu pagamento via M-Pesa. Como posso ajudar?"
    welcome_msg = ChatMessage(
        order_id=order.id,
        sender_id=lawyer.lawyer_id,
        sender="lawyer",
        text=welcome_text,
        type="text"
    )
    db.add(welcome_msg)
    
    # Atualizar status do order
    order.status = OrderStatus.ASSIGNED.value
    
    db.commit()
    db.refresh(assignment)
    
    return {
        "success": True,
        "message": "Advogado atribuído com sucesso",
        "assignment": assignment.to_dict()
    }


@router.get("/track/{human_id}")
async def track_consultation(
    human_id: str,
    db: Session = Depends(get_db)
):
    """Rastrear consulta por ID legível (público)"""
    order = db.query(Order).filter(Order.human_id == human_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta não encontrada. Verifique o ID."
        )
    
    result = order.to_dict()
    
    # Adicionar assignment se existir
    assignment = db.query(Assignment).filter(Assignment.order_id == str(order.id)).first()
    if assignment:
        lawyer = db.query(Lawyer).filter(Lawyer.lawyer_id == assignment.lawyer_id).first()
        
        result["assignment"] = {
            "assignment_id": str(assignment.assignment_id),
            "assigned_at": assignment.assigned_at.isoformat() if assignment.assigned_at else None,
            "lawyer": {
                "lawyer_id": str(lawyer.lawyer_id),
                "nome": lawyer.nome,
                "especialidade": lawyer.especialidade,
                "rating": lawyer.rating,
                "avatarUrl": lawyer.to_dict().get("avatarUrl")
            } if lawyer else None
        }
        
        # Buscar sessão
        session = db.query(ConsultationSession).filter(ConsultationSession.assignment_id == assignment.assignment_id).first()
        if not session:
            # Criar sessão preguiçosamente (para dados antigos)
            session = ConsultationSession(assignment_id=assignment.assignment_id)
            db.add(session)
            db.flush()
            
            # Criar mensagem de boas-vindas
            welcome_text = f"Olá! Sou {lawyer.nome}, seu advogado. Como posso ajudar?"
            welcome_msg = ChatMessage(
                order_id=order.id,
                sender_id=lawyer.lawyer_id,
                sender="lawyer",
                text=welcome_text,
                type="text"
            )
            db.add(welcome_msg)
            db.commit()
            db.refresh(session)

        # Buscar mensagens e documentos
        messages = db.query(ChatMessage).filter(ChatMessage.order_id == order.id).order_by(ChatMessage.timestamp.asc()).all()
        docs = db.query(Document).filter(Document.order_id == order.id).all()
        
        result["assignment"]["session"] = {
            "session_id": str(session.session_id),
            "startTime": session.start_time.isoformat() if session.start_time else None,
            "messages": [m.to_dict() for m in messages],
            "documents": [d.to_dict() for d in docs]
        }
    
    return {
        "success": True,
        "data": result
    }
