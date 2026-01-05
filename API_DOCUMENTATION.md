# 📘 Documentação da API - Fala Comigo Advogado

## 🎯 Visão Geral

Esta documentação descreve todos os endpoints necessários para integração do backend Python com o frontend React do sistema **Fala Comigo Advogado**.

**Base URL (Sugestão):** `https://api.falacomigo.mz/v1`

**Formato de Resposta:** JSON  
**Autenticação:** Bearer Token (JWT)

---

## 📑 Índice

1. [Autenticação](#1-autenticação)
2. [Gestão de Usuários](#2-gestão-de-usuários)
3. [Gestão de Advogados](#3-gestão-de-advogados)
4. [Consultas/Casos](#4-consultascasos)
5. [Pagamentos (M-Pesa)](#5-pagamentos-m-pesa)
6. [Chat e Mensagens](#6-chat-e-mensagens)
7. [Avaliações](#7-avaliações)
8. [Administração](#8-administração)
9. [Modelos de Dados](#9-modelos-de-dados)

---

## 1. Autenticação

### 1.1 Login de Usuário/Advogado

**Endpoint:** `POST /auth/login`

**Descrição:** Autentica um usuário ou advogado e retorna um token JWT.

**Request Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-user-123",
    "fullName": "João Silva",
    "email": "usuario@email.com",
    "role": "user",  // "user" | "lawyer" | "admin"
    "phoneNumber": "+258 84 123 4567",
    "emailVerified": true,
    "phoneVerified": true
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Email ou senha incorretos"
}
```

---

### 1.2 Registro de Usuário

**Endpoint:** `POST /auth/register/user`

**Descrição:** Registra um novo usuário na plataforma.

**Request Body:**
```json
{
  "fullName": "João Silva Santos",
  "birthDate": "1990-05-15",
  "nationality": "Moçambicana",
  "gender": "masculino",
  "documentType": "bi",
  "documentNumber": "123456789012A",
  "phoneNumber": "+258 84 123 4567",
  "email": "joao@email.com",
  "password": "senha_segura_123",
  "address": {
    "neighborhood": "Polana",
    "city": "Maputo",
    "country": "Moçambique"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "userId": "uuid-user-123",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 1.3 Registro de Advogado

**Endpoint:** `POST /auth/register/lawyer`

**Descrição:** Registra um novo advogado (requer verificação posterior).

**Request Body (multipart/form-data):**
```json
{
  "fullName": "Dr. João Silva Santos",
  "birthDate": "1985-03-20",
  "nationality": "Moçambicana",
  "documentType": "bi",
  "documentNumber": "123456789012A",
  "documentIssueDate": "2020-01-15",
  "documentExpiryDate": "2030-01-15",
  "oamNumber": "12345",
  "oamRegistrationYear": 2015,
  "specializations": ["Direito Penal", "Direito de Família"],
  "professionalEmail": "joao.silva@escritorio.com",
  "professionalPhone": "+258 84 123 4567",
  "officeAddress": "Av. Julius Nyerere, 123",
  "city": "Maputo",
  "province": "Maputo Cidade",
  "termsAccepted": true,
  "legalDeclaration": true,
  "verificationAuthorization": true
}
```

**Files:**
- `documentFile`: PDF/JPG do BI ou Passaporte
- `oamCardFile`: PDF/JPG da Carteira Profissional OAM
- `cvFile`: PDF do Curriculum Vitae
- `additionalDocs[]`: (Opcional) Certificados adicionais

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registro submetido. Aguardando verificação da OAM.",
  "lawyerId": "uuid-lawyer-456",
  "status": "pending_verification"
}
```

---

### 1.4 Logout

**Endpoint:** `POST /auth/logout`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

### 1.5 Verificar Token

**Endpoint:** `GET /auth/verify`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "valid": true,
  "user": {
    "id": "uuid-user-123",
    "role": "user"
  }
}
```

---

## 2. Gestão de Usuários

### 2.1 Obter Perfil do Usuário

**Endpoint:** `GET /users/{userId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "id": "uuid-user-123",
  "fullName": "João Silva",
  "email": "joao@email.com",
  "phoneNumber": "+258 84 123 4567",
  "birthDate": "1990-05-15",
  "nationality": "Moçambicana",
  "documentType": "bi",
  "documentNumber": "123456789012A",
  "emailVerified": true,
  "phoneVerified": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "address": {
    "neighborhood": "Polana",
    "city": "Maputo",
    "country": "Moçambique"
  }
}
```

---

### 2.2 Atualizar Perfil do Usuário

**Endpoint:** `PATCH /users/{userId}`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "fullName": "João Silva Santos",
  "phoneNumber": "+258 84 999 8888",
  "address": {
    "neighborhood": "Sommerschield",
    "city": "Maputo",
    "country": "Moçambique"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Perfil atualizado com sucesso",
  "user": { /* dados atualizados */ }
}
```

---

### 2.3 Listar Todos os Usuários (Admin)

**Endpoint:** `GET /users`

**Headers:** `Authorization: Bearer {token}` (Admin apenas)

**Query Parameters:**
- `page`: número da página (default: 1)
- `limit`: itens por página (default: 20)
- `search`: busca por nome ou email
- `status`: filtro por status (`active`, `inactive`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "fullName": "João Silva",
      "email": "joao@email.com",
      "phoneNumber": "+258 84 123 4567",
      "status": "active",
      "totalCases": 5,
      "joinedDate": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20
  }
}
```

---

### 2.4 Ativar/Desativar Usuário (Admin)

**Endpoint:** `PATCH /users/{userId}/status`

**Headers:** `Authorization: Bearer {token}` (Admin apenas)

**Request Body:**
```json
{
  "status": "inactive"  // "active" | "inactive"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Status do usuário atualizado",
  "userId": "uuid-1",
  "newStatus": "inactive"
}
```

---

## 3. Gestão de Advogados

### 3.1 Listar Advogados Disponíveis

**Endpoint:** `GET /lawyers`

**Query Parameters:**
- `specialty`: filtro por especialização
- `available`: apenas advogados online (`true`/`false`)
- `rating`: rating mínimo (1-5)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "lawyer_id": "uuid-lawyer-1",
      "nome": "Dra. Ana Silva",
      "especialidade": "Direito de Família",
      "avatarUrl": "https://storage.falacomigo.mz/avatars/ana.jpg",
      "phoneNumber": "+258 84 111 1111",
      "oamNumber": "12345",
      "isOnline": true,
      "rating": 4.8,
      "totalReviews": 45
    }
  ]
}
```

---

### 3.2 Obter Perfil do Advogado

**Endpoint:** `GET /lawyers/{lawyerId}`

**Response (200 OK):**
```json
{
  "lawyer_id": "uuid-lawyer-1",
  "nome": "Dra. Ana Silva",
  "especialidade": "Direito de Família",
  "specializations": ["Direito de Família", "Direito Civil"],
  "avatarUrl": "https://storage.falacomigo.mz/avatars/ana.jpg",
  "phoneNumber": "+258 84 111 1111",
  "professionalEmail": "ana.silva@escritorio.com",
  "oamNumber": "12345",
  "oamRegistrationYear": 2015,
  "officeAddress": "Av. Julius Nyerere, 123",
  "city": "Maputo",
  "province": "Maputo Cidade",
  "isOnline": true,
  "rating": 4.8,
  "totalReviews": 45,
  "casesCompleted": 67,
  "verificationStatus": "verified",
  "createdAt": "2024-01-10T08:00:00Z"
}
```

---

### 3.3 Atualizar Status Online do Advogado

**Endpoint:** `PATCH /lawyers/{lawyerId}/online-status`

**Headers:** `Authorization: Bearer {token}` (Lawyer apenas)

**Request Body:**
```json
{
  "isOnline": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Status atualizado",
  "isOnline": true
}
```

---

### 3.4 Estatísticas do Advogado

**Endpoint:** `GET /lawyers/{lawyerId}/stats`

**Headers:** `Authorization: Bearer {token}` (Lawyer apenas)

**Query Parameters:**
- `period`: `today` | `week` | `month` | `year`

**Response (200 OK):**
```json
{
  "success": true,
  "stats": {
    "dailyConsultations": 3,
    "dailyRevenue": 7500,
    "weeklyConsultations": 12,
    "weeklyRevenue": 30000,
    "totalCasesCompleted": 67,
    "averageRating": 4.8,
    "totalReviews": 45
  }
}
```

---

### 3.5 Listar Todos os Advogados (Admin)

**Endpoint:** `GET /admin/lawyers`

**Headers:** `Authorization: Bearer {token}` (Admin apenas)

**Query Parameters:**
- `page`, `limit`, `search`, `specialty`, `status`

**Response:** Similar ao endpoint 3.1, com informações adicionais de verificação

---

### 3.6 Aprovar/Rejeitar Registro de Advogado (Admin)

**Endpoint:** `PATCH /admin/lawyers/{lawyerId}/verification`

**Headers:** `Authorization: Bearer {token}` (Admin apenas)

**Request Body:**
```json
{
  "status": "verified",  // "verified" | "rejected"
  "notes": "Documentação aprovada. OAM verificado."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Advogado verificado com sucesso",
  "lawyerId": "uuid-lawyer-1",
  "status": "verified"
}
```

---

## 4. Consultas/Casos

### 4.1 Criar Nova Consulta

**Endpoint:** `POST /consultations`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "user_id": "uuid-user-123",
  "topic": {
    "id": "familia",
    "name": "Direito de Família"
  },
  "package": {
    "id": "basico",
    "name": "Consulta Básica",
    "type": "consultation",
    "duration": 30,
    "unit": "minutes",
    "price": 2500
  },
  "consultationType": "digital",  // "digital" | "phone"
  "clientPhoneNumber": "+258 84 123 4567"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Consulta criada. Proceda com o pagamento.",
  "order": {
    "id": "uuid-order-789",
    "human_id": "FC-123456",
    "order_id": "FC-123456",
    "user_id": "uuid-user-123",
    "status": "pending_payment",
    "payment_status": "pending",
    "createdAt": "2024-12-05T14:30:00Z"
  }
}
```

---

### 4.2 Obter Detalhes da Consulta

**Endpoint:** `GET /consultations/{orderId}`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "id": "uuid-order-789",
  "human_id": "FC-123456",
  "order_id": "FC-123456",
  "user_id": "uuid-user-123",
  "clientPhoneNumber": "+258 84 123 4567",
  "topic": {
    "id": "familia",
    "name": "Direito de Família"
  },
  "pkg": {
    "id": "basico",
    "name": "Consulta Básica",
    "price": 2500
  },
  "consultationType": "digital",
  "payment_status": "confirmed",
  "payment_method": "mpesa",
  "transaction_reference": "VM1733412345678",
  "status": "assigned",
  "assignment": {
    "assignment_id": "uuid-assignment-1",
    "lawyer": {
      "lawyer_id": "uuid-lawyer-1",
      "nome": "Dra. Ana Silva",
      "especialidade": "Direito de Família",
      "phoneNumber": "+258 84 111 1111"
    },
    "assignedAt": "2024-12-05T14:35:00Z",
    "session": {
      "session_id": "uuid-session-1",
      "startTime": "2024-12-05T14:40:00Z"
    }
  },
  "createdAt": "2024-12-05T14:30:00Z"
}
```

---

### 4.3 Listar Consultas do Usuário

**Endpoint:** `GET /users/{userId}/consultations`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `status`: filtro por status
- `page`, `limit`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-order-789",
      "human_id": "FC-123456",
      "topic": { "name": "Direito de Família" },
      "status": "completed",
      "createdAt": "2024-12-05T14:30:00Z",
      "assignment": {
        "lawyer": {
          "nome": "Dra. Ana Silva"
        }
      }
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### 4.4 Listar Consultas do Advogado

**Endpoint:** `GET /lawyers/{lawyerId}/consultations`

**Headers:** `Authorization: Bearer {token}` (Lawyer apenas)

**Response:** Similar ao 4.3

---

### 4.5 Atualizar Status da Consulta

**Endpoint:** `PATCH /consultations/{orderId}/status`

**Headers:** `Authorization: Bearer {token}` (Lawyer ou Admin)

**Request Body:**
```json
{
  "status": "in_progress"  // Ver OrderStatus no modelo de dados
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Status atualizado",
  "orderId": "uuid-order-789",
  "newStatus": "in_progress"
}
```

---

### 4.6 Atribuir Advogado a uma Consulta (Admin/Sistema)

**Endpoint:** `POST /consultations/{orderId}/assign`

**Headers:** `Authorization: Bearer {token}` (Admin ou Sistema)

**Request Body:**
```json
{
  "lawyer_id": "uuid-lawyer-1"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Advogado atribuído com sucesso",
  "assignment": {
    "assignment_id": "uuid-assignment-1",
    "lawyer_id": "uuid-lawyer-1",
    "assignedAt": "2024-12-05T14:35:00Z"
  }
}
```

---

### 4.7 Criar Consulta de Acompanhamento (Follow-up)

**Endpoint:** `POST /consultations/{parentOrderId}/follow-up`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "package": {
    "id": "acompanhamento_1mes",
    "name": "Acompanhamento 1 Mês",
    "price": 5000
  },
  "termsAccepted": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Follow-up criado",
  "order": {
    "id": "uuid-order-790",
    "human_id": "FC-123457",
    "parent_order_id": "uuid-order-789",
    "status": "pending_payment"
  }
}
```

---

## 5. Pagamentos (M-Pesa)

### 5.1 Iniciar Pagamento M-Pesa

**Endpoint:** `POST /payments/mpesa/initiate`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "orderId": "uuid-order-789",
  "phoneNumber": "+258 84 123 4567",
  "amount": 2500,
  "reference": "FC-123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Pedido enviado para o telemóvel. Insira o PIN.",
  "transactionId": "VM1733412345678",
  "status": "pending"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Número inválido. Use um número Vodacom (84/85)."
}
```

---

### 5.2 Verificar Status do Pagamento

**Endpoint:** `GET /payments/mpesa/{transactionId}/status`

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "transactionId": "VM1733412345678",
  "status": "confirmed",  // "pending" | "confirmed" | "failed"
  "amount": 2500,
  "phoneNumber": "+258 84 123 4567",
  "confirmedAt": "2024-12-05T14:32:00Z"
}
```

---

### 5.3 Webhook de Confirmação M-Pesa (Callback)

**Endpoint:** `POST /payments/mpesa/callback`

**Descrição:** Endpoint para receber confirmações da Vodacom (não chamado pelo frontend)

**Request Body (da Vodacom):**
```json
{
  "output_ResponseCode": "INS-0",
  "output_ResponseDesc": "Request processed successfully",
  "output_TransactionID": "VM1733412345678",
  "output_ConversationID": "...",
  "output_ThirdPartyReference": "FC-123456"
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

### 5.4 Listar Pagamentos (Admin)

**Endpoint:** `GET /admin/payments`

**Headers:** `Authorization: Bearer {token}` (Admin apenas)

**Query Parameters:**
- `page`, `limit`, `search`, `status`, `method`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-payment-1",
      "transactionId": "VM1733412345678",
      "client": "João Silva",
      "caseId": "FC-123456",
      "amount": 2500,
      "method": "mpesa",
      "status": "completed",
      "date": "2024-12-05T14:32:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

---

## 6. Chat e Mensagens

### 6.1 Enviar Mensagem

**Endpoint:** `POST /consultations/{orderId}/messages`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "sender_id": "uuid-user-123",
  "text": "Olá, gostaria de saber sobre...",
  "type": "text"  // "text" | "document"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": {
    "id": "uuid-message-1",
    "sender_id": "uuid-user-123",
    "sender": "user",
    "text": "Olá, gostaria de saber sobre...",
    "type": "text",
    "timestamp": "2024-12-05T14:45:00Z"
  }
}
```

---

### 6.2 Enviar Documento

**Endpoint:** `POST /consultations/{orderId}/documents`

**Headers:** `Authorization: Bearer {token}`

**Request Body (multipart/form-data):**
- `sender_id`: uuid do remetente
- `file`: arquivo (PDF, JPG, PNG, DOCX)

**Response (201 Created):**
```json
{
  "success": true,
  "document": {
    "document_id": "uuid-doc-1",
    "filename": "contrato.pdf",
    "url": "https://storage.falacomigo.mz/docs/contrato.pdf",
    "uploadedAt": "2024-12-05T14:50:00Z"
  },
  "message": {
    "id": "uuid-message-2",
    "sender_id": "uuid-user-123",
    "sender": "user",
    "type": "document",
    "document": { /* documento acima */ },
    "timestamp": "2024-12-05T14:50:00Z"
  }
}
```

---

### 6.3 Obter Mensagens da Consulta

**Endpoint:** `GET /consultations/{orderId}/messages`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `limit`: número de mensagens (default: 50)
- `before`: timestamp para paginação

**Response (200 OK):**
```json
{
  "success": true,
  "messages": [
    {
      "id": "uuid-message-1",
      "sender_id": "uuid-user-123",
      "sender": "user",
      "text": "Olá, gostaria de saber sobre...",
      "type": "text",
      "timestamp": "2024-12-05T14:45:00Z"
    },
    {
      "id": "uuid-message-2",
      "sender_id": "uuid-lawyer-1",
      "sender": "lawyer",
      "text": "Claro, posso ajudar...",
      "type": "text",
      "timestamp": "2024-12-05T14:46:00Z"
    }
  ]
}
```

---

## 7. Avaliações

### 7.1 Criar Avaliação

**Endpoint:** `POST /consultations/{orderId}/rating`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "stars": 5,
  "comment": "Excelente atendimento! Muito profissional."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Avaliação registrada com sucesso",
  "rating": {
    "order_id": "uuid-order-789",
    "lawyer_id": "uuid-lawyer-1",
    "stars": 5,
    "comment": "Excelente atendimento! Muito profissional.",
    "createdAt": "2024-12-05T16:00:00Z"
  }
}
```

---

### 7.2 Obter Avaliações do Advogado

**Endpoint:** `GET /lawyers/{lawyerId}/ratings`

**Query Parameters:**
- `page`, `limit`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "order_id": "uuid-order-789",
      "stars": 5,
      "comment": "Excelente atendimento!",
      "createdAt": "2024-12-05T16:00:00Z",
      "client": {
        "fullName": "João Silva"
      }
    }
  ],
  "summary": {
    "averageRating": 4.8,
    "totalReviews": 45,
    "distribution": {
      "5": 30,
      "4": 10,
      "3": 3,
      "2": 1,
      "1": 1
    }
  }
}
```

---

## 8. Administração

### 8.1 Dashboard Analytics

**Endpoint:** `GET /admin/analytics`

**Headers:** `Authorization: Bearer {token}` (Admin apenas)

**Query Parameters:**
- `period`: `today` | `week` | `month` | `year`

**Response (200 OK):**
```json
{
  "success": true,
  "analytics": {
    "totalUsers": 1250,
    "totalLawyers": 45,
    "totalCases": 890,
    "activeCases": 67,
    "completedCases": 750,
    "totalRevenue": 2250000,
    "revenueThisMonth": 450000,
    "newUsersThisMonth": 120,
    "newLawyersThisMonth": 5,
    "averageRating": 4.7,
    "topLawyers": [
      {
        "lawyer_id": "uuid-lawyer-1",
        "nome": "Dra. Ana Silva",
        "casesCompleted": 67,
        "rating": 4.9
      }
    ]
  }
}
```

---

### 8.2 Listar Todos os Casos (Admin)

**Endpoint:** `GET /admin/cases`

**Headers:** `Authorization: Bearer {token}` (Admin apenas)

**Query Parameters:**
- `page`, `limit`, `search`, `status`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-order-789",
      "caseId": "FC-123456",
      "client": "João Silva",
      "lawyer": "Dra. Ana Silva",
      "topic": "Direito de Família",
      "status": "in_progress",
      "createdDate": "2024-12-01T10:00:00Z",
      "amount": 2500
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### 8.3 Reatribuir Caso a Outro Advogado (Admin)

**Endpoint:** `PATCH /admin/cases/{orderId}/reassign`

**Headers:** `Authorization: Bearer {token}` (Admin apenas)

**Request Body:**
```json
{
  "new_lawyer_id": "uuid-lawyer-2",
  "reason": "Advogado original indisponível"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Caso reatribuído com sucesso",
  "orderId": "uuid-order-789",
  "newLawyerId": "uuid-lawyer-2"
}
```

---

### 8.4 Exportar Relatório

**Endpoint:** `GET /admin/reports/export`

**Headers:** `Authorization: Bearer {token}` (Admin apenas)

**Query Parameters:**
- `type`: `payments` | `cases` | `users` | `lawyers`
- `format`: `csv` | `excel` | `pdf`
- `startDate`: data inicial (ISO 8601)
- `endDate`: data final (ISO 8601)

**Response (200 OK):**
- Retorna arquivo para download (CSV, XLSX ou PDF)

---

## 9. Modelos de Dados

### 9.1 User (Usuário)

```typescript
{
  id: string;                    // UUID
  fullName: string;
  birthDate: Date;
  nationality: string;
  gender?: "masculino" | "feminino" | "outro";
  documentType: "bi" | "passaporte" | "carta_conducao";
  documentNumber: string;
  phoneNumber: string;
  phoneVerified: boolean;
  email: string;
  emailVerified: boolean;
  address?: {
    neighborhood?: string;
    city?: string;
    country: string;
  };
  passwordHash: string;          // Nunca retornar ao frontend
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}
```

---

### 9.2 Lawyer (Advogado)

```typescript
{
  lawyer_id: string;             // UUID
  nome: string;
  especialidade: string;
  specializations: string[];     // Array de especializações
  avatarUrl: string;
  phoneNumber: string;
  professionalEmail: string;
  oamNumber: string;
  oamRegistrationYear: number;
  officeAddress: string;
  city: string;
  province: string;
  isOnline: boolean;
  rating: number;                // Média de avaliações
  totalReviews: number;
  casesCompleted: number;
  verificationStatus: "pending_verification" | "verified" | "rejected";
  createdAt: Date;
}
```

---

### 9.3 Order (Consulta/Caso)

```typescript
{
  id: string;                    // UUID
  human_id: string;              // ID legível (FC-123456)
  order_id: string;              // Alias para human_id
  parent_order_id?: string;      // UUID do caso pai (para follow-ups)
  user_id: string;
  clientPhoneNumber: string;
  topic: {
    id: string;
    name: string;
  };
  pkg: {
    id: string;
    name: string;
    type: "consultation" | "follow_up";
    duration?: number;
    unit?: "minutes" | "monthly" | "fixed_fee";
    price: number;
    description: string;
  };
  consultationType: "digital" | "phone";
  payment_status: "pending" | "confirmed" | "failed";
  payment_method?: "mpesa";
  transaction_reference?: string;
  status: "pending_payment" | "pending_assignment" | "assigned" | 
          "in_progress" | "completed" | "rating_pending" | "cancelled";
  assignment?: {
    assignment_id: string;
    lawyer: Lawyer;
    assignedAt: Date;
    session?: {
      session_id: string;
      startTime: Date;
    };
  };
  createdAt: Date;
  termsAccepted?: boolean;
}
```

---

### 9.4 ChatMessage (Mensagem)

```typescript
{
  id: string;
  sender_id: string;
  sender: "user" | "lawyer";
  text: string;
  timestamp: Date;
  type: "text" | "document";
  document?: {
    document_id: string;
    filename: string;
    url: string;
    uploadedAt: Date;
  };
}
```

---

### 9.5 Rating (Avaliação)

```typescript
{
  order_id: string;
  lawyer_id: string;
  stars: number;                 // 1-5
  comment: string;
  createdAt: Date;
}
```

---

## 📝 Notas Importantes

### Autenticação
- Todos os endpoints (exceto `/auth/login` e `/auth/register/*`) requerem token JWT
- Token deve ser enviado no header: `Authorization: Bearer {token}`
- Tokens devem expirar após 24 horas (configurável)

### Paginação
- Endpoints de listagem suportam paginação via `page` e `limit`
- Response padrão inclui objeto `pagination` com metadados

### Códigos de Status HTTP
- `200 OK`: Sucesso
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos
- `401 Unauthorized`: Token inválido ou ausente
- `403 Forbidden`: Sem permissão
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro no servidor

### Integração M-Pesa
- **IMPORTANTE**: Credenciais M-Pesa (API Key, Public Key) devem estar **apenas no backend**
- Frontend nunca deve ter acesso direto às APIs da Vodacom
- Implementar webhook `/payments/mpesa/callback` para receber confirmações
- Documentação oficial: [Vodacom M-Pesa API](https://developer.vm.co.mz/)

### Segurança
- Senhas devem ser hasheadas com bcrypt (mínimo 10 rounds)
- Implementar rate limiting em endpoints de autenticação
- Validar todos os inputs no backend
- Sanitizar dados antes de armazenar no banco
- Implementar CORS adequadamente

### Uploads de Arquivos
- Limite de tamanho: 5MB por arquivo
- Formatos aceitos: PDF, JPG, PNG, DOCX
- Armazenar em serviço de storage (AWS S3, Google Cloud Storage, etc.)
- Retornar URLs públicas ou assinadas

---

## 🚀 Próximos Passos

1. **Implementar endpoints no backend Python (Flask/FastAPI)**
2. **Configurar banco de dados (PostgreSQL recomendado)**
3. **Integrar com M-Pesa API da Vodacom**
4. **Implementar autenticação JWT**
5. **Configurar storage para arquivos**
6. **Testar todos os endpoints**
7. **Documentar com Swagger/OpenAPI**

---

## 📞 Contato

Para dúvidas sobre a integração, entre em contato com a equipe de desenvolvimento.

**Versão da Documentação:** 1.0  
**Última Atualização:** 05 de Janeiro de 2026
