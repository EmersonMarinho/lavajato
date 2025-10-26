'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Phone, KeyRound, ArrowRight } from 'lucide-react';

export default function ClienteLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

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

    // Validar código de teste
    if (code !== '123456') {
      setError('Código inválido. Use 123456 para teste.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      // Limpar formatação do telefone
      const digits = phoneNumber.replace(/\D/g, '');
      
      // Chamar o backend para verificar código e fazer login
      const response = await fetch('http://localhost:3001/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: digits,
          verificationCode: code
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Usar o contexto de autenticação com dados reais do backend
        login({
          user: data.user,
          accessToken: data.accessToken
        });
        
        setIsLoading(false);
        
        // Redirecionar sem recarregar a página
        router.push('/cliente');
      } else {
        const errorData = await response.json();
        setIsLoading(false);
        setError(errorData.message || 'Código inválido. Tente novamente.');
        setCode('');
      }
    } catch (error) {
      setIsLoading(false);
      setError('Erro ao verificar. Tente novamente.');
      setCode('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Phone className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lavajato App</h1>
          <p className="text-gray-600">
            {step === 'phone' 
              ? 'Entre com seu número de telefone'
              : `Digite o código enviado para ${phoneNumber}`}
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-900">Código enviado com sucesso!</p>
                <p className="text-xs text-green-700">Verifique seu telefone</p>
              </div>
            </div>
          </div>
        )}

        {step === 'phone' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Telefone
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg text-lg text-gray-900 placeholder:text-gray-400 ${
                    error 
                      ? 'border-red-300 focus:ring-red-600' 
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent'
                  }`}
                  maxLength={15}
                />
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
              )}
            </div>

            <button
              onClick={handleSendCode}
              disabled={isLoading || phoneNumber.length < 10}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                'Enviando...'
              ) : (
                <>
                  Enviar Código
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Info do telefone */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Código enviado para</p>
                <p className="text-sm font-semibold text-gray-900">{phoneNumber}</p>
              </div>
            </div>

            {/* Código de teste */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800 text-center">
                💡 <strong>Código de teste:</strong> Use <span className="bg-yellow-200 px-2 py-1 rounded font-mono font-bold">123456</span>
              </p>
            </div>

            {/* Campo de código */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Digite o código de 6 dígitos
              </label>
              
              {/* Inputs individuais para cada dígito */}
              <div className="flex gap-2 justify-center">
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
                    className={`w-14 h-16 text-center text-2xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all ${
                      code[index] 
                        ? 'bg-blue-50 border-blue-600 text-gray-900' 
                        : 'border-gray-300 text-gray-400'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-sm text-gray-500 text-center mt-4">
                Não recebeu o código?{' '}
                <button className="text-blue-600 font-semibold hover:text-blue-700">
                  Reenviar em 59s
                </button>
              </p>
            </div>

            {/* Botões */}
            <button
              onClick={handleVerifyCode}
              disabled={isLoading || code.length !== 6}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
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
              className="w-full text-gray-600 py-3 font-medium hover:text-gray-900 transition-colors"
            >
              ← Voltar e alterar número
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Ao continuar, você concorda com nossos</p>
          <p>
            <button className="text-blue-600">Termos de Uso</button> e{' '}
            <button className="text-blue-600">Política de Privacidade</button>
          </p>
        </div>
      </div>
    </div>
  );
}

