import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../types';
import { OrderStatus } from '../types';
import StatCard from './ui/StatCard';
import ActivityChart from './ui/ActivityChart';
import EmptyState from './ui/EmptyState';
import { GavelIcon, CheckCircleIcon, ClockIcon, SearchIcon, UserIcon, LogOutIcon, HomeIcon } from './ui/icons';
import { TrendingUpIcon, PlusCircleIcon, MessageSquareIcon, HistoryIcon } from './ui/dashboard-icons';
import { MozambiqueFlagIcon } from './ui/icons';
import { useAuth } from '../lib/AuthContext';

interface Props {
    onNewConsultation: () => void;
    onHistory: () => void;
    onFollowUp: () => void;
    orderHistory: Order[];
}

export default function UserDashboard({ onNewConsultation, onHistory, orderHistory }: Props) {
    const navigate = useNavigate();

    const stats = useMemo(() => {
        const total = orderHistory.length;
        const active = orderHistory.filter(o =>
            o.status === OrderStatus.ASSIGNED || o.status === OrderStatus.IN_PROGRESS || o.status === OrderStatus.PENDING_PAYMENT
        ).length;
        const completed = orderHistory.filter(o => o.status === OrderStatus.COMPLETED).length;
        const thisMonth = orderHistory.filter(o => {
            const orderDate = new Date(o.createdAt);
            const now = new Date();
            return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        }).length;
        return { total, active, completed, thisMonth };
    }, [orderHistory]);

    const monthlyActivity = useMemo(() => {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const currentMonth = new Date().getMonth();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const count = orderHistory.filter(o => new Date(o.createdAt).getMonth() === monthIndex).length;
            last6Months.push({ month: months[monthIndex], count }); // Corrected month index for display
        }
        return last6Months;
    }, [orderHistory]);

    const activeConsultations = orderHistory
        .filter(o => o.status === OrderStatus.ASSIGNED || o.status === OrderStatus.IN_PROGRESS)
        .slice(0, 3);

    const recentActivity = orderHistory
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const getStatusBadge = (status: OrderStatus | string) => {
        const badges = {
            [OrderStatus.PENDING_PAYMENT]: { label: 'Aguardando', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
            [OrderStatus.ASSIGNED]: { label: 'Atribuído', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
            [OrderStatus.IN_PROGRESS]: { label: 'Em Andamento', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
            [OrderStatus.COMPLETED]: { label: 'Concluído', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
            [OrderStatus.RATING_PENDING]: { label: 'Avaliação Pendente', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
            [OrderStatus.CANCELLED]: { label: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
        };
        const badge = badges[status as OrderStatus] || badges[OrderStatus.PENDING_PAYMENT];
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>{badge.label}</span>;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta! 👋</h1>
                <p className="text-red-100">Gerencie suas consultas jurídicas de forma simples e eficiente</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total de Consultas" value={stats.total} icon={<GavelIcon className="w-7 h-7 text-white" />}
                    gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" delay={0} />
                <StatCard title="Consultas Ativas" value={stats.active} icon={<ClockIcon className="w-7 h-7 text-white" />}
                    gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" trend={{ value: 12, isPositive: true }} delay={100} />
                <StatCard title="Concluídas" value={stats.completed} icon={<CheckCircleIcon className="w-7 h-7 text-white" />}
                    gradient="linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)" delay={200} />
                <StatCard title="Este Mês" value={stats.thisMonth} icon={<TrendingUpIcon className="w-7 h-7 text-white" />}
                    gradient="linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)" delay={300} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Active Consultations */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Consultas Ativas</h3>
                            <button onClick={onNewConsultation} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
                                <PlusCircleIcon className="w-4 h-4" />
                                Nova Consulta
                            </button>
                        </div>
                        {activeConsultations.length === 0 ? (
                            <EmptyState icon={<GavelIcon className="w-10 h-10 text-gray-400" />} title="Nenhuma consulta ativa"
                                description="Você não tem consultas em andamento no momento." actionLabel="Nova Consulta" onAction={onNewConsultation} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeConsultations.map((order) => (
                                    <div key={order.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:border-red-500 transition-all cursor-pointer group"
                                        onClick={() => navigate('/verificar-estado')}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors line-clamp-1">{order.topic.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-wider mt-1">ID: {order.human_id} • {new Date(order.createdAt).toLocaleDateString()}</p>
                                                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                                    {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(order.pkg.price)}
                                                </p>
                                            </div>
                                            {getStatusBadge(order.status)}
                                        </div>
                                        {order.assignment?.lawyer && (
                                            <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <img src={order.assignment.lawyer.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.assignment.lawyer.nome)}&background=4f46e5&color=fff`}
                                                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-sm" alt="Avatar" />
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-none mb-1">Advogado(a)</p>
                                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{order.assignment.lawyer.nome}</p>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 group-hover:bg-red-50 group-hover:text-red-600 transition-all">
                                                    <TrendingUpIcon className="w-4 h-4" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <ActivityChart data={monthlyActivity} title="Atividade dos Últimos 6 Meses" />
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Atividade Recente</h3>
                            <button onClick={onHistory} className="text-sm text-red-600 dark:text-red-400 font-medium hover:underline">Ver tudo</button>
                        </div>
                        {recentActivity.length === 0 ? (
                            <EmptyState icon={<HistoryIcon className="w-10 h-10 text-gray-400" />} title="Sem atividade"
                                description="Suas consultas recentes aparecerão aqui." actionLabel="Começar" onAction={onNewConsultation} />
                        ) : (
                            <div className="space-y-4">
                                {recentActivity.map((order) => (
                                    <div key={order.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer group"
                                        onClick={() => navigate('/historico')}>
                                        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
                                            {order.topic.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-red-600 transition-colors">{order.topic.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                {new Date(order.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Access Card */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="font-bold text-lg mb-2">Precisa de ajuda urgente?</h4>
                            <p className="text-gray-400 text-sm mb-4">Nossos advogados estão online agora para consultas imediatas.</p>
                            <button onClick={onNewConsultation} className="w-full bg-white text-gray-900 font-bold py-2 rounded-lg hover:bg-red-50 transition-colors">
                                Iniciar Assistência
                            </button>
                        </div>
                        <div className="absolute top-[-20px] right-[-20px] opacity-10">
                            <GavelIcon className="w-32 h-32" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
