import React from 'react';
import { MessageSquare, Search, UserCheck, CheckCircle } from 'lucide-react';

export default function HowItWorksSection() {
    const steps = [
        {
            step: 1,
            title: 'Descreva seu problema',
            description: 'Use nosso chat inteligente para descrever sua situação jurídica de forma simples e rápida.',
            icon: MessageSquare,
            color: 'from-blue-500 to-blue-600'
        },
        {
            step: 2,
            title: 'Sistema analisa e encaminha',
            description: 'Nossa plataforma identifica o tipo de caso e encontra o advogado mais adequado para você.',
            icon: Search,
            color: 'from-purple-500 to-purple-600'
        },
        {
            step: 3,
            title: 'Advogado aceita o caso',
            description: 'Um advogado verificado aceita seu caso e entra em contato rapidamente.',
            icon: UserCheck,
            color: 'from-orange-500 to-orange-600'
        },
        {
            step: 4,
            title: 'Atendimento e acompanhamento',
            description: 'Receba atendimento profissional e acompanhe todo o processo pela plataforma.',
            icon: CheckCircle,
            color: 'from-green-500 to-green-600'
        }
    ];

    return (
        <section id="como-funciona" className="landing-section bg-white dark:bg-gray-800">
            <div className="container-responsive">
                <div className="text-center mb-16 animate-slide-up">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Como <span className="gradient-text">Funciona</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Processo simples e transparente em 4 passos
                    </p>
                </div>

                <div className="relative">
                    {/* Connection Line - Desktop */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 to-green-500 transform -translate-y-1/2 opacity-20"></div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={index}
                                    className="relative animate-slide-up"
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                >
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                                        {/* Step Number */}
                                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                            {step.step}
                                        </div>

                                        {/* Icon */}
                                        <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 mx-auto transform hover:rotate-12 transition-transform`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 text-center">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Arrow - Desktop */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                            <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                                                <span className="text-gray-400">→</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Arrow - Mobile */}
                                    {index < steps.length - 1 && (
                                        <div className="lg:hidden flex justify-center my-4">
                                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                <span className="text-gray-400">↓</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
