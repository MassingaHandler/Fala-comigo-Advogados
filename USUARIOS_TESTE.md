# Usuários de Teste - Fala Comigo

## 🔐 Credenciais de Acesso

### Usuário Normal
- **Email:** `teste@falacomigo.mz`
- **Senha:** `teste123`
- **Descrição:** Usuário com histórico de consultas para testar o dashboard

### Administrador
- **Email:** `admin@falacomigo.mz`
- **Senha:** `admin123`
- **Descrição:** Acesso completo ao sistema incluindo painel administrativo

### Advogado
- **Email/OAM:** `joao.silva@oam.mz` ou `1234/OAM`
- **Senha:** `advogado123`
- **Descrição:** Acesso ao portal do advogado com casos atribuídos
- **Perfil:**
  - Nome: Dr. João Silva
  - Especialidade: Direito de Família
  - OAM: 1234/OAM
  - Avaliação: 4.8 ⭐ (127 avaliações)
  - Status: Online

### Qualquer Usuário (Demo)
- **Email:** Qualquer email válido
- **Senha:** Qualquer senha
- **Descrição:** O sistema aceita qualquer combinação de email/senha para demonstração

## 📊 Dados de Teste

Ao fazer login com o usuário de teste, você terá acesso a:

### Estatísticas do Dashboard
- **Total de Consultas:** 8
- **Consultas Ativas:** 2
- **Consultas Concluídas:** 5
- **Consultas Este Mês:** 3

### Consultas no Histórico

1. **Consulta de Família** (Ativa)
   - ID: FC-123456
   - Advogado: Dra. Ana Silva
   - Status: Em Andamento
   - Data: Hoje

2. **Questão Trabalhista** (Ativa)
   - ID: FC-123457
   - Advogado: Dr. João Santos
   - Status: Atribuído
   - Data: Ontem

3. **Contrato de Arrendamento** (Concluída)
   - ID: FC-123458
   - Advogado: Dra. Maria Costa
   - Status: Concluído
   - Data: Há 5 dias

4. **Direitos do Consumidor** (Concluída)
   - ID: FC-123459
   - Advogado: Dr. Pedro Alves
   - Status: Concluído
   - Data: Há 1 semana

5. **Questão de Terra/DUAT** (Concluída)
   - ID: FC-123460
   - Advogado: Dra. Sofia Moreira
   - Status: Concluído
   - Data: Há 2 semanas

## 🎯 Como Testar

### 1. Testar Dashboard Melhorado
```
1. Acesse http://localhost:5173/
2. Faça login com: teste@falacomigo.mz / teste123
3. Observe:
   - Cards de estatísticas animados
   - Gráfico de atividade mensal
   - Consultas ativas
   - Atividade recente
   - Ações rápidas
```

### 2. Testar Navegação
```
1. Clique em "Nova Consulta"
2. Use breadcrumbs para voltar
3. Clique em "Histórico"
4. Teste botão voltar do navegador
```

### 3. Testar Rotas Protegidas
```
1. Abra aba anônima
2. Tente acessar: http://localhost:5173/dashboard
3. Deve redirecionar para login
4. Após login, deve ir para dashboard
```

### 4. Testar Admin
```
1. Faça login como admin
2. Clique no ícone de configurações (⚙️)
3. Acesse painel administrativo
4. Teste usuário normal - não deve ver ícone de admin
```

### 5. Testar Portal do Advogado
```
1. Acesse http://localhost:5173/
2. Na página de login, clique no botão "⚖️ Entrar" (seção "É advogado?")
   OU acesse diretamente: http://localhost:5173/portal-advogado
3. Faça login com: joao.silva@oam.mz / advogado123
   (Pode usar qualquer email/senha para demonstração)
4. Explore as funcionalidades:
   
   📊 Dashboard:
   - Visualize estatísticas (Total, Ativos, Concluídos, Receita)
   - Veja gráfico de atividade dos últimos 6 meses
   - Consulte casos ativos urgentes
   - Acesse ações rápidas
   
   📁 Casos Ativos:
   - Veja lista de 2 casos ativos
   - Use filtros (status, ordenação)
   - Busque por ID ou tópico
   - Clique "Iniciar Atendimento" em um caso
   
   💬 Chat/Atendimento:
   - Envie mensagens ao cliente
   - Adicione notas privadas (botão "📝 Notas")
   - Veja timer de duração da sessão
   - Envie documentos/pareceres
   - Conclua o caso (botão "✓ Concluir")
   
   💰 Financeiro:
   - Veja resumo financeiro (4 cards)
   - Consulte gráfico de receita mensal
   - Filtre histórico de pagamentos
   - Use busca e filtros de período
   
   📜 Histórico:
   - Veja estatísticas de casos concluídos
   - Consulte lista de casos finalizados
   - Clique em caso para ver detalhes
   
   👤 Perfil:
   - Visualize informações profissionais
   - Clique "Editar Perfil"
   - Atualize dados e salve
   - Veja estatísticas profissionais
```

## 💡 Dicas

- **Logout:** Clique no menu do usuário (canto superior direito) e selecione "Sair"
- **Trocar Usuário:** Faça logout e login com outras credenciais
- **Limpar Dados:** Abra DevTools > Application > Local Storage > Limpar
- **Dark Mode:** O sistema detecta automaticamente as preferências do sistema

## 🔄 Resetar Dados

Para resetar os dados de teste:
```javascript
// No console do navegador
localStorage.clear();
location.reload();
```

## 📝 Notas

- Todos os dados são armazenados localmente (localStorage)
- Não há persistência em banco de dados real
- Os dados são resetados ao limpar o localStorage
- Ideal para demonstração e testes de interface
