"""
Rotas de Avaliações
POST /consultations/{orderId}/rating
GET /lawyers/{lawyerId}/ratings
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
from modelos.avaliacoes import Rating
from modelos.consultas import Order, OrderStatus
from modelos.advogados import Lawyer
from modelos.usuarios import User
from utils.dependencias import get_current_user
from sqlalchemy import func

router = APIRouter(tags=["Avaliações"])


class CreateRatingRequest(BaseModel):
    stars: int
    comment: Optional[str] = None


@router.post("/consultations/{order_id}/rating")
async def create_rating(
    order_id: str,
    request: CreateRatingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Criar avaliação"""
    # Verificar se order existe
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta não encontrada"
        )
    
    # Verificar se é o usuário da consulta
    if str(order.user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado"
        )
    
    # Verificar se já existe avaliação
    existing_rating = db.query(Rating).filter(Rating.order_id == order_id).first()
    if existing_rating:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consulta já foi avaliada"
        )
    
    # Buscar advogado da consulta
    from modelos.consultas import Assignment
    assignment = db.query(Assignment).filter(Assignment.order_id == order_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consulta não tem advogado atribuído"
        )
    
    # Criar avaliação
    rating = Rating(
        order_id=order_id,
        lawyer_id=assignment.lawyer_id,
        user_id=current_user.id,
        stars=request.stars,
        comment=request.comment
    )
    
    db.add(rating)
    
    # Atualizar status do order
    order.status = OrderStatus.COMPLETED.value
    
    # Atualizar estatísticas do advogado
    lawyer = db.query(Lawyer).filter(Lawyer.lawyer_id == assignment.lawyer_id).first()
    if lawyer:
        # Recalcular rating médio
        avg_rating = db.query(func.avg(Rating.stars)).filter(
            Rating.lawyer_id == assignment.lawyer_id
        ).scalar() or 0.0
        
        total_reviews = db.query(Rating).filter(
            Rating.lawyer_id == assignment.lawyer_id
        ).count() + 1
        
        lawyer.rating = round(avg_rating, 1)
        lawyer.total_reviews = total_reviews
        lawyer.cases_completed += 1
    
    db.commit()
    db.refresh(rating)
    
    return {
        "success": True,
        "message": "Avaliação registrada com sucesso",
        "rating": rating.to_dict()
    }


@router.get("/lawyers/{lawyer_id}/ratings")
async def get_lawyer_ratings(
    lawyer_id: str,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Obter avaliações do advogado"""
    # Buscar avaliações
    query = db.query(Rating).filter(Rating.lawyer_id == lawyer_id)
    total = query.count()
    
    ratings = query.order_by(Rating.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    # Calcular distribuição
    distribution = {}
    for i in range(1, 6):
        count = db.query(Rating).filter(
            Rating.lawyer_id == lawyer_id,
            Rating.stars == i
        ).count()
        distribution[str(i)] = count
    
    # Calcular média
    avg_rating = db.query(func.avg(Rating.stars)).filter(
        Rating.lawyer_id == lawyer_id
    ).scalar() or 0.0
    
    # Buscar informações dos clientes
    ratings_data = []
    for rating in ratings:
        user = db.query(User).filter(User.id == rating.user_id).first()
        rating_dict = rating.to_dict()
        rating_dict["client"] = {"fullName": user.full_name} if user else None
        ratings_data.append(rating_dict)
    
    return {
        "success": True,
        "data": ratings_data,
        "summary": {
            "averageRating": round(avg_rating, 1),
            "totalReviews": total,
            "distribution": distribution
        }
    }
