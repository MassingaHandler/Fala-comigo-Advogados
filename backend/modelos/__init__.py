"""
Modelos do Banco de Dados - Fala Comigo Advogado
"""
from .usuarios import User
from .advogados import Lawyer
from .consultas import Order, Assignment, Session
from .pagamentos import Payment
from .mensagens import ChatMessage, Document
from .avaliacoes import Rating

__all__ = [
    "User",
    "Lawyer",
    "Order",
    "Assignment",
    "Session",
    "Payment",
    "ChatMessage",
    "Document",
    "Rating"
]
