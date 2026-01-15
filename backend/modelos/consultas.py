"""
Modelos de Consultas e Casos
"""
from sqlalchemy import Column, String, DateTime, Integer, Float, Boolean, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime
import enum


class OrderStatus(str, enum.Enum):
    """Status do pedido/caso"""
    PENDING_PAYMENT = "pending_payment"
    PENDING_ASSIGNMENT = "pending_assignment"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    RATING_PENDING = "rating_pending"
    CANCELLED = "cancelled"


class PaymentStatus(str, enum.Enum):
    """Status do pagamento"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    FAILED = "failed"


class ConsultationType(str, enum.Enum):
    """Tipo de consulta"""
    DIGITAL = "digital"
    PHONE = "phone"


class Order(Base):
    """Modelo de Consulta/Caso"""
    __tablename__ = "orders"
    
    # Identificação
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    human_id = Column(String(20), unique=True, nullable=False, index=True)  # FC-123456
    order_id = Column(String(20), nullable=False)  # Alias para human_id
    
    # Relacionamento com caso pai (para follow-ups)
    parent_order_id = Column(UUID(as_uuid=True), ForeignKey('orders.id'), nullable=True)
    
    # Cliente
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    client_phone_number = Column(String(20), nullable=False)
    
    # Tema e Pacote (JSON)
    topic = Column(JSON, nullable=False)
    # Exemplo: {"id": "familia", "name": "Direito de Família"}
    
    pkg = Column(JSON, nullable=False)
    # Exemplo: {"id": "basico", "name": "Consulta Básica", "price": 2500, ...}
    
    # Tipo de Consulta
    consultation_type = Column(String(20), nullable=False)  # digital | phone
    
    # Pagamento
    payment_status = Column(String(20), default=PaymentStatus.PENDING.value)
    payment_method = Column(String(20), nullable=True)  # mpesa
    transaction_reference = Column(String(100), nullable=True, index=True)
    
    # Status do Caso
    status = Column(String(50), default=OrderStatus.PENDING_PAYMENT.value, index=True)
    
    # Termos (para follow-ups)
    terms_accepted = Column(Boolean, default=False)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    user = relationship("User", foreign_keys=[user_id])
    parent_order = relationship("Order", remote_side=[id], foreign_keys=[parent_order_id])
    
    def __repr__(self):
        return f"<Order {self.human_id} - Status: {self.status}>"
    
    def to_dict(self):
        """Converte para dicionário"""
        return {
            "id": str(self.id),
            "human_id": self.human_id,
            "order_id": self.human_id,
            "parent_order_id": str(self.parent_order_id) if self.parent_order_id else None,
            "user_id": str(self.user_id),
            "clientPhoneNumber": self.client_phone_number,
            "topic": self.topic,
            "pkg": self.pkg,
            "consultationType": self.consultation_type,
            "payment_status": self.payment_status,
            "payment_method": self.payment_method,
            "transaction_reference": self.transaction_reference,
            "status": self.status,
            "termsAccepted": self.terms_accepted,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }


class Assignment(Base):
    """Modelo de Atribuição de Advogado"""
    __tablename__ = "assignments"
    
    # Identificação
    assignment_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Relacionamentos
    order_id = Column(UUID(as_uuid=True), ForeignKey('orders.id'), nullable=False, unique=True)
    lawyer_id = Column(UUID(as_uuid=True), ForeignKey('lawyers.lawyer_id'), nullable=False)
    
    # Data de Atribuição
    assigned_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relacionamentos
    order = relationship("Order", foreign_keys=[order_id])
    lawyer = relationship("Lawyer", foreign_keys=[lawyer_id])
    
    def __repr__(self):
        return f"<Assignment {self.assignment_id}>"
    
    def to_dict(self):
        """Converte para dicionário"""
        return {
            "assignment_id": str(self.assignment_id),
            "order_id": str(self.order_id),
            "lawyer_id": str(self.lawyer_id),
            "assignedAt": self.assigned_at.isoformat() if self.assigned_at else None
        }


class Session(Base):
    """Modelo de Sessão de Consulta"""
    __tablename__ = "sessions"
    
    # Identificação
    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Relacionamento
    assignment_id = Column(UUID(as_uuid=True), ForeignKey('assignments.assignment_id'), nullable=False, unique=True)
    
    # Horário
    start_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    end_time = Column(DateTime, nullable=True)
    
    # Relacionamento
    assignment = relationship("Assignment", foreign_keys=[assignment_id])
    
    def __repr__(self):
        return f"<Session {self.session_id}>"
    
    def to_dict(self):
        """Converte para dicionário"""
        return {
            "session_id": str(self.session_id),
            "assignment_id": str(self.assignment_id),
            "startTime": self.start_time.isoformat() if self.start_time else None,
            "endTime": self.end_time.isoformat() if self.end_time else None
        }
