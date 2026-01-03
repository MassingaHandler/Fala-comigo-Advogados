import React from 'react';
import { Check } from 'lucide-react';

interface PricingCardProps {
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    cta: string;
    popular?: boolean;
    badge?: string;
    onSelect: () => void;
}

export default function PricingCard({
    name,
    price,
    period,
    description,
    features,
    cta,
    popular = false,
    badge,
    onSelect
}: PricingCardProps) {
    return (
        <div
            className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col ${popular ? 'ring-4 ring-red-500 scale-105' : 'hover:shadow-xl'
                }`}
        >
            {badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                        {badge}
                    </span>
                </div>
            )}

            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-red-600 dark:text-red-500">
                        {price.toLocaleString('pt-MZ')}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-lg">MZN</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{period}</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={onSelect}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${popular
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
            >
                {cta}
            </button>
        </div>
    );
}
