import React, { createContext, useContext, useState, useEffect } from 'react';

// Création du contexte
const ThemeContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useTheme = () => useContext(ThemeContext);

// Fournisseur du contexte
export const ThemeProvider = ({ children }) => {
  // Vérifier si le thème est déjà enregistré dans localStorage
  // Sinon, utiliser le thème par défaut (clair)
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    // Vérifier les préférences système si aucun thème n'est sauvegardé
    if (savedTheme === null) {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return savedTheme === 'true';
  });
  
  // Appliquer le thème au body quand il change
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    // Sauvegarder la préférence
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  // Fonction pour basculer entre les thèmes
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };
  
  // Valeurs exposées par le contexte
  const value = {
    darkMode,
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
