export interface User {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  pontos_fidelidade: number;
  createdAt: string;
  updatedAt: string;
}

export interface Car {
  id: string;
  user_id: string;
  modelo: string;
  placa: string;
  porte: 'PEQUENO' | 'MEDIO' | 'GRANDE';
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  nome: string;
  endereco: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  nome: string;
  preco_base: number;
  adicional_por_porte: number;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  car_id: string;
  unit_id: string;
  status: 'AGENDADO' | 'EM_ANDAMENTO' | 'FINALIZADO';
  data: string;
  hora: string;
  preco_final: number;
  inclui_busca_entrega: boolean;
  custo_busca_entrega: number;
  endereco_busca?: string;
  observacoes_busca?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentService {
  id: string;
  appointment_id: string;
  service_id: string;
  createdAt: string;
}

export interface CreateCarData {
  modelo: string;
  placa: string;
  porte: 'PEQUENO' | 'MEDIO' | 'GRANDE';
}

export interface CreateAppointmentData {
  car_id: string;
  unit_id: string;
  data: string;
  hora: string;
  services: string[];
  inclui_busca_entrega?: boolean;
  endereco_busca?: string;
  observacoes_busca?: string;
}
