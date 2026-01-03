
import React from 'react';
import type { Order } from '../types';
import { CheckCircleIcon } from './ui/icons';

interface Props {
  order: Order;
  onStartChat: () => void;
  onGoHome: () => void;
}

export default function OrderConfirmation({ order, onStartChat, onGoHome }: Props) {
    const lawyer = order.assignment?.lawyer;

    return (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center animate-fade-in">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                {order.parent_order_id ? 'Acompanhamento Confirmado!' : 'Consulta Confirmada!'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Pagamento recebido com sucesso.</p>
            
            {/* Important ID Display */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mb-6">
                <p className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider mb-1">Guarde este ID para o Futuro</p>
                <p className="text-3xl font-mono font-bold text-gray-800 dark:text-gray-100 tracking-widest select-all">{order.order_id}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Vai precisar deste código se quiser solicitar o acompanhamento deste processo mais tarde.
                </p>
            </div>
            
            <div className="text-left p-6 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4 mb-8">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Tema:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{order.topic.name}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Pacote:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{order.pkg.name}</span>
                </div>
                {lawyer && (
                     <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                        <span className="text-gray-600 dark:text-gray-400">Advogado(a):</span>
                        <div className="flex items-center gap-2">
                             <img src={lawyer.avatarUrl} alt={lawyer.nome} className="w-8 h-8 rounded-full" />
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{lawyer.nome}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={onStartChat} className="w-full sm:w-auto bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                    {order.consultationType === 'phone' ? 'Ver Número de Contacto' : 'Iniciar Conversa'}
                </button>
                <button onClick={onGoHome} className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-300">
                    Página Inicial
                </button>
            </div>
        </div>
    );
}
