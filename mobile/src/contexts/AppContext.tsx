import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Car, Unit, Service, Appointment, CreateCarData, CreateAppointmentData } from '../types';

interface AppContextData {
  cars: Car[];
  units: Unit[];
  services: Service[];
  appointments: Appointment[];
  currentAppointment: {
    selectedCar: Car | null;
    selectedUnit: Unit | null;
    selectedServices: Service[];
    totalPrice: number;
  } | null;
  addCar: (carData: CreateCarData) => void;
  addAppointment: (appointmentData: CreateAppointmentData) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  calculatePrice: (selectedServices: string[], carPorte: Car['porte']) => number;
  setCurrentAppointment: (data: {
    selectedCar: Car;
    selectedUnit: Unit;
    selectedServices: Service[];
    totalPrice: number;
  }) => void;
  clearCurrentAppointment: () => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentAppointment, setCurrentAppointmentState] = useState<{
    selectedCar: Car | null;
    selectedUnit: Unit | null;
    selectedServices: Service[];
    totalPrice: number;
    inclui_busca_entrega?: boolean;
    endereco_busca?: string;
    observacoes_busca?: string;
  } | null>(null);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Dados mock para teste
    setUnits([
      {
        id: '1',
        nome: 'Unidade Centro',
        endereco: 'Rua das Flores, 123 - Centro',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        nome: 'Unidade Zona Sul',
        endereco: 'Av. Principal, 456 - Zona Sul',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    setServices([
      {
        id: '1',
        nome: 'Lavagem Simples',
        preco_base: 25.00,
        adicional_por_porte: 5.00,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        nome: 'Lavagem Completa',
        preco_base: 45.00,
        adicional_por_porte: 10.00,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        nome: 'Cera',
        preco_base: 30.00,
        adicional_por_porte: 8.00,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        nome: 'Aspiração',
        preco_base: 15.00,
        adicional_por_porte: 3.00,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  };

  const addCar = (carData: CreateCarData) => {
    const newCar: Car = {
      id: Date.now().toString(),
      user_id: 'current-user', // Será substituído pelo ID real do usuário
      ...carData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCars(prev => [...prev, newCar]);
  };

  const addAppointment = (appointmentData: CreateAppointmentData) => {
    const car = cars.find(c => c.id === appointmentData.car_id);
    const totalPrice = calculatePrice(appointmentData.services, car?.porte || 'PEQUENO');
    
    // Calcular custo adicional de busca e entrega
    const custoBuscaEntrega = appointmentData.inclui_busca_entrega ? 50.00 : 0;
    const precoFinalTotal = totalPrice + custoBuscaEntrega;
    
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      user_id: 'current-user', // Será substituído pelo ID real do usuário
      car_id: appointmentData.car_id,
      unit_id: appointmentData.unit_id,
      data: appointmentData.data,
      hora: appointmentData.hora,
      status: 'AGENDADO',
      preco_final: precoFinalTotal,
      inclui_busca_entrega: appointmentData.inclui_busca_entrega || false,
      custo_busca_entrega: custoBuscaEntrega,
      endereco_busca: appointmentData.endereco_busca,
      observacoes_busca: appointmentData.observacoes_busca,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => 
      prev.map(app => app.id === id ? { ...app, status, updatedAt: new Date().toISOString() } : app)
    );
  };

  const calculatePrice = (selectedServices: string[], carPorte: Car['porte']): number => {
    let total = 0;
    
    selectedServices.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        let price = service.preco_base;
        
        // Adicionar valor baseado no porte do carro
        switch (carPorte) {
          case 'PEQUENO':
            price += service.adicional_por_porte * 0;
            break;
          case 'MEDIO':
            price += service.adicional_por_porte * 1;
            break;
          case 'GRANDE':
            price += service.adicional_por_porte * 2;
            break;
        }
        
        total += price;
      }
    });
    
    return total;
  };

  const setCurrentAppointment = (data: {
    selectedCar: Car;
    selectedUnit: Unit;
    selectedServices: Service[];
    totalPrice: number;
  }) => {
    setCurrentAppointmentState(data);
  };

  const clearCurrentAppointment = () => {
    setCurrentAppointmentState(null);
  };

  return (
    <AppContext.Provider value={{
      cars,
      units,
      services,
      appointments,
      currentAppointment,
      addCar,
      addAppointment,
      updateAppointmentStatus,
      calculatePrice,
      setCurrentAppointment,
      clearCurrentAppointment,
    }}>
      {children}
    </AppContext.Provider>
  );
};
