# 🚀 Backend - Fala Comigo Advogado

Backend Python com FastAPI e PostgreSQL para o sistema Fala Comigo Advogado.

## 📋 Pré-requisitos

- Python 3.9+
- PostgreSQL 12+
- pip (gerenciador de pacotes Python)

## 🔧 Instalação

### 1. Criar Ambiente Virtual

```bash
# Navegar para a pasta backend
cd "c:\Users\patriciom\Documents\Fala comigo advogado system\backend"

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual (Windows)
.\venv\Scripts\activate

# Ativar ambiente virtual (Linux/Mac)
source venv/bin/activate
```

### 2. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 3. Configurar Banco de Dados PostgreSQL

```sql
-- Abrir psql ou pgAdmin e executar:
CREATE DATABASE fala_comigo_db;
CREATE USER fala_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE fala_comigo_db TO fala_user;
```

### 4. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
copy .env.example .env

# Editar .env com suas configurações
notepad .env
```

**Configurações obrigatórias no `.env`:**

```env
DATABASE_URL=postgresql://fala_user:sua_senha_segura@localhost:5432/fala_comigo_db
SECRET_KEY=gere_uma_chave_secreta_aleatoria_aqui_min_32_caracteres
```

**Para gerar SECRET_KEY:**
```python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## ▶️ Executar o Servidor

```bash
# Modo desenvolvimento (com auto-reload)
python main.py

# Ou usando uvicorn diretamente
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

O servidor estará disponível em:
- **API:** http://localhost:8000
- **Documentação Swagger:** http://localhost:8000/api/v1/docs
- **Documentação ReDoc:** http://localhost:8000/api/v1/redoc

## 📁 Estrutura do Projeto

```
backend/
├── main.py                 # Aplicação FastAPI principal
├── config.py               # Configurações
├── database.py             # Conexão PostgreSQL
├── requirements.txt        # Dependências
├── .env                    # Variáveis de ambiente (não commitar!)
│
├── modelos/                # Modelos SQLAlchemy
│   ├── usuarios.py
│   ├── advogados.py
│   ├── consultas.py
│   ├── pagamentos.py
│   ├── mensagens.py
│   └── avaliacoes.py
│
├── rotas/                  # Endpoints da API
│   ├── autenticacao.py
│   ├── usuarios.py
│   ├── advogados.py
│   ├── consultas.py
│   ├── pagamentos.py
│   ├── chat.py
│   ├── avaliacoes.py
│   └── admin.py
│
├── servicos/               # Lógica de negócio
│   ├── autenticacao.py     # JWT, bcrypt
│   ├── mpesa.py            # Integração M-Pesa
│   └── upload.py           # Upload de arquivos
│
└── utils/                  # Utilitários
    ├── dependencias.py     # Dependencies FastAPI
    └── helpers.py          # Funções auxiliares
```

## 🔑 Endpoints Principais

### Autenticação
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register/user` - Registro de usuário
- `POST /api/v1/auth/register/lawyer` - Registro de advogado
- `GET /api/v1/auth/verify` - Verificar token

### Usuários
- `GET /api/v1/users/{userId}` - Obter perfil
- `PATCH /api/v1/users/{userId}` - Atualizar perfil
- `GET /api/v1/users` - Listar usuários (Admin)

### Advogados
- `GET /api/v1/lawyers` - Listar advogados
- `GET /api/v1/lawyers/{lawyerId}` - Obter perfil
- `PATCH /api/v1/lawyers/{lawyerId}/online-status` - Status online

### Consultas
- `POST /api/v1/consultations` - Criar consulta
- `GET /api/v1/consultations/{orderId}` - Obter detalhes
- `POST /api/v1/consultations/{orderId}/assign` - Atribuir advogado

### Pagamentos
- `POST /api/v1/payments/mpesa/initiate` - Iniciar pagamento
- `GET /api/v1/payments/mpesa/{transactionId}/status` - Verificar status

### Chat
- `POST /api/v1/consultations/{orderId}/messages` - Enviar mensagem
- `GET /api/v1/consultations/{orderId}/messages` - Obter mensagens

### Avaliações
- `POST /api/v1/consultations/{orderId}/rating` - Criar avaliação
- `GET /api/v1/lawyers/{lawyerId}/ratings` - Obter avaliações

### Admin
- `GET /api/v1/admin/analytics` - Dashboard
- `GET /api/v1/admin/cases` - Listar casos

## 🧪 Testar a API

### Usando Swagger UI
1. Abrir http://localhost:8000/api/v1/docs
2. Testar endpoints diretamente na interface

### Usando cURL

```bash
# Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@falacomigo.mz","password":"admin123"}'

# Obter perfil (com token)
curl -X GET "http://localhost:8000/api/v1/users/{userId}" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ Autenticação JWT com expiração
- ✅ CORS configurado
- ✅ Validação de inputs com Pydantic
- ✅ SQL Injection protegido (SQLAlchemy ORM)

## 💳 Integração M-Pesa

Para configurar M-Pesa em produção:

1. Obter credenciais junto à Vodacom Moçambique
2. Configurar no `.env`:
   ```env
   MPESA_API_KEY=sua_api_key
   MPESA_PUBLIC_KEY=sua_public_key
   MPESA_SERVICE_PROVIDER_CODE=seu_codigo
   MPESA_BASE_URL=https://api.vm.co.mz:18352
   ```
3. Configurar webhook URL pública

## 📝 Notas de Desenvolvimento

- Modo DEBUG ativado por padrão em desenvolvimento
- Auto-reload ativado para facilitar desenvolvimento
- Logs detalhados no console
- Documentação Swagger gerada automaticamente

## 🐛 Troubleshooting

### Erro de conexão com PostgreSQL
```bash
# Verificar se PostgreSQL está rodando
# Windows: Services > PostgreSQL
# Linux: sudo systemctl status postgresql
```

### Erro de módulo não encontrado
```bash
# Reinstalar dependências
pip install -r requirements.txt --force-reinstall
```

### Erro de permissão no banco de dados
```sql
-- Conceder permissões
GRANT ALL PRIVILEGES ON DATABASE fala_comigo_db TO fala_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fala_user;
```

## 📚 Documentação Adicional

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [M-Pesa API Docs](https://developer.vm.co.mz/)

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação da API em `/docs` ou entre em contato com a equipe de desenvolvimento.
