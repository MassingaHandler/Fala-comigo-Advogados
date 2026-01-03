
import React, { useState, useRef, useEffect } from 'react';
import type { Order, ChatMessage, Document as DocType } from '../types';
import { ChevronLeftIcon, PaperclipIcon, SendIcon, DocumentTextIcon, VideoIcon, CheckCircleIcon } from './ui/icons';

interface Props {
  order: Order;
  onUpdateOrder: (order: Order) => void;
  onEndSession: () => void;
}

export default function ChatView({ order, onUpdateOrder, onEndSession }: Props) {
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const lawyer = order.assignment?.lawyer;
  const session = order.assignment?.session;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  if (!lawyer || !session) {
    return (
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center">
        <p>Ocorreu um erro ao carregar a sessão de chat.</p>
        <button onClick={onEndSession} className="mt-4 text-red-600 dark:text-red-400">Voltar</button>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: newMessage,
      timestamp: new Date(),
      type: 'text',
    };
    
    const updatedMessages = [...session.messages, userMessage];
    
    const updatedOrder: Order = {
        ...order,
        assignment: {
            ...order.assignment!,
            session: {
                ...session,
                messages: updatedMessages,
            }
        }
    };
    onUpdateOrder(updatedOrder);
    setNewMessage('');
  };
  
  const handleUploadDocument = () => {
      const filename = `documento_${Date.now()}.pdf`;
      const newDoc: DocType = {
        document_id: `doc-${Date.now()}`,
        filename: filename,
        url: `/uploads/${filename}`, // mock url
        uploadedAt: new Date(),
      };
      
      const docMessage: ChatMessage = {
          id: `msg-doc-${Date.now()}`,
          sender: 'user',
          text: `Carregou o documento: ${filename}`,
          timestamp: new Date(),
          type: 'document',
          document: newDoc,
      };

      const updatedOrder: Order = {
        ...order,
        assignment: {
            ...order.assignment!,
            session: {
                ...session,
                messages: [...session.messages, docMessage],
                documents: [...session.documents, newDoc],
            }
        }
    };
    onUpdateOrder(updatedOrder);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col h-[80vh] animate-fade-in">
      {/* Header */}
      <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg z-10">
        <button onClick={() => onUpdateOrder(order)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden">
            {/* Hidden back button, we want users to end via button */}
            <ChevronLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
        <img src={lawyer.avatarUrl} alt={lawyer.nome} className="w-10 h-10 rounded-full ml-1" />
        <div className="ml-3">
          <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200 flex items-center gap-1">
            {lawyer.nome}
            <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 rounded">★ {lawyer.rating}</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
             {order.order_id} • {order.topic.name}
          </p>
        </div>
        <div className="flex items-center ml-auto gap-3">
            <button 
                onClick={() => alert('Funcionalidade de chamada de vídeo em breve!')} 
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Iniciar chamada de vídeo"
            >
                <VideoIcon className="w-5 h-5 text-red-600 dark:text-red-500" />
            </button>
            <button 
                onClick={onEndSession}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors shadow-sm"
            >
                Concluir
            </button>
        </div>
      </header>

      {/* Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4">
          {session.messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'lawyer' && <img src={lawyer.avatarUrl} alt="lawyer" className="w-6 h-6 rounded-full self-start" />}
              <div className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${msg.sender === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-600'}`}>
                {msg.type === 'document' ? (
                    <div className="flex items-center gap-2">
                        <DocumentTextIcon className="w-8 h-8 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold">{msg.document?.filename}</p>
                            <a href="#" onClick={(e) => e.preventDefault()} className="text-xs underline opacity-80">Ver documento (simulado)</a>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                )}
                <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-red-100' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div ref={chatEndRef} />
      </div>

      {/* Input Footer */}
      <footer className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
        <div className="flex items-center gap-2">
          <button onClick={handleUploadDocument} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <PaperclipIcon className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite a sua mensagem..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors text-sm sm:text-base"
          />
          <button onClick={handleSendMessage} className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 transition-colors disabled:bg-gray-400" disabled={!newMessage.trim()}>
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
