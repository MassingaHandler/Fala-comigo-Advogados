
import sys
import os
from datetime import datetime

# Adicionar o diretório atual ao path para importações
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from database import SessionLocal
    from modelos.usuarios import User, DocumentType
    from servicos.autenticacao import get_password_hash
    print("Dependências carregadas com sucesso.")
except ImportError as e:
    print(f"Erro ao importar dependências: {e}")
    sys.exit(1)

def create_admin():
    db = SessionLocal()
    try:
        email = "admin@falacomigo.mz"
        existing_admin = db.query(User).filter(User.email == email).first()
        
        if existing_admin:
            print(f"Usuário {email} já existe. Atualizando para admin...")
            existing_admin.is_admin = True
            existing_admin.is_active = True
            db.commit()
            print("Usuário atualizado com sucesso.")
            return

        print(f"Criando novo usuário admin: {email}")
        admin = User(
            full_name="Administrador do Sistema",
            birth_date=datetime(1980, 1, 1),
            nationality="Moçambicana",
            document_type=DocumentType.BI,
            document_number="987654321A",
            phone_number="+258 84 000 0000",
            email=email,
            password_hash=get_password_hash("admin123"),
            is_admin=True,
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.add(admin)
        db.commit()
        print(f"ADMINISTRADOR {email} criado com sucesso!")
        
    except Exception as e:
        print(f"Erro ao criar admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
