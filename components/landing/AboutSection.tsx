import React from 'react';
import { Zap, Shield, DollarSign } from 'lucide-react';

export default function AboutSection() {
    const benefits = [
        {
            icon: Zap,
            title: 'Atendimento Rápido',
            description: 'Conecte-se com advogados verificados em menos de 10 minutos. Sem filas, sem esperas.'
        },
        {
            icon: Shield,
            title: 'Seguro e Confiável',
            description: 'Todos os advogados são verificados pela OAM. Seus dados protegidos com criptografia de ponta a ponta.'
        },
        {
            icon: DollarSign,
            title: 'Preços Acessíveis',
            description: 'Planos flexíveis para todos os orçamentos. Pague apenas pelo que usar, sem taxas ocultas.'
        }
    ];

    return (
        <section id="sobre" className="landing-section bg-gray-50 dark:bg-gray-900">
            <div className="container-responsive">
                <div className="text-center mb-16 animate-slide-up">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        O que é o <span className="gradient-text">Fala Comigo</span>?
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Uma plataforma digital que conecta clientes a advogados verificados em Moçambique,
                        oferecendo atendimento jurídico rápido, seguro e acessível.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center mb-6 transform hover:rotate-6 transition-transform">
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Additional Info */}
                <div className="mt-16 bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 md:p-12 text-white animate-scale-in">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-3xl font-bold mb-4">
                                Primeira Interação via Chat Inteligente
                            </h3>
                            <p className="text-red-50 text-lg leading-relaxed">
                                Nosso sistema de chat guiado ajuda você a descrever seu problema de forma simples.
                                Analisamos sua situação e conectamos você ao advogado mais adequado para o seu caso.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                                <p className="text-4xl font-bold mb-2">24/7</p>
                                <p className="text-red-100">Disponível</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                                <p className="text-4xl font-bold mb-2">156</p>
                                <p className="text-red-100">Advogados</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                                <p className="text-4xl font-bold mb-2">11</p>
                                <p className="text-red-100">Cidades</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                                <p className="text-4xl font-bold mb-2">98%</p>
                                <p className="text-red-100">Satisfação</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
