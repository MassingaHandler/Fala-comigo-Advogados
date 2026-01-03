import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon } from './ui/icons';

const routeNames: Record<string, string> = {
    '/': 'Início',
    '/dashboard': 'Dashboard',
    '/nova-consulta': 'Nova Consulta',
    '/acompanhamento': 'Acompanhamento',
    '/historico': 'Histórico',
    '/verificar-estado': 'Verificar Estado',
    '/registro': 'Criar Conta',
    '/admin': 'Administração',
};

export default function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Don't show breadcrumbs on login page
    if (location.pathname === '/') return null;

    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Link to="/dashboard" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Início
            </Link>

            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const routeName = routeNames[to] || value.charAt(0).toUpperCase() + value.slice(1);

                return (
                    <React.Fragment key={to}>
                        <ChevronRightIcon className="w-4 h-4" />
                        {isLast ? (
                            <span className="text-gray-800 dark:text-gray-200 font-semibold">{routeName}</span>
                        ) : (
                            <Link to={to} className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                {routeName}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
