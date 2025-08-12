'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/schemas';
import { authAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Phone, Lock, AlertCircle } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleSendCode = async (data: { phoneNumber: string }) => {
    setIsLoading(true);
    setError('');
    
    try {
      await authAPI.sendCode(data.phoneNumber);
      setPhoneNumber(data.phoneNumber);
      setStep('code');
      reset();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao enviar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const authResponse = await authAPI.verifyCode({
        phoneNumber,
        verificationCode: data.verificationCode,
      });
      login(authResponse);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Código inválido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setPhoneNumber('');
    setError('');
    reset();
  };

  if (step === 'code') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verificar Código
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Digite o código enviado para {phoneNumber}
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleVerifyCode)}>
            <div>
              <label htmlFor="verificationCode" className="sr-only">
                Código de Verificação
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('verificationCode')}
                  type="text"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Digite o código de 6 dígitos"
                />
              </div>
              {errors.verificationCode && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.verificationCode.message}
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verificando...' : 'Verificar Código'}
              </button>
              
              <button
                type="button"
                onClick={handleBackToPhone}
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                ← Voltar para número de telefone
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Painel Administrativo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Faça login com seu número de telefone
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSendCode)}>
          <div>
            <label htmlFor="phoneNumber" className="sr-only">
              Número de Telefone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('phoneNumber')}
                type="tel"
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="(11) 99999-9999"
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enviando...' : 'Enviar Código'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
