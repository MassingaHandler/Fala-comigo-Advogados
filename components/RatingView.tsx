
import React, { useState } from 'react';
import type { Order, Rating } from '../types';

interface Props {
    order: Order;
    onSubmit: (rating: Rating) => void;
}

export default function RatingView({ order, onSubmit }: Props) {
    const [stars, setStars] = useState(0);
    const [comment, setComment] = useState('');
    const lawyer = order.assignment?.lawyer;

    const handleSubmit = () => {
        if (stars === 0) return;
        
        const rating: Rating = {
            order_id: order.order_id,
            lawyer_id: lawyer?.lawyer_id || 'unknown',
            stars,
            comment,
            createdAt: new Date()
        };
        onSubmit(rating);
    };

    return (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl animate-fade-in text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Sessão Terminada</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Como foi a sua experiência com {lawyer?.nome}?</p>

            <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setStars(star)}
                        className={`text-4xl transition-transform hover:scale-110 focus:outline-none ${
                            star <= stars ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                        }`}
                    >
                        ★
                    </button>
                ))}
            </div>

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Deixe um comentário opcional (ex: Muito atencioso, explicou bem...)"
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 mb-6 focus:ring-2 focus:ring-red-500 outline-none"
                rows={3}
            />

            <button
                onClick={handleSubmit}
                disabled={stars === 0}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
                Enviar Avaliação
            </button>
        </div>
    );
}
