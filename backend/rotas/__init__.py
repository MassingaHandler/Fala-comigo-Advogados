"""
Rotas da API - Fala Comigo Advogado
"""
from .autenticacao import router as auth_router
from .usuarios import router as users_router
from .advogados import router as lawyers_router
from .consultas import router as consultations_router
from .pagamentos import router as payments_router
from .chat import router as chat_router
from .avaliacoes import router as ratings_router
from .admin import router as admin_router

__all__ = [
    "auth_router",
    "users_router",
    "lawyers_router",
    "consultations_router",
    "payments_router",
    "chat_router",
    "ratings_router",
    "admin_router"
]
