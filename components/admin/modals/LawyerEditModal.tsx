import React, { useState, useEffect } from 'react';
import Modal from '../../ui/Modal';

interface AdminLawyer {
    id: string;
    nome: string;
    especialidade: string;
    phone: string;
    email?: string;
    city?: string;
    province?: string;
    officeAddress?: string;
    status: 'active' | 'inactive';
}

interface LawyerEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    lawyer: AdminLawyer | null;
    onSave: () => void;
}

const SPECIALTIES = ['Família', 'Trabalho', 'Terra/DUAT', 'Consumo', 'Outros', 'Penal', 'Civil', 'Comercial'];
const PROVINCES = ['Maputo Cidade', 'Maputo Província', 'Gaza', 'Inhambane', 'Sofala', 'Manica', 'Tete', 'Zambézia', 'Nampula', 'Cabo Delgado', 'Niassa'];

export default function LawyerEditModal({ isOpen, onClose, lawyer, onSave }: LawyerEditModalProps) {
    const [formData, setFormData] = useState<any>({
        nome: '', especialidade: '', professional_phone: '',
        professional_email: '', city: '', province: '', office_address: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (lawyer) {
            setFormData({
                nome: lawyer.nome || '',
                especialidade: lawyer.especialidade || '',
                professional_phone: lawyer.phone || '',
                professional_email: lawyer.email || '',
                city: lawyer.city || '',
                province: lawyer.province || '',
                office_address: (lawyer as any).officeAddress || ''
            });
        }
        setError(null);
    }, [lawyer, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lawyer) return;
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('fala_comigo_token');
            const response = await fetch(`http://localhost:8000/api/v1/admin/lawyers/${lawyer.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (response.ok && result.success) {
                onSave();
            } else {
                setError(result.detail || 'Erro ao atualizar advogado');
            }
        } catch {
            setError('Erro de conexão com o servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Advogado" size="lg">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Avatar preview */}
                <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {formData.nome?.charAt(0) || '?'}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{formData.nome || 'Advogado'}</h3>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400">{formData.especialidade || 'Especialidade'}</p>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo *</label>
                        <input
                            type="text"
                            value={formData.nome}
                            onChange={(e) => handleChange('nome', e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Especialidade *</label>
                        <select
                            value={formData.especialidade}
                            onChange={(e) => handleChange('especialidade', e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Selecionar...</option>
                            {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
                        <input
                            type="tel"
                            value={formData.professional_phone}
                            onChange={(e) => handleChange('professional_phone', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.professional_email}
                            onChange={(e) => handleChange('professional_email', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade</label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Província</label>
                        <select
                            value={formData.province}
                            onChange={(e) => handleChange('province', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Selecionar...</option>
                            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endereço do Escritório</label>
                        <input
                            type="text"
                            value={formData.office_address}
                            onChange={(e) => handleChange('office_address', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Salvando...
                            </span>
                        ) : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
