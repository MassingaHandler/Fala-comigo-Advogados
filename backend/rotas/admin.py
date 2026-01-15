"""
Rotas Administrativas
GET /admin/analytics
GET /admin/cases
PATCH /admin/cases/{orderId}/reassign
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
from modelos.usuarios import User
from modelos.advogados import Lawyer
from modelos.consultas import Order, Assignment, OrderStatus
from modelos.pagamentos import Payment
from utils.dependencias import get_current_admin
from sqlalchemy import func

router = APIRouter(prefix="/admin", tags=["Administração"])


class ReassignRequest(BaseModel):
    new_lawyer_id: str
    reason: Optional[str] = None


@router.get("/analytics")
async def get_analytics(
    period: str = "month",
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Dashboard analytics"""
    # Estatísticas gerais
    total_users = db.query(User).count()
    total_lawyers = db.query(Lawyer).filter(Lawyer.verification_status == "verified").count()
    total_cases = db.query(Order).count()
    active_cases = db.query(Order).filter(
        Order.status.in_([OrderStatus.ASSIGNED.value, OrderStatus.IN_PROGRESS.value])
    ).count()
    completed_cases = db.query(Order).filter(Order.status == OrderStatus.COMPLETED.value).count()
    
    # Receita total
    total_revenue = db.query(func.sum(Payment.amount)).filter(
        Payment.status == "completed"
    ).scalar() or 0.0
    
    # Top advogados
    top_lawyers = db.query(Lawyer).filter(
        Lawyer.verification_status == "verified"
    ).order_by(Lawyer.rating.desc()).limit(5).all()
    
    return {
        "success": True,
        "analytics": {
            "totalUsers": total_users,
            "totalLawyers": total_lawyers,
            "totalCases": total_cases,
            "activeCases": active_cases,
            "completedCases": completed_cases,
            "totalRevenue": total_revenue,
            "revenueThisMonth": total_revenue,  # TODO: Filtrar por mês
            "newUsersThisMonth": 0,  # TODO: Implementar
            "newLawyersThisMonth": 0,  # TODO: Implementar
            "averageRating": 4.7,  # TODO: Calcular média global
            "topLawyers": [
                {
                    "lawyer_id": str(l.lawyer_id),
                    "nome": l.nome,
                    "casesCompleted": l.cases_completed,
                    "rating": l.rating
                } for l in top_lawyers
            ]
        }
    }


@router.get("/cases")
async def list_all_cases(
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Listar todos os casos (Admin)"""
    query = db.query(Order)
    
    # Filtros
    if search:
        query = query.filter(Order.human_id.ilike(f"%{search}%"))
    
    if status_filter:
        query = query.filter(Order.status == status_filter)
    
    # Paginação
    total = query.count()
    orders = query.order_by(Order.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    # Enriquecer com dados de usuário e advogado
    cases_data = []
    for order in orders:
        user = db.query(User).filter(User.id == order.user_id).first()
        assignment = db.query(Assignment).filter(Assignment.order_id == order.id).first()
        lawyer = None
        if assignment:
            lawyer = db.query(Lawyer).filter(Lawyer.lawyer_id == assignment.lawyer_id).first()
        
        cases_data.append({
            "id": str(order.id),
            "caseId": order.human_id,
            "client": user.full_name if user else "N/A",
            "lawyer": lawyer.nome if lawyer else "Não atribuído",
            "topic": order.topic.get("name", "N/A"),
            "status": order.status,
            "createdDate": order.created_at.isoformat() if order.created_at else None,
            "amount": order.pkg.get("price", 0)
        })
    
    return {
        "success": True,
        "data": cases_data,
        "pagination": {
            "currentPage": page,
            "totalPages": (total + limit - 1) // limit,
            "totalItems": total,
            "itemsPerPage": limit
        }
    }


@router.patch("/cases/{order_id}/reassign")
async def reassign_case(
    order_id: str,
    request: ReassignRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Reatribuir caso a outro advogado (Admin)"""
    # Verificar se order existe
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Caso não encontrado"
        )
    
    # Verificar se novo advogado existe
    new_lawyer = db.query(Lawyer).filter(Lawyer.lawyer_id == request.new_lawyer_id).first()
    if not new_lawyer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advogado não encontrado"
        )
    
    # Buscar assignment existente
    assignment = db.query(Assignment).filter(Assignment.order_id == order_id).first()
    
    if assignment:
        # Atualizar assignment existente
        assignment.lawyer_id = request.new_lawyer_id
        assignment.assigned_at = func.now()
    else:
        # Criar novo assignment
        assignment = Assignment(
            order_id=order_id,
            lawyer_id=request.new_lawyer_id
        )
        db.add(assignment)
    
    db.commit()
    
    return {
        "success": True,
        "message": "Caso reatribuído com sucesso",
        "orderId": order_id,
        "newLawyerId": request.new_lawyer_id
    }
