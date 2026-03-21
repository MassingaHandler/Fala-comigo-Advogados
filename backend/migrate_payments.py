"""
Script para migrar pagamentos confirmados das orders para a tabela payments.
Cria registos de pagamento para todas as orders que tem payment_status=confirmed
mas nao tem registo correspondente na tabela payments.
"""
from database import SessionLocal
from modelos.pagamentos import Payment
from modelos.consultas import Order
from modelos.usuarios import User
import uuid
from datetime import datetime

# Mapeamento de topic -> valor em MT
TOPIC_PRICES = {
    "Familia": 750.0,
    "Trabalho": 750.0,
    "Terra/DUAT": 1000.0,
    "Consumo": 500.0,
    "Outros": 500.0,
    "familia": 750.0,
    "trabalho": 750.0,
    "terra": 1000.0,
    "consumo": 500.0,
    "outros": 500.0,
}

PKG_PRICES = {
    "basic": 500.0,
    "standard": 750.0,
    "premium": 1500.0,
    "basico": 500.0,
    "padrao": 750.0,
}

def get_price(order):
    """Estimar preco baseado no package ou topic."""
    if order.pkg:
        pkg_lower = order.pkg.lower()
        for key, price in PKG_PRICES.items():
            if key in pkg_lower:
                return price
    if order.topic:
        topic_lower = order.topic.lower()
        for key, price in TOPIC_PRICES.items():
            if key in topic_lower:
                return price
    return 750.0  # Preco padrao

def migrate():
    db = SessionLocal()
    try:
        # Buscar todas as orders confirmadas
        confirmed_orders = db.query(Order).filter(
            Order.payment_status == "confirmed"
        ).all()

        print(f"Orders confirmadas encontradas: {len(confirmed_orders)}")

        created = 0
        skipped = 0

        for order in confirmed_orders:
            # Verificar se ja existe pagamento para esta order
            existing = db.query(Payment).filter(Payment.order_id == order.id).first()
            if existing:
                skipped += 1
                continue

            # Buscar utilizador
            user = db.query(User).filter(User.id == order.user_id).first()
            client_name = user.full_name if user else "Cliente"
            client_phone = order.client_phone_number or (user.phone_number if user else "N/A")

            # Gerar transaction_id baseado no txn da order ou gerar novo
            if order.transaction_reference:
                txn_id = order.transaction_reference
            else:
                txn_id = f"AUTO-{str(uuid.uuid4())[:8].upper()}"

            amount = get_price(order)
            method = order.payment_method if order.payment_method and order.payment_method != "auto" else "mpesa"

            payment = Payment(
                transaction_id=txn_id,
                order_id=order.id,
                client_name=client_name,
                client_phone=client_phone or "N/A",
                amount=amount,
                method=method,
                status="completed",
                created_at=order.created_at or datetime.utcnow(),
                confirmed_at=order.updated_at or datetime.utcnow()
            )
            db.add(payment)
            created += 1
            print(f"  Criado: {order.human_id} | {client_name} | {amount} MT | {method}")

        if created > 0:
            db.commit()
            print(f"\nMigracao concluida: {created} pagamentos criados, {skipped} ja existiam.")
        else:
            print(f"\nNenhum pagamento novo para criar. {skipped} ja existiam.")

    except Exception as e:
        db.rollback()
        print(f"ERRO: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
