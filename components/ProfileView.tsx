import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import {
    UserIcon,
    MailIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    GlobeIcon,
    BriefcaseIcon,
    CameraIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    LoaderIcon
} from './ui/icons';
import { PlusCircleIcon } from './ui/dashboard-icons';

export default function ProfileView() {
    const { user, updateUser } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        birthDate: user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        nationality: user?.nationality || 'Moçambicana',
        gender: user?.gender || 'masculino',
        occupation: user?.occupation || '',
        nuit: user?.nuit || '',
        documentType: user?.documentType || 'bi',
        documentNumber: user?.documentNumber || '',
        documentIssueDate: user?.documentIssueDate ? new Date(user.documentIssueDate).toISOString().split('T')[0] : '',
        documentExpiryDate: user?.documentExpiryDate ? new Date(user.documentExpiryDate).toISOString().split('T')[0] : '',
        neighborhood: user?.address?.neighborhood || '',
        city: user?.address?.city || 'Maputo',
        street: user?.address?.street || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('fala_comigo_token');
            const response = await fetch(`http://localhost:8000/api/v1/users/${user?.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                updateUser(result.user);
                setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
            } else {
                setMessage({ type: 'error', text: result.detail || 'Erro ao atualizar perfil.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro de conexão com o servidor.' });
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full"><CheckCircleIcon className="w-3 h-3" /> Verificado</span>;
            case 'pending':
                return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full"><LoaderIcon className="w-3 h-3 animate-spin" /> Em Análise</span>;
            case 'rejected':
                return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-red-100 text-red-700 rounded-full"><AlertCircleIcon className="w-3 h-3" /> Rejeitado</span>;
            default:
                return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-full">Não Submetido</span>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Meu Perfil</h1>
                    <p className="text-gray-500 dark:text-gray-400">Gerencie suas informações pessoais e documentos legais</p>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                    <span className="text-sm font-medium text-gray-500">Estado de Verificação (KYC)</span>
                    {getStatusBadge(user?.kycStatus || 'not_submitted')}
                </div>
            </header>

            {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <AlertCircleIcon className="w-5 h-5" />}
                    <p className="font-medium">{message.text}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                {/* Informação Básica */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-red-600" />
                        <h2 className="font-bold text-gray-800 dark:text-white">Informação Pessoal</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Nome Completo</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><UserIcon className="w-4 h-4" /></span>
                                <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 transition-all outline-none" required />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><MailIcon className="w-4 h-4" /></span>
                                <input type="email" name="email" value={formData.email} className="w-full pl-10 pr-4 py-2 border rounded-xl bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed outline-none" disabled />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Telefone</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><PhoneIcon className="w-4 h-4" /></span>
                                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Data de Nascimento</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><CalendarIcon className="w-4 h-4" /></span>
                                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Nacionalidade</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><GlobeIcon className="w-4 h-4" /></span>
                                <input name="nationality" value={formData.nationality} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Profissão</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><BriefcaseIcon className="w-4 h-4" /></span>
                                <input name="occupation" value={formData.occupation} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Localização */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-red-600" />
                        <h2 className="font-bold text-gray-800 dark:text-white">Endereço e Residência</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Cidade</label>
                            <input name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Bairro</label>
                            <input name="neighborhood" value={formData.neighborhood} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Rua/Avenida</label>
                            <input name="street" value={formData.street} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none" />
                        </div>
                    </div>
                </section>

                {/* Identificação Legal (KYC) */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-red-50 dark:border-red-900/20 overflow-hidden">
                    <div className="px-6 py-4 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <PlusCircleIcon className="w-5 h-5 text-red-600" />
                            <h2 className="font-bold text-gray-800 dark:text-white">Identificação Legal (KYC)</h2>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-red-600 px-2 py-0.5 bg-red-100 rounded">Obrigatório para processos</span>
                    </div>

                    <div className="p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Tipo de Documento</label>
                                <select name="documentType" value={formData.documentType} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none">
                                    <option value="bi">Bilhete de Identidade (BI)</option>
                                    <option value="passaporte">Passaporte</option>
                                    <option value="carta_conducao">Carta de Condução</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Número do Documento</label>
                                <input name="documentNumber" value={formData.documentNumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none" placeholder="Ex: 110200..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">NUIT</label>
                                <input name="nuit" value={formData.nuit} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none" placeholder="Número de Impostos" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Data de Emissão</label>
                                <input type="date" name="documentIssueDate" value={formData.documentIssueDate} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Data de Validade</label>
                                <input type="date" name="documentExpiryDate" value={formData.documentExpiryDate} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 outline-none" />
                            </div>
                        </div>

                        {/* Upload de Imagens */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Frente do Documento', key: 'front' },
                                { label: 'Verso do Documento', key: 'back' },
                                { label: 'Selfie com Documento', key: 'selfie' }
                            ].map((item) => (
                                <div key={item.key} className="relative group cursor-pointer border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-red-500 hover:bg-red-50 transition-all">
                                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-100">
                                        <CameraIcon className="w-6 h-6 text-gray-400 group-hover:text-red-600" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400 block">{item.label}</span>
                                    <span className="text-[10px] text-gray-400 block mt-1">JPG, PNG ou PDF (Máx 5MB)</span>
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="flex justify-end gap-4">
                    <button type="button" className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-600 hover:bg-gray-100 transition-all">Cancelar</button>
                    <button type="submit" disabled={isSaving} className="px-10 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-200 disabled:opacity-50 flex items-center gap-2">
                        {isSaving && <LoaderIcon className="w-4 h-4 animate-spin" />}
                        {isSaving ? 'Salvando...' : 'Salvar Perfil'}
                    </button>
                </div>
            </form>
        </div>
    );
}
