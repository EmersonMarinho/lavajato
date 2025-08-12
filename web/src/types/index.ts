export interface User {
  id: string;
  nome: string;
  telefone: string;
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
  user?: User;
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
  createdAt: string;
  updatedAt: string;
  service_ids: string[];
  user?: User;
  car?: Car;
  unit?: Unit;
}

export interface AppointmentService {
  id: string;
  appointment_id: string;
  service_id: string;
  createdAt: string;
  service?: Service;
}

export interface LoginCredentials {
  phoneNumber: string;
  verificationCode: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface CreateUnitData {
  nome: string;
  endereco: string;
}

export interface UpdateUnitData {
  nome?: string;
  endereco?: string;
}

export interface CreateServiceData {
  nome: string;
  preco_base: number;
  adicional_por_porte: number;
}

export interface UpdateServiceData {
  nome?: string;
  preco_base?: number;
  adicional_por_porte?: number;
}

export interface UpdateAppointmentData {
  status?: 'AGENDADO' | 'EM_ANDAMENTO' | 'FINALIZADO';
  data?: string;
  hora?: string;
}

export interface ReportData {
  totalRevenue: number;
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  inProgressAppointments: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
  servicesCount: Array<{
    service: string;
    count: number;
  }>;
}
