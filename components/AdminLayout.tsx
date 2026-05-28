import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import {
    HomeIcon,
    UserIcon,
    BriefcaseIcon,
    LogOutIcon
} from './ui/icons';
import {
    DollarSignIcon,
    BarChartIcon
} from './ui/dashboard-icons';
import { MozambiqueFlagIcon } from './ui/icons';
import { Shield, Users, Settings } from 'lucide-react';

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default function AdminLayout() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { id: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: '/admin/users', label: 'Usuários', icon: Users },
        { id: '/admin/lawyers', label: 'Advogados', icon: UserIcon },
        { id: '/admin/lawyer-applications', label: 'Candidaturas', icon: Shield },
        { id: '/admin/cases', label: 'Casos', icon: BriefcaseIcon },
        { id: '/admin/payments', label: 'Pagamentos', icon: DollarSignIcon },
        { id: '/admin/analytics', label: 'Analytics', icon: BarChartIcon },
        { id: '/admin/settings', label: 'Configurações', icon: Settings },
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
        setCurrentPath(path);
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
            <div className={`fixed md:relative inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col z-20 transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Admin Panel</h2>
                                <p className="text-xs text-green-500 font-medium">● Sistema</p>
                            </div>
                        </div>
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
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile top bar */}
                <div className="flex items-center h-14 px-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 md:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="Abrir menu"
                    >
                        <MenuIcon />
                    </button>
                    <div className="flex items-center gap-2 ml-3">
                        <MozambiqueFlagIcon className="w-7 h-7" />
                        <span className="font-bold text-purple-600 dark:text-purple-400">Admin Panel</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-8">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
