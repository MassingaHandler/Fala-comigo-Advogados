import React, { useState, useRef, useEffect } from 'react';
import type { Order, ChatMessage, Document as DocType } from '../types';
import { OrderStatus } from '../types';
import { ChevronLeftIcon, PaperclipIcon, SendIcon, DocumentTextIcon, VideoIcon, CheckCircleIcon, UserIcon } from './ui/icons';

interface Props {
    order: Order;
    onUpdateOrder: (order: Order) => void;
    onBack: () => void;
    onCompleteCase: () => void;
}

export default function LawyerChatView({ order, onUpdateOrder, onBack, onCompleteCase }: Props) {
    const [newMessage, setNewMessage] = useState('');
    const [privateNote, setPrivateNote] = useState('');
    const [showNotes, setShowNotes] = useState(false);
    const [sessionDuration, setSessionDuration] = useState(0);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const session = order.assignment?.session;

    // Timer for session duration
    useEffect(() => {
        const interval = setInterval(() => {
            setSessionDuration(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [session?.messages]);

    if (!session) {
        return (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center">
                <p>Ocorreu um erro ao carregar a sessão de chat.</p>
                <button onClick={onBack} className="mt-4 text-indigo-600 dark:text-indigo-400">Voltar</button>
            </div>
        );
    }

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const lawyerMessage: ChatMessage = {
            id: `msg-lawyer-${Date.now()}`,
            sender: 'lawyer',
            text: newMessage,
            timestamp: new Date(),
            type: 'text',
        };

        const updatedMessages = [...session.messages, lawyerMessage];

        const updatedOrder: Order = {
            ...order,
            status: OrderStatus.IN_PROGRESS, // Auto-update to in progress when lawyer sends first message
            assignment: {
                ...order.assignment!,
                session: {
                    ...session,
                    messages: updatedMessages,
                }
            }
        };
        onUpdateOrder(updatedOrder);
        setNewMessage('');
    };

    const handleUploadDocument = () => {
        const filename = `parecer_${Date.now()}.pdf`;
        const newDoc: DocType = {
            document_id: `doc-${Date.now()}`,
            filename: filename,
            url: `/uploads/${filename}`,
            uploadedAt: new Date(),
        };

        const docMessage: ChatMessage = {
            id: `msg-doc-${Date.now()}`,
            sender: 'lawyer',
            text: `Enviou o documento: ${filename}`,
            timestamp: new Date(),
            type: 'document',
            document: newDoc,
        };

        const updatedOrder: Order = {
            ...order,
            assignment: {
                ...order.assignment!,
                session: {
                    ...session,
                    messages: [...session.messages, docMessage],
                    documents: [...session.documents, newDoc],
                }
            }
        };
        onUpdateOrder(updatedOrder);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col h-[85vh] animate-fade-in">
            {/* Header */}
            <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <ChevronLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>

                <div className="flex items-center gap-3 ml-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                        <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                            Cliente
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.human_id} • {order.topic.name}
                        </p>
                    </div>
                </div>

                {/* Timer and Actions */}
                <div className="flex items-center gap-3">
                    <div className="text-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Duração</p>
                        <p className="text-sm font-mono font-bold text-gray-800 dark:text-gray-200">
                            {formatDuration(sessionDuration)}
                        </p>
                    </div>

                    <button
                        onClick={() => setShowNotes(!showNotes)}
                        className={`px-3 py-2 rounded-lg transition-all text-sm font-medium ${showNotes
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                    >
                        📝 Notas
                    </button>

                    <button
                        onClick={onCompleteCase}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
                    >
                        ✓ Concluir
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Chat Body */}
                <div className={`flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-all ${showNotes ? 'mr-80' : ''}`}>
                    <div className="space-y-4">
                        {session.messages.map((msg) => (
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'lawyer' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'user' && (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        C
                                    </div>
                                )}
                                <div className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${msg.sender === 'lawyer'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-600'
                                    }`}>
                                    {msg.type === 'document' ? (
                                        <div className="flex items-center gap-2">
                                            <DocumentTextIcon className="w-8 h-8 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold">{msg.document?.filename}</p>
                                                <a href="#" onClick={(e) => e.preventDefault()} className="text-xs underline opacity-80">
                                                    Ver documento
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                                    )}
                                    <p className={`text-[10px] mt-1 text-right ${msg.sender === 'lawyer' ? 'text-indigo-100' : 'text-gray-400'
                                        }`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div ref={chatEndRef} />
                </div>

                {/* Private Notes Sidebar */}
                {showNotes && (
                    <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Notas Privadas</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            Estas notas são privadas e não são visíveis ao cliente.
                        </p>
                        <textarea
                            value={privateNote}
                            onChange={(e) => setPrivateNote(e.target.value)}
                            placeholder="Adicionar notas sobre o caso..."
                            className="w-full h-64 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                        />
                        <button className="mt-2 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                            Salvar Notas
                        </button>
                    </div>
                )}
            </div>

            {/* Input Footer */}
            <footer className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleUploadDocument}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        title="Enviar documento"
                    >
                        <PaperclipIcon className="w-6 h-6" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Digite sua mensagem ao cliente..."
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-sm sm:text-base"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-colors disabled:bg-gray-400"
                        disabled={!newMessage.trim()}
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
