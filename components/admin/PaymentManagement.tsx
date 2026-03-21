import React, { useState, useEffect } from 'react';
import { SearchIcon, FilterIcon, DownloadIcon } from '../ui/dashboard-icons';
import PaymentDetailsModal from './modals/PaymentDetailsModal';
import LoadingSpinner from '../ui/LoadingSpinner';

interface Payment {
    id: string;
    transactionId: string;
    client: string;
    caseId: string;
    amount: number;
    method: 'mpesa' | 'card' | 'bank';
    status: 'completed' | 'pending' | 'failed';
    date: string;
}

export default function PaymentManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterMethod, setFilterMethod] = useState<string>('all');
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [revenueStats, setRevenueStats] = useState({ total: 0, pending: 0 });
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });

    useEffect(() => {
        const fetchPayments = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('fala_comigo_token');
                if (!token) return;

                const url = new URL('http://localhost:8000/api/v1/admin/payments');
                url.searchParams.append('page', pagination.currentPage.toString());
                if (searchTerm) url.searchParams.append('search', searchTerm);
                if (filterStatus !== 'all') url.searchParams.append('status_filter', filterStatus);
                if (filterMethod !== 'all') url.searchParams.append('method_filter', filterMethod);

                const response = await fetch(url.toString(), {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        setPayments(result.data);
                        setRevenueStats({
                            total: result.totalRevenue || 0,
                            pending: result.pendingRevenue || 0
                        });
                        setPagination(prev => ({
                            ...prev,
                            totalPages: result.pagination.totalPages,
                            totalItems: result.pagination.totalItems
                        }));
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar pagamentos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPayments();
    }, [pagination.currentPage, searchTerm, filterStatus, filterMethod]);

    const filteredPayments = payments; // Filtros já virão do backend

    const totalRevenue = revenueStats.total;
    const pendingRevenue = revenueStats.pending;

    const getStatusBadge = (status: string) => {
        const badges = {
            completed: { label: 'Concluído', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
            pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
            failed: { label: 'Falhou', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
        };
        const badge = badges[status as keyof typeof badges] || badges.pending;
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.color}`}>{badge.label}</span>;
    };

    const getMethodBadge = (method: string) => {
        const badges = {
            mpesa: { label: 'M-Pesa', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
            card: { label: 'Cartão', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
            bank: { label: 'Banco', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
        };
        const badge = badges[method as keyof typeof badges] || badges.mpesa;
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.color}`}>{badge.label}</span>;
    };

    if (isLoading && payments.length === 0) {
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
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gestão de Pagamentos</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie todas as transações da plataforma</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md">
                    <DownloadIcon className="w-4 h-4" />
                    Exportar Relatório
                </button>
            </div>

            {/* Revenue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Receita Total</p>
                    <p className="text-3xl font-bold">{totalRevenue.toLocaleString()} MT</p>
                    <p className="text-xs opacity-75 mt-2">Pagamentos concluídos</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Receita Pendente</p>
                    <p className="text-3xl font-bold">{pendingRevenue.toLocaleString()} MT</p>
                    <p className="text-xs opacity-75 mt-2">Aguardando confirmação</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Total de Transações</p>
                    <p className="text-3xl font-bold">{pagination.totalItems}</p>
                    <p className="text-xs opacity-75 mt-2">Total histórico</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ID, cliente ou caso..."
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
                            <option value="completed">Concluído</option>
                            <option value="pending">Pendente</option>
                            <option value="failed">Falhou</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <FilterIcon className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterMethod}
                            onChange={(e) => {
                                setFilterMethod(e.target.value);
                                setPagination(p => ({ ...p, currentPage: 1 }));
                            }}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Todos os Métodos</option>
                            <option value="mpesa">M-Pesa</option>
                            <option value="card">Cartão</option>
                            <option value="bank">Banco</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID Transação</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Caso</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Método</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">{payment.transactionId}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{payment.client}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-mono text-sm text-gray-900 dark:text-gray-200">{payment.caseId}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-green-600 dark:text-green-400">{(payment.amount || 0).toLocaleString()} MT</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getMethodBadge(payment.method)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(payment.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {payment.date ? new Date(payment.date).toLocaleDateString('pt-PT') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                setSelectedPayment(payment);
                                                setIsModalOpen(true);
                                            }}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                                        >
                                            Ver Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPayments.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">Nenhum pagamento encontrado</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando {payments.length} de {pagination.totalItems} transações
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

            {/* Payment Details Modal */}
            <PaymentDetailsModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPayment(null);
                }}
                payment={selectedPayment}
            />
        </div>
    );
}
