'use client';

import { Car, Plus, X, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CarrosPage() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();

  const [cars, setCars] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [formData, setFormData] = useState({
    modelo: '',
    placa: '',
    porte: 'PEQUENO'
  });
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/cliente/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadCars = async () => {
      const authUser = user || (localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!) : null);
      if (!authUser) return;
      
      try {
        const authToken = token || localStorage.getItem('auth_token');
        if (!authToken) return;
        
        const response = await fetch('http://localhost:3001/cars/my-cars', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCars(data);
        }
      } catch (error) {
        console.error('Erro ao carregar carros:', error);
      }
    };

    loadCars();
  }, [user, token]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleAdd = () => {
    setEditingCar(null);
    setFormData({ modelo: '', placa: '', porte: 'PEQUENO' });
    setShowForm(true);
  };

  const handleEdit = (car: any) => {
    setEditingCar(car);
    setFormData({ modelo: car.modelo, placa: car.placa, porte: car.porte });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este veículo?')) {
      try {
        const authToken = token || localStorage.getItem('auth_token');
        if (!authToken) return;
        
        const response = await fetch(`http://localhost:3001/cars/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (response.ok) {
          setCars(cars.filter(car => car.id !== id));
        } else {
          alert('Erro ao deletar veículo');
        }
      } catch (error) {
        console.error('Erro ao deletar:', error);
        alert('Erro ao deletar veículo');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const authToken = token || localStorage.getItem('auth_token');
      const authUser = user || (localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!) : null);
      
      if (!authToken || !authUser) return;
      
      if (editingCar) {
        // Editar veículo existente
        const response = await fetch(`http://localhost:3001/cars/${editingCar.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          const updatedCar = await response.json();
          setCars(cars.map(car => car.id === editingCar.id ? updatedCar : car));
          setShowForm(false);
          setEditingCar(null);
          setFormData({ modelo: '', placa: '', porte: 'PEQUENO' });
        } else {
          alert('Erro ao editar veículo');
        }
      } else {
        // Adicionar novo veículo
        const response = await fetch('http://localhost:3001/cars', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            ...formData,
            user_id: authUser.id
          })
        });
        
        if (response.ok) {
          const newCar = await response.json();
          setCars([...cars, newCar]);
          setShowForm(false);
          setEditingCar(null);
          setFormData({ modelo: '', placa: '', porte: 'PEQUENO' });
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Erro ao adicionar veículo');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar veículo');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 md:px-12 pt-8 pb-8">
        <div className="flex items-center gap-4">
          <Link href="/cliente" className="text-white hover:text-blue-100 transition-colors">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Meus Carros</h2>
        </div>
      </div>

      <div className="px-6 md:px-12 py-8">
        <div className="space-y-4">
          {cars.map(car => (
            <div key={car.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-xl">
                  <Car className="h-7 w-7 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{car.modelo}</h3>
                  <p className="text-sm text-gray-900">{car.placa} • {car.porte}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(car)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(car.id)}
                    className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={handleAdd}
            className="w-full bg-blue-600 text-white rounded-2xl py-5 flex items-center justify-center gap-3 font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-6 w-6" />
            Cadastrar Novo Veículo
          </button>
        </div>
      </div>

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingCar ? 'Editar Veículo' : 'Novo Veículo'}
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Modelo do Veículo
                </label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                  placeholder="Ex: Honda Civic"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Placa
                </label>
                <input
                  type="text"
                  value={formData.placa}
                  onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                  placeholder="ABC-1234"
                  maxLength={8}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Porte
                </label>
                <select
                  value={formData.porte}
                  onChange={(e) => setFormData({ ...formData, porte: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                  required
                >
                  <option value="PEQUENO">Pequeno</option>
                  <option value="MEDIO">Médio</option>
                  <option value="GRANDE">Grande</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  {editingCar ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

