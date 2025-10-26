'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Phone, KeyRound, ArrowRight } from 'lucide-react';

export default function ClienteLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<'phone' | 'code' | 'complete'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  // Dados para completar cadastro
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    tipo: 'CLIENTE'
  });

  // Timer para reenvio de código
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setPhoneNumber(formatted);
    setError('');
  };

  const handleSendCode = async () => {
    const digits = phoneNumber.replace(/\D/g, '');
    if (!phoneNumber || digits.length < 10) {
      setError('Digite um número de telefone válido');
      return;
    }

    setIsLoading(true);
    try {
      // Chamar o backend para enviar código
      const response = await fetch('http://localhost:3001/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: digits
        })
      });
      
      if (response.ok) {
        setIsLoading(false);
        setShowSuccess(true);
        setResendTimer(60); // Iniciar timer de 60 segundos
        setTimeout(() => {
          setStep('code');
          setShowSuccess(false);
        }, 1500);
      } else {
        const errorData = await response.json();
        setIsLoading(false);
        setError(errorData.message || 'Erro ao enviar código. Tente novamente.');
      }
    } catch (error) {
      setIsLoading(false);
      setError('Erro ao enviar código. Tente novamente.');
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setError('Digite o código completo');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      // Limpar formatação do telefone
      const digits = phoneNumber.replace(/\D/g, '');
      
      const requestBody = {
        phoneNumber: digits,
        verificationCode: code
      };
      
      console.log('Enviando para o backend:', requestBody);
      
      // Chamar o backend para verificar código e fazer login
      const response = await fetch('http://localhost:3001/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('Status da resposta:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Resposta do backend:', data);
        
        // Verificar se precisa completar o cadastro
        if (data.needsCompleteRegistration) {
          console.log('Precisa completar cadastro');
          setIsLoading(false);
          // Salvar token temporário se existir
          if (data.accessToken) {
            localStorage.setItem('temp_token', data.accessToken);
          }
          // Ir para o passo de completar cadastro
          setStep('complete');
        } else {
          console.log('Cadastro completo, fazendo login');
          // Usar o contexto de autenticação com dados reais do backend
          login({
            user: data.user,
            accessToken: data.accessToken
          });
          
          setIsLoading(false);
          
          // Redirecionar sem recarregar a página
          router.push('/cliente');
        }
      } else {
        let errorData;
        try {
          errorData = await response.json();
          console.error('Erro do backend:', errorData);
        } catch (e) {
          errorData = { message: 'Erro desconhecido no servidor' };
        }
        setIsLoading(false);
        // Mostrar mensagem completa do erro ou array de mensagens
        const errorMessage = Array.isArray(errorData.message) 
          ? errorData.message.join(', ') 
          : errorData.message || 'Código inválido. Tente novamente.';
        setError(errorMessage);
        setCode('');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao verificar código:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(`Erro ao verificar. ${errorMessage}`);
      setCode('');
    }
  };

  const handleCompleteRegistration = async () => {
    if (!formData.nome || !formData.dataNascimento || !formData.tipo) {
      setError('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const tempToken = localStorage.getItem('temp_token');
      const response = await fetch('http://localhost:3001/auth/complete-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Limpar token temporário
        localStorage.removeItem('temp_token');
        
        // Fazer login
        login({
          user: data.user,
          accessToken: data.accessToken
        });
        
        setIsLoading(false);
        
        // Redirecionar
        router.push('/cliente');
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: 'Erro desconhecido no servidor' };
        }
        setIsLoading(false);
        setError(errorData.message || 'Erro ao completar cadastro');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao completar cadastro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(`Erro ao completar cadastro. ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
        {/* Logo/Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="bg-blue-100 rounded-full p-3 md:p-4 w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 flex items-center justify-center">
            <Phone className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Lavajato App</h1>
          <p className="text-sm md:text-base text-gray-600">
            {step === 'phone' 
              ? 'Entre com seu número de telefone'
              : step === 'code'
              ? `Digite o código enviado para ${phoneNumber}`
              : 'Complete seu cadastro'}
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 md:p-4 mb-4 animate-pulse">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-green-100 rounded-full p-1.5 md:p-2 flex-shrink-0">
                <svg className="h-4 w-4 md:h-5 md:w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-semibold text-green-900">Código enviado com sucesso!</p>
                <p className="text-xs text-green-700">Verifique seu telefone</p>
              </div>
            </div>
          </div>
        )}

        {step === 'phone' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Número de Telefone
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className={`w-full px-4 py-3 md:py-3.5 pr-12 border rounded-lg text-base md:text-lg text-gray-900 placeholder:text-gray-400 touch-manipulation ${
                    error 
                      ? 'border-red-300 focus:ring-red-600' 
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                  }`}
                  maxLength={15}
                />
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {error && (
                <p className="text-xs md:text-sm text-red-600 mt-1">{error}</p>
              )}
            </div>

            <button
              onClick={handleSendCode}
              disabled={isLoading || phoneNumber.length < 10}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm md:text-base flex items-center justify-center gap-2 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors touch-manipulation"
            >
              {isLoading ? (
                'Enviando...'
              ) : (
                <>
                  Enviar Código
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Info do telefone */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 flex items-center gap-2 md:gap-3">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <Phone className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Código enviado para</p>
                <p className="text-xs md:text-sm font-semibold text-gray-900 truncate">{phoneNumber}</p>
              </div>
            </div>

            {/* Código de teste */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800 text-center leading-relaxed">
                💡 <strong>Código de teste:</strong> Use <span className="bg-yellow-200 px-2 py-1 rounded font-mono font-bold text-xs md:text-sm">123456</span>
              </p>
            </div>

            {/* Campo de código */}
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-3 text-center">
                Digite o código de 6 dígitos
              </label>
              
              {/* Inputs individuais para cada dígito */}
              <div className="flex gap-2 md:gap-3 justify-center px-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={code[index] || ''}
                    onChange={(e) => {
                      const newCode = code.split('');
                      newCode[index] = e.target.value.replace(/\D/g, '');
                      setCode(newCode.join(''));
                      setError(''); // Limpar erro ao digitar
                      // Auto-focus no próximo campo
                      if (e.target.value && index < 5) {
                        const nextInput = document.getElementById(`code-${index + 1}`);
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !code[index] && index > 0) {
                        const prevInput = document.getElementById(`code-${index - 1}`);
                        prevInput?.focus();
                      }
                    }}
                    id={`code-${index}`}
                    className={`w-12 h-14 md:w-14 md:h-16 text-center text-xl md:text-2xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all touch-manipulation ${
                      code[index] 
                        ? 'bg-blue-50 border-blue-600 text-gray-900' 
                        : 'border-gray-300 text-gray-400'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-xs md:text-sm text-gray-500 text-center mt-4">
                Não recebeu o código?{' '}
                {resendTimer > 0 ? (
                  <span className="text-gray-500">
                    Reenviar em {resendTimer}s
                  </span>
                ) : (
                  <button 
                    onClick={handleSendCode}
                    className="text-blue-600 font-semibold hover:text-blue-700 active:text-blue-800"
                  >
                    Reenviar código
                  </button>
                )}
              </p>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 md:p-4">
                <p className="text-xs md:text-sm text-red-800 text-center">{error}</p>
              </div>
            )}

            {/* Botões */}
            <button
              onClick={handleVerifyCode}
              disabled={isLoading || code.length !== 6}
              className="w-full bg-blue-600 text-white py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl touch-manipulation"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </span>
              ) : (
                'Verificar e Entrar'
              )}
            </button>

            <button
              onClick={() => {
                setStep('phone');
                setCode('');
              }}
              className="w-full text-gray-600 py-2.5 md:py-3 font-medium hover:text-gray-900 active:text-gray-700 transition-colors text-sm md:text-base touch-manipulation"
            >
              ← Voltar e alterar número
            </button>
          </div>
        )}

        {/* Step: Completar Cadastro */}
        {step === 'complete' && (
          <div className="space-y-4 md:space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 md:p-4">
                <p className="text-xs md:text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Digite seu nome completo"
                className="w-full px-4 py-3 md:py-3.5 border border-gray-300 rounded-lg text-base md:text-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none touch-manipulation"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                className="w-full px-4 py-3 md:py-3.5 border border-gray-300 rounded-lg text-base md:text-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none touch-manipulation"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Tipo de Conta
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-4 py-3 md:py-3.5 border border-gray-300 rounded-lg text-base md:text-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none touch-manipulation"
              >
                <option value="CLIENTE">Cliente</option>
                <option value="COMERCIAL">Comercial</option>
              </select>
            </div>

            <button
              onClick={handleCompleteRegistration}
              disabled={isLoading || !formData.nome || !formData.dataNascimento || !formData.tipo}
              className="w-full bg-blue-600 text-white py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl touch-manipulation"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </span>
              ) : (
                'Finalizar Cadastro'
              )}
            </button>
          </div>
        )}

        <div className="mt-6 md:mt-8 text-center text-xs md:text-sm text-gray-500">
          <p>Ao continuar, você concorda com nossos</p>
          <p>
            <button className="text-blue-600 hover:text-blue-700 active:text-blue-800">Termos de Uso</button> e{' '}
            <button className="text-blue-600 hover:text-blue-700 active:text-blue-800">Política de Privacidade</button>
          </p>
        </div>
      </div>
    </div>
  );
}

