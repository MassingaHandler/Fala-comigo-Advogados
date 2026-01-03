import React, { useState } from 'react';
import { ScaleIcon, HomeIcon, BriefcaseIcon, ClockIcon, UserIcon, LogOutIcon } from './ui/icons';
import { DollarSignIcon } from './ui/dashboard-icons';
import LawyerDashboard from './LawyerDashboard';
import LawyerCaseManagement from './LawyerCaseManagement';
import LawyerChatView from './LawyerChatView';
import LawyerHistoryView from './LawyerHistoryView';
import LawyerFinancials from './LawyerFinancials';
import LawyerProfile from './LawyerProfile';
import type { Order, Lawyer, ChatMessage } from '../types';
import { OrderStatus } from '../types';

interface Props {
    onBack: () => void;
}

type View = 'login' | 'register' | 'dashboard' | 'cases' | 'chat' | 'history' | 'financials' | 'profile';

export default function LawyerPortal({ onBack }: Props) {
    const [view, setView] = useState<View>('login');
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Mock lawyer data
    const mockLawyer: Lawyer = {
        lawyer_id: 'lawyer-001',
        nome: 'Dr. João Silva',
        especialidade: 'Direito de Família',
        avatarUrl: 'https://ui-avatars.com/api/?name=Joao+Silva&background=4f46e5&color=fff',
        phoneNumber: '+258 84 123 4567',
        oamNumber: '1234/OAM',
        isOnline: true,
        rating: 4.8,
        totalReviews: 127,
    };

    // Mock consultation data
    const mockConsultations: Order[] = [
        {
            id: 'order-001',
            human_id: 'FC-123456',
            order_id: 'FC-123456',
            user_id: 'user-001',
            topic: { id: '1', name: 'Divórcio', icon: null },
            pkg: { id: '1', name: 'Consulta Digital', type: 'consultation', price: 2500, description: 'Chat' },
            consultationType: 'digital',
            payment_status: 'confirmed',
            status: OrderStatus.ASSIGNED,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            assignment: {
                assignment_id: 'assign-001',
                lawyer: mockLawyer,
                assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                session: {
                    session_id: 'session-001',
                    startTime: new Date(),
                    messages: [
                        {
                            id: 'msg-001',
                            sender: 'user',
                            text: 'Olá, preciso de ajuda com um processo de divórcio.',
                            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
                            type: 'text',
                        }
                    ],
                    documents: [],
                }
            }
        },
        {
            id: 'order-002',
            human_id: 'FC-123457',
            order_id: 'FC-123457',
            user_id: 'user-002',
            topic: { id: '2', name: 'Direito do Trabalho', icon: null },
            pkg: { id: '2', name: 'Consulta Telefónica', type: 'consultation', price: 3000, description: 'Telefone' },
            consultationType: 'phone',
            payment_status: 'confirmed',
            status: OrderStatus.IN_PROGRESS,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
            assignment: {
                assignment_id: 'assign-002',
                lawyer: mockLawyer,
                assignedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
                session: {
                    session_id: 'session-002',
                    startTime: new Date(),
                    messages: [],
                    documents: [],
                }
            }
        },
        {
            id: 'order-003',
            human_id: 'FC-123458',
            order_id: 'FC-123458',
            user_id: 'user-003',
            topic: { id: '3', name: 'Direito Criminal', icon: null },
            pkg: { id: '1', name: 'Consulta Digital', type: 'consultation', price: 2500, description: 'Chat' },
            consultationType: 'digital',
            payment_status: 'confirmed',
            status: OrderStatus.COMPLETED,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            assignment: {
                assignment_id: 'assign-003',
                lawyer: mockLawyer,
                assignedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                session: {
                    session_id: 'session-003',
                    startTime: new Date(),
                    messages: [],
                    documents: [],
                }
            }
        },
        {
            id: 'order-004',
            human_id: 'FC-123459',
            order_id: 'FC-123459',
            user_id: 'user-004',
            topic: { id: '1', name: 'Pensão Alimentícia', icon: null },
            pkg: { id: '1', name: 'Consulta Digital', type: 'consultation', price: 2500, description: 'Chat' },
            consultationType: 'digital',
            payment_status: 'confirmed',
            status: OrderStatus.COMPLETED,
            createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
            assignment: {
                assignment_id: 'assign-004',
                lawyer: mockLawyer,
                assignedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
                session: {
                    session_id: 'session-004',
                    startTime: new Date(),
                    messages: [],
                    documents: [],
                }
            }
        },
        {
            id: 'order-005',
            human_id: 'FC-123460',
            order_id: 'FC-123460',
            user_id: 'user-005',
            topic: { id: '4', name: 'Contrato de Trabalho', icon: null },
            pkg: { id: '2', name: 'Consulta Telefónica', type: 'consultation', price: 3000, description: 'Telefone' },
            consultationType: 'phone',
            payment_status: 'confirmed',
            status: OrderStatus.ASSIGNED,
            createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            assignment: {
                assignment_id: 'assign-005',
                lawyer: mockLawyer,
                assignedAt: new Date(Date.now() - 30 * 60 * 1000),
                session: {
                    session_id: 'session-005',
                    startTime: new Date(),
                    messages: [],
                    documents: [],
                }
            }
        },
    ];

    const [consultations, setConsultations] = useState<Order[]>(mockConsultations);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setView('dashboard');
        }, 1500);
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert('Candidatura submetida à Ordem dos Advogados com sucesso!');
            setView('login');
        }, 2000);
    };

    const handleUpdateOrder = (updatedOrder: Order) => {
        setConsultations(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        setSelectedOrder(updatedOrder);
    };

    const handleCompleteCase = (order: Order) => {
        const updatedOrder = { ...order, status: OrderStatus.COMPLETED };
        handleUpdateOrder(updatedOrder);
        setView('cases');
        setSelectedOrder(null);
    };

    const handleStartChat = (order: Order) => {
        setSelectedOrder(order);
        setView('chat');
    };

    const activeCases = consultations.filter(c =>
        c.status === OrderStatus.ASSIGNED || c.status === OrderStatus.IN_PROGRESS
    );

    // Authenticated views
    if (view !== 'login' && view !== 'register') {
        return (
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                {/* Sidebar Navigation */}
                <div className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <ScaleIcon className="w-8 h-8 text-indigo-600" />
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Portal do Advogado</h2>
                                <p className="text-xs text-green-500 font-medium">● Online</p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
                            { id: 'cases', label: 'Casos Ativos', icon: BriefcaseIcon, badge: activeCases.length },
                            { id: 'history', label: 'Histórico', icon: ClockIcon },
                            { id: 'financials', label: 'Financeiro', icon: DollarSignIcon },
                            { id: 'profile', label: 'Perfil', icon: UserIcon },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id as View)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === item.id
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setView('login')}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                        >
                            <LogOutIcon className="w-5 h-5" />
                            <span className="font-medium">Sair</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {view === 'dashboard' && (
                        <LawyerDashboard
                            onViewActive={() => setView('cases')}
                            onHistory={() => setView('history')}
                            onProfile={() => setView('profile')}
                            onFinancials={() => setView('financials')}
                            consultationHistory={consultations}
                            lawyerId={mockLawyer.lawyer_id}
                        />
                    )}
                    {view === 'cases' && (
                        <LawyerCaseManagement
                            cases={activeCases}
                            onStartChat={handleStartChat}
                            onViewDetails={(order) => {
                                setSelectedOrder(order);
                                // Would open details modal
                            }}
                            onCompleteCase={handleCompleteCase}
                        />
                    )}
                    {view === 'chat' && selectedOrder && (
                        <LawyerChatView
                            order={selectedOrder}
                            onUpdateOrder={handleUpdateOrder}
                            onBack={() => setView('cases')}
                            onCompleteCase={() => handleCompleteCase(selectedOrder)}
                        />
                    )}
                    {view === 'history' && (
                        <LawyerHistoryView
                            orders={consultations}
                            onSelectOrder={(order) => {
                                setSelectedOrder(order);
                                // Would open details view
                            }}
                            onBack={() => setView('dashboard')}
                        />
                    )}
                    {view === 'financials' && (
                        <LawyerFinancials consultationHistory={consultations} />
                    )}
                    {view === 'profile' && (
                        <LawyerProfile
                            lawyer={mockLawyer}
                            onBack={() => setView('dashboard')}
                            onUpdateProfile={(updates) => {
                                console.log('Profile updated:', updates);
                            }}
                        />
                    )}
                </div>
            </div>
        );
    }

    // Register view
    if (view === 'register') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto p-8 animate-fade-in">
                <button onClick={() => setView('login')} className="text-sm text-gray-500 hover:text-gray-800 mb-4">← Voltar</button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Registo de Advogado</h2>
                <p className="text-sm text-gray-500 mb-6">Junte-se à nossa rede. Validamos a sua inscrição com a OAM.</p>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                        <input required type="text" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="Dr. Exemplo" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número da Carteira Profissional (OAM)</label>
                        <input required type="text" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="Ex: 1234/OAM" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Especialidade</label>
                        <select className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                            <option>Família</option>
                            <option>Trabalho</option>
                            <option>Criminal</option>
                            <option>Comercial</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">
                        {loading ? 'A validar...' : 'Submeter Candidatura'}
                    </button>
                </form>
            </div>
        );
    }

    // Login view
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <ScaleIcon className="w-12 h-12 text-indigo-600" />
                        <div>
                            <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-500">Portal do Advogado</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Fala Comigo - Advocacia Digital</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-fade-in">
                    <button onClick={onBack} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6">
                        ← Voltar
                    </button>

                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">Acesso Advogado</h2>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email ou Carteira OAM</label>
                            <input required type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="exemplo@email.com ou 1234/OAM" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senha</label>
                            <input required type="password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="••••••••" />
                        </div>

                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold mb-1">Demo:</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                Use qualquer email/senha para testar
                            </p>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? (
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
                            Não tem conta?{' '}
                            <button onClick={() => setView('register')} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline focus:outline-none">
                                Registar-se
                            </button>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Esqueceu a senha?
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
                    <p>© 2024 Fala Comigo - Portal do Advogado</p>
                    <p className="mt-1">Plataforma oficial de consultas jurídicas de Moçambique</p>
                </div>
            </div>
        </div>
    );
}
