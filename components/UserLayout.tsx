import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import {
    HomeIcon,
    UserIcon,
    LogOutIcon,
    SearchIcon,
    MozambiqueFlagIcon
} from './ui/icons';
import { HistoryIcon, PlusCircleIcon, MessageSquareIcon } from './ui/dashboard-icons';
import Navbar from './Navbar';

export default function UserLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { id: '/dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: '/nova-consulta', label: 'Novo Pedido', icon: PlusCircleIcon },
        { id: '/historico', label: 'Histórico', icon: HistoryIcon },
        { id: '/verificar-estado', label: 'Verificar Estado', icon: SearchIcon },
        { id: '/acompanhamento', label: 'Acompanhamento', icon: MessageSquareIcon },
        { id: '/perfil', label: 'Meu Perfil', icon: UserIcon },
    ];

    const currentPath = location.pathname;

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col flex-shrink-0 z-20">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <MozambiqueFlagIcon className="w-8 h-8" />
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Fala Comigo</h2>
                            <p className="text-xs text-green-500 font-medium">● Online</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentPath === item.id
                                ? 'bg-red-600 text-white shadow-md'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                    >
                        <LogOutIcon className="w-5 h-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </div>

            {/* Main Body */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar onAdminClick={() => navigate('/admin')} hideLogo />
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 p-4 lg:p-6">
                    <div className="max-w-[1800px] mx-auto w-full px-2 md:px-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
