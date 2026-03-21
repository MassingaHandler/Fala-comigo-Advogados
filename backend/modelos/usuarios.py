"""
Modelo de Usuários
"""
from sqlalchemy import Column, String, DateTime, Boolean, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid
from datetime import datetime
import enum


class DocumentType(str, enum.Enum):
    """Tipos de documento"""
    BI = "bi"
    PASSAPORTE = "passaporte"
    CARTA_CONDUCAO = "carta_conducao"


class Gender(str, enum.Enum):
    """Gênero"""
    MASCULINO = "masculino"
    FEMININO = "feminino"
    OUTRO = "outro"


class KYCStatus(str, enum.Enum):
    """Status da Verificação de KYC"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    NOT_SUBMITTED = "not_submitted"


class User(Base):
    """Modelo de Usuário"""
    __tablename__ = "users"
    
    # Identificação
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Dados Pessoais
    full_name = Column(String(255), nullable=False)
    birth_date = Column(DateTime, nullable=False)
    nationality = Column(String(100), nullable=False)
    gender = Column(Enum(Gender), nullable=True)
    occupation = Column(String(100), nullable=True)
    
    # Identificação & KYC
    document_type = Column(Enum(DocumentType), nullable=False)
    document_number = Column(String(50), unique=True, nullable=False, index=True)
    nuit = Column(String(20), unique=True, nullable=True, index=True)
    
    document_issue_date = Column(DateTime, nullable=True)
    document_expiry_date = Column(DateTime, nullable=True)
    
    # Documentos (URLs)
    document_front_url = Column(String(500), nullable=True)
    document_back_url = Column(String(500), nullable=True)
    selfie_url = Column(String(500), nullable=True)
    
    # KYC Status
    kyc_status = Column(Enum(KYCStatus), default=KYCStatus.NOT_SUBMITTED)
    kyc_notes = Column(String(500), nullable=True)
    kyc_verified_at = Column(DateTime, nullable=True)
    
    # Contato
    phone_number = Column(String(20), unique=True, nullable=False, index=True)
    phone_verified = Column(Boolean, default=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    email_verified = Column(Boolean, default=False)
    
    # Endereço (JSON)
    address = Column(JSON, nullable=True)
    # Exemplo: {"neighborhood": "Polana", "city": "Maputo", "country": "Moçambique", "street": "Av. Eduardo Mondlane"}
    
    # Segurança
    password_hash = Column(String(255), nullable=False)
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String(255), nullable=True)
    
    # Role (para diferenciar admin)
    is_admin = Column(Boolean, default=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<User {self.full_name} ({self.email})>"
    
    def to_dict(self):
        """Converte para dicionário (sem senha)"""
        return {
            "id": str(self.id),
            "fullName": self.full_name,
            "email": self.email,
            "phoneNumber": self.phone_number,
            "birthDate": self.birth_date.isoformat() if self.birth_date else None,
            "nationality": self.nationality,
            "gender": self.gender.value if self.gender else None,
            "occupation": self.occupation,
            "documentType": self.document_type.value,
            "documentNumber": self.document_number,
            "nuit": self.nuit,
            "documentIssueDate": self.document_issue_date.isoformat() if self.document_issue_date else None,
            "documentExpiryDate": self.document_expiry_date.isoformat() if self.document_expiry_date else None,
            "documentFrontUrl": self.document_front_url,
            "documentBackUrl": self.document_back_url,
            "selfieUrl": self.selfie_url,
            "kycStatus": self.kyc_status.value if self.kyc_status else "not_submitted",
            "kycNotes": self.kyc_notes,
            "kycVerifiedAt": self.kyc_verified_at.isoformat() if self.kyc_verified_at else None,
            "emailVerified": self.email_verified,
            "phoneVerified": self.phone_verified,
            "address": self.address,
            "isAdmin": self.is_admin,
            "isActive": self.is_active,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "lastLogin": self.last_login.isoformat() if self.last_login else None
        }
