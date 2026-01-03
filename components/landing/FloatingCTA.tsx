import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingCTA() {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {/* Main CTA Button */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                {/* Scroll to Top */}
                {isVisible && (
                    <button
                        onClick={scrollToTop}
                        className="w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 animate-slide-up"
                    >
                        <ArrowUp className="w-6 h-6" />
                    </button>
                )}

                {/* Main CTA */}
                <button
                    onClick={() => navigate('/registro')}
                    className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 animate-pulse-glow"
                >
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-bold whitespace-nowrap">Falar com Advogado Agora</span>
                    <span className="text-2xl">⚖️</span>
                </button>
            </div>
        </>
    );
}
