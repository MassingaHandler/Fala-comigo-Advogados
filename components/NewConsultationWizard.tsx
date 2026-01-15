
import React, { useState, useEffect } from 'react';
import type { ServiceTopic, ConsultationPackage, ConsultationType, Lawyer } from '../types';
import { TOPICS, PACKAGES } from '../constants';
import { ChevronLeftIcon, CheckCircleIcon, VideoIcon, ScaleIcon, StarIcon, UserIcon } from './ui/icons';
import LawyerSelection from './LawyerSelection';

interface Props {
  onComplete: (topic: ServiceTopic, pkg: ConsultationPackage, type: ConsultationType) => void;
  onBack: () => void;
}

type Step = 'topic' | 'lawyer' | 'package' | 'method' | 'confirm';

const steps: { id: Step; label: string; number: number }[] = [
  { id: 'topic', label: 'Tema', number: 1 },
  { id: 'lawyer', label: 'Advogado', number: 2 },
  { id: 'package', label: 'Pacote', number: 3 },
  { id: 'method', label: 'Método', number: 4 },
  { id: 'confirm', label: 'Confirmar', number: 5 },
];

// Phone Icon locally defined for specific use here
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

export default function NewConsultationWizard({ onComplete, onBack }: Props) {
  const [step, setStep] = useState<Step>('topic');
  const [selectedTopic, setSelectedTopic] = useState<ServiceTopic | null>(null);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | 'auto' | null>(null);
  const [availableLawyers, setAvailableLawyers] = useState<Lawyer[]>([]);
  const [loadingLawyers, setLoadingLawyers] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<ConsultationPackage | null>(null);
  const [selectedType, setSelectedType] = useState<ConsultationType | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation on step change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [step]);

  const handleSelectTopic = async (topic: ServiceTopic) => {
    setSelectedTopic(topic);
    setStep('lawyer');

    // Buscar advogados disponíveis
    setLoadingLawyers(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/lawyers?specialty=${encodeURIComponent(topic.name)}`);
      const data = await response.json();
      if (data.success) {
        setAvailableLawyers(data.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar advogados:', error);
      setAvailableLawyers([]);
    } finally {
      setLoadingLawyers(false);
    }
  };

  const handleSelectLawyer = (lawyer: Lawyer | 'auto') => {
    setSelectedLawyer(lawyer);
    setStep('package');
  };

  const handleSelectPackage = (pkg: ConsultationPackage) => {
    setSelectedPackage(pkg);
    setStep('method');
  };

  const handleSelectType = (type: ConsultationType) => {
    setSelectedType(type);
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (selectedTopic && selectedPackage && selectedType) {
      try {
        // Obter dados do usuário do localStorage
        const userStr = localStorage.getItem('fala_comigo_user');
        const token = localStorage.getItem('fala_comigo_token');

        if (!userStr || !token) {
          alert('Você precisa estar logado para criar uma consulta');
          return;
        }

        const user = JSON.parse(userStr);

        // Preparar dados da consulta
        const consultationData = {
          user_id: user.id,
          topic: {
            id: selectedTopic.id,
            name: selectedTopic.name
          },
          pkg: {
            id: selectedPackage.id,
            name: selectedPackage.name,
            price: selectedPackage.price,
            duration: selectedPackage.duration,
            unit: selectedPackage.unit
          },
          consultationType: selectedType,
          clientPhoneNumber: user.phoneNumber || '+258 84 000 0000',
          selectedLawyerId: selectedLawyer === 'auto' ? 'auto' : (selectedLawyer as Lawyer)?.lawyer_id || 'auto'
        };

        // Chamar API
        const response = await fetch('http://localhost:8000/api/v1/consultations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(consultationData)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.detail || 'Erro ao criar consulta');
        }

        // Sucesso! Chamar onComplete
        onComplete(selectedTopic, selectedPackage, selectedType);

      } catch (error: any) {
        console.error('Erro ao criar consulta:', error);
        alert(error.message || 'Erro ao criar consulta. Tente novamente.');
      }
    }
  };

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('method');
    } else if (step === 'method') {
      setStep('package');
    } else if (step === 'package') {
      setStep('lawyer');
    } else if (step === 'lawyer') {
      setStep('topic');
    } else {
      onBack();
    }
  };

  const getStepStatus = (stepId: Step) => {
    const stepOrder: Step[] = ['topic', 'lawyer', 'package', 'method', 'confirm'];
    const currentIndex = stepOrder.indexOf(step);
    const stepIndex = stepOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between relative px-2">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 rounded-full" />

        {steps.map((s) => {
          const status = getStepStatus(s.id);
          let circleClass = "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-4 ";
          let textClass = "absolute -bottom-6 text-xs font-medium transition-colors duration-300 ";

          if (status === 'completed') {
            circleClass += "bg-green-500 border-green-500 text-white scale-110";
            textClass += "text-green-600 dark:text-green-400";
          } else if (status === 'active') {
            circleClass += "bg-red-600 border-red-200 dark:border-red-900 text-white scale-125 shadow-lg";
            textClass += "text-red-600 dark:text-red-400 font-bold";
          } else {
            circleClass += "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500";
            textClass += "text-gray-400 dark:text-gray-500";
          }

          return (
            <div key={s.id} className="flex flex-col items-center relative group cursor-default">
              <div className={circleClass}>
                {status === 'completed' ? <CheckCircleIcon className="w-6 h-6" /> : s.number}
              </div>
              <span className={textClass}>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep = () => {
    const animationClass = isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0";

    switch (step) {
      case 'topic':
        return (
          <div className={`transition-all duration-500 ease-out transform ${animationClass}`}>
            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
              Qual é o tema da sua consulta?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className="group flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md hover:bg-red-50 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-red-200 dark:hover:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <span className="text-red-500 dark:text-red-400 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                    {topic.icon}
                  </span>
                  <span className="font-semibold text-center text-sm text-gray-700 dark:text-gray-300 group-hover:text-red-700 dark:group-hover:text-red-300">
                    {topic.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'package':
        return (
          <div className={`transition-all duration-500 ease-out transform ${animationClass}`}>
            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
              Escolha o plano ideal para si
            </h3>
            <div className="space-y-4">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg)}
                  className="w-full text-left p-5 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-red-200 dark:hover:border-red-900 group focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {pkg.name} <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">({pkg.duration} {pkg.unit === 'minutes' ? 'min' : (pkg.duration > 1 ? 'meses' : 'mês')})</span>
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
      case 'method':
        return (
          <div className={`transition-all duration-500 ease-out transform ${animationClass}`}>
            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
              Como prefere ser atendido?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                onClick={() => handleSelectType('digital')}
                className="group p-8 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-red-500 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="p-4 bg-red-100 dark:bg-red-900 rounded-full text-red-600 dark:text-red-400 mb-4 group-hover:scale-110 transition-transform">
                  <VideoIcon className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">Digital (Chat & Vídeo)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Converse por chat ou vídeo diretamente na plataforma. Inclui envio de documentos.
                </p>
              </button>

              <button
                onClick={() => handleSelectType('phone')}
                className="group p-8 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-blue-500 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  <PhoneIcon className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">Chamada Telefónica</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Receba o número direto do advogado e ligue através da sua rede móvel.
                </p>
              </button>
            </div>
          </div>
        );
      case 'confirm':
        if (!selectedTopic || !selectedPackage || !selectedType) return null;
        return (
          <div className={`transition-all duration-500 ease-out transform ${animationClass}`}>
            <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
              Resumo do Pedido
            </h3>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-inner border border-gray-200 dark:border-gray-500 space-y-6">

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full text-red-600 dark:text-red-400">
                  {selectedTopic.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Tema Selecionado</p>
                  <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{selectedTopic.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400 font-bold text-xl w-12 h-12 flex items-center justify-center">
                  M
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Pacote Escolhido</p>
                  <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{selectedPackage.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedPackage.duration} {selectedPackage.unit === 'minutes' ? 'minutos' : (selectedPackage.duration > 1 ? 'meses' : 'mês')}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-400">
                  {selectedType === 'digital' ? <VideoIcon className="w-6 h-6" /> : <PhoneIcon className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Tipo de Atendimento</p>
                  <p className="font-bold text-lg text-gray-800 dark:text-gray-200">
                    {selectedType === 'digital' ? 'Digital (Chat/Video)' : 'Chamada Telefónica'}
                  </p>
                </div>
              </div>

              <hr className="border-gray-300 dark:border-gray-500 border-dashed" />

              <div className="flex justify-between items-end">
                <span className="text-gray-600 dark:text-gray-400 font-bold">Total Estimado:</span>
                <span className="text-3xl font-extrabold text-red-600 dark:text-red-400">{selectedPackage.price} <span className="text-base font-normal text-gray-500">MZN</span></span>
              </div>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full mt-8 bg-red-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
            >
              Confirmar e Pagar
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl animate-fade-in overflow-hidden relative">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="group flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <div className="p-1 rounded-full group-hover:bg-red-50 dark:group-hover:bg-gray-700 transition-colors mr-1">
            <ChevronLeftIcon className="w-5 h-5" />
          </div>
          Voltar
        </button>
        {step !== 'topic' && (
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Passo {steps.find(s => s.id === step)?.number} de 4
          </span>
        )}
      </div>

      {renderProgressBar()}

      <div className="mt-4">
        {renderStep()}
      </div>
    </div>
  );
}
