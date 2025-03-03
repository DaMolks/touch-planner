import React, { createContext, useContext, useState, useEffect } from 'react';

// Creation du contexte
const PriceContext = createContext();

// Hook personnalise pour utiliser le contexte
export const usePrices = () => useContext(PriceContext);

// Structure pour un enregistrement d'historique de prix
// { timestamp: Date, price: Number }

// Fournisseur du contexte
export const PriceProvider = ({ children }) => {
  const [prices, setPrices] = useState({});
  const [tempPrices, setTempPrices] = useState({}); // Valeurs temporaires pendant l'édition
  const [priceHistory, setPriceHistory] = useState({});
  const [batchSize, setBatchSize] = useState(1);
  
  // Charger les prix et l'historique depuis localStorage au demarrage
  useEffect(() => {
    const loadPrices = () => {
      try {
        const savedPrices = localStorage.getItem('prices');
        if (savedPrices) {
          const parsedPrices = JSON.parse(savedPrices);
          setPrices(parsedPrices);
          setTempPrices(parsedPrices); // Initialiser les valeurs temporaires
        }

        const savedHistory = localStorage.getItem('priceHistory');
        if (savedHistory) {
          setPriceHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des prix:', error);
      }
    };

    loadPrices();
  }, []);

  // Mettre à jour temporairement le prix pendant l'édition
  const updateTempPrice = (itemId, price) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    setTempPrices(prev => ({ ...prev, [itemId]: numericPrice }));
  };

  // Valider et sauvegarder le prix définitif
  const confirmPrice = (itemId) => {
    const price = tempPrices[itemId];
    if (price !== prices[itemId]) { // Ne valider que si le prix a changé
      const newPrices = { ...prices, [itemId]: price };
      setPrices(newPrices);
      localStorage.setItem('prices', JSON.stringify(newPrices));
      
      // Ajouter à l'historique des prix
      addPriceHistory(itemId, price);
    }
  };

  // Ajouter un prix a l'historique
  const addPriceHistory = (itemId, price) => {
    if (price === undefined || isNaN(price)) return; // Protection contre les valeurs invalides
    
    const now = new Date();
    const newHistory = { ...priceHistory };

    // Initialiser l'historique pour cet item s'il n'existe pas encore
    if (!newHistory[itemId]) {
      newHistory[itemId] = [];
    }

    // Ajouter le nouveau prix avec un horodatage
    newHistory[itemId].push({
      timestamp: now.toISOString(),
      price: price
    });

    // Limiter la taille de l'historique (garder les 30 derniers prix)
    if (newHistory[itemId].length > 30) {
      newHistory[itemId] = newHistory[itemId].slice(-30);
    }

    setPriceHistory(newHistory);
    localStorage.setItem('priceHistory', JSON.stringify(newHistory));
  };

  // Obtenir la moyenne des prix pour un item
  const getAveragePrice = (itemId) => {
    const history = priceHistory[itemId];
    if (!history || history.length === 0) {
      return 0;
    }

    const sum = history.reduce((total, entry) => total + entry.price, 0);
    return sum / history.length;
  };

  // Determiner l'indicateur de prix (bas, moyen, eleve)
  const getPriceIndicator = (itemId, currentPrice) => {
    if (!currentPrice) return 'price-average';
    
    const avgPrice = getAveragePrice(itemId);
    if (!avgPrice) return 'price-average';

    const ratio = currentPrice / avgPrice;

    if (ratio < 0.9) return 'price-low'; // Prix bas
    if (ratio > 1.1) return 'price-high'; // Prix eleve
    return 'price-average'; // Prix moyen
  };

  // Obtenir l'historique des prix d'un item
  const getItemPriceHistory = (itemId) => {
    return priceHistory[itemId] || [];
  };

  // Calculer le cout des ingredients pour une recette
  const calculateIngredientsCost = (recipe) => {
    if (!recipe || !recipe.ingredients) return 0;

    return recipe.ingredients.reduce((total, ingredient) => {
      const price = prices[ingredient.itemId] || 0;
      return total + (price * ingredient.quantity);
    }, 0);
  };

  // Calculer le profit pour un craft
  const calculateProfit = (recipeId, sellingPrice, includesTax = true) => {
    if (!recipeId) return { profit: 0, profitPercent: 0 };

    // Par defaut, on considere que le prix de vente inclut deja la taxe
    let netSellingPrice = sellingPrice;
    
    // Taxe de vente (3%)
    let tax = 0;
    if (includesTax) {
      tax = Math.round(sellingPrice * 0.03);
      netSellingPrice = sellingPrice - tax;
    }

    const recipe = JSON.parse(localStorage.getItem('gameData'))?.recipes[recipeId];
    if (!recipe) return { profit: 0, profitPercent: 0, tax };

    const cost = calculateIngredientsCost(recipe);
    const profit = netSellingPrice - cost;
    const profitPercent = cost > 0 ? (profit / cost) * 100 : 0;

    return { cost, profit, profitPercent, tax, netSellingPrice };
  };

  const value = {
    prices,
    tempPrices,
    updateTempPrice,
    confirmPrice,
    priceHistory,
    getAveragePrice,
    getPriceIndicator,
    getItemPriceHistory,
    calculateIngredientsCost,
    calculateProfit,
    batchSize,
    setBatchSize
  };

  return (
    <PriceContext.Provider value={value}>
      {children}
    </PriceContext.Provider>
  );
};
