import { StyleSheet } from 'react-native';

import SignUp from './screens/user/Signup';
import Login from './screens/user/Login';
import HouseSelection from './screens/house/HouseSelection'; 
import Home from './screens/dashboard/Home';
import AddTransaction from './screens/transaction/AddTransaction';
import SignUpCategory from './screens/transaction/SignUpCategory';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// IMPORTANDO O CONTEXT
import { AuthProvider } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();

// COMPONENTE DE NAVEGAÇÃO
// Aqui fica apenas a lógica de navegação
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Crie sua conta' }} />
        <Stack.Screen name="HouseSelection" component={HouseSelection} options={{ title: 'Configuração da casa' }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="AddTransaction" component={AddTransaction} options={{ title: 'Nova Transação' }} />
        <Stack.Screen name="SignUpCategory" component={SignUpCategory} options={{ title: 'Cadastrar categoria' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// COMPONENTE PRINCIPAL
// O AuthProvider envolve toda a aplicação para fornecer o contexto
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    gap: 20,
  },
});

// CONCEITOS APRENDIDOS:
// 1. Provider Pattern - AuthProvider envolve toda a aplicação
// 2. Separação de responsabilidades - AppNavigator só cuida da navegação
// 3. Hierarquia de componentes - Provider no topo da árvore de componentes