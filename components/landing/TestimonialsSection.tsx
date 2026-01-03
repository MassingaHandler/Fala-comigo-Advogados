import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import TestimonialCard from '../ui/TestimonialCard';
import { TESTIMONIALS } from '../../constants/landingData';

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const testimonialsPerPage = 3;

    const nextTestimonials = () => {
        setCurrentIndex((prev) =>
            prev + testimonialsPerPage >= TESTIMONIALS.length ? 0 : prev + testimonialsPerPage
        );
    };

    const prevTestimonials = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? Math.max(0, TESTIMONIALS.length - testimonialsPerPage) : Math.max(0, prev - testimonialsPerPage)
        );
    };

    const visibleTestimonials = TESTIMONIALS.slice(
        currentIndex,
        currentIndex + testimonialsPerPage
    );

    return (
        <section id="testemunhos" className="landing-section bg-white dark:bg-gray-800">
            <div className="container-responsive">
                <div className="text-center mb-16 animate-slide-up">
                    <div className="inline-block mb-4">
                        <Quote className="w-16 h-16 text-red-600 dark:text-red-500 mx-auto" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        O que Dizem Nossos <span className="gradient-text">Clientes</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Milhares de moçambicanos já resolveram seus problemas jurídicos conosco
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="relative">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        {visibleTestimonials.map((testimonial, index) => (
                            <div
                                key={testimonial.id}
                                className="animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <TestimonialCard
                                    name={testimonial.name}
                                    location={testimonial.location}
                                    rating={testimonial.rating}
                                    text={testimonial.text}
                                    avatar={testimonial.avatar}
                                    date={testimonial.date}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center items-center gap-4">
                        <button
                            onClick={prevTestimonials}
                            className="w-12 h-12 bg-gray-200 dark:bg-gray-700 hover:bg-red-600 dark:hover:bg-red-600 text-gray-700 dark:text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={currentIndex === 0}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        {/* Dots Indicator */}
                        <div className="flex gap-2">
                            {Array.from({ length: Math.ceil(TESTIMONIALS.length / testimonialsPerPage) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index * testimonialsPerPage)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${Math.floor(currentIndex / testimonialsPerPage) === index
                                            ? 'bg-red-600 w-8'
                                            : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonials}
                            className="w-12 h-12 bg-gray-200 dark:bg-gray-700 hover:bg-red-600 dark:hover:bg-red-600 text-gray-700 dark:text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={currentIndex + testimonialsPerPage >= TESTIMONIALS.length}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Overall Rating */}
                <div className="mt-16 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-8 md:p-12 text-center animate-scale-in">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="text-6xl font-bold text-green-600 dark:text-green-500">4.9</div>
                        <div className="text-left">
                            <div className="flex gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-2xl">★</span>
                                ))}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">Baseado em {TESTIMONIALS.length}+ avaliações</p>
                        </div>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                        98% dos nossos clientes recomendam o Fala Comigo para amigos e familiares
                    </p>
                </div>
            </div>
        </section>
    );
}
