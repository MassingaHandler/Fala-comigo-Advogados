"""
Script para popular o banco de dados com advogados de teste
"""
import sys
import os
from datetime import datetime

# Adicionar o diretório pai ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
from modelos.advogados import Lawyer
from servicos.autenticacao import get_password_hash
import uuid

def seed_lawyers():
    """Criar advogados de teste no banco de dados"""
    db = SessionLocal()
    
    try:
        # Verificar se já existem advogados
        existing = db.query(Lawyer).count()
        if existing > 0:
            print(f"⚠️  Já existem {existing} advogados no banco de dados.")
            response = input("Deseja adicionar mais advogados? (s/n): ")
            if response.lower() != 's':
                print("❌ Operação cancelada.")
                return
        
        lawyers_data = [
            {
                "nome": "Dra. Ana Silva",
                "especialidade": "Direito de Família",
                "specializations": ["Direito de Família", "Direito Civil"],
                "birth_date": "1985-03-15",
                "nationality": "Moçambicana",
                "document_type": "bi",
                "document_number": "110203040506A",
                "document_issue_date": "2015-01-10",
                "document_expiry_date": "2025-01-10",
                "oam_number": "OAM-12345",
                "oam_registration_year": 2010,
                "professional_email": "ana.silva@adv.mz",
                "professional_phone": "+258 84 111 1111",
                "office_address": "Av. Julius Nyerere, 123",
                "city": "Maputo",
                "province": "Maputo",
                "rating": 4.8,
                "total_reviews": 45,
                "cases_completed": 120,
                "is_online": True,
                "verification_status": "verified",
                "is_active": True,
                "terms_accepted": True,
                "legal_declaration": True,
                "verification_authorization": True
            },
            {
                "nome": "Dr. Carlos Mendes",
                "especialidade": "Direito Laboral",
                "specializations": ["Direito Laboral", "Direito Empresarial"],
                "birth_date": "1980-07-22",
                "nationality": "Moçambicana",
                "document_type": "bi",
                "document_number": "110203040507B",
                "document_issue_date": "2014-05-20",
                "document_expiry_date": "2024-05-20",
                "oam_number": "OAM-23456",
                "oam_registration_year": 2008,
                "professional_email": "carlos.mendes@adv.mz",
                "professional_phone": "+258 84 222 2222",
                "office_address": "Av. 24 de Julho, 456",
                "city": "Maputo",
                "province": "Maputo",
                "rating": 4.6,
                "total_reviews": 38,
                "cases_completed": 95,
                "is_online": True,
                "verification_status": "verified",
                "is_active": True,
                "terms_accepted": True,
                "legal_declaration": True,
                "verification_authorization": True
            },
            {
                "nome": "Dra. Beatriz Costa",
                "especialidade": "Direito Imobiliário",
                "specializations": ["Direito Imobiliário", "Direito Civil"],
                "birth_date": "1988-11-10",
                "nationality": "Moçambicana",
                "document_type": "bi",
                "document_number": "110203040508C",
                "document_issue_date": "2016-03-15",
                "document_expiry_date": "2026-03-15",
                "oam_number": "OAM-34567",
                "oam_registration_year": 2012,
                "professional_email": "beatriz.costa@adv.mz",
                "professional_phone": "+258 84 333 3333",
                "office_address": "Av. Mao Tse Tung, 789",
                "city": "Maputo",
                "province": "Maputo",
                "rating": 4.9,
                "total_reviews": 52,
                "cases_completed": 140,
                "is_online": False,
                "verification_status": "verified",
                "is_active": True,
                "terms_accepted": True,
                "legal_declaration": True,
                "verification_authorization": True
            },
            {
                "nome": "Dr. David Nunes",
                "especialidade": "Direito Criminal",
                "specializations": ["Direito Criminal", "Direito Penal"],
                "birth_date": "1982-05-18",
                "nationality": "Moçambicana",
                "document_type": "bi",
                "document_number": "110203040509D",
                "document_issue_date": "2013-08-22",
                "document_expiry_date": "2023-08-22",
                "oam_number": "OAM-45678",
                "oam_registration_year": 2009,
                "professional_email": "david.nunes@adv.mz",
                "professional_phone": "+258 84 444 4444",
                "office_address": "Av. Eduardo Mondlane, 321",
                "city": "Maputo",
                "province": "Maputo",
                "rating": 4.7,
                "total_reviews": 41,
                "cases_completed": 110,
                "is_online": True,
                "verification_status": "verified",
                "is_active": True,
                "terms_accepted": True,
                "legal_declaration": True,
                "verification_authorization": True
            },
            {
                "nome": "Dra. Elena Rodrigues",
                "especialidade": "Direito de Família",
                "specializations": ["Direito de Família", "Direito da Criança"],
                "birth_date": "1990-02-28",
                "nationality": "Moçambicana",
                "document_type": "bi",
                "document_number": "110203040510E",
                "document_issue_date": "2017-06-10",
                "document_expiry_date": "2027-06-10",
                "oam_number": "OAM-56789",
                "oam_registration_year": 2015,
                "professional_email": "elena.rodrigues@adv.mz",
                "professional_phone": "+258 84 555 5555",
                "office_address": "Av. Vladimir Lenine, 654",
                "city": "Maputo",
                "province": "Maputo",
                "rating": 4.9,
                "total_reviews": 48,
                "cases_completed": 105,
                "is_online": True,
                "verification_status": "verified",
                "is_active": True,
                "terms_accepted": True,
                "legal_declaration": True,
                "verification_authorization": True
            }
        ]
        
        created_count = 0
        for data in lawyers_data:
            # Gerar lawyer_id único
            lawyer_id = str(uuid.uuid4())
            
            # Converter datas de string para datetime
            from datetime import datetime as dt
            birth_date = dt.strptime(data["birth_date"], "%Y-%m-%d")
            document_issue_date = dt.strptime(data["document_issue_date"], "%Y-%m-%d")
            document_expiry_date = dt.strptime(data["document_expiry_date"], "%Y-%m-%d")
            
            # Criar advogado
            lawyer = Lawyer(
                lawyer_id=lawyer_id,
                nome=data["nome"],
                especialidade=data["especialidade"],
                specializations=data["specializations"],
                birth_date=birth_date,
                nationality=data["nationality"],
                document_type=data["document_type"],
                document_number=data["document_number"],
                document_issue_date=document_issue_date,
                document_expiry_date=document_expiry_date,
                oam_number=data["oam_number"],
                oam_registration_year=data["oam_registration_year"],
                professional_email=data["professional_email"],
                professional_phone=data["professional_phone"],
                office_address=data["office_address"],
                city=data["city"],
                province=data["province"],
                rating=data.get("rating", 0.0),
                total_reviews=data.get("total_reviews", 0),
                cases_completed=data.get("cases_completed", 0),
                is_online=data.get("is_online", False),
                verification_status=data["verification_status"],
                is_active=data["is_active"],
                terms_accepted=data.get("terms_accepted", True),
                legal_declaration=data.get("legal_declaration", True),
                verification_authorization=data.get("verification_authorization", True),
                password_hash=get_password_hash("senha123")  # Senha padrão para teste
            )
            
            db.add(lawyer)
            created_count += 1
            print(f"✅ Criado: {data['nome']} - {data['especialidade']}")
        
        db.commit()
        print(f"\n🎉 {created_count} advogados criados com sucesso!")
        print("\n📊 Resumo:")
        print(f"   - Direito de Família: 2 advogados")
        print(f"   - Direito Laboral: 1 advogado")
        print(f"   - Direito Imobiliário: 1 advogado")
        print(f"   - Direito Criminal: 1 advogado")
        print("\n🔐 Senha padrão para todos: senha123")
        
    except Exception as e:
        print(f"❌ Erro ao criar advogados: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("🚀 Iniciando seed de advogados...\n")
    seed_lawyers()
