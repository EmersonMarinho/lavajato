import React, { useState, useEffect } from 'react';
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
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { Service, Car } from '../types';
import { useNavigation } from '@react-navigation/native';

interface SelectServicesScreenProps {
  route: {
    params: {
      selectedCar: Car;
      onServicesSelect: (services: Service[], totalPrice: number) => void;
    };
  };
}

const SelectServicesScreen: React.FC<SelectServicesScreenProps> = ({ route }) => {
  const { services, calculatePrice } = useApp();
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigation = useNavigation();
  const theme = useTheme();

  const { selectedCar } = route.params;

  useEffect(() => {
    updateTotalPrice();
  }, [selectedServices]);

  const updateTotalPrice = () => {
    const serviceIds = selectedServices.map(s => s.id);
    const total = calculatePrice(serviceIds, selectedCar.porte);
    setTotalPrice(total);
  };

  const handleServiceToggle = (service: Service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    
    if (isSelected) {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const handleConfirm = () => {
    if (selectedServices.length === 0) {
      // Show error message
      console.log('Selecione pelo menos um serviço');
      return;
    }

    // Calcular preço total
    const totalPrice = calculatePrice(selectedServices.map(s => s.id), selectedCar.porte);
    
    // Navegar para a tela de checkout
    navigation.navigate('Checkout' as never);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getPorteColor = (porte: string) => {
    switch (porte) {
      case 'PEQUENO':
        return '#10b981';
      case 'MEDIO':
        return '#f59e0b';
      case 'GRANDE':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPorteLabel = (porte: string) => {
    switch (porte) {
      case 'PEQUENO':
        return 'Pequeno';
      case 'MEDIO':
        return 'Médio';
      case 'GRANDE':
        return 'Grande';
      default:
        return porte;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Selecionar Serviços</Text>
            <Text style={styles.subtitle}>
              Escolha os serviços para seu {selectedCar.modelo}
            </Text>
          </View>

          {/* Car Info */}
          <Card style={styles.carCard}>
            <Card.Content>
              <View style={styles.carInfo}>
                <MaterialIcons name="directions-car" size={24} color={theme.colors.primary} />
                <View style={styles.carDetails}>
                  <Text style={styles.carModel}>{selectedCar.modelo}</Text>
                  <Text style={styles.carPlate}>{selectedCar.placa}</Text>
                </View>
                <Chip
                  mode="flat"
                  textStyle={{ color: 'white' }}
                  style={[
                    styles.porteChip,
                    { backgroundColor: getPorteColor(selectedCar.porte) }
                  ]}
                >
                  {getPorteLabel(selectedCar.porte)}
                </Chip>
              </View>
            </Card.Content>
          </Card>

          {/* Services List */}
          <View style={styles.servicesList}>
            <Text style={styles.servicesTitle}>Serviços Disponíveis</Text>
            {services.map((service) => {
              const isSelected = selectedServices.some(s => s.id === service.id);
              const servicePrice = calculatePrice([service.id], selectedCar.porte);
              
              return (
                <TouchableOpacity
                  key={service.id}
                  onPress={() => handleServiceToggle(service)}
                >
                  <Card style={[
                    styles.serviceCard,
                    isSelected && styles.selectedCard
                  ]}>
                    <Card.Content>
                      <View style={styles.serviceInfo}>
                        <MaterialIcons name="build" size={24} color={theme.colors.primary} />
                        <View style={styles.serviceDetails}>
                          <Text style={styles.serviceName}>{service.nome}</Text>
                          <Text style={styles.serviceDescription}>
                            Preço base: {formatCurrency(service.preco_base)}
                          </Text>
                          <Text style={styles.servicePrice}>
                            Total: {formatCurrency(servicePrice)}
                          </Text>
                        </View>
                        {isSelected && (
                          <MaterialIcons name="check-circle" size={24} color={theme.colors.primary} />
                        )}
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Total Price */}
          <Card style={styles.totalCard}>
            <Card.Content>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Selecionado:</Text>
                <Text style={styles.totalPrice}>
                  {formatCurrency(totalPrice)}
                </Text>
              </View>
              <Text style={styles.totalNote}>
                * Preços ajustados conforme o porte do veículo
              </Text>
            </Card.Content>
          </Card>

          {/* Confirm Button */}
          <Button
            mode="contained"
            onPress={handleConfirm}
            disabled={selectedServices.length === 0}
            style={styles.confirmButton}
          >
            Confirmar Serviços ({selectedServices.length})
          </Button>
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
  carCard: {
    backgroundColor: 'white',
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
    marginBottom: 4,
  },
  carPlate: {
    fontSize: 14,
    color: '#6b7280',
  },
  porteChip: {
    alignSelf: 'flex-start',
  },
  servicesList: {
    gap: 12,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  serviceCard: {
    backgroundColor: 'white',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#3b82f6',
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
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  totalCard: {
    backgroundColor: 'white',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  totalNote: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  confirmButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default SelectServicesScreen;
