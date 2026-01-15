"""
Rotas de Chat e Mensagens
POST /consultations/{orderId}/messages
POST /consultations/{orderId}/documents
GET /consultations/{orderId}/messages
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
from modelos.mensagens import ChatMessage, Document
from modelos.consultas import Order
from servicos.upload import save_upload_file
from utils.dependencias import get_current_user

router = APIRouter(prefix="/consultations", tags=["Chat"])


class SendMessageRequest(BaseModel):
    sender_id: str
    text: str
    type: str = "text"


@router.post("/{order_id}/messages")
async def send_message(
    order_id: str,
    request: SendMessageRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enviar mensagem"""
    # Verificar se order existe
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta não encontrada"
        )
    
    # Determinar sender
    sender = "user" if str(current_user.id) == request.sender_id else "lawyer"
    
    # Criar mensagem
    message = ChatMessage(
        order_id=order_id,
        sender_id=request.sender_id,
        sender=sender,
        text=request.text,
        type=request.type
    )
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return {
        "success": True,
        "message": message.to_dict()
    }


@router.post("/{order_id}/documents")
async def upload_document(
    order_id: str,
    sender_id: str,
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enviar documento"""
    # Verificar se order existe
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta não encontrada"
        )
    
    # Upload do arquivo
    file_url = await save_upload_file(file, "chat_documents")
    if not file_url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao fazer upload do arquivo"
        )
    
    # Criar documento
    document = Document(
        order_id=order_id,
        filename=file.filename,
        url=file_url,
        file_type=file.content_type,
        uploaded_by=sender_id
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    # Criar mensagem de documento
    sender = "user" if str(current_user.id) == sender_id else "lawyer"
    message = ChatMessage(
        order_id=order_id,
        sender_id=sender_id,
        sender=sender,
        text=f"Documento enviado: {file.filename}",
        type="document"
    )
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return {
        "success": True,
        "document": document.to_dict(),
        "message": message.to_dict()
    }


@router.get("/{order_id}/messages")
async def get_messages(
    order_id: str,
    limit: int = 50,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obter mensagens da consulta"""
    # Verificar se order existe
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta não encontrada"
        )
    
    # Buscar mensagens
    messages = db.query(ChatMessage).filter(
        ChatMessage.order_id == order_id
    ).order_by(ChatMessage.timestamp.asc()).limit(limit).all()
    
    return {
        "success": True,
        "messages": [msg.to_dict() for msg in messages]
    }
