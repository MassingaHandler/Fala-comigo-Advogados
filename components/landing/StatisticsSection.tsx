import React from 'react';
import AnimatedCounter from '../ui/AnimatedCounter';
import { Users, Briefcase, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { STATISTICS, CASE_TYPES } from '../../constants/landingData';

export default function StatisticsSection() {
    return (
        <section id="estatisticas" className="landing-section bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
            </div>

            <div className="container-responsive relative z-10">
                <div className="text-center mb-16 animate-slide-up">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Números que Falam por Si
                    </h2>
                    <p className="text-xl text-red-50 max-w-3xl mx-auto">
                        Milhares de moçambicanos já confiam no Fala Comigo para suas necessidades jurídicas
                    </p>
                </div>

                {/* Main Statistics */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 animate-slide-up">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8" />
                        </div>
                        <div className="text-5xl font-bold mb-2">
                            <AnimatedCounter end={STATISTICS.casesResolved} suffix="+" />
                        </div>
                        <p className="text-red-100 text-lg">Casos Resolvidos</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8" />
                        </div>
                        <div className="text-5xl font-bold mb-2">
                            <AnimatedCounter end={STATISTICS.registeredLawyers} />
                        </div>
                        <p className="text-red-100 text-lg">Advogados Registados</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div className="text-5xl font-bold mb-2">
                            <AnimatedCounter end={STATISTICS.activeLawyers} />
                        </div>
                        <p className="text-red-100 text-lg">Advogados Ativos Agora</p>
                        <div className="mt-2 flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm text-red-100">Online</span>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8" />
                        </div>
                        <div className="text-5xl font-bold mb-2">
                            <AnimatedCounter end={8} suffix=" min" />
                        </div>
                        <p className="text-red-100 text-lg">Tempo Médio de Resposta</p>
                    </div>
                </div>

                {/* Case Types Distribution */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 animate-scale-in">
                    <div className="flex items-center gap-3 mb-8">
                        <BarChart3 className="w-8 h-8" />
                        <h3 className="text-3xl font-bold">Distribuição de Casos por Tipo</h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {CASE_TYPES.map((caseType, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-lg">{caseType.name}</h4>
                                    <span className="text-2xl font-bold">{caseType.percentage}%</span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-3 mb-2 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${caseType.percentage}%`,
                                            backgroundColor: caseType.color
                                        }}
                                    ></div>
                                </div>
                                <p className="text-sm text-red-100">
                                    <AnimatedCounter end={caseType.count} /> casos resolvidos
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                    <div className="text-center">
                        <div className="text-4xl font-bold mb-2">
                            <AnimatedCounter end={STATISTICS.satisfactionRate} suffix="%" />
                        </div>
                        <p className="text-red-100">Taxa de Satisfação</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold mb-2">
                            <AnimatedCounter end={STATISTICS.citiesCovered} suffix=" cidades" />
                        </div>
                        <p className="text-red-100">Cobertura Nacional</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold mb-2">24/7</div>
                        <p className="text-red-100">Disponibilidade</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
