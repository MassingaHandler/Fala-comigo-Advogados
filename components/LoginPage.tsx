import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { validateEmail } from '../lib/validators';
import { MozambiqueFlagIcon, MailIcon, LockIcon } from './ui/icons';

interface Props {
    onRegisterClick: () => void;
}

export default function LoginPage({ onRegisterClick }: Props) {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        if (!validateEmail(email)) {
            setError('Email inválido');
            return;
        }

        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (!success) {
                setError('Email ou senha incorretos');
            } else {
                // AuthContext will handle redirect based on user role
                // Admin -> /admin/dashboard
                // Lawyer -> /portal-advogado (if implemented)
                // User -> /dashboard
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Erro ao fazer login. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-md">
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
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">Entrar na Conta</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MailIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                                    placeholder="seu@email.com" disabled={isLoading} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senha</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                                    placeholder="••••••••" disabled={isLoading} />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold mb-1">Demo:</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                Usuário: qualquer email/senha<br />
                                Admin: admin@falacomigo.mz / admin123
                            </p>
                        </div>

                        <button type="submit" disabled={isLoading}
                            className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Entrando...
                                </span>
                            ) : 'Entrar'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Não tem uma conta?{' '}
                            <button onClick={onRegisterClick} className="text-red-600 dark:text-red-400 font-semibold hover:underline focus:outline-none">
                                Criar Conta
                            </button>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            Esqueceu a senha?
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
                    <p>© 2024 Fala Comigo - Advocacia Digital Integrada</p>
                    <p className="mt-1">Plataforma oficial de consultas jurídicas de Moçambique</p>
                </div>
            </div>
        </div>
    );
}
