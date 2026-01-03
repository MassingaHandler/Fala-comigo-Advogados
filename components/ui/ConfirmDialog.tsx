import React from 'react';
import Modal from './Modal';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    isLoading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'info',
    isLoading = false
}: ConfirmDialogProps) {
    const variantStyles = {
        danger: {
            icon: '⚠️',
            iconBg: 'bg-red-100 dark:bg-red-900/30',
            iconColor: 'text-red-600 dark:text-red-400',
            button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        },
        warning: {
            icon: '⚡',
            iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        },
        info: {
            icon: 'ℹ️',
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400',
            button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        },
        success: {
            icon: '✓',
            iconBg: 'bg-green-100 dark:bg-green-900/30',
            iconColor: 'text-green-600 dark:text-green-400',
            button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        }
    };

    const style = variantStyles[variant];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
            <div className="text-center">
                {/* Icon */}
                <div className={`mx-auto w-16 h-16 ${style.iconBg} rounded-full flex items-center justify-center mb-4`}>
                    <span className="text-3xl">{style.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {title}
                </h3>

                {/* Message */}
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${style.button}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processando...
                            </span>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
