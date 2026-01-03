import React, { useState, useMemo } from 'react';
import type { Order } from '../types';
import { OrderStatus } from '../types';
import { SearchIcon, FilterIcon, DownloadIcon, DollarSignIcon } from './ui/dashboard-icons';
import ActivityChart from './ui/ActivityChart';

interface Payment {
    id: string;
    caseId: string;
    clientName: string;
    amount: number;
    date: Date;
    status: 'received' | 'pending' | 'processing';
    method: 'mpesa' | 'bank' | 'card';
    consultationType: 'digital' | 'phone';
}

interface Props {
    consultationHistory: Order[];
}

export default function LawyerFinancials({ consultationHistory }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');
    const [filterStatus, setFilterStatus] = useState<'all' | 'received' | 'pending' | 'processing'>('all');

    // Generate payments from consultation history
    const payments: Payment[] = useMemo(() => {
        return consultationHistory
            .filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.RATING_PENDING)
            .map(o => ({
                id: o.id,
                caseId: o.human_id,
                clientName: 'Cliente', // Would come from user data
                amount: o.pkg.price,
                date: new Date(o.createdAt),
                status: o.status === OrderStatus.COMPLETED ? 'received' as const : 'pending' as const,
                method: 'mpesa' as const,
                consultationType: o.consultationType,
            }));
    }, [consultationHistory]);

    // Financial statistics
    const stats = useMemo(() => {
        const now = new Date();
        const thisMonth = payments.filter(p => {
            const paymentDate = new Date(p.date);
            return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
        });

        const totalRevenue = payments.filter(p => p.status === 'received').reduce((sum, p) => sum + p.amount, 0);
        const monthRevenue = thisMonth.filter(p => p.status === 'received').reduce((sum, p) => sum + p.amount, 0);
        const pendingRevenue = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
        const avgPerCase = payments.length > 0 ? totalRevenue / payments.filter(p => p.status === 'received').length : 0;

        return { totalRevenue, monthRevenue, pendingRevenue, avgPerCase };
    }, [payments]);

    // Monthly revenue for chart
    const monthlyRevenue = useMemo(() => {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const currentMonth = new Date().getMonth();
        const last6Months = [];

        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const revenue = payments
                .filter(p => {
                    const paymentDate = new Date(p.date);
                    return paymentDate.getMonth() === monthIndex && p.status === 'received';
                })
                .reduce((sum, p) => sum + p.amount, 0);

            last6Months.push({ month: months[monthIndex], count: revenue / 1000 }); // Divide by 1000 for better chart scale
        }
        return last6Months;
    }, [payments]);

    // Filter payments
    const filteredPayments = useMemo(() => {
        const now = new Date();
        return payments.filter(p => {
            const matchesSearch =
                p.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.clientName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === 'all' || p.status === filterStatus;

            let matchesPeriod = true;
            const paymentDate = new Date(p.date);
            if (filterPeriod === 'week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                matchesPeriod = paymentDate >= weekAgo;
            } else if (filterPeriod === 'month') {
                matchesPeriod = paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
            } else if (filterPeriod === 'year') {
                matchesPeriod = paymentDate.getFullYear() === now.getFullYear();
            }

            return matchesSearch && matchesStatus && matchesPeriod;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [payments, searchTerm, filterStatus, filterPeriod]);

    const getStatusBadge = (status: string) => {
        const badges = {
            received: { label: 'Recebido', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
            pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
            processing: { label: 'Processando', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
        };
        const badge = badges[status as keyof typeof badges] || badges.pending;
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.color}`}>{badge.label}</span>;
    };

    const getMethodBadge = (method: string) => {
        const badges = {
            mpesa: { label: 'M-Pesa', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
            bank: { label: 'Banco', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
            card: { label: 'Cartão', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
        };
        const badge = badges[method as keyof typeof badges] || badges.mpesa;
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.color}`}>{badge.label}</span>;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gestão Financeira</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Acompanhe suas receitas e pagamentos
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md font-semibold">
                    <DownloadIcon className="w-4 h-4" />
                    Exportar Relatório
                </button>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Receita Total</p>
                    <p className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()} MT</p>
                    <p className="text-xs opacity-75 mt-2">Todos os tempos</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Receita Este Mês</p>
                    <p className="text-3xl font-bold">{stats.monthRevenue.toLocaleString()} MT</p>
                    <p className="text-xs opacity-75 mt-2">+12% vs mês anterior</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Receita Pendente</p>
                    <p className="text-3xl font-bold">{stats.pendingRevenue.toLocaleString()} MT</p>
                    <p className="text-xs opacity-75 mt-2">Aguardando processamento</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Média por Caso</p>
                    <p className="text-3xl font-bold">{Math.round(stats.avgPerCase).toLocaleString()} MT</p>
                    <p className="text-xs opacity-75 mt-2">Valor médio</p>
                </div>
            </div>

            {/* Revenue Chart */}
            <ActivityChart
                data={monthlyRevenue}
                title="Receita Mensal (últimos 6 meses) - em milhares MT"
            />

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ID ou cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FilterIcon className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value as any)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="week">Última Semana</option>
                            <option value="month">Este Mês</option>
                            <option value="year">Este Ano</option>
                            <option value="all">Todos</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <FilterIcon className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="received">Recebido</option>
                            <option value="pending">Pendente</option>
                            <option value="processing">Processando</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Histórico de Pagamentos</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID Caso</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Método</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        Nenhum pagamento encontrado
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                            {new Date(payment.date).toLocaleDateString('pt-PT')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                                {payment.caseId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                            {payment.consultationType === 'phone' ? '📞 Telefone' : '💬 Chat'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                                {payment.amount.toLocaleString()} MT
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getMethodBadge(payment.method)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(payment.status)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
