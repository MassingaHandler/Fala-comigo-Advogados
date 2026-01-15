"""
Utilitários e Dependencies
"""
from .dependencias import get_current_user, get_current_admin, get_current_lawyer
from .helpers import generate_human_id, validate_mozambique_phone

__all__ = [
    "get_current_user",
    "get_current_admin",
    "get_current_lawyer",
    "generate_human_id",
    "validate_mozambique_phone"
]
