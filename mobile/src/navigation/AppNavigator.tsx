import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AddCarScreen from '../screens/AddCarScreen';
import CarsScreen from '../screens/CarsScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import NewAppointmentScreen from '../screens/NewAppointmentScreen';
import SelectUnitScreen from '../screens/SelectUnitScreen';
import SelectServicesScreen from '../screens/SelectServicesScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Types
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Appointments: undefined;
  Cars: undefined;
};

export type MainStackParamList = {
  HomeTab: undefined;
  AddCar: undefined;
  NewAppointment: undefined;
  SelectUnit: {
    onUnitSelect: (unit: any) => void;
  };
  SelectServices: {
    selectedCar: any;
    onServicesSelect: (services: any[], price: number) => void;
  };
  BookAppointment: {
    selectedCar: any;
    selectedUnit: any;
    selectedServices: any[];
    totalPrice: number;
  };
  Checkout: {
    selectedCar: any;
    selectedUnit: any;
    selectedServices: any[];
    totalPrice: number;
  };
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Appointments') {
            iconName = 'schedule';
          } else if (route.name === 'Cars') {
            iconName = 'directions-car';
          } else {
            iconName = 'help';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentsScreen}
        options={{ title: 'Agendamentos' }}
      />
      <Tab.Screen 
        name="Cars" 
        component={CarsScreen}
        options={{ title: 'Meus Carros' }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="HomeTab" component={MainTabs} />
      <MainStack.Screen name="AddCar" component={AddCarScreen} />
      <MainStack.Screen name="NewAppointment" component={NewAppointmentScreen} />
      <MainStack.Screen name="SelectUnit" component={SelectUnitScreen} />
      <MainStack.Screen name="SelectServices" component={SelectServicesScreen} />
      <MainStack.Screen name="BookAppointment" component={BookAppointmentScreen} />
      <MainStack.Screen name="Checkout" component={CheckoutScreen} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
    </MainStack.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
