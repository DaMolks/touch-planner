import React, { createContext, useContext, useState, useEffect } from 'react';

// Création du contexte
const DataContext = createContext();

// Hook personnalisé pour utiliser le contexte
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

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = localStorage.getItem('gameData');
        if (savedData) {
          setGameData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Sauvegarder les données dans localStorage
  const saveGameData = (data) => {
    try {
      localStorage.setItem('gameData', JSON.stringify(data));
      setGameData(data);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
    }
  };

  // Récupérer les catégories uniques à partir des données
  const getCategories = () => {
    const categories = new Set();
    categories.add('all');

    Object.values(gameData.items).forEach(item => {
      if (item.type && typeof item.type === 'string') {
        categories.add(item.type.toLowerCase());
      }
    });

    return Array.from(categories);
  };

  // Récupérer les métiers utilisés dans les recettes
  const getJobs = () => {
    const jobs = [{ id: 'all', name: 'Tous' }];
    const jobsUsed = new Set();

    // Collecter tous les IDs de métiers utilisés dans les recettes
    Object.values(gameData.recipes).forEach(recipe => {
      if (recipe.jobId) {
        jobsUsed.add(recipe.jobId);
      }
    });

    // Ajouter les métiers avec leurs noms
    jobsUsed.forEach(jobId => {
      const job = gameData.jobs[jobId];
      if (job) {
        jobs.push({ id: jobId, name: job.name });
      }
    });

    return jobs;
  };

  // Obtenir les items filtrés et triés
  const getFilteredItems = () => {
    // Filtrer par métier et catégorie
    let filteredItems = Object.values(gameData.items);

    // Ne garder que les objets qui ont une recette
    filteredItems = filteredItems.filter(item => gameData.recipes[item.id]);

    // Filtrer par métier
    if (activeJobId !== 'all') {
      filteredItems = filteredItems.filter(item => {
        const recipe = gameData.recipes[item.id];
        return recipe && recipe.jobId == activeJobId;
      });
    }

    // Filtrer par catégorie
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
