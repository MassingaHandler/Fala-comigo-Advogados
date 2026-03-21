import React, { useState, useEffect } from 'react';
import { SearchIcon, FilterIcon } from '../ui/dashboard-icons';
import LoadingSpinner from '../ui/LoadingSpinner';
import LawyerProfileModal from './modals/LawyerProfileModal';
import LawyerEditModal from './modals/LawyerEditModal';

interface AdminLawyer {
    id: string;
    nome: string;
    especialidade: string;
    rating: number;
    casesCompleted: number;
    status: 'active' | 'inactive';
    phone: string;
    email?: string;
    oamNumber?: string;
    verificationStatus?: string;
    joinedDate?: string;
}

export default function LawyerManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
    const [lawyers, setLawyers] = useState<AdminLawyer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedLawyer, setSelectedLawyer] = useState<AdminLawyer | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });

    const fetchLawyers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('fala_comigo_token');
            if (!token) return;

            const url = new URL('http://localhost:8000/api/v1/admin/lawyers');
            url.searchParams.append('page', pagination.currentPage.toString());
            if (searchTerm) url.searchParams.append('search', searchTerm);
            if (filterSpecialty !== 'all') url.searchParams.append('specialty_filter', filterSpecialty);

            const response = await fetch(url.toString(), {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    setLawyers(result.data);
                    setPagination(prev => ({
                        ...prev,
                        totalPages: result.pagination.totalPages,
                        totalItems: result.pagination.totalItems
                    }));
                }
            } else {
                const r = await response.json().catch(() => ({}));
                setError(r.detail || 'Erro ao carregar advogados');
            }
        } catch (err) {
            setError('Erro de conexão com o servidor');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLawyers();
    }, [pagination.currentPage, searchTerm, filterSpecialty]);

    const handleViewProfile = async (lawyer: AdminLawyer) => {
        try {
            const token = localStorage.getItem('fala_comigo_token');
            const response = await fetch(`http://localhost:8000/api/v1/admin/lawyers/${lawyer.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const result = await response.json();
                setSelectedLawyer(result.data);
            } else {
                setSelectedLawyer(lawyer);
            }
        } catch {
            setSelectedLawyer(lawyer);
        }
        setIsProfileModalOpen(true);
    };

    const handleEdit = (lawyer: AdminLawyer) => {
        setSelectedLawyer(lawyer);
        setIsEditModalOpen(true);
    };

    const handleToggleStatus = async (lawyer: AdminLawyer) => {
        const action = lawyer.status === 'active' ? 'suspender' : 'reativar';
        if (!confirm(`Tem certeza que deseja ${action} o advogado ${lawyer.nome}?`)) return;

        try {
            const token = localStorage.getItem('fala_comigo_token');
            const response = await fetch(`http://localhost:8000/api/v1/admin/lawyers/${lawyer.id}/status`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchLawyers();
            } else {
                alert('Erro ao alterar status do advogado');
            }
        } catch {
            alert('Erro de conexão');
        }
    };

    const specialties = ['Família', 'Trabalho', 'Terra/DUAT', 'Consumo', 'Outros'];

    if (isLoading && lawyers.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gestão de Advogados</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie todos os advogados da plataforma</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm rounded-full font-medium">
                        {pagination.totalItems} advogado(s)
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPagination(p => ({ ...p, currentPage: 1 }));
                            }}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FilterIcon className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterSpecialty}
                            onChange={(e) => {
                                setFilterSpecialty(e.target.value);
                                setPagination(p => ({ ...p, currentPage: 1 }));
                            }}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Todas as Especialidades</option>
                            {specialties.map(spec => (
                                <option key={spec} value={spec}>{spec}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl text-red-700 dark:text-red-400">
                    <p className="flex items-center gap-2 font-medium">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        {error}
                    </p>
                    <button onClick={fetchLawyers} className="mt-2 text-sm underline hover:no-underline">Tentar novamente</button>
                </div>
            )}

            {/* Lawyers Grid */}
            <div className="relative min-h-[200px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10 rounded-xl">
                        <LoadingSpinner />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lawyers.map((lawyer) => (
                        <div key={lawyer.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                        {lawyer.nome?.charAt(0) || 'A'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{lawyer.nome}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{lawyer.especialidade}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${lawyer.status === 'active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                    {lawyer.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Avaliação</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-500">★</span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">{lawyer.rating || 0}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Casos Concluídos</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{lawyer.casesCompleted || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Telefone</span>
                                    <span className="text-sm text-gray-800 dark:text-gray-200">{lawyer.phone}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => handleViewProfile(lawyer)}
                                    className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Ver Perfil
                                </button>
                                <button
                                    onClick={() => handleEdit(lawyer)}
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleToggleStatus(lawyer)}
                                    className={`w-full px-3 py-1.5 text-xs rounded-lg transition-colors ${lawyer.status === 'active'
                                        ? 'border border-red-300 text-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20'
                                        : 'border border-green-300 text-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900/20'
                                        }`}
                                >
                                    {lawyer.status === 'active' ? '🔴 Suspender' : '🟢 Reativar'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {lawyers.length === 0 && !isLoading && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
                        <p className="text-gray-500 dark:text-gray-400">Nenhum advogado encontrado</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando {lawyers.length} de {pagination.totalItems} advogados
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))}
                        disabled={pagination.currentPage === 1 || isLoading}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="flex items-center px-4 font-medium text-gray-700 dark:text-gray-300">
                        Página {pagination.currentPage} de {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(p.totalPages, p.currentPage + 1) }))}
                        disabled={pagination.currentPage === pagination.totalPages || isLoading}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        Próximo
                    </button>
                </div>
            </div>

            {/* Modals */}
            <LawyerProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                lawyer={selectedLawyer}
                onToggleStatus={() => {
                    setIsProfileModalOpen(false);
                    if (selectedLawyer) handleToggleStatus(selectedLawyer);
                }}
                onEdit={() => {
                    setIsProfileModalOpen(false);
                    setIsEditModalOpen(true);
                }}
            />
            <LawyerEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                lawyer={selectedLawyer}
                onSave={() => {
                    setIsEditModalOpen(false);
                    fetchLawyers();
                }}
            />
        </div>
    );
}
