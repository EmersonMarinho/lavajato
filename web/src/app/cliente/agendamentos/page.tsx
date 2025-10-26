'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AgendamentosPage() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('TODOS');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/cliente/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadAppointments = async () => {
      if (!user || !token) return;
      
      try {
        const response = await fetch('http://localhost:3001/appointments/my-appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Agendamentos retornados pelo backend:', data);
          // Adaptar dados do backend para o formato esperado
          const adaptedData = data.map((apt: any) => ({
            id: apt.id,
            data: apt.data,
            hora: apt.hora,
            status: apt.status,
            carro: `${apt.car?.modelo || 'N/A'} - ${apt.car?.placa || 'N/A'}`,
            unidade: apt.unit?.nome || 'N/A',
            preco: apt.preco_final || 0
          }));
          setAppointments(adaptedData);
        }
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    loadAppointments();
  }, [user, token]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADO':
        return 'bg-yellow-100 text-yellow-800';
      case 'EM_ANDAMENTO':
        return 'bg-blue-100 text-blue-800';
      case 'FINALIZADO':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AGENDADO':
        return <Calendar className="h-4 w-4" />;
      case 'EM_ANDAMENTO':
        return <Clock className="h-4 w-4" />;
      case 'FINALIZADO':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 md:px-12 pt-8 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/cliente" className="text-white hover:text-blue-100 transition-colors">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Meus Agendamentos</h2>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {['TODOS', 'AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO'].map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {loadingAppointments ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando agendamentos...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Você ainda não tem agendamentos</p>
            <Link href="/cliente/agendar" className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Agendar Serviço
            </Link>
          </div>
        ) : (
          appointments.map(apt => (
          <div key={apt.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-lg ${
                  apt.status === 'AGENDADO' ? 'bg-yellow-100 text-yellow-600' :
                  apt.status === 'EM_ANDAMENTO' ? 'bg-blue-100 text-blue-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {getStatusIcon(apt.status)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                  {apt.status}
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                R$ {apt.preco.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(apt.data).toLocaleDateString('pt-BR')} às {apt.hora}</span>
              </div>
              <p className="text-gray-900">{apt.carro}</p>
              <p className="text-gray-500">{apt.unidade}</p>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}

