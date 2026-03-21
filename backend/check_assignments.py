from database import SessionLocal
from modelos.consultas import Assignment, Order
from modelos.advogados import Lawyer

db = SessionLocal()

print("=== ADVOGADOS ===")
lawyers = db.query(Lawyer).all()
print(f"Total: {len(lawyers)}")
for l in lawyers:
    print(f"  - {l.lawyer_id}: {l.nome} ({l.professional_email})")

print("\n=== ASSIGNMENTS ===")
assignments = db.query(Assignment).all()
print(f"Total: {len(assignments)}")
for a in assignments:
    order = db.query(Order).filter(Order.id == a.order_id).first()
    print(f"  - Assignment {a.assignment_id}")
    print(f"    Order: {order.human_id if order else 'N/A'}")
    print(f"    Lawyer: {a.lawyer_id}")
    print(f"    Assigned at: {a.assigned_at}")

print("\n=== ORDERS ===")
orders = db.query(Order).all()
print(f"Total: {len(orders)}")
for o in orders:
    print(f"  - {o.human_id}: {o.topic.get('name', 'N/A')} - Status: {o.status}")

db.close()
