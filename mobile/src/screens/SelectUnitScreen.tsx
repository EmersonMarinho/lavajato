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
  useTheme,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { Unit } from '../types';
import { useNavigation } from '@react-navigation/native';

interface SelectUnitScreenProps {
  route: {
    params: {
      onUnitSelect: (unit: Unit) => void;
    };
  };
}

const SelectUnitScreen: React.FC<SelectUnitScreenProps> = ({ route }) => {
  const { units } = useApp();
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const navigation = useNavigation();
  const theme = useTheme();

  const { onUnitSelect } = route.params;

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const handleConfirm = () => {
    if (!selectedUnit) {
      // Show error message
      console.log('Selecione uma unidade');
      return;
    }

    onUnitSelect(selectedUnit);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Escolher Unidade</Text>
            <Text style={styles.subtitle}>
              Selecione onde deseja realizar o serviço
            </Text>
          </View>

          {/* Units List */}
          <View style={styles.unitsList}>
            {units.map((unit) => (
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
                      {selectedUnit?.id === unit.id && (
                        <MaterialIcons name="check-circle" size={24} color={theme.colors.primary} />
                      )}
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* Confirm Button */}
          <Button
            mode="contained"
            onPress={handleConfirm}
            disabled={!selectedUnit}
            style={styles.confirmButton}
          >
            Confirmar Unidade
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
  unitsList: {
    gap: 12,
  },
  unitCard: {
    backgroundColor: 'white',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#3b82f6',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  unitAddress: {
    fontSize: 14,
    color: '#6b7280',
  },
  confirmButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default SelectUnitScreen;
