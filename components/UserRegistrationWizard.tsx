import React, { useState } from 'react';
import type { RegistrationData } from '../types';
import { validateEmail, validatePhone, validatePassword, validateDocumentNumber, validateBirthDate, validateFullName, validateOtpCode } from '../lib/validators';
import { ChevronLeftIcon, CheckCircleIcon, UserIcon, MailIcon, PhoneIcon } from './ui/icons';

interface Props {
    onComplete: (data: RegistrationData) => void;
    onBack: () => void;
}

type Step = 'personal' | 'identification' | 'contact' | 'security' | 'confirm';

const steps = [
    { id: 'personal' as Step, label: 'Pessoal', number: 1 },
    { id: 'identification' as Step, label: 'ID', number: 2 },
    { id: 'contact' as Step, label: 'Contato', number: 3 },
    { id: 'security' as Step, label: 'Segurança', number: 4 },
    { id: 'confirm' as Step, label: 'Confirmar', number: 5 },
];

const DocumentIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

export default function UserRegistrationWizard({ onComplete, onBack }: Props) {
    const [step, setStep] = useState<Step>('personal');
    const [data, setData] = useState<RegistrationData>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPhoneOtp, setShowPhoneOtp] = useState(false);
    const [showEmailVerification, setShowEmailVerification] = useState(false);

    const updateData = (field: keyof RegistrationData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateStep = (currentStep: Step): boolean => {
        const newErrors: Record<string, string> = {};
        if (currentStep === 'personal') {
            if (!data.fullName || !validateFullName(data.fullName)) newErrors.fullName = 'Nome completo inválido';
            if (!data.birthDate) newErrors.birthDate = 'Data obrigatória';
            else { const v = validateBirthDate(data.birthDate); if (!v.valid) newErrors.birthDate = v.error || 'Data inválida'; }
            if (!data.nationality) newErrors.nationality = 'Nacionalidade obrigatória';
        } else if (currentStep === 'identification') {
            if (!data.documentType) newErrors.documentType = 'Tipo obrigatório';
            if (!data.documentNumber) newErrors.documentNumber = 'Número obrigatório';
            else if (data.documentType && !validateDocumentNumber(data.documentType, data.documentNumber)) newErrors.documentNumber = 'Número inválido';
        } else if (currentStep === 'contact') {
            if (!data.phoneNumber || !validatePhone(data.phoneNumber)) newErrors.phoneNumber = 'Telefone inválido';
            if (!data.phoneVerified) newErrors.phoneNumber = 'Verifique o telefone';
            if (!data.email || !validateEmail(data.email)) newErrors.email = 'Email inválido';
            if (!data.emailVerified) newErrors.email = 'Verifique o email';
        } else if (currentStep === 'security') {
            if (!data.password) newErrors.password = 'Senha obrigatória';
            else { const v = validatePassword(data.password); if (!v.valid) newErrors.password = v.errors[0]; }
            if (data.password !== data.confirmPassword) newErrors.confirmPassword = 'Senhas não coincidem';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateStep(step)) return;
        const stepOrder: Step[] = ['personal', 'identification', 'contact', 'security', 'confirm'];
        const idx = stepOrder.indexOf(step);
        if (idx < stepOrder.length - 1) setStep(stepOrder[idx + 1]);
    };

    const handleBack = () => {
        const stepOrder: Step[] = ['personal', 'identification', 'contact', 'security', 'confirm'];
        const idx = stepOrder.indexOf(step);
        if (idx > 0) setStep(stepOrder[idx - 1]);
        else onBack();
    };

    const renderProgressBar = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 rounded-full" />
                {steps.map((s) => {
                    const stepOrder: Step[] = ['personal', 'identification', 'contact', 'security', 'confirm'];
                    const currentIdx = stepOrder.indexOf(step);
                    const stepIdx = stepOrder.indexOf(s.id);
                    const status = stepIdx < currentIdx ? 'completed' : stepIdx === currentIdx ? 'active' : 'pending';
                    return (
                        <div key={s.id} className="flex flex-col items-center relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2 ${status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                                    status === 'active' ? 'bg-red-600 border-red-600 text-white scale-110' :
                                        'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                                }`}>
                                {status === 'completed' ? '✓' : s.number}
                            </div>
                            <span className={`absolute -bottom-6 text-xs whitespace-nowrap ${status === 'active' ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-400'}`}>{s.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={handleBack} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        <ChevronLeftIcon className="w-5 h-5 mr-1" />
                        Voltar
                    </button>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Passo {steps.find(s => s.id === step)?.number}/5</span>
                </div>

                {renderProgressBar()}

                <div className="mt-10">
                    {step === 'personal' && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">Dados Pessoais</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome Completo *</label>
                                <input type="text" value={data.fullName || ''} onChange={(e) => updateData('fullName', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500`}
                                    placeholder="João Silva Santos" />
                                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data de Nascimento *</label>
                                    <input type="date" value={data.birthDate ? data.birthDate.toISOString().split('T')[0] : ''}
                                        onChange={(e) => updateData('birthDate', new Date(e.target.value))}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.birthDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500`} />
                                    {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nacionalidade *</label>
                                    <select value={data.nationality || ''} onChange={(e) => updateData('nationality', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.nationality ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500`}>
                                        <option value="">Selecione...</option>
                                        <option value="Moçambicana">Moçambicana</option>
                                        <option value="Portuguesa">Portuguesa</option>
                                        <option value="Brasileira">Brasileira</option>
                                        <option value="Outra">Outra</option>
                                    </select>
                                    {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
                                </div>
                            </div>
                            <button onClick={handleNext} className="w-full mt-6 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-all shadow-lg">
                                Próximo
                            </button>
                        </div>
                    )}

                    {step === 'identification' && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">Identificação</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tipo de Documento *</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[{ value: 'bi', label: 'BI' }, { value: 'passaporte', label: 'Passaporte' }, { value: 'carta_conducao', label: 'Carta' }].map((doc) => (
                                        <button key={doc.value} onClick={() => updateData('documentType', doc.value)}
                                            className={`p-4 rounded-lg border-2 transition-all ${data.documentType === doc.value ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-semibold' : 'border-gray-300 dark:border-gray-600 hover:border-red-300'}`}>
                                            {doc.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.documentType && <p className="text-red-500 text-xs mt-1">{errors.documentType}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número do Documento *</label>
                                <input type="text" value={data.documentNumber || ''} onChange={(e) => updateData('documentNumber', e.target.value.toUpperCase())}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.documentNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500`}
                                    placeholder="123456789012A" />
                                {errors.documentNumber && <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>}
                            </div>
                            <button onClick={handleNext} className="w-full mt-6 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-all shadow-lg">
                                Próximo
                            </button>
                        </div>
                    )}

                    {step === 'contact' && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">Contato</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefone *</label>
                                <div className="flex gap-2">
                                    <input type="tel" value={data.phoneNumber || ''} onChange={(e) => updateData('phoneNumber', e.target.value)} disabled={data.phoneVerified}
                                        className={`flex-1 px-4 py-3 rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 dark:disabled:bg-gray-800`}
                                        placeholder="+258 84 123 4567" />
                                    {!data.phoneVerified && <button onClick={() => setShowPhoneOtp(true)} className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all whitespace-nowrap">Verificar</button>}
                                    {data.phoneVerified && <div className="flex items-center px-4 py-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg"><CheckCircleIcon className="w-5 h-5" /></div>}
                                </div>
                                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                            </div>
                            {showPhoneOtp && !data.phoneVerified && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">Use <strong>123456</strong> para demo</p>
                                    <div className="flex gap-2">
                                        <input type="text" value={data.phoneOtpCode || ''} onChange={(e) => updateData('phoneOtpCode', e.target.value)} maxLength={6}
                                            className="flex-1 px-4 py-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="000000" />
                                        <button onClick={() => { if (data.phoneOtpCode === '123456') { updateData('phoneVerified', true); setShowPhoneOtp(false); } }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">Confirmar</button>
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                                <div className="flex gap-2">
                                    <input type="email" value={data.email || ''} onChange={(e) => updateData('email', e.target.value)} disabled={data.emailVerified}
                                        className={`flex-1 px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 dark:disabled:bg-gray-800`}
                                        placeholder="exemplo@email.com" />
                                    {!data.emailVerified && <button onClick={() => setShowEmailVerification(true)} className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all whitespace-nowrap">Verificar</button>}
                                    {data.emailVerified && <div className="flex items-center px-4 py-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg"><CheckCircleIcon className="w-5 h-5" /></div>}
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            {showEmailVerification && !data.emailVerified && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">Use <strong>123456</strong> para demo</p>
                                    <div className="flex gap-2">
                                        <input type="text" value={data.emailVerificationCode || ''} onChange={(e) => updateData('emailVerificationCode', e.target.value)} maxLength={6}
                                            className="flex-1 px-4 py-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="000000" />
                                        <button onClick={() => { if (data.emailVerificationCode === '123456') { updateData('emailVerified', true); setShowEmailVerification(false); } }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">Confirmar</button>
                                    </div>
                                </div>
                            )}
                            <button onClick={handleNext} className="w-full mt-6 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-all shadow-lg">
                                Próximo
                            </button>
                        </div>
                    )}

                    {step === 'security' && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">Segurança</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senha *</label>
                                <input type="password" value={data.password || ''} onChange={(e) => updateData('password', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500`}
                                    placeholder="••••••••" />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Mín. 8 caracteres, maiúsculas, números e símbolos</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirmar Senha *</label>
                                <input type="password" value={data.confirmPassword || ''} onChange={(e) => updateData('confirmPassword', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500`}
                                    placeholder="••••••••" />
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>
                            <label className="flex items-start space-x-3 cursor-pointer">
                                <input type="checkbox" checked={data.twoFactorEnabled || false} onChange={(e) => updateData('twoFactorEnabled', e.target.checked)}
                                    className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Ativar Autenticação de Dois Fatores (2FA) - recomendado</span>
                            </label>
                            <button onClick={handleNext} className="w-full mt-6 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-all shadow-lg">
                                Próximo
                            </button>
                        </div>
                    )}

                    {step === 'confirm' && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">Confirmar Registro</h3>
                            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl space-y-4">
                                <div className="flex items-start gap-4">
                                    <UserIcon className="w-6 h-6 text-red-600 dark:text-red-400 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Dados Pessoais</p>
                                        <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{data.fullName}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{data.birthDate?.toLocaleDateString('pt-PT')} • {data.nationality}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <DocumentIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Identificação</p>
                                        <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{data.documentType === 'bi' ? 'BI' : data.documentType === 'passaporte' ? 'Passaporte' : 'Carta de Condução'}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{data.documentNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <PhoneIcon className="w-6 h-6 text-green-600 dark:text-green-400 mt-1" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Contato</p>
                                        <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{data.phoneNumber} ✓</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{data.email} ✓</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => onComplete(data)} className="w-full mt-6 bg-red-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-red-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5">
                                Criar Conta
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
