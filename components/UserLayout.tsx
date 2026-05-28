import { useState } from 'react';
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

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default function UserLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { id: '/dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: '/nova-consulta', label: 'Novo Pedido', icon: PlusCircleIcon },
        { id: '/historico', label: 'Histórico', icon: HistoryIcon },
        { id: '/verificar-estado', label: 'Verificar Estado', icon: SearchIcon },
        { id: '/acompanhamento', label: 'Acompanhamento', icon: MessageSquareIcon },
        { id: '/perfil', label: 'Meu Perfil', icon: UserIcon },
    ];

    const currentPath = location.pathname;

    const handleNavigate = (path: string) => {
        navigate(path);
        setSidebarOpen(false);
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <div className={`fixed md:relative inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col flex-shrink-0 z-20 transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MozambiqueFlagIcon className="w-8 h-8" />
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Fala Comigo</h2>
                                <p className="text-xs text-green-500 font-medium">● Online</p>
                            </div>
                        </div>
                        {/* Close button - mobile only */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <XIcon />
                        </button>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigate(item.id)}
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
                <Navbar
                    onAdminClick={() => navigate('/admin')}
                    hideLogo
                    onMenuClick={() => setSidebarOpen(true)}
                />
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 p-3 md:p-4 lg:p-6">
                    <div className="max-w-[1800px] mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
