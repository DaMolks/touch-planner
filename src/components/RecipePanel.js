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
    tempPrices,
    updateTempPrice,
    confirmPrice,
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

  // Gerer le changement de prix temporaire pendant l'édition
  const handlePriceChange = (itemId, value) => {
    const price = parseFloat(value) || 0;
    updateTempPrice(itemId, price);
  };

  // Valider le prix quand l'utilisateur quitte le champ ou appuie sur Entrée
  const handlePriceConfirm = (itemId) => {
    confirmPrice(itemId);
  };

  // Gérer la touche Entrée pour valider le prix
  const handleKeyDown = (e, itemId) => {
    if (e.key === 'Enter') {
      confirmPrice(itemId);
      e.target.blur(); // Enlever le focus après validation
    }
  };

  // Afficher l'historique des prix
  const showHistory = (itemId, itemName, e) => {
    e.stopPropagation(); // Éviter de déclencher d'autres événements
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
            value={tempPrices[selectedItemId] || 0} 
            onChange={(e) => handlePriceChange(selectedItemId, e.target.value)}
            onBlur={() => handlePriceConfirm(selectedItemId)}
            onKeyDown={(e) => handleKeyDown(e, selectedItemId)}
          />
          <span className="label-kamas">kamas</span>
          <button 
            className="price-validate-btn" 
            onClick={() => handlePriceConfirm(selectedItemId)}
            title="Valider le prix"
          >
            ✓
          </button>
          <span 
            className={`price-indicator ${getPriceIndicator(selectedItemId, prices[selectedItemId] || 0)}`}
            onClick={(e) => showHistory(selectedItemId, selectedItem.name, e)}
            title="Voir l'historique des prix"
          ></span>
        </div>
        {tempPrices[selectedItemId] !== prices[selectedItemId] && (
          <div className="price-not-saved">Prix non validé</div>
        )}
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
                    value={tempPrices[ingredient.itemId] || 0} 
                    onChange={(e) => handlePriceChange(ingredient.itemId, e.target.value)}
                    onBlur={() => handlePriceConfirm(ingredient.itemId)}
                    onKeyDown={(e) => handleKeyDown(e, ingredient.itemId)}
                  />
                  <span className="label-kamas">kamas</span>
                  <button 
                    className="price-validate-btn" 
                    onClick={() => handlePriceConfirm(ingredient.itemId)}
                    title="Valider le prix"
                  >
                    ✓
                  </button>
                  <span 
                    className={`price-indicator ${getPriceIndicator(ingredient.itemId, prices[ingredient.itemId] || 0)}`}
                    onClick={(e) => showHistory(ingredient.itemId, ingredientItem.name, e)}
                    title="Voir l'historique des prix"
                  ></span>
                </div>
                {tempPrices[ingredient.itemId] !== prices[ingredient.itemId] && (
                  <div className="price-not-saved">Prix non validé</div>
                )}
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
        {Object.keys(tempPrices).some(key => tempPrices[key] !== prices[key]) && (
          <div className="calculation-row warning-row">
            <span>⚠️ Certains prix n'ont pas été validés, les calculs utilisent les derniers prix confirmés.</span>
          </div>
        )}
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