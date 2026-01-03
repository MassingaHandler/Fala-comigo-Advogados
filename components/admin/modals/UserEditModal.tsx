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
    const [formData, setFormData] = useState<User | null>(user);
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        setFormData(user);
    }, [user]);

    if (!formData) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        onSave(formData);
        setIsLoading(false);
        onClose();
    };

    const handleChange = (field: keyof User, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuário" size="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Avatar */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                        {formData.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{formData.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">ID: {formData.id}</p>
                    </div>
                </div>

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

                    {/* Joined Date (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Data de Registro
                        </label>
                        <input
                            type="text"
                            value={new Date(formData.joinedDate).toLocaleDateString('pt-PT')}
                            disabled
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* User Statistics */}
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Estatísticas do Usuário</h4>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formData.totalCases}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total de Casos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {Math.floor(Math.random() * 10)}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Casos Ativos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {Math.floor(Math.random() * 30)} dias
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Último Acesso</p>
                        </div>
                    </div>
                </div>

                {/* Change History */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Histórico de Alterações</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Última modificação</span>
                            <span className="text-gray-800 dark:text-gray-200">Hoje às 10:30</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Modificado por</span>
                            <span className="text-gray-800 dark:text-gray-200">Admin</span>
                        </div>
                    </div>
                </div>

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
                                Salvando...
                            </span>
                        ) : (
                            'Salvar Alterações'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
