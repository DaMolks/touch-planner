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

  // Charger les donnees depuis localStorage ou du fichier par défaut au démarrage
  useEffect(() => {
    const loadData = async () => {
      try {
        // D'abord essayer de charger depuis localStorage
        const savedData = localStorage.getItem('gameData');
        if (savedData) {
          setGameData(JSON.parse(savedData));
          setLoading(false);
          return;
        }

        // Si pas de données dans localStorage, charger depuis le fichier par défaut
        const response = await fetch(`${process.env.PUBLIC_URL}/game-data.json`);
        if (response.ok) {
          const defaultData = await response.json();
          
          // Vérifier que le fichier contient les données attendues
          if (!defaultData.items || !defaultData.recipes || !defaultData.jobs) {
            throw new Error('Le fichier de données par défaut ne contient pas les informations nécessaires');
          }
          
          // Sauvegarder les données et mettre à jour l'état
          localStorage.setItem('gameData', JSON.stringify(defaultData));
          setGameData(defaultData);
        } else {
          console.error('Erreur lors du chargement du fichier de données par défaut');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
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

    // Convertir et trier les catégories par ordre alphabétique
    return Array.from(categories).sort((a, b) => {
      // Garder "all" toujours en premier
      if (a === 'all') return -1;
      if (b === 'all') return 1;
      // Trier le reste alphabétiquement
      return a.localeCompare(b, 'fr', { sensitivity: 'base' });
    });
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
    const sortedJobs = [];
    jobsUsed.forEach(jobId => {
      const job = gameData.jobs[jobId];
      if (job) {
        sortedJobs.push({ id: jobId, name: job.name });
      }
    });

    // Trier les métiers par ordre alphabétique (sauf "Tous" qui reste en premier)
    sortedJobs.sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
    
    return [...jobs, ...sortedJobs];
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
      // Trier d'abord par niveau
      if (a.level !== b.level) return a.level - b.level;
      // Puis par ordre alphabétique du nom
      return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
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
