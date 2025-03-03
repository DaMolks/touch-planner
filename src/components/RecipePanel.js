import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { usePrices } from '../contexts/PriceContext';
import PriceHistoryModal from './PriceHistoryModal';
import ImageWithFallback from './ImageWithFallback';
import './RecipePanel.css';

const RecipePanel = () => {
  const { gameData, selectedItemId } = useData();
  const { 
    prices, 
    updatePrice, 
    getPriceIndicator, 
    calculateProfit,
    batchSize,
    setBatchSize
  } = usePrices();

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [currentHistoryItem, setCurrentHistoryItem] = useState(null);

  // Recuperer l'objet et la recette selectionnes
  const selectedItem = selectedItemId ? gameData.items[selectedItemId] : null;
  const recipe = selectedItemId ? gameData.recipes[selectedItemId] : null;

  // Calculer le profit pour le lot selectionne
  const calculateLotProfit = () => {
    if (!selectedItemId) return { profit: 0, profitPercent: 0, tax: 0, cost: 0, netSellingPrice: 0 };

    const sellingPrice = (prices[selectedItemId] || 0) * batchSize;
    const { profit, profitPercent, tax, cost, netSellingPrice } = calculateProfit(selectedItemId, sellingPrice);

    return {
      profit,
      profitPercent,
      tax,
      cost: cost * batchSize,
      netSellingPrice
    };
  };

  const profitInfo = calculateLotProfit();

  // Gerer le changement de prix d'un ingredient
  const handlePriceChange = (itemId, value) => {
    const price = parseFloat(value) || 0;
    updatePrice(itemId, price);
  };

  // Afficher l'historique des prix
  const showHistory = (itemId, itemName) => {
    setCurrentHistoryItem({ id: itemId, name: itemName });
    setHistoryModalOpen(true);
  };

  // Si aucun objet n'est selectionne, afficher un message
  if (!selectedItem || !recipe) {
    return (
      <div className="recipe-panel panel">
        <h2>Details de la Recette</h2>
        <div className="empty-state">
          <p>Selectionnez un objet dans la liste pour voir sa recette et calculer sa rentabilite.</p>
        </div>
      </div>
    );
  }

  // Le metier associe a la recette
  const job = gameData.jobs[recipe.jobId];

  return (
    <div className="recipe-panel panel">
      <h2>Details de la Recette</h2>
      
      {/* En-tete de la recette */}
      <div className="recipe-header">
        <div className="recipe-item-info">
          <ImageWithFallback 
            src={selectedItem.imgUrl} 
            alt={selectedItem.name} 
            className="recipe-item-image"
          />
          <div className="recipe-item-details">
            <h3>{selectedItem.name}</h3>
            <p className="item-level">Niveau {selectedItem.level || '?'}</p>
          </div>
        </div>
        <div className="recipe-profession">
          <p><strong>Metier:</strong> {job ? job.name : 'Inconnu'}</p>
          <p><strong>Niveau requis:</strong> {recipe.jobLevel || '?'}</p>
        </div>
      </div>

      {/* Selecteur de taille de lot */}
      <div className="batch-selector">
        <label>Calculer pour un lot de:</label>
        <select 
          value={batchSize} 
          onChange={(e) => setBatchSize(parseInt(e.target.value))}
        >
          <option value="1">1 item</option>
          <option value="10">10 items</option>
          <option value="100">100 items</option>
          <option value="1000">1000 items</option>
        </select>
      </div>

      {/* Prix de vente */}
      <div className="selling-price-container">
        <h3>Prix de vente unitaire:</h3>
        <div className="price-input">
          <input 
            type="number" 
            min="0" 
            value={prices[selectedItemId] || 0} 
            onChange={(e) => handlePriceChange(selectedItemId, e.target.value)}
          />
          <span className="label-kamas">kamas</span>
          <span 
            className={`price-indicator ${getPriceIndicator(selectedItemId, prices[selectedItemId] || 0)}`}
            onClick={() => showHistory(selectedItemId, selectedItem.name)}
            title="Voir l'historique des prix"
          ></span>
        </div>
      </div>

      {/* Ingredients */}
      <div className="ingredients-container">
        <h3>Ingredients necessaires pour {batchSize} item(s):</h3>
        <div className="ingredients-list">
          {recipe.ingredients.map(ingredient => {
            const ingredientItem = gameData.items[ingredient.itemId];
            if (!ingredientItem) return null;

            const totalQuantity = ingredient.quantity * batchSize;
            
            return (
              <div key={ingredient.itemId} className="ingredient-item">
                <div className="ingredient-info">
                  <ImageWithFallback 
                    src={ingredientItem.imgUrl} 
                    alt={ingredientItem.name} 
                    className="ingredient-image"
                  />
                  <div className="ingredient-details">
                    <span className="ingredient-name">{ingredientItem.name}</span>
                    <span className="ingredient-quantity">x{totalQuantity}</span>
                  </div>
                </div>
                <div className="price-input">
                  <label>Prix unitaire:</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={prices[ingredient.itemId] || 0} 
                    onChange={(e) => handlePriceChange(ingredient.itemId, e.target.value)}
                  />
                  <span className="label-kamas">kamas</span>
                  <span 
                    className={`price-indicator ${getPriceIndicator(ingredient.itemId, prices[ingredient.itemId] || 0)}`}
                    onClick={() => showHistory(ingredient.itemId, ingredientItem.name)}
                    title="Voir l'historique des prix"
                  ></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resultats de rentabilite */}
      <div className="results-container">
        <div className="calculation-row">
          <span>Cout total des ingredients:</span>
          <span className="value">{profitInfo.cost.toLocaleString()} kamas</span>
        </div>
        <div className="calculation-row">
          <span>Prix de vente total:</span>
          <span className="value">{(prices[selectedItemId] * batchSize || 0).toLocaleString()} kamas</span>
        </div>
        <div className="calculation-row tax-row">
          <span>Taxe de vente (3%):</span>
          <span className="value">-{profitInfo.tax.toLocaleString()} kamas</span>
        </div>
        <div className="calculation-row">
          <span>Prix net apres taxe:</span>
          <span className="value">{profitInfo.netSellingPrice.toLocaleString()} kamas</span>
        </div>
        <div className={`calculation-row profit-row ${profitInfo.profit >= 0 ? 'positive' : 'negative'}`}>
          <span>Profit pour {batchSize} item(s):</span>
          <span className="value">{profitInfo.profit.toLocaleString()} kamas ({profitInfo.profitPercent.toFixed(2)}%)</span>
        </div>
      </div>

      {/* Modal pour l'historique des prix */}
      {historyModalOpen && (
        <PriceHistoryModal 
          item={currentHistoryItem}
          onClose={() => setHistoryModalOpen(false)}
        />
      )}
    </div>
  );
};

export default RecipePanel;