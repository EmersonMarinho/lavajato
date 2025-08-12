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
  SegmentedButtons,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { Appointment, Car, Unit, Service } from '../types';
import { useNavigation } from '@react-navigation/native';

const AppointmentsScreen: React.FC = () => {
  const { appointments, cars, units, services } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'AGENDADO' | 'EM_ANDAMENTO' | 'FINALIZADO'>('all');
  const navigation = useNavigation();
  const theme = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADO':
        return '#3b82f6';
      case 'EM_ANDAMENTO':
        return '#f59e0b';
      case 'FINALIZADO':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AGENDADO':
        return 'Agendado';
      case 'EM_ANDAMENTO':
        return 'Em Andamento';
      case 'FINALIZADO':
        return 'Finalizado';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AGENDADO':
        return 'schedule';
      case 'EM_ANDAMENTO':
        return 'build';
      case 'FINALIZADO':
        return 'check-circle';
      default:
        return 'help';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (selectedFilter === 'all') return true;
    return appointment.status === selectedFilter;
  });

  const getCarInfo = (carId: string) => {
    return cars.find(car => car.id === carId);
  };

  const getUnitInfo = (unitId: string) => {
    return units.find(unit => unit.id === unitId);
  };

  const getServicesInfo = (appointment: Appointment) => {
    // Em um app real, você teria uma relação entre appointment e services
    // Por enquanto, vamos simular com dados mock
    return ['Lavagem Completa', 'Cera'];
  };

  const handleAppointmentPress = (appointment: Appointment) => {
    // Navegar para detalhes do agendamento
    console.log('Appointment pressed:', appointment.id);
  };

  const handleNewAppointment = () => {
    navigation.navigate('NewAppointment' as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Meus Agendamentos</Text>
            <Text style={styles.subtitle}>
              Gerencie todos os seus agendamentos
            </Text>
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <SegmentedButtons
              value={selectedFilter}
              onValueChange={(value) => setSelectedFilter(value as any)}
              buttons={[
                { value: 'all', label: 'Todos' },
                { value: 'AGENDADO', label: 'Agendados' },
                { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
                { value: 'FINALIZADO', label: 'Finalizados' },
              ]}
              style={styles.segmentedButtons}
            />
          </View>

          {/* Appointments List */}
          {filteredAppointments.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <MaterialIcons name="event-busy" size={64} color="#9ca3af" />
                <Text style={styles.emptyTitle}>Nenhum agendamento encontrado</Text>
                                 <Text style={styles.emptySubtitle}>
                   {selectedFilter === 'all' 
                     ? 'Você ainda não tem agendamentos'
                     : `Nenhum agendamento ${selectedFilter === 'AGENDADO' ? 'agendado' : selectedFilter === 'EM_ANDAMENTO' ? 'em andamento' : 'finalizado'}`
                   }
                 </Text>
                <Button
                  mode="contained"
                  onPress={handleNewAppointment}
                  style={styles.newAppointmentButton}
                >
                  Fazer Primeiro Agendamento
                </Button>
              </Card.Content>
            </Card>
          ) : (
            <View style={styles.appointmentsList}>
              {filteredAppointments.map((appointment) => {
                const car = getCarInfo(appointment.car_id);
                const unit = getUnitInfo(appointment.unit_id);
                const services = getServicesInfo(appointment);

                return (
                  <TouchableOpacity
                    key={appointment.id}
                    onPress={() => handleAppointmentPress(appointment)}
                  >
                    <Card style={styles.appointmentCard}>
                      <Card.Content>
                        {/* Header with Status */}
                        <View style={styles.appointmentHeader}>
                          <View style={styles.appointmentInfo}>
                            <Text style={styles.appointmentDate}>
                              {formatDate(appointment.data)} às {appointment.hora}
                            </Text>
                            <Text style={styles.appointmentPrice}>
                              {formatCurrency(appointment.preco_final)}
                            </Text>
                          </View>
                          <Chip
                            mode="flat"
                            textStyle={{ color: 'white' }}
                            style={[
                              styles.statusChip,
                              { backgroundColor: getStatusColor(appointment.status) }
                            ]}
                          >
                            {getStatusLabel(appointment.status)}
                          </Chip>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Car and Unit Info */}
                        <View style={styles.detailsContainer}>
                          <View style={styles.detailRow}>
                            <MaterialIcons name="directions-car" size={20} color="#6b7280" />
                            <Text style={styles.detailText}>
                              {car?.modelo} - {car?.placa}
                            </Text>
                          </View>
                          <View style={styles.detailRow}>
                            <MaterialIcons name="location-on" size={20} color="#6b7280" />
                            <Text style={styles.detailText}>
                              {unit?.nome}
                            </Text>
                          </View>
                        </View>

                        {/* Services */}
                        <View style={styles.servicesContainer}>
                          <Text style={styles.servicesLabel}>Serviços:</Text>
                          <View style={styles.servicesList}>
                            {services.map((service, index) => (
                              <Chip key={index} mode="outlined" style={styles.serviceChip}>
                                {service}
                              </Chip>
                            ))}
                          </View>
                        </View>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* New Appointment Button */}
          {filteredAppointments.length > 0 && (
            <Button
              mode="contained"
              onPress={handleNewAppointment}
              style={styles.newAppointmentButton}
              icon="plus"
            >
              Novo Agendamento
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
  filterContainer: {
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
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
  newAppointmentButton: {
    marginTop: 8,
  },
  appointmentsList: {
    gap: 12,
  },
  appointmentCard: {
    backgroundColor: 'white',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  appointmentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 12,
  },
  detailsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
  },
  servicesContainer: {
    gap: 8,
  },
  servicesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    alignSelf: 'flex-start',
  },
});

export default AppointmentsScreen;
