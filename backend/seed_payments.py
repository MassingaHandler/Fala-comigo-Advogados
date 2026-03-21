"""
Script para criar pagamentos de teste na base de dados.
Execute: python seed_payments.py
"""
from database import SessionLocal
from modelos.pagamentos import Payment
from modelos.consultas import Order
import uuid
from datetime import datetime, timedelta
import random

def seed():
    db = SessionLocal()
    try:
        # Verificar se já existem pagamentos
        existing = db.query(Payment).count()
        if existing > 0:
            print(f"Já existem {existing} pagamentos na base de dados. Nenhum dado foi adicionado.")
            return

        # Buscar orders existentes
        orders = db.query(Order).limit(10).all()
        if not orders:
            print("Nenhuma consulta encontrada. Crie algumas consultas primeiro.")
            return

        statuses = ["completed", "pending", "failed"]
        methods = ["mpesa"]
        clients = [
            ("João Silva", "84000001"),
            ("Maria Costa", "84000002"),
            ("Pedro Santos", "84000003"),
            ("Ana Moreira", "84000004"),
            ("Carlos Nhamussua", "84000005"),
        ]

        payments_created = 0
        for i, order in enumerate(orders[:5]):
            client_name, client_phone = clients[i % len(clients)]
            status = statuses[i % len(statuses)]
            amount = random.choice([500.0, 750.0, 1000.0, 1500.0, 2000.0])
            days_ago = random.randint(1, 30)

            payment = Payment(
                transaction_id=f"MPESA-TEST-{str(uuid.uuid4())[:8].upper()}",
                order_id=order.id,
                client_name=client_name,
                client_phone=client_phone + str(i),
                amount=amount,
                method="mpesa",
                status=status,
                created_at=datetime.utcnow() - timedelta(days=days_ago),
                confirmed_at=datetime.utcnow() - timedelta(days=days_ago) if status == "completed" else None
            )
            db.add(payment)
            payments_created += 1
            print(f"OK: {client_name} - {amount} MT ({status})")

        db.commit()
        print(f"\n{payments_created} pagamentos de teste criados com sucesso!")

    except Exception as e:
        db.rollback()
        print(f"ERRO: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()
