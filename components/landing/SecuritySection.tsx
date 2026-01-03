import React from 'react';
import { Shield, Lock, FileCheck, Award } from 'lucide-react';
import { TRUST_BADGES } from '../../constants/landingData';

export default function SecuritySection() {
    return (
        <section id="seguranca" className="landing-section bg-white dark:bg-gray-800">
            <div className="container-responsive">
                <div className="text-center mb-16 animate-slide-up">
                    <div className="inline-block mb-4">
                        <Shield className="w-16 h-16 text-red-600 dark:text-red-500 mx-auto" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Segurança e <span className="gradient-text">Confiança</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Seus dados e informações jurídicas estão protegidos com os mais altos padrões de segurança
                    </p>
                </div>

                {/* Security Features */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <div className="text-center animate-slide-up">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:rotate-6 transition-transform">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                            Criptografia de Ponta a Ponta
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Todas as comunicações são criptografadas com SSL/TLS 256-bit
                        </p>
                    </div>

                    <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:rotate-6 transition-transform">
                            <FileCheck className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                            Confidencialidade Total
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Sigilo profissional garantido conforme código de ética da OAM
                        </p>
                    </div>

                    <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:rotate-6 transition-transform">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                            Conformidade Legal
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            100% em conformidade com a legislação moçambicana
                        </p>
                    </div>

                    <div className="text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:rotate-6 transition-transform">
                            <Award className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                            Advogados Verificados
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Todos registados e validados pela Ordem dos Advogados
                        </p>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 md:p-12 animate-scale-in">
                    <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
                        Certificações e Garantias
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TRUST_BADGES.map((badge, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="text-4xl mb-3">🏆</div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    {badge.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {badge.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legal Links */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Leia nossos documentos legais para mais informações
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="text-red-600 dark:text-red-500 hover:underline font-semibold">
                            Termos de Serviço
                        </button>
                        <span className="text-gray-400">•</span>
                        <button className="text-red-600 dark:text-red-500 hover:underline font-semibold">
                            Política de Privacidade
                        </button>
                        <span className="text-gray-400">•</span>
                        <button className="text-red-600 dark:text-red-500 hover:underline font-semibold">
                            Código de Ética
                        </button>
                        <span className="text-gray-400">•</span>
                        <button className="text-red-600 dark:text-red-500 hover:underline font-semibold">
                            LGPD/GDPR
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
