import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Text } from 'react-native';
import Header from '../../components/Header';
import MonthPicker from '../../components/MonthPicker';
import TabBar from '../../components/TabBar';
import { useAuth } from '../../contexts/AuthContext';

const Home = ({ navigation }) => {

    /**
     * user é um objeto que contém informações do usuário autenticado salvo no context e no asyncstorage
     * userHouse é um objeto que contém informações da casa do usuário autenticado
     * logout é uma função que permite ao usuário sair da sessão e limpar o asyncstorage
     * 
     * os estados e as funções são obtidos através do hook useAuth, que acessa o contexto de autenticação
     * implementados em ../../contexts/AuthContext.js
     */
    const { user, userHouse, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            // A navegação será automática via onAuthStateChanged
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    };



    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
   
                
                <View style={styles.content}>
                   
                    
                    {/* Área de debug - mostra dados do Context */}
                    <View style={styles.debugArea}>
                        <Text style={styles.debugTitle}>Debug - Dados do Context:</Text>
                        <Text style={styles.debugText}>Nome: {user?.fullName}</Text>
                        <Text style={styles.debugText}>Email: {user?.email}</Text>
                        <Text style={styles.debugText}>Casa: {userHouse?.name || 'Nenhuma casa'}</Text>
                        <Text style={styles.debugText}>Casa ID: {user?.houseId || 'Sem ID'}</Text>
                    </View>
                </View>

                <TabBar  />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    debugArea: {
        backgroundColor: '#e9ecef',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
    },
    debugTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#495057',
    },
    debugText: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 5,
    },
});

export default Home;