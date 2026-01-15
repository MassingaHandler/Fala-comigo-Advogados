"""
Modelo de Avaliações
"""
from sqlalchemy import Column, String, DateTime, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime


class Rating(Base):
    """Modelo de Avaliação"""
    __tablename__ = "ratings"
    
    # Identificação
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Relacionamentos
    order_id = Column(UUID(as_uuid=True), ForeignKey('orders.id'), nullable=False, unique=True, index=True)
    lawyer_id = Column(UUID(as_uuid=True), ForeignKey('lawyers.lawyer_id'), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    
    # Avaliação
    stars = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    
    # Data
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relacionamentos
    order = relationship("Order", foreign_keys=[order_id])
    lawyer = relationship("Lawyer", foreign_keys=[lawyer_id])
    user = relationship("User", foreign_keys=[user_id])
    
    def __repr__(self):
        return f"<Rating {self.stars} stars for Lawyer {self.lawyer_id}>"
    
    def to_dict(self):
        """Converte para dicionário"""
        return {
            "id": str(self.id),
            "order_id": str(self.order_id),
            "lawyer_id": str(self.lawyer_id),
            "stars": self.stars,
            "comment": self.comment,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }
