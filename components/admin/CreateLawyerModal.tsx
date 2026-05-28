import { useState } from 'react';
import { X, User, FileText, Briefcase, Phone, Check } from 'lucide-react';

interface CreateLawyerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const SPECIALIZATIONS = [
    'Direito Penal',
    'Direito Laboral',
    'Direito de Família',
    'Direito Imobiliário/DUAT',
    'Direito do Consumidor',
    'Direito Empresarial',
    'Direito Tributário',
    'Direito Administrativo',
    'Direito Civil',
];

const PROVINCES = [
    'Maputo Cidade', 'Maputo Província', 'Gaza', 'Inhambane', 'Sofala', 'Manica',
    'Tete', 'Zambézia', 'Nampula', 'Niassa', 'Cabo Delgado'
];

const STEPS = [
    { label: 'Pessoal', icon: User },
    { label: 'Identidade', icon: FileText },
    { label: 'Profissional', icon: Briefcase },
    { label: 'Contato', icon: Phone },
];

const initialForm = {
    nome: '',
    especialidade: '',
    birth_date: '',
    nationality: 'Moçambicana',
    document_type: 'bi',
    document_number: '',
    document_issue_date: '',
    document_expiry_date: '',
    oam_number: '',
    oam_registration_year: new Date().getFullYear(),
    specializations: [] as string[],
    professional_email: '',
    professional_phone: '',
    office_address: '',
    city: '',
    province: '',
    password: '',
};

export default function CreateLawyerModal({ isOpen, onClose, onSuccess }: CreateLawyerModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [formData, setFormData] = useState(initialForm);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleSpecialization = (spec: string) => {
        setFormData(prev => {
            const updated = prev.specializations.includes(spec)
                ? prev.specializations.filter(s => s !== spec)
                : [...prev.specializations, spec];
            // Auto-set especialidade from first selected
            return {
                ...prev,
                specializations: updated,
                especialidade: updated[0] || prev.especialidade,
            };
        });
    };

    const validateStep = (stepNum: number): boolean => {
        setError('');
        if (stepNum === 1) {
            if (!formData.nome.trim()) return setError('Nome completo é obrigatório'), false;
            if (!formData.birth_date) return setError('Data de nascimento é obrigatória'), false;
        } else if (stepNum === 2) {
            if (!formData.document_number.trim()) return setError('Número do documento é obrigatório'), false;
            if (!formData.document_issue_date) return setError('Data de emissão é obrigatória'), false;
            if (!formData.document_expiry_date) return setError('Data de validade é obrigatória'), false;
        } else if (stepNum === 3) {
            if (!formData.oam_number.trim()) return setError('Número OAM é obrigatório'), false;
            if (formData.specializations.length === 0) return setError('Selecione pelo menos uma especialização'), false;
        } else if (stepNum === 4) {
            if (!formData.professional_email.trim()) return setError('Email profissional é obrigatório'), false;
            if (!formData.professional_phone.trim()) return setError('Telefone é obrigatório'), false;
            if (!formData.province) return setError('Província é obrigatória'), false;
            if (!formData.password.trim()) return setError('Defina uma senha para o advogado'), false;
            if (formData.password.length < 6) return setError('A senha deve ter pelo menos 6 caracteres'), false;
        }
        return true;
    };

    const handleNext = () => { if (validateStep(step)) setStep(s => s + 1); };
    const handleBack = () => { setError(''); setStep(s => s - 1); };

    const handleClose = () => {
        setStep(1);
        setError('');
        setSuccessMsg('');
        setFormData(initialForm);
        onClose();
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) return;
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('fala_comigo_token');
            if (!token) { setError('Sessão expirada. Faça login novamente.'); return; }

            const response = await fetch('http://localhost:8000/api/v1/admin/lawyers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setSuccessMsg(`Advogado ${formData.nome} criado com sucesso!`);
                setTimeout(() => {
                    onSuccess();
                    handleClose();
                }, 2000);
            } else {
                setError(result.detail || 'Erro ao criar advogado');
            }
        } catch {
            setError('Erro de conexão com o servidor');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Cadastrar Advogado</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Passo {step} de 4 — {STEPS[step - 1].label}</p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pt-4 pb-2 flex-shrink-0">
                    <div className="flex items-center">
                        {STEPS.map((s, index) => {
                            const num = index + 1;
                            const done = num < step;
                            const active = num === step;
                            const Icon = s.icon;
                            return (
                                <div key={num} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                            done ? 'bg-green-500 text-white' :
                                            active ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900' :
                                            'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                        }`}>
                                            {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                        </div>
                                        <span className={`text-xs mt-1 font-medium ${active ? 'text-indigo-600 dark:text-indigo-400' : done ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${done ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content — scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                            <span className="mt-0.5">⚠️</span> {error}
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                            <Check className="w-4 h-4" /> {successMsg}
                        </div>
                    )}

                    {/* Step 1: Dados Pessoais */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo *</label>
                                <input type="text" name="nome" value={formData.nome} onChange={handleInputChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    placeholder="Ex: Dr. João Manuel Silva" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Nascimento *</label>
                                    <input type="date" name="birth_date" value={formData.birth_date} onChange={handleInputChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nacionalidade</label>
                                    <select name="nationality" value={formData.nationality} onChange={handleInputChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                                        <option>Moçambicana</option>
                                        <option>Portuguesa</option>
                                        <option>Brasileira</option>
                                        <option>Sul-Africana</option>
                                        <option>Outra</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Identificação */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Documento</label>
                                    <select name="document_type" value={formData.document_type} onChange={handleInputChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                                        <option value="bi">Bilhete de Identidade (BI)</option>
                                        <option value="passport">Passaporte</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número do Documento *</label>
                                    <input type="text" name="document_number" value={formData.document_number} onChange={handleInputChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                        placeholder="123456789A" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Emissão *</label>
                                    <input type="date" name="document_issue_date" value={formData.document_issue_date} onChange={handleInputChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Validade *</label>
                                    <input type="date" name="document_expiry_date" value={formData.document_expiry_date} onChange={handleInputChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Dados Profissionais */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número OAM *</label>
                                    <input type="text" name="oam_number" value={formData.oam_number} onChange={handleInputChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                        placeholder="1234/OAM" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ano de Inscrição OAM</label>
                                    <input type="number" name="oam_registration_year" value={formData.oam_registration_year} onChange={handleInputChange}
                                        min={1990} max={new Date().getFullYear()}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Especializações * <span className="text-xs text-gray-400 font-normal">(a 1ª selecionada será a principal)</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                    {SPECIALIZATIONS.map((spec, i) => {
                                        const checked = formData.specializations.includes(spec);
                                        const isFirst = formData.specializations[0] === spec;
                                        return (
                                            <label key={spec} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${checked ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                                                <input type="checkbox" checked={checked} onChange={() => toggleSpecialization(spec)}
                                                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{spec}</span>
                                                {isFirst && <span className="ml-auto text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded font-medium">Principal</span>}
                                            </label>
                                        );
                                    })}
                                </div>
                                {formData.specializations.length > 0 && (
                                    <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400">
                                        Especialidade principal: <strong>{formData.specializations[0]}</strong>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Contato e Acesso */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Profissional *</label>
                                    <input type="email" name="professional_email" value={formData.professional_email} onChange={handleInputChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                        placeholder="joao@escritorio.co.mz" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone *</label>
                                    <input type="tel" name="professional_phone" value={formData.professional_phone} onChange={handleInputChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                        placeholder="+258 84 123 4567" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endereço do Escritório</label>
                                <textarea name="office_address" value={formData.office_address} onChange={handleInputChange} rows={2}
                                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                                    placeholder="Av. Julius Nyerere, 123, 1º Andar" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                        placeholder="Maputo" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Província *</label>
                                    <select name="province" value={formData.province} onChange={handleInputChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                                        <option value="">Selecione a província...</option>
                                        {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha de Acesso *</label>
                                <input type="password" name="password" value={formData.password} onChange={handleInputChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    placeholder="Mínimo 6 caracteres" />
                                <p className="mt-1 text-xs text-gray-400">O advogado usará este email e senha para aceder à plataforma.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-2xl flex-shrink-0">
                    <button onClick={step === 1 ? handleClose : handleBack} disabled={loading}
                        className="px-5 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm font-medium">
                        {step === 1 ? 'Cancelar' : '← Voltar'}
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{step}/4</span>
                        <button onClick={step === 4 ? handleSubmit : handleNext} disabled={loading}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm font-medium flex items-center gap-2">
                            {loading ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processando...</>
                            ) : step === 4 ? (
                                <><Check className="w-4 h-4" /> Criar Advogado</>
                            ) : 'Próximo →'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
