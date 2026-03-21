"""
Script to check what's in the payments table and verify field names match the admin endpoint.
"""
from database import SessionLocal
from modelos.pagamentos import Payment

def check():
    db = SessionLocal()
    try:
        total = db.query(Payment).count()
        print(f"Total payments in DB: {total}")
        
        sample = db.query(Payment).limit(3).all()
        for p in sample:
            print(f"\n--- Payment {p.id} ---")
            print(f"  transaction_id: {p.transaction_id}")
            print(f"  client_name: {p.client_name}")
            print(f"  amount: {p.amount}")
            print(f"  method: {p.method}")
            print(f"  status: {p.status}")
            print(f"  created_at: {p.created_at}")
    finally:
        db.close()

if __name__ == "__main__":
    check()
