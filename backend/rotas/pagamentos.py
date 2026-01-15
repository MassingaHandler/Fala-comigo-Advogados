"""
Rotas de Pagamentos
POST /payments/mpesa/initiate
GET /payments/mpesa/{transactionId}/status
POST /payments/mpesa/callback
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from database import get_db
from modelos.pagamentos import Payment
from modelos.consultas import Order, OrderStatus, PaymentStatus
from servicos.mpesa import initiate_mpesa_payment, verify_mpesa_payment, process_mpesa_callback
from utils.dependencias import get_current_user

router = APIRouter(prefix="/payments", tags=["Pagamentos"])


class InitiatePaymentRequest(BaseModel):
    orderId: str
    phoneNumber: str
    amount: float
    reference: str


@router.post("/mpesa/initiate")
async def initiate_payment(
    request: InitiatePaymentRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Iniciar pagamento M-Pesa"""
    # Verificar se order existe
    order = db.query(Order).filter(Order.id == request.orderId).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta não encontrada"
        )
    
    # Iniciar pagamento M-Pesa
    result = await initiate_mpesa_payment(
        phone_number=request.phoneNumber,
        amount=request.amount,
        reference=request.reference
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )
    
    # Criar registro de pagamento
    payment = Payment(
        transaction_id=result["transactionId"],
        order_id=request.orderId,
        client_name=current_user.full_name,
        client_phone=request.phoneNumber,
        amount=request.amount,
        method="mpesa",
        status="pending"
    )
    
    db.add(payment)
    
    # Atualizar order
    order.transaction_reference = result["transactionId"]
    order.payment_method = "mpesa"
    order.payment_status = PaymentStatus.PENDING.value
    
    db.commit()
    
    return {
        "success": True,
        "message": result["message"],
        "transactionId": result["transactionId"],
        "status": "pending"
    }


@router.get("/mpesa/{transaction_id}/status")
async def check_payment_status(
    transaction_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verificar status do pagamento"""
    payment = db.query(Payment).filter(Payment.transaction_id == transaction_id).first()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pagamento não encontrado"
        )
    
    # Se já confirmado, retornar status
    if payment.status == "completed":
        return {
            "success": True,
            "transactionId": transaction_id,
            "status": "confirmed",
            "amount": payment.amount,
            "phoneNumber": payment.client_phone,
            "confirmedAt": payment.confirmed_at.isoformat() if payment.confirmed_at else None
        }
    
    # Verificar com M-Pesa
    result = await verify_mpesa_payment(transaction_id)
    
    if result.get("status") == "confirmed":
        # Atualizar pagamento
        payment.status = "completed"
        payment.confirmed_at = datetime.utcnow()
        
        # Atualizar order
        order = db.query(Order).filter(Order.id == payment.order_id).first()
        if order:
            order.payment_status = PaymentStatus.CONFIRMED.value
            order.status = OrderStatus.PENDING_ASSIGNMENT.value
        
        db.commit()
    
    return {
        "success": True,
        "transactionId": transaction_id,
        "status": result.get("status", "pending"),
        "amount": payment.amount,
        "phoneNumber": payment.client_phone,
        "confirmedAt": payment.confirmed_at.isoformat() if payment.confirmed_at else None
    }


@router.post("/mpesa/callback")
async def mpesa_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    """Webhook de confirmação M-Pesa (chamado pela Vodacom)"""
    callback_data = await request.json()
    
    # Processar callback
    result = process_mpesa_callback(callback_data)
    
    if result["success"]:
        # Atualizar pagamento
        payment = db.query(Payment).filter(
            Payment.transaction_id == result["transactionId"]
        ).first()
        
        if payment:
            payment.status = "completed"
            payment.confirmed_at = datetime.utcnow()
            
            # Atualizar order
            order = db.query(Order).filter(Order.id == payment.order_id).first()
            if order:
                order.payment_status = PaymentStatus.CONFIRMED.value
                order.status = OrderStatus.PENDING_ASSIGNMENT.value
            
            db.commit()
    
    return {"success": True}
