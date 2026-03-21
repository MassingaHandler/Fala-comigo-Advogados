
import sys
import os
from sqlalchemy import inspect, text

# Adicionar o diretório atual ao PYTHONPATH para permitir importações locais
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine

def inspect_db():
    inspector = inspect(engine)
    
    table_name = "users"
    if table_name in inspector.get_table_names():
        print(f"\nTabela: {table_name}")
        with engine.connect() as connection:
            result = connection.execute(text("SELECT id, email, full_name, is_admin FROM users"))
            users = result.all()
            if not users:
                print("Nenhum usuário encontrado.")
            for user in users:
                print(f"ID: {user[0]}, Email: {user[1]}, Nome: {user[2]}, Admin: {user[3]}")
    else:
        print(f"Tabela {table_name} nao encontrada")

if __name__ == "__main__":
    inspect_db()
