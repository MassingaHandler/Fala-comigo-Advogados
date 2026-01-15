"""
Modelo de Advogados
"""
from sqlalchemy import Column, String, DateTime, Boolean, Integer, Float, Text, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid
from datetime import datetime
import enum


class VerificationStatus(str, enum.Enum):
    """Status de verificação do advogado"""
    PENDING_VERIFICATION = "pending_verification"
    VERIFIED = "verified"
    REJECTED = "rejected"


class Lawyer(Base):
    """Modelo de Advogado"""
    __tablename__ = "lawyers"
    
    # Identificação
    lawyer_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Dados Pessoais
    nome = Column(String(255), nullable=False)
    birth_date = Column(DateTime, nullable=False)
    nationality = Column(String(100), nullable=False)
    
    # Documento de Identificação
    document_type = Column(String(50), nullable=False)
    document_number = Column(String(50), unique=True, nullable=False)
    document_issue_date = Column(DateTime, nullable=False)
    document_expiry_date = Column(DateTime, nullable=False)
    document_file_url = Column(String(500), nullable=True)
    
    # Informação Profissional OAM
    oam_number = Column(String(20), unique=True, nullable=False, index=True)
    oam_registration_year = Column(Integer, nullable=False)
    oam_card_file_url = Column(String(500), nullable=True)
    
    # Especializações
    especialidade = Column(String(255), nullable=False)  # Especialidade principal
    specializations = Column(ARRAY(String), nullable=False)  # Array de especializações
    
    # CV e Documentos
    cv_file_url = Column(String(500), nullable=True)
    additional_docs_urls = Column(ARRAY(String), nullable=True)
    
    # Contato Profissional
    professional_email = Column(String(255), unique=True, nullable=False, index=True)
    professional_phone = Column(String(20), unique=True, nullable=False)
    phone_number = Column(String(20), nullable=True)  # Alias
    
    # Endereço do Escritório
    office_address = Column(String(500), nullable=False)
    city = Column(String(100), nullable=False)
    province = Column(String(100), nullable=False)
    
    # Avatar
    avatar_url = Column(String(500), nullable=True)
    
    # Status Online
    is_online = Column(Boolean, default=False)
    
    # Avaliações
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    cases_completed = Column(Integer, default=0)
    
    # Verificação
    verification_status = Column(String(50), default=VerificationStatus.PENDING_VERIFICATION.value)
    verification_notes = Column(Text, nullable=True)
    
    # Compliance
    terms_accepted = Column(Boolean, default=False)
    legal_declaration = Column(Boolean, default=False)
    verification_authorization = Column(Boolean, default=False)
    
    # Credenciais de Login
    password_hash = Column(String(255), nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<Lawyer {self.nome} - OAM {self.oam_number}>"
    
    def to_dict(self):
        """Converte para dicionário"""
        return {
            "lawyer_id": str(self.lawyer_id),
            "nome": self.nome,
            "especialidade": self.especialidade,
            "specializations": self.specializations,
            "avatarUrl": self.avatar_url,
            "phoneNumber": self.phone_number or self.professional_phone,
            "professionalEmail": self.professional_email,
            "professionalPhone": self.professional_phone,
            "oamNumber": self.oam_number,
            "oamRegistrationYear": self.oam_registration_year,
            "officeAddress": self.office_address,
            "city": self.city,
            "province": self.province,
            "isOnline": self.is_online,
            "rating": self.rating,
            "totalReviews": self.total_reviews,
            "casesCompleted": self.cases_completed,
            "verificationStatus": self.verification_status,
            "isActive": self.is_active,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }
