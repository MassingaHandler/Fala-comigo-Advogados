import { useState, useMemo } from 'react';
import type { Lawyer } from '../types';

interface Props {
    lawyers: Lawyer[];
    loading: boolean;
    onSelectLawyer: (lawyer: Lawyer) => void;
    onSelectAuto: () => void;
    topicName: string;
}

const SearchIcon = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const StarFilled = () => (
    <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

export default function LawyerSelection({ lawyers, loading, onSelectLawyer, onSelectAuto, topicName }: Props) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search.trim()) return lawyers;
        const q = search.toLowerCase();
        return lawyers.filter(l =>
            l.nome.toLowerCase().includes(q) ||
            l.especialidade?.toLowerCase().includes(q) ||
            (l as any).city?.toLowerCase().includes(q)
        );
    }, [lawyers, search]);

    // Classificar: os que têm o topic como especialidade ficam no topo
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const aMatch = (a.especialidade || '').toLowerCase().includes(topicName.toLowerCase()) ||
                ((a as any).specializations || []).some((s: string) => s.toLowerCase().includes(topicName.toLowerCase()));
            const bMatch = (b.especialidade || '').toLowerCase().includes(topicName.toLowerCase()) ||
                ((b as any).specializations || []).some((s: string) => s.toLowerCase().includes(topicName.toLowerCase()));
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            if ((a as any).isOnline && !(b as any).isOnline) return -1;
            if (!(a as any).isOnline && (b as any).isOnline) return 1;
            return (b.rating || 0) - (a.rating || 0);
        });
    }, [filtered, topicName]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">A carregar advogados disponíveis...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Escolha um Advogado</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Área: <span className="font-semibold text-red-600 dark:text-red-400">{topicName}</span>
                </p>
            </div>

            {/* Auto-assign option */}
            <button
                onClick={onSelectAuto}
                className="w-full p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="text-left flex-1">
                        <p className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            Atribuição Automática
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            O sistema escolhe o melhor advogado disponível para a sua área
                        </p>
                    </div>
                    <svg className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">ou escolha manualmente</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
            </div>

            {/* Search */}
            {lawyers.length > 0 && (
                <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Pesquisar por nome, especialidade ou cidade..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
            )}

            {/* Lawyers list */}
            {lawyers.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-3xl mb-3">👨‍⚖️</p>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Nenhum advogado disponível</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Use a atribuição automática para continuar.
                    </p>
                </div>
            ) : sorted.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum resultado para "{search}"</p>
                    <button onClick={() => setSearch('')} className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline">
                        Limpar pesquisa
                    </button>
                </div>
            ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {sorted.map((lawyer) => {
                        const isRecommended =
                            (lawyer.especialidade || '').toLowerCase().includes(topicName.toLowerCase()) ||
                            ((lawyer as any).specializations || []).some((s: string) =>
                                s.toLowerCase().includes(topicName.toLowerCase())
                            );
                        const specs: string[] = (lawyer as any).specializations || (lawyer.especialidade ? [lawyer.especialidade] : []);
                        const city: string = (lawyer as any).city || '';
                        const province: string = (lawyer as any).province || '';
                        const isOnline: boolean = (lawyer as any).isOnline || false;

                        return (
                            <button
                                key={lawyer.lawyer_id}
                                onClick={() => onSelectLawyer(lawyer)}
                                className="w-full p-4 bg-white dark:bg-gray-700 rounded-xl border-2 border-gray-100 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 hover:shadow-md transition-all text-left group"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                                            {lawyer.nome.charAt(0).toUpperCase()}
                                        </div>
                                        {isOnline && (
                                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-700 rounded-full" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate">
                                                        {lawyer.nome}
                                                    </span>
                                                    {isRecommended && (
                                                        <span className="flex-shrink-0 text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold">
                                                            ✓ Recomendado
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5 truncate">
                                                    {lawyer.especialidade}
                                                </p>
                                            </div>
                                            {/* Rating */}
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <StarFilled />
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                    {(lawyer.rating || 0).toFixed(1)}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    ({lawyer.totalReviews || 0})
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stats row */}
                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                            <span>✓ {lawyer.casesCompleted || 0} casos</span>
                                            {city && <span>📍 {city}{province ? `, ${province}` : ''}</span>}
                                            {isOnline
                                                ? <span className="text-green-600 dark:text-green-400 font-medium">● Online</span>
                                                : <span className="text-gray-400">● Offline</span>
                                            }
                                        </div>

                                        {/* Specializations tags */}
                                        {specs.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {specs.slice(0, 3).map((s, i) => (
                                                    <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${
                                                        s.toLowerCase().includes(topicName.toLowerCase())
                                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-medium'
                                                            : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                                    }`}>
                                                        {s}
                                                    </span>
                                                ))}
                                                {specs.length > 3 && (
                                                    <span className="text-xs text-gray-400">+{specs.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Arrow */}
                                    <svg className="w-5 h-5 text-gray-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Count */}
            {lawyers.length > 0 && (
                <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                    {sorted.length} de {lawyers.length} advogado(s) disponíve{lawyers.length === 1 ? 'l' : 'is'}
                </p>
            )}
        </div>
    );
}
