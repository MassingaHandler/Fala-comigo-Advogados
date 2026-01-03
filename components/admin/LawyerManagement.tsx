import React, { useState } from 'react';
import { SearchIcon, FilterIcon } from '../ui/dashboard-icons';
import type { Lawyer } from '../../types';

export default function LawyerManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState<string>('all');

    // Mock data - using existing lawyers from constants
    const lawyers = [
        { id: '1', nome: 'Dra. Ana Silva', especialidade: 'Família', rating: 4.8, casesCompleted: 45, status: 'active', phone: '+258 84 111 1111' },
        { id: '2', nome: 'Dr. João Santos', especialidade: 'Trabalho', rating: 4.9, casesCompleted: 67, status: 'active', phone: '+258 84 222 2222' },
        { id: '3', nome: 'Dra. Maria Costa', especialidade: 'Terra/DUAT', rating: 4.7, casesCompleted: 38, status: 'active', phone: '+258 84 333 3333' },
        { id: '4', nome: 'Dr. Pedro Alves', especialidade: 'Consumo', rating: 4.6, casesCompleted: 29, status: 'inactive', phone: '+258 84 444 4444' },
        { id: '5', nome: 'Dra. Sofia Moreira', especialidade: 'Família', rating: 4.9, casesCompleted: 52, status: 'active', phone: '+258 84 555 5555' },
    ];

    const filteredLawyers = lawyers.filter(lawyer => {
        const matchesSearch = lawyer.nome.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterSpecialty === 'all' || lawyer.especialidade === filterSpecialty;
        return matchesSearch && matchesFilter;
    });

    const specialties = ['Família', 'Trabalho', 'Terra/DUAT', 'Consumo', 'Outros'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gestão de Advogados</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerencie todos os advogados da plataforma</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md">
                    + Adicionar Advogado
                </button>
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
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <FilterIcon className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterSpecialty}
                            onChange={(e) => setFilterSpecialty(e.target.value)}
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

            {/* Lawyers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLawyers.map((lawyer) => (
                    <div key={lawyer.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                    {lawyer.nome.split(' ')[1]?.charAt(0) || lawyer.nome.charAt(0)}
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
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{lawyer.rating}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Casos Concluídos</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{lawyer.casesCompleted}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Telefone</span>
                                <span className="text-sm text-gray-800 dark:text-gray-200">{lawyer.phone}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                                Ver Perfil
                            </button>
                            <button className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                Editar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredLawyers.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
                    <p className="text-gray-500 dark:text-gray-400">Nenhum advogado encontrado</p>
                </div>
            )}
        </div>
    );
}
