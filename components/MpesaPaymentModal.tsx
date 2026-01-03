
import React, { useState, useEffect } from 'react';
import { SmartphoneIcon, CheckCircleIcon } from './ui/icons';
import { initiateMpesaPayment, waitForMpesaConfirmation } from '../lib/mpesaService';

interface Props {
    amount: number;
    orderRef: string;
    onSuccess: (transactionId: string, phoneNumber: string) => void;
    onCancel: () => void;
}

export default function MpesaPaymentModal({ amount, orderRef, onSuccess, onCancel }: Props) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [status, setStatus] = useState<'idle' | 'processing' | 'waiting_pin' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('processing');
        setErrorMsg('');

        try {
            // 1. Iniciar Pagamento (C2B)
            const response = await initiateMpesaPayment({
                phoneNumber: phoneNumber,
                amount: amount,
                reference: orderRef
            });

            if (response.success && response.transactionId) {
                setStatus('waiting_pin');
                
                // 2. Aguardar Confirmação (Simulação de Webhook/Polling)
                const confirmed = await waitForMpesaConfirmation(response.transactionId);
                
                if (confirmed) {
                    setStatus('success');
                    setTimeout(() => {
                        // Pass both Transaction ID and Phone Number back to App
                        onSuccess(response.transactionId!, phoneNumber);
                    }, 1500);
                } else {
                    throw new Error("Tempo de espera excedido ou pagamento cancelado.");
                }
            } else {
                throw new Error(response.message || "Falha ao iniciar pagamento.");
            }
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.message || "Erro de conexão com o M-Pesa.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                
                {/* Header com Logo M-Pesa Mock */}
                <div className="bg-red-600 p-6 text-center text-white relative">
                    <button onClick={onCancel} className="absolute top-4 right-4 text-white/80 hover:text-white font-bold text-xl">
                        &times;
                    </button>
                    <h2 className="text-2xl font-bold mb-1">M-Pesa</h2>
                    <p className="text-red-100 text-sm">Pagamento Seguro Vodacom</p>
                </div>

                <div className="p-8">
                    {status === 'success' ? (
                        <div className="text-center py-6 animate-scale-in">
                            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Pagamento Recebido!</h3>
                            <p className="text-gray-500">Redirecionando...</p>
                        </div>
                    ) : status === 'waiting_pin' ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-6"></div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Consulte o seu telemóvel</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Enviamos um pedido de pagamento para <strong>{phoneNumber}</strong>.
                            </p>
                            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200 animate-pulse">
                                    Introduza o seu PIN do M-Pesa para confirmar.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide mb-1">Total a Pagar</p>
                                <p className="text-3xl font-extrabold text-gray-800 dark:text-white">{amount},00 MT</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Número de Telemóvel (Vodacom)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <SmartphoneIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="84 123 4567"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 outline-none transition-all text-lg"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Introduza o número associado à conta M-Pesa.
                                    </p>
                                </div>

                                {errorMsg && (
                                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">
                                        {errorMsg}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'processing'}
                                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center"
                                >
                                    {status === 'processing' ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Processando...
                                        </span>
                                    ) : (
                                        "Pagar com M-Pesa"
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
