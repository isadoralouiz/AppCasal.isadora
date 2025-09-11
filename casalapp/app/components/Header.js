import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import globalStyles from '../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * @description Este componente é utilizado para exibir o nome do usuário no cabeçalho da aplicação.
 * Ele também inclui um ícone de perfil que pode ser clicado para acessar as configurações do usuário.
 * ATUALIZADO: Agora inclui funcionalidade de logout usando Context API
 * Requirements:
 * - React Native
 * - Material Icons - npx expo install @expo/vector-icons
 * @param {Object} props - Propriedades do componente.
 * @param {string} props.name - Nome do usuário a ser exibido.
 * @param {function} props.onLogout - Função de logout (opcional).
 * @return {JSX.Element} Componente de cabeçalho.
 * @example
 * <Header name="Nome do Usuário" onLogout={handleLogout} />
 */
const Header = ({ name, onLogout }) => {
    
    // Função para confirmar logout
    const confirmLogout = () => {
        Alert.alert(
            'Sair',
            'Deseja realmente sair da aplicação?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: onLogout,
                },
            ]
        );
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity>
                <Icon name="person" size={24} />
            </TouchableOpacity>
            
            <Text style={globalStyles.heading}>{name}</Text>
            
            {/* BOTÃO DE LOGOUT - só aparece se a função foi fornecida */}
            {onLogout && (
                <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
                    <Icon name="logout" size={24} color="#ff4757" />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Para espaçar os elementos
        marginBottom: 24,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
    },
    logoutButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#ffe5e5',
    },
});

// CONCEITOS APRENDIDOS:
// 1. Props condicionais - onLogout só é usado se fornecido
// 2. Renderização condicional - botão só aparece se função existe
// 3. Confirmação de ação - Alert para confirmar logout
// 4. Integração com Context - usa função do Context via props