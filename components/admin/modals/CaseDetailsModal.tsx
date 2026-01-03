import React from 'react';
import Modal from '../../ui/Modal';
import { OrderStatus } from '../../../types';

interface Case {
    id: string;
    caseId: string;
    client: string;
    clientEmail?: string;
    lawyer: string;
    lawyerEmail?: string;
    topic: string;
    status: OrderStatus;
    createdDate: string;
    amount: number;
    description?: string;
}

interface CaseDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    caseData: Case | null;
}

export default function CaseDetailsModal({ isOpen, onClose, caseData }: CaseDetailsModalProps) {
    if (!caseData) return null;

    const getStatusBadge = (status: OrderStatus) => {
        const badges = {
            [OrderStatus.PENDING_PAYMENT]: { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: '💰' },
            [OrderStatus.ASSIGNED]: { label: 'Atribuído', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: '👤' },
            [OrderStatus.IN_PROGRESS]: { label: 'Em Andamento', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: '⚡' },
            [OrderStatus.COMPLETED]: { label: 'Concluído', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: '✓' },
            [OrderStatus.RATING_PENDING]: { label: 'Avaliação Pendente', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: '⭐' },
            [OrderStatus.CANCELLED]: { label: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: '✗' },
        };
        const badge = badges[status] || badges[OrderStatus.PENDING_PAYMENT];
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full ${badge.color}`}>
                <span>{badge.icon}</span>
                {badge.label}
            </span>
        );
    };

    const mockMessages = [
        { id: 1, sender: 'client', text: 'Olá, preciso de ajuda com um problema de família.', time: '10:30' },
        { id: 2, sender: 'lawyer', text: 'Bom dia! Claro, vou ajudá-lo. Pode me contar mais detalhes?', time: '10:35' },
        { id: 3, sender: 'client', text: 'É sobre pensão alimentícia.', time: '10:40' },
    ];

    const mockDocuments = [
        { id: 1, name: 'documento_identidade.pdf', size: '2.3 MB', uploadedAt: '2024-12-01' },
        { id: 2, name: 'certidao_nascimento.pdf', size: '1.8 MB', uploadedAt: '2024-12-01' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Caso" size="xl">
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ID do Caso</p>
                        <p className="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {caseData.caseId}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                        {getStatusBadge(caseData.status)}
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valor</p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                            {caseData.amount.toLocaleString()} MT
                        </p>
                    </div>
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Client Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                            👤 Informações do Cliente
                        </h3>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Nome</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                                {caseData.client}
                            </p>
                        </div>
                        {caseData.clientEmail && (
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                                    {caseData.clientEmail}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Lawyer Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                            ⚖️ Advogado Atribuído
                        </h3>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Nome</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                                {caseData.lawyer}
                            </p>
                        </div>
                        {caseData.lawyerEmail && (
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                                    {caseData.lawyerEmail}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Case Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                        📋 Detalhes do Caso
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tópico</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                                {caseData.topic}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Data de Criação</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                                {new Date(caseData.createdDate).toLocaleDateString('pt-PT', { dateStyle: 'long' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                        💬 Mensagens Recentes
                    </h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {mockMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'client' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'client'
                                            ? 'bg-gray-100 dark:bg-gray-700'
                                            : 'bg-indigo-600 text-white'
                                        }`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 ${msg.sender === 'client' ? 'text-gray-500 dark:text-gray-400' : 'text-indigo-200'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Documents */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                        📎 Documentos Anexados
                    </h3>
                    <div className="space-y-2">
                        {mockDocuments.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                        <span className="text-red-600 dark:text-red-400">📄</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{doc.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {doc.size} • {new Date(doc.uploadedAt).toLocaleDateString('pt-PT')}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium">
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Reatribuir Advogado
                    </button>
                    <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Enviar Mensagem
                    </button>
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
