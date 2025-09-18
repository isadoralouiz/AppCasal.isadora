import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import globalStyles from '../styles/GlobalStyles';

/**
 * @description Header simplificado para debug
 */
const Header = ({ name, onLogout }) => {
    
    const confirmLogout = () => {
        Alert.alert(
            'Sair',
            'Deseja realmente sair da aplicação?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: onLogout
                }
            ]
        );
    };

    return (
        <View style={styles.header}>
            <View style={styles.centerContent}>
                <Text style={[globalStyles.heading, styles.greeting]}>
                    Olá, {name}!
                </Text>
            </View>
            
            <TouchableOpacity 
                style={styles.logoutButton}
                onPress={confirmLogout}
            >
                <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        height: 80,
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    greeting: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        margin: 0,
    },
    logoutButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    logoutText: {
        color: '#666',
        fontSize: 14,
    },
});

export default Header;