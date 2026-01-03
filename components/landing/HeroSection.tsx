import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

interface HeroSectionProps {
    onGetStarted: () => void;
    onLearnMore: () => void;
}

export default function HeroSection({ onGetStarted, onLearnMore }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-900">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container-responsive relative z-10 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-white animate-slide-in-left">
                        <div className="inline-block mb-4">
                            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                                🇲🇿 Plataforma Jurídica Digital de Moçambique
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            Advogados Verificados ao Seu Alcance
                        </h1>

                        <p className="text-xl md:text-2xl mb-8 text-red-50 leading-relaxed">
                            Conecte-se com advogados qualificados em minutos. Atendimento jurídico rápido, seguro e acessível para todos os moçambicanos.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button
                                onClick={onGetStarted}
                                className="group bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                            >
                                Começar Agora
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={onLearnMore}
                                className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Play className="w-5 h-5" />
                                Saber Mais
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <span className="text-2xl">⚖️</span>
                                </div>
                                <div>
                                    <p className="font-semibold">OAM Certificado</p>
                                    <p className="text-sm text-red-100">Advogados Verificados</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <span className="text-2xl">🔒</span>
                                </div>
                                <div>
                                    <p className="font-semibold">100% Seguro</p>
                                    <p className="text-sm text-red-100">Dados Protegidos</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <div>
                                    <p className="font-semibold">8 min</p>
                                    <p className="text-sm text-red-100">Tempo Médio</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Illustration */}
                    <div className="relative animate-slide-in-right hidden lg:block">
                        <div className="relative">
                            <img
                                src="/hero_illustration.png"
                                alt="Advogado Digital"
                                className="w-full h-auto drop-shadow-2xl animate-float"
                            />

                            {/* Floating Stats Cards */}
                            <div className="absolute top-10 -left-10 bg-white rounded-2xl p-4 shadow-2xl animate-float" style={{ animationDelay: '0.5s' }}>
                                <p className="text-sm text-gray-600 mb-1">Casos Resolvidos</p>
                                <p className="text-3xl font-bold text-red-600">2,847+</p>
                            </div>

                            <div className="absolute bottom-20 -right-10 bg-white rounded-2xl p-4 shadow-2xl animate-float" style={{ animationDelay: '1.5s' }}>
                                <p className="text-sm text-gray-600 mb-1">Satisfação</p>
                                <p className="text-3xl font-bold text-green-600">98%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
                </div>
            </div>
        </section>
    );
}
