import { useState, useEffect } from 'react';
import { SearchIcon, FilterIcon } from '../ui/dashboard-icons';
import LoadingSpinner from '../ui/LoadingSpinner';
import LawyerProfileModal from './modals/LawyerProfileModal';
import LawyerEditModal from './modals/LawyerEditModal';
import CreateLawyerModal from './CreateLawyerModal';

interface AdminLawyer {
    id: string;
    nome: string;
    especialidade: string;
    rating: number;
    casesCompleted: number;
    status: 'active' | 'inactive';
    phone: string;
    email?: string;
    verificationStatus?: string;
    joinedDate?: string;
}

const SPECIALTIES = [
    'Direito Penal', 'Direito Laboral', 'Direito de Família',
    'Direito Imobiliário/DUAT', 'Direito do Consumidor', 'Direito Empresarial',
    'Direito Tributário', 'Direito Administrativo', 'Direito Civil',
];

export default function LawyerManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('all');
    const [lawyers, setLawyers] = useState<AdminLawyer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [selectedLawyer, setSelectedLawyer] = useState<AdminLawyer | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

    const fetchLawyers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('fala_comigo_token');
            if (!token) return;

            const url = new URL('http://localhost:8000/api/v1/admin/lawyers');
            url.searchParams.append('page', pagination.currentPage.toString());
            url.searchParams.append('verification_filter', 'verified');
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
        } catch {
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
                const newStatus = lawyer.status === 'active' ? 'suspenso' : 'reativado';
                setSuccessMsg(`Advogado ${lawyer.nome} ${newStatus} com sucesso.`);
                setTimeout(() => setSuccessMsg(null), 3000);
                fetchLawyers();
            } else {
                alert('Erro ao alterar status do advogado');
            }
        } catch {
            alert('Erro de conexão');
        }
    };

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">Gestão de Advogados</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Advogados verificados e ativos na plataforma</p>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm rounded-full font-medium">
                        {pagination.totalItems} advogado(s)
                    </span>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-sm"
                    >
                        + Novo Advogado
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPagination(p => ({ ...p, currentPage: 1 })); }}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FilterIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <select
                            value={filterSpecialty}
                            onChange={(e) => { setFilterSpecialty(e.target.value); setPagination(p => ({ ...p, currentPage: 1 })); }}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            <option value="all">Todas as Especialidades</option>
                            {SPECIALTIES.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Messages */}
            {successMsg && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-3 rounded-xl text-green-700 dark:text-green-400 text-sm font-medium">
                    ✅ {successMsg}
                </div>
            )}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 rounded-xl text-red-700 dark:text-red-400">
                    <p className="font-medium">{error}</p>
                    <button onClick={fetchLawyers} className="mt-1 text-sm underline">Tentar novamente</button>
                </div>
            )}

            {/* Lawyers Grid */}
            <div className="relative min-h-[200px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 flex items-center justify-center z-10 rounded-xl">
                        <LoadingSpinner />
                    </div>
                )}

                {lawyers.length === 0 && !isLoading ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                        <p className="text-4xl mb-3">👨‍⚖️</p>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Nenhum advogado encontrado</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Adicione um advogado manualmente ou aprove candidaturas pendentes.</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
                        >
                            + Adicionar Advogado
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {lawyers.map((lawyer) => (
                            <div key={lawyer.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all">
                                {/* Card Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                            {lawyer.nome?.charAt(0)?.toUpperCase() || 'A'}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">{lawyer.nome}</h3>
                                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate">{lawyer.especialidade || '—'}</p>
                                        </div>
                                    </div>
                                    <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full ${lawyer.status === 'active'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                        {lawyer.status === 'active' ? '● Ativo' : '● Inativo'}
                                    </span>
                                </div>

                                {/* Card Info */}
                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Avaliação</span>
                                        <span className="font-medium text-gray-800 dark:text-gray-200">⭐ {(lawyer.rating || 0).toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Casos concluídos</span>
                                        <span className="font-medium text-gray-800 dark:text-gray-200">{lawyer.casesCompleted || 0}</span>
                                    </div>
                                    {lawyer.phone && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">Telefone</span>
                                            <span className="text-gray-700 dark:text-gray-300">{lawyer.phone}</span>
                                        </div>
                                    )}
                                    {lawyer.email && (
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">Email</span>
                                            <span className="text-gray-700 dark:text-gray-300 text-xs truncate text-right">{lawyer.email}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleViewProfile(lawyer)}
                                        className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors font-medium"
                                    >
                                        Ver Perfil
                                    </button>
                                    <button
                                        onClick={() => { setSelectedLawyer(lawyer); setIsEditModalOpen(true); }}
                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Editar
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleToggleStatus(lawyer)}
                                    className={`mt-2 w-full px-3 py-1.5 text-xs rounded-lg border transition-colors ${lawyer.status === 'active'
                                        ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20'
                                        : 'border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20'
                                    }`}
                                >
                                    {lawyer.status === 'active' ? '🔴 Suspender Acesso' : '🟢 Reativar Acesso'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mostrando {lawyers.length} de {pagination.totalItems} advogados
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))}
                            disabled={pagination.currentPage === 1 || isLoading}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                        >
                            Anterior
                        </button>
                        <span className="flex items-center px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {pagination.currentPage} / {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(p.totalPages, p.currentPage + 1) }))}
                            disabled={pagination.currentPage === pagination.totalPages || isLoading}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                        >
                            Próximo
                        </button>
                    </div>
                </div>
            )}

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
            <CreateLawyerModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setIsCreateModalOpen(false);
                    fetchLawyers();
                }}
            />
        </div>
    );
}
