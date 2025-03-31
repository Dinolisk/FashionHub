import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Skapa Context
const AuthContext = createContext(null);

// 2. Skapa en Provider-komponent
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Håller användardata
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Håller koll på inloggningsstatus
  const [isLoading, setIsLoading] = useState(true); // För att hantera initial laddning (valfritt men bra)

  // (Valfritt) Kolla om användaren finns i localStorage vid start
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('fashionHubUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      }
    } catch (error) {
        console.error("Failed to load user from localStorage", error);
        localStorage.removeItem('fashionHubUser'); // Rensa om datan är korrupt
    } finally {
        setIsLoading(false); // Markera att vi är klara med laddningen
    }
  }, []); // Körs bara en gång när komponenten mountas

  // Funktion för att logga in
  const login = (userData) => {
    if (userData) {
      setCurrentUser(userData);
      setIsLoggedIn(true);
      // (Valfritt) Spara i localStorage för att "komma ihåg" användaren
       try {
            localStorage.setItem('fashionHubUser', JSON.stringify(userData));
       } catch (error) {
            console.error("Failed to save user to localStorage", error);
       }
    } else {
        console.error("Login function called without userData");
    }
  };

  // Funktion för att logga ut
  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    // (Valfritt) Ta bort från localStorage
    localStorage.removeItem('fashionHubUser');
  };

  // Värdet som delas via context
  const value = {
    currentUser,
    isLoggedIn,
    isLoading, // Skicka med laddningsstatus
    login,
    logout,
  };

  // Returnera Providern som omsluter children
  // Visa inget förrän vi vet om användaren är inloggad (om isLoading är true)
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// 3. Skapa en custom hook för att enkelt använda contexten
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}