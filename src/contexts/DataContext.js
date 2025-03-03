import React, { createContext, useContext, useState, useEffect } from 'react';

// Creation du contexte
const DataContext = createContext();

// Hook personnalise pour utiliser le contexte
export const useData = () => useContext(DataContext);

// Fournisseur du contexte
export const DataProvider = ({ children }) => {
  const [gameData, setGameData] = useState({
    items: {},
    recipes: {},
    jobs: {}
  });
  const [loading, setLoading] = useState(true);
  const [activeJobId, setActiveJobId] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Charger les donnees depuis localStorage au demarrage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = localStorage.getItem('gameData');
        if (savedData) {
          setGameData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des donnees:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Sauvegarder les donnees dans localStorage
  const saveGameData = (data) => {
    try {
      // Fusionner avec les donnees existantes ou remplacer completement
      const newData = {
        items: { ...data.items },
        recipes: { ...data.recipes },
        jobs: { ...data.jobs }
      };
      
      localStorage.setItem('gameData', JSON.stringify(newData));
      setGameData(newData);
      
      // Reinitialiser l'item selectionne si necessaire
      if (selectedItemId && !newData.items[selectedItemId]) {
        setSelectedItemId(null);
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des donnees:', error);
      return false;
    }
  };

  // Recuperer les categories uniques en fonction du metier actif
  const getCategories = () => {
    const categories = new Set();
    categories.add('all');

    // Filtrer les items par métier actif si ce n'est pas 'all'
    Object.values(gameData.items).forEach(item => {
      // Vérifier si l'item a une recette et correspond au métier actif
      const recipe = gameData.recipes[item.id];
      if (recipe && (activeJobId === 'all' || recipe.jobId == activeJobId)) {
        if (item.type && typeof item.type === 'string') {
          categories.add(item.type.toLowerCase());
        }
      }
    });

    return Array.from(categories);
  };

  // Recuperer les metiers utilises dans les recettes
  const getJobs = () => {
    const jobs = [{ id: 'all', name: 'Tous' }];
    const jobsUsed = new Set();

    // Collecter tous les IDs de metiers utilises dans les recettes
    Object.values(gameData.recipes).forEach(recipe => {
      if (recipe.jobId) {
        jobsUsed.add(recipe.jobId);
      }
    });

    // Ajouter les metiers avec leurs noms
    jobsUsed.forEach(jobId => {
      const job = gameData.jobs[jobId];
      if (job) {
        jobs.push({ id: jobId, name: job.name });
      }
    });

    return jobs;
  };

  // Obtenir les items filtres et tries
  const getFilteredItems = () => {
    // Filtrer par metier et categorie
    let filteredItems = Object.values(gameData.items);

    // Ne garder que les objets qui ont une recette
    filteredItems = filteredItems.filter(item => gameData.recipes[item.id]);

    // Filtrer par metier
    if (activeJobId !== 'all') {
      filteredItems = filteredItems.filter(item => {
        const recipe = gameData.recipes[item.id];
        return recipe && recipe.jobId == activeJobId;
      });
    }

    // Filtrer par categorie
    if (activeCategory !== 'all') {
      filteredItems = filteredItems.filter(item => {
        return item.type && item.type.toLowerCase() === activeCategory.toLowerCase();
      });
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item => {
        return item.name && item.name.toLowerCase().includes(term);
      });
    }

    // Trier par niveau puis par nom
    filteredItems.sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.name.localeCompare(b.name);
    });

    // Grouper par niveau
    const groupedItems = {};
    filteredItems.forEach(item => {
      const level = item.level || 0;
      if (!groupedItems[level]) {
        groupedItems[level] = [];
      }
      groupedItems[level].push(item);
    });

    return groupedItems;
  };

  const value = {
    gameData,
    loading,
    saveGameData,
    activeJobId,
    setActiveJobId,
    activeCategory,
    setActiveCategory,
    searchTerm,
    setSearchTerm,
    selectedItemId,
    setSelectedItemId,
    getCategories,
    getJobs,
    getFilteredItems
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
