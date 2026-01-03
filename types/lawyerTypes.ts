// Lawyer Registration Types
export interface LawyerRegistrationData {
    // Dados Pessoais
    fullName: string;
    birthDate: Date | null;
    nationality: string;

    // Identificação
    documentType: 'bi' | 'passport' | '';
    documentFile: File | null;
    documentNumber: string;
    documentIssueDate: Date | null;
    documentExpiryDate: Date | null;

    // Profissional
    oamNumber: string;
    oamCardFile: File | null;
    oamRegistrationYear: number | null;
    specializations: string[];
    cvFile: File | null;

    // Documentos Adicionais
    additionalDocs: File[];

    // Contato
    professionalEmail: string;
    professionalPhone: string;
    officeAddress: string;
    city: string;
    province: string;

    // Compliance
    termsAccepted: boolean;
    legalDeclaration: boolean;
    verificationAuthorization: boolean;
}

export const SPECIALIZATIONS = [
    'Direito Penal',
    'Direito Laboral',
    'Direito de Família',
    'Direito Imobiliário/DUAT',
    'Direito do Consumidor',
    'Direito Empresarial',
    'Direito Tributário',
    'Direito Administrativo',
    'Direito Civil',
    'Outros'
];

export const MOZAMBIQUE_PROVINCES = [
    'Maputo Cidade',
    'Maputo Província',
    'Gaza',
    'Inhambane',
    'Sofala',
    'Manica',
    'Tete',
    'Zambézia',
    'Nampula',
    'Niassa',
    'Cabo Delgado'
];

export const NATIONALITIES = [
    'Moçambicana',
    'Portuguesa',
    'Brasileira',
    'Sul-Africana',
    'Zimbabweana',
    'Outra'
];
