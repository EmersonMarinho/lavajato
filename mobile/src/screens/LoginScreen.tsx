import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; code?: string }>({});
  
  const { signIn } = useAuth();
  const theme = useTheme();

  const handleSendCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrors({ phone: 'Número de telefone inválido' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simular envio de código (em produção, usar Firebase)
      setTimeout(() => {
        setVerificationId('mock-verification-id');
        setStep('code');
        setIsLoading(false);
        // Show success message (you can implement a toast system)
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      // Show error message
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length < 4) {
      setErrors({ code: 'Código inválido' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log('Verificando código:', verificationCode);
      
      // Simular verificação (em produção, usar Firebase)
      setTimeout(() => {
        console.log('Código verificado com sucesso!');
        const mockUser = {
          id: 'user-123',
          nome: 'Usuário Teste',
          telefone: phoneNumber,
          pontos_fidelidade: 100,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        console.log('Fazendo login com usuário:', mockUser);
        signIn(mockUser);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      setIsLoading(false);
      setErrors({ code: 'Erro ao verificar código' });
    }
  };

  const handleBackToPhone = () => {
    setStep('code');
    setVerificationCode('');
    setErrors({});
  };

  if (step === 'code') {
    return (
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="phone-iphone" size={64} color={theme.colors.primary} />
            <Text style={styles.title}>Verificar Código</Text>
            <Text style={styles.subtitle}>
              Digite o código enviado para {phoneNumber}
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              mode="outlined"
              label="Código de Verificação"
              placeholder="123456"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="numeric"
              maxLength={6}
              style={styles.input}
              error={!!errors.code}
            />
            {errors.code && (
              <HelperText type="error" visible={!!errors.code}>
                {errors.code}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleVerifyCode}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              {isLoading ? 'Verificando...' : 'Verificar Código'}
            </Button>

            <Button
              mode="text"
              onPress={handleBackToPhone}
              disabled={isLoading}
              style={styles.secondaryButton}
            >
              Voltar
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="local-car-wash" size={64} color={theme.colors.primary} />
          <Text style={styles.title}>Lavajato App</Text>
          <Text style={styles.subtitle}>
            Faça login com seu número de telefone
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            mode="outlined"
            label="Número de Telefone"
            placeholder="(11) 99999-9999"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
            style={styles.input}
            error={!!errors.phone}
          />
          {errors.phone && (
            <HelperText type="error" visible={!!errors.phone}>
              {errors.phone}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleSendCode}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            {isLoading ? 'Enviando...' : 'Enviar Código'}
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  input: {
    fontSize: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  secondaryButton: {
    marginTop: 8,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LoginScreen;
