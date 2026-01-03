import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
    name: string;
    location: string;
    rating: number;
    text: string;
    avatar: string;
    date?: string;
}

export default function TestimonialCard({
    name,
    location,
    rating,
    text,
    avatar
}: TestimonialCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {avatar}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{location}</p>
                </div>
            </div>

            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-5 h-5 ${i < rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'
                            }`}
                    />
                ))}
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                "{text}"
            </p>
        </div>
    );
}
