import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import globalStyles from '../../styles/GlobalStyles';

/**
 * @description Tela para demonstrar formulário de transação financeira
 * Ensina conceitos de interface, estados e componentes básicos do React Native.
 * Esta é uma versão didática focada na estrutura da tela.
 */
const AddTransaction = ({ navigation }) => {
  // Estados principais
  const [isIncome, setIsIncome] = useState(false); // true = receita, false = despesa
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Estados para os dados carregados do Firebase
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Context para obter dados do usuário
  const { user } = useAuth();

  // Carrega as categorias da casa ao montar o componente
  // o useeffect é executado após a renderização do componente
  useEffect(() => {
    loadHouseData();
  }, []);

  /**
   * Carrega as categorias associadas à casa do usuário
   */
  const loadHouseData = async () => {
    if (!user?.houseId) {
      Alert.alert('Erro', 'Casa não encontrada. Faça login novamente.');
      return;
    }

    try {
      setLoading(true);
      
      // Buscar categorias da casa do usuario logado
      // query eh uma função que permite filtrar documentos em uma coleção
      const categoriesQuery = query(
        collection(db, 'categories'),
        where('houseId', '==', user.houseId)
      );

      //getDocs é uma função que busca documentos com base na query
      const categoriesSnapshot = await getDocs(categoriesQuery);
    
    // categoriesSnapshot.data() NÃO existe porque QuerySnapshot não tem método .data()
    // Cada documento individual dentro do QuerySnapshot tem .data()
    // categoriesSnapshot.docs é um array de DocumentSnapshot
    // map faz um loop nesse array e extrai os dados de cada documento
    const categoriesData = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,        // ID do documento
      ...doc.data()      // Dados do documento (cada doc individual tem .data())
    }));

    // atribui as categorias carregadas ao estado
    setCategories(categoriesData);

    } catch (error) {
      console.error('Erro ao carregar dados da casa:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da casa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={globalStyles.heading}>Nova Transação</Text>
        <Text style={globalStyles.subheading}>
          Adicione uma nova receita ou despesa
        </Text>

        {/* Tipo de transação - Checkbox */}
        <View style={styles.section}>
          <Text style={styles.label}>Tipo de Transação</Text>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                !isIncome && styles.checkboxSelected
              ]}
              onPress={() => setIsIncome(false)}
            >
              <Text style={[
                styles.checkboxText,
                !isIncome && styles.checkboxTextSelected
              ]}>
                Despesa
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.checkbox,
                isIncome && styles.checkboxSelected
              ]}
              onPress={() => setIsIncome(true)}
            >
              <Text style={[
                styles.checkboxText,
                isIncome && styles.checkboxTextSelected
              ]}>
                Receita
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Valor */}
        <View style={styles.section}>
          <Text style={styles.label}>Valor</Text>
          <TextInput
            style={globalStyles.textInput}
            placeholder="R$ 0,00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            style={globalStyles.textInput}
            placeholder="Descrição da transação"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Responsável - Mostra o usuário logado */}
        <View style={styles.section}>
          <Text style={styles.label}>Responsável</Text>
          <View style={[globalStyles.textInput, styles.responsibleContainer]}>
            <Text style={styles.responsibleText}>
              {user?.name || user?.email || 'Usuário logado'}
            </Text>
          </View>
        </View>

        {/* Categoria */}
        <View style={styles.section}>
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione uma categoria" value="" />
              {categories.map((category) => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={() => Alert.alert('Info', 'Funcionalidade em desenvolvimento!')}
        >
          <Text style={globalStyles.primaryButtonText}>
            Salvar Transação
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Espaço para o TabBar
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  checkbox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d1d6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#006ffd',
    borderColor: '#006ffd',
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  checkboxTextSelected: {
    color: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d1d6',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  picker: {
    height: 48,
  },
  selectButton: {
    justifyContent: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#000',
  },
  selectPlaceholder: {
    color: '#999',
  },
  responsibleContainer: {
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  responsibleText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default AddTransaction;

// CONCEITOS ENSINADOS NESTA TELA:
// 1. Navegação pelo TabBar - Como integrar telas com navegação por abas
// 2. Consultas no Firestore - Query com filtros (where) para buscar dados específicos
// 3. Estados do React - useState para gerenciar dados do formulário
// 4. useEffect - Carregar dados quando o componente monta
// 5. Estados condicionais - Checkbox personalizado para tipo de transação
// 6. Picker nativo - Componente de seleção nativo do React Native
// 7. TextInput - Captura de texto com diferentes tipos de teclado
// 8. Contexto de autenticação - Usar dados do usuário logado
// 9. Estilização - StyleSheet e estilos condicionais
// 10. Estrutura de formulário - Layout e organização de campos