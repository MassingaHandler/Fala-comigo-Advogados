import React, { useState } from 'react';
import Modal from '../../ui/Modal';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    totalCases: number;
    joinedDate: string;
}

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSave: (user: User) => void;
}

export default function UserEditModal({ isOpen, onClose, user, onSave }: UserEditModalProps) {
    const isEditing = !!user;
    const [formData, setFormData] = useState<any>({
        name: '',
        email: '',
        phone: '',
        status: 'active',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        if (user) {
            setFormData({
                ...user,
                password: '' // Não editamos senha aqui por enquanto
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                status: 'active',
                password: ''
            });
        }
        setError(null);
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('fala_comigo_token');
            const baseUrl = 'http://localhost:8000/api/v1/admin/users';

            let response;
            if (isEditing) {
                // UPDATE (PATCH)
                response = await fetch(`${baseUrl}/${user.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        full_name: formData.name,
                        email: formData.email,
                        phone_number: formData.phone,
                        is_active: formData.status === 'active'
                    })
                });
            } else {
                // CREATE (POST)
                response = await fetch(baseUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        full_name: formData.name,
                        email: formData.email,
                        phone_number: formData.phone,
                        password: formData.password,
                        is_active: formData.status === 'active'
                    })
                });
            }

            const result = await response.json();

            if (response.ok) {
                onSave(formData);
                onClose();
            } else {
                setError(result.detail || 'Ocorreu um erro ao processar a solicitação');
            }
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
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
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Usuário" : "Adicionar Novo Usuário"} size="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Avatar Preview */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                        {formData.name ? formData.name.charAt(0) : '?'}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                            {formData.name || 'Novo Usuário'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {isEditing ? `ID: ${formData.id}` : 'Preencha os dados abaixo'}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nome Completo *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Telefone *
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Password (only for new users) */}
                    {!isEditing && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Senha Temporária *
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    )}

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                        </select>
                    </div>

                    {/* Joined Date (Read-only, only for editing) */}
                    {isEditing && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Data de Registro
                            </label>
                            <input
                                type="text"
                                value={formData.joinedDate ? new Date(formData.joinedDate).toLocaleDateString('pt-PT') : 'N/A'}
                                disabled
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    )}
                </div>

                {/* User Statistics (only for editing) */}
                {isEditing && (
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Resumo de Atividade</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formData.totalCases}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total de Casos</p>
                            </div>
                            <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">Ativo</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Status Atual</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processando...
                            </span>
                        ) : (
                            isEditing ? 'Salvar Alterações' : 'Criar Usuário'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
