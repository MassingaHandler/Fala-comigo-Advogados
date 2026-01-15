"""
Modelo de Pagamentos
"""
from sqlalchemy import Column, String, DateTime, Integer, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime


class Payment(Base):
    """Modelo de Pagamento"""
    __tablename__ = "payments"
    
    # Identificação
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # ID da Transação (M-Pesa, etc.)
    transaction_id = Column(String(100), unique=True, nullable=False, index=True)
    
    # Relacionamento com Order
    order_id = Column(UUID(as_uuid=True), ForeignKey('orders.id'), nullable=False)
    
    # Cliente
    client_name = Column(String(255), nullable=False)
    client_phone = Column(String(20), nullable=False)
    
    # Valor
    amount = Column(Float, nullable=False)
    
    # Método de Pagamento
    method = Column(String(20), nullable=False)  # mpesa, card, bank
    
    # Status
    status = Column(String(20), nullable=False)  # pending, completed, failed
    
    # Datas
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    confirmed_at = Column(DateTime, nullable=True)
    
    # Relacionamento
    order = relationship("Order", foreign_keys=[order_id])
    
    def __repr__(self):
        return f"<Payment {self.transaction_id} - {self.amount} MT>"
    
    def to_dict(self):
        """Converte para dicionário"""
        return {
            "id": str(self.id),
            "transactionId": self.transaction_id,
            "orderId": str(self.order_id),
            "client": self.client_name,
            "amount": self.amount,
            "method": self.method,
            "status": self.status,
            "date": self.created_at.isoformat() if self.created_at else None,
            "confirmedAt": self.confirmed_at.isoformat() if self.confirmed_at else None
        }
