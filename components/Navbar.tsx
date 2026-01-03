import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { MozambiqueFlagIcon, SettingsIcon, UserIcon } from './ui/icons';

interface Props {
    onAdminClick?: () => void;
}

const LogoutIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

export default function Navbar({ onAdminClick }: Props) {
    const { user, logout, isAdmin } = useAuth();
    const [showUserMenu, setShowUserMenu] = React.useState(false);

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <MozambiqueFlagIcon className="w-8 h-8" />
                        <div>
                            <h1 className="text-xl font-bold text-red-600 dark:text-red-500">Fala Comigo</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Advocacia Digital</p>
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        {/* Admin Settings Icon */}
                        {isAdmin && onAdminClick && (
                            <button
                                onClick={onAdminClick}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Configurações de Administrador"
                            >
                                <SettingsIcon className="w-5 h-5" />
                            </button>
                        )}

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                    <UserIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        {user?.fullName || 'Usuário'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                                </div>
                                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 animate-fade-in">
                                        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                {user?.fullName}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                                            {isAdmin && (
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs font-semibold rounded">
                                                    Administrador
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-2">
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    // Navigate to profile (implement later)
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <UserIcon className="w-4 h-4" />
                                                Meu Perfil
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    logout();
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <LogoutIcon className="w-4 h-4" />
                                                Sair
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
