import React from 'react';

interface Props {
    icon?: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: Props) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {icon && (
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6">{description}</p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
