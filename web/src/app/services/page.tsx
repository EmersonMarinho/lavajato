'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '@/components/Layout';
import AuthGuard from '@/components/AuthGuard';
import { DataTable } from '@/components/DataTable';
import { servicesAPI } from '@/services/api';
import { Service, CreateServiceData, UpdateServiceData } from '@/types';
import { createServiceSchema, updateServiceSchema } from '@/schemas';
import { mockServices } from '@/data/mockData';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Edit, Trash2, Wrench, DollarSign } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateServiceData | UpdateServiceData>({
    resolver: zodResolver(editingService ? updateServiceSchema : createServiceSchema),
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // MODO TESTE: Usar dados mock para testar o frontend
      setServices(mockServices);
      
      // Código original comentado para modo de produção:
      // const data = await servicesAPI.getAll();
      // setServices(data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateService = async (data: CreateServiceData) => {
    setIsSubmitting(true);
    try {
      // MODO TESTE: Simular criação de serviço
      const newService: Service = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setServices([newService, ...services]);
      setIsModalOpen(false);
      reset();
      
      // Código original comentado para modo de produção:
      // const newService = await servicesAPI.create(data);
      // setServices([newService, ...services]);
      // setIsModalOpen(false);
      // reset();
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateService = async (data: UpdateServiceData) => {
    if (!editingService) return;
    
    setIsSubmitting(true);
    try {
      // MODO TESTE: Simular atualização de serviço
      const updatedService: Service = {
        ...editingService,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      setServices(services.map(service => service.id === editingService.id ? updatedService : service));
      setIsModalOpen(false);
      setEditingService(null);
      reset();
      
      // Código original comentado para modo de produção:
      // const updatedService = await servicesAPI.update(editingService.id, data);
      // setServices(services.map(service => service.id === editingService.id ? updatedService : service));
      // setIsModalOpen(false);
      // setEditingService(null);
      // reset();
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    
    try {
      // MODO TESTE: Simular exclusão de serviço
      setServices(services.filter(service => service.id !== id));
      
      // Código original comentado para modo de produção:
      // await servicesAPI.delete(id);
      // setServices(services.filter(service => service.id !== id));
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
    }
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    reset({
      nome: service.nome,
      preco_base: service.preco_base,
      adicional_por_porte: service.adicional_por_porte,
    } as UpdateServiceData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    reset();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: 'nome',
      header: 'Nome',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Wrench className="h-5 w-5 text-green-500 mr-2" />
          <span className="font-medium">{row.getValue('nome')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'preco_base',
      header: 'Preço Base',
      cell: ({ row }) => (
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 text-green-500 mr-1" />
          <span className="font-medium">{formatCurrency(row.getValue('preco_base'))}</span>
        </div>
      ),
    },
    {
      accessorKey: 'adicional_por_porte',
      header: 'Adicional por Porte',
      cell: ({ row }) => (
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 text-blue-500 mr-1" />
          <span className="font-medium">{formatCurrency(row.getValue('adicional_por_porte'))}</span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Data de Criação',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return date.toLocaleDateString('pt-BR');
      },
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
          <button
            onClick={() => handleDeleteService(row.original.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

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
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Serviços</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie os serviços oferecidos pelo seu lavajato
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </button>
        </div>

        {/* Tabela */}
        <DataTable
          columns={columns}
          data={services}
          searchKey="nome"
          searchPlaceholder="Buscar por nome do serviço..."
        />

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingService ? 'Editar Serviço' : 'Novo Serviço'}
                </h3>
                <form onSubmit={handleSubmit((data) => {
                  if (editingService) {
                    handleUpdateService(data as UpdateServiceData);
                  } else {
                    handleCreateService(data as CreateServiceData);
                  }
                })}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                        Nome
                      </label>
                      <input
                        {...register('nome')}
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nome do serviço"
                      />
                      {errors.nome && (
                        <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="preco_base" className="block text-sm font-medium text-gray-700">
                        Preço Base
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">R$</span>
                        </div>
                        <input
                          {...register('preco_base', { valueAsNumber: true })}
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-12 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                      {errors.preco_base && (
                        <p className="mt-1 text-sm text-red-600">{errors.preco_base.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="adicional_por_porte" className="block text-sm font-medium text-gray-700">
                        Adicional por Porte
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">R$</span>
                        </div>
                        <input
                          {...register('adicional_por_porte', { valueAsNumber: true })}
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-12 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Adicional aplicado baseado no porte do carro (PEQUENO: 50%, MÉDIO: 100%, GRANDE: 150%)
                      </p>
                      {errors.adicional_por_porte && (
                        <p className="mt-1 text-sm text-red-600">{errors.adicional_por_porte.message}</p>
                      )}
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
                      {isSubmitting ? 'Salvando...' : editingService ? 'Atualizar' : 'Criar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ServicesPage;
