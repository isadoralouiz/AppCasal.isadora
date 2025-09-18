import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../services/firebase';

// createContext cria o contexto
// O AuthContext será usado para compartilhar o estado de autenticação e os dados do usuário em toda a aplicação
const AuthContext = createContext({});

/**
 * useAuth é um hook personalizado que permite acessar o contexto de autenticação
 * Ele deve ser usado dentro de um AuthProvider para funcionar corretamente
 * Se usado fora do AuthProvider, lançará um erro
 * Isso garante que o contexto esteja sempre disponível para os componentes que o utilizam
 * @returns 
 */
export const useAuth = () => {
  // useContext permite acessar o contexto criado pelo AuthContext
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider é o componente que fornecerá o contexto de autenticação para toda a aplicação
 * Ele gerencia o estado de autenticação, os dados do usuário e as funções relacionadas
 * Os componentes filhos poderão acessar esses dados e funções através do contexto
 * Ele também lida com o carregamento inicial dos dados do usuário e a autenticação do Firebase
 * O AuthProvider deve envolver toda a aplicação para que os componentes possam acessar o contexto
 * O AuthProvider deve ser usado no nível mais alto da aplicação, geralmente em App.js
 * Isso garante que todos os componentes tenham acesso ao contexto de autenticação
 * @param {*} param0 
 * @returns 
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); //dados do usuário
  const [userHouse, setUserHouse] = useState(null); //dados da casa
  const [isLoading, setIsLoading] = useState(true); //flag de carregamento
  const [isAuthenticated, setIsAuthenticated] = useState(false); //flag de usuario logado

  // Função para salvar os dados do usuário e da casa no AsyncStorage
  const saveUserData = async (userData, houseData = null) => {
    try {
      // Salva os dados do usuário no AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      if (houseData) {
        // Se houver dados da casa, salva também no AsyncStorage
        await AsyncStorage.setItem('userHouse', JSON.stringify(houseData));
        setUserHouse(houseData);
      }

      // Atualiza o estado do usuário e define que o usuário está autenticado
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  };

  // Função para limpar os dados do usuário e da casa do AsyncStorage
  const clearUserData = async () => {
    try {
      await AsyncStorage.multiRemove(['userData', 'userHouse']);
      setUser(null);
      setUserHouse(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao limpar dados do usuário:', error);
    }
  };

  // Função para carregar os dados do usuário e da casa do AsyncStorage
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const houseData = await AsyncStorage.getItem('userHouse');
      
      if (userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
        
        if (houseData) {
          setUserHouse(JSON.parse(houseData));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  // Função para buscar os dados do usuário e da casa no Firestore
  const buscarDadosUsuario = async (firebaseUser) => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = { 
          ...userDocSnap.data(), 
          uid: firebaseUser.uid,
          email: firebaseUser.email 
        };

        // Se o usuário tem uma casa associada
        if (userData.houseId) {
          const houseDocRef = doc(db, 'houses', userData.houseId);
          const houseDocSnap = await getDoc(houseDocRef);

          if (houseDocSnap.exists()) {
            const houseData = { ...houseDocSnap.data(), id: userData.houseId };
            await saveUserData(userData, houseData);
            return { userData, houseData };
          }
        }

        await saveUserData(userData);
        return { userData, houseData: null };
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      throw error;
    }
  };

  // Função para realizar o logout do usuário
  const logout = async () => {
    try {
      await auth.signOut();
      await clearUserData();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  // useEffect para monitorar o estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        try {
          await buscarDadosUsuario(firebaseUser);
        } catch (error) {
          console.error('Erro ao processar usuário autenticado:', error);
          await clearUserData();
        }
      } else {
        await clearUserData();
      }
      
      setIsLoading(false);
    });

    loadUserData().finally(() => {
      if (!auth.currentUser) {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userHouse,
    isLoading,
    isAuthenticated,
    saveUserData,
    clearUserData,
    buscarDadosUsuario,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};