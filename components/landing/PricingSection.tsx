import React from 'react';
import { useNavigate } from 'react-router-dom';
import PricingCard from '../ui/PricingCard';
import { PRICING_PLANS } from '../../constants/landingData';

export default function PricingSection() {
    const navigate = useNavigate();

    const handleSelectPlan = (planId: string) => {
        // Redirect to registration with plan pre-selected
        navigate('/registro', { state: { selectedPlan: planId } });
    };

    return (
        <section id="precos" className="landing-section bg-gray-50 dark:bg-gray-900">
            <div className="container-responsive">
                <div className="text-center mb-16 animate-slide-up">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Planos e <span className="gradient-text">Preços</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Escolha o plano ideal para suas necessidades jurídicas. Sem taxas ocultas, sem surpresas.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
                    {PRICING_PLANS.map((plan, index) => (
                        <div
                            key={plan.id}
                            className="animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <PricingCard
                                name={plan.name}
                                price={plan.price}
                                period={plan.period}
                                description={plan.description}
                                features={plan.features}
                                cta={plan.cta}
                                popular={plan.popular}
                                badge={plan.badge}
                                onSelect={() => handleSelectPlan(plan.id)}
                            />
                        </div>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-md">
                        <div className="text-4xl mb-3">💳</div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Pagamento Seguro
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            M-Pesa, e-Mola e outras carteiras digitais aceitas
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-md">
                        <div className="text-4xl mb-3">🔄</div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Sem Fidelização
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Cancele a qualquer momento, sem multas ou penalidades
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-md">
                        <div className="text-4xl mb-3">🎁</div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Primeira Consulta
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            10% de desconto para novos clientes
                        </p>
                    </div>
                </div>

                {/* Money Back Guarantee */}
                <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white text-center max-w-4xl mx-auto animate-scale-in">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-3xl font-bold mb-4">Garantia de Satisfação</h3>
                    <p className="text-lg text-green-50">
                        Se não ficar satisfeito com o atendimento, devolvemos 100% do seu dinheiro.
                        Sem perguntas, sem complicações.
                    </p>
                </div>
            </div>
        </section>
    );
}
