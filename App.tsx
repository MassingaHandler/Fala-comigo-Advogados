import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { Order, ServiceTopic, ConsultationPackage, ConsultationType, Rating, Lawyer, RegistrationData } from './types';
import { OrderStatus } from './types';
import { LAWYERS } from './constants';
import { AuthProvider, useAuth } from './lib/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Breadcrumbs from './components/Breadcrumbs';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import UserLayout from './components/UserLayout';
import UserDashboard from './components/UserDashboard';
import NewConsultationWizard from './components/NewConsultationWizard';
import FollowUpWizard from './components/FollowUpWizard';
import StatusChecker from './components/StatusChecker';
import ChatView from './components/ChatView';
import OrderConfirmation from './components/OrderConfirmation';
import PhoneConsultationView from './components/PhoneConsultationView';
import RatingView from './components/RatingView';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import AdminSettings from './components/AdminSettings';
import LawyerRegistrationWizard from './components/LawyerRegistrationWizard';
import LawyerRegistrationSuccess from './components/LawyerRegistrationSuccess';
import MpesaPaymentModal from './components/MpesaPaymentModal';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import LawyerManagement from './components/admin/LawyerManagement';
import CaseManagement from './components/admin/CaseManagement';
import PaymentManagement from './components/admin/PaymentManagement';
import AdminAnalytics from './components/admin/AdminAnalytics';
import LawyerApplications from './components/admin/LawyerApplications';
import AdminLayout from './components/AdminLayout';
import LawyerPortal from './components/LawyerPortal';
import LandingPage from './components/LandingPage';
import QuickRegistration from './components/QuickRegistration';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';

interface PendingOrderData {
    topic: ServiceTopic;
    pkg: ConsultationPackage;
    type: ConsultationType;
    previousOrder?: Order;
}

