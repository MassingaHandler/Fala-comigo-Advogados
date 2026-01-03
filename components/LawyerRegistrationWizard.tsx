import React, { useState } from 'react';
import type { LawyerRegistrationData, SPECIALIZATIONS, MOZAMBIQUE_PROVINCES, NATIONALITIES } from '../types/lawyerTypes';
import { validateFullName, validateLawyerAge, validateOAMNumber, validateProfessionalEmail, validatePhone } from '../lib/validators';
import { ChevronLeftIcon } from './ui/icons';
import ProgressIndicator from './ui/ProgressIndicator';
import DocumentUpload from './ui/DocumentUpload';

interface Props {
    onComplete: (data: LawyerRegistrationData) => void;
    onBack: () => void;
}

const SPECIALIZATIONS_LIST = [
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

const PROVINCES = [
    'Maputo Cidade', 'Maputo Província', 'Gaza', 'Inhambane', 'Sofala', 'Manica',
    'Tete', 'Zambézia', 'Nampula', 'Niassa', 'Cabo Delgado'
];

const NATIONALITIES_LIST = ['Moçambicana', 'Portuguesa', 'Brasileira', 'Sul-Africana', 'Zimbabweana', 'Outra'];

export default function LawyerRegistrationWizard({ onComplete, onBack }: Props) {
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<LawyerRegistrationData>({
        fullName: '',
        birthDate: null,
        nationality: '',
        documentType: '',
        documentFile: null,
        documentNumber: '',
        documentIssueDate: null,
        documentExpiryDate: null,
        oamNumber: '',
        oamCardFile: null,
        oamRegistrationYear: null,
        specializations: [],
        cvFile: null,
        additionalDocs: [],
        professionalEmail: '',
        professionalPhone: '',
        officeAddress: '',
        city: '',
        province: '',
        termsAccepted: false,
        legalDeclaration: false,
        verificationAuthorization: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const steps = [
        { number: 1, title: 'Dados Pessoais', completed: currentStep > 1 },
        { number: 2, title: 'Identificação', completed: currentStep > 2 },
        { number: 3, title: 'Profissional', completed: currentStep > 3 },
        { number: 4, title: 'Documentos', completed: currentStep > 4 },
        { number: 5, title: 'Contato', completed: currentStep > 5 },
        { number: 6, title: 'Revisão', completed: currentStep > 6 },
    ];

    const updateData = (field: keyof LawyerRegistrationData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!data.fullName || !validateFullName(data.fullName)) {
                newErrors.fullName = 'Nome completo inválido (mínimo 2 palavras)';
            }
            if (!data.birthDate) {
                newErrors.birthDate = 'Data de nascimento obrigatória';
            } else {
                const validation = validateLawyerAge(data.birthDate);
                if (!validation.valid) newErrors.birthDate = validation.error || 'Data inválida';
            }
            if (!data.nationality) newErrors.nationality = 'Nacionalidade obrigatória';
        } else if (step === 2) {
            if (!data.documentType) newErrors.documentType = 'Tipo de documento obrigatório';
            if (!data.documentFile) newErrors.documentFile = 'Upload do documento obrigatório';
            if (!data.documentNumber) newErrors.documentNumber = 'Número do documento obrigatório';
            if (!data.documentIssueDate) newErrors.documentIssueDate = 'Data de emissão obrigatória';
            if (!data.documentExpiryDate) newErrors.documentExpiryDate = 'Data de validade obrigatória';
        } else if (step === 3) {
            if (!data.oamNumber || !validateOAMNumber(data.oamNumber)) {
                newErrors.oamNumber = 'Número OAM inválido (4-6 dígitos)';
            }
            if (!data.oamCardFile) newErrors.oamCardFile = 'Upload da carteira OAM obrigatório';
            if (!data.oamRegistrationYear) newErrors.oamRegistrationYear = 'Ano de inscrição obrigatório';
            if (data.specializations.length === 0) newErrors.specializations = 'Selecione pelo menos uma especialização';
            if (!data.cvFile) newErrors.cvFile = 'Upload do CV obrigatório';
        } else if (step === 5) {
            if (!data.professionalEmail || !validateProfessionalEmail(data.professionalEmail)) {
                newErrors.professionalEmail = 'Email profissional inválido';
            }
            if (!data.professionalPhone || !validatePhone(data.professionalPhone)) {
                newErrors.professionalPhone = 'Telefone inválido';
            }
            if (!data.officeAddress) newErrors.officeAddress = 'Endereço do escritório obrigatório';
            if (!data.city) newErrors.city = 'Cidade obrigatória';
            if (!data.province) newErrors.province = 'Província obrigatória';
        } else if (step === 6) {
            if (!data.termsAccepted) newErrors.termsAccepted = 'Deve aceitar os termos';
            if (!data.legalDeclaration) newErrors.legalDeclaration = 'Declaração obrigatória';
            if (!data.verificationAuthorization) newErrors.verificationAuthorization = 'Autorização obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) return;
        if (currentStep < 6) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
        else onBack();
    };

    const handleSubmit = () => {
        if (!validateStep(6)) return;
        onComplete(data);
    };

    const toggleSpecialization = (spec: string) => {
        const current = data.specializations;
        if (current.includes(spec)) {
            updateData('specializations', current.filter(s => s !== spec));
        } else {
            updateData('specializations', [...current, spec]);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        <ChevronLeftIcon className="w-5 h-5 mr-1" />
                        Voltar
                    </button>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Registro de Advogado</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Etapa {currentStep} de 6</p>
                    </div>
                    <div className="w-20" /> {/* Spacer for centering */}
                </div>

                {/* Progress Indicator */}
                <ProgressIndicator steps={steps} currentStep={currentStep} onStepClick={(step) => step < currentStep && setCurrentStep(step)} />

                {/* Step Content */}
                <div className="mt-8">
                    {/* Step 1: Dados Pessoais */}
                    {currentStep === 1 && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
                                Dados Pessoais
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nome Completo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.fullName}
                                    onChange={(e) => updateData('fullName', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="Dr. João Silva Santos"
                                />
                                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Data de Nascimento <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.birthDate ? data.birthDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => updateData('birthDate', new Date(e.target.value))}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.birthDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    />
                                    {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nacionalidade <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.nationality}
                                        onChange={(e) => updateData('nationality', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.nationality ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    >
                                        <option value="">Selecione...</option>
                                        {NATIONALITIES_LIST.map(nat => (
                                            <option key={nat} value={nat}>{nat}</option>
                                        ))}
                                    </select>
                                    {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
                                </div>
                            </div>
                            <button
                                onClick={handleNext}
                                className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all shadow-lg"
                            >
                                Próximo
                            </button>
                        </div>
                    )}

                    {/* Step 2: Identificação Pessoal */}
                    {currentStep === 2 && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
                                Identificação Pessoal
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Tipo de Documento <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'bi', label: 'Bilhete de Identidade' },
                                        { value: 'passport', label: 'Passaporte' }
                                    ].map((doc) => (
                                        <button
                                            key={doc.value}
                                            type="button"
                                            onClick={() => updateData('documentType', doc.value)}
                                            className={`p-4 rounded-lg border-2 transition-all ${data.documentType === doc.value
                                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-semibold'
                                                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-300'
                                                }`}
                                        >
                                            {doc.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.documentType && <p className="text-red-500 text-xs mt-1">{errors.documentType}</p>}
                            </div>
                            <DocumentUpload
                                label="Upload do Documento"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onFileSelect={(file) => updateData('documentFile', file)}
                                currentFile={data.documentFile}
                                required
                                helpText="Formatos aceitos: PDF, JPG, PNG (máx 5MB)"
                            />
                            {errors.documentFile && <p className="text-red-500 text-xs mt-1">{errors.documentFile}</p>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Número do Documento <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.documentNumber}
                                    onChange={(e) => updateData('documentNumber', e.target.value.toUpperCase())}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.documentNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="123456789012A"
                                />
                                {errors.documentNumber && <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Data de Emissão <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.documentIssueDate ? data.documentIssueDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => updateData('documentIssueDate', new Date(e.target.value))}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.documentIssueDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    />
                                    {errors.documentIssueDate && <p className="text-red-500 text-xs mt-1">{errors.documentIssueDate}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Data de Validade <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.documentExpiryDate ? data.documentExpiryDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => updateData('documentExpiryDate', new Date(e.target.value))}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.documentExpiryDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    />
                                    {errors.documentExpiryDate && <p className="text-red-500 text-xs mt-1">{errors.documentExpiryDate}</p>}
                                </div>
                            </div>
                            <button
                                onClick={handleNext}
                                className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all shadow-lg"
                            >
                                Próximo
                            </button>
                        </div>
                    )}

                    {/* Step 3: Informação Profissional */}
                    {currentStep === 3 && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
                                Informação Profissional
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Número OAM <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.oamNumber}
                                        onChange={(e) => updateData('oamNumber', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.oamNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                        placeholder="12345"
                                    />
                                    {errors.oamNumber && <p className="text-red-500 text-xs mt-1">{errors.oamNumber}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Ano de Inscrição na OAM <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1950"
                                        max={new Date().getFullYear()}
                                        value={data.oamRegistrationYear || ''}
                                        onChange={(e) => updateData('oamRegistrationYear', parseInt(e.target.value))}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.oamRegistrationYear ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                        placeholder="2020"
                                    />
                                    {errors.oamRegistrationYear && <p className="text-red-500 text-xs mt-1">{errors.oamRegistrationYear}</p>}
                                </div>
                            </div>
                            <DocumentUpload
                                label="Carteira Profissional OAM"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onFileSelect={(file) => updateData('oamCardFile', file)}
                                currentFile={data.oamCardFile}
                                required
                                helpText="Upload da sua carteira profissional da OAM"
                            />
                            {errors.oamCardFile && <p className="text-red-500 text-xs mt-1">{errors.oamCardFile}</p>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Especializações <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {SPECIALIZATIONS_LIST.map((spec) => (
                                        <button
                                            key={spec}
                                            type="button"
                                            onClick={() => toggleSpecialization(spec)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${data.specializations.includes(spec)
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {data.specializations.includes(spec) && '✓ '}
                                            {spec}
                                        </button>
                                    ))}
                                </div>
                                {errors.specializations && <p className="text-red-500 text-xs mt-1">{errors.specializations}</p>}
                            </div>
                            <DocumentUpload
                                label="Curriculum Vitae (CV)"
                                accept=".pdf"
                                onFileSelect={(file) => updateData('cvFile', file)}
                                currentFile={data.cvFile}
                                required
                                helpText="Apenas PDF (máx 5MB)"
                            />
                            {errors.cvFile && <p className="text-red-500 text-xs mt-1">{errors.cvFile}</p>}
                            <button
                                onClick={handleNext}
                                className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all shadow-lg"
                            >
                                Próximo
                            </button>
                        </div>
                    )}

                    {/* Step 4: Documentos Adicionais (Opcional) */}
                    {currentStep === 4 && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
                                Documentos Adicionais
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                                Esta etapa é opcional. Você pode adicionar certificados, comprovantes de experiência ou outros documentos relevantes.
                            </p>
                            <div className="space-y-4">
                                {data.additionalDocs.map((doc, index) => (
                                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="text-2xl">📎</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{doc.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{(doc.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => updateData('additionalDocs', data.additionalDocs.filter((_, i) => i !== index))}
                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <DocumentUpload
                                label="Adicionar Documento"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onFileSelect={(file) => {
                                    if (file) {
                                        updateData('additionalDocs', [...data.additionalDocs, file]);
                                    }
                                }}
                                currentFile={null}
                                helpText="Certificados, comprovantes de experiência, etc."
                            />
                            <button
                                onClick={handleNext}
                                className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all shadow-lg"
                            >
                                Próximo
                            </button>
                        </div>
                    )}

                    {/* Step 5: Contato Profissional */}
                    {currentStep === 5 && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
                                Contato Profissional
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Profissional <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.professionalEmail}
                                    onChange={(e) => updateData('professionalEmail', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.professionalEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="joao.silva@escritorio.com"
                                />
                                {errors.professionalEmail && <p className="text-red-500 text-xs mt-1">{errors.professionalEmail}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Telefone Profissional <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={data.professionalPhone}
                                    onChange={(e) => updateData('professionalPhone', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.professionalPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="+258 84 123 4567"
                                />
                                {errors.professionalPhone && <p className="text-red-500 text-xs mt-1">{errors.professionalPhone}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Endereço do Escritório <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.officeAddress}
                                    onChange={(e) => updateData('officeAddress', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.officeAddress ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="Av. Julius Nyerere, 123"
                                />
                                {errors.officeAddress && <p className="text-red-500 text-xs mt-1">{errors.officeAddress}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Cidade <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => updateData('city', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                        placeholder="Maputo"
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Província <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.province}
                                        onChange={(e) => updateData('province', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.province ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    >
                                        <option value="">Selecione...</option>
                                        {PROVINCES.map(prov => (
                                            <option key={prov} value={prov}>{prov}</option>
                                        ))}
                                    </select>
                                    {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                                </div>
                            </div>
                            <button
                                onClick={handleNext}
                                className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all shadow-lg"
                            >
                                Próximo
                            </button>
                        </div>
                    )}

                    {/* Step 6: Compliance e Revisão */}
                    {currentStep === 6 && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
                                Revisão e Confirmação
                            </h3>

                            {/* Summary */}
                            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Dados Pessoais</p>
                                    <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{data.fullName}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {data.birthDate?.toLocaleDateString('pt-PT')} • {data.nationality}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Informação Profissional</p>
                                    <p className="font-bold text-gray-800 dark:text-gray-200">OAM Nº {data.oamNumber}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Inscrito em {data.oamRegistrationYear} • {data.specializations.length} especialização(ões)
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Contato</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{data.professionalEmail}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{data.professionalPhone}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{data.officeAddress}, {data.city}, {data.province}</p>
                                </div>
                            </div>

                            {/* Compliance Checkboxes */}
                            <div className="space-y-4 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.termsAccepted}
                                        onChange={(e) => updateData('termsAccepted', e.target.checked)}
                                        className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Aceito os <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Termos e Condições</span> da plataforma <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                {errors.termsAccepted && <p className="text-red-500 text-xs">{errors.termsAccepted}</p>}

                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.legalDeclaration}
                                        onChange={(e) => updateData('legalDeclaration', e.target.checked)}
                                        className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Declaro que exerço a advocacia legalmente em Moçambique <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                {errors.legalDeclaration && <p className="text-red-500 text-xs">{errors.legalDeclaration}</p>}

                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.verificationAuthorization}
                                        onChange={(e) => updateData('verificationAuthorization', e.target.checked)}
                                        className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Autorizo a verificação dos meus documentos e credenciais junto à OAM <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                {errors.verificationAuthorization && <p className="text-red-500 text-xs">{errors.verificationAuthorization}</p>}
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                            >
                                Submeter Registro
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
