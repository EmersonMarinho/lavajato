import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  TextInput,
  useTheme,
  Divider,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        telefone: user.telefone || '',
        endereco: user.endereco || '',
        bairro: user.bairro || '',
        cidade: user.cidade || '',
        estado: user.estado || '',
        cep: user.cep || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!formData.nome || !formData.endereco || !formData.bairro || !formData.cidade || !formData.estado || !formData.cep) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    
    try {
      // Aqui você faria a chamada para a API para atualizar o usuário
      console.log('Atualizando perfil:', formData);
      
      // Simular sucesso
      setTimeout(() => {
        setIsEditing(false);
        setIsLoading(false);
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Erro', 'Erro ao atualizar perfil');
    }
  };

  const handleCancel = () => {
    // Restaurar dados originais
    if (user) {
      setFormData({
        nome: user.nome || '',
        telefone: user.telefone || '',
        endereco: user.endereco || '',
        bairro: user.bairro || '',
        cidade: user.cidade || '',
        estado: user.estado || '',
        cep: user.cep || '',
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Usuário não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <MaterialIcons name="person" size={48} color={theme.colors.primary} />
            <Text style={styles.title}>Meu Perfil</Text>
            <Text style={styles.subtitle}>
              Gerencie suas informações pessoais
            </Text>
          </View>

          {/* Profile Card */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <MaterialIcons name="person-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.cardTitle}>Informações Pessoais</Text>
              </View>
              
              <TextInput
                label="Nome"
                value={formData.nome}
                onChangeText={(text) => setFormData({ ...formData, nome: text })}
                disabled={!isEditing}
                style={styles.input}
                mode="outlined"
              />
              
              <TextInput
                label="Telefone"
                value={formData.telefone}
                disabled={true} // Telefone não pode ser editado
                style={styles.input}
                mode="outlined"
              />
            </Card.Content>
          </Card>

          {/* Address Card */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <MaterialIcons name="location-on" size={24} color={theme.colors.primary} />
                <Text style={styles.cardTitle}>Endereço</Text>
              </View>
              
              <TextInput
                label="Endereço Completo"
                value={formData.endereco}
                onChangeText={(text) => setFormData({ ...formData, endereco: text })}
                disabled={!isEditing}
                style={styles.input}
                mode="outlined"
                placeholder="Rua, número, complemento"
              />
              
              <TextInput
                label="Bairro"
                value={formData.bairro}
                onChangeText={(text) => setFormData({ ...formData, bairro: text })}
                disabled={!isEditing}
                style={styles.input}
                mode="outlined"
              />
              
              <View style={styles.row}>
                <TextInput
                  label="Cidade"
                  value={formData.cidade}
                  onChangeText={(text) => setFormData({ ...formData, cidade: text })}
                  disabled={!isEditing}
                  style={[styles.input, styles.halfInput]}
                  mode="outlined"
                />
                
                <TextInput
                  label="Estado (UF)"
                  value={formData.estado}
                  onChangeText={(text) => setFormData({ ...formData, estado: text })}
                  disabled={!isEditing}
                  style={[styles.input, styles.halfInput]}
                  mode="outlined"
                  maxLength={2}
                />
              </View>
              
              <TextInput
                label="CEP"
                value={formData.cep}
                onChangeText={(text) => setFormData({ ...formData, cep: text })}
                disabled={!isEditing}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                maxLength={9}
              />
            </Card.Content>
          </Card>

          {/* Loyalty Points Card */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <MaterialIcons name="stars" size={24} color={theme.colors.primary} />
                <Text style={styles.cardTitle}>Pontos de Fidelidade</Text>
              </View>
              
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsValue}>{user.pontos_fidelidade || 0}</Text>
                <Text style={styles.pointsLabel}>pontos acumulados</Text>
              </View>
              
              <Text style={styles.pointsInfo}>
                Continue usando nossos serviços para acumular mais pontos e ganhar descontos!
              </Text>
            </Card.Content>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {!isEditing ? (
              <Button
                mode="contained"
                onPress={() => setIsEditing(true)}
                style={styles.button}
                icon="edit"
              >
                Editar Perfil
              </Button>
            ) : (
              <View style={styles.editActions}>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  loading={isLoading}
                  disabled={isLoading}
                  style={[styles.button, styles.saveButton]}
                  icon="check"
                >
                  Salvar
                </Button>
                
                <Button
                  mode="outlined"
                  onPress={handleCancel}
                  disabled={isLoading}
                  style={[styles.button, styles.cancelButton]}
                  icon="close"
                >
                  Cancelar
                </Button>
              </View>
            )}
            
            <Button
              mode="text"
              onPress={signOut}
              style={styles.signOutButton}
              icon="logout"
              textColor={theme.colors.error}
            >
              Sair da Conta
            </Button>
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
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  pointsLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  pointsInfo: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actions: {
    gap: 12,
  },
  button: {
    paddingVertical: 8,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  signOutButton: {
    marginTop: 8,
  },
});

export default ProfileScreen;
