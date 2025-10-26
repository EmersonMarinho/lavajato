'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Car, Building2, Wrench, CheckCircle, Info, MapPin, Home } from 'lucide-react';

export default function AgendarPage() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  
  
  const [step, setStep] = useState(1);
  const [cars, setCars] = useState<any[]>([]);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [tipoEntrega, setTipoEntrega] = useState<'BALCAO' | 'LEVA_TRAS' | null>(null);
  
  // Função para voltar para etapa anterior
  const voltarEtapa = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/cliente');
    }
  };
  const [endereco, setEndereco] = useState({
    nome: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    cep: ''
  });
  const [enderecosFavoritos, setEnderecosFavoritos] = useState<any[]>([]);
  const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState<string | null>(null);
  const [showFormularioEndereco, setShowFormularioEndereco] = useState(false);
  const [usarEnderecoFavorito, setUsarEnderecoFavorito] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInfo, setShowInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/cliente/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadEnderecosFavoritos = async () => {
      // Verificar se há user disponível (do contexto ou localStorage)
      const authUser = user || (localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!) : null);
      if (!authUser) return;
      
      try {
        // Verificar se há token disponível (do contexto ou localStorage)
        const authToken = token || localStorage.getItem('auth_token');
        if (!authToken) {
          console.warn('Token não disponível, mostrando formulário diretamente');
          setShowFormularioEndereco(true);
          setUsarEnderecoFavorito(false);
          return;
        }
        
        const response = await fetch(`http://localhost:3001/users/${authUser.id}/enderecos-favoritos`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setEnderecosFavoritos(data);
          // Se não tem endereços favoritos, mostrar formulário diretamente
          if (data.length === 0) {
            setShowFormularioEndereco(true);
            setUsarEnderecoFavorito(false);
          }
        } else if (response.status === 401) {
          console.warn('Token inválido ou expirado ao carregar endereços favoritos');
          setShowFormularioEndereco(true);
          setUsarEnderecoFavorito(false);
        }
      } catch (error) {
        console.error('Erro ao carregar endereços favoritos:', error);
        // Em caso de erro, mostrar formulário
        setShowFormularioEndereco(true);
        setUsarEnderecoFavorito(false);
      }
    };

    loadEnderecosFavoritos();
  }, [user, token]);

  useEffect(() => {
    const loadCars = async () => {
      // Verificar se há user disponível (do contexto ou localStorage)
      const authUser = user || (localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!) : null);
      if (!authUser) return;
      
      try {
        // Verificar se há token disponível (do contexto ou localStorage)
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

  // Dados mock (serão substituídos por chamadas à API)
  const mockUnits = [
    { id: '1', nome: 'Unidade Centro', endereco: 'Rua das Flores, 123' },
    { id: '2', nome: 'Unidade Zona Sul', endereco: 'Av. Principal, 456' },
  ];

  const mockServices = [
    { 
      id: '1', 
      nome: 'Lavagem Simples', 
      preco: 25.00,
      descricao: 'Lavagem externa com água e sabão. Ideal para manutenção rápida.',
      exclusivos: ['2'] // Não pode combinar com Lavagem Completa
    },
    { 
      id: '2', 
      nome: 'Lavagem Completa', 
      preco: 45.00,
      descricao: 'Lavagem externa completa com cera, limpeza de rodas e secagem. Inclui tudo da lavagem simples.',
      exclusivos: ['1'] // Não pode combinar com Lavagem Simples
    },
    { 
      id: '3', 
      nome: 'Cera', 
      preco: 30.00,
      descricao: 'Aplicação de cera automotiva para proteção e brilho da pintura.',
      exclusivos: []
    },
    { 
      id: '4', 
      nome: 'Aspiração', 
      preco: 15.00,
      descricao: 'Limpeza completa do interior com aspirador profissional.',
      exclusivos: []
    },
  ];

  const toggleService = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        // Deselecionar
        return prev.filter(id => id !== serviceId);
      } else {
        // Verificar serviços exclusivos
        const exclusivosToRemove = service?.exclusivos || [];
        const newSelection = prev.filter(id => !exclusivosToRemove.includes(id));
        return [...newSelection, serviceId];
      }
    });
  };

  const handleConfirmar = async () => {
    setIsSubmitting(true);
    
    try {
      // Verificar se há token disponível (do contexto ou localStorage)
      const authToken = token || localStorage.getItem('auth_token');
      const authUser = user || (localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!) : null);
      
      if (!authUser || !authToken) {
        alert('Sessão expirada. Faça login novamente.');
        router.push('/cliente/login');
        return;
      }

      // Formatar endereço para string
      const enderecoCompleto = tipoEntrega === 'LEVA_TRAS' 
        ? `${endereco.rua}, ${endereco.numero}${endereco.complemento ? ` - ${endereco.complemento}` : ''}, ${endereco.bairro}, ${endereco.cidade} - CEP: ${endereco.cep}`
        : undefined;

      const agendamentoData = {
        user_id: authUser.id,
        car_id: selectedCar.id,
        unit_id: tipoEntrega === 'BALCAO' ? selectedUnit.id : mockUnits[0].id, // Se for leva e traz, pode usar unidade padrão
        data: new Date().toISOString(),
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        service_ids: selectedServices,
        inclui_busca_entrega: tipoEntrega === 'LEVA_TRAS',
        endereco_busca: enderecoCompleto,
        observacoes_busca: tipoEntrega === 'LEVA_TRAS' ? 'Entrega em domicílio solicitada' : undefined
      };

      // Chamada ao backend
      const response = await fetch('http://localhost:3001/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(agendamentoData)
      });

      if (response.ok) {
        alert('Agendamento confirmado com sucesso!');
        router.push('/cliente/agendamentos');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Erro ao confirmar agendamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`Erro ao confirmar agendamento: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-6 pb-5 md:px-12 md:pt-8 md:pb-6">
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <button 
            onClick={voltarEtapa}
            className="text-white hover:text-blue-100 transition-colors cursor-pointer p-1 -ml-1"
          >
            <svg className="h-7 w-7 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-white leading-tight">
            {step === 1 ? 'Novo Agendamento' :
             step === 2 ? 'Tipo de Entrega' :
             step === 3 ? (tipoEntrega === 'LEVA_TRAS' ? 'Seu Endereço' : 'Escolha o Lavajato') :
             step === 4 ? 'Selecione Serviços' :
             step === 5 ? 'Confirme' : ''}
          </h2>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs md:text-sm text-white font-medium">
              {step === 1 && 'Passo 1 de 5'}
              {step === 2 && 'Passo 2 de 5'}
              {step === 3 && 'Passo 3 de 5'}
              {step === 4 && 'Passo 4 de 5'}
              {step === 5 && 'Passo 5 de 5'}
            </span>
            <span className="text-xs md:text-sm text-white font-bold">{step}/5</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-1.5 md:h-2">
            <div className="bg-white h-1.5 md:h-2 rounded-full transition-all shadow-lg" style={{ width: `${(step / 5) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="px-4 py-6 md:px-12 md:py-8 space-y-4 md:space-y-6">
        {/* Step 1: Selecionar Veículo */}
        {step === 1 && (
          <div className="space-y-3 md:space-y-4">
            <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-3 md:mb-4">Meus Veículos</h3>
            {cars.length === 0 ? (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 text-center">
                <p className="text-gray-500 text-sm md:text-base mb-4">Você ainda não tem veículos cadastrados.</p>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    router.push('/cliente/carros');
                  }}
                  className="bg-blue-600 text-white rounded-lg md:rounded-xl px-6 py-2.5 md:py-3 font-semibold text-sm md:text-base hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cadastrar Primeiro Veículo
                </button>
              </div>
            ) : (
              cars.map(car => (
              <button
                key={car.id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCar(car);
                  setStep(2);
                }}
                className="w-full bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-100 p-4 md:p-5 flex items-center gap-3 md:gap-4 active:shadow-lg active:border-blue-300 active:scale-[0.98] transition-all text-left cursor-pointer group touch-manipulation disabled:opacity-50"
              >
                <div className="bg-blue-100 p-3 md:p-4 rounded-lg md:rounded-xl group-active:bg-blue-200 transition-colors flex-shrink-0">
                  <Car className="h-6 w-6 md:h-7 md:w-7 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-base md:text-lg truncate">{car.modelo}</h4>
                  <p className="text-xs md:text-sm text-gray-900 truncate">{car.placa} • {car.porte}</p>
                </div>
                <div className="text-blue-600 text-xl md:text-2xl font-bold flex-shrink-0">›</div>
              </button>
              ))
            )}
            {cars.length > 0 && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/cliente/carros');
                }}
                className="w-full bg-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 flex items-center gap-3 text-gray-900 active:bg-gray-200 active:shadow-md transition-all cursor-pointer font-semibold text-sm md:text-base touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-2xl md:text-3xl">+</span>
                <span>Cadastrar novo veículo</span>
              </button>
            )}
          </div>
        )}

        {/* Step 2: Tipo de Entrega */}
        {step === 2 && (
          <div className="space-y-3 md:space-y-4">
            <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-3 md:mb-4">Qual modalidade você prefere?</h3>
            
            <button
              onClick={() => {
                setTipoEntrega('BALCAO');
                setStep(3);
              }}
              className="w-full bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 flex items-center gap-3 md:gap-4 active:shadow-lg active:border-blue-300 active:scale-[0.98] transition-all text-left cursor-pointer group touch-manipulation"
            >
              <div className="bg-blue-100 p-3 md:p-4 rounded-lg md:rounded-xl group-active:bg-blue-200 transition-colors flex-shrink-0">
                <Building2 className="h-7 w-7 md:h-8 md:w-8 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-base md:text-xl mb-0.5 md:mb-1">Ir ao Lavajato</h4>
                <p className="text-xs md:text-sm text-gray-900">Você leva e busca o veículo no lavajato</p>
              </div>
              <div className="text-blue-600 text-xl md:text-2xl font-bold flex-shrink-0">›</div>
            </button>

            <button
              onClick={() => {
                setTipoEntrega('LEVA_TRAS');
                setStep(3);
              }}
              className="w-full bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 flex items-center gap-3 md:gap-4 active:shadow-lg active:border-green-300 active:scale-[0.98] transition-all text-left cursor-pointer group touch-manipulation"
            >
              <div className="bg-green-100 p-3 md:p-4 rounded-lg md:rounded-xl group-active:bg-green-200 transition-colors flex-shrink-0">
                <Home className="h-7 w-7 md:h-8 md:w-8 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-base md:text-xl mb-0.5 md:mb-1">Leva e Traz</h4>
                <p className="text-xs md:text-sm text-gray-900">Buscamos e entregamos o veículo na sua casa</p>
                <span className="inline-block mt-1.5 md:mt-2 px-2.5 md:px-3 py-0.5 md:py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Taxa de R$ 15,00
                </span>
              </div>
              <div className="text-green-600 text-xl md:text-2xl font-bold flex-shrink-0">›</div>
            </button>
          </div>
        )}

        {/* Step 3: Endereço OU Unidade */}
        {step === 3 && tipoEntrega === 'LEVA_TRAS' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-xl mb-4">Onde entregar o veículo?</h3>
            
            {/* Se TEM endereços favoritos E formulário não está aberto, mostrar seleção */}
            {enderecosFavoritos.length > 0 && !showFormularioEndereco ? (
              <>
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-4">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Endereços Salvos
                  </h4>
                  <div className="space-y-2">
                    {enderecosFavoritos.map((fav, index) => {
                      const isSelected = enderecoSelecionadoId === `fav-${index}`;
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setEndereco(fav);
                            setEnderecoSelecionadoId(`fav-${index}`);
                            setUsarEnderecoFavorito(true);
                          }}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-500 shadow-md' 
                              : 'bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex-1">
                            <p className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                              {fav.nome}
                            </p>
                            <p className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                              {fav.rua}, {fav.numero} - {fav.bairro}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="bg-blue-500 p-2 rounded-full">
                              <CheckCircle className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Botão para continuar com endereço favorito selecionado */}
                {enderecoSelecionadoId && (
                  <button
                    onClick={() => setStep(4)}
                    className="w-full bg-blue-600 text-white rounded-2xl py-4 font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Continuar
                  </button>
                )}

                {/* Botão para adicionar novo endereço */}
                <button
                  onClick={() => {
                    setShowFormularioEndereco(true);
                    setEnderecoSelecionadoId(null);
                    setEndereco({
                      nome: '',
                      rua: '',
                      numero: '',
                      complemento: '',
                      bairro: '',
                      cidade: '',
                      cep: ''
                    });
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl py-3 font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>+</span>
                  Usar Outro Endereço
                </button>
              </>
            ) : (
              // Mostrar formulário quando não tem endereços favoritos OU quando usuário quer preencher novo
              <>
                {/* Botão Preencher Automaticamente */}
                <button
                  onClick={() => {
                    setEndereco({
                      nome: 'Meu Endereço',
                      rua: 'Rua das Flores',
                      numero: '123',
                      complemento: 'Apto 101',
                      bairro: 'Centro',
                      cidade: 'São Paulo',
                      cep: '01234-567'
                    });
                    setEnderecoSelecionadoId(null);
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl py-3 font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>+</span>
                  Preencher Automaticamente
                </button>
                
                {/* Formulário de Endereço */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
                  {/* Botão Voltar (apenas se tiver endereços favoritos) */}
                  {enderecosFavoritos.length > 0 && (
                    <button
                      onClick={() => {
                        setShowFormularioEndereco(false);
                        setEnderecoSelecionadoId(null);
                      }}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl py-3 font-semibold transition-colors flex items-center justify-center gap-2 mb-4"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Voltar para Endereços Salvos
                    </button>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Nome do Endereço (opcional)</label>
                    <input
                      type="text"
                      value={endereco.nome}
                      onChange={(e) => {
                        setEndereco({ ...endereco, nome: e.target.value });
                        setEnderecoSelecionadoId(null);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                      placeholder="Ex: Casa, Trabalho, etc."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">CEP</label>
                      <input
                        type="text"
                        value={endereco.cep}
                        onChange={(e) => {
                          setEndereco({ ...endereco, cep: e.target.value });
                          setEnderecoSelecionadoId(null);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Cidade</label>
                      <input
                        type="text"
                        value={endereco.cidade}
                        onChange={(e) => {
                          setEndereco({ ...endereco, cidade: e.target.value });
                          setEnderecoSelecionadoId(null);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                        placeholder="Sua cidade"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Rua</label>
                    <input
                      type="text"
                      value={endereco.rua}
                      onChange={(e) => {
                        setEndereco({ ...endereco, rua: e.target.value });
                        setEnderecoSelecionadoId(null);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                      placeholder="Nome da rua"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Número</label>
                      <input
                        type="text"
                        value={endereco.numero}
                        onChange={(e) => {
                          setEndereco({ ...endereco, numero: e.target.value });
                          setEnderecoSelecionadoId(null);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                        placeholder="123"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Complemento</label>
                      <input
                        type="text"
                        value={endereco.complemento}
                        onChange={(e) => {
                          setEndereco({ ...endereco, complemento: e.target.value });
                          setEnderecoSelecionadoId(null);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                        placeholder="Apto, Casa, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Bairro</label>
                    <input
                      type="text"
                      value={endereco.bairro}
                      onChange={(e) => {
                        setEndereco({ ...endereco, bairro: e.target.value });
                        setEnderecoSelecionadoId(null);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                      placeholder="Nome do bairro"
                    />
                  </div>

                  {/* Botão Salvar como Favorito */}
                  {endereco.rua && endereco.numero && endereco.bairro && endereco.cidade && (
                    <button
                      onClick={async () => {
                        if (!endereco.nome || enderecosFavoritos.find(f => f.nome === endereco.nome)) return;
                        
                        try {
                          // Verificar se há token disponível (do contexto ou localStorage)
                          const authToken = token || localStorage.getItem('auth_token');
                          const authUser = user || (localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!) : null);
                          
                          if (!authToken || !authUser) {
                            alert('Você precisa estar logado para salvar endereços favoritos.');
                            router.push('/cliente/login');
                            return;
                          }
                          
                          const response = await fetch(`http://localhost:3001/users/${authUser.id}/enderecos-favoritos`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${authToken}`
                            },
                            body: JSON.stringify({
                              nome: endereco.nome,
                              rua: endereco.rua,
                              numero: endereco.numero,
                              ...(endereco.complemento && { complemento: endereco.complemento }),
                              bairro: endereco.bairro,
                              cidade: endereco.cidade,
                              cep: endereco.cep
                            })
                          });
                          
                          if (response.ok) {
                            const novoEndereco = await response.json();
                            setEnderecosFavoritos([...enderecosFavoritos, novoEndereco]);
                            alert('Endereço salvo como favorito!');
                          } else {
                            const errorData = await response.json();
                            
                            if (response.status === 401) {
                              alert('Sessão expirada. Faça login novamente.');
                              router.push('/cliente/login');
                            } else {
                              alert(`Erro ao salvar endereço favorito: ${errorData.message || 'Erro desconhecido'}`);
                            }
                          }
                        } catch (error) {
                          console.error('Erro:', error);
                          const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
                          alert(`Erro ao salvar endereço favorito: ${errorMessage}`);
                        }
                      }}
                      disabled={!endereco.nome || enderecosFavoritos.find(f => f.nome === endereco.nome)}
                      className="w-full bg-green-100 hover:bg-green-200 text-green-700 rounded-2xl py-3 font-semibold transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <MapPin className="h-5 w-5" />
                      Salvar como Favorito
                    </button>
                  )}

                  <button
                    onClick={() => setStep(4)}
                    disabled={!endereco.rua || !endereco.numero || !endereco.bairro || !endereco.cidade}
                    className="w-full bg-blue-600 text-white rounded-2xl py-4 font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Continuar
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3: Selecionar Unidade (se Buscar no Lavajato) */}
        {step === 3 && tipoEntrega === 'BALCAO' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-xl mb-4">Escolha o Lavajato</h3>
            {mockUnits.map(unit => (
              <button
                key={unit.id}
                onClick={() => {
                  setSelectedUnit(unit);
                  setStep(4); // Agora vai para Serviços
                }}
                className="w-full bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex items-start gap-4 hover:shadow-lg hover:border-green-300 hover:scale-[1.02] transition-all text-left cursor-pointer group"
              >
                <div className="bg-green-100 p-4 rounded-xl group-hover:bg-green-200 transition-colors">
                  <Building2 className="h-7 w-7 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg">{unit.nome}</h4>
                  <p className="text-sm text-gray-900">{unit.endereco}</p>
                </div>
                <div className="text-green-600 text-2xl font-bold group-hover:translate-x-1 transition-transform">›</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 4: Selecionar Serviços */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-xl mb-4">Selecione os Serviços</h3>
            {mockServices.map(service => (
              <div key={service.id}>
                <div className="relative">
                  <button
                    onClick={() => toggleService(service.id)}
                    className={`w-full rounded-2xl shadow-md border p-5 flex items-center gap-4 transition-all text-left cursor-pointer group ${
                      selectedServices.includes(service.id)
                        ? 'bg-blue-50 border-2 border-blue-600 shadow-lg scale-[1.02]'
                        : 'bg-white border-gray-100 hover:shadow-lg hover:border-blue-200 hover:scale-[1.01]'
                    }`}
                  >
                    <div className={`p-4 rounded-xl transition-colors ${
                      selectedServices.includes(service.id) ? 'bg-blue-600' : 'bg-gray-100 group-hover:bg-blue-50'
                    }`}>
                      <Wrench className={`h-7 w-7 ${
                        selectedServices.includes(service.id) ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-lg">{service.nome}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowInfo(showInfo === service.id ? null : service.id);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-900 font-semibold">R$ {service.preco.toFixed(2)}</p>
                    </div>
                    {selectedServices.includes(service.id) && (
                      <div className="bg-blue-600 p-2 rounded-full">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </button>
                </div>
                {showInfo === service.id && (
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-gray-900 font-medium">{service.descricao}</p>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => setStep(5)}
              disabled={selectedServices.length === 0}
              className="w-full bg-blue-600 text-white rounded-2xl py-4 font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed mt-6 hover:bg-blue-700 transition-colors shadow-lg"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 5: Confirmar */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-xl mb-4">Confirme seu Agendamento</h3>
            
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-600" />
                Veículo
              </h4>
              <p className="text-gray-900 text-lg">{selectedCar?.modelo} - {selectedCar?.placa}</p>
            </div>

            {tipoEntrega === 'BALCAO' ? (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-green-600" />
                  Lavajato
                </h4>
                <p className="text-gray-900 text-lg mb-1">{selectedUnit?.nome}</p>
                <p className="text-sm text-gray-700">{selectedUnit?.endereco}</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Home className="h-5 w-5 text-green-600" />
                  Entrega em Domicílio
                </h4>
                {endereco.nome && (
                  <p className="text-lg font-semibold text-blue-600 mb-2">{endereco.nome}</p>
                )}
                <p className="text-gray-900 mb-2">
                  {endereco.rua}, {endereco.numero} {endereco.complemento && `- ${endereco.complemento}`}
                </p>
                <p className="text-sm text-gray-700">
                  {endereco.bairro}, {endereco.cidade} - CEP: {endereco.cep}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-green-700 font-semibold">+ Taxa de Leva e Traz: R$ 15,00</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-purple-600" />
                Serviços
              </h4>
              <div className="space-y-3">
                {selectedServices.map(serviceId => {
                  const service = mockServices.find(s => s.id === serviceId);
                  return service ? (
                    <div key={serviceId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-900">{service.nome}</span>
                      <span className="font-bold text-gray-900">R$ {service.preco.toFixed(2)}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl shadow-md border border-blue-200 p-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  R$ {(
                    selectedServices.reduce((total, serviceId) => {
                      const service = mockServices.find(s => s.id === serviceId);
                      return total + (service?.preco || 0);
                    }, 0) + (tipoEntrega === 'LEVA_TRAS' ? 15 : 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <button 
              onClick={handleConfirmar}
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white rounded-2xl py-4 font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Confirmando...
                </>
              ) : (
                'Confirmar Agendamento'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

