
import { createClient } from '@supabase/supabase-js';

// -------------------------------------------------------------------------
// CONFIGURAÇÃO DO SUPABASE
// Para sair do Modo Demo:
// 1. Crie um projeto gratuito em https://supabase.com
// 2. No dashboard, vá a Settings (ícone de engrenagem) -> API
// 3. Copie o 'Project URL' e a chave 'anon public'
// 4. Cole-os abaixo
// -------------------------------------------------------------------------

const SUPABASE_URL = 'https://gzqrihbpgptfoiziblaj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6cXJpaGJwZ3B0Zm9pemlibGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzExNjEsImV4cCI6MjA3OTE0NzE2MX0.5z1jJ8WLik1JjsrlwJnmkqTWRxzp0m08VwDjwfs7EJU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// O Modo Demo permanece ativo enquanto o URL for o de exemplo
export const isSupabaseConfigured = () => {
    const url = SUPABASE_URL as string;
    return url !== 'https://seu-projeto.supabase.co' && url.includes('supabase.co');
};

export const getSupabaseSetupSQL = () => {
    return `
-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ORDERS TABLE
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  human_id text not null,
  user_id text not null,
  client_phone text,
  topic_id text,
  package_id text,
  consultation_type text,
  status text,
  price_paid numeric,
  transaction_ref text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Patch for existing tables (adds column if missing)
alter table orders add column if not exists client_phone text;

-- 3. MESSAGES TABLE
create table if not exists messages (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade,
  sender_id text,
  content text,
  message_type text default 'text',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. REVIEWS TABLE
create table if not exists reviews (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id),
  lawyer_id text,
  user_id text,
  stars integer,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. SYSTEM CONFIGS TABLE (Admin Panel)
create table if not exists system_configs (
  id uuid default uuid_generate_v4() primary key,
  category text not null,
  key text not null unique,
  value text,
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. SECURITY POLICIES (Row Level Security)
-- This ensures the application can write to the DB without 'Permission Denied' errors.
-- WARNING: These policies allow public access for the prototype. Secure them for production.

-- Enable RLS
alter table orders enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;
alter table system_configs enable row level security;

-- Create Policies (Drop existing first to avoid errors on re-run)
drop policy if exists "Public Access Orders" on orders;
create policy "Public Access Orders" on orders for all using (true) with check (true);

drop policy if exists "Public Access Messages" on messages;
create policy "Public Access Messages" on messages for all using (true) with check (true);

drop policy if exists "Public Access Reviews" on reviews;
create policy "Public Access Reviews" on reviews for all using (true) with check (true);

drop policy if exists "Public Access Configs" on system_configs;
create policy "Public Access Configs" on system_configs for all using (true) with check (true);

-- 7. REALTIME SETUP
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table messages;
commit;
    `;
};
