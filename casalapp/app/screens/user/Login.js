import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import globalStyles from '../../styles/GlobalStyles';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { buscarDadosUsuario } = useAuth();

 const handleLogin = async () => {

    if (!email || !password) {
        Alert.alert('Erro', 'PREENCHA TODOS OS CAMPOS');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userFirebase = userCredential.user;

      // Busca e salva os dados do usuário usando o contexto
      const { userData, houseData } = await buscarDadosUsuario(userFirebase);

      // A navegação será automática via AuthContext
      // Se tiver casa, vai para Home, senão vai para HouseSelection
      if (houseData) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'HouseSelection' }],
        });
      }

    } catch (error) {
      console.error(error);
      let errorMessage = 'Erro ao fazer login';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={globalStyles.heading}>Seja bem vindo ao Ca$alApp!</Text>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Email Address"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={[globalStyles.textInput, { width: '100%' }]}
          />

          <View style={[globalStyles.textInput, globalStyles.passwordInput]}>
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={{ flex: 1, fontSize: 16 }}
            />
          </View>

          <TouchableOpacity>
            <Text style={{ color: '#006ffd', fontWeight: '600', fontSize: 14 }}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={globalStyles.primaryButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={globalStyles.primaryButtonText}>
              {isLoading ? 'Entrando...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomRow}>
            <Text style={{ fontSize: 12, color: '#71727a' }}>Não tem uma conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{ fontSize: 12, color: '#006ffd', fontWeight: '600' }}> Registre-se agora.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 24,
  },
  inputGroup: {
    gap: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default Login;