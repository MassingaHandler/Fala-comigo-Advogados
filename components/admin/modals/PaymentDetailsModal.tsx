import React from 'react';
import Modal from '../../ui/Modal';

interface Payment {
    id: string;
    transactionId: string;
    client: string;
    clientEmail?: string;
    clientPhone?: string;
    caseId: string;
    amount: number;
    method: 'mpesa' | 'card' | 'bank';
    status: 'completed' | 'pending' | 'failed';
    date: string;
    description?: string;
}

interface PaymentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    payment: Payment | null;
}

export default function PaymentDetailsModal({ isOpen, onClose, payment }: PaymentDetailsModalProps) {
    if (!payment) return null;

    const getStatusBadge = (status: string) => {
        const badges = {
            completed: { label: 'Concluído', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: '✓' },
            pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: '⏳' },
            failed: { label: 'Falhou', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: '✗' },
        };
        const badge = badges[status as keyof typeof badges] || badges.pending;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full ${badge.color}`}>
                <span>{badge.icon}</span>
                {badge.label}
            </span>
        );
    };

    const getMethodBadge = (method: string) => {
        const badges = {
            mpesa: { label: 'M-Pesa', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: '📱' },
            card: { label: 'Cartão', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: '💳' },
            bank: { label: 'Banco', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400', icon: '🏦' },
        };
        const badge = badges[method as keyof typeof badges] || badges.mpesa;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full ${badge.color}`}>
                <span>{badge.icon}</span>
                {badge.label}
            </span>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Pagamento" size="lg">
            <div className="space-y-6">
                {/* Status and Method */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                        {getStatusBadge(payment.status)}
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Método</p>
                        {getMethodBadge(payment.method)}
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valor</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {payment.amount.toLocaleString()} MT
                        </p>
                    </div>
                </div>

                {/* Transaction Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                            Informações da Transação
                        </h3>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">ID da Transação</p>
                            <p className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                                {payment.transactionId}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">ID do Caso</p>
                            <p className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">
                                {payment.caseId}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Data</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                                {new Date(payment.date).toLocaleString('pt-PT', {
                                    dateStyle: 'long',
                                    timeStyle: 'short'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                            Informações do Cliente
                        </h3>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Nome</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                                {payment.client}
                            </p>
                        </div>
                        {payment.clientEmail && (
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                                    {payment.clientEmail}
                                </p>
                            </div>
                        )}
                        {payment.clientPhone && (
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Telefone</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                                    {payment.clientPhone}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timeline */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                        Histórico
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="text-green-600 dark:text-green-400">✓</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Pagamento Iniciado</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(payment.date).toLocaleString('pt-PT')}
                                </p>
                            </div>
                        </div>
                        {payment.status === 'completed' && (
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <span className="text-green-600 dark:text-green-400">✓</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Pagamento Confirmado</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(payment.date).toLocaleString('pt-PT')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Enviar Recibo
                    </button>
                    {payment.status === 'completed' && (
                        <button className="flex-1 px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            Solicitar Reembolso
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
