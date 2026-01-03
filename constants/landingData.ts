// Landing Page Data Constants

export const STATISTICS = {
    casesResolved: 2847,
    registeredLawyers: 156,
    activeLawyers: 42,
    averageResponseTime: '8 minutos',
    satisfactionRate: 98,
    citiesCovered: 11
};

export const CASE_TYPES = [
    { name: 'Família', count: 892, percentage: 31, color: '#dc2626' },
    { name: 'Trabalho', count: 654, percentage: 23, color: '#ea580c' },
    { name: 'Comercial', count: 512, percentage: 18, color: '#d97706' },
    { name: 'Penal', count: 398, percentage: 14, color: '#ca8a04' },
    { name: 'Terra/DUAT', count: 256, percentage: 9, color: '#65a30d' },
    { name: 'Outros', count: 135, percentage: 5, color: '#6b7280' }
];

export const TESTIMONIALS = [
    {
        id: 1,
        name: 'Maria Silva',
        location: 'Maputo',
        rating: 5,
        text: 'Consegui falar com um advogado em menos de 10 minutos. Atendimento excelente e resolveram meu problema rapidamente!',
        avatar: 'MS',
        date: '2024-12-15'
    },
    {
        id: 2,
        name: 'João Macamo',
        location: 'Matola',
        rating: 5,
        text: 'Plataforma muito profissional. O advogado foi atencioso e me ajudou com meu caso trabalhista. Recomendo!',
        avatar: 'JM',
        date: '2024-12-10'
    },
    {
        id: 3,
        name: 'Ana Costa',
        location: 'Beira',
        rating: 5,
        text: 'Serviço rápido e confiável. Finalmente uma forma fácil de obter ajuda jurídica em Moçambique.',
        avatar: 'AC',
        date: '2024-12-08'
    },
    {
        id: 4,
        name: 'Carlos Nhantumbo',
        location: 'Nampula',
        rating: 5,
        text: 'Excelente plataforma! Consegui resolver meu problema de terra sem sair de casa. Muito satisfeito.',
        avatar: 'CN',
        date: '2024-12-05'
    },
    {
        id: 5,
        name: 'Beatriz Mondlane',
        location: 'Maputo',
        rating: 5,
        text: 'Advogados qualificados e preços justos. O atendimento foi muito profissional e eficiente.',
        avatar: 'BM',
        date: '2024-12-01'
    },
    {
        id: 6,
        name: 'Pedro Sitoe',
        location: 'Xai-Xai',
        rating: 4,
        text: 'Boa experiência. O processo foi simples e o advogado me ajudou bastante com meu caso familiar.',
        avatar: 'PS',
        date: '2024-11-28'
    }
];

export const PRICING_PLANS = [
    {
        id: 'single',
        name: 'Consulta Única',
        price: 500,
        period: 'por consulta',
        description: 'Ideal para questões pontuais',
        features: [
            'Uma consulta jurídica',
            'Chat com advogado verificado',
            'Upload de documentos',
            'Resposta em até 30 minutos',
            'Suporte por 7 dias'
        ],
        cta: 'Começar Agora',
        popular: false
    },
    {
        id: 'monthly',
        name: 'Plano Mensal',
        price: 1500,
        period: 'por mês',
        description: 'Para acompanhamento contínuo',
        features: [
            'Consultas ilimitadas',
            'Advogado dedicado',
            'Upload ilimitado de documentos',
            'Prioridade no atendimento',
            'Suporte 24/7',
            'Acompanhamento de processos',
            'Relatórios mensais'
        ],
        cta: 'Assinar Agora',
        popular: true,
        badge: 'Mais Popular'
    },
    {
        id: 'business',
        name: 'Plano Empresarial',
        price: 5000,
        period: 'por mês',
        description: 'Soluções jurídicas para empresas',
        features: [
            'Tudo do Plano Mensal',
            'Múltiplos usuários (até 10)',
            'Equipe de advogados dedicada',
            'Consultoria estratégica',
            'Revisão de contratos',
            'Compliance empresarial',
            'Gestor de conta dedicado',
            'SLA garantido'
        ],
        cta: 'Contactar Vendas',
        popular: false
    }
];

