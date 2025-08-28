import React, { createContext, useContext, useState } from 'react';

// 1. CRIAÇÃO DO CONTEXTO
// O Context é um mecanismo do React para compartilhar dados
// entre componentes sem precisar passar props manualmente
const AuthContext = createContext({});

// 2. HOOK PERSONALIZADO
// Este hook facilita o acesso ao contexto e adiciona validação
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Validação: garante que o hook seja usado dentro do Provider
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

// 3. PROVIDER COMPONENT
// O Provider é responsável por fornecer os dados para os componentes filhos
export const AuthProvider = ({ children }) => {
  // ESTADOS BÁSICOS
  // Aqui mantemos os dados que queremos compartilhar globalmente
  const [user, setUser] = useState(null);                    // Dados do usuário logado
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Se está logado ou não
  
  // FUNÇÕES BÁSICAS
  // Estas funções manipulam o estado e são compartilhadas com toda a aplicação
  
  // Função para fazer login (versão básica)
  const login = (userData) => {
    console.log('Login realizado:', userData);
    setUser(userData);
    setIsAuthenticated(true);
  };
  
  // Função para fazer logout (versão básica)
  const logout = () => {
    console.log('Logout realizado');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  // VALOR DO CONTEXTO
  // Tudo que colocamos aqui fica disponível para os componentes filhos
  const contextValue = {
    // Estados
    user,
    isAuthenticated,
    
    // Funções
    login,
    logout,
  };
  
  // RENDERIZAÇÃO DO PROVIDER
  // O Provider envolve os componentes filhos e fornece o contexto
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// CONCEITOS APRENDIDOS:
// 1. createContext() - Cria um contexto para compartilhar dados
// 2. useContext() - Hook para acessar dados do contexto
// 3. Provider - Componente que fornece dados para seus filhos
// 4. Hook personalizado - Facilita o uso do contexto
// 5. Estados globais - Dados compartilhados em toda a aplicação