import React from 'react';
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
import { Car } from '../types';
import { useNavigation } from '@react-navigation/native';

const CarsScreen: React.FC = () => {
  const { cars } = useApp();
  const navigation = useNavigation();
  const theme = useTheme();

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

  const handleAddCar = () => {
    navigation.navigate('AddCar' as never);
  };

  const handleCarPress = (car: Car) => {
    // Navegar para detalhes do carro ou edição
    console.log('Car pressed:', car.id);
  };

  const handleNewAppointment = (car: Car) => {
    navigation.navigate('NewAppointment' as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Meus Carros</Text>
            <Text style={styles.subtitle}>
              Gerencie seus veículos cadastrados
            </Text>
          </View>

          {/* Cars List */}
          {cars.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <MaterialIcons name="directions-car" size={64} color="#9ca3af" />
                <Text style={styles.emptyTitle}>Nenhum carro cadastrado</Text>
                <Text style={styles.emptySubtitle}>
                  Cadastre seu primeiro veículo para começar!
                </Text>
                <Button
                  mode="contained"
                  onPress={handleAddCar}
                  style={styles.addCarButton}
                  icon="plus"
                >
                  Adicionar Primeiro Carro
                </Button>
              </Card.Content>
            </Card>
          ) : (
            <View style={styles.carsList}>
              {cars.map((car) => (
                <TouchableOpacity
                  key={car.id}
                  onPress={() => handleCarPress(car)}
                >
                  <Card style={styles.carCard}>
                    <Card.Content>
                      {/* Car Info */}
                      <View style={styles.carHeader}>
                        <View style={styles.carInfo}>
                          <Text style={styles.carModel}>{car.modelo}</Text>
                          <Text style={styles.carPlate}>{car.placa}</Text>
                        </View>
                        <Chip
                          mode="flat"
                          textStyle={{ color: 'white' }}
                          style={[
                            styles.porteChip,
                            { backgroundColor: getPorteColor(car.porte) }
                          ]}
                        >
                          {getPorteLabel(car.porte)}
                        </Chip>
                      </View>

                      <Divider style={styles.divider} />

                      {/* Actions */}
                      <View style={styles.actionsContainer}>
                        <Button
                          mode="outlined"
                          onPress={() => handleNewAppointment(car)}
                          style={styles.actionButton}
                          icon="calendar-plus"
                        >
                          Agendar Serviço
                        </Button>
                        <Button
                          mode="text"
                          onPress={() => handleCarPress(car)}
                          style={styles.actionButton}
                          icon="pencil"
                        >
                          Editar
                        </Button>
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Add Car Button */}
          {cars.length > 0 && (
            <Button
              mode="contained"
              onPress={handleAddCar}
              style={styles.addCarButton}
              icon="plus"
            >
              Adicionar Carro
            </Button>
          )}
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
  emptyCard: {
    backgroundColor: 'white',
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  addCarButton: {
    marginTop: 8,
  },
  carsList: {
    gap: 12,
  },
  carCard: {
    backgroundColor: 'white',
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  carInfo: {
    flex: 1,
  },
  carModel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  carPlate: {
    fontSize: 16,
    color: '#6b7280',
  },
  porteChip: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});

export default CarsScreen;
