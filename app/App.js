import { StyleSheet } from 'react-native';

import SignUp from './screens/user/Signup';
import Login from './screens/user/Login';
import HouseSelection from './screens/house/HouseSelection'; 
import Home from './screens/dashboard/Home';
import AddTransaction from './screens/transaction/AddTransaction';
import LoadingScreen from './components/LoadingScreen';
import SignUpCategory from './screens/transaction/SignUpCategory';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLoading, isAuthenticated, user, userHouse } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Determina a tela inicial baseada no estado de autenticação
  let initialRouteName = 'Login';
  
  if (isAuthenticated && user) {
    if (userHouse) {
      initialRouteName = 'Home';
    } else {
      initialRouteName = 'HouseSelection';
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="HouseSelection" component={HouseSelection} />
        <Stack.Screen name="Categories" component={SignUpCategory} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddTransaction" component={AddTransaction} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}