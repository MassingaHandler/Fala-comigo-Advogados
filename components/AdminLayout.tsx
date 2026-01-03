import React, { useState } from 'react';
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

export default function AdminLayout() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

    React.useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, [window.location.pathname]);

    const menuItems = [
        { id: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: '/admin/users', label: 'Usuários', icon: Users },
        { id: '/admin/lawyers', label: 'Advogados', icon: UserIcon },
        { id: '/admin/cases', label: 'Casos', icon: BriefcaseIcon },
        { id: '/admin/payments', label: 'Pagamentos', icon: DollarSignIcon },
        { id: '/admin/analytics', label: 'Analytics', icon: BarChartIcon },
        { id: '/admin/settings', label: 'Configurações', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Admin Panel</h2>
                            <p className="text-xs text-green-500 font-medium">● Sistema</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                navigate(item.id);
                                setCurrentPath(item.id);
                            }}
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
            <div className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
