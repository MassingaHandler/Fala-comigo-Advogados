"""
Script para buscar dados reais do cliente Patricio Massinga.
"""
from database import SessionLocal
from modelos.usuarios import User
from modelos.consultas import Order
from modelos.pagamentos import Payment

def check():
    db = SessionLocal()
    try:
        # Buscar usuario
        user = db.query(User).filter(
            User.full_name.ilike("%Massinga%") | User.email.ilike("%Massinga%") | User.full_name.ilike("%Patricio%")
        ).first()

        if not user:
            print("Usuario nao encontrado. Listando todos os usuarios:")
            users = db.query(User).all()
            for u in users:
                print(f"  - {u.id} | {u.full_name} | {u.email}")
            return

        print(f"Usuario encontrado: {user.full_name} | {user.email} | ID: {user.id}")

        # Buscar casos
        orders = db.query(Order).filter(Order.user_id == user.id).all()
        print(f"\nCasos ({len(orders)}):")
        order_ids = []
        for o in orders:
            print(f"  - {o.human_id} | status={o.status} | payment_status={o.payment_status} | payment_method={o.payment_method} | txn={o.transaction_reference}")
            order_ids.append(o.id)

        # Buscar pagamentos por client_name / order
        payments_by_name = db.query(Payment).filter(Payment.client_name.ilike(f"%{user.full_name.split()[0]}%")).all()
        payments_by_order = []
        if order_ids:
            payments_by_order = db.query(Payment).filter(Payment.order_id.in_(order_ids)).all()

        all_payments = list({p.id: p for p in payments_by_name + payments_by_order}.values())
        print(f"\nPagamentos ({len(all_payments)}):")
        for p in all_payments:
            print(f"  - {p.id} | txn={p.transaction_id} | amount={p.amount} | method={p.method} | status={p.status}")

    finally:
        db.close()

if __name__ == "__main__":
    check()
