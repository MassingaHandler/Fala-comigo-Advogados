
from database import SessionLocal
from modelos.usuarios import User

def check():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "admin@falacomigo.mz").first()
        if user:
            print(f"User: {user.email}")
            print(f"Is Admin: {user.is_admin}")
            print(f"Is Active: {user.is_active}")
        else:
            print("Admin user not found in database")
    finally:
        db.close()

if __name__ == "__main__":
    check()
