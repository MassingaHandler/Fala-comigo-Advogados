import React from 'react';
import type { Lawyer } from '../types';
import { StarIcon, UserIcon } from './ui/icons';

interface Props {
    lawyers: Lawyer[];
    loading: boolean;
    onSelectLawyer: (lawyer: Lawyer) => void;
    onSelectAuto: () => void;
    topicName: string;
}

export default function LawyerSelection({ lawyers, loading, onSelectLawyer, onSelectAuto, topicName }: Props) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Buscando advogados disponíveis...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Escolha um Advogado
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Especialidade: <span className="font-semibold text-red-600 dark:text-red-400">{topicName}</span>
                </p>
            </div>

            {/* Opção Auto-Atribuir */}
            <button
                onClick={onSelectAuto}
                className="w-full p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                🎯 Escolher para mim
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Sistema escolhe o melhor advogado disponível
                            </p>
                        </div>
                    </div>
                    <svg className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </button>

            {/* Divisor */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        ou escolha manualmente
                    </span>
                </div>
            </div>

            {/* Lista de Advogados */}
            {lawyers.length === 0 ? (
                <div className="text-center py-8">
                    <UserIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Nenhum advogado disponível para esta especialidade no momento.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        Clique em "Escolher para mim" para continuar.
                    </p>
                </div>
            ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {lawyers.map((lawyer) => (
                        <button
                            key={lawyer.lawyer_id}
                            onClick={() => onSelectLawyer(lawyer)}
                            className="w-full p-5 bg-white dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 transition-all duration-300 group text-left"
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                    {lawyer.nome.charAt(0)}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                                {lawyer.nome}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {lawyer.especialidade}
                                            </p>
                                        </div>

                                        {/* Status Online */}
                                        {lawyer.isOnline && (
                                            <span className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                Online
                                            </span>
                                        )}
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(lawyer.rating || 0)
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-300 dark:text-gray-600'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {lawyer.rating?.toFixed(1) || '0.0'}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            ({lawyer.totalReviews || 0} avaliações)
                                        </span>
                                    </div>

                                    {/* Casos Completados */}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        ✓ {lawyer.casesCompleted || 0} casos completados
                                    </p>
                                </div>

                                {/* Arrow */}
                                <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
