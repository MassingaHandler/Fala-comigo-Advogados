import React, { useState, useMemo } from 'react';
import type { Order } from '../types';
import { OrderStatus } from '../types';
import { SearchIcon, FilterIcon, ClockIcon, PhoneIcon } from './ui/icons';
import { MessageSquareIcon } from './ui/dashboard-icons';

interface Props {
    cases: Order[];
    onStartChat: (order: Order) => void;
    onViewDetails: (order: Order) => void;
    onCompleteCase: (order: Order) => void;
}

type FilterStatus = 'all' | 'assigned' | 'in_progress';
type SortBy = 'date' | 'urgency';

export default function LawyerCaseManagement({ cases, onStartChat, onViewDetails, onCompleteCase }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [sortBy, setSortBy] = useState<SortBy>('urgency');

    const filteredAndSortedCases = useMemo(() => {
        let filtered = cases.filter(c => {
            const matchesSearch =
                c.human_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.topic.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                filterStatus === 'all' ||
                (filterStatus === 'assigned' && c.status === OrderStatus.ASSIGNED) ||
                (filterStatus === 'in_progress' && c.status === OrderStatus.IN_PROGRESS);

            return matchesSearch && matchesStatus;
        });

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'urgency') {
                // Assigned cases are more urgent than in_progress
                if (a.status === OrderStatus.ASSIGNED && b.status !== OrderStatus.ASSIGNED) return -1;
                if (a.status !== OrderStatus.ASSIGNED && b.status === OrderStatus.ASSIGNED) return 1;
                // Then by date (older first)
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else {
                // Sort by date (newest first)
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        return filtered;
    }, [cases, searchTerm, filterStatus, sortBy]);

    const getStatusBadge = (status: OrderStatus) => {
        const badges = {
            [OrderStatus.ASSIGNED]: { label: 'Atribuído', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
            [OrderStatus.IN_PROGRESS]: { label: 'Em Andamento', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[status]?.color || ''}`}>{badges[status]?.label || status}</span>;
    };

    const getTimeWaiting = (createdAt: Date) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMs = now.getTime() - created.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays} dia${diffDays > 1 ? 's' : ''}`;
        if (diffHours > 0) return `${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        return `${diffMins} min`;
    };

    const getUrgencyIndicator = (order: Order) => {
        const hoursWaiting = (new Date().getTime() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);

        if (order.status === OrderStatus.ASSIGNED && hoursWaiting > 2) {
            return <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>;
        }
        if (hoursWaiting > 24) {
            return <span className="w-2 h-2 bg-orange-500 rounded-full"></span>;
        }
        return <span className="w-2 h-2 bg-green-500 rounded-full"></span>;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gestão de Casos</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {filteredAndSortedCases.length} caso{filteredAndSortedCases.length !== 1 ? 's' : ''} ativo{filteredAndSortedCases.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ID ou tópico..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <FilterIcon className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="assigned">Atribuído</option>
                            <option value="in_progress">Em Andamento</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <FilterIcon className="w-5 h-5 text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortBy)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="urgency">Ordenar por Urgência</option>
                            <option value="date">Ordenar por Data</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Cases List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {filteredAndSortedCases.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">Nenhum caso encontrado</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredAndSortedCases.map((order) => (
                            <div
                                key={order.id}
                                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Urgency Indicator */}
                                    <div className="flex-shrink-0 pt-1">
                                        {getUrgencyIndicator(order)}
                                    </div>

                                    {/* Case Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                    {order.topic.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    ID: <span className="font-mono font-semibold">{order.human_id}</span>
                                                </p>
                                            </div>
                                            {getStatusBadge(order.status)}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Tipo</p>
                                                <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                                    {order.consultationType === 'phone' ? (
                                                        <>
                                                            <PhoneIcon className="w-4 h-4" />
                                                            Telefone
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MessageSquareIcon className="w-4 h-4" />
                                                            Chat
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Aguardando</p>
                                                <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                                    <ClockIcon className="w-4 h-4" />
                                                    {getTimeWaiting(order.createdAt)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Valor</p>
                                                <p className="font-medium text-green-600 dark:text-green-400">
                                                    {order.pkg.price.toLocaleString()} MT
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Data</p>
                                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                                    {new Date(order.createdAt).toLocaleDateString('pt-PT')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 mt-4">
                                            <button
                                                onClick={() => onStartChat(order)}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md font-semibold text-sm"
                                            >
                                                {order.status === OrderStatus.ASSIGNED ? 'Iniciar Atendimento' : 'Continuar Atendimento'}
                                            </button>
                                            <button
                                                onClick={() => onViewDetails(order)}
                                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-sm font-medium"
                                            >
                                                Ver Detalhes
                                            </button>
                                            {order.status === OrderStatus.IN_PROGRESS && (
                                                <button
                                                    onClick={() => onCompleteCase(order)}
                                                    className="px-4 py-2 border border-green-500 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all text-sm font-medium"
                                                >
                                                    Concluir Caso
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
