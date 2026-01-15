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
                "data_nascimento": "1985-03-15",
                "genero": "feminino",
                "nacionalidade": "Moçambicana",
                "tipo_documento": "bi",
                "numero_documento": "110203040506A",
                "oam_number": "OAM-12345",
                "oam_registration_date": "2010-06-01",
                "professional_email": "ana.silva@adv.mz",
                "professional_phone": "+258 84 111 1111",
                "office_address": {
                    "street": "Av. Julius Nyerere, 123",
                    "neighborhood": "Polana",
                    "city": "Maputo",
                    "country": "Moçambique"
                },
                "bio": "Especialista em Direito de Família com 15 anos de experiência.",
                "rating": 4.8,
                "total_reviews": 45,
                "cases_completed": 120,
                "is_online": True,
                "verification_status": "verified",
                "is_active": True
            },
            {
                "nome": "Dr. Carlos Mendes",
                "especialidade": "Direito Laboral",
                "specializations": ["Direito Laboral", "Direito Empresarial"],
                "data_nascimento": "1980-07-22",
                "genero": "masculino",
                "nacionalidade": "Moçambicana",
                "tipo_documento": "bi",
                "numero_documento": "110203040507B",
                "oam_number": "OAM-23456",
                "oam_registration_date": "2008-03-15",
                "professional_email": "carlos.mendes@adv.mz",
                "professional_phone": "+258 84 222 2222",
                "office_address": {
                    "street": "Av. 24 de Julho, 456",
                    "neighborhood": "Baixa",
                    "city": "Maputo",
                    "country": "Moçambique"
                },
                "bio": "Advogado especializado em questões trabalhistas e empresariais.",
                "rating": 4.6,
                "total_reviews": 38,
                "cases_completed": 95,
                "is_online": True,
                "verification_status": "verified",
                "is_active": True
            },
            {
                "nome": "Dra. Beatriz Costa",
                "especialidade": "Direito Imobiliário",
                "specializations": ["Direito Imobiliário", "Direito Civil"],
                "data_nascimento": "1988-11-10",
                "genero": "feminino",
                "nacionalidade": "Moçambicana",
                "tipo_documento": "bi",
                "numero_documento": "110203040508C",
                "oam_number": "OAM-34567",
                "oam_registration_date": "2012-09-20",
                "professional_email": "beatriz.costa@adv.mz",
                "professional_phone": "+258 84 333 3333",
                "office_address": {
                    "street": "Av. Mao Tse Tung, 789",
                    "neighborhood": "Sommerschield",
                    "city": "Maputo",
                    "country": "Moçambique"
                },
                "bio": "Especialista em transações imobiliárias e contratos.",
                "rating": 4.9,
                "total_reviews": 52,
                "cases_completed": 140,
                "is_online": False,
                "verification_status": "verified",
                "is_active": True
            },
            {
                "nome": "Dr. David Nunes",
                "especialidade": "Direito Criminal",
                "specializations": ["Direito Criminal", "Direito Penal"],
                "data_nascimento": "1982-05-18",
                "genero": "masculino",
                "nacionalidade": "Moçambicana",
                "tipo_documento": "bi",
                "numero_documento": "110203040509D",
                "oam_number": "OAM-45678",
                "oam_registration_date": "2009-11-12",
                "professional_email": "david.nunes@adv.mz",
                "professional_phone": "+258 84 444 4444",
                "office_address": {
                    "street": "Av. Eduardo Mondlane, 321",
                    "neighborhood": "Centro",
                    "city": "Maputo",
                    "country": "Moçambique"
                },
                "bio": "Advogado criminalista com vasta experiência em defesa.",
                "rating": 4.7,
                "total_reviews": 41,
                "cases_completed": 110,
                "is_online": True,
                "verification_status": "verified",
                "is_active": True
            },
            {
                "nome": "Dra. Elena Rodrigues",
                "especialidade": "Direito de Família",
                "specializations": ["Direito de Família", "Direito da Criança"],
                "data_nascimento": "1990-02-28",
                "genero": "feminino",
                "nacionalidade": "Moçambicana",
                "tipo_documento": "bi",
                "numero_documento": "110203040510E",
                "oam_number": "OAM-56789",
                "oam_registration_date": "2015-04-08",
                "professional_email": "elena.rodrigues@adv.mz",
                "professional_phone": "+258 84 555 5555",
                "office_address": {
                    "street": "Av. Vladimir Lenine, 654",
                    "neighborhood": "Polana Cimento",
                    "city": "Maputo",
                    "country": "Moçambique"
                },
                "bio": "Advogada dedicada a casos de família e proteção infantil.",
                "rating": 4.9,
                "total_reviews": 48,
                "cases_completed": 105,
                "is_online": True,
                "verification_status": "verified",
                "is_active": True
            }
        ]
        
        created_count = 0
        for data in lawyers_data:
            # Gerar lawyer_id único
            lawyer_id = str(uuid.uuid4())
            
            # Criar advogado
            lawyer = Lawyer(
                lawyer_id=lawyer_id,
                nome=data["nome"],
                especialidade=data["especialidade"],
                specializations=data["specializations"],
                data_nascimento=data["data_nascimento"],
                genero=data["genero"],
                nacionalidade=data["nacionalidade"],
                tipo_documento=data["tipo_documento"],
                numero_documento=data["numero_documento"],
                oam_number=data["oam_number"],
                oam_registration_date=data["oam_registration_date"],
                professional_email=data["professional_email"],
                professional_phone=data["professional_phone"],
                office_address=data["office_address"],
                bio=data.get("bio"),
                rating=data.get("rating", 0.0),
                total_reviews=data.get("total_reviews", 0),
                cases_completed=data.get("cases_completed", 0),
                is_online=data.get("is_online", False),
                verification_status=data["verification_status"],
                is_active=data["is_active"],
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
