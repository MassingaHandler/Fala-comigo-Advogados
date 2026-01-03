
import React from 'react';
import type { Lawyer, ServiceTopic, ConsultationPackage } from './types';
import { GavelIcon, UsersIcon, ShoppingCartIcon, HomeIcon, CarIcon, GiftIcon, QuestionMarkCircleIcon } from './components/ui/icons';

export const LAWYERS: Lawyer[] = [
  { lawyer_id: "1", nome: "Dra. Ana Silva", especialidade: "Trabalho", avatarUrl: "https://i.pravatar.cc/100?u=ana", rating: 4.8, totalReviews: 124 },
  { lawyer_id: "2", nome: "Dr. Carlos Mário", especialidade: "Família", avatarUrl: "https://i.pravatar.cc/100?u=carlos", rating: 4.9, totalReviews: 89 },
  { lawyer_id: "3", nome: "Dra. Judite Cossa", especialidade: "Terra/DUAT", avatarUrl: "https://i.pravatar.cc/100?u=judite", rating: 4.7, totalReviews: 56 },
  { lawyer_id: "4", nome: "Dr. Pedro Gomes", especialidade: "Consumo", avatarUrl: "https://i.pravatar.cc/100?u=pedro", rating: 4.5, totalReviews: 32 },
  { lawyer_id: "5", nome: "Dra. Sofia Santos", especialidade: "Outros", avatarUrl: "https://i.pravatar.cc/100?u=sofia", rating: 4.6, totalReviews: 45 },
];

export const TOPICS: ServiceTopic[] = [
  { id: "familia", name: "Família", icon: <UsersIcon className="w-8 h-8" /> },
  { id: "trabalho", name: "Trabalho", icon: <GavelIcon className="w-8 h-8" /> },
  { id: "consumo", name: "Consumo", icon: <ShoppingCartIcon className="w-8 h-8" /> },
  { id: "terra", name: "Terra/DUAT", icon: <HomeIcon className="w-8 h-8" /> },
  { id: "multas", name: "Multas", icon: <CarIcon className="w-8 h-8" /> },
  { id: "heranca", name: "Herança", icon: <GiftIcon className="w-8 h-8" /> },
  { id: "outros", name: "Outros", icon: <QuestionMarkCircleIcon className="w-8 h-8" /> },
];

export const PACKAGES: ConsultationPackage[] = [
  { id: "rapida", type: 'consultation', name: "Consulta Rápida", duration: 15, unit: 'minutes', price: 500, description: "Orientação expressa para dúvidas pontuais." },
  { id: "padrao", type: 'consultation', name: "Consulta Padrão", duration: 30, unit: 'minutes', price: 900, description: "Análise detalhada e parecer verbal." },
  { id: "aprofundada", type: 'consultation', name: "Consulta Aprofundada", duration: 60, unit: 'minutes', price: 1500, description: "Análise de documentos e estratégia legal." },
];

export const FOLLOW_UP_PACKAGES: ConsultationPackage[] = [
    { id: "abertura", type: 'follow_up', name: "Abertura de Processo", unit: 'fixed_fee', price: 5000, description: "Preparação e submissão inicial da peça processual." },
    { id: "acompanhamento-mensal", type: 'follow_up', name: "Retença Mensal", duration: 1, unit: 'monthly', price: 3500, description: "Acompanhamento contínuo de trâmites e diligências." },
    { id: "defesa", type: 'follow_up', name: "Defesa/Contestação", unit: 'fixed_fee', price: 7000, description: "Elaboração de defesa complexa em processo existente." },
    { id: "recurso", type: 'follow_up', name: "Recurso", unit: 'fixed_fee', price: 10000, description: "Interposição de recurso para instâncias superiores." },
];
