// src/components/common/TabBar.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * @description Componente de barra de abas para navegação na aplicação.
 * Ele exibe ícones representando diferentes seções da aplicação, como Home, Relatórios, Adicionar, Alertas e Configurações.
 * O ícone "+" navega para a tela de adicionar transação.
 * @example
 * <TabBar />
 * @returns 
 */
const TabBar = () => {
    const navigation = useNavigation();

    const handleAddTransaction = () => {
        navigation.navigate('AddTransaction');
    };

    const handleCategories = () => {
        navigation.navigate('Categories');
    };

    const handleHome = () => {
        navigation.navigate('Home');
    };

    return (
        <View style={styles.tabBar}>
            <TouchableOpacity onPress={handleHome}>
                <Text style={styles.tabItem}>H</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.tabItem}>R</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddTransaction}>
                <Text style={[styles.tabItem, styles.addButton]}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCategories}>
                <Text style={styles.tabItem}>C</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.tabItem}>E</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TabBar;

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    },
    tabItem: {
        fontSize: 24,
    },
    addButton: {
        backgroundColor: '#006ffd',
        color: '#fff',
        borderRadius: 20,
        width: 40,
        height: 40,
        textAlign: 'center',
        lineHeight: 36,
        fontWeight: 'bold',
    },
});