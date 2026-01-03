import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { MozambiqueFlagIcon } from './ui/icons';
import HeroSection from './landing/HeroSection';
import AboutSection from './landing/AboutSection';
import HowItWorksSection from './landing/HowItWorksSection';
import MiniChatBot from './landing/MiniChatBot';
import StatisticsSection from './landing/StatisticsSection';
import TestimonialsSection from './landing/TestimonialsSection';
import PricingSection from './landing/PricingSection';
import SecuritySection from './landing/SecuritySection';
import FAQSection from './landing/FAQSection';
import Footer from './landing/Footer';
import FloatingCTA from './landing/FloatingCTA';

export default function LandingPage() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Sobre', href: '#sobre' },
        { label: 'Como Funciona', href: '#como-funciona' },
        { label: 'Preços', href: '#precos' },
        { label: 'Testemunhos', href: '#testemunhos' },
        { label: 'FAQ', href: '#faq' }
    ];

    const handleGetStarted = () => {
        navigate('/registro');
    };

    const handleLearnMore = () => {
        document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Navigation */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
                    : 'bg-transparent'
                    }`}
            >
                <div className="container-responsive">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <MozambiqueFlagIcon className="w-10 h-10" />
                            <div>
                                <h1 className={`text-2xl font-bold transition-colors ${isScrolled ? 'text-red-600 dark:text-red-500' : 'text-white'
                                    }`}>
                                    Fala Comigo
                                </h1>
                                <p className={`text-xs transition-colors ${isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-red-100'
                                    }`}>
                                    Advocacia Digital
                                </p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className={`font-medium transition-colors hover:text-red-600 dark:hover:text-red-500 ${isScrolled
                                        ? 'text-gray-700 dark:text-gray-300'
                                        : 'text-white'
                                        }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden lg:flex items-center gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className={`px-6 py-2 font-semibold rounded-lg transition-all ${isScrolled
                                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                Entrar
                            </button>
                            <button
                                onClick={handleGetStarted}
                                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-lg"
                            >
                                Começar Agora
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled
                                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                : 'text-white hover:bg-white/10'
                                }`}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
                        <div className="container-responsive py-4 space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                                <button
                                    onClick={() => {
                                        navigate('/login');
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full py-3 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                >
                                    Entrar
                                </button>
                                <button
                                    onClick={() => {
                                        handleGetStarted();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
                                >
                                    Começar Agora
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Sections */}
            <HeroSection onGetStarted={handleGetStarted} onLearnMore={handleLearnMore} />
            <AboutSection />
            <HowItWorksSection />
            <MiniChatBot />
            <StatisticsSection />
            <TestimonialsSection />
            <PricingSection />
            <SecuritySection />
            <FAQSection />
            <Footer />

            {/* Floating CTA */}
            <FloatingCTA />
        </div>
    );
}
