'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '@/components/Layout';
import AuthGuard from '@/components/AuthGuard';
import { DataTable } from '@/components/DataTable';
import { unitsAPI } from '@/services/api';
import { Unit, CreateUnitData, UpdateUnitData } from '@/types';
import { createUnitSchema, updateUnitSchema } from '@/schemas';
import { mockUnits } from '@/data/mockData';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';

const UnitsPage: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUnitData | UpdateUnitData>({
    resolver: zodResolver(editingUnit ? updateUnitSchema : createUnitSchema),
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      // MODO TESTE: Usar dados mock para testar o frontend
      setUnits(mockUnits);
      
      // Código original comentado para modo de produção:
      // const data = await unitsAPI.getAll();
      // setUnits(data);
    } catch (error) {
      console.error('Erro ao carregar unidades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUnit = async (data: CreateUnitData) => {
    setIsSubmitting(true);
    try {
      // MODO TESTE: Simular criação de unidade
      const newUnit: Unit = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUnits([newUnit, ...units]);
      setIsModalOpen(false);
      reset();
      
      // Código original comentado para modo de produção:
      // const newUnit = await unitsAPI.create(data);
      // setUnits([newUnit, ...units]);
      // setIsModalOpen(false);
      // reset();
    } catch (error) {
      console.error('Erro ao criar unidade:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUnit = async (data: UpdateUnitData) => {
    if (!editingUnit) return;
    
    setIsSubmitting(true);
    try {
      // MODO TESTE: Simular atualização de unidade
      const updatedUnit: Unit = {
        ...editingUnit,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      setUnits(units.map(unit => unit.id === editingUnit.id ? updatedUnit : unit));
      setIsModalOpen(false);
      setEditingUnit(null);
      reset();
      
      // Código original comentado para modo de produção:
      // const updatedUnit = await unitsAPI.update(editingUnit.id, data);
      // setUnits(units.map(unit => unit.id === editingUnit.id ? updatedUnit : unit));
      // setIsModalOpen(false);
      // setEditingUnit(null);
      // reset();
    } catch (error) {
      console.error('Erro ao atualizar unidade:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUnit = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta unidade?')) return;
    
    try {
      // MODO TESTE: Simular exclusão de unidade
      setUnits(units.filter(unit => unit.id !== id));
      
      // Código original comentado para modo de produção:
      // await unitsAPI.delete(id);
      // setUnits(units.filter(unit => unit.id !== id));
    } catch (error) {
      console.error('Erro ao excluir unidade:', error);
    }
  };

  const openEditModal = (unit: Unit) => {
    setEditingUnit(unit);
    reset({
      nome: unit.nome,
      endereco: unit.endereco,
    } as UpdateUnitData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUnit(null);
    reset();
  };

  const columns: ColumnDef<Unit>[] = [
    {
      accessorKey: 'nome',
      header: 'Nome',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Building2 className="h-5 w-5 text-blue-500 mr-2" />
          <span className="font-medium">{row.getValue('nome')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'endereco',
      header: 'Endereço',
      cell: ({ row }) => <span>{row.getValue('endereco')}</span>,
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
            onClick={() => handleDeleteUnit(row.original.id)}
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
            <h1 className="text-2xl font-semibold text-gray-900">Unidades</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie as unidades do seu lavajato
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Unidade
          </button>
        </div>

        {/* Tabela */}
        <DataTable
          columns={columns}
          data={units}
          searchKey="nome"
          searchPlaceholder="Buscar por nome da unidade..."
        />

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingUnit ? 'Editar Unidade' : 'Nova Unidade'}
                </h3>
                <form onSubmit={handleSubmit((data) => {
                  if (editingUnit) {
                    handleUpdateUnit(data as UpdateUnitData);
                  } else {
                    handleCreateUnit(data as CreateUnitData);
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
                        placeholder="Nome da unidade"
                      />
                      {errors.nome && (
                        <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">
                        Endereço
                      </label>
                      <textarea
                        {...register('endereco')}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Endereço completo da unidade"
                      />
                      {errors.endereco && (
                        <p className="mt-1 text-sm text-red-600">{errors.endereco.message}</p>
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
                      {isSubmitting ? 'Salvando...' : editingUnit ? 'Atualizar' : 'Criar'}
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

export default UnitsPage;
