"""
Modelos de Mensagens e Documentos
"""
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime


class ChatMessage(Base):
    """Modelo de Mensagem de Chat"""
    __tablename__ = "chat_messages"
    
    # Identificação
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Relacionamento com Order
    order_id = Column(UUID(as_uuid=True), ForeignKey('orders.id'), nullable=False, index=True)
    
    # Remetente
    sender_id = Column(UUID(as_uuid=True), nullable=False)
    sender = Column(String(20), nullable=False)  # user | lawyer
    
    # Conteúdo
    text = Column(Text, nullable=False)
    type = Column(String(20), nullable=False)  # text | document
    
    # Timestamp
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relacionamento
    order = relationship("Order", foreign_keys=[order_id])
    
    def __repr__(self):
        return f"<ChatMessage {self.id} - {self.sender}>"
    
    def to_dict(self):
        """Converte para dicionário"""
        return {
            "id": str(self.id),
            "sender_id": str(self.sender_id),
            "sender": self.sender,
            "text": self.text,
            "type": self.type,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }


class Document(Base):
    """Modelo de Documento"""
    __tablename__ = "documents"
    
    # Identificação
    document_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Relacionamento com Order
    order_id = Column(UUID(as_uuid=True), ForeignKey('orders.id'), nullable=False, index=True)
    
    # Relacionamento com Mensagem (opcional)
    message_id = Column(UUID(as_uuid=True), ForeignKey('chat_messages.id'), nullable=True)
    
    # Informações do Arquivo
    filename = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    file_size = Column(String(50), nullable=True)
    file_type = Column(String(50), nullable=True)
    
    # Uploader
    uploaded_by = Column(UUID(as_uuid=True), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relacionamentos
    order = relationship("Order", foreign_keys=[order_id])
    message = relationship("ChatMessage", foreign_keys=[message_id])
    
    def __repr__(self):
        return f"<Document {self.filename}>"
    
    def to_dict(self):
        """Converte para dicionário"""
        return {
            "document_id": str(self.document_id),
            "filename": self.filename,
            "url": self.url,
            "fileSize": self.file_size,
            "fileType": self.file_type,
            "uploadedAt": self.uploaded_at.isoformat() if self.uploaded_at else None
        }
