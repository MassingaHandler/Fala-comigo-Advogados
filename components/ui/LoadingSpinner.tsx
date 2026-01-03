import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'white' | 'gray';
    type?: 'spinner' | 'dots' | 'pulse';
}

export default function LoadingSpinner({
    size = 'md',
    color = 'primary',
    type = 'spinner'
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const colorClasses = {
        primary: 'border-indigo-600',
        white: 'border-white',
        gray: 'border-gray-600'
    };

    if (type === 'spinner') {
        return (
            <div className={`${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`} />
        );
    }

    if (type === 'dots') {
        const dotColor = color === 'primary' ? 'bg-indigo-600' : color === 'white' ? 'bg-white' : 'bg-gray-600';
        const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5';

        return (
            <div className="flex items-center gap-2">
                <div className={`${dotSize} ${dotColor} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
                <div className={`${dotSize} ${dotColor} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
                <div className={`${dotSize} ${dotColor} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
            </div>
        );
    }

    // Pulse type
    const pulseColor = color === 'primary' ? 'bg-indigo-600' : color === 'white' ? 'bg-white' : 'bg-gray-600';
    return (
        <div className={`${sizeClasses[size]} ${pulseColor} rounded-full animate-pulse`} />
    );
}

export function SkeletonLoader({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
    );
}
