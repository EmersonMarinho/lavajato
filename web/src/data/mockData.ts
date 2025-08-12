import { Service, Unit, Appointment, User, Car } from '@/types';

export const mockServices: Service[] = [
  {
    id: '1',
    nome: 'Lavagem Simples',
    preco_base: 25.00,
    adicional_por_porte: 5.00,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    nome: 'Lavagem Completa',
    preco_base: 45.00,
    adicional_por_porte: 8.00,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    nome: 'Lavagem Premium',
    preco_base: 65.00,
    adicional_por_porte: 12.00,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '4',
    nome: 'Lavagem de Motor',
    preco_base: 35.00,
    adicional_por_porte: 7.00,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

export const mockUnits: Unit[] = [
  {
    id: '1',
    nome: 'Unidade Centro',
    endereco: 'Rua das Flores, 123 - Centro, Curitiba/PR',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    nome: 'Unidade Batel',
    endereco: 'Av. Batel, 456 - Batel, Curitiba/PR',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    nome: 'Unidade Água Verde',
    endereco: 'Rua Água Verde, 789 - Água Verde, Curitiba/PR',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    nome: 'João Silva',
    telefone: '41995085055',
    pontos_fidelidade: 150,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    nome: 'Maria Santos',
    telefone: '41987654321',
    pontos_fidelidade: 75,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    telefone: '41981234567',
    pontos_fidelidade: 200,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

export const mockCars: Car[] = [
  {
    id: '1',
    user_id: '1',
    modelo: 'Honda Civic',
    placa: 'ABC1234',
    porte: 'MEDIO',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    user_id: '2',
    modelo: 'Fiat Mobi',
    placa: 'DEF5678',
    porte: 'PEQUENO',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    user_id: '3',
    modelo: 'Toyota Hilux',
    placa: 'GHI9012',
    porte: 'GRANDE',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    user_id: '1',
    car_id: '1',
    unit_id: '1',
    status: 'AGENDADO',
    data: '2024-01-20T10:00:00Z',
    hora: '10:00',
    preco_final: 30.00,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    service_ids: ['1'],
  },
  {
    id: '2',
    user_id: '2',
    car_id: '2',
    unit_id: '2',
    status: 'EM_ANDAMENTO',
    data: '2024-01-20T14:00:00Z',
    hora: '14:00',
    preco_final: 25.00,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    service_ids: ['1'],
  },
  {
    id: '3',
    user_id: '3',
    car_id: '3',
    unit_id: '3',
    status: 'FINALIZADO',
    data: '2024-01-19T16:00:00Z',
    hora: '16:00',
    preco_final: 77.00,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    service_ids: ['3'],
  },
];
