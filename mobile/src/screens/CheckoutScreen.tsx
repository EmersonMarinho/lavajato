import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Chip,
  Divider,
  useTheme,
  ProgressBar,
  TextInput,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { Car, Unit, Service, CreateAppointmentData } from '../types';
import { useNavigation } from '@react-navigation/native';

interface CheckoutScreenProps {
  route: {
    params: {
      selectedCar: Car;
      selectedUnit: Unit;
      selectedServices: Service[];
      totalPrice: number;
    };
  };
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ route }) => {
  const { addAppointment, currentAppointment, clearCurrentAppointment } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Serviço de busca e entrega
  const [incluiBuscaEntrega, setIncluiBuscaEntrega] = useState(false);
  const [enderecoBusca, setEnderecoBusca] = useState('');
  const [observacoesBusca, setObservacoesBusca] = useState('');
  
  const navigation = useNavigation();
  const theme = useTheme();

  // Usar dados do contexto se disponível, senão usar route params
  const params = route?.params || {};
  const appointmentData = currentAppointment || params;
  const selectedCar = appointmentData?.selectedCar;
  const selectedUnit = appointmentData?.selectedUnit;
  const selectedServices = appointmentData?.selectedServices || [];
  const totalPrice = appointmentData?.totalPrice || 0;

  // Verificar se todos os dados necessários estão disponíveis
  if (!selectedCar || !selectedUnit || !selectedServices || selectedServices.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={64} color="#ef4444" />
          <Text style={styles.errorTitle}>Dados Incompletos</Text>
          <Text style={styles.errorSubtitle}>
            Alguns dados do agendamento estão faltando
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          >
            Voltar
          </Button>
        </View>
      </View>
    );
  }

  const availableTimes = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleDatePress = () => {
    // Solução simples usando apenas componentes nativos
    Alert.alert(
      'Selecionar Data',
      'Escolha uma data para o agendamento',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Hoje',
          onPress: () => setSelectedDate(new Date()),
        },
        {
          text: 'Amanhã',
          onPress: () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setSelectedDate(tomorrow);
          },
        },
        {
          text: 'Próxima Semana',
          onPress: () => {
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            setSelectedDate(nextWeek);
          },
        },
        {
          text: 'Próximo Mês',
          onPress: () => {
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            setSelectedDate(nextMonth);
          },
        },
      ]
    );
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);

    try {
      const appointmentData: CreateAppointmentData = {
        car_id: selectedCar.id,
        unit_id: selectedUnit.id,
        data: selectedDate.toISOString().split('T')[0],
        hora: selectedTime,
        services: selectedServices.map(s => s.id),
        inclui_busca_entrega: incluiBuscaEntrega,
        endereco_busca: enderecoBusca || undefined,
        observacoes_busca: observacoesBusca || undefined,
      };

      addAppointment(appointmentData);

      // Limpar dados do contexto
      clearCurrentAppointment();

      // Show success message
      console.log('Agendamento realizado com sucesso!');
      setIsCompleted(true);

      // Aguardar um pouco para mostrar a confirmação
      setTimeout(() => {
        navigation.navigate('HomeTab' as never);
      }, 3000);
    } catch (error) {
      console.log('Erro ao realizar agendamento');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <MaterialIcons name="check-circle" size={120} color="#10b981" />
          <Text style={styles.successTitle}>Agendamento Confirmado!</Text>
          <Text style={styles.successSubtitle}>
            Seu agendamento foi realizado com sucesso
          </Text>
          <Text style={styles.successDetails}>
            {formatDate(selectedDate)} às {selectedTime}
          </Text>
          <Text style={styles.successDetails}>
            {selectedUnit.nome}
          </Text>
          <Text style={styles.successDetails}>
            Total: {formatCurrency(totalPrice)}
          </Text>
          <Text style={styles.successMessage}>
            Você receberá uma confirmação por SMS
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Finalizar Agendamento</Text>
              <Text style={styles.subtitle}>
                Revise os detalhes e confirme seu agendamento
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <ProgressBar progress={1} color={theme.colors.primary} />
              <Text style={styles.progressText}>
                Passo 4 de 4 - Finalizar
              </Text>
            </View>

            {/* Summary Cards */}
            <Card style={styles.summaryCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <MaterialIcons name="directions-car" size={24} color={theme.colors.primary} />
                  <Text style={styles.cardTitle}>Veículo</Text>
                </View>
                <Text style={styles.cardContent}>
                  {selectedCar.modelo} - {selectedCar.placa}
                </Text>
                <Chip mode="outlined" style={styles.porteChip}>
                  {selectedCar.porte}
                </Chip>
              </Card.Content>
            </Card>

            <Card style={styles.summaryCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <MaterialIcons name="location-on" size={24} color={theme.colors.primary} />
                  <Text style={styles.cardTitle}>Unidade</Text>
                </View>
                <Text style={styles.cardContent}>
                  {selectedUnit.nome}
                </Text>
                <Text style={styles.cardSubcontent}>
                  {selectedUnit.endereco}
                </Text>
              </Card.Content>
            </Card>

            <Card style={styles.summaryCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <MaterialIcons name="build" size={24} color={theme.colors.primary} />
                  <Text style={styles.cardTitle}>Serviços Selecionados</Text>
                </View>
                <View style={styles.servicesList}>
                  {selectedServices.map((service, index) => (
                    <View key={service.id} style={styles.serviceItem}>
                      <Text style={styles.serviceName}>{service.nome}</Text>
                      <Text style={styles.servicePrice}>
                        {formatCurrency(service.preco_base)}
                      </Text>
                    </View>
                  ))}
                </View>
                <Divider style={styles.divider} />
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalPrice}>
                    {formatCurrency(totalPrice)}
                  </Text>
                </View>
              </Card.Content>
            </Card>

            {/* Date and Time Selection */}
            <Card style={styles.summaryCard}>
              <Card.Content>
                <Text style={styles.cardTitle}>Data e Horário</Text>
                
                {/* Date Selection */}
                <View style={styles.selectionRow}>
                  <Text style={styles.selectionLabel}>Data:</Text>
                  <Button
                    mode="outlined"
                    onPress={handleDatePress}
                    style={styles.dateButton}
                    icon="calendar"
                  >
                    {selectedDate.toLocaleDateString('pt-BR')}
                  </Button>
                </View>

                {/* Time Selection */}
                <View style={styles.selectionRow}>
                  <Text style={styles.selectionLabel}>Horário:</Text>
                  <View style={styles.timeGrid}>
                    {availableTimes.map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={[
                          styles.timeButton,
                          selectedTime === time && styles.timeButtonSelected
                        ]}
                        onPress={() => handleTimeSelect(time)}
                      >
                        <Text style={[
                          styles.timeButtonText,
                          selectedTime === time && styles.timeButtonTextSelected
                        ]}>
                          {time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Pickup and Delivery Service */}
            <Card style={styles.summaryCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <MaterialIcons name="local-shipping" size={24} color={theme.colors.primary} />
                  <Text style={styles.cardTitle}>Serviço de Busca e Entrega</Text>
                </View>
                
                <View style={styles.serviceOption}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setIncluiBuscaEntrega(!incluiBuscaEntrega)}
                  >
                    <MaterialIcons
                      name={incluiBuscaEntrega ? "check-box" : "check-box-outline-blank"}
                      size={24}
                      color={incluiBuscaEntrega ? theme.colors.primary : '#6b7280'}
                    />
                    <Text style={styles.checkboxLabel}>
                      Buscar e entregar o carro no meu endereço
                    </Text>
                  </TouchableOpacity>
                  
                  {incluiBuscaEntrega && (
                    <View style={styles.pickupDetails}>
                      <Text style={styles.pickupInfo}>
                        💰 Custo adicional: R$ 50,00
                      </Text>
                      
                      <TextInput
                        label="Endereço para busca (opcional)"
                        value={enderecoBusca}
                        onChangeText={setEnderecoBusca}
                        style={styles.input}
                        mode="outlined"
                        placeholder="Deixe em branco para usar o endereço do perfil"
                      />
                      
                      <TextInput
                        label="Observações para busca/entrega"
                        value={observacoesBusca}
                        onChangeText={setObservacoesBusca}
                        style={styles.input}
                        mode="outlined"
                        placeholder="Ex: Portão azul, tocar interfone"
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  )}
                </View>
              </Card.Content>
            </Card>

            {/* Final Confirmation Button */}
            <Button
              mode="contained"
              onPress={handleConfirmBooking}
              loading={isLoading}
              disabled={isLoading}
              style={styles.confirmButton}
              icon="check"
            >
              {isLoading ? 'Confirmando...' : 'Confirmar Agendamento'}
            </Button>

            {/* Back Button */}
            <Button
              mode="text"
              onPress={() => navigation.goBack()}
              disabled={isLoading}
              style={styles.backButton}
              icon="arrow-left"
            >
              Voltar
            </Button>
          </View>
        </ScrollView>

        {/* Remover o DatePicker problemático */}
        {/* <DatePicker ... /> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  header: {
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  progressContainer: {
    gap: 12,
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  cardContent: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  cardSubcontent: {
    fontSize: 14,
    color: '#6b7280',
  },
  porteChip: {
    alignSelf: 'flex-start',
  },
  servicesList: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 16,
    color: '#374151',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  divider: {
    marginVertical: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  selectionRow: {
    marginBottom: 16,
  },
  selectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
  },
  selectionButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  timeButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  timeButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  timeButtonTextSelected: {
    color: 'white',
  },
  confirmButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 8,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'white',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 18,
    color: '#374151',
    marginBottom: 24,
    textAlign: 'center',
  },
  successDetails: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'white',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 24,
  },
  serviceOption: {
    marginTop: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  pickupDetails: {
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pickupInfo: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});

export default CheckoutScreen;
