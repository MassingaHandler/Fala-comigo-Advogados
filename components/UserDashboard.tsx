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
    onStatusCheck: () => void;
    orderHistory: Order[];
}

type View = 'dashboard' | 'history' | 'profile';

export default function UserDashboard({ onNewConsultation, onHistory, onFollowUp, onStatusCheck, orderHistory }: Props) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [view, setView] = React.useState<View>('dashboard');

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
            last6Months.push({ month: months[i], count });
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
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <MozambiqueFlagIcon className="w-8 h-8" />
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Fala Comigo</h2>
                            <p className="text-xs text-green-500 font-medium">● Online</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
                        { id: 'history', label: 'Histórico', icon: HistoryIcon },
                        { id: 'profile', label: 'Perfil', icon: UserIcon },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'history') onHistory();
                                else setView(item.id as View);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === item.id
                                ? 'bg-red-600 text-white shadow-md'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                    >
                        <LogOutIcon className="w-5 h-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8">
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
                            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" delay={200} />
                        <StatCard title="Este Mês" value={stats.thisMonth} icon={<TrendingUpIcon className="w-7 h-7 text-white" />}
                            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" trend={{ value: 8, isPositive: true }} delay={300} />
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Ações Rápidas</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { onClick: onNewConsultation, icon: PlusCircleIcon, label: 'Nova Consulta', color: 'red' },
                                { onClick: onFollowUp, icon: MessageSquareIcon, label: 'Acompanhamento', color: 'blue' },
                                { onClick: onStatusCheck, icon: SearchIcon, label: 'Verificar Estado', color: 'purple' },
                                { onClick: onHistory, icon: HistoryIcon, label: 'Histórico', color: 'green' }
                            ].map((action, idx) => (
                                <button key={idx} onClick={action.onClick}
                                    className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-${action.color}-500 dark:hover:border-${action.color}-500 hover:bg-${action.color}-50 dark:hover:bg-${action.color}-900/10 transition-all group`}>
                                    <div className={`w-12 h-12 rounded-full bg-${action.color}-100 dark:bg-${action.color}-900/30 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <action.icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                                    </div>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Activity Chart and Active Consultations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ActivityChart data={monthlyActivity} title="Atividade dos Últimos 6 Meses" />

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Consultas Ativas</h3>
                                {activeConsultations.length > 0 && (
                                    <button onClick={onHistory} className="text-sm text-red-600 dark:text-red-400 hover:underline">Ver todas</button>
                                )}
                            </div>
                            {activeConsultations.length === 0 ? (
                                <EmptyState icon={<GavelIcon className="w-10 h-10 text-gray-400" />} title="Nenhuma consulta ativa"
                                    description="Você não tem consultas em andamento no momento." actionLabel="Nova Consulta" onAction={onNewConsultation} />
                            ) : (
                                <div className="space-y-4">
                                    {activeConsultations.map((order) => (
                                        <div key={order.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-500 transition-all cursor-pointer"
                                            onClick={() => navigate('/verificar-estado')}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{order.topic.name}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">ID: {order.human_id}</p>
                                                </div>
                                                {getStatusBadge(order.status)}
                                            </div>
                                            {order.assignment && <p className="text-sm text-gray-600 dark:text-gray-400">Advogado: {order.assignment.lawyer.nome}</p>}
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
                            <button onClick={onHistory} className="text-sm text-red-600 dark:text-red-400 hover:underline">Ver histórico completo</button>
                        </div>
                        {recentActivity.length === 0 ? (
                            <EmptyState icon={<HistoryIcon className="w-10 h-10 text-gray-400" />} title="Nenhuma atividade ainda"
                                description="Suas consultas aparecerão aqui." actionLabel="Iniciar Primeira Consulta" onAction={onNewConsultation} />
                        ) : (
                            <div className="space-y-3">
                                {recentActivity.map((order) => (
                                    <div key={order.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer"
                                        onClick={() => navigate('/historico')}>
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                                            {order.topic.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{order.topic.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
