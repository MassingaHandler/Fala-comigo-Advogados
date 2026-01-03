import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../ui/StatCard';
import ActivityChart from '../ui/ActivityChart';
import { GavelIcon, CheckCircleIcon, UsersIcon } from '../ui/icons';
import { TrendingUpIcon } from '../ui/dashboard-icons';

export default function AdminDashboard() {
    const navigate = useNavigate();

    // Mock data - In production, fetch from API
    const stats = {
        totalUsers: 1247,
        totalLawyers: 45,
        activeCases: 89,
        monthlyRevenue: 125000,
        newUsersThisMonth: 156,
        completedCasesThisMonth: 234,
    };

    const monthlyActivity = [
        { month: 'Jul', count: 45 },
        { month: 'Ago', count: 62 },
        { month: 'Set', count: 58 },
        { month: 'Out', count: 71 },
        { month: 'Nov', count: 89 },
        { month: 'Dez', count: 95 },
    ];

    const recentActivity = [
        { id: 1, type: 'user', message: 'Novo usuário registrado: João Silva', time: 'Há 5 min', icon: '👤' },
        { id: 2, type: 'case', message: 'Caso FC-789456 foi concluído', time: 'Há 12 min', icon: '✅' },
        { id: 3, type: 'payment', message: 'Pagamento de 2.500 MT recebido', time: 'Há 23 min', icon: '💰' },
        { id: 4, type: 'lawyer', message: 'Advogado Dr. Pedro atribuído ao caso FC-789457', time: 'Há 1h', icon: '⚖️' },
        { id: 5, type: 'user', message: 'Novo usuário registrado: Maria Costa', time: 'Há 2h', icon: '👤' },
    ];

    const quickActions = [
        { label: 'Gestão de Usuários', route: '/admin/users', icon: '👥', color: 'blue', count: stats.totalUsers },
        { label: 'Gestão de Advogados', route: '/admin/lawyers', icon: '⚖️', color: 'purple', count: stats.totalLawyers },
        { label: 'Gestão de Pagamentos', route: '/admin/payments', icon: '💳', color: 'green', count: '125K MT' },
        { label: 'Gestão de Casos', route: '/admin/cases', icon: '📋', color: 'orange', count: stats.activeCases },
        { label: 'Relatórios', route: '/admin/analytics', icon: '📊', color: 'indigo', count: 'Ver' },
        { label: 'Configurações', route: '/admin/settings', icon: '⚙️', color: 'gray', count: 'Editar' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-2">Painel Administrativo 🛡️</h1>
                <p className="text-indigo-100">Gerencie toda a plataforma Fala Comigo</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total de Usuários"
                    value={stats.totalUsers}
                    icon={<UsersIcon className="w-7 h-7 text-white" />}
                    gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    trend={{ value: 12.5, isPositive: true }}
                    delay={0}
                />
                <StatCard
                    title="Advogados Ativos"
                    value={stats.totalLawyers}
                    icon={<GavelIcon className="w-7 h-7 text-white" />}
                    gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    trend={{ value: 8.3, isPositive: true }}
                    delay={100}
                />
                <StatCard
                    title="Casos Ativos"
                    value={stats.activeCases}
                    icon={<CheckCircleIcon className="w-7 h-7 text-white" />}
                    gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    trend={{ value: 15.7, isPositive: true }}
                    delay={200}
                />
                <StatCard
                    title="Receita Mensal"
                    value={`${(stats.monthlyRevenue / 1000).toFixed(0)}K MT`}
                    icon={<TrendingUpIcon className="w-7 h-7 text-white" />}
                    gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                    trend={{ value: 23.1, isPositive: true }}
                    delay={300}
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Acesso Rápido</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(action.route)}
                            className="flex items-center justify-between p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750"
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">{action.icon}</div>
                                <div className="text-left">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {action.label}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{action.count}</p>
                                </div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>

            {/* Activity Chart and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityChart data={monthlyActivity} title="Casos Mensais (Últimos 6 Meses)" />

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Atividade Recente</h3>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl">
                                    {activity.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activity.message}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Novos Usuários</h3>
                        <span className="text-2xl">📈</span>
                    </div>
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.newUsersThisMonth}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Este mês</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Casos Concluídos</h3>
                        <span className="text-2xl">✅</span>
                    </div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completedCasesThisMonth}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Este mês</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Taxa de Sucesso</h3>
                        <span className="text-2xl">🎯</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">94.2%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Casos resolvidos</p>
                </div>
            </div>
        </div>
    );
}