export const FAQS = [
    {
        id: 1,
        category: 'Geral',
        question: 'O que é o Fala Comigo?',
        answer: 'Fala Comigo é uma plataforma digital que conecta clientes a advogados verificados em Moçambique. Oferecemos atendimento jurídico rápido, seguro e acessível através de chat, vídeo ou telefone.'
    },
    {
        id: 2,
        category: 'Geral',
        question: 'Como funciona o serviço?',
        answer: 'É simples: você descreve seu problema no chat, nosso sistema analisa e encaminha para o advogado mais adequado, o advogado aceita o caso e inicia o atendimento. Tudo online e seguro.'
    },
    {
        id: 3,
        category: 'Advogados',
        question: 'Os advogados são verificados?',
        answer: 'Sim! Todos os advogados passam por um rigoroso processo de verificação, incluindo validação de registro na Ordem dos Advogados de Moçambique (OAM), documentos de identificação e qualificações profissionais.'
    },
    {
        id: 4,
        category: 'Pagamento',
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'Aceitamos M-Pesa, e-Mola e outras carteiras digitais. O pagamento é seguro e só é processado após confirmação do serviço.'
    },
    {
        id: 5,
        category: 'Segurança',
        question: 'Meus dados estão seguros?',
        answer: 'Absolutamente! Utilizamos criptografia de ponta a ponta para proteger todas as comunicações e dados. Seguimos rigorosos padrões de confidencialidade e conformidade legal.'
    },
    {
        id: 6,
        category: 'Atendimento',
        question: 'Quanto tempo demora para ser atendido?',
        answer: 'O tempo médio de resposta é de 8 minutos. Em casos urgentes, você pode ser atendido em menos de 5 minutos, dependendo da disponibilidade dos advogados.'
    },
    {
        id: 7,
        category: 'Casos',
        question: 'Que tipos de casos vocês atendem?',
        answer: 'Atendemos casos de Família, Trabalho, Comercial, Penal, Terra/DUAT, Consumo e muitos outros. Se tiver dúvidas, nosso chat inicial ajudará a identificar o tipo de caso.'
    },
    {
        id: 8,
        category: 'Planos',
        question: 'Posso cancelar meu plano a qualquer momento?',
        answer: 'Sim! Não há período de fidelização. Você pode cancelar seu plano mensal a qualquer momento, e ele permanecerá ativo até o final do período pago.'
    }
];

export const HOW_IT_WORKS_STEPS = [
    {
        step: 1,
        title: 'Descreva seu problema',
        description: 'Use nosso chat inteligente para descrever sua situação jurídica de forma simples e rápida.',
        icon: 'MessageSquare'
    },
    {
        step: 2,
        title: 'Sistema analisa e encaminha',
        description: 'Nossa plataforma identifica o tipo de caso e encontra o advogado mais adequado para você.',
        icon: 'Search'
    },
    {
        step: 3,
        title: 'Advogado aceita o caso',
        description: 'Um advogado verificado aceita seu caso e entra em contato rapidamente.',
        icon: 'UserCheck'
    },
    {
        step: 4,
        title: 'Atendimento e acompanhamento',
        description: 'Receba atendimento profissional e acompanhe todo o processo pela plataforma.',
        icon: 'CheckCircle'
    }
];

export const FEATURES = [
    {
        title: 'Atendimento Rápido',
        description: 'Resposta média em 8 minutos',
        icon: 'Zap'
    },
    {
        title: 'Advogados Verificados',
        description: 'Todos registados na OAM',
        icon: 'Shield'
    },
    {
        title: 'Seguro e Confidencial',
        description: 'Criptografia de ponta a ponta',
        icon: 'Lock'
    },
    {
        title: 'Preços Acessíveis',
        description: 'Planos para todos os orçamentos',
        icon: 'DollarSign'
    },
    {
        title: 'Disponível 24/7',
        description: 'Atendimento a qualquer hora',
        icon: 'Clock'
    },
    {
        title: 'Múltiplas Especialidades',
        description: 'Advogados para todos os casos',
        icon: 'Briefcase'
    }
];

export const TRUST_BADGES = [
    {
        name: 'OAM Certificado',
        description: 'Ordem dos Advogados de Moçambique'
    },
    {
        name: 'Dados Protegidos',
        description: 'Criptografia SSL/TLS'
    },
    {
        name: 'Pagamento Seguro',
        description: 'Transações protegidas'
    },
    {
        name: 'Conformidade Legal',
        description: 'Acordo com legislação moçambicana'
    }
];
