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
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

// IMPORTANDO O HOOK DO CONTEXT
import { useAuth } from '../../contexts/AuthContext';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // USANDO O CONTEXT
  // Aqui acessamos as funções e dados do AuthContext
  const { login, user, isAuthenticated } = useAuth();
  
  // Vamos mostrar o estado atual no console para fins didáticos
  console.log(' Estado atual do Context:', { user, isAuthenticated });

 const handleLogin = async () => {

    if (!email || !password) {
        Alert.alert('Erro', 'PREENCHA TODOS OS CAMPOS');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        /* Obtém os dados do usuário */
        const userData = userDocSnap.data();
        
        // USANDO O CONTEXT - Salvamos os dados do usuário no estado global
        const userInfo = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: userData.name,
          houseId: userData.houseId
        };
        
        // Chama a função login do Context para atualizar o estado global
        login(userInfo);

        // Se o usuário já estiver associado a uma casa
        if (userData.houseId) {
          const houseDocRef = doc(db, 'houses', userData.houseId);
          const houseDocSnap = await getDoc(houseDocRef);

          if (houseDocSnap.exists()) {
            const houseData = houseDocSnap.data();

            // Redireciona para Home
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
            return; // Importante para parar o fluxo aqui
          }
        }

        // Se não tiver casa, redireciona para seleção de casa
        navigation.reset({
          index: 0,
          routes: [{ name: 'HouseSelection' }],
        });
      } else {
        Alert.alert('Erro', 'Usuário não encontrado no banco de dados.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao fazer login', error.message);
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

          <TouchableOpacity style={globalStyles.primaryButton} onPress={handleLogin}>
            <Text style={globalStyles.primaryButtonText}>Login</Text>
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