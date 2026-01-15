"""
Serviço de Integração M-Pesa (Vodacom Moçambique)
"""
import httpx
import base64
from typing import Dict, Optional
from config import settings
from datetime import datetime
import uuid


async def generate_bearer_token() -> str:
    """
    Gera token de autenticação para API M-Pesa
    
    NOTA: Em produção, implementar geração real do token
    usando API Key e Public Key da Vodacom
    """
    # TODO: Implementar geração real do token
    # Por enquanto, retorna um token mock
    api_key = settings.MPESA_API_KEY
    return f"Bearer {api_key}"


async def initiate_mpesa_payment(
    phone_number: str,
    amount: float,
    reference: str
) -> Dict:
    """
    Inicia um pagamento M-Pesa (C2B)
    
    Args:
        phone_number: Número do cliente (formato: 258841234567)
        amount: Valor em MZN
        reference: Referência da transação (ex: FC-123456)
    
    Returns:
        Dict com resultado da transação
    """
    # Limpar número de telefone
    clean_number = phone_number.replace("+", "").replace(" ", "")
    
    # Validar número Vodacom
    if not (clean_number.startswith("25884") or clean_number.startswith("25885")):
        return {
            "success": False,
            "message": "Número inválido. Use um número Vodacom (84/85)."
        }
    
    # Gerar ID de transação
    transaction_id = f"VM{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:6].upper()}"
    
    # Em ambiente de desenvolvimento/sandbox, simular sucesso
    if settings.ENVIRONMENT == "development":
        return {
            "success": True,
            "transactionId": transaction_id,
            "message": "Pedido enviado para o telemóvel. Insira o PIN.",
            "status": "pending"
        }
    
    # Em produção, fazer chamada real à API M-Pesa
    try:
        bearer_token = await generate_bearer_token()
        
        headers = {
            "Authorization": bearer_token,
            "Content-Type": "application/json"
        }
        
        payload = {
            "input_TransactionReference": reference,
            "input_CustomerMSISDN": clean_number,
            "input_Amount": str(amount),
            "input_ThirdPartyReference": transaction_id,
            "input_ServiceProviderCode": settings.MPESA_SERVICE_PROVIDER_CODE
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.MPESA_BASE_URL}/ipg/v1x/c2bPayment/singleStage/",
                headers=headers,
                json=payload,
                timeout=30.0
            )
            
            if response.status_code == 201:
                data = response.json()
                return {
                    "success": True,
                    "transactionId": transaction_id,
                    "message": "Pedido enviado para o telemóvel.",
                    "status": "pending",
                    "mpesaResponse": data
                }
            else:
                return {
                    "success": False,
                    "message": f"Erro ao processar pagamento: {response.text}"
                }
                
    except Exception as e:
        return {
            "success": False,
            "message": f"Erro ao conectar com M-Pesa: {str(e)}"
        }


async def verify_mpesa_payment(transaction_id: str) -> Dict:
    """
    Verifica o status de um pagamento M-Pesa
    
    Args:
        transaction_id: ID da transação M-Pesa
    
    Returns:
        Dict com status do pagamento
    """
    # Em desenvolvimento, simular confirmação após delay
    if settings.ENVIRONMENT == "development":
        return {
            "success": True,
            "transactionId": transaction_id,
            "status": "confirmed",
            "message": "Pagamento confirmado (simulação)"
        }
    
    # Em produção, consultar API M-Pesa
    try:
        bearer_token = await generate_bearer_token()
        
        headers = {
            "Authorization": bearer_token,
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.MPESA_BASE_URL}/ipg/v1x/queryTransactionStatus/",
                headers=headers,
                params={"input_QueryReference": transaction_id},
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "transactionId": transaction_id,
                    "status": data.get("output_ResponseCode") == "INS-0" and "confirmed" or "pending",
                    "mpesaResponse": data
                }
            else:
                return {
                    "success": False,
                    "message": f"Erro ao verificar pagamento: {response.text}"
                }
                
    except Exception as e:
        return {
            "success": False,
            "message": f"Erro ao conectar com M-Pesa: {str(e)}"
        }


def process_mpesa_callback(callback_data: Dict) -> Dict:
    """
    Processa callback da Vodacom M-Pesa
    
    Args:
        callback_data: Dados recebidos do webhook
    
    Returns:
        Dict com informações processadas
    """
    response_code = callback_data.get("output_ResponseCode")
    transaction_id = callback_data.get("output_TransactionID")
    reference = callback_data.get("output_ThirdPartyReference")
    
    if response_code == "INS-0":
        return {
            "success": True,
            "status": "confirmed",
            "transactionId": transaction_id,
            "reference": reference,
            "message": "Pagamento confirmado"
        }
    else:
        return {
            "success": False,
            "status": "failed",
            "transactionId": transaction_id,
            "reference": reference,
            "message": callback_data.get("output_ResponseDesc", "Pagamento falhou")
        }
