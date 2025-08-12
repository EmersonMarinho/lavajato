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
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { cars, appointments } = useApp();
  const navigation = useNavigation();
  const theme = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getNextAppointment = () => {
    const today = new Date();
    const futureAppointments = appointments.filter(app => {
      const appDate = new Date(app.data);
      return appDate >= today && app.status === 'AGENDADO';
    });
    
    return futureAppointments.sort((a, b) => 
      new Date(a.data).getTime() - new Date(b.data).getTime()
    )[0];
  };

  const getAppointmentsByStatus = (status: string) => {
    return appointments.filter(app => app.status === status).length;
  };

  const handleNewAppointment = () => {
    if (cars.length === 0) {
      navigation.navigate('AddCar' as never);
    } else {
      navigation.navigate('NewAppointment' as never);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const nextAppointment = getNextAppointment();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.nome || 'Usuário'}! 👋</Text>
            <Text style={styles.subtitle}>
              Bem-vindo ao seu lavajato de confiança
            </Text>
          </View>
          
          {/* Profile Button */}
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <MaterialIcons name="person" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header com Usuário */}
          <Card style={[styles.headerCard, { backgroundColor: theme.colors.primary }]}>
            <Card.Content style={styles.headerContent}>
              <View style={styles.headerTop}>
                <View style={styles.userInfo}>
                  <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
                  <Text style={styles.userName}>{user?.nome || 'Usuário'}</Text>
                </View>
                <TouchableOpacity onPress={handleSignOut}>
                  <MaterialIcons name="logout" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Pontos de Fidelidade */}
              <Card style={styles.loyaltyCard}>
                <Card.Content style={styles.loyaltyContent}>
                  <View style={styles.loyaltyInfo}>
                    <View>
                      <Text style={styles.loyaltyLabel}>Seus Pontos</Text>
                      <Text style={[styles.loyaltyPoints, { color: theme.colors.primary }]}>
                        {user?.pontos_fidelidade || 0}
                      </Text>
                    </View>
                    <MaterialIcons name="stars" size={32} color="#fbbf24" />
                  </View>
                  <Text style={styles.loyaltyDescription}>
                    Acumule pontos a cada serviço realizado
                  </Text>
                </Card.Content>
              </Card>
            </Card.Content>
          </Card>

          {/* Próximo Agendamento */}
          {nextAppointment && (
            <Card style={styles.appointmentCard}>
              <Card.Content style={styles.appointmentContent}>
                <View style={styles.appointmentHeader}>
                  <MaterialIcons name="schedule" size={24} color="#10b981" />
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentTitle}>Próximo Agendamento</Text>
                    <Text style={styles.appointmentDate}>
                      {new Date(nextAppointment.data).toLocaleDateString('pt-BR')} às {nextAppointment.hora}
                    </Text>
                  </View>
                  <Chip mode="flat" textStyle={{ color: 'white' }} style={{ backgroundColor: '#10b981' }}>
                    {formatCurrency(nextAppointment.preco_final)}
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Estatísticas Rápidas */}
          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsTitle}>Resumo</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                    {cars.length}
                  </Text>
                  <Text style={styles.statLabel}>Carros</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: '#10b981' }]}>
                    {getAppointmentsByStatus('AGENDADO')}
                  </Text>
                  <Text style={styles.statLabel}>Agendados</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: '#f59e0b' }]}>
                    {getAppointmentsByStatus('EM_ANDAMENTO')}
                  </Text>
                  <Text style={styles.statLabel}>Em Andamento</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: '#8b5cf6' }]}>
                    {getAppointmentsByStatus('FINALIZADO')}
                  </Text>
                  <Text style={styles.statLabel}>Finalizados</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Ações Principais */}
          <View style={styles.actionsSection}>
            <Text style={styles.actionsTitle}>O que você gostaria de fazer?</Text>

            {/* Novo Agendamento */}
            <TouchableOpacity onPress={handleNewAppointment}>
              <Card style={styles.actionCard}>
                <Card.Content style={styles.actionContent}>
                  <View style={styles.actionRow}>
                    <MaterialIcons name="add-circle" size={24} color={theme.colors.primary} />
                    <View style={styles.actionInfo}>
                      <Text style={styles.actionTitle}>Novo Agendamento</Text>
                      <Text style={styles.actionDescription}>
                        Agende um novo serviço para seu veículo
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={theme.colors.primary} />
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>

            {/* Meus Carros */}
            <TouchableOpacity onPress={() => navigation.navigate('Cars' as never)}>
              <Card style={styles.actionCard}>
                <Card.Content style={styles.actionContent}>
                  <View style={styles.actionRow}>
                    <MaterialIcons name="directions-car" size={24} color={theme.colors.primary} />
                    <View style={styles.actionInfo}>
                      <Text style={styles.actionTitle}>Meus Carros</Text>
                      <Text style={styles.actionDescription}>
                        Gerencie seus veículos cadastrados
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={theme.colors.primary} />
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>

            {/* Meus Agendamentos */}
            <TouchableOpacity onPress={() => navigation.navigate('Appointments' as never)}>
              <Card style={styles.actionCard}>
                <Card.Content style={styles.actionContent}>
                  <View style={styles.actionRow}>
                    <MaterialIcons name="event" size={24} color={theme.colors.primary} />
                    <View style={styles.actionInfo}>
                      <Text style={styles.actionTitle}>Meus Agendamentos</Text>
                      <Text style={styles.actionDescription}>
                        Visualize e gerencie seus agendamentos
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={theme.colors.primary} />
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#f9fafb',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
  },
  headerCard: {
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  userName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  loyaltyCard: {
    backgroundColor: 'white',
  },
  loyaltyContent: {
    padding: 16,
  },
  loyaltyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  loyaltyLabel: {
    color: '#4b5563',
    fontSize: 14,
    marginBottom: 4,
  },
  loyaltyPoints: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loyaltyDescription: {
    color: '#6b7280',
    fontSize: 12,
  },
  appointmentCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  appointmentContent: {
    padding: 16,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  appointmentDate: {
    color: '#4b5563',
  },
  statsCard: {
    backgroundColor: '#f9fafb',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#4b5563',
    fontSize: 14,
  },
  actionsSection: {
    gap: 12,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  actionCard: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#dbeafe',
  },
  actionContent: {
    padding: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  actionDescription: {
    color: '#6b7280',
    fontSize: 14,
  },
});

export default HomeScreen;
