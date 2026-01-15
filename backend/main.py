"""
Aplicação Principal - Fala Comigo Advogado API
Backend com FastAPI e PostgreSQL
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config import settings
from database import init_db
import os

# Importar rotas (serão criadas)
# from rotas import autenticacao, usuarios, advogados, consultas, pagamentos, chat, avaliacoes, admin

# Criar aplicação FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="API para o sistema Fala Comigo Advogado - Advocacia Digital Integrada",
    docs_url=f"{settings.API_PREFIX}/docs",
    redoc_url=f"{settings.API_PREFIX}/redoc",
    openapi_url=f"{settings.API_PREFIX}/openapi.json"
)

# Configurar CORS - IMPORTANTE: Deve vir ANTES de registrar as rotas
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas as origens em desenvolvimento
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Servir arquivos estáticos (uploads)
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.on_event("startup")
async def startup_event():
    """Executado ao iniciar a aplicação"""
    print("🚀 Iniciando Fala Comigo Advogado API...")
    print(f"📊 Ambiente: {settings.ENVIRONMENT}")
    print(f"🔧 Debug: {settings.DEBUG}")
    
    # Inicializar banco de dados
    init_db()
    
    print("✅ API iniciada com sucesso!")
    print(f"📖 Documentação: http://localhost:8000{settings.API_PREFIX}/docs")


@app.get("/")
async def root():
    """Endpoint raiz"""
    return {
        "message": "Fala Comigo Advogado API",
        "version": "1.0.0",
        "status": "online",
        "docs": f"{settings.API_PREFIX}/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT
    }


# Registrar rotas
from rotas import (
    auth_router,
    users_router,
    lawyers_router,
    consultations_router,
    payments_router,
    chat_router,
    ratings_router,
    admin_router
)

app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(users_router, prefix=settings.API_PREFIX)
app.include_router(lawyers_router, prefix=settings.API_PREFIX)
app.include_router(consultations_router, prefix=settings.API_PREFIX)
app.include_router(payments_router, prefix=settings.API_PREFIX)
app.include_router(chat_router, prefix=settings.API_PREFIX)
app.include_router(ratings_router, prefix=settings.API_PREFIX)
app.include_router(admin_router, prefix=settings.API_PREFIX)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
