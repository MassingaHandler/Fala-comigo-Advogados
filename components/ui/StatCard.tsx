import React from 'react';

interface Props {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: { value: number; isPositive: boolean };
    gradient: string;
    delay?: number;
}

export default function StatCard({ title, value, icon, trend, gradient, delay = 0 }: Props) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in`}
            style={{
                background: gradient,
                animationDelay: `${delay}ms`
            }}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-white mb-2">{value}</p>
                    {trend && (
                        <div className="flex items-center gap-1">
                            <span className={`text-xs font-semibold ${trend.isPositive ? 'text-green-200' : 'text-red-200'}`}>
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </span>
                            <span className="text-xs text-white/60">vs mês anterior</span>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {icon}
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        </div>
    );
}
