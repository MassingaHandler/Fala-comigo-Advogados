
import sys
import os
from sqlalchemy import text, inspect

# Adicionar o diretório atual ao PYTHONPATH for local imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine

def migrate():
    # List of columns to add to 'users' table if they don't exist
    user_columns = [
        ("occupation", "VARCHAR(100)"),
        ("nuit", "VARCHAR(20)"),
        ("document_issue_date", "TIMESTAMP"),
        ("document_expiry_date", "TIMESTAMP"),
        ("document_front_url", "VARCHAR(500)"),
        ("document_back_url", "VARCHAR(500)"),
        ("selfie_url", "VARCHAR(500)"),
        ("kyc_status", "VARCHAR(50)"),
        ("kyc_notes", "VARCHAR(500)"),
        ("kyc_verified_at", "TIMESTAMP"),
        ("last_login", "TIMESTAMP")
    ]
    
    # List of columns to add to 'lawyers' table if they don't exist
    lawyer_columns = [
        ("phone_number", "VARCHAR(20)")
    ]

    # List of columns to add to 'orders' table if they don't exist
    order_columns = [
        ("lawyer_notes", "TEXT"),
        ("follow_up_requested", "BOOLEAN DEFAULT FALSE")
    ]
    
    inspector = inspect(engine)
    
    with engine.begin() as conn:
        # Migrating users table
        if 'users' in inspector.get_table_names():
            print("Migrating 'users' table...")
            existing_user_cols = [c['name'] for c in inspector.get_columns('users')]
            for col_name, col_type in user_columns:
                if col_name not in existing_user_cols:
                    print(f"Adding column {col_name} to users...")
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                else:
                    print(f"Column {col_name} already exists in users.")

        # Migrating orders table
        if 'orders' in inspector.get_table_names():
            print("\nMigrating 'orders' table...")
            existing_order_cols = [c['name'] for c in inspector.get_columns('orders')]
            for col_name, col_type in order_columns:
                if col_name not in existing_order_cols:
                    print(f"Adding column {col_name} to orders...")
                    conn.execute(text(f"ALTER TABLE orders ADD COLUMN {col_name} {col_type}"))
                else:
                    print(f"Column {col_name} already exists in orders.")
                
        # Migrating lawyers table
        if 'lawyers' in inspector.get_table_names():
            print("\nMigrating 'lawyers' table...")
            existing_lawyer_cols = [c['name'] for c in inspector.get_columns('lawyers')]
            for col_name, col_type in lawyer_columns:
                if col_name not in existing_lawyer_cols:
                    print(f"Adding column {col_name} to lawyers...")
                    conn.execute(text(f"ALTER TABLE lawyers ADD COLUMN {col_name} {col_type}"))
                else:
                    print(f"Column {col_name} already exists in lawyers.")

    print("\nMigration complete!")

if __name__ == "__main__":
    migrate()
