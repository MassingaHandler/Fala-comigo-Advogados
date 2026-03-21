import React, { useState, useEffect } from 'react';
import { DownloadIcon, FilterIcon } from '../ui/dashboard-icons';
import ActivityChart from '../ui/ActivityChart';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AdminAnalytics() {
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
    const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'cases' | 'users'>('revenue');
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('fala_comigo_token');
                if (!token) return;

                const url = new URL('http://localhost:8000/api/v1/admin/analytics');
                url.searchParams.append('period', period);

                const response = await fetch(url.toString(), {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.analytics) {
                        setData(result.analytics);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar análises:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [period]);

    if (isLoading && !data) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    const { chartData, topLawyers, totalRevenue, totalCases, totalUsers, revenueThisMonth, newUsersThisMonth, completedCasesThisMonth } = data || {};

    const getChartData = () => {
        if (!chartData) return [];
        return chartData[selectedMetric] || [];
    };

    const getChartTitle = () => {
        const metric = selectedMetric === 'revenue' ? 'Receita' : selectedMetric === 'cases' ? 'Casos' : 'Usuários';
        const periodLabel = period === 'week' ? 'Semanal' : period === 'month' ? 'Mensal (Últimos 6 Meses)' : 'Anual';
        return `${metric} ${periodLabel}`;
    };

    // Lawyer performance data from API
    const lawyerPerformance = topLawyers || [];

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
                    <p className="text-3xl font-bold">{(totalRevenue || 0).toLocaleString()} MT</p>
                    <p className="text-xs opacity-75 mt-2">Mensal: {(revenueThisMonth || 0).toLocaleString()} MT</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Casos Totais</p>
                    <p className="text-3xl font-bold">{totalCases || 0}</p>
                    <p className="text-xs opacity-75 mt-2">Este mês: {completedCasesThisMonth || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Usuários Totais</p>
                    <p className="text-3xl font-bold">{totalUsers || 0}</p>
                    <p className="text-xs opacity-75 mt-2">Novos este mês: {newUsersThisMonth || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
                    <p className="text-sm opacity-90 mb-1">Satisfação</p>
                    <p className="text-3xl font-bold">96.8%</p>
                    <p className="text-xs opacity-75 mt-2">Baseado em avaliações</p>
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
