'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '@/components/Layout';
import AuthGuard from '@/components/AuthGuard';
import { DataTable } from '@/components/DataTable';
import { appointmentsAPI } from '@/services/api';
import { Appointment, UpdateAppointmentData } from '@/types';
import { updateAppointmentSchema } from '@/schemas';
import { mockAppointments } from '@/data/mockData';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Calendar, User, Car, Building2, DollarSign, Clock } from 'lucide-react';

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateAppointmentData>({
    resolver: zodResolver(updateAppointmentSchema),
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      // MODO TESTE: Usar dados mock para testar o frontend
      setAppointments(mockAppointments);
      
      // Código original comentado para modo de produção:
      // const data = await appointmentsAPI.getAll();
      // setAppointments(data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAppointment = async (data: UpdateAppointmentData) => {
    if (!editingAppointment) return;
    
    setIsSubmitting(true);
    try {
      // MODO TESTE: Simular atualização de agendamento
      const updatedAppointment: Appointment = {
        ...editingAppointment,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      setAppointments(appointments.map(apt => apt.id === editingAppointment.id ? updatedAppointment : apt));
      setIsModalOpen(false);
      setEditingAppointment(null);
      reset();
      
      // Código original comentado para modo de produção:
      // const updatedAppointment = await appointmentsAPI.update(editingAppointment.id, data);
      // setAppointments(appointments.map(apt => apt.id === editingAppointment.id ? updatedAppointment : apt));
      // setIsModalOpen(false);
      // setEditingAppointment(null);
      // reset();
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    reset({
      status: appointment.status,
      data: appointment.data.split('T')[0], // Converter para formato de data
      hora: appointment.hora,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
    reset();
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

  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: 'user',
      header: 'Cliente',
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div className="flex items-center">
            <User className="h-5 w-5 text-blue-500 mr-2" />
            <div>
              <p className="font-medium text-gray-900">{appointment.user?.nome}</p>
              <p className="text-sm text-gray-500">{appointment.user?.telefone}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'car',
      header: 'Veículo',
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div className="flex items-center">
            <Car className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="font-medium text-gray-900">{appointment.car?.modelo}</p>
              <p className="text-sm text-gray-500">{appointment.car?.placa} • {appointment.car?.porte}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'unit',
      header: 'Unidade',
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-purple-500 mr-2" />
            <div>
              <p className="font-medium text-gray-900">{appointment.unit?.nome}</p>
              <p className="text-sm text-gray-500">{appointment.unit?.endereco}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'data',
      header: 'Data e Hora',
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
            <div>
              <p className="font-medium text-gray-900">{formatDate(appointment.data)}</p>
              <p className="text-sm text-gray-500">{appointment.hora}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'preco_final',
      header: 'Preço',
      cell: ({ row }) => (
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 text-green-500 mr-1" />
          <span className="font-medium">{formatCurrency(row.getValue('preco_final'))}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openEditModal(row.original)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

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
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Agendamentos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie todos os agendamentos do seu lavajato
          </p>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Agendados</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {appointments.filter(apt => apt.status === 'AGENDADO').length}
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
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Em Andamento</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {appointments.filter(apt => apt.status === 'EM_ANDAMENTO').length}
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
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Finalizados</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {appointments.filter(apt => apt.status === 'FINALIZADO').length}
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
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Faturamento Total</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(appointments.reduce((sum, apt) => sum + apt.preco_final, 0))}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <DataTable
          columns={columns}
          data={appointments}
          searchKey="user.nome"
          searchPlaceholder="Buscar por nome do cliente..."
        />

        {/* Modal de edição */}
        {isModalOpen && editingAppointment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Editar Agendamento
                </h3>
                <form onSubmit={handleSubmit(handleUpdateAppointment)}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        {...register('status')}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="AGENDADO">Agendado</option>
                        <option value="EM_ANDAMENTO">Em Andamento</option>
                        <option value="FINALIZADO">Finalizado</option>
                      </select>
                      {errors.status && (
                        <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="data" className="block text-sm font-medium text-gray-700">
                        Data
                      </label>
                      <input
                        {...register('data')}
                        type="date"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.data && (
                        <p className="mt-1 text-sm text-red-600">{errors.data.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="hora" className="block text-sm font-medium text-gray-700">
                        Hora
                      </label>
                      <input
                        {...register('hora')}
                        type="time"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.hora && (
                        <p className="mt-1 text-sm text-red-600">{errors.hora.message}</p>
                      )}
                    </div>

                    {/* Informações do agendamento */}
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Detalhes do Agendamento</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Cliente:</strong> {editingAppointment.user?.nome}</p>
                        <p><strong>Veículo:</strong> {editingAppointment.car?.modelo} - {editingAppointment.car?.placa}</p>
                        <p><strong>Unidade:</strong> {editingAppointment.unit?.nome}</p>
                        <p><strong>Preço:</strong> {formatCurrency(editingAppointment.preco_final)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Salvando...' : 'Atualizar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
        </Layout>
      </AuthGuard>
    );
  };

export default AppointmentsPage;
