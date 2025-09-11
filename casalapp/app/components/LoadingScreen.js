import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import globalStyles from '../styles/GlobalStyles';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#006ffd" />
      <Text style={styles.text}>Carregando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 20,
  },
  text: {
    fontSize: 16,
    color: '#71727a',
  },
});

export default LoadingScreen;