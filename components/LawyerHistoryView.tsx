import React, { useMemo } from 'react';
import type { Order } from '../types';
import { OrderStatus } from '../types';
import { ChevronLeftIcon, ClockIcon, StarIcon } from './ui/icons';

interface Props {
    orders: Order[];
    onSelectOrder: (order: Order) => void;
    onBack: () => void;
}

export default function LawyerHistoryView({ orders, onSelectOrder, onBack }: Props) {
    // Filter only completed cases
    const completedOrders = useMemo(() => {
        return orders
            .filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.RATING_PENDING)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [orders]);

    // Calculate statistics
    const stats = useMemo(() => {
        const totalCases = completedOrders.length;
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.pkg.price, 0);
        const avgRating = 4.8; // Would calculate from actual ratings

        return { totalCases, totalRevenue, avgRating };
    }, [completedOrders]);

    return (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl animate-fade-in h-full min-h-[50vh] flex flex-col">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                    <ChevronLeftIcon className="w-5 h-5 mr-1" />
                    Voltar
                </button>
            </div>

            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400">
                    <ClockIcon className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Histórico de Casos</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Seus casos concluídos</p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90">Total de Casos</p>
                    <p className="text-2xl font-bold">{stats.totalCases}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90">Receita Total</p>
                    <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} MT</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
                    <p className="text-sm opacity-90">Avaliação Média</p>
                    <p className="text-2xl font-bold flex items-center gap-1">
                        <StarIcon className="w-5 h-5" />
                        {stats.avgRating}
                    </p>
                </div>
            </div>

            <div className="flex-1">
                {completedOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <ClockIcon className="w-12 h-12 mb-4 opacity-20" />
                        <p>Nenhum caso concluído ainda.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {completedOrders.map((order) => (
                            <button
                                key={order.id}
                                onClick={() => onSelectOrder(order)}
                                className="w-full text-left p-5 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-600 hover:shadow-lg transition-all border border-transparent hover:border-indigo-200 dark:hover:border-gray-500 group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-mono text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                                        #{order.human_id}
                                    </span>
                                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">
                                        Concluído
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {order.topic.name}
                                </h3>
                                <div className="flex justify-between items-end mt-3">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium text-green-600 dark:text-green-400">
                                            {order.pkg.price.toLocaleString()} MT
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {new Date(order.createdAt).toLocaleDateString('pt-PT')}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
