import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LawyerRegistrationSuccess() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Registro Submetido com Sucesso!
                </h1>

                {/* Message */}
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Obrigado por se registrar na plataforma <span className="font-bold text-indigo-600 dark:text-indigo-400">Fala Comigo Advogado</span>.
                </p>

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8 text-left">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Próximos Passos
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-3">
                            <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">1.</span>
                            <span>Nossa equipe irá <strong>verificar seus documentos e credenciais</strong> junto à Ordem dos Advogados de Moçambique (OAM).</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">2.</span>
                            <span>Você receberá um <strong>email de confirmação</strong> no endereço fornecido com o status da verificação.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">3.</span>
                            <span>Após aprovação, você poderá <strong>acessar sua conta</strong> e começar a atender clientes na plataforma.</span>
                        </li>
                    </ul>
                </div>

                {/* Timeline */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 mb-8">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
                        ⏱️ Tempo Estimado de Verificação
                    </h3>
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                        2-3 dias úteis
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Em casos urgentes, entre em contato conosco
                    </p>
                </div>

                {/* Contact Info */}
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                    <p className="mb-2">Dúvidas ou problemas?</p>
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                        📧 suporte@falacomigo.mz | 📞 +258 84 000 0000
                    </p>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => navigate('/')}
                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    Voltar ao Início
                </button>
            </div>
        </div>
    );
}
