import React, { useState } from 'react';
import type { Lawyer } from '../types';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, StarIcon, BriefcaseIcon } from './ui/icons';

interface Props {
    lawyer: Lawyer;
    onBack: () => void;
    onUpdateProfile: (updates: Partial<Lawyer>) => void;
}

export default function LawyerProfile({ lawyer, onBack, onUpdateProfile }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nome: lawyer.nome,
        especialidade: lawyer.especialidade,
        phoneNumber: lawyer.phoneNumber || '',
        oamNumber: lawyer.oamNumber || '',
    });

    const handleSave = () => {
        onUpdateProfile(formData);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                        <img
                            src={lawyer.avatarUrl}
                            alt={lawyer.nome}
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{lawyer.nome}</h1>
                        <p className="text-indigo-100 flex items-center gap-2">
                            <BriefcaseIcon className="w-5 h-5" />
                            {lawyer.especialidade}
                        </p>
                        {lawyer.rating && (
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                                    <StarIcon className="w-4 h-4 text-yellow-300" />
                                    <span className="font-semibold">{lawyer.rating}</span>
                                    <span className="text-sm opacity-75">({lawyer.totalReviews} avaliações)</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-6 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all font-semibold"
                    >
                        {isEditing ? 'Cancelar' : 'Editar Perfil'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            Informações Pessoais
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nome Completo
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                ) : (
                                    <p className="text-gray-800 dark:text-gray-200">{lawyer.nome}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Número OAM
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.oamNumber}
                                        onChange={(e) => setFormData({ ...formData, oamNumber: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                ) : (
                                    <p className="text-gray-800 dark:text-gray-200 font-mono">{lawyer.oamNumber || 'Não informado'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Especialidade
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.especialidade}
                                        onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                ) : (
                                    <p className="text-gray-800 dark:text-gray-200">{lawyer.especialidade}</p>
                                )}
                            </div>
                        </div>
                        {isEditing && (
                            <button
                                onClick={handleSave}
                                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                            >
                                Salvar Alterações
                            </button>
                        )}
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            Informações de Contato
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <PhoneIcon className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
                                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                                        {lawyer.phoneNumber || 'Não informado'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            Estatísticas Profissionais
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg">
                                <p className="text-sm text-green-700 dark:text-green-400 font-medium">Casos Atendidos</p>
                                <p className="text-2xl font-bold text-green-800 dark:text-green-300">127</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg">
                                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Avaliação Média</p>
                                <p className="text-2xl font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1">
                                    <StarIcon className="w-5 h-5" />
                                    {lawyer.rating || 'N/A'}
                                </p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg">
                                <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">Taxa de Satisfação</p>
                                <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">98%</p>
                            </div>
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            Disponibilidade
                        </h2>
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`w-3 h-3 rounded-full ${lawyer.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {lawyer.isOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>
                        <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-sm font-medium">
                            Gerenciar Disponibilidade
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
