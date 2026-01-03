
import React from 'react';
import type { Order } from '../types';
import { ChevronLeftIcon, CheckCircleIcon } from './ui/icons';

interface Props {
    order: Order;
    onFinish: () => void;
}

// Phone Icon locally defined
const PhoneIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

export default function PhoneConsultationView({ order, onFinish }: Props) {
    const lawyer = order.assignment?.lawyer;

    return (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center animate-fade-in max-w-md mx-auto">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Tudo Pronto!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Pode ligar para o seu advogado agora.</p>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 mb-8">
                <div className="flex items-center justify-center mb-4">
                     <img src={lawyer?.avatarUrl} alt={lawyer?.nome} className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-600 shadow-md" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{lawyer?.nome}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Especialista em {order.topic.name}</p>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-500">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Número Direto</p>
                    <a href={`tel:${lawyer?.phoneNumber || '+258841234567'}`} className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2 hover:underline">
                        <PhoneIcon className="w-6 h-6" />
                        {lawyer?.phoneNumber || '+258 84 123 4567'}
                    </a>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                    O seu pacote de <strong>{order.pkg.name}</strong> está ativo. A duração da chamada será monitorizada.
                </p>
            </div>

            <button 
                onClick={onFinish}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg"
            >
                Terminar Chamada & Avaliar
            </button>
        </div>
    );
}
