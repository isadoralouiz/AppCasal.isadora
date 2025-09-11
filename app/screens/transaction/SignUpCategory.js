import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import globalStyles from '../../styles/GlobalStyles';
import TabBar from '../../components/TabBar';
import Header from '../../components/Header';

const Categories = ({ navigation }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  
  //variavel de contexto da casa do usuario logado
  const { user, userHouse, logout } = useAuth();

  useEffect(() => {
    loadCategories();
  }, []);

 

  /**
   * Carrega as categorias da casa do usuário autenticado e atribui ao estado categories -- lista de todas categorias daquela casa
   * @returns {Promise<void>}
   */
  const loadCategories = async () => {
    if (!userHouse?.id) return;

    try {
        
      const categoriesQuery = query(
        collection(db, 'categories'),
        where('houseId', '==', userHouse.id)
      );

      const categoriesSnapshot = await getDocs(categoriesQuery);
      
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  /**
   * Salva uma nova categoria no Firestore associado ao usuario logado
   * @returns {Promise<void>}
   */
  const handleSave = async () => {
    if (!categoryName.trim() || !userHouse?.id) return;

    try {
      const categoryData = {
        name: categoryName.trim(),
        houseId: userHouse.id,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'categories'), categoryData);
      
      const newCategory = {
        id: docRef.id,
        ...categoryData
      };

      //atualiza o estado da lista de categorias com a nova categoria salva no Firestore
      setCategories(prev => [...prev, newCategory]);

      //limpa o campo categoryName
      setCategoryName('');
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    }
  };

  /**
   * Renderiza um item da lista de categorias.
   * Este método é usado pelo FlatList para renderizar cada categoria na lista.
   * O FlatList utiliza este componente como um 'template' que é replicado para cada item da lista.
   * 
   */
  const renderCategoryItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryName}>{item.name}</Text>
    </View>
  );

  /**
   * Exibe a tela.
   * 
   * FlatList
   * - data: conjunto de dados da lista
   * - renderItem: função que renderiza cada item da lista
   * - keyExtractor: função que extrai a chave única de cada item.
   * - scrollEnabled: controla se a rolagem da lista está habilitada.
   */
  return (
    <View style={styles.container}>

      
      <ScrollView style={styles.content}>
        <Text style={globalStyles.heading}>Categorias</Text>
        
        <View style={styles.section}>
          <Text style={styles.label}>Nova Categoria</Text>
          <TextInput
            style={globalStyles.textInput}
            placeholder="Nome da categoria"
            value={categoryName}
            onChangeText={setCategoryName}
          />
          
          <TouchableOpacity
            style={[globalStyles.primaryButton, { marginTop: 12 }]}
            onPress={handleSave}
          >
            <Text style={globalStyles.primaryButtonText}>
              Salvar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Categorias ({categories.length})
          </Text>
          
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      
      <TabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  categoryItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
  },
});

export default Categories;