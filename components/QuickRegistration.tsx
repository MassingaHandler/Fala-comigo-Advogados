import React, { useState } from 'react';
import type { RegistrationData } from '../types';
import { validateEmail, validatePhone, validateFullName } from '../lib/validators';
import { ChevronLeftIcon, UserIcon, MailIcon, PhoneIcon, LockIcon } from './ui/icons';
import { MozambiqueFlagIcon } from './ui/icons';

interface Props {
    onComplete: (data: RegistrationData) => void;
    onBack: () => void;
}

export default function QuickRegistration({ onComplete, onBack }: Props) {
    const [data, setData] = useState<RegistrationData>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const updateData = (field: keyof RegistrationData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!data.fullName || !validateFullName(data.fullName)) {
            newErrors.fullName = 'Nome completo inválido (mínimo 2 palavras)';
        }

        if (!data.email || !validateEmail(data.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!data.phoneNumber || !validatePhone(data.phoneNumber)) {
            newErrors.phoneNumber = 'Telefone inválido (formato: +258 84 123 4567)';
        }

        if (!password || password.length < 6) {
            newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Chamar API do backend para registrar usuário
            const response = await fetch('http://localhost:8000/api/v1/auth/register/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: data.fullName,
                    birthDate: '1990-01-01', // Data padrão, pode ser atualizada depois
                    nationality: 'Moçambicana',
                    documentType: 'bi',
                    documentNumber: 'TEMP-' + Date.now(), // Temporário
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    password: password,
                    city: 'Maputo',
                    country: 'Moçambique'
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || 'Erro ao criar conta');
            }

            // Salvar token no localStorage
            localStorage.setItem('fala_comigo_token', result.token);
            localStorage.setItem('fala_comigo_user', JSON.stringify({
                id: result.userId,
                fullName: data.fullName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                isQuickRegistration: true
            }));

            // Completar registro
            onComplete({
                ...data,
                userId: result.userId,
                isQuickRegistration: true
            });

        } catch (error: any) {
            console.error('Erro ao registrar:', error);
            setErrors({ submit: error.message || 'Erro ao criar conta. Tente novamente.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <MozambiqueFlagIcon className="w-12 h-12" />
                        <div>
                            <h1 className="text-4xl font-bold text-red-600 dark:text-red-500">Fala Comigo</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Advocacia Digital Integrada</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-fade-in">
                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors mb-6"
                    >
                        <ChevronLeftIcon className="w-5 h-5 mr-1" />
                        Voltar
                    </button>

                    <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-200">
                        Criar Conta Rápida
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">
                        Preencha os dados abaixo para criar sua conta
                    </p>

                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome Completo *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={data.fullName || ''}
                                    onChange={(e) => updateData('fullName', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all`}
                                    placeholder="João Silva Santos"
                                />
                            </div>
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MailIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={data.email || ''}
                                    onChange={(e) => updateData('email', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all`}
                                    placeholder="seu@email.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Telefone *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    value={data.phoneNumber || ''}
                                    onChange={(e) => updateData('phoneNumber', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all`}
                                    placeholder="+258 84 123 4567"
                                />
                            </div>
                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Senha *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                                    }}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all`}
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirmar Senha *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                                    }}
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all`}
                                    placeholder="Repita a senha"
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Error Message */}
                        {errors.submit && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-700 dark:text-red-300">{errors.submit}</p>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm text-green-700 dark:text-green-300">
                                ✅ <strong>Acesso imediato!</strong> Você poderá completar seu perfil depois, quando tiver um caso ativo.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Criando conta...
                                </span>
                            ) : (
                                'Criar Conta e Acessar'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Já tem uma conta?{' '}
                            <button
                                onClick={() => window.location.href = '/login'}
                                className="text-red-600 dark:text-red-400 font-semibold hover:underline focus:outline-none"
                            >
                                Entrar
                            </button>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
                    <p>© 2024 Fala Comigo - Advocacia Digital Integrada</p>
                    <p className="mt-1">Ao criar uma conta, você concorda com nossos Termos e Política de Privacidade</p>
                </div>
            </div>
        </div>
    );
}
