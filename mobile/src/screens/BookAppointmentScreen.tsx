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
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { Car, Unit, Service, CreateAppointmentData } from '../types';
import { useNavigation } from '@react-navigation/native';

interface BookAppointmentScreenProps {
  route: {
    params: {
      selectedCar: Car;
      selectedUnit: Unit;
      selectedServices: Service[];
      totalPrice: number;
    };
  };
}

const BookAppointmentScreen: React.FC<BookAppointmentScreenProps> = ({ route }) => {
  const { addAppointment } = useApp();
  const navigation = useNavigation();
  
  // Verificar se os parâmetros existem, senão usar valores padrão
  const params = route?.params || {};
  const selectedCar = params.selectedCar;
  const selectedUnit = params.selectedUnit;
  const selectedServices = params.selectedServices || [];
  const totalPrice = params.totalPrice || 0;
  
  // Verificar se todos os dados necessários estão disponíveis
  if (!selectedCar || !selectedUnit || !selectedServices || selectedServices.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
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
      </SafeAreaView>
    );
  }
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [isLoading, setIsLoading] = useState(false);
  
  const theme = useTheme();

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

  const handleDateChange = (event: any, date?: Date) => {
    // setShowDatePicker(false); // This line was removed
    if (date) {
      setSelectedDate(date);
    }
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
        services: selectedServices.map((s: Service) => s.id),
      };

      addAppointment(appointmentData);

      // Show success message
      console.log('Agendamento realizado com sucesso!');

      // Navegar para a tela de confirmação ou home
      navigation.navigate('HomeTab' as never);
    } catch (error) {
      // Show error message
      console.log('Erro ao realizar agendamento');
    } finally {
      setIsLoading(false);
    }
  };

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
              <Text style={styles.title}>Confirmar Agendamento</Text>
              <Text style={styles.subtitle}>
                Revise os detalhes e confirme seu agendamento
              </Text>
            </View>

            {/* Car Information */}
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <MaterialIcons name="directions-car" size={24} color={theme.colors.primary} />
                  <Text style={styles.cardTitle}>Veículo Selecionado</Text>
                </View>
                <Text style={styles.carInfo}>
                  {selectedCar.modelo} - {selectedCar.placa}
                </Text>
                <Chip mode="outlined" style={styles.porteChip}>
                  {selectedCar.porte}
                </Chip>
              </Card.Content>
            </Card>

            {/* Unit Information */}
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <MaterialIcons name="location-on" size={24} color={theme.colors.primary} />
                  <Text style={styles.cardTitle}>Unidade Selecionada</Text>
                </View>
                <Text style={styles.unitInfo}>
                  {selectedUnit.nome}
                </Text>
                <Text style={styles.unitAddress}>
                  {selectedUnit.endereco}
                </Text>
              </Card.Content>
            </Card>

            {/* Services Information */}
            <Card style={styles.card}>
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
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.cardTitle}>Data e Horário</Text>
                
                {/* Date Selection */}
                <View style={styles.selectionRow}>
                  <Text style={styles.selectionLabel}>Data:</Text>
                  <Button
                    mode="outlined"
                    onPress={handleDatePress}
                    style={styles.selectionButton}
                    icon="calendar"
                  >
                    <Text style={styles.selectionButtonText}>
                      {formatDate(selectedDate)}
                    </Text>
                    <MaterialIcons name="calendar-today" size={20} color={theme.colors.primary} />
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

            {/* Confirm Button */}
            <Button
              mode="contained"
              onPress={handleConfirmBooking}
              loading={isLoading}
              disabled={isLoading}
              style={styles.confirmButton}
            >
              {isLoading ? 'Confirmando...' : 'Confirmar Agendamento'}
            </Button>
          </View>
        </ScrollView>
      </View>

      {/* Remover o DatePicker problemático */}
      {/* <DatePicker ... /> */}
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
  card: {
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
  carInfo: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  porteChip: {
    alignSelf: 'flex-start',
  },
  unitInfo: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  unitAddress: {
    fontSize: 14,
    color: '#6b7280',
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
    color: '#1f2937',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 10,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 5,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    width: '100%',
    paddingVertical: 10,
  },
});

export default BookAppointmentScreen;
