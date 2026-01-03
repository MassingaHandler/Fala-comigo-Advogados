
import React, { useState } from 'react';
import type { Order, ConsultationPackage, ConsultationType, ServiceTopic } from '../types';
import { FOLLOW_UP_PACKAGES } from '../constants';
import { ChevronLeftIcon, CheckCircleIcon, VideoIcon, ScaleIcon } from './ui/icons';

interface Props {
  findOrder: (id: string) => Order | undefined;
  onComplete: (topic: ServiceTopic, pkg: ConsultationPackage, type: ConsultationType, previousOrder: Order) => void;
  onBack: () => void;
}

// Phone Icon locally defined
const PhoneIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

export default function FollowUpWizard({ findOrder, onComplete, onBack }: Props) {
  const [step, setStep] = useState<'id_input' | 'package' | 'terms' | 'confirm'>('id_input');
  const [orderId, setOrderId] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<ConsultationPackage | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleIdSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const order = findOrder(orderId.trim());
      if (order) {
          if (!order.assignment) {
              setError('Esta consulta ainda não tem um advogado atribuído.');
              return;
          }
          setFoundOrder(order);
          setStep('package');
          setError('');
      } else {
          setError('ID de consulta não encontrado. Verifique o código e tente novamente.');
      }
  };

  const handleConfirm = () => {
    if (foundOrder && selectedPackage && termsAccepted) {
      // Default to digital for follow ups unless specified otherwise, but logic remains same
      onComplete(foundOrder.topic, selectedPackage, foundOrder.consultationType, foundOrder); 
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'id_input':
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-semibold text-center mb-2 text-gray-800 dark:text-gray-200">
              Seguimento de Processo
            </h3>
            <p className="text-center text-gray-600 mb-6 text-sm">Insira o ID da sua consulta anterior para vincularmos ao seu advogado.</p>
            
            <form onSubmit={handleIdSubmit} className="max-w-sm mx-auto">
                <input 
                    type="text" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Ex: FC-123456"
                    className="w-full p-4 text-center text-xl tracking-widest border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none uppercase mb-4 dark:bg-gray-700 dark:border-gray-600"
                />
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <button type="submit" className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition-colors">
                    Validar ID
                </button>
            </form>
            <p className="text-xs text-gray-400 text-center mt-4">
                Nota: Para teste, crie uma consulta nova primeiro, copie o ID do resumo e volte aqui.
            </p>
          </div>
        );

      case 'package':
        return (
          <div className="animate-fade-in">
            <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg mb-6 border border-green-200 dark:border-green-900">
                <p className="text-sm text-gray-600 dark:text-gray-300">Advogado Vinculado:</p>
                <div className="flex items-center gap-3 mt-2">
                     <img src={foundOrder?.assignment?.lawyer.avatarUrl} className="w-10 h-10 rounded-full" alt="Lawyer" />
                     <div>
                        <p className="font-bold text-gray-800 dark:text-white">{foundOrder?.assignment?.lawyer.nome}</p>
                        <p className="text-xs text-gray-500">{foundOrder?.topic.name}</p>
                     </div>
                </div>
            </div>

            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
              Escolha o plano de acompanhamento
            </h3>
            <div className="space-y-4">
              {FOLLOW_UP_PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => { setSelectedPackage(pkg); setStep('terms'); }}
                  className="w-full text-left p-5 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-all border border-transparent hover:border-red-200 dark:hover:border-red-900 group"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 group-hover:text-red-600">
                      {pkg.name}
                    </h4>
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm font-bold whitespace-nowrap">
                      {pkg.price} MZN
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">
                    {pkg.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );
    
      case 'terms':
          return (
            <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">Termos e Condições</h3>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg h-48 overflow-y-auto text-sm text-gray-600 dark:text-gray-300 mb-6 border border-gray-200 dark:border-gray-600">
                    <p className="mb-2"><strong>1. Vinculação:</strong> Ao prosseguir, confirma a contratação do advogado {foundOrder?.assignment?.lawyer.nome} para a fase processual selecionada.</p>
                    <p className="mb-2"><strong>2. Pagamento:</strong> O valor de {selectedPackage?.price} MZN refere-se aos honorários iniciais. Custas judiciais podem ser cobradas à parte.</p>
                    <p className="mb-2"><strong>3. Responsabilidade:</strong> O advogado compromete-se a agir com diligência e zelo, não garantindo, contudo, o resultado da causa.</p>
                    <p><strong>4. Confidencialidade:</strong> Todas as informações trocadas são protegidas pelo sigilo profissional.</p>
                </div>

                <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input 
                        type="checkbox" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500" 
                    />
                    <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">
                        Li e aceito os Termos de Serviço e a Tabela de Honorários apresentada.
                    </span>
                </label>

                <button 
                    disabled={!termsAccepted}
                    onClick={() => setStep('confirm')}
                    className="w-full mt-6 bg-red-600 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-colors"
                >
                    Continuar para Pagamento
                </button>
            </div>
          );

      case 'confirm':
        if (!foundOrder || !selectedPackage) return null;
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
              Confirmar Acompanhamento
            </h3>
            <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-500 space-y-4">
                <div className="flex justify-between border-b dark:border-gray-600 pb-2">
                    <span className="text-gray-500">Ref. Processo:</span>
                    <span className="font-mono font-bold">{foundOrder.order_id}</span>
                </div>
                 <div className="flex justify-between border-b dark:border-gray-600 pb-2">
                    <span className="text-gray-500">Advogado:</span>
                    <span className="font-bold">{foundOrder.assignment?.lawyer.nome}</span>
                </div>
                <div className="flex justify-between border-b dark:border-gray-600 pb-2">
                    <span className="text-gray-500">Serviço:</span>
                    <span className="font-bold text-right">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between pt-2">
                    <span className="text-gray-800 dark:text-white font-bold text-lg">Total:</span>
                    <span className="text-red-600 font-bold text-2xl">{selectedPackage.price} MZN</span>
                </div>
            </div>
            <button 
              onClick={handleConfirm} 
              className="w-full mt-8 bg-green-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-700 shadow-lg transform hover:-translate-y-1 transition-all"
            >
              Pagar e Iniciar Processo
            </button>
          </div>
        );
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg mx-auto relative">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack} 
          className="flex items-center text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Voltar
        </button>
      </div>
      {renderStep()}
    </div>
  );
}
