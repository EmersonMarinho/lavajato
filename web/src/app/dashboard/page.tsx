'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import AuthGuard from '@/components/AuthGuard';
import { unitsAPI, servicesAPI, appointmentsAPI } from '@/services/api';
import { Unit, Service, Appointment } from '@/types';
import { Building2, Wrench, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { mockUnits, mockServices, mockAppointments } from '@/data/mockData';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalServices: 0,
    totalAppointments: 0,
    totalRevenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // MODO TESTE: Usar dados mock para testar o frontend
        const units = mockUnits;
        const services = mockServices;
        const appointments = mockAppointments;

        const totalRevenue = appointments.reduce((sum, apt) => sum + apt.preco_final, 0);
        
        setStats({
          totalUnits: units.length,
          totalServices: services.length,
          totalAppointments: appointments.length,
          totalRevenue,
        });

        // Agendamentos mais recentes
        const sortedAppointments = appointments
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setRecentAppointments(sortedAppointments);
        
        // Código original comentado para modo de produção:
        /*
        const [units, services, appointments] = await Promise.all([
          unitsAPI.getAll(),
          servicesAPI.getAll(),
          appointmentsAPI.getAll(),
        ]);

        const totalRevenue = appointments.reduce((sum, apt) => sum + apt.preco_final, 0);
        
        setStats({
          totalUnits: units.length,
          totalServices: services.length,
          totalAppointments: appointments.length,
          totalRevenue,
        });

        // Agendamentos mais recentes
        const sortedAppointments = appointments
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setRecentAppointments(sortedAppointments);
        */
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bem-vindo de volta, {user?.nome}! Aqui está um resumo do seu negócio.
          </p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total de Unidades</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalUnits}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Wrench className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total de Serviços</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalServices}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total de Agendamentos</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalAppointments}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Faturamento Total</dt>
                    <dd className="text-lg font-medium text-gray-900">{formatCurrency(stats.totalRevenue)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agendamentos recentes */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Agendamentos Recentes
            </h3>
            {recentAppointments.length > 0 ? (
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentAppointments.map((appointment) => (
                    <li key={appointment.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {appointment.user?.nome} - {appointment.car?.modelo}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.unit?.nome} • {formatDate(appointment.data)} • {appointment.hora}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(appointment.preco_final)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum agendamento encontrado.</p>
            )}
          </div>
        </div>

        {/* Gráfico de tendência */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Tendência de Faturamento
            </h3>
            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Gráfico de tendência em desenvolvimento</p>
              </div>
            </div>
          </div>
        </div>
      </div>
        </Layout>
      </AuthGuard>
    );
  };

export default Dashboard;
