import React, { useState } from 'react';
import Modal from '../../ui/Modal';

interface Lawyer {
    id: string;
    nome: string;
    especialidade: string;
    rating: number;
    casesCompleted: number;
    status: 'active' | 'inactive';
    phone: string;
    email?: string;
    oamNumber?: string;
    joinedDate?: string;
}

interface LawyerProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    lawyer: Lawyer | null;
}

export default function LawyerProfileModal({ isOpen, onClose, lawyer }: LawyerProfileModalProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'reviews'>('overview');

    if (!lawyer) return null;

    const mockRecentCases = [
        { id: 'FC-123456', client: 'João Silva', topic: 'Família', status: 'completed', date: '2024-12-01' },
        { id: 'FC-123457', client: 'Maria Costa', topic: 'Trabalho', status: 'in_progress', date: '2024-12-03' },
        { id: 'FC-123458', client: 'Pedro Santos', topic: 'Terra/DUAT', status: 'completed', date: '2024-11-28' },
    ];

    const mockReviews = [
        { id: 1, client: 'João Silva', rating: 5, comment: 'Excelente profissional! Muito atencioso.', date: '2024-12-01' },
        { id: 2, client: 'Maria Costa', rating: 4, comment: 'Bom atendimento, resolveu meu problema.', date: '2024-11-28' },
        { id: 3, client: 'Ana Moreira', rating: 5, comment: 'Recomendo! Muito competente.', date: '2024-11-25' },
    ];

    const stats = {
        totalCases: lawyer.casesCompleted,
        activeCases: 5,
        completionRate: 94,
        avgResponseTime: '2h',
        clientSatisfaction: lawyer.rating
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Perfil do Advogado" size="xl">
            <div className="space-y-6">
                {/* Header with Avatar and Basic Info */}
                <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                        {lawyer.nome.split(' ')[1]?.charAt(0) || lawyer.nome.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{lawyer.nome}</h3>
                                <p className="text-indigo-600 dark:text-indigo-400 font-medium mt-1">{lawyer.especialidade}</p>
                            </div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${lawyer.status === 'active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                {lawyer.status === 'active' ? '🟢 Ativo' : '🔴 Inativo'}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Telefone</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{lawyer.phone}</p>
                            </div>
                            {lawyer.email && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{lawyer.email}</p>
                                </div>
                            )}
                            {lawyer.oamNumber && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Número OAM</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{lawyer.oamNumber}</p>
                                </div>
                            )}
                            {lawyer.joinedDate && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Membro desde</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {new Date(lawyer.joinedDate).toLocaleDateString('pt-PT')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white dark:bg-gray-700/50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalCases}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total de Casos</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700/50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.activeCases}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Casos Ativos</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700/50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completionRate}%</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Taxa de Conclusão</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700/50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.avgResponseTime}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Tempo Médio</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700/50 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                            <span className="text-yellow-500 text-xl">★</span>
                            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.clientSatisfaction}</p>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Avaliação</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex gap-4">
                        {[
                            { id: 'overview', label: 'Visão Geral', icon: '📊' },
                            { id: 'cases', label: 'Casos Recentes', icon: '📋' },
                            { id: 'reviews', label: 'Avaliações', icon: '⭐' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Estatísticas de Performance</h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">Taxa de Conclusão</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">{stats.completionRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${stats.completionRate}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">Satisfação do Cliente</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">{(stats.clientSatisfaction / 5 * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${stats.clientSatisfaction / 5 * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'cases' && (
                        <div className="space-y-3">
                            {mockRecentCases.map((case_) => (
                                <div key={case_.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div>
                                        <p className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">{case_.id}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{case_.client} • {case_.topic}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${case_.status === 'completed'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                            }`}>
                                            {case_.status === 'completed' ? 'Concluído' : 'Em Andamento'}
                                        </span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {new Date(case_.date).toLocaleDateString('pt-PT')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="space-y-4">
                            {mockReviews.map((review) => (
                                <div key={review.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{review.client}</p>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                        {new Date(review.date).toLocaleDateString('pt-PT')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Editar Perfil
                    </button>
                    <button className={`flex-1 px-4 py-2 rounded-lg transition-colors ${lawyer.status === 'active'
                            ? 'border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                            : 'border border-green-300 dark:border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}>
                        {lawyer.status === 'active' ? 'Suspender' : 'Reativar'}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
