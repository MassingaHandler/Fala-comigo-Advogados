import React from 'react';
import Modal from './ui/Modal';
import { Order, OrderStatus } from '../types';
import { PhoneIcon, ClockIcon, UserIcon, ScaleIcon } from './ui/icons';
import { MessageSquareIcon } from './ui/dashboard-icons';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onStartChat: (order: Order) => void;
}

export default function LawyerCaseDetailsModal({ isOpen, onClose, order, onStartChat }: Props) {
    if (!order) return null;

    const getStatusBadge = (status: OrderStatus | string) => {
        const badges: any = {
            [OrderStatus.ASSIGNED]: { label: 'Atribuído', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
            [OrderStatus.IN_PROGRESS]: { label: 'Em Andamento', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
            [OrderStatus.COMPLETED]: { label: 'Concluído', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
        };
        const badge = badges[status as OrderStatus] || { label: status, color: 'bg-gray-100 text-gray-800' };
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>{badge.label}</span>;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes da Consulta" size="md">
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">ID da Consulta</p>
                        <p className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
                            {order.human_id}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 text-right">Status</p>
                        <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(order.status)}
                            {order.followUpRequested && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 rounded-full text-[10px] font-bold animate-pulse">
                                    📌 Acompanhamento Solicitado
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Client Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-indigo-500" />
                        Informações do Cliente
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{order.clientName || 'Cliente'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                <PhoneIcon className="w-4 h-4 text-green-500" />
                                {order.clientPhoneNumber}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Service Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                        <ScaleIcon className="w-5 h-5 text-indigo-500" />
                        Detalhes do Serviço
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Tópico</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{order.topic.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pacote</p>
                            <p className="font-medium text-indigo-600 dark:text-indigo-400">{order.pkg.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Tipo de Atendimento</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                {order.consultationType === 'phone' ? (
                                    <><PhoneIcon className="w-4 h-4" /> Telefone</>
                                ) : (
                                    <><MessageSquareIcon className="w-4 h-4" /> Chat Digital</>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Data de Solicitação</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                <ClockIcon className="w-4 h-4" />
                                {new Date(order.createdAt).toLocaleDateString('pt-PT')} {new Date(order.createdAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-2">
                            💰 Pagamento
                        </h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Valor Pago</p>
                                <p className="text-xl font-bold text-green-600 dark:text-green-400">{order.pkg.price.toLocaleString()} MT</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Método</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">M-Pesa</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                            📝 Notas do Caso
                        </h3>
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg min-h-[80px]">
                            {order.lawyerNotes ? (
                                <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{order.lawyerNotes}"</p>
                            ) : (
                                <p className="text-sm text-gray-400 italic">Nenhuma nota salva ainda.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={() => {
                            onStartChat(order);
                            onClose();
                        }}
                        className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 transform hover:-translate-y-0.5 active:scale-95"
                    >
                        {order.status === OrderStatus.ASSIGNED ? 'Iniciar Atendimento' : 'Continuar Atendimento'}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
