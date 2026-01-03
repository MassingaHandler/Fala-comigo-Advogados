import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../../constants/landingData';

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const categories = Array.from(new Set(FAQS.map(faq => faq.category)));

    return (
        <section id="faq" className="landing-section bg-gray-50 dark:bg-gray-900">
            <div className="container-responsive">
                <div className="text-center mb-16 animate-slide-up">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Perguntas <span className="gradient-text">Frequentes</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Tire suas dúvidas sobre o Fala Comigo
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {categories.map((category, catIndex) => (
                        <div key={catIndex} className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                {category}
                            </h3>
                            <div className="space-y-4">
                                {FAQS.filter(faq => faq.category === category).map((faq, index) => {
                                    const globalIndex = FAQS.findIndex(f => f.id === faq.id);
                                    const isOpen = openIndex === globalIndex;

                                    return (
                                        <div
                                            key={faq.id}
                                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-slide-up"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <span className="font-semibold text-lg text-gray-900 dark:text-gray-100 pr-4">
                                                    {faq.question}
                                                </span>
                                                <ChevronDown
                                                    className={`w-6 h-6 text-red-600 dark:text-red-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''
                                                        }`}
                                                />
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'
                                                    }`}
                                            >
                                                <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 text-center bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-lg animate-scale-in">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Ainda tem dúvidas?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Nossa equipe está pronta para ajudá-lo
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105">
                            Falar com Suporte
                        </button>
                        <button className="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                            Ver Mais FAQs
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
