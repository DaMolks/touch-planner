import React, { createContext, useContext, useState, useEffect } from 'react';

// Création du contexte
const PriceContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const usePrices = () => useContext(PriceContext);

// Structure pour un enregistrement d'historique de prix
// { timestamp: Date, price: Number }

// Fournisseur du contexte
export const PriceProvider = ({ children }) => {
  const [prices, setPrices] = useState({});
  const [priceHistory, setPriceHistory] = useState({});
  const [batchSize, setBatchSize] = useState(1);
  
  // Charger les prix et l'historique depuis localStorage au démarrage
  useEffect(() => {
    const loadPrices = () => {
      try {
        const savedPrices = localStorage.getItem('prices');
        if (savedPrices) {
          setPrices(JSON.parse(savedPrices));
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

  // Mettre à jour le prix d'un item
  const updatePrice = (itemId, price) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    const newPrices = { ...prices, [itemId]: numericPrice };
    setPrices(newPrices);
    localStorage.setItem('prices', JSON.stringify(newPrices));

    // Ajouter à l'historique des prix
    addPriceHistory(itemId, numericPrice);
  };

  // Ajouter un prix à l'historique
  const addPriceHistory = (itemId, price) => {
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

  // Déterminer l'indicateur de prix (bas, moyen, élevé)
  const getPriceIndicator = (itemId, currentPrice) => {
    if (!currentPrice) return 'price-average';
    
    const avgPrice = getAveragePrice(itemId);
    if (!avgPrice) return 'price-average';

    const ratio = currentPrice / avgPrice;

    if (ratio < 0.9) return 'price-low'; // Prix bas
    if (ratio > 1.1) return 'price-high'; // Prix élevé
    return 'price-average'; // Prix moyen
  };

  // Obtenir l'historique des prix d'un item
  const getItemPriceHistory = (itemId) => {
    return priceHistory[itemId] || [];
  };

  // Calculer le coût des ingrédients pour une recette
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

    // Par défaut, on considère que le prix de vente inclut déjà la taxe
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
    updatePrice,
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
