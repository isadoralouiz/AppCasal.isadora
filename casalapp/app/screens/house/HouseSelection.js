import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import globalStyles from '../../styles/GlobalStyles';
import { auth, db } from '../../services/firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';



const HouseSelection = () => {
  const [houseName, setHouseName] = useState('');
  const [houseCode, setHouseCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const { user, buscarDadosUsuario } = useAuth();

      // Obtém o usuário autenticado
    const firebaseUser = auth.currentUser;


  const handleCreateHouse = async () => {
 
    if (!houseName.trim()) {
      Alert.alert('Erro', 'Informe um nome para a casa.');
      return;
    }

    setIsLoading(true);

    /**
     * O id da casa é gerado a partir do email do usuário,
     * substituindo os caracteres '@' e '.' por '-'.
     * Isso garante que o id seja único e não contenha caracteres inválidos.
     * O id da casa será usado para criar o documento no Firestore.
     */
    const houseId = firebaseUser.email.replace(/[@.]/g, '-');
  
    try {
    /**
     * Aqui estamos criando um documento no Firestore
     * doc(db, 'houses', houseId) cria uma referência ao documento da casa
     * houseId é o id da casa que geramos anteriormente que é o email do usuário recem cadastrado
     * setDoc() salva os dados no Firestore
     * O objeto passado contém os dados que queremos salvar
     * name é o nome da casa, createdBy é o id do usuário que criou a casa,
     * createdByEmail é o email do usuário que criou a casa, members é um array com o id do usuário que criou a casa,
     * createdAt é a data de criação da casa, que estamos definindo como a data atual.
     */
      const houseRef = doc(db, 'houses', houseId);
      await setDoc(houseRef, {
        name: houseName,
        createdBy: firebaseUser.uid,
        createdByEmail: firebaseUser.email,
        members: [firebaseUser.uid],
        createdAt: new Date(),
      });
  
      /**
       * Aqui estamos atualizando o documento do usuário no Firestore
       * doc(db, 'users', user.uid) cria uma referência ao documento do usuário
       * updateDoc() atualiza os dados no Firestore
       * O objeto passado contém os dados que queremos atualizar
       * houseId é o id da casa que o usuário criou, que será usado para associar o usuário à casa.
       * Isso é importante para que o usuário possa acessar a casa que ele criou posteriormente.
       */
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        houseId: houseId,
      });

      // Atualiza os dados do usuário no contexto
      await buscarDadosUsuario(firebaseUser);
    
      Alert.alert('Casa criada com sucesso!');

      /**
       * Redireciona o usuário para a tela inicial
       * navigation.reset() redefine a pilha de navegação
       * index: 0 define que a primeira tela da pilha será a de Home
       * routes: [{ name: 'Home' }] define que a primeira tela será a de Home
       */
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
      return; 
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao criar casa', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleJoinHouse = async () => {
    if (!houseCode.trim()) {
      Alert.alert('Erro', 'Informe o email do administrador da casa.');
      return;
    }

    setIsLoading(true);

     /**
     * O id da casa é gerado a partir do email do usuário,
     * substituindo os caracteres '@' e '.' por '-'.
     * Isso garante que o id seja único e não contenha caracteres inválidos.
     * O id da casa será usado para criar o documento no Firestore.
     */
    const houseId = houseCode.trim().replace(/[@.]/g, '-');
  
    try {
       /**
     * Aqui estamos criando um documento no Firestore
     * doc(db, 'houses', houseId) cria uma referência ao documento da casa
     * houseId é o id da casa que geramos anteriormente que é o email do usuário recem cadastrado
     * setDoc() salva os dados no Firestore
     * O objeto passado contém os dados que queremos salvar
     * name é o nome da casa, createdBy é o id do usuário que criou a casa,
     * createdByEmail é o email do usuário que criou a casa, members é um array com o id do usuário que criou a casa,
     * createdAt é a data de criação da casa, que estamos definindo como a data atual.
     */
      const houseRef = doc(db, 'houses', houseId);

      /**
       * Busca o snapsot do documento da casa
       * getDoc(houseRef) busca o documento da casa no Firestore
       * houseRef é a referência ao documento da casa que criamos anteriormente
       * O snapshot contém os dados do documento, se ele existir.
       * Se o documento não existir, o snapshot não terá dados e retornará false para exists().
       */
      const houseSnap = await getDoc(houseRef);
  
      if (!houseSnap.exists()) {
        Alert.alert('Erro', 'Casa não encontrada.');
        return;
      }
  
      /**
       * Atualiza o 'snapshot' do documento da casa
       * updateDoc(houseRef, { members: arrayUnion(user.uid) }) atualiza o documento da casa
       * houseRef é a referência ao documento da casa que criamos anteriormente
       * members é um array que contém os ids dos usuários que são membros da casa
       */
      await updateDoc(houseRef, {
        members: arrayUnion(firebaseUser.uid),
      });
  
      /**
       * Aqui estamos atualizando o documento do usuário no Firestore
       * doc(db, 'users', user.uid) cria uma referência ao documento do usuário
       * updateDoc() atualiza os dados no Firestore
       * O objeto passado contém os dados que queremos atualizar
       * houseId é o id da casa que o usuário criou, que será usado para associar o usuário à casa.
       * Isso é importante para que o usuário possa acessar a casa que ele criou posteriormente.
       */
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        houseId: houseId,
      });

      // Atualiza os dados do usuário no contexto
      await buscarDadosUsuario(firebaseUser);

      Alert.alert('Você ingressou na casa com sucesso!');
      
      // Redireciona para Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
      
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao entrar na casa', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  
    return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >

      <Text style={globalStyles.heading}>Nova Casa</Text>

      <TextInput
        placeholder="Nome da casa"
        value={houseName}
        onChangeText={setHouseName}
        style={[globalStyles.textInput, { width: '100%', marginBottom: 16 }]}
      />

      <TouchableOpacity 
        style={[globalStyles.primaryButton, isLoading && { opacity: 0.6 }]} 
        onPress={handleCreateHouse}
        disabled={isLoading}
      >
        <Text style={globalStyles.primaryButtonText}>
          {isLoading ? 'Criando...' : 'Criar casa'}
        </Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={[globalStyles.subheading, { marginBottom: 8 }]}>
        Já tem o código de uma casa?
      </Text>

      <TextInput
        placeholder="Código da casa"
        value={houseCode}
        onChangeText={setHouseCode}
        style={[globalStyles.textInput, { width: '100%', marginBottom: 16 }]}
      />

      <TouchableOpacity 
        style={[globalStyles.secondaryButton, isLoading && { opacity: 0.6 }]} 
        onPress={handleJoinHouse}
        disabled={isLoading}
      >
        <Text style={globalStyles.secondaryButtonText}>
          {isLoading ? 'Ingressando...' : 'Ingressar em uma casa existente'}
        </Text>
      </TouchableOpacity>

    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
);


};

export default HouseSelection;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 24,
      justifyContent: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: '#ccc',
      marginVertical: 32,
    },

  });
  