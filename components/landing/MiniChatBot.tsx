import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
    id: number;
    sender: 'bot' | 'user';
    text: string;
    options?: string[];
}

export default function MiniChatBot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: 'bot',
            text: 'Olá! 👋 Sou o assistente virtual do Fala Comigo. Como posso ajudá-lo hoje?',
            options: ['Preciso de um advogado', 'Quero saber mais', 'Ver preços']
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const conversationFlow = [
        {
            question: 'Que tipo de caso você tem?',
            options: ['Família', 'Trabalho', 'Comercial', 'Terra/DUAT', 'Outro']
        },
        {
            question: 'Qual é o nível de urgência?',
            options: ['Muito urgente', 'Urgente', 'Normal', 'Posso esperar']
        },
        {
            question: 'Perfeito! Vou conectá-lo com um advogado especializado. Deseja criar uma conta agora?',
            options: ['Sim, criar conta', 'Saber mais primeiro']
        }
    ];

    const handleOptionClick = (option: string) => {
        // Add user message
        const userMessage: Message = {
            id: messages.length + 1,
            sender: 'user',
            text: option
        };
        setMessages(prev => [...prev, userMessage]);

        // Show typing indicator
        setIsTyping(true);

        // Simulate bot response delay
        setTimeout(() => {
            setIsTyping(false);

            if (currentStep < conversationFlow.length) {
                const nextStep = conversationFlow[currentStep];
                const botMessage: Message = {
                    id: messages.length + 2,
                    sender: 'bot',
                    text: nextStep.question,
                    options: nextStep.options
                };
                setMessages(prev => [...prev, botMessage]);
                setCurrentStep(prev => prev + 1);
            } else {
                // End of conversation
                const finalMessage: Message = {
                    id: messages.length + 2,
                    sender: 'bot',
                    text: '✅ Ótimo! Você será redirecionado para criar sua conta e começar.'
                };
                setMessages(prev => [...prev, finalMessage]);
            }
        }, 1000);
    };

    return (
        <section id="chat" className="landing-section bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container-responsive">
                <div className="text-center mb-12 animate-slide-up">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Experimente o <span className="gradient-text">Chat Inteligente</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Veja como é fácil descrever seu problema e ser conectado ao advogado certo
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Assistente Fala Comigo</h3>
                                    <p className="text-sm text-red-100">Online • Responde em segundos</p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                                >
                                    <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'bot'
                                                ? 'bg-gradient-to-br from-red-500 to-red-700'
                                                : 'bg-gradient-to-br from-blue-500 to-blue-700'
                                            }`}>
                                            {message.sender === 'bot' ? (
                                                <Bot className="w-4 h-4 text-white" />
                                            ) : (
                                                <User className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <div className={`rounded-2xl p-4 ${message.sender === 'bot'
                                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                                                } shadow-md`}>
                                                <p className="leading-relaxed">{message.text}</p>
                                            </div>
                                            {message.options && (
                                                <div className="mt-3 space-y-2">
                                                    {message.options.map((option, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleOptionClick(option)}
                                                            className="block w-full text-left px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-all duration-200 transform hover:scale-105"
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start animate-slide-up">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Footer */}
                        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Digite sua mensagem..."
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    disabled
                                />
                                <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50" disabled>
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                💡 Use os botões acima para interagir com o chat de demonstração
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
