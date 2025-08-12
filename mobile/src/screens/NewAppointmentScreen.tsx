import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Chip,
  Divider,
  useTheme,
  ProgressBar,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { Car, Unit, Service } from '../types';
import { useNavigation } from '@react-navigation/native';

interface NewAppointmentScreenProps {
  route?: {
    params?: {
      selectedCar?: Car;
    };
  };
}

const NewAppointmentScreen: React.FC<NewAppointmentScreenProps> = ({ route }) => {
  const { cars, setCurrentAppointment } = useApp();
  const [selectedCar, setSelectedCar] = useState<Car | null>(route?.params?.selectedCar || null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentStep, setCurrentStep] = useState<'car' | 'unit' | 'services' | 'checkout'>('car');
  
  const navigation = useNavigation();
  const theme = useTheme();

  const handleCarSelect = (car: Car) => {
    setSelectedCar(car);
    setCurrentStep('unit');
  };

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
    setCurrentStep('services');
  };

  const handleServicesSelect = (services: Service[], price: number) => {
    setSelectedServices(services);
    setTotalPrice(price);
    setCurrentStep('checkout');
  };

  const handleContinueToServices = () => {
    if (!selectedCar) return;
    navigation.navigate('SelectServices' as never);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'unit':
        setCurrentStep('car');
        break;
      case 'services':
        setCurrentStep('unit');
        break;
      case 'checkout':
        setCurrentStep('services');
        break;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'car':
        return 'Escolher Carro';
      case 'unit':
        return 'Escolher Unidade';
      case 'services':
        return 'Selecionar Serviços';
      case 'checkout':
        return 'Confirmar Agendamento';
      default:
        return 'Novo Agendamento';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'car':
        return 'Selecione o carro para o serviço';
      case 'unit':
        return 'Escolha onde realizar o serviço';
      case 'services':
        return 'Selecione os serviços desejados';
      case 'checkout':
        return 'Revise e confirme o agendamento';
      default:
        return '';
    }
  };

  const renderCarSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Selecione um Carro</Text>
      <Text style={styles.stepDescription}>
        Escolha o veículo para realizar o serviço
      </Text>
      
      <View style={styles.carsList}>
        {cars.map((car) => (
          <TouchableOpacity
            key={car.id}
            onPress={() => handleCarSelect(car)}
          >
            <Card style={[
              styles.carCard,
              selectedCar?.id === car.id && styles.selectedCard
            ]}>
              <Card.Content>
                <View style={styles.carInfo}>
                  <MaterialIcons name="directions-car" size={24} color={theme.colors.primary} />
                  <View style={styles.carDetails}>
                    <Text style={styles.carModel}>{car.modelo}</Text>
                    <Text style={styles.carPlate}>{car.placa}</Text>
                  </View>
                  <Chip mode="outlined">
                    {car.porte}
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderUnitSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Selecione uma Unidade</Text>
      <Text style={styles.stepDescription}>
        Escolha onde realizar o serviço
      </Text>
      
      <View style={styles.unitsList}>
        {[
          { id: '1', nome: 'Unidade Centro', endereco: 'Rua das Flores, 123', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '2', nome: 'Unidade Norte', endereco: 'Av. Principal, 456', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '3', nome: 'Unidade Sul', endereco: 'Rua do Comércio, 789', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ].map((unit) => (
          <TouchableOpacity
            key={unit.id}
            onPress={() => handleUnitSelect(unit)}
          >
            <Card style={[
              styles.unitCard,
              selectedUnit?.id === unit.id && styles.selectedCard
            ]}>
              <Card.Content>
                <View style={styles.unitInfo}>
                  <MaterialIcons name="location-on" size={24} color={theme.colors.primary} />
                  <View style={styles.unitDetails}>
                    <Text style={styles.unitName}>{unit.nome}</Text>
                    <Text style={styles.unitAddress}>{unit.endereco}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      {selectedUnit && (
        <Button
          mode="contained"
          onPress={handleContinueToServices}
          style={styles.continueButton}
        >
          Continuar para Serviços
        </Button>
      )}
    </View>
  );

  const renderServicesSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Selecione os Serviços</Text>
      <Text style={styles.stepDescription}>
        Escolha os serviços desejados
      </Text>
      
      <View style={styles.servicesList}>
        {[
          { id: '1', nome: 'Lavagem Completa', preco_base: 50, adicional_por_porte: 10, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '2', nome: 'Cera', preco_base: 30, adicional_por_porte: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '3', nome: 'Aspiração', preco_base: 20, adicional_por_porte: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '4', nome: 'Lavagem do Motor', preco_base: 40, adicional_por_porte: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ].map((service) => (
          <TouchableOpacity
            key={service.id}
            onPress={() => {
              const isSelected = selectedServices.some(s => s.id === service.id);
              if (isSelected) {
                setSelectedServices(prev => prev.filter(s => s.id !== service.id));
                setTotalPrice(prev => prev - service.preco_base);
              } else {
                setSelectedServices(prev => [...prev, service]);
                setTotalPrice(prev => prev + service.preco_base);
              }
            }}
          >
            <Card style={[
              styles.serviceCard,
              selectedServices.some(s => s.id === service.id) && styles.selectedCard
            ]}>
              <Card.Content>
                <View style={styles.serviceInfo}>
                  <MaterialIcons name="build" size={24} color={theme.colors.primary} />
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceName}>{service.nome}</Text>
                    <Text style={styles.servicePrice}>
                      R$ {service.preco_base.toFixed(2)}
                    </Text>
                  </View>
                  {selectedServices.some(s => s.id === service.id) && (
                    <MaterialIcons name="check-circle" size={24} color={theme.colors.primary} />
                  )}
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      {selectedServices.length > 0 && (
        <Button
          mode="contained"
          onPress={() => setCurrentStep('checkout')}
          style={styles.continueButton}
        >
          Continuar para Checkout ({selectedServices.length} serviço{selectedServices.length !== 1 ? 's' : ''})
        </Button>
      )}
    </View>
  );

  const renderBookingConfirmation = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Resumo do Agendamento</Text>
      <Text style={styles.stepDescription}>
        Revise os detalhes antes de continuar
      </Text>
      
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.summaryTitle}>Resumo do Agendamento</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Carro:</Text>
            <Text style={styles.summaryValue}>
              {selectedCar?.modelo} - {selectedCar?.placa}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Unidade:</Text>
            <Text style={styles.summaryValue}>{selectedUnit?.nome}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Serviços:</Text>
            <Text style={styles.summaryValue}>
              {selectedServices.map(s => s.nome).join(', ')}
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total:</Text>
            <Text style={styles.summaryTotal}>
              R$ {totalPrice.toFixed(2)}
            </Text>
          </View>
        </Card.Content>
      </Card>
      
      <Button
        mode="contained"
        onPress={() => {
          if (selectedCar && selectedUnit && selectedServices.length > 0) {
            setCurrentAppointment({
              selectedCar,
              selectedUnit,
              selectedServices,
              totalPrice,
            });
            navigation.navigate('Checkout' as never);
          }
        }}
        style={styles.confirmButton}
        disabled={!selectedCar || !selectedUnit || selectedServices.length === 0}
      >
        Continuar para Checkout
      </Button>
    </View>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 'car':
        return renderCarSelection();
      case 'unit':
        return renderUnitSelection();
      case 'services':
        return renderServicesSelection();
      case 'checkout':
        return renderBookingConfirmation();
      default:
        return null;
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'car':
        return 0.25;
      case 'unit':
        return 0.5;
      case 'services':
        return 0.75;
      case 'checkout':
        return 1;
      default:
        return 0;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{getStepTitle()}</Text>
            <Text style={styles.subtitle}>{getStepDescription()}</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <ProgressBar progress={getStepProgress()} color={theme.colors.primary} />
            <Text style={styles.progressText}>
              Passo {['car', 'unit', 'services', 'checkout'].indexOf(currentStep) + 1} de 4
            </Text>
          </View>

          {/* Back Button */}
          {currentStep !== 'car' && (
            <Button
              mode="text"
              onPress={handleBack}
              icon="arrow-left"
              style={styles.backButton}
            >
              Voltar
            </Button>
          )}

          {/* Step Content */}
          {getCurrentStepContent()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
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
  progressContainer: {
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  stepContainer: {
    gap: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  stepDescription: {
    fontSize: 16,
    color: '#6b7280',
  },
  carsList: {
    gap: 12,
  },
  carCard: {
    backgroundColor: 'white',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  carDetails: {
    flex: 1,
  },
  carModel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  carPlate: {
    fontSize: 14,
    color: '#6b7280',
  },
  unitsList: {
    gap: 12,
  },
  unitCard: {
    backgroundColor: 'white',
  },
  unitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  unitDetails: {
    flex: 1,
  },
  unitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  unitAddress: {
    fontSize: 14,
    color: '#6b7280',
  },
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: 'white',
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  servicePrice: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryCard: {
    backgroundColor: 'white',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
    textAlign: 'right',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  divider: {
    marginVertical: 16,
  },
  confirmButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  continueButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default NewAppointmentScreen;
