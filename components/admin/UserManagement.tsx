import React, { useState, useEffect } from 'react';
import { SearchIcon, FilterIcon } from '../ui/dashboard-icons';
import LoadingSpinner from '../ui/LoadingSpinner';
import UserEditModal from './modals/UserEditModal';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    totalCases: number;
    joinedDate: string;
}

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('fala_comigo_token');
            if (!token) {
                setError('Token não encontrado. Por favor, faça login novamente.');
                setIsLoading(false);
                return;
            }

            const url = new URL('http://localhost:8000/api/v1/admin/users');
            url.searchParams.append('page', pagination.currentPage.toString());
            if (searchTerm) url.searchParams.append('search', searchTerm);
            if (filterStatus !== 'all') url.searchParams.append('status_filter', filterStatus);

            const response = await fetch(url.toString(), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    setUsers(result.data);
                    setPagination(prev => ({
                        ...prev,
                        totalPages: result.pagination.totalPages,
                        totalItems: result.pagination.totalItems
                    }));
                }
            } else {
                const result = await response.json().catch(() => ({}));
                setError(result.detail || `Erro ao carregar usuários (${response.status})`);
            }
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            setError('Erro de conexão com o servidor. Verifique se o backend está rodando.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [pagination.currentPage, searchTerm, filterStatus]);

    const handleAddUser = () => {
        setSelectedUser(null);
        setIsEditModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleToggleStatus = async (user: User) => {
        if (!confirm(`Tem certeza que deseja ${user.status === 'active' ? 'desativar' : 'ativar'} este usuário?`)) return;

        try {
            const token = localStorage.getItem('fala_comigo_token');
            const response = await fetch(`http://localhost:8000/api/v1/admin/users/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchUsers();
            } else {
                alert('Erro ao alterar status do usuário');
            }
        } catch (error) {
            console.error('Erro ao alterar status:', error);
        }
    };

    const handleSaveUser = async (userData: any) => {
        // A lógica de API será movida para o Modal ou tratada aqui
        fetchUsers();
    };

    if (isLoading && users.length === 0) {
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
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gestão de Usuários</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie todos os usuários da plataforma</p>
                </div>
                <button
                    onClick={handleAddUser}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                >
                    + Adicionar Usuário
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email..."
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
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value as any);
                                setPagination(p => ({ ...p, currentPage: 1 }));
                            }}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="active">Ativos</option>
                            <option value="inactive">Inativos</option>
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
                    <button
                        onClick={fetchUsers}
                        className="mt-2 text-sm underline hover:no-underline"
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {/* Users Table */}
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
                        <LoadingSpinner />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuário</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contato</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Casos</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data de Registro</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{user.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-gray-200">{user.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {user.status === 'active' ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                        {user.totalCases}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('pt-PT') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Ver</button>
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(user)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            {user.status === 'active' ? 'Desativar' : 'Ativar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">Nenhum usuário encontrado</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando {users.length} de {pagination.totalItems} usuários
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

            {/* Modal */}
            <UserEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={selectedUser}
                onSave={handleSaveUser}
            />
        </div>
    );
}
