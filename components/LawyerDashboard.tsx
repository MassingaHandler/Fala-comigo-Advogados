import React, { useMemo } from 'react';
import type { Order } from '../types';
import { OrderStatus } from '../types';
import StatCard from './ui/StatCard';
import ActivityChart from './ui/ActivityChart';
import EmptyState from './ui/EmptyState';
import { GavelIcon, CheckCircleIcon, ClockIcon, UserIcon } from './ui/icons';
import { TrendingUpIcon, PlusCircleIcon, MessageSquareIcon, HistoryIcon, DollarSignIcon, BarChartIcon } from './ui/dashboard-icons';

interface Props {
    onViewActive: () => void;
    onHistory: () => void;
    onProfile: () => void;
    onFinancials: () => void;
    consultationHistory: Order[];
    lawyerId: string;
}

export default function LawyerDashboard({
    onViewActive,
    onHistory,
    onProfile,
    onFinancials,
    consultationHistory,
    lawyerId
}: Props) {

    const stats = useMemo(() => {
        const total = consultationHistory.length;
        const active = consultationHistory.filter(o =>
            o.status === OrderStatus.ASSIGNED || o.status === OrderStatus.IN_PROGRESS
        ).length;
        const completed = consultationHistory.filter(o => o.status === OrderStatus.COMPLETED).length;

        // Calculate this month's stats
        const now = new Date();
        const thisMonth = consultationHistory.filter(o => {
            const orderDate = new Date(o.createdAt);
            return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        });

        const completedThisMonth = thisMonth.filter(o => o.status === OrderStatus.COMPLETED).length;
        const revenueThisMonth = thisMonth
            .filter(o => o.status === OrderStatus.COMPLETED)
            .reduce((sum, o) => sum + o.pkg.price, 0);

        return { total, active, completed, completedThisMonth, revenueThisMonth };
    }, [consultationHistory]);

    const monthlyActivity = useMemo(() => {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const currentMonth = new Date().getMonth();
        const last6Months = [];

        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const count = consultationHistory.filter(o => {
                const orderDate = new Date(o.createdAt);
                return orderDate.getMonth() === monthIndex;
            }).length;
            last6Months.push({ month: months[monthIndex], count });
        }
        return last6Months;
    }, [consultationHistory]);

    const activeConsultations = consultationHistory
        .filter(o => o.status === OrderStatus.ASSIGNED || o.status === OrderStatus.IN_PROGRESS)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .slice(0, 3);

    const recentActivity = consultationHistory
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const getStatusBadge = (status: OrderStatus) => {
        const badges = {
            [OrderStatus.PENDING_PAYMENT]: { label: 'Aguardando', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
            [OrderStatus.ASSIGNED]: { label: 'Atribuído', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
            [OrderStatus.IN_PROGRESS]: { label: 'Em Andamento', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
            [OrderStatus.COMPLETED]: { label: 'Concluído', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
            [OrderStatus.RATING_PENDING]: { label: 'Avaliação Pendente', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
            [OrderStatus.CANCELLED]: { label: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
        };
        const badge = badges[status] || badges[OrderStatus.PENDING_PAYMENT];
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>{badge.label}</span>;
    };

    const getTimeWaiting = (createdAt: Date) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMs = now.getTime() - created.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays}d`;
        if (diffHours > 0) return `${diffHours}h`;
        return `${diffMins}m`;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-2">Bem-vindo, Advogado! ⚖️</h1>
                <p className="text-indigo-100">Gerencie seus casos e atendimentos de forma eficiente</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total de Consultas"
                    value={stats.total}
                    icon={<GavelIcon className="w-7 h-7 text-white" />}
                    gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    delay={0}
                />
                <StatCard
                    title="Consultas Ativas"
                    value={stats.active}
                    icon={<ClockIcon className="w-7 h-7 text-white" />}
                    gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    trend={{ value: stats.active > 0 ? 15 : 0, isPositive: true }}
                    delay={100}
                />
                <StatCard
                    title="Concluídas Este Mês"
                    value={stats.completedThisMonth}
                    icon={<CheckCircleIcon className="w-7 h-7 text-white" />}
                    gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    delay={200}
                />
                <StatCard
                    title="Receita Este Mês"
                    value={`${stats.revenueThisMonth.toLocaleString()} MT`}
                    icon={<DollarSignIcon className="w-7 h-7 text-white" />}
                    gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                    trend={{ value: 12, isPositive: true }}
                    delay={300}
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { onClick: onViewActive, icon: MessageSquareIcon, label: 'Atender Casos', color: 'indigo', count: stats.active },
                        { onClick: onHistory, icon: HistoryIcon, label: 'Histórico', color: 'blue' },
                        { onClick: onFinancials, icon: DollarSignIcon, label: 'Financeiro', color: 'green' },
                        { onClick: onProfile, icon: UserIcon, label: 'Perfil', color: 'purple' }
                    ].map((action, idx) => (
                        <button
                            key={idx}
                            onClick={action.onClick}
                            className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-${action.color}-500 dark:hover:border-${action.color}-500 hover:bg-${action.color}-50 dark:hover:bg-${action.color}-900/10 transition-all group relative`}
                        >
                            <div className={`w-12 h-12 rounded-full bg-${action.color}-100 dark:bg-${action.color}-900/30 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <action.icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                            </div>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{action.label}</span>
                            {action.count !== undefined && action.count > 0 && (
                                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                    {action.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Charts and Active Cases */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityChart data={monthlyActivity} title="Atividade dos Últimos 6 Meses" />

                {/* Active Consultations */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Casos Ativos Urgentes</h3>
                        {activeConsultations.length > 0 && (
                            <button onClick={onViewActive} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                Ver todos
                            </button>
                        )}
                    </div>
                    {activeConsultations.length === 0 ? (
                        <EmptyState
                            icon={<GavelIcon className="w-10 h-10 text-gray-400" />}
                            title="Nenhum caso ativo"
                            description="Você não tem casos aguardando atendimento no momento."
                        />
                    ) : (
                        <div className="space-y-4">
                            {activeConsultations.map((order) => (
                                <div
                                    key={order.id}
                                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-all cursor-pointer bg-gradient-to-r from-transparent to-indigo-50/30 dark:to-indigo-900/10"
                                    onClick={onViewActive}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">{order.topic.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">ID: {order.human_id}</p>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Aguardando há {getTimeWaiting(order.createdAt)}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewActive();
                                            }}
                                            className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700 transition-colors font-semibold"
                                        >
                                            Atender Agora
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Atividade Recente</h3>
                    <button onClick={onHistory} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        Ver histórico completo
                    </button>
                </div>
                {recentActivity.length === 0 ? (
                    <EmptyState
                        icon={<HistoryIcon className="w-10 h-10 text-gray-400" />}
                        title="Nenhuma atividade ainda"
                        description="Suas consultas aparecerão aqui."
                    />
                ) : (
                    <div className="space-y-3">
                        {recentActivity.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer"
                                onClick={onHistory}
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                    {order.topic.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{order.topic.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString('pt-PT', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                {getStatusBadge(order.status)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
