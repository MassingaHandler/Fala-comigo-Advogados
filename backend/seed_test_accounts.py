
import sys
import os
from datetime import datetime
import uuid

# Adicionar o diretório pai ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from modelos.usuarios import User, DocumentType, KYCStatus
from modelos.advogados import Lawyer
from servicos.autenticacao import get_password_hash

def seed_test_accounts():
    db = SessionLocal()
    try:
        # 1. Usuário Normal
        existing_user = db.query(User).filter(User.email == "teste@falacomigo.mz").first()
        if not existing_user:
            user = User(
                full_name="Usuário de Teste",
                birth_date=datetime(1990, 1, 1),
                nationality="Moçambicana",
                document_type=DocumentType.BI,
                document_number="123456789B",
                phone_number="+258 84 123 4567",
                email="teste@falacomigo.mz",
                password_hash=get_password_hash("teste123"),
                is_admin=False,
                is_active=True
            )
            db.add(user)
            print("USUARIO 'teste@falacomigo.mz' criado.")
        
        # 2. Administrador
        existing_admin = db.query(User).filter(User.email == "admin@falacomigo.mz").first()
        if not existing_admin:
            admin = User(
                full_name="Administrador do Sistema",
                birth_date=datetime(1980, 1, 1),
                nationality="Moçambicana",
                document_type=DocumentType.BI,
                document_number="987654321A",
                phone_number="+258 84 000 0000",
                email="admin@falacomigo.mz",
                password_hash=get_password_hash("admin123"),
                is_admin=True,
                is_active=True
            )
            db.add(admin)
            print("ADMINISTRADOR 'admin@falacomigo.mz' criado.")
            
        # 3. Advogado (João Silva)
        existing_lawyer = db.query(Lawyer).filter(Lawyer.professional_email == "joao.silva@oam.mz").first()
        if not existing_lawyer:
            lawyer = Lawyer(
                lawyer_id=uuid.uuid4(),
                nome="Dr. João Silva",
                birth_date=datetime(1985, 5, 20),
                nationality="Moçambicana",
                document_type="bi",
                document_number="110203040506Z",
                document_issue_date=datetime(2015, 1, 1),
                document_expiry_date=datetime(2025, 1, 1),
                oam_number="1234/OAM",
                oam_registration_year=2010,
                especialidade="Direito de Família",
                specializations=["Direito de Família", "Direito Civil"],
                professional_email="joao.silva@oam.mz",
                professional_phone="+258 84 999 9999",
                office_address="Av. Julius Nyerere, 123, Maputo",
                city="Maputo",
                province="Maputo",
                rating=4.8,
                total_reviews=127,
                cases_completed=150,
                is_online=True,
                verification_status="verified",
                is_active=True,
                terms_accepted=True,
                legal_declaration=True,
                verification_authorization=True,
                password_hash=get_password_hash("advogado123")
            )
            db.add(lawyer)
            print("ADVOGADO 'joao.silva@oam.mz' criado.")
            
        db.commit()
        print("\nSeeding concluido com sucesso!")
        
    except Exception as e:
        print(f"Erro ao semear dados: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_test_accounts()
