import React, { useState } from 'react';
import { DownloadIcon, FilterIcon } from '../ui/dashboard-icons';
import ActivityChart from '../ui/ActivityChart';

export default function AdminAnalytics() {
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
    const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'cases' | 'users'>('revenue');

    // Mock data for revenue
    const revenueData = {
        week: [
            { month: 'Seg', count: 12000 },
            { month: 'Ter', count: 15000 },
            { month: 'Qua', count: 18000 },
            { month: 'Qui', count: 14000 },
            { month: 'Sex', count: 22000 },
            { month: 'Sáb', count: 8000 },
            { month: 'Dom', count: 5000 },
        ],
        month: [
            { month: 'Jul', count: 85000 },
            { month: 'Ago', count: 92000 },
            { month: 'Set', count: 88000 },
            { month: 'Out', count: 105000 },
            { month: 'Nov', count: 118000 },
            { month: 'Dez', count: 125000 },
        ],
        year: [
            { month: '2019', count: 450000 },
            { month: '2020', count: 520000 },
            { month: '2021', count: 680000 },
            { month: '2022', count: 850000 },
            { month: '2023', count: 1020000 },
            { month: '2024', count: 1250000 },
        ],
    };

    const casesData = {
        week: [
            { month: 'Seg', count: 12 },
            { month: 'Ter', count: 15 },
            { month: 'Qua', count: 18 },
            { month: 'Qui', count: 14 },
            { month: 'Sex', count: 22 },
            { month: 'Sáb', count: 8 },
            { month: 'Dom', count: 5 },
        ],
        month: [
            { month: 'Jul', count: 45 },
            { month: 'Ago', count: 62 },
            { month: 'Set', count: 58 },
            { month: 'Out', count: 71 },
            { month: 'Nov', count: 89 },
            { month: 'Dez', count: 95 },
        ],
        year: [
            { month: '2019', count: 320 },
            { month: '2020', count: 450 },
            { month: '2021', count: 580 },
            { month: '2022', count: 720 },
            { month: '2023', count: 890 },
            { month: '2024', count: 1050 },
        ],
    };

    const usersData = {
        week: [
            { month: 'Seg', count: 5 },
            { month: 'Ter', count: 8 },
            { month: 'Qua', count: 12 },
            { month: 'Qui', count: 7 },
            { month: 'Sex', count: 15 },
            { month: 'Sáb', count: 3 },
            { month: 'Dom', count: 2 },
        ],
        month: [
            { month: 'Jul', count: 85 },
            { month: 'Ago', count: 102 },
            { month: 'Set', count: 98 },
            { month: 'Out', count: 125 },
            { month: 'Nov', count: 148 },
            { month: 'Dez', count: 156 },
        ],
        year: [
            { month: '2019', count: 450 },
            { month: '2020', count: 620 },
            { month: '2021', count: 850 },
            { month: '2022', count: 1050 },
            { month: '2023', count: 1180 },
            { month: '2024', count: 1247 },
        ],
    };

    const getChartData = () => {
        if (selectedMetric === 'revenue') return revenueData[period];
        if (selectedMetric === 'cases') return casesData[period];
        return usersData[period];
    };

    const getChartTitle = () => {
        const metric = selectedMetric === 'revenue' ? 'Receita' : selectedMetric === 'cases' ? 'Casos' : 'Usuários';
        const periodLabel = period === 'week' ? 'Semanal' : period === 'month' ? 'Mensal (Últimos 6 Meses)' : 'Anual';
        return `${metric} ${periodLabel}`;
    };

    // Lawyer performance data
    const lawyerPerformance = [
        { name: 'Dra. Ana Silva', cases: 45, rating: 4.8, revenue: 112500, satisfaction: 96 },
        { name: 'Dr. João Santos', cases: 67, rating: 4.9, revenue: 167500, satisfaction: 98 },
        { name: 'Dra. Maria Costa', cases: 38, rating: 4.7, revenue: 95000, satisfaction: 94 },
        { name: 'Dr. Pedro Alves', cases: 29, rating: 4.6, revenue: 72500, satisfaction: 92 },
        { name: 'Dra. Sofia Moreira', cases: 52, rating: 4.9, revenue: 130000, satisfaction: 97 },
    ];

    const exportReport = (format: 'csv' | 'pdf') => {
        // Simulate export
        alert(`Exportando relatório em formato ${format.toUpperCase()}...`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Análises e Relatórios</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Visualize métricas detalhadas da plataforma</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => exportReport('csv')}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        CSV
                    </button>
                    <button
                        onClick={() => exportReport('pdf')}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        PDF
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Receita Total</p>
                    <p className="text-3xl font-bold">125K MT</p>
                    <p className="text-xs opacity-75 mt-2">↑ 23.1% vs mês anterior</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Casos Concluídos</p>
                    <p className="text-3xl font-bold">234</p>
                    <p className="text-xs opacity-75 mt-2">↑ 15.7% vs mês anterior</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Novos Usuários</p>
                    <p className="text-3xl font-bold">156</p>
                    <p className="text-xs opacity-75 mt-2">↑ 12.5% vs mês anterior</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Satisfação</p>
                    <p className="text-3xl font-bold">94.2%</p>
                    <p className="text-xs opacity-75 mt-2">↑ 2.1% vs mês anterior</p>
                </div>
            </div>

            {/* Chart Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <FilterIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Métrica:</span>
                        <div className="flex gap-2">
                            {[
                                { id: 'revenue', label: 'Receita', icon: '💰' },
                                { id: 'cases', label: 'Casos', icon: '📋' },
                                { id: 'users', label: 'Usuários', icon: '👥' }
                            ].map((metric) => (
                                <button
                                    key={metric.id}
                                    onClick={() => setSelectedMetric(metric.id as any)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${selectedMetric === metric.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {metric.icon} {metric.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Período:</span>
                        <div className="flex gap-2">
                            {[
                                { id: 'week', label: 'Semana' },
                                { id: 'month', label: 'Mês' },
                                { id: 'year', label: 'Ano' }
                            ].map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setPeriod(p.id as any)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${period === p.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <ActivityChart data={getChartData()} title={getChartTitle()} />
            </div>

            {/* Lawyer Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Performance dos Advogados</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ranking por casos concluídos</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Advogado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Casos</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avaliação</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Receita</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Satisfação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {lawyerPerformance.map((lawyer, index) => (
                                <tr key={lawyer.name} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {lawyer.name.split(' ')[1]?.charAt(0) || lawyer.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-gray-200">{lawyer.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">{lawyer.cases}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-500">★</span>
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{lawyer.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                            {lawyer.revenue.toLocaleString()} MT
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-24">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{ width: `${lawyer.satisfaction}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{lawyer.satisfaction}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Client Satisfaction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Distribuição de Avaliações</h3>
                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const percentage = stars === 5 ? 65 : stars === 4 ? 25 : stars === 3 ? 7 : stars === 2 ? 2 : 1;
                            return (
                                <div key={stars} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-20">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stars}</span>
                                        <span className="text-yellow-500">★</span>
                                    </div>
                                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                        <div
                                            className="bg-yellow-500 h-3 rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 w-12 text-right">
                                        {percentage}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Taxa de Conversão</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 dark:text-gray-400">Visitantes → Registros</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">32%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '32%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 dark:text-gray-400">Registros → Primeira Consulta</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">68%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div className="bg-green-600 h-3 rounded-full" style={{ width: '68%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 dark:text-gray-400">Primeira → Segunda Consulta</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">45%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div className="bg-purple-600 h-3 rounded-full" style={{ width: '45%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
