"""
Rotas de Autenticação
POST /auth/login
POST /auth/register/user
POST /auth/register/lawyer
POST /auth/logout
GET /auth/verify
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta

from database import get_db
from modelos.usuarios import User, DocumentType, Gender
from modelos.advogados import Lawyer
from servicos.autenticacao import get_password_hash, verify_password, create_access_token, verify_token
from servicos.upload import save_upload_file
from utils.dependencias import get_current_user, security
from utils.helpers import validate_mozambique_phone, format_mozambique_phone

router = APIRouter(prefix="/auth", tags=["Autenticação"])


# Schemas Pydantic
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    success: bool
    token: str
    user: dict


class UserRegisterRequest(BaseModel):
    fullName: str
    birthDate: str
    nationality: str
    gender: Optional[str] = None
    documentType: str
    documentNumber: str
    phoneNumber: str
    email: EmailStr
    password: str
    neighborhood: Optional[str] = None
    city: Optional[str] = None
    country: str = "Moçambique"


# Endpoints

@router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Autentica usuário ou advogado e retorna token JWT
    """
    # Tentar encontrar como usuário
    user = db.query(User).filter(User.email == request.email).first()
    
    if user:
        # Verificar senha
        if not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Usuário inativo"
            )
        
        # Atualizar último login
        user.last_login = datetime.utcnow()
        db.commit()
        
        # Criar token
        token_data = {
            "sub": str(user.id),
            "role": "admin" if user.is_admin else "user"
        }
        token = create_access_token(token_data)
        
        return {
            "success": True,
            "token": token,
            "user": user.to_dict()
        }
    
    # Tentar encontrar como advogado
    lawyer = db.query(Lawyer).filter(Lawyer.professional_email == request.email).first()
    
    if lawyer:
        # Verificar senha
        if not verify_password(request.password, lawyer.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )
        
        if not lawyer.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Advogado inativo"
            )
        
        # Criar token
        token_data = {
            "sub": str(lawyer.lawyer_id),
            "role": "lawyer"
        }
        token = create_access_token(token_data)
        
        return {
            "success": True,
            "token": token,
            "user": {
                **lawyer.to_dict(),
                "role": "lawyer"
            }
        }
    
    # Nenhum encontrado
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Email ou senha incorretos"
    )


@router.post("/register/user")
async def register_user(
    request: UserRegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Registra um novo usuário
    """
    # Verificar se email já existe
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado"
        )
    
    # Verificar se documento já existe
    existing_doc = db.query(User).filter(User.document_number == request.documentNumber).first()
    if existing_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Documento já cadastrado"
        )
    
    # Validar telefone
    if not validate_mozambique_phone(request.phoneNumber):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Número de telefone inválido"
        )
    
    # Criar usuário
    new_user = User(
        full_name=request.fullName,
        birth_date=datetime.fromisoformat(request.birthDate),
        nationality=request.nationality,
        gender=Gender(request.gender) if request.gender else None,
        document_type=DocumentType(request.documentType),
        document_number=request.documentNumber,
        phone_number=format_mozambique_phone(request.phoneNumber),
        email=request.email,
        password_hash=get_password_hash(request.password),
        address={
            "neighborhood": request.neighborhood,
            "city": request.city,
            "country": request.country
        } if request.neighborhood or request.city else None
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Criar token
    token_data = {"sub": str(new_user.id), "role": "user"}
    token = create_access_token(token_data)
    
    return {
        "success": True,
        "message": "Usuário registrado com sucesso",
        "userId": str(new_user.id),
        "token": token
    }


@router.post("/register/lawyer")
async def register_lawyer(
    fullName: str = Form(...),
    birthDate: str = Form(...),
    nationality: str = Form(...),
    documentType: str = Form(...),
    documentNumber: str = Form(...),
    documentIssueDate: str = Form(...),
    documentExpiryDate: str = Form(...),
    oamNumber: str = Form(...),
    oamRegistrationYear: int = Form(...),
    specializations: str = Form(...),  # JSON string array
    professionalEmail: EmailStr = Form(...),
    professionalPhone: str = Form(...),
    officeAddress: str = Form(...),
    city: str = Form(...),
    province: str = Form(...),
    password: str = Form(...),
    termsAccepted: bool = Form(...),
    legalDeclaration: bool = Form(...),
    verificationAuthorization: bool = Form(...),
    documentFile: UploadFile = File(...),
    oamCardFile: UploadFile = File(...),
    cvFile: UploadFile = File(...),
    additionalDocs: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db)
):
    """
    Registra um novo advogado (requer verificação posterior)
    """
    import json
    
    # Verificar se email já existe
    existing_lawyer = db.query(Lawyer).filter(Lawyer.professional_email == professionalEmail).first()
    if existing_lawyer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado"
        )
    
    # Verificar OAM
    existing_oam = db.query(Lawyer).filter(Lawyer.oam_number == oamNumber).first()
    if existing_oam:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Número OAM já cadastrado"
        )
    
    # Upload de arquivos
    document_url = await save_upload_file(documentFile, "documents")
    oam_card_url = await save_upload_file(oamCardFile, "oam_cards")
    cv_url = await save_upload_file(cvFile, "cvs")
    
    additional_urls = []
    if additionalDocs:
        for doc in additionalDocs:
            url = await save_upload_file(doc, "additional")
            if url:
                additional_urls.append(url)
    
    # Parse specializations
    specs_list = json.loads(specializations)
    
    # Criar advogado
    new_lawyer = Lawyer(
        nome=fullName,
        birth_date=datetime.fromisoformat(birthDate),
        nationality=nationality,
        document_type=documentType,
        document_number=documentNumber,
        document_issue_date=datetime.fromisoformat(documentIssueDate),
        document_expiry_date=datetime.fromisoformat(documentExpiryDate),
        document_file_url=document_url,
        oam_number=oamNumber,
        oam_registration_year=oamRegistrationYear,
        oam_card_file_url=oam_card_url,
        especialidade=specs_list[0] if specs_list else "Geral",
        specializations=specs_list,
        cv_file_url=cv_url,
        additional_docs_urls=additional_urls if additional_urls else None,
        professional_email=professionalEmail,
        professional_phone=format_mozambique_phone(professionalPhone),
        phone_number=format_mozambique_phone(professionalPhone),
        office_address=officeAddress,
        city=city,
        province=province,
        password_hash=get_password_hash(password),
        terms_accepted=termsAccepted,
        legal_declaration=legalDeclaration,
        verification_authorization=verificationAuthorization,
        verification_status="pending_verification"
    )
    
    db.add(new_lawyer)
    db.commit()
    db.refresh(new_lawyer)
    
    return {
        "success": True,
        "message": "Registro submetido. Aguardando verificação da OAM.",
        "lawyerId": str(new_lawyer.lawyer_id),
        "status": "pending_verification"
    }


@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user)
):
    """
    Logout (no servidor, apenas invalida token no cliente)
    """
    return {
        "success": True,
        "message": "Logout realizado com sucesso"
    }


@router.get("/verify")
async def verify_token_endpoint(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Verifica se o token é válido
    """
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado"
        )
    
    user_id = payload.get("sub")
    role = payload.get("role", "user")
    
    return {
        "success": True,
        "valid": True,
        "user": {
            "id": user_id,
            "role": role
        }
    }
