"""
Fix payment client names to use real user data from orders.
"""
from database import SessionLocal
from modelos.pagamentos import Payment
from modelos.consultas import Order
from modelos.usuarios import User

def fix():
    db = SessionLocal()
    try:
        payments = db.query(Payment).all()
        fixed = 0
        for p in payments:
            order = db.query(Order).filter(Order.id == p.order_id).first()
            if not order:
                continue
            user = db.query(User).filter(User.id == order.user_id).first()
            if not user:
                continue
            real_name = user.full_name
            real_phone = order.client_phone_number or user.phone_number or p.client_phone
            real_method = order.payment_method if order.payment_method and order.payment_method != "auto" else "mpesa"
            
            if p.client_name != real_name:
                print(f"Fix: '{p.client_name}' -> '{real_name}' (order {order.human_id})")
                p.client_name = real_name
                p.client_phone = real_phone or p.client_phone
                p.method = real_method
                fixed += 1

        db.commit()
        print(f"\nFixed {fixed} payment records.")
    except Exception as e:
        db.rollback()
        print(f"ERRO: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    fix()
