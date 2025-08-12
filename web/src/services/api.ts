import axios from 'axios';
import { 
  User, 
  Unit, 
  Service, 
  Appointment, 
  AuthResponse, 
  LoginCredentials,
  CreateUnitData,
  UpdateUnitData,
  CreateServiceData,
  UpdateServiceData,
  UpdateAppointmentData,
  ReportData
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Autenticação
export const authAPI = {
  sendCode: async (phoneNumber: string) => {
    const response = await api.post('/auth/send-code', { phoneNumber });
    return response.data;
  },

  verifyCode: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify', credentials);
    return response.data;
  },
};

// Usuários
export const usersAPI = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

// Unidades
export const unitsAPI = {
  getAll: async (): Promise<Unit[]> => {
    const response = await api.get('/units');
    return response.data;
  },

  getById: async (id: string): Promise<Unit> => {
    const response = await api.get(`/units/${id}`);
    return response.data;
  },

  create: async (data: CreateUnitData): Promise<Unit> => {
    const response = await api.post('/units', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUnitData): Promise<Unit> => {
    const response = await api.patch(`/units/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/units/${id}`);
  },
};

// Serviços
export const servicesAPI = {
  getAll: async (): Promise<Service[]> => {
    const response = await api.get('/services');
    return response.data;
  },

  getById: async (id: string): Promise<Service> => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  create: async (data: CreateServiceData): Promise<Service> => {
    const response = await api.post('/services', data);
    return response.data;
  },

  update: async (id: string, data: UpdateServiceData): Promise<Service> => {
    const response = await api.patch(`/services/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};

// Agendamentos
export const appointmentsAPI = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments');
    return response.data;
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateAppointmentData): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};

// Relatórios
export const reportsAPI = {
  getDashboardData: async (): Promise<ReportData> => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },
};

export default api;
