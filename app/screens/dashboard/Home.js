import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Text } from 'react-native';
import Header from '../../components/Header';
import MonthPicker from '../../components/MonthPicker';
import TabBar from '../../components/TabBar';

// IMPORTANDO O HOOK DO CONTEXT
import { useAuth } from '../../contexts/AuthContext';

const Home = ({ navigation }) => {
    const [selectedMonth, setSelectedMonth] = useState('06/2025');
    
    // USANDO O CONTEXT
    // Acessamos os dados do usuário que estão no estado global
    const { user, isAuthenticated, logout } = useAuth();
    
    // Vamos mostrar o estado
    console.log('Dados do usuário na Home:', { user, isAuthenticated });
    
    // Função para fazer logout usando o Context
    const handleLogout = () => {
      logout(); // Chama a função logout do Context
      
      // Redireciona para a tela de login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {/* USANDO DADOS DO CONTEXT */}
                {/* Mostra o nome do usuário que vem do Context */}
                <Header 
                  name={user?.name || user?.email || "Usuário"} 
                  onLogout={handleLogout}
                />
                
                {/* ÁREA PARA MOSTRAR DADOS DO CONTEXT */}
                <View style={styles.debugContainer}>
                  <Text style={styles.debugTitle}>Estado do Context:</Text>
                  <Text style={styles.debugText}>Logado: {isAuthenticated ? 'Sim' : 'Não'}</Text>
                  <Text style={styles.debugText}>Nome: {user?.name || 'Não informado'}</Text>
                  <Text style={styles.debugText}>Email: {user?.email || 'Não informado'}</Text>
                </View>
                
                <MonthPicker selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
                {/* Conteúdo dos cards virá aqui */}
                <TabBar />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 24,
    },
    // ESTILOS PARA ÁREA DE DEBUG (didático)
    debugContainer: {
        backgroundColor: '#f0f8ff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#006ffd',
    },
    debugTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#006ffd',
        marginBottom: 8,
    },
    debugText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
});

// CONCEITOS APRENDIDOS:
// 1. useAuth() - Hook para acessar dados do Context
// 2. Estados globais - user e isAuthenticated disponíveis em qualquer lugar
// 3. Funções compartilhadas - logout() pode ser usado em qualquer componente