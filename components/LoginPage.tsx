import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { MozambiqueFlagIcon } from './ui/icons';

type Role = 'user' | 'lawyer';
type View = 'login' | 'forgot' | 'reset' | 'success';

interface Props {
    onRegisterClick: () => void;
}

const EyeIcon = ({ open }: { open: boolean }) => open ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

export default function LoginPage({ onRegisterClick }: Props) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    const [role, setRole] = useState<Role>(searchParams.get('role') === 'advogado' ? 'lawyer' : 'user');
    const [view, setView] = useState<View>('login');

    // Login state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Forgot password state
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotError, setForgotError] = useState('');
    const [resetCode, setResetCode] = useState('');

    // Reset password state
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState('');

    useEffect(() => {
        const param = searchParams.get('role');
        if (param === 'advogado') setRole('lawyer');
    }, [searchParams]);

    const switchRole = (r: Role) => {
        setRole(r);
        setError('');
        setEmail('');
        setPassword('');
    };

    // ─── Login ────────────────────────────────────────────────────────────────
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Preencha todos os campos'); return; }

        setIsLoading(true);
        try {
            if (role === 'user') {
                const ok = await login(email, password);
                if (!ok) { setError('Email ou senha incorretos'); return; }
                // AuthContext handles redirect based on role (user/admin)
                const stored = localStorage.getItem('fala_comigo_user');
                const userData = stored ? JSON.parse(stored) : null;
                if (userData?.isAdmin || userData?.is_admin) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                // Lawyer login — bypass AuthContext
                const response = await fetch('http://localhost:8000/api/v1/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const result = await response.json();
                if (!response.ok || !result.success) {
                    setError(result.detail || 'Email ou senha incorretos');
                    return;
                }
                if (result.user?.role !== 'lawyer') {
                    setError('Esta conta não pertence a um advogado');
                    return;
                }
                localStorage.setItem('fala_comigo_token', result.token);
                localStorage.setItem('fala_comigo_lawyer', JSON.stringify(result.user));
                navigate('/portal-advogado');
            }
        } catch {
            setError('Erro de conexão. Verifique se o servidor está activo.');
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Forgot password ─────────────────────────────────────────────────────
    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotError('');
        if (!forgotEmail) { setForgotError('Insira o seu email'); return; }

        setForgotLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, role }),
            });
            const result = await response.json();
            if (result.success) {
                if (result.debug_token) {
                    setResetCode(result.debug_token);
                    setResetToken(result.debug_token);
                }
                setView('reset');
            } else {
                setForgotError(result.detail || 'Erro ao solicitar recuperação');
            }
        } catch {
            setForgotError('Erro de conexão');
        } finally {
            setForgotLoading(false);
        }
    };

    // ─── Reset password ───────────────────────────────────────────────────────
    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetError('');
        if (!resetToken) { setResetError('Insira o código de verificação'); return; }
        if (newPassword.length < 6) { setResetError('A senha deve ter pelo menos 6 caracteres'); return; }
        if (newPassword !== confirmPassword) { setResetError('As senhas não coincidem'); return; }

        setResetLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, token: resetToken, new_password: newPassword, role }),
            });
            const result = await response.json();
            if (response.ok && result.success) {
                setView('success');
            } else {
                setResetError(result.detail || 'Erro ao redefinir senha');
            }
        } catch {
            setResetError('Erro de conexão');
        } finally {
            setResetLoading(false);
        }
    };

    const inputClass = (hasError?: boolean) =>
        `w-full px-4 py-3 rounded-xl border ${hasError ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm`;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar à página inicial
                </button>
                <div className="flex items-center gap-2">
                    <MozambiqueFlagIcon className="w-6 h-6" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:block">Fala Comigo</span>
                </div>
            </div>

            {/* Main card */}
            <div className="flex-1 flex items-center justify-center px-4 py-6">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <MozambiqueFlagIcon className="w-10 h-10" />
                            <h1 className="text-2xl font-bold text-red-600 dark:text-red-500">Fala Comigo</h1>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Advocacia Digital Integrada</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                        {/* Role tabs */}
                        {view === 'login' && (
                            <div className="flex border-b border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => switchRole('user')}
                                    className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${role === 'user'
                                        ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400 bg-red-50/50 dark:bg-red-900/10'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    👤 Cidadão
                                </button>
                                <button
                                    onClick={() => switchRole('lawyer')}
                                    className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${role === 'lawyer'
                                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    ⚖️ Advogado
                                </button>
                            </div>
                        )}

                        <div className="p-6 sm:p-7">
                            {/* ── LOGIN ── */}
                            {view === 'login' && (
                                <>
                                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                                        {role === 'user' ? 'Entrar na sua conta' : 'Portal do Advogado'}
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                                        {role === 'user'
                                            ? 'Introduza as suas credenciais para continuar'
                                            : 'Aceda ao painel de gestão de casos'}
                                    </p>

                                    {error && (
                                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-sm text-red-600 dark:text-red-400">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                                                {role === 'lawyer' ? 'Email Profissional' : 'Email'}
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className={inputClass(!!error)}
                                                placeholder="exemplo@email.com"
                                                autoComplete="email"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                                                Senha
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    className={`${inputClass(!!error)} pr-11`}
                                                    placeholder="••••••••"
                                                    autoComplete="current-password"
                                                    disabled={isLoading}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(s => !s)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                    tabIndex={-1}
                                                >
                                                    <EyeIcon open={showPassword} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => { setForgotEmail(email); setView('forgot'); setForgotError(''); }}
                                                className="text-xs text-red-600 dark:text-red-400 hover:underline"
                                            >
                                                Esqueceu a senha?
                                            </button>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${role === 'lawyer'
                                                ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300'
                                                : 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300'}`}
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    A entrar...
                                                </span>
                                            ) : 'Entrar'}
                                        </button>
                                    </form>

                                    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2 text-center">
                                        {role === 'user' ? (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Não tem conta?{' '}
                                                <button onClick={onRegisterClick} className="text-red-600 dark:text-red-400 font-semibold hover:underline">
                                                    Criar conta
                                                </button>
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Ainda não é parceiro?{' '}
                                                <button onClick={() => navigate('/registro-advogado')} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                                                    Candidatar-se
                                                </button>
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* ── FORGOT PASSWORD ── */}
                            {view === 'forgot' && (
                                <>
                                    <button
                                        onClick={() => { setView('login'); setForgotError(''); }}
                                        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Voltar ao login
                                    </button>
                                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Recuperar Senha</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                                        Insira o seu email. Iremos gerar um código de verificação.
                                    </p>

                                    {forgotError && (
                                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-sm text-red-600 dark:text-red-400">
                                            {forgotError}
                                        </div>
                                    )}

                                    <form onSubmit={handleForgot} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Email</label>
                                            <input
                                                type="email"
                                                value={forgotEmail}
                                                onChange={e => setForgotEmail(e.target.value)}
                                                className={inputClass(!!forgotError)}
                                                placeholder="exemplo@email.com"
                                                disabled={forgotLoading}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Conta: <strong>{role === 'lawyer' ? 'Advogado' : 'Cidadão'}</strong>. O código aparecerá no ecrã.</span>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={forgotLoading}
                                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                                        >
                                            {forgotLoading ? 'A enviar...' : 'Gerar Código de Recuperação'}
                                        </button>
                                    </form>
                                </>
                            )}

                            {/* ── RESET PASSWORD ── */}
                            {view === 'reset' && (
                                <>
                                    <button
                                        onClick={() => { setView('forgot'); setResetError(''); }}
                                        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Voltar
                                    </button>
                                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Definir Nova Senha</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Use o código de verificação para redefinir a sua senha.
                                    </p>

                                    {resetCode && (
                                        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                                            <p className="text-xs text-green-700 dark:text-green-300 font-medium mb-1">Código de recuperação gerado:</p>
                                            <p className="text-2xl font-mono font-bold text-green-700 dark:text-green-300 tracking-widest text-center py-1">
                                                {resetCode}
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-400 text-center mt-1">Válido por 30 minutos</p>
                                        </div>
                                    )}

                                    {resetError && (
                                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-sm text-red-600 dark:text-red-400">
                                            {resetError}
                                        </div>
                                    )}

                                    <form onSubmit={handleReset} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Código de Verificação</label>
                                            <input
                                                type="text"
                                                value={resetToken}
                                                onChange={e => setResetToken(e.target.value)}
                                                className={inputClass(!!resetError)}
                                                placeholder="123456"
                                                maxLength={6}
                                                disabled={resetLoading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Nova Senha</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                className={inputClass(!!resetError)}
                                                placeholder="Mínimo 6 caracteres"
                                                disabled={resetLoading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Confirmar Nova Senha</label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                className={inputClass(!!resetError)}
                                                placeholder="Repita a nova senha"
                                                disabled={resetLoading}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={resetLoading}
                                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                                        >
                                            {resetLoading ? 'A redefinir...' : 'Redefinir Senha'}
                                        </button>
                                    </form>
                                </>
                            )}

                            {/* ── SUCCESS ── */}
                            {view === 'success' && (
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Senha Redefinida!</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                        A sua senha foi alterada com sucesso. Pode fazer login agora.
                                    </p>
                                    <button
                                        onClick={() => { setView('login'); setEmail(forgotEmail); setPassword(''); setError(''); }}
                                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all"
                                    >
                                        Ir para o Login
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
                        © {new Date().getFullYear()} Fala Comigo — Advocacia Digital de Moçambique
                    </p>
                </div>
            </div>
        </div>
    );
}
