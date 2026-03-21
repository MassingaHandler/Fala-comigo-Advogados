import React, { useState, useEffect } from 'react';
import { SearchIcon, FilterIcon } from '../ui/dashboard-icons';
import { OrderStatus } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';

interface Case {
    id: string;
    caseId: string;
    client: string;
    lawyer: string;
    topic: string;
    status: OrderStatus;
    createdDate: string;
    amount: number;
}

export default function CaseManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [cases, setCases] = useState<Case[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });

    useEffect(() => {
        const fetchCases = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('fala_comigo_token');
                if (!token) return;

                const url = new URL('http://localhost:8000/api/v1/admin/cases');
                url.searchParams.append('page', pagination.currentPage.toString());
                if (searchTerm) url.searchParams.append('search', searchTerm);
                if (filterStatus !== 'all') url.searchParams.append('status_filter', filterStatus);

                const response = await fetch(url.toString(), {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        setCases(result.data);
                        setPagination(prev => ({
                            ...prev,
                            totalPages: result.pagination.totalPages,
                            totalItems: result.pagination.totalItems
                        }));
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar casos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCases();
    }, [pagination.currentPage, searchTerm, filterStatus]);

    const filteredCases = cases; // Filtros já virão do backend

    const getStatusBadge = (status: OrderStatus) => {
        const badges = {
            [OrderStatus.PENDING_PAYMENT]: { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
            [OrderStatus.ASSIGNED]: { label: 'Atribuído', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
            [OrderStatus.IN_PROGRESS]: { label: 'Em Andamento', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
            [OrderStatus.COMPLETED]: { label: 'Concluído', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
            [OrderStatus.RATING_PENDING]: { label: 'Avaliação Pendente', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
            [OrderStatus.CANCELLED]: { label: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
        };
        const badge = badges[status] || badges[OrderStatus.PENDING_PAYMENT];
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.color}`}>{badge.label}</span>;
    };

    if (isLoading && cases.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gestão de Casos</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie todos os casos da plataforma</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md">
                    Exportar Relatório
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ID ou cliente..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPagination(p => ({ ...p, currentPage: 1 }));
                            }}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FilterIcon className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setPagination(p => ({ ...p, currentPage: 1 }));
                            }}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Todos os Status</option>
                            <option value={OrderStatus.ASSIGNED}>Atribuído</option>
                            <option value={OrderStatus.IN_PROGRESS}>Em Andamento</option>
                            <option value={OrderStatus.COMPLETED}>Concluído</option>
                            <option value={OrderStatus.RATING_PENDING}>Avaliação Pendente</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Cases Table */}
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
                        <LoadingSpinner />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID do Caso</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Advogado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tópico</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredCases.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">{c.caseId}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{c.client}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-gray-200">{c.lawyer}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-gray-200">{c.topic}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(c.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(c.createdDate).toLocaleDateString('pt-PT')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-200">
                                        {(c.amount || 0).toLocaleString()} MT
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Ver</button>
                                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">Reatribuir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredCases.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">Nenhum caso encontrado</p>
                    </div>
                )}
            </div>

            {/* Pagination UI */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando {cases.length} de {pagination.totalItems} casos
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))}
                        disabled={pagination.currentPage === 1 || isLoading}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="flex items-center px-4 font-medium text-gray-700 dark:text-gray-300">
                        Página {pagination.currentPage} de {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(p.totalPages, p.currentPage + 1) }))}
                        disabled={pagination.currentPage === pagination.totalPages || isLoading}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        Próximo
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total de Casos</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{pagination.totalItems}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Em Andamento</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {cases.filter(c => c.status === OrderStatus.IN_PROGRESS).length}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Concluídos</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {cases.filter(c => c.status === OrderStatus.COMPLETED).length}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {cases.reduce((sum, c) => sum + (c.amount || 0), 0).toLocaleString()} MT
                    </p>
                </div>
            </div>
        </div>
    );
}
