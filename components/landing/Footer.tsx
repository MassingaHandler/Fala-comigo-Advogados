import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { MozambiqueFlagIcon } from '../ui/icons';

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="container-responsive py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <MozambiqueFlagIcon className="w-10 h-10" />
                            <div>
                                <h3 className="text-2xl font-bold text-white">Fala Comigo</h3>
                                <p className="text-sm text-gray-400">Advocacia Digital</p>
                            </div>
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Conectando moçambicanos a advogados verificados. Atendimento jurídico rápido, seguro e acessível.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Links Rápidos</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#sobre" className="hover:text-red-500 transition-colors">Sobre Nós</a>
                            </li>
                            <li>
                                <a href="#como-funciona" className="hover:text-red-500 transition-colors">Como Funciona</a>
                            </li>
                            <li>
                                <a href="#precos" className="hover:text-red-500 transition-colors">Planos e Preços</a>
                            </li>
                            <li>
                                <a href="#testemunhos" className="hover:text-red-500 transition-colors">Testemunhos</a>
                            </li>
                            <li>
                                <a href="#faq" className="hover:text-red-500 transition-colors">FAQ</a>
                            </li>
                            <li>
                                <button onClick={() => navigate('/registro')} className="hover:text-red-500 transition-colors">
                                    Criar Conta
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* For Lawyers */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Para Advogados</h4>
                        <ul className="space-y-3">
                            <li>
                                <button onClick={() => navigate('/portal-advogado')} className="hover:text-red-500 transition-colors">
                                    Portal do Advogado
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate('/registro-advogado')} className="hover:text-red-500 transition-colors">
                                    Registar como Advogado
                                </button>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">Benefícios</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">Requisitos</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">Código de Ética</a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Contacto</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                                <span>Av. Julius Nyerere, 1234<br />Maputo, Moçambique</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <a href="tel:+258840000000" className="hover:text-red-500 transition-colors">
                                    +258 84 000 0000
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <a href="mailto:info@falacomigo.mz" className="hover:text-red-500 transition-colors">
                                    info@falacomigo.mz
                                </a>
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <div className="mt-6">
                            <h5 className="text-white font-semibold mb-3">Newsletter</h5>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Seu email"
                                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                                />
                                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                                    <Mail className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container-responsive py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400">
                            © 2024 Fala Comigo. Todos os direitos reservados.
                        </p>
                        <div className="flex flex-wrap gap-6 text-sm">
                            <a href="#" className="hover:text-red-500 transition-colors">Termos de Serviço</a>
                            <a href="#" className="hover:text-red-500 transition-colors">Política de Privacidade</a>
                            <a href="#" className="hover:text-red-500 transition-colors">Cookies</a>
                            <a href="#" className="hover:text-red-500 transition-colors">LGPD</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
