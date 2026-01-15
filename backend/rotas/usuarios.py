"""
Rotas de Usuários
GET /users/{userId}
PATCH /users/{userId}
GET /users (Admin)
PATCH /users/{userId}/status (Admin)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

from database import get_db
from modelos.usuarios import User
from utils.dependencias import get_current_user, get_current_admin

router = APIRouter(prefix="/users", tags=["Usuários"])


class UpdateUserRequest(BaseModel):
    fullName: Optional[str] = None
    phoneNumber: Optional[str] = None
    neighborhood: Optional[str] = None
    city: Optional[str] = None


class UpdateStatusRequest(BaseModel):
    status: str  # "active" | "inactive"


@router.get("/{user_id}")
async def get_user_profile(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obter perfil do usuário"""
    # Verificar se é o próprio usuário ou admin
    if str(current_user.id) != user_id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    return user.to_dict()


@router.patch("/{user_id}")
async def update_user_profile(
    user_id: str,
    request: UpdateUserRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualizar perfil do usuário"""
    if str(current_user.id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    # Atualizar campos
    if request.fullName:
        user.full_name = request.fullName
    if request.phoneNumber:
        user.phone_number = request.phoneNumber
    
    if request.neighborhood or request.city:
        address = user.address or {}
        if request.neighborhood:
            address["neighborhood"] = request.neighborhood
        if request.city:
            address["city"] = request.city
        user.address = address
    
    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    
    return {
        "success": True,
        "message": "Perfil atualizado com sucesso",
        "user": user.to_dict()
    }


@router.get("")
async def list_users(
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Listar todos os usuários (Admin apenas)"""
    query = db.query(User)
    
    # Filtros
    if search:
        query = query.filter(
            (User.full_name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%"))
        )
    
    if status_filter == "active":
        query = query.filter(User.is_active == True)
    elif status_filter == "inactive":
        query = query.filter(User.is_active == False)
    
    # Paginação
    total = query.count()
    users = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "success": True,
        "data": [user.to_dict() for user in users],
        "pagination": {
            "currentPage": page,
            "totalPages": (total + limit - 1) // limit,
            "totalItems": total,
            "itemsPerPage": limit
        }
    }


@router.patch("/{user_id}/status")
async def update_user_status(
    user_id: str,
    request: UpdateStatusRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Ativar/Desativar usuário (Admin apenas)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    user.is_active = request.status == "active"
    db.commit()
    
    return {
        "success": True,
        "message": "Status do usuário atualizado",
        "userId": user_id,
        "newStatus": request.status
    }
