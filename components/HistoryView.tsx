
import React from 'react';
import type { Order } from '../types';
import { ChevronLeftIcon, ClockIcon } from './ui/icons';

interface Props {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onBack: () => void;
}

export default function HistoryView({ orders, onSelectOrder, onBack }: Props) {
  // Sort by date desc
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl animate-fade-in h-full min-h-[50vh] flex flex-col">
        <div className="flex items-center mb-6">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
                <ChevronLeftIcon className="w-5 h-5 mr-1" />
                Voltar
            </button>
        </div>
        
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                 <ClockIcon className="w-8 h-8" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Histórico</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Suas consultas e processos anteriores</p>
            </div>
        </div>

        <div className="flex-1">
            {sortedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <ClockIcon className="w-12 h-12 mb-4 opacity-20" />
                    <p>Nenhum histórico disponível.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedOrders.map((order) => (
                        <button 
                            key={order.id} 
                            onClick={() => onSelectOrder(order)}
                            className="w-full text-left p-5 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-600 hover:shadow-lg transition-all border border-transparent hover:border-red-200 dark:hover:border-gray-500 group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-mono text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider">#{order.order_id}</span>
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                                    order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' :
                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{order.topic.name}</h3>
                            <div className="flex justify-between items-end mt-3">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {order.assignment?.lawyer ? (
                                        <div className="flex items-center gap-2">
                                            <img src={order.assignment.lawyer.avatarUrl} className="w-6 h-6 rounded-full" alt="Avatar" />
                                            <span className="font-medium">{order.assignment.lawyer.nome}</span>
                                        </div>
                                    ) : (
                                        <span className="italic opacity-75">A aguardar atribuição</span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-400 font-medium">
                                    {(order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt)).toLocaleDateString()}
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
