
import React, { useState } from 'react';
import type { Order } from '../types';
import { ChevronLeftIcon, SearchIcon } from './ui/icons';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface Props {
  order: Order | null;
  onStartChat: () => void;
  onBack: () => void;
}

export default function StatusChecker({ order: initialOrder, onStartChat, onBack }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Display either the active order passed via props (from History/Creation) or the one found via search
  const activeOrder = initialOrder || searchedOrder;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    setSearchedOrder(null);

    try {
        if (isSupabaseConfigured()) {
            // Search by ID OR Phone
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .or(`human_id.eq.${searchTerm.trim()},client_phone.eq.${searchTerm.trim()}`)
                .limit(1)
                .single();

            if (data) {
                // Mock reconstruction of the object for display purposes
                // In a real app, we would join tables (packages, topics)
                const reconstructedOrder: any = {
                    ...data,
                    order_id: data.human_id,
                    topic: { name: 'Consulta Recuperada' }, // Placeholder
                    pkg: { name: 'Pacote Padrão', duration: 0 }, // Placeholder
                    assignment: { lawyer: { nome: 'Seu Advogado', avatarUrl: 'https://i.pravatar.cc/100' } }
                };
                setSearchedOrder(reconstructedOrder);
            } else {
                setError('Nenhum processo encontrado com este ID ou Telefone.');
            }
        } else {
            // Mock Search
            if (searchTerm === 'FC-123') {
                alert("Modo Demo: Encontrado (Simulação)");
            } else {
                setError('Modo Demo: Tente procurar "FC-123"');
            }
        }
    } catch (err) {
        setError('Erro ao buscar processo.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl animate-fade-in min-h-[400px]">
      <button onClick={onBack} className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors">
        <ChevronLeftIcon className="w-5 h-5 mr-1" />
        Voltar
      </button>
      
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">Estado da Consulta</h2>
      
      {/* Search Section - Only show if no order is pre-loaded */}
      {!initialOrder && (
        <div className="mb-8 border-b dark:border-gray-700 pb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="ID do Processo ou Nº Telefone" 
                    className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" disabled={loading} className="bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700">
                    <SearchIcon className="w-5 h-5" />
                </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      )}

      {activeOrder ? (
        <div className="space-y-4 text-left animate-fade-in">
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
             <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">ID do Pedido:</span>
                <span className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-200">{activeOrder.order_id}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Tema:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{activeOrder.topic?.name || 'Geral'}</span>
            </div>
            {activeOrder.pkg && (
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Pacote:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{activeOrder.pkg.name}</span>
                </div>
            )}
             <hr className="border-gray-200 dark:border-gray-600"/>
            <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 font-bold">Estado:</span>
                <span className="font-bold text-red-600 dark:text-red-400 uppercase text-sm">{activeOrder.status}</span>
            </div>
             {activeOrder.assignment?.lawyer && (
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-400">Advogado(a):</span>
                    <div className="flex items-center gap-2">
                         <img src={activeOrder.assignment.lawyer.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full" />
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{activeOrder.assignment.lawyer.nome}</span>
                    </div>
                </div>
            )}
          </div>
          
          <button
            onClick={onStartChat}
            className="w-full mt-6 bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 transition-all duration-300"
          >
            Abrir Detalhes / Conversa
          </button>
        </div>
      ) : (
        !initialOrder && (
            <div className="text-center py-8">
                <p className="text-gray-400">Insira o código ou telefone acima para localizar.</p>
            </div>
        )
      )}
    </div>
  );
}
