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

from servicos.autenticacao import get_password_hash
from datetime import datetime, timedelta

router = APIRouter(tags=["Administração"])

@router.get("/test")
async def test_admin_route():
    return {"status": "ok", "message": "Admin route is working"}

class ReassignRequest(BaseModel):
    new_lawyer_id: str
    reason: Optional[str] = None

class UserCreateRequest(BaseModel):
    full_name: str
    email: str
    phone_number: str
    password: str
    is_active: bool = True

class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: Optional[bool] = None


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
    
    # Estatísticas do mês atual
    now = datetime.now()
    first_day_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    new_users_this_month = db.query(User).filter(User.created_at >= first_day_of_month).count()
    new_lawyers_this_month = db.query(Lawyer).filter(Lawyer.created_at >= first_day_of_month).count()
    completed_cases_this_month = db.query(Order).filter(
        Order.status == OrderStatus.COMPLETED.value,
        Order.updated_at >= first_day_of_month
    ).count()
    
    revenue_this_month = db.query(func.sum(Payment.amount)).filter(
        Payment.status == "completed",
        Payment.created_at >= first_day_of_month
    ).scalar() or 0.0

    # Dados para gráficos (Time-series)
    # Por agora, vamos gerar dados reais agregados nos últimos 6 meses se period=month
    chart_data = {"revenue": [], "cases": [], "users": []}
    
    if period == "month":
        for i in range(5, -1, -1):
            month_date = now - timedelta(days=i*30)
            month_name = month_date.strftime("%b")
            start_of_m = month_date.replace(day=1, hour=0, minute=0, second=0)
            if i == 0:
                end_of_m = now
            else:
                next_m = (start_of_m + timedelta(days=32)).replace(day=1)
                end_of_m = next_m - timedelta(seconds=1)
            
            rev = db.query(func.sum(Payment.amount)).filter(
                Payment.status == "completed",
                Payment.created_at >= start_of_m,
                Payment.created_at <= end_of_m
            ).scalar() or 0.0
            
            cas = db.query(Order).filter(
                Order.status == OrderStatus.COMPLETED.value,
                Order.updated_at >= start_of_m,
                Order.updated_at <= end_of_m
            ).count()
            
            usr = db.query(User).filter(
                User.created_at >= start_of_m,
                User.created_at <= end_of_m
            ).count()
            
            chart_data["revenue"].append({"month": month_name, "count": float(rev)})
            chart_data["cases"].append({"month": month_name, "count": cas})
            chart_data["users"].append({"month": month_name, "count": usr})
    
    # Dados fictícios para week/year se solicitado, ou expandir depois
    elif period == "week":
        days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
        for i, day in enumerate(days):
            chart_data["revenue"].append({"month": day, "count": 0.0})
            chart_data["cases"].append({"month": day, "count": 0})
            chart_data["users"].append({"month": day, "count": 0})
    
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
            "revenueThisMonth": revenue_this_month,
            "newUsersThisMonth": new_users_this_month,
            "newLawyersThisMonth": new_lawyers_this_month,
            "completedCasesThisMonth": completed_cases_this_month,
            "averageRating": 4.8,
            "chartData": chart_data,
            "topLawyers": [
                {
                    "lawyer_id": str(l.lawyer_id),
                    "nome": l.nome,
                    "casesCompleted": l.cases_completed,
                    "rating": l.rating,
                    "revenue": (l.cases_completed or 0) * 2500, # Estimativa
                    "satisfaction": 90 + int(l.rating or 0) # Estimativa
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
@router.get("/users")
async def list_users(
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Listar usuários (Admin)"""
    query = db.query(User)
    
    if search:
        query = query.filter(
            (User.full_name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%"))
        )
    
    if status_filter == "active":
        query = query.filter(User.is_active == True)
    elif status_filter == "inactive":
        query = query.filter(User.is_active == False)
        
    total = query.count()
    users = query.order_by(User.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    users_data = []
    for user in users:
        # Contar casos do usuário
        cases_count = db.query(Order).filter(Order.user_id == user.id).count()
        
        users_data.append({
            "id": str(user.id),
            "name": user.full_name,
            "email": user.email,
            "phone": user.phone_number,
            "status": "active" if user.is_active else "inactive",
            "totalCases": cases_count,
            "joinedDate": user.created_at.isoformat() if user.created_at else None
        })
        
    return {
        "success": True,
        "data": users_data,
        "pagination": {
            "currentPage": page,
            "totalPages": (total + limit - 1) // limit,
            "totalItems": total
        }
    }


@router.post("/users")
async def create_user(
    request: UserCreateRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Criar novo usuário (Admin)"""
    # Verificar se email já existe
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado"
        )
    
    # Criar usuário
    from modelos.usuarios import DocumentType # Import local para evitar circular se houver
    user = User(
        full_name=request.full_name,
        email=request.email,
        phone_number=request.phone_number,
        password_hash=get_password_hash(request.password),
        is_active=request.is_active,
        # Campos obrigatórios no modelo que precisam de default
        document_type=DocumentType.BI, # Default para admin create
        document_number=f"ADMIN-{datetime.now().timestamp()}", # Mock ou pedir no form
        nationality="Moçambicana",
        birth_date=datetime(1990, 1, 1) # Default
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {
        "success": True,
        "message": "Usuário criado com sucesso",
        "user": {
            "id": str(user.id),
            "name": user.full_name,
            "email": user.email
        }
    }


@router.patch("/users/{user_id}")
async def update_user(
    user_id: str,
    request: UserUpdateRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Atualizar usuário (Admin)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    if request.full_name is not None:
        user.full_name = request.full_name
    if request.email is not None:
        user.email = request.email
    if request.phone_number is not None:
        user.phone_number = request.phone_number
    if request.is_active is not None:
        user.is_active = request.is_active
        
    db.commit()
    
    return {
        "success": True,
        "message": "Usuário atualizado com sucesso"
    }


@router.delete("/users/{user_id}")
async def toggle_user_status(
    user_id: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Ativar/Desativar usuário (Admin)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    user.is_active = not user.is_active
    db.commit()
    
    return {
        "success": True,
        "message": f"Usuário {'ativado' if user.is_active else 'desativado'} com sucesso",
        "is_active": user.is_active
    }


@router.get("/lawyers")
async def list_lawyers(
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    specialty_filter: Optional[str] = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Listar advogados (Admin)"""
    query = db.query(Lawyer)
    
    if search:
        query = query.filter(Lawyer.nome.ilike(f"%{search}%"))
    
    if specialty_filter and specialty_filter != "all":
        query = query.filter(Lawyer.especialidade == specialty_filter)
        
    total = query.count()
    lawyers = query.order_by(Lawyer.nome).offset((page - 1) * limit).limit(limit).all()
    
    lawyers_data = []
    for l in lawyers:
        lawyers_data.append({
            "id": str(l.lawyer_id),
            "nome": l.nome,
            "especialidade": l.especialidade,
            "rating": l.rating,
            "casesCompleted": l.cases_completed,
            "status": "active" if l.is_active else "inactive",
            "phone": l.professional_phone
        })
        
    return {
        "success": True,
        "data": lawyers_data,
        "pagination": {
            "currentPage": page,
            "totalPages": (total + limit - 1) // limit,
            "totalItems": total
        }
    }


class LawyerUpdateRequest(BaseModel):
    nome: Optional[str] = None
    especialidade: Optional[str] = None
    professional_phone: Optional[str] = None
    professional_email: Optional[str] = None
    office_address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    is_active: Optional[bool] = None

class LawyerVerifyRequest(BaseModel):
    action: str  # "approve" | "reject"
    notes: Optional[str] = None


@router.get("/lawyers/applications")
async def list_lawyer_applications(
    page: int = 1,
    limit: int = 20,
    status_filter: str = "pending_verification",
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Listar candidaturas de advogados pendentes (Admin)"""
    query = db.query(Lawyer)
    
    if status_filter and status_filter != "all":
        query = query.filter(Lawyer.verification_status == status_filter)
    
    total = query.count()
    lawyers = query.order_by(Lawyer.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    apps_data = []
    for l in lawyers:
        apps_data.append({
            "id": str(l.lawyer_id),
            "nome": l.nome,
            "especialidade": l.especialidade,
            "oamNumber": l.oam_number,
            "oamRegistrationYear": l.oam_registration_year,
            "phone": l.professional_phone,
            "email": l.professional_email,
            "city": l.city,
            "province": l.province,
            "verificationStatus": l.verification_status,
            "verificationNotes": l.verification_notes,
            "submittedAt": l.created_at.isoformat() if l.created_at else None,
        })

    return {
        "success": True,
        "data": apps_data,
        "pagination": {
            "currentPage": page,
            "totalPages": (total + limit - 1) // limit,
            "totalItems": total
        }
    }


@router.get("/lawyers/{lawyer_id}")
async def get_lawyer_detail(
    lawyer_id: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Obter detalhes de um advogado (Admin)"""
    lawyer = db.query(Lawyer).filter(Lawyer.lawyer_id == lawyer_id).first()
    if not lawyer:
        raise HTTPException(status_code=404, detail="Advogado não encontrado")
    
    return {
        "success": True,
        "data": {
            "id": str(lawyer.lawyer_id),
            "nome": lawyer.nome,
            "especialidade": lawyer.especialidade,
            "specializations": lawyer.specializations,
            "oamNumber": lawyer.oam_number,
            "oamRegistrationYear": lawyer.oam_registration_year,
            "phone": lawyer.professional_phone,
            "email": lawyer.professional_email,
            "officeAddress": lawyer.office_address,
            "city": lawyer.city,
            "province": lawyer.province,
            "rating": lawyer.rating,
            "casesCompleted": lawyer.cases_completed,
            "status": "active" if lawyer.is_active else "inactive",
            "verificationStatus": lawyer.verification_status,
            "joinedDate": lawyer.created_at.isoformat() if lawyer.created_at else None,
        }
    }


@router.patch("/lawyers/{lawyer_id}")
async def update_lawyer(
    lawyer_id: str,
    request: LawyerUpdateRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Atualizar dados de um advogado (Admin)"""
    lawyer = db.query(Lawyer).filter(Lawyer.lawyer_id == lawyer_id).first()
    if not lawyer:
        raise HTTPException(status_code=404, detail="Advogado não encontrado")
    
    if request.nome is not None:
        lawyer.nome = request.nome
    if request.especialidade is not None:
        lawyer.especialidade = request.especialidade
    if request.professional_phone is not None:
        lawyer.professional_phone = request.professional_phone
    if request.professional_email is not None:
        lawyer.professional_email = request.professional_email
    if request.office_address is not None:
        lawyer.office_address = request.office_address
    if request.city is not None:
        lawyer.city = request.city
    if request.province is not None:
        lawyer.province = request.province
    if request.is_active is not None:
        lawyer.is_active = request.is_active

    lawyer.updated_at = datetime.utcnow()
    db.commit()
    
    return {"success": True, "message": "Advogado atualizado com sucesso"}


@router.delete("/lawyers/{lawyer_id}/status")
async def toggle_lawyer_status(
    lawyer_id: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Ativar/Desativar advogado (Admin)"""
    lawyer = db.query(Lawyer).filter(Lawyer.lawyer_id == lawyer_id).first()
    if not lawyer:
        raise HTTPException(status_code=404, detail="Advogado não encontrado")
    
    lawyer.is_active = not lawyer.is_active
    lawyer.updated_at = datetime.utcnow()
    db.commit()
    
    return {
        "success": True,
        "message": f"Advogado {'ativado' if lawyer.is_active else 'suspenso'} com sucesso",
        "is_active": lawyer.is_active
    }


@router.post("/lawyers/{lawyer_id}/verify")
async def verify_lawyer(
    lawyer_id: str,
    request: LawyerVerifyRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Aprovar ou rejeitar candidatura de advogado (Admin)"""
    lawyer = db.query(Lawyer).filter(Lawyer.lawyer_id == lawyer_id).first()
    if not lawyer:
        raise HTTPException(status_code=404, detail="Advogado não encontrado")
    
    if request.action == "approve":
        lawyer.verification_status = "verified"
        lawyer.is_active = True
        message = "Candidatura aprovada com sucesso"
    elif request.action == "reject":
        lawyer.verification_status = "rejected"
        lawyer.is_active = False
        message = "Candidatura rejeitada"
    else:
        raise HTTPException(status_code=400, detail="Ação inválida. Use 'approve' ou 'reject'")
    
    lawyer.verification_notes = request.notes
    lawyer.updated_at = datetime.utcnow()
    db.commit()
    
    return {
        "success": True,
        "message": message,
        "verificationStatus": lawyer.verification_status
    }


@router.get("/payments")
async def list_payments(
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    method_filter: Optional[str] = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Listar pagamentos (Admin)"""
    query = db.query(Payment)
    
    # Filtro por status
    if status_filter and status_filter != "all":
        query = query.filter(Payment.status == status_filter)
    
    # Filtro por método - Payment usa "method", não "payment_method"
    if method_filter and method_filter != "all":
        query = query.filter(Payment.method == method_filter)
    
    # Busca por cliente ou ID de transação
    if search:
        query = query.filter(
            Payment.client_name.ilike(f"%{search}%") |
            Payment.transaction_id.ilike(f"%{search}%")
        )
        
    total = query.count()
    payments = query.order_by(Payment.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    payments_data = []
    for p in payments:
        # Buscar o caso relacionado para obter o caseId (human_id)
        order = db.query(Order).filter(Order.id == p.order_id).first()
        
        payments_data.append({
            "id": str(p.id),
            "transactionId": p.transaction_id or f"TXN-{str(p.id)[:8]}",
            "client": p.client_name or "Desconhecido",
            "caseId": order.human_id if order else "N/A",
            "amount": p.amount,
            "method": p.method or "mpesa",
            "status": p.status,
            "date": p.created_at.isoformat() if p.created_at else None
        })
        
    return {
        "success": True,
        "data": payments_data,
        "totalRevenue": db.query(func.sum(Payment.amount)).filter(Payment.status == "completed").scalar() or 0.0,
        "pendingRevenue": db.query(func.sum(Payment.amount)).filter(Payment.status == "pending").scalar() or 0.0,
        "pagination": {
            "currentPage": page,
            "totalPages": max(1, (total + limit - 1) // limit),
            "totalItems": total
        }
    }

