'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Calendar, Car, Clock, Star, Plus, List, Settings, Bell, Phone, Gift, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ClienteHome() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/cliente/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 md:px-12 pt-8 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-blue-600">
                {user?.nome?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{user?.nome || 'Usuário'}</h1>
              <p className="text-blue-100 text-sm md:text-base">Bem-vindo de volta!</p>
            </div>
          </div>
          <Link href="/cliente/perfil" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all hover:scale-110">
            <Settings className="h-6 w-6 text-white" />
          </Link>
        </div>
      </div>

      <div className="px-6 md:px-12 py-8 md:py-12">
        {/* Grid Principal - Desktop mostra tudo lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Coluna 1 - Pontos e Stats */}
          <div className="lg:col-span-4 space-y-6">
            {/* Pontos */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-5 mb-5">
                <div className="bg-white p-5 rounded-xl shadow-md">
                  <Star className="h-10 w-10 text-yellow-600 fill-yellow-600" />
                </div>
                <div>
                  <p className="text-base text-yellow-900 font-semibold">Pontos de Fidelidade</p>
                  <p className="text-5xl font-bold text-white">{user?.pontos_fidelidade || 0}</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-yellow-900 text-sm font-medium">
                💰 Economize pontos para ganhar descontos
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-8">
              <p className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span>📊</span> Resumo
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Car className="h-6 w-6 text-blue-600" />
                    <span className="text-base font-semibold text-gray-700">Veículos</span>
                  </div>
                  <span className="text-3xl font-bold text-blue-600">2</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-6 w-6 text-purple-600" />
                    <span className="text-base font-semibold text-gray-700">Agendamentos</span>
                  </div>
                  <span className="text-3xl font-bold text-purple-600">5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2 - Ações Rápidas */}
          <div className="lg:col-span-8 space-y-6">
            {/* Botão Principal */}
            <Link href="/cliente/agendar" className="block">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.01] border-2 border-blue-400">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-lg text-blue-100 font-medium mb-2">🔥 Agendar Serviço</p>
                    <h3 className="text-4xl font-bold text-white mb-3">Novo Agendamento</h3>
                    <p className="text-blue-100 text-base">Escolha data, horário e serviço desejado</p>
                  </div>
                  <div className="bg-white p-5 rounded-full shadow-lg">
                    <Plus className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-blue-100 text-lg font-medium">
                  <span>Clique para começar</span>
                  <span className="text-3xl">→</span>
                </div>
              </div>
            </Link>

            {/* Cards de Acesso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/cliente/carros" className="block">
                <div className="bg-white rounded-2xl shadow-md border-2 border-blue-200 p-8 hover:shadow-lg hover:border-blue-400 transition-all hover:scale-[1.02] h-full">
                  <div className="flex items-start gap-5 mb-4">
                    <div className="bg-blue-500 p-4 rounded-xl shadow-sm">
                      <Car className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-xl mb-2">Meus Carros</h3>
                      <p className="text-base text-gray-600">Gerencie seus veículos</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Car className="h-5 w-5" />
                      <span className="text-base font-semibold">2 cadastrados</span>
                    </div>
                    <span className="text-blue-500 text-3xl font-bold">›</span>
                  </div>
                </div>
              </Link>

              <Link href="/cliente/agendamentos" className="block">
                <div className="bg-white rounded-2xl shadow-md border-2 border-purple-200 p-8 hover:shadow-lg hover:border-purple-400 transition-all hover:scale-[1.02] h-full">
                  <div className="flex items-start gap-5 mb-4">
                    <div className="bg-purple-500 p-4 rounded-xl shadow-sm">
                      <List className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-xl mb-2">Agendamentos</h3>
                      <p className="text-base text-gray-600">Histórico completo</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-600">
                      <Calendar className="h-5 w-5" />
                      <span className="text-base font-semibold">5 registros</span>
                    </div>
                    <span className="text-purple-500 text-3xl font-bold">›</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Seção de Notificações e Promoções */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Próximo Agendamento */}
          <div className="lg:col-span-2 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-lg p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Próximo Agendamento</h3>
                <p className="text-green-100 text-sm">Seu agendamento mais próximo</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-green-100 mb-1">Data e Hora</p>
                  <p className="text-2xl font-bold">15/11 - 14:00</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-100 mb-1">Veículo</p>
                  <p className="text-lg font-semibold">Honda Civic</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  Lavagem Completa
                </div>
                <Link href="/cliente/agendamentos" className="ml-auto flex items-center gap-2 text-white hover:text-green-100 transition-colors">
                  <span className="text-sm font-medium">Ver detalhes</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Notificações */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Notificações</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm font-semibold text-blue-900 mb-1">🎉 Promoção Especial</p>
                <p className="text-xs text-blue-700">20% OFF em serviços até sexta!</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm font-semibold text-green-900 mb-1">✅ Pontos disponíveis</p>
                <p className="text-xs text-green-700">Troque seus pontos por descontos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cupons e Contato Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cupons */}
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl shadow-lg p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Cupons Disponíveis</h3>
                <p className="text-pink-100 text-sm">Você tem cupons ativos</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-pink-100 mb-1">Desconto</p>
                    <p className="text-2xl font-bold">15% OFF</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-pink-100">Válido até</p>
                    <p className="text-sm font-semibold">30/11</p>
                  </div>
                </div>
              </div>
              <button className="w-full bg-white text-purple-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Ver todos os cupons
              </button>
            </div>
          </div>

          {/* Contato Rápido */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-5">Contato Rápido</h3>
            <div className="space-y-4">
              <a 
                href="https://wa.me/5511999999999" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
              >
                <div className="bg-green-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-600">Fale conosco agora</p>
                </div>
                <ArrowRight className="h-5 w-5 text-green-600" />
              </a>
              <a 
                href="tel:+5511999999999" 
                className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
              >
                <div className="bg-blue-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Telefone</p>
                  <p className="text-sm text-gray-600">(11) 99999-9999</p>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-around items-center h-16 px-2">
          <Link href="/cliente" className="flex flex-col items-center justify-center flex-1 h-full text-gray-900">
            <Clock className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Início</span>
          </Link>
          <Link href="/cliente/agendamentos" className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 hover:text-gray-900 transition-colors">
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs">Agendamentos</span>
          </Link>
          <Link href="/cliente/carros" className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 hover:text-gray-900 transition-colors">
            <Car className="h-5 w-5 mb-1" />
            <span className="text-xs">Carros</span>
          </Link>
          <Link href="/cliente/perfil" className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 hover:text-gray-900 transition-colors">
            <Settings className="h-5 w-5 mb-1" />
            <span className="text-xs">Perfil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

