'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import AuthGuard from '@/components/AuthGuard';
import { appointmentsAPI, servicesAPI, unitsAPI } from '@/services/api';
import { Appointment, Service, Unit } from '@/types';
import { mockAppointments, mockServices, mockUnits } from '@/data/mockData';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Building2, 
  Wrench,
  Download,
  Filter
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
    endDate: new Date().toISOString().split('T')[0], // Today
  });

  useEffect(() => {
    fetchData();
  }, [dateFilter]);

  const fetchData = async () => {
    try {
      // MODO TESTE: Usar dados mock para testar o frontend
      setAppointments(mockAppointments);
      setServices(mockServices);
      setUnits(mockUnits);
      
      // Código original comentado para modo de produção:
      /*
      const [appointmentsData, servicesData, unitsData] = await Promise.all([
        appointmentsAPI.getAll(),
        servicesAPI.getAll(),
        unitsAPI.getAll(),
      ]);

      setAppointments(appointmentsData);
      setServices(servicesData);
      setUnits(unitsData);
      */
    } catch (error) {
      console.error('Erro ao carregar dados para relatórios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Filtrar agendamentos por período
  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.data);
    const startDate = new Date(dateFilter.startDate);
    const endDate = new Date(dateFilter.endDate);
    return aptDate >= startDate && aptDate <= endDate;
  });

  // Estatísticas de faturamento
  const revenueStats = {
    total: filteredAppointments.reduce((sum, apt) => sum + apt.preco_final, 0),
    byStatus: {
      AGENDADO: filteredAppointments.filter(apt => apt.status === 'AGENDADO').reduce((sum, apt) => sum + apt.preco_final, 0),
      EM_ANDAMENTO: filteredAppointments.filter(apt => apt.status === 'EM_ANDAMENTO').reduce((sum, apt) => sum + apt.preco_final, 0),
      FINALIZADO: filteredAppointments.filter(apt => apt.status === 'FINALIZADO').reduce((sum, apt) => sum + apt.preco_final, 0),
    },
    byUnit: units.map(unit => ({
      nome: unit.nome,
      total: filteredAppointments
        .filter(apt => apt.unit?.id === unit.id)
        .reduce((sum, apt) => sum + apt.preco_final, 0),
      count: filteredAppointments.filter(apt => apt.unit?.id === unit.id).length,
    })),
  };

  // Estatísticas de serviços
  const serviceStats = {
    total: filteredAppointments.length,
    byStatus: {
      AGENDADO: filteredAppointments.filter(apt => apt.status === 'AGENDADO').length,
      EM_ANDAMENTO: filteredAppointments.filter(apt => apt.status === 'EM_ANDAMENTO').length,
      FINALIZADO: filteredAppointments.filter(apt => apt.status === 'FINALIZADO').length,
    },
    byService: services.map(service => ({
      nome: service.nome,
      count: filteredAppointments.filter(apt => 
        apt.service_ids?.includes(service.id)
      ).length,
      revenue: filteredAppointments
        .filter(apt => apt.service_ids?.includes(service.id))
        .reduce((sum, apt) => sum + apt.preco_final, 0),
    })),
  };

  // Dados para gráficos (simulado - você pode usar uma biblioteca como Chart.js ou Recharts)
  const chartData = {
    revenueByMonth: Array.from({ length: 12 }, (_, i) => {
      const month = new Date(new Date().getFullYear(), i, 1);
      const monthAppointments = filteredAppointments.filter(apt => {
        const aptDate = new Date(apt.data);
        return aptDate.getMonth() === i && aptDate.getFullYear() === new Date().getFullYear();
      });
      return {
        month: month.toLocaleDateString('pt-BR', { month: 'short' }),
        revenue: monthAppointments.reduce((sum, apt) => sum + apt.preco_final, 0),
        count: monthAppointments.length,
      };
    }),
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </Layout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
            <p className="mt-1 text-sm text-gray-500">
              Análise detalhada do faturamento e serviços do seu lavajato
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>

        {/* Filtros de data */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">De:</label>
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Até:</label>
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Faturamento Total</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(revenueStats.total)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Wrench className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total de Serviços</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {serviceStats.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Finalizados</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {serviceStats.byStatus.FINALIZADO}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Ticket Médio</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {serviceStats.total > 0 ? formatCurrency(revenueStats.total / serviceStats.total) : 'R$ 0,00'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos e tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Faturamento por status */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Faturamento por Status
              </h3>
              <div className="space-y-3">
                {Object.entries(revenueStats.byStatus).map(([status, value]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">
                      {status === 'AGENDADO' ? 'Agendado' : 
                       status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Finalizado'}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Serviços por status */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Serviços por Status
              </h3>
              <div className="space-y-3">
                {Object.entries(serviceStats.byStatus).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">
                      {status === 'AGENDADO' ? 'Agendado' : 
                       status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Finalizado'}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Faturamento por unidade */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Faturamento por Unidade
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Faturamento
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {revenueStats.byUnit.map((unit) => (
                    <tr key={unit.nome}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {unit.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {unit.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(unit.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Serviços mais populares */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Serviços Mais Populares
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Faturamento
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {serviceStats.byService
                    .filter(service => service.count > 0)
                    .sort((a, b) => b.count - a.count)
                    .map((service) => (
                    <tr key={service.nome}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(service.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Gráfico de faturamento mensal (simulado) */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Faturamento Mensal
            </h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.revenueByMonth.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ 
                      height: `${Math.max((month.revenue / Math.max(...chartData.revenueByMonth.map(m => m.revenue))) * 200, 20)}px` 
                    }}
                  />
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    {month.month}
                  </div>
                  <div className="text-xs font-medium text-gray-900 mt-1">
                    {formatCurrency(month.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
        </Layout>
      </AuthGuard>
    );
  };

export default ReportsPage;