function AppContent() {
    const { isAuthenticated, isAdmin, register: registerUser } = useAuth();
    const navigate = useNavigate();

    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [activeOrder, setActiveOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [pendingOrder, setPendingOrder] = useState<PendingOrderData | null>(null);
    const subscriptionRef = React.useRef<any>(null);

    useEffect(() => {
        const loadHistory = async () => {
            if (isAuthenticated) {
                try {
                    // Obter dados do usuário do localStorage
                    const userStr = localStorage.getItem('fala_comigo_user');
                    const token = localStorage.getItem('fala_comigo_token');

                    if (!userStr || !token) return;

                    const user = JSON.parse(userStr);

                    // Buscar consultas do backend
                    const response = await fetch(`http://localhost:8000/api/v1/consultations/users/${user.id}/consultations`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success && result.data) {
                            // Converter dados do backend para formato do frontend
                            const orders: Order[] = result.data.map((order: any) => ({
                                id: order.id,
                                human_id: order.human_id || order.order_id,
                                order_id: order.order_id || order.human_id,
                                user_id: order.user_id,
                                clientPhoneNumber: order.client_phone_number,
                                topic: order.topic,
                                pkg: order.pkg,
                                consultationType: order.consultation_type,
                                payment_status: order.payment_status,
                                payment_method: order.payment_method,
                                transaction_reference: order.transaction_reference,
                                status: order.status as OrderStatus,
                                createdAt: new Date(order.created_at),
                                termsAccepted: true,
                                assignment: order.assignment ? {
                                    assignment_id: order.assignment.assignment_id,
                                    lawyer: order.assignment.lawyer,
                                    assignedAt: new Date(order.assignment.assigned_at),
                                    session: order.assignment.session ? {
                                        ...order.assignment.session,
                                        startTime: new Date(order.assignment.session.startTime),
                                        messages: (order.assignment.session.messages || []).map((m: any) => ({
                                            ...m,
                                            timestamp: new Date(m.timestamp)
                                        })),
                                        documents: (order.assignment.session.documents || []).map((d: any) => ({
                                            ...d,
                                            uploadedAt: new Date(d.uploadedAt)
                                        }))
                                    } : undefined
                                } : undefined
                            }));

                            setOrderHistory(orders);
                            console.log('Consultas carregadas:', orders);
                        }
                    }
                } catch (error) {
                    console.error('Erro ao carregar histórico:', error);
                }
            }
        };
        loadHistory();
    }, [isAuthenticated]);

    const findOrder = (humanId: string): Order | undefined => {
        return orderHistory.find(o => o.human_id === humanId || o.order_id === humanId);
    };

    const handleInitiateOrder = (topic: ServiceTopic, pkg: ConsultationPackage, type: ConsultationType, previousOrder?: Order) => {
        setPendingOrder({ topic, pkg, type, previousOrder });
        setShowPaymentModal(true);
    };

    const handleFinalizeOrder = async (transactionId: string, phoneNumber: string) => {
        if (!pendingOrder) return;
        setShowPaymentModal(false);
        setIsLoading(true);

        const { topic, pkg, type, previousOrder } = pendingOrder;
        const humanId = `FC-${Math.floor(100000 + Math.random() * 900000)}`;

        let assignedLawyer: Lawyer;
        if (previousOrder && previousOrder.assignment) {
            assignedLawyer = previousOrder.assignment.lawyer;
        } else {
            const specialtyMap: { [key: string]: string } = {
                'Família': 'Família', 'Trabalho': 'Trabalho', 'Terra/DUAT': 'Terra/DUAT', 'Consumo': 'Consumo',
            };
            const requiredSpecialty = specialtyMap[topic.name] || 'Outros';
            let availableLawyers = LAWYERS.filter(l => l.especialidade === requiredSpecialty);
            if (availableLawyers.length === 0) availableLawyers = LAWYERS.filter(l => l.especialidade === 'Outros');
            if (availableLawyers.length === 0) availableLawyers = LAWYERS;
            assignedLawyer = availableLawyers[Math.floor(Math.random() * availableLawyers.length)];
        }
        if (!assignedLawyer.phoneNumber) assignedLawyer.phoneNumber = "+258 84 999 8877";

        const newOrder: Order = {
            id: crypto.randomUUID(), human_id: humanId, order_id: humanId, parent_order_id: previousOrder?.id,
            user_id: 'user_01', clientPhoneNumber: phoneNumber, topic, pkg, consultationType: type,
            payment_status: 'confirmed', payment_method: 'mpesa', transaction_reference: transactionId,
            status: OrderStatus.ASSIGNED, createdAt: new Date(), termsAccepted: !!previousOrder,
            assignment: {
                assignment_id: `ASG${Date.now()}`, lawyer: assignedLawyer, assignedAt: new Date(),
                session: { session_id: `SESS${Date.now()}`, startTime: new Date(), messages: [], documents: [] },
            },
        };

        if (isSupabaseConfigured()) {
            try {
                await supabase.from('orders').insert({
                    id: newOrder.id, human_id: newOrder.human_id, user_id: newOrder.user_id,
                    client_phone: phoneNumber, topic_id: topic.id, package_id: pkg.id,
                    consultation_type: type, status: 'assigned', price_paid: pkg.price, transaction_ref: transactionId
                });
                const introText = previousOrder
                    ? `Olá novamente! Vamos dar seguimento ao processo ${previousOrder.human_id}.`
                    : `Olá! Sou ${assignedLawyer.nome}, seu advogado. Pagamento confirmado (Ref: ${transactionId}). Como posso ajudar?`;
                await supabase.from('messages').insert({
                    order_id: newOrder.id, sender_id: 'system', content: introText, message_type: 'text'
                });
            } catch (err) {
                console.error("Falha ao conectar Supabase", err);
            }
        } else {
            const introText = previousOrder
                ? `Olá novamente! Vamos dar seguimento ao seu processo de ${topic.name}.`
                : `Olá! Sou ${assignedLawyer.nome}, seu/sua advogado(a). Recebemos o seu pagamento via M-Pesa (Ref: ${transactionId}). Como posso ajudar?`;
            newOrder.assignment!.session!.messages.push({
                id: `msg-${Date.now()}`, sender: 'lawyer', text: introText, timestamp: new Date(), type: 'text',
            });
        }

        setActiveOrder(newOrder);
        setOrderHistory(prev => [...prev, newOrder]);
        setIsLoading(false);
        setPendingOrder(null);
        navigate('/dashboard');
    };

    const handleStartChat = (order?: Order) => {
        const targetOrder = order || activeOrder;
        if (!targetOrder) return;

        // Se o order passado é diferente do activeOrder, atualiza o activeOrder
        if (order && order.id !== activeOrder?.id) {
            setActiveOrder(order);
        }

        if (targetOrder.consultationType === 'phone') {
            navigate('/chamada-telefonica');
        } else {
            if (targetOrder && isSupabaseConfigured()) {
                const channel = supabase.channel('realtime-messages').on('postgres_changes', {
                    event: 'INSERT', schema: 'public', table: 'messages', filter: `order_id=eq.${targetOrder.id}`
                }, (payload) => {
                    const newMsg = payload.new;
                    const chatMsg: any = {
                        id: newMsg.id, sender: newMsg.sender_id === 'user_01' ? 'user' : 'lawyer',
                        text: newMsg.content, timestamp: new Date(newMsg.created_at), type: newMsg.message_type,
                    };
                    setActiveOrder(current => {
                        if (!current || !current.assignment?.session) return current;
                        if (current.assignment.session.messages.find(m => m.id === chatMsg.id)) return current;
                        return {
                            ...current, assignment: {
                                ...current.assignment, session: {
                                    ...current.assignment.session, messages: [...current.assignment.session.messages, chatMsg]
                                }
                            }
                        };
                    });
                }).subscribe();
                subscriptionRef.current = channel;
            }
            navigate('/chat');
        }
    };

    const handleUpdateOrder = async (updatedOrder: Order) => {
        setActiveOrder(updatedOrder);
        const session = updatedOrder.assignment?.session;
        if (session && session.messages.length > 0) {
            const lastMsg = session.messages[session.messages.length - 1];
            if (isSupabaseConfigured() && lastMsg.sender === 'user' && Date.now() - lastMsg.timestamp.getTime() < 1000) {
                await supabase.from('messages').insert({
                    order_id: updatedOrder.id, sender_id: updatedOrder.user_id,
                    content: lastMsg.text, message_type: lastMsg.type
                });
            }
        }
    };

    const handleEndSession = () => {
        if (activeOrder) {
            const updated = { ...activeOrder, status: OrderStatus.RATING_PENDING };
            setActiveOrder(updated);
            navigate('/avaliacao');
        }
    };

    const handleSubmitRating = async (rating: Rating) => {
        if (activeOrder) {
            const updated = { ...activeOrder, status: OrderStatus.COMPLETED };
            setActiveOrder(updated);
            if (isSupabaseConfigured()) {
                await supabase.from('reviews').insert({
                    order_id: activeOrder.id, lawyer_id: rating.lawyer_id,
                    user_id: activeOrder.user_id, stars: rating.stars, comment: rating.comment
                });
                await supabase.from('orders').update({ status: 'completed' }).eq('id', activeOrder.id);
            }
            navigate('/dashboard');
            setActiveOrder(null);
        }
    };

    const handleCompleteRegistration = async (registrationData: RegistrationData) => {
        const success = await registerUser(registrationData);
        if (success) navigate('/dashboard');
    };

    return (
        <>
            {showPaymentModal && pendingOrder && (
                <MpesaPaymentModal
                    amount={pendingOrder.pkg.price}
                    orderRef="FC-NEW"
                    onSuccess={handleFinalizeOrder}
                    onCancel={() => setShowPaymentModal(false)}
                />
            )}

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                    isAuthenticated ?
                        (isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />) :
                        <LandingPage />
                } />

                <Route path="/login" element={
                    isAuthenticated ?
                        (isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />) :
                        <LoginPage onRegisterClick={() => navigate('/registro')} />
                } />

                <Route path="/registro" element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> :
                        <QuickRegistration onComplete={handleCompleteRegistration} onBack={() => navigate('/login')} />
                } />

                <Route path="/registro-advogado" element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> :
                        <LawyerRegistrationWizard
                            onComplete={(data) => {
                                console.log('Lawyer registration data:', data);
                                navigate('/registro-advogado/sucesso');
                            }}
                            onBack={() => navigate('/login')}
                        />
                } />

                <Route path="/registro-advogado/sucesso" element={<LawyerRegistrationSuccess />} />

                <Route path="/portal-advogado" element={<LawyerPortal onBack={() => navigate('/login')} />} />

                {/* User Dashboard Routes with Layout */}
                <Route element={
                    <ProtectedRoute>
                        {!isAdmin ? <UserLayout /> : <Navigate to="/admin/dashboard" replace />}
                    </ProtectedRoute>
                }>
                    <Route path="dashboard" element={
                        <UserDashboard
                            onNewConsultation={() => navigate('/nova-consulta')}
                            onHistory={() => navigate('/historico')}
                            onFollowUp={() => navigate('/acompanhamento')}
                            orderHistory={orderHistory}
                        />
                    } />
                    <Route path="historico" element={
                        <HistoryView
                            orders={orderHistory}
                            onSelectOrder={(o) => { setActiveOrder(o); navigate('/verificar-estado'); }}
                            onBack={() => navigate('/dashboard')}
                        />
                    } />
                    <Route path="verificar-estado" element={
                        <StatusChecker
                            order={activeOrder}
                            onStartChat={handleStartChat}
                            onBack={() => navigate('/dashboard')}
                        />
                    } />
                    <Route path="perfil" element={<ProfileView />} />

                    <Route path="nova-consulta" element={
                        <div className="w-full py-6">
                            <Breadcrumbs />
                            <NewConsultationWizard onComplete={(t, p, type) => handleInitiateOrder(t, p, type)} onBack={() => navigate('/dashboard')} />
                        </div>
                    } />

                    <Route path="acompanhamento" element={
                        <div className="w-full py-6">
                            <Breadcrumbs />
                            <FollowUpWizard findOrder={findOrder} onComplete={(t, p, type, prevOrder) => handleInitiateOrder(t, p, type, prevOrder)} onBack={() => navigate('/dashboard')} />
                        </div>
                    } />

                    <Route path="chat" element={
                        <div className="w-full py-6 h-full flex flex-col">
                            <Breadcrumbs />
                            {activeOrder ? <ChatView order={activeOrder} onUpdateOrder={handleUpdateOrder} onEndSession={handleEndSession} /> : <Navigate to="/dashboard" replace />}
                        </div>
                    } />

                    <Route path="avaliacao" element={
                        <div className="max-w-2xl mx-auto py-6">
                            <Breadcrumbs />
                            {activeOrder ? <RatingView order={activeOrder} onSubmit={handleSubmitRating} /> : <Navigate to="/dashboard" replace />}
                        </div>
                    } />
                </Route>

                <Route path="/chamada-telefonica" element={
                    <ProtectedRoute>
                        {activeOrder ? <PhoneConsultationView order={activeOrder} onFinish={handleEndSession} /> : <Navigate to="/dashboard" replace />}
                    </ProtectedRoute>
                } />

                {/* Admin Routes with Layout */}
                <Route path="/admin" element={
                    <ProtectedRoute requireAdmin>
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="lawyers" element={<LawyerManagement />} />
                    <Route path="lawyer-applications" element={<LawyerApplications />} />
                    <Route path="cases" element={<CaseManagement />} />
                    <Route path="payments" element={<PaymentManagement />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="settings" element={<AdminSettings onBack={() => navigate('/admin/dashboard')} />} />
                </Route>

                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
            </Routes >
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
