"""
Configuração do Backend - Fala Comigo Advogado
"""
from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union
import os


class Settings(BaseSettings):
    """Configurações da aplicação"""
    
    # Banco de Dados
    DATABASE_URL: str
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "fala_comigo_db"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "3489"
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 horas
    
    # API
    API_VERSION: str = "v1"
    API_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Fala Comigo Advogado API"
    
    # CORS
    BACKEND_CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000"
    ]
    
    # M-Pesa
    MPESA_API_KEY: str = ""
    MPESA_PUBLIC_KEY: str = ""
    MPESA_SERVICE_PROVIDER_CODE: str = "171717"
    MPESA_BASE_URL: str = "https://api.sandbox.vm.co.mz:18352"
    MPESA_CALLBACK_URL: str = ""
    
    # Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 5242880  # 5MB
    ALLOWED_EXTENSIONS: Union[List[str], str] = ["pdf", "jpg", "jpeg", "png", "docx"]
    
    # Email (opcional)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = ""
    
    # Ambiente
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    @field_validator('BACKEND_CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from string or list"""
        if isinstance(v, str):
            # Se for string, pode ser JSON ou separado por vírgula
            v = v.strip()
            if v.startswith('['):
                # Tentar parse como JSON
                import json
                try:
                    return json.loads(v)
                except:
                    pass
            # Parse como CSV
            return [origin.strip() for origin in v.split(',') if origin.strip()]
        return v
    
    @field_validator('ALLOWED_EXTENSIONS', mode='before')
    @classmethod
    def parse_allowed_extensions(cls, v):
        """Parse allowed extensions from string or list"""
        if isinstance(v, str):
            # Parse como CSV
            return [ext.strip() for ext in v.split(',') if ext.strip()]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Instância global de configurações
settings = Settings()

# Criar diretório de uploads se não existir
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
