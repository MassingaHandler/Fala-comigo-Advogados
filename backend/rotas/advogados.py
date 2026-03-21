"""
Rotas de Advogados
GET /lawyers
GET /lawyers/{lawyerId}
PATCH /lawyers/{lawyerId}/online-status
GET /lawyers/{lawyerId}/stats
GET /admin/lawyers (Admin)
PATCH /admin/lawyers/{lawyerId}/verification (Admin)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from database import get_db
from modelos.advogados import Lawyer
from modelos.consultas import Order, Assignment
from modelos.avaliacoes import Rating
from utils.dependencias import get_current_lawyer, get_current_admin
from sqlalchemy import func

router = APIRouter(prefix="/lawyers", tags=["Advogados"])


class OnlineStatusRequest(BaseModel):
    isOnline: bool


class VerificationRequest(BaseModel):
    status: str  # "verified" | "rejected"
    notes: Optional[str] = None


@router.get("")
async def list_lawyers(
    specialty: Optional[str] = None,
    available: Optional[bool] = None,
    rating: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """Listar advogados disponíveis"""
    query = db.query(Lawyer).filter(
        Lawyer.is_active == True,
        Lawyer.verification_status == "verified"
    )
    
    if specialty:
        query = query.filter(Lawyer.especialidade == specialty)
    
    if available is not None:
        query = query.filter(Lawyer.is_online == available)
    
    if rating:
        query = query.filter(Lawyer.rating >= rating)
    
    lawyers = query.all()
    
    return {
        "success": True,
        "data": [lawyer.to_dict() for lawyer in lawyers]
    }


@router.get("/{lawyer_id}")
async def get_lawyer_profile(
    lawyer_id: str,
    db: Session = Depends(get_db)
):
    """Obter perfil do advogado"""
    lawyer = db.query(Lawyer).filter(Lawyer.lawyer_id == lawyer_id).first()
    if not lawyer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advogado não encontrado"
        )
    
    return lawyer.to_dict()


@router.patch("/{lawyer_id}/online-status")
async def update_online_status(
    lawyer_id: str,
    request: OnlineStatusRequest,
    current_lawyer: Lawyer = Depends(get_current_lawyer),
    db: Session = Depends(get_db)
):
    """Atualizar status online do advogado"""
    if str(current_lawyer.lawyer_id) != lawyer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado"
        )
    
    current_lawyer.is_online = request.isOnline
    db.commit()
    
    return {
        "success": True,
        "message": "Status atualizado",
        "isOnline": request.isOnline
    }


@router.get("/{lawyer_id}/assignments")
async def get_lawyer_assignments(
    lawyer_id: str,
    db: Session = Depends(get_db)
):
    """Obter consultas atribuídas ao advogado"""
    # Buscar assignments do advogado
    assignments = db.query(Assignment).filter(
        Assignment.lawyer_id == lawyer_id
    ).all()
    
    result = []
    for assignment in assignments:
        # Buscar ordem relacionada
        order = db.query(Order).filter(Order.id == assignment.order_id).first()
        if not order:
            continue
        
        # Montar dados do assignment
        assignment_data = {
            "assignment_id": str(assignment.assignment_id),
            "assigned_at": assignment.assigned_at.isoformat() if assignment.assigned_at else None,
            "order": {
                "id": str(order.id),
                "human_id": order.human_id,
                "order_id": order.order_id,
                "user_id": str(order.user_id),
                "client_phone_number": order.client_phone_number,
                "topic": order.topic,
                "pkg": order.pkg,
                "consultation_type": order.consultation_type,
                "payment_status": order.payment_status,
                "payment_method": order.payment_method,
                "status": order.status,
                "created_at": order.created_at.isoformat() if order.created_at else None,
                "client_name": order.user.full_name if order.user else "Cliente"
            },
            "session": assignment.session.to_dict() if assignment.session else None
        }
        
        result.append(assignment_data)
    
    return {
        "success": True,
        "data": result
    }


@router.get("/{lawyer_id}/stats")
async def get_lawyer_stats(
    lawyer_id: str,
    period: str = "today",
    current_lawyer: Lawyer = Depends(get_current_lawyer),
    db: Session = Depends(get_db)
):
    """Estatísticas do advogado"""
    if str(current_lawyer.lawyer_id) != lawyer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado"
        )
    
    # Buscar estatísticas
    total_cases = db.query(Assignment).filter(
        Assignment.lawyer_id == lawyer_id
    ).count()
    
    avg_rating = db.query(func.avg(Rating.stars)).filter(
        Rating.lawyer_id == lawyer_id
    ).scalar() or 0.0
    
    total_reviews = db.query(Rating).filter(
        Rating.lawyer_id == lawyer_id
    ).count()
    
    return {
        "success": True,
        "stats": {
            "dailyConsultations": 0,  # TODO: Implementar filtro por data
            "dailyRevenue": 0,
            "totalCasesCompleted": current_lawyer.cases_completed,
            "averageRating": round(avg_rating, 1),
            "totalReviews": total_reviews
        }
    }


@router.patch("/admin/lawyers/{lawyer_id}/verification")
async def verify_lawyer(
    lawyer_id: str,
    request: VerificationRequest,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Aprovar/Rejeitar registro de advogado (Admin)"""
    lawyer = db.query(Lawyer).filter(Lawyer.lawyer_id == lawyer_id).first()
    if not lawyer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advogado não encontrado"
        )
    
    lawyer.verification_status = request.status
    lawyer.verification_notes = request.notes
    db.commit()
    
    return {
        "success": True,
        "message": f"Advogado {'verificado' if request.status == 'verified' else 'rejeitado'} com sucesso",
        "lawyerId": lawyer_id,
        "status": request.status
    }
