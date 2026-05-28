import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScaleIcon, HomeIcon, BriefcaseIcon, ClockIcon, UserIcon, LogOutIcon } from './ui/icons';
import { DollarSignIcon } from './ui/dashboard-icons';
import LawyerDashboard from './LawyerDashboard';
import LawyerCaseManagement from './LawyerCaseManagement';
import LawyerChatView from './LawyerChatView';
import LawyerHistoryView from './LawyerHistoryView';
import LawyerFinancials from './LawyerFinancials';
import LawyerProfile from './LawyerProfile';
import LawyerCaseDetailsModal from './LawyerCaseDetailsModal';
import type { Order, Lawyer } from '../types';
import { OrderStatus } from '../types';

interface Props {
    onBack?: () => void;
}

type View = 'dashboard' | 'cases' | 'chat' | 'history' | 'financials' | 'profile';

export default function LawyerPortal(_props: Props) {
    const navigate = useNavigate();
    const [view, setView] = useState<View>('dashboard');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [consultations, setConsultations] = useState<Order[]>([]);
    const [currentLawyer, setCurrentLawyer] = useState<Lawyer | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const [casesLoading, setCasesLoading] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

    const fetchLawyerCases = async (lawyerObj?: Lawyer) => {
        const lawyer = lawyerObj || currentLawyer;
        if (!lawyer) return;
        const token = localStorage.getItem('fala_comigo_token');
        if (!token) return;

        setCasesLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8000/api/v1/lawyers/${lawyer.lawyer_id}/assignments`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    const orders: Order[] = result.data.map((a: any) => ({
                        id: a.order.id,
                        human_id: a.order.human_id || a.order.order_id,
                        order_id: a.order.order_id || a.order.human_id,
                        user_id: a.order.user_id,
                        clientName: a.order.client_name,
                        clientPhoneNumber: a.order.client_phone_number,
                        topic: a.order.topic,
                        pkg: a.order.pkg,
                        consultationType: a.order.consultation_type,
                        payment_status: a.order.payment_status,
                        payment_method: a.order.payment_method,
                        status: a.order.status as OrderStatus,
                        createdAt: new Date(a.order.created_at),
                        termsAccepted: true,
                        assignment: {
                            assignment_id: a.assignment_id,
                            lawyer: lawyer,
                            assignedAt: new Date(a.assigned_at),
                            session: a.session ? {
                                session_id: a.session.session_id,
                                startTime: a.session.start_time ? new Date(a.session.start_time) : new Date(),
                                messages: a.session.messages || [],
                                documents: a.session.documents || []
                            } : undefined
                        }
                    }));
                    setConsultations(orders);
                    setLastRefresh(new Date());
                }
            } else {
                console.error('Erro ao buscar casos:', response.status, await response.text());
            }
        } catch (error) {
            console.error('Erro ao buscar casos do advogado:', error);
        } finally {
            setCasesLoading(false);
        }
    };

    // Ao montar: carregar advogado do localStorage ou redirecionar para login
    useEffect(() => {
        const stored = localStorage.getItem('fala_comigo_lawyer');
        if (!stored) {
            navigate('/login?role=advogado', { replace: true });
            return;
        }
        try {
            const lawyerData = JSON.parse(stored);
            const lawyer: Lawyer = {
                lawyer_id: lawyerData.lawyer_id,
                nome: lawyerData.nome,
                especialidade: lawyerData.especialidade,
                avatarUrl: lawyerData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyerData.nome || 'A')}&background=4f46e5&color=fff`,
                phoneNumber: lawyerData.phoneNumber || lawyerData.professionalPhone,
                oamNumber: lawyerData.oamNumber,
                isOnline: lawyerData.isOnline,
                rating: lawyerData.rating,
                totalReviews: lawyerData.totalReviews,
            };
            setCurrentLawyer(lawyer);
            fetchLawyerCases(lawyer);
        } catch {
            navigate('/login?role=advogado', { replace: true });
        }
    }, []);

    // Auto-refresh a cada 30 segundos quando autenticado
    useEffect(() => {
        if (currentLawyer) {
            const interval = setInterval(() => fetchLawyerCases(), 30000);
            return () => clearInterval(interval);
        }
    }, [currentLawyer?.lawyer_id]);

    const handleLogout = () => {
        localStorage.removeItem('fala_comigo_lawyer');
        localStorage.removeItem('fala_comigo_token');
        navigate('/login?role=advogado');
    };

    const handleUpdateOrder = (updatedOrder: Order) => {
        setConsultations(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        setSelectedOrder(updatedOrder);
    };

    const handleCompleteCase = async (order: Order) => {
        if (!order) return;

        const confirmed = window.confirm(`Tem certeza que deseja concluir o caso de ${order.clientName || 'Cliente'} (#${order.human_id})?\n\nIsso moverá o caso para o histórico.`);
        if (!confirmed) return;

        setCasesLoading(true);
        try {
            const token = localStorage.getItem('fala_comigo_token');
            const response = await fetch(`http://localhost:8000/api/v1/consultations/${order.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: OrderStatus.COMPLETED })
            });

            if (response.ok) {
                const updatedOrder = { ...order, status: OrderStatus.COMPLETED };
                handleUpdateOrder(updatedOrder);
                setView('cases');
                setSelectedOrder(null);
                alert('Caso concluído com sucesso!');
            } else {
                const errorData = await response.json();
                alert(`Erro ao concluir caso: ${errorData.detail || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao concluir caso:', error);
            alert('Erro de conexão ao tentar concluir o caso.');
        } finally {
            setCasesLoading(false);
        }
    };

    const handleStartChat = (order: Order) => {
        setSelectedOrder(order);
        setView('chat');
    };

    const activeCases = consultations.filter(c =>
        c.status === OrderStatus.ASSIGNED || c.status === OrderStatus.IN_PROGRESS
    );

    // Enquanto não tiver currentLawyer (a carregar do localStorage), mostrar loading
    if (!currentLawyer) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                {/* Sidebar Navigation */}
                <div className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <ScaleIcon className="w-7 h-7 text-indigo-600" />
                            <div className="flex-1 min-w-0">
                                <h2 className="text-base font-bold text-gray-800 dark:text-white truncate">Portal do Advogado</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentLawyer?.nome}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => fetchLawyerCases()}
                            disabled={casesLoading}
                            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors disabled:opacity-50"
                        >
                            <svg className={`w-3.5 h-3.5 ${casesLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {casesLoading ? 'A actualizar...' : lastRefresh ? `Actualizado ${lastRefresh.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}` : 'Actualizar casos'}
                        </button>
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
                            onClick={handleLogout}
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
                            lawyerId={currentLawyer?.lawyer_id || ''}
                        />
                    )}
                    {view === 'cases' && (
                        <LawyerCaseManagement
                            cases={activeCases}
                            onStartChat={handleStartChat}
                            onViewDetails={(order) => {
                                setSelectedOrder(order);
                                setIsDetailsModalOpen(true);
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
                    {view === 'profile' && currentLawyer && (
                        <LawyerProfile
                            lawyer={currentLawyer}
                            onBack={() => setView('dashboard')}
                            onUpdateProfile={(updates) => {
                                console.log('Profile updated:', updates);
                            }}
                        />
                    )}

                    {/* Modais */}
                    <LawyerCaseDetailsModal
                        isOpen={isDetailsModalOpen}
                        onClose={() => setIsDetailsModalOpen(false)}
                        order={selectedOrder}
                        onStartChat={handleStartChat}
                    />
                </div>
            </div>
        );
}
