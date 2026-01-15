"""
Serviço de Upload de Arquivos
"""
import os
import uuid
from fastapi import UploadFile
from typing import Optional
from config import settings
import aiofiles


async def save_upload_file(
    file: UploadFile,
    subfolder: str = ""
) -> Optional[str]:
    """
    Salva arquivo enviado e retorna a URL
    
    Args:
        file: Arquivo do FastAPI
        subfolder: Subpasta dentro de uploads/ (ex: "documents", "avatars")
    
    Returns:
        URL do arquivo salvo ou None em caso de erro
    """
    try:
        # Validar extensão
        file_ext = file.filename.split(".")[-1].lower()
        if file_ext not in settings.ALLOWED_EXTENSIONS:
            raise ValueError(f"Extensão {file_ext} não permitida")
        
        # Gerar nome único
        unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
        
        # Criar caminho completo
        upload_path = os.path.join(settings.UPLOAD_DIR, subfolder)
        os.makedirs(upload_path, exist_ok=True)
        
        file_path = os.path.join(upload_path, unique_filename)
        
        # Salvar arquivo
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            
            # Validar tamanho
            if len(content) > settings.MAX_UPLOAD_SIZE:
                raise ValueError(f"Arquivo muito grande. Máximo: {settings.MAX_UPLOAD_SIZE} bytes")
            
            await f.write(content)
        
        # Retornar URL relativa
        relative_path = os.path.join(subfolder, unique_filename).replace("\\", "/")
        return f"/uploads/{relative_path}"
        
    except Exception as e:
        print(f"Erro ao salvar arquivo: {e}")
        return None


def delete_file(file_url: str) -> bool:
    """
    Deleta um arquivo do sistema
    
    Args:
        file_url: URL do arquivo (ex: /uploads/documents/abc123.pdf)
    
    Returns:
        True se deletado com sucesso, False caso contrário
    """
    try:
        # Extrair caminho do arquivo
        file_path = file_url.replace("/uploads/", "")
        full_path = os.path.join(settings.UPLOAD_DIR, file_path)
        
        if os.path.exists(full_path):
            os.remove(full_path)
            return True
        return False
        
    except Exception as e:
        print(f"Erro ao deletar arquivo: {e}")
        return False
