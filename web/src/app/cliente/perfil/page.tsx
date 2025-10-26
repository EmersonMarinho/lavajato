'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Phone, Star, LogOut, Edit, Settings, HelpCircle, Info, Shield, Bell, Camera } from 'lucide-react';
import Link from 'next/link';

export default function PerfilPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/cliente/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/cliente/login');
  };

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
        <div className="flex items-center gap-4">
          <Link href="/cliente" className="text-white hover:text-blue-100 transition-colors">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Meu Perfil</h2>
        </div>
      </div>

      <div className="px-6 md:px-12 py-8 -mt-6">
        {/* Profile Card Moderno */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            {/* Avatar Grande */}
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-5xl font-bold text-white">
                  {user?.nome?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                <Camera className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{user?.nome}</h3>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-4">
                <Phone className="h-5 w-5" />
                <p className="text-lg">{user?.telefone}</p>
              </div>
              <Link href="/cliente/perfil/editar">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto md:mx-0">
                  <Edit className="h-4 w-4" />
                  Editar Perfil
                </button>
              </Link>
            </div>
          </div>

          {/* Pontos de Fidelidade - Card Destacado */}
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <Star className="h-7 w-7 text-yellow-600 fill-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-yellow-900 font-semibold">Pontos de Fidelidade</p>
                  <p className="text-4xl font-bold text-white">{user?.pontos_fidelidade || 0}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-yellow-900 font-medium">Continue ganhando!</p>
                <p className="text-sm text-yellow-800">Troque por descontos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu de Opções */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link href="/cliente/perfil/editar" className="block">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all hover:scale-[1.02] h-full">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Edit className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Editar Informações</h4>
                  <p className="text-sm text-gray-600">Atualize seus dados pessoais</p>
                </div>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg hover:border-purple-200 transition-all hover:scale-[1.02] h-full cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg mb-1">Notificações</h4>
                <p className="text-sm text-gray-600">Gerencie suas preferências</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg hover:border-green-200 transition-all hover:scale-[1.02] h-full cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg mb-1">Privacidade</h4>
                <p className="text-sm text-gray-600">Segurança e dados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg hover:border-orange-200 transition-all hover:scale-[1.02] h-full cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <HelpCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg mb-1">Ajuda</h4>
                <p className="text-sm text-gray-600">Central de suporte</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sobre o App */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-3 rounded-xl">
              <Info className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-lg mb-1">Sobre o App</h4>
              <p className="text-sm text-gray-600">Versão 1.0.0 • Desenvolvido com ❤️</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white rounded-2xl py-4 flex items-center justify-center gap-3 font-semibold text-lg hover:bg-red-700 active:bg-red-800 transition-colors shadow-lg hover:shadow-xl touch-manipulation"
        >
          <LogOut className="h-6 w-6" />
          Sair da Conta
        </button>
      </div>
    </div>
  );
}

