"""
Funções Auxiliares
"""
import re
from datetime import datetime
from typing import Optional


def generate_human_id(prefix: str = "FC") -> str:
    """
    Gera ID legível para humanos (ex: FC-123456)
    
    Args:
        prefix: Prefixo do ID (default: "FC")
    
    Returns:
        ID no formato PREFIX-XXXXXX
    """
    timestamp = datetime.now().strftime("%y%m%d%H%M%S")
    return f"{prefix}-{timestamp[-6:]}"


def validate_mozambique_phone(phone: str) -> bool:
    """
    Valida número de telefone moçambicano
    
    Formatos aceitos:
    - +258 84 123 4567
    - 258841234567
    - 84 123 4567
    - 841234567
    
    Args:
        phone: Número de telefone
    
    Returns:
        True se válido, False caso contrário
    """
    # Remover espaços e caracteres especiais
    clean_phone = re.sub(r'[^\d]', '', phone)
    
    # Verificar se começa com 258 (código do país)
    if clean_phone.startswith('258'):
        clean_phone = clean_phone[3:]
    
    # Verificar se tem 9 dígitos e começa com 8
    if len(clean_phone) == 9 and clean_phone.startswith('8'):
        return True
    
    return False


def format_mozambique_phone(phone: str) -> str:
    """
    Formata número de telefone moçambicano para padrão internacional
    
    Args:
        phone: Número de telefone
    
    Returns:
        Número formatado (+258 XX XXX XXXX)
    """
    # Remover espaços e caracteres especiais
    clean_phone = re.sub(r'[^\d]', '', phone)
    
    # Remover código do país se presente
    if clean_phone.startswith('258'):
        clean_phone = clean_phone[3:]
    
    # Formatar
    if len(clean_phone) == 9:
        return f"+258 {clean_phone[:2]} {clean_phone[2:5]} {clean_phone[5:]}"
    
    return phone


def validate_email(email: str) -> bool:
    """
    Valida formato de email
    
    Args:
        email: Endereço de email
    
    Returns:
        True se válido, False caso contrário
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def calculate_age(birth_date: datetime) -> int:
    """
    Calcula idade a partir da data de nascimento
    
    Args:
        birth_date: Data de nascimento
    
    Returns:
        Idade em anos
    """
    today = datetime.now()
    age = today.year - birth_date.year
    
    # Ajustar se ainda não fez aniversário este ano
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    
    return age
