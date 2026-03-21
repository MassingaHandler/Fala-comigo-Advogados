import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

interface LawyerApplication {
    id: string;
    nome: string;
    especialidade: string;
    oamNumber: string;
    oamRegistrationYear: number;
    phone: string;
    email: string;
    city: string;
    province: string;
    verificationStatus: string;
    verificationNotes?: string;
    submittedAt: string;
}

export default function LawyerApplications() {
    const [applications, setApplications] = useState<LawyerApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState('pending_verification');
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

    // Modal state
    const [selected, setSelected] = useState<LawyerApplication | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const fetchApplications = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('fala_comigo_token');
            if (!token) return;

            const url = new URL('http://localhost:8000/api/v1/admin/lawyers/applications');
            url.searchParams.append('page', pagination.currentPage.toString());
            url.searchParams.append('status_filter', statusFilter);

            const response = await fetch(url.toString(), {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    setApplications(result.data);
                    setPagination(prev => ({
                        ...prev,
                        totalPages: result.pagination.totalPages,
                        totalItems: result.pagination.totalItems
                    }));
                }
            } else {
                const r = await response.json().catch(() => ({}));
                setError(r.detail || 'Erro ao carregar candidaturas');
            }
        } catch {
            setError('Erro de conexão com o servidor');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [pagination.currentPage, statusFilter]);

    const openDecision = (app: LawyerApplication, act: 'approve' | 'reject') => {
        setSelected(app);
        setAction(act);
        setNotes('');
        setIsModalOpen(true);
    };

    const handleDecision = async () => {
        if (!selected || !action) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('fala_comigo_token');
            const response = await fetch(`http://localhost:8000/api/v1/admin/lawyers/${selected.id}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action, notes })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setIsModalOpen(false);
                setSuccessMsg(action === 'approve' ? '✅ Candidatura aprovada com sucesso!' : '❌ Candidatura rejeitada.');
                setTimeout(() => setSuccessMsg(null), 4000);
                fetchApplications();
            } else {
                alert(result.detail || 'Erro ao processar decisão');
            }
        } catch {
            alert('Erro de conexão');
        } finally {
            setIsSubmitting(false);
        }
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'pending_verification':
                return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full font-medium">⏳ Pendente</span>;
            case 'verified':
                return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full font-medium">✅ Aprovado</span>;
            case 'rejected':
                return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full font-medium">❌ Rejeitado</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Candidaturas de Advogados</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avalie e aprove ou rejeite as candidaturas de advogados</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm rounded-full font-medium">
                    {pagination.totalItems} candidatura(s)
                </span>
            </div>

            {/* Status Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex gap-2 flex-wrap">
                    {[
                        { value: 'pending_verification', label: '⏳ Pendentes' },
                        { value: 'verified', label: '✅ Aprovados' },
                        { value: 'rejected', label: '❌ Rejeitados' },
                        { value: 'all', label: '📋 Todos' },
                    ].map(s => (
                        <button
                            key={s.value}
                            onClick={() => { setStatusFilter(s.value); setPagination(p => ({ ...p, currentPage: 1 })); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === s.value
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {successMsg && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-xl text-green-700 dark:text-green-400 font-medium">
                    {successMsg}
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl text-red-700 dark:text-red-400">
                    {error}
                    <button onClick={fetchApplications} className="ml-2 underline text-sm">Tentar novamente</button>
                </div>
            )}

            {/* Applications List */}
            <div className="relative min-h-[200px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <LoadingSpinner />
                    </div>
                ) : applications.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
                        <p className="text-4xl mb-4">📭</p>
                        <p className="text-gray-500 dark:text-gray-400">Nenhuma candidatura encontrada</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((app) => (
                            <div key={app.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                            {app.nome?.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{app.nome}</h3>
                                                {statusBadge(app.verificationStatus)}
                                            </div>
                                            <p className="text-indigo-600 dark:text-indigo-400 font-medium mt-1">{app.especialidade}</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Nº OAM</p>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{app.oamNumber}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Ano Reg. OAM</p>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{app.oamRegistrationYear}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Telefone</p>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{app.phone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Localização</p>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{app.city}, {app.province}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{app.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Submetido em</p>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('pt-PT') : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            {app.verificationNotes && (
                                                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notas de avaliação:</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{app.verificationNotes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions - only for pending */}
                                    {app.verificationStatus === 'pending_verification' && (
                                        <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
                                            <button
                                                onClick={() => openDecision(app, 'approve')}
                                                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
                                            >
                                                ✅ Aprovar
                                            </button>
                                            <button
                                                onClick={() => openDecision(app, 'reject')}
                                                className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                                            >
                                                ❌ Rejeitar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mostrando {applications.length} de {pagination.totalItems}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))}
                            disabled={pagination.currentPage === 1}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Anterior
                        </button>
                        <span className="flex items-center px-4 font-medium text-gray-700 dark:text-gray-300">
                            {pagination.currentPage} / {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(p.totalPages, p.currentPage + 1) }))}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Próximo
                        </button>
                    </div>
                </div>
            )}

            {/* Decision Modal */}
            {isModalOpen && selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                            {action === 'approve' ? '✅ Aprovar Candidatura' : '❌ Rejeitar Candidatura'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Advogado: <strong>{selected.nome}</strong>
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {action === 'approve' ? 'Notas (opcional)' : 'Motivo da rejeição *'}
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                placeholder={action === 'approve'
                                    ? 'Adicione notas sobre a aprovação...'
                                    : 'Explique o motivo da rejeição...'
                                }
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDecision}
                                disabled={isSubmitting || (action === 'reject' && !notes.trim())}
                                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processando...
                                    </span>
                                ) : action === 'approve' ? 'Confirmar Aprovação' : 'Confirmar Rejeição'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
