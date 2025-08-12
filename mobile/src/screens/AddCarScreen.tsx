import React, { useState } from 'react';
import {
  View,
  ScrollView,
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
  SegmentedButtons,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { CreateCarData } from '../types';
import { useNavigation } from '@react-navigation/native';

const AddCarScreen: React.FC = () => {
  const [formData, setFormData] = useState<CreateCarData>({
    modelo: '',
    placa: '',
    porte: 'PEQUENO',
  });
  const [errors, setErrors] = useState<Partial<CreateCarData>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { addCar } = useApp();
  const navigation = useNavigation();
  const theme = useTheme();

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateCarData> = {};

    if (!formData.modelo.trim()) {
      newErrors.modelo = 'Modelo é obrigatório';
    }

    if (!formData.placa.trim()) {
      newErrors.placa = 'Placa é obrigatória';
    } else if (formData.placa.length < 6) {
      newErrors.placa = 'Placa deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      addCar(formData);
      
      // Show success message (you can implement a toast system)
      console.log('Carro cadastrado com sucesso!');

      // Limpar formulário
      setFormData({
        modelo: '',
        placa: '',
        porte: 'PEQUENO',
      });

      // Voltar para a tela anterior
      navigation.goBack();
    } catch (error) {
      // Show error message
      console.log('Erro ao cadastrar carro');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof CreateCarData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar Carro</Text>
            <Text style={styles.subtitle}>
              Cadastre seu veículo para fazer agendamentos
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Modelo */}
            <TextInput
              mode="outlined"
              label="Modelo do Veículo"
              placeholder="Ex: Honda Civic"
              value={formData.modelo}
              onChangeText={(value) => updateFormData('modelo', value)}
              style={styles.input}
              error={!!errors.modelo}
            />
            {errors.modelo && (
              <HelperText type="error" visible={!!errors.modelo}>
                {errors.modelo}
              </HelperText>
            )}

            {/* Placa */}
            <TextInput
              mode="outlined"
              label="Placa"
              placeholder="Ex: ABC-1234"
              value={formData.placa}
              onChangeText={(value) => updateFormData('placa', value.toUpperCase())}
              style={styles.input}
              error={!!errors.placa}
              autoCapitalize="characters"
            />
            {errors.placa && (
              <HelperText type="error" visible={!!errors.placa}>
                {errors.placa}
              </HelperText>
            )}

            {/* Porte */}
            <View style={styles.porteContainer}>
              <Text style={styles.porteLabel}>Porte do Veículo</Text>
              <SegmentedButtons
                value={formData.porte}
                onValueChange={(value) => updateFormData('porte', value)}
                buttons={[
                  { value: 'PEQUENO', label: 'Pequeno' },
                  { value: 'MEDIO', label: 'Médio' },
                  { value: 'GRANDE', label: 'Grande' },
                ]}
                style={styles.segmentedButtons}
              />
            </View>

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.submitButton}
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar Carro'}
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    gap: 16,
  },
  input: {
    fontSize: 16,
  },
  porteContainer: {
    gap: 8,
  },
  porteLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  segmentedButtons: {
    marginTop: 8,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default AddCarScreen;
