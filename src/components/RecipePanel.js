import React, { useState, useRef, useEffect } from 'react';
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
    calculateIngredientsCost,
    batchSize,
    setBatchSize
  } = usePrices();

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [currentHistoryItem, setCurrentHistoryItem] = useState(null);
  const panelRef = useRef(null);

  // Recuperer l'objet et la recette selectionnes
  const selectedItem = selectedItemId ? gameData.items[selectedItemId] : null;
  const recipe = selectedItemId ? gameData.recipes[selectedItemId] : null;

  // Effet pour s'assurer que le focus est libéré après le chargement d'un nouvel item
  useEffect(() => {
    // Libérer le focus quand l'item sélectionné change
    if (document.activeElement && document.activeElement.tagName === 'INPUT') {
      document.activeElement.blur();
    }
    
    // Remonter au début du panneau quand un nouvel item est sélectionné
    if (panelRef.current && selectedItemId) {
      panelRef.current.scrollTop = 0;
    }
  }, [selectedItemId]);

  // Calculer le profit pour le lot selectionne
  const calculateLotProfit = () => {
    if (!selectedItemId || !recipe) {
      return { 
        profit: 0, 
        profitPercent: 0, 
        tax: 0, 
        cost: 0, 
        totalSellingPrice: 0, 
        netSellingPrice: 0 
      };
    }

    // Prix de vente unitaire
    const unitPrice = prices[selectedItemId] || 0;
    
    // Prix de vente total pour le lot
    const totalSellingPrice = unitPrice * batchSize;
    
    // Taxe de vente (3%)
    const tax = Math.round(totalSellingPrice * 0.03);
    
    // Prix net après taxe
    const netSellingPrice = totalSellingPrice - tax;
    
    // Coût des ingrédients unitaire
    const unitCost = calculateIngredientsCost(recipe);
    
    // Coût total pour le lot
    const cost = unitCost * batchSize;
    
    // Profit pour le lot
    const profit = netSellingPrice - cost;
    
    // Pourcentage de profit
    const profitPercent = cost > 0 ? (profit / cost) * 100 : 0;

    return {
      profit,
      profitPercent,
      tax,
      cost,
      totalSellingPrice,
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

  // Empêcher le défilement indésirable dans les champs numériques
  const handleWheel = (e) => {
    // Empêcher le changement de valeur du champ sur défilement de molette
    e.target.blur();
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
      <div className="recipe-panel panel" ref={panelRef}>
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
    <div className="recipe-panel panel" ref={panelRef}>
      <h2>Details de la Recette</h2>
      
      {/* En-tete de la recette */}
      <div className="recipe-header">
        <div className="recipe-item-row">
          <div className="recipe-image-container">
            <ImageWithFallback 
              src={selectedItem.imgUrl} 
              alt={selectedItem.name} 
              className="recipe-item-image"
            />
          </div>
          <div className="recipe-details-container">
            <h3>{selectedItem.name}</h3>
            <p className="item-level">Niveau {selectedItem.level || '?'}</p>
            <p><strong>Metier:</strong> {job ? job.name : 'Inconnu'}</p>
            <p><strong>Niveau requis:</strong> {recipe.jobLevel || '?'}</p>
          </div>
        </div>
      </div>

      {/* Selecteur de taille de lot */}
      <div className="setting-row batch-selector">
        <div className="inline-setting">
          <div className="setting-label">Calculer pour un lot de:</div>
          <div className="setting-value">
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
        </div>
      </div>

      {/* Prix de vente */}
      <div className="setting-row price-container">
        <div className="inline-setting">
          <div className="setting-label">Prix de vente unitaire:</div>
          <div className="setting-value">
            <div className="price-input">
              <div className="price-input-wrapper">
                <input 
                  type="number" 
                  min="0" 
                  value={tempPrices[selectedItemId] || 0} 
                  onChange={(e) => handlePriceChange(selectedItemId, e.target.value)}
                  onBlur={() => handlePriceConfirm(selectedItemId)}
                  onKeyDown={(e) => handleKeyDown(e, selectedItemId)}
                  onWheel={handleWheel}
                />
                {tempPrices[selectedItemId] !== prices[selectedItemId] && (
                  <button 
                    className="price-validate-btn" 
                    onClick={() => handlePriceConfirm(selectedItemId)}
                    title="Valider le prix"
                  >
                    ✓
                  </button>
                )}
              </div>
              <span className="label-kamas">kamas</span>
              <span 
                className={`price-indicator ${getPriceIndicator(selectedItemId, prices[selectedItemId] || 0)}`}
                onClick={(e) => showHistory(selectedItemId, selectedItem.name, e)}
                title="Voir l'historique des prix"
              ></span>
            </div>
          </div>
        </div>
        {tempPrices[selectedItemId] !== prices[selectedItemId] && (
          <div className="price-not-saved">Prix non validé</div>
        )}
      </div>

      {/* Ingredients */}
      <div className="setting-row ingredients-container">
        <div className="setting-label">Ingredients nécessaires pour {batchSize} item(s):</div>
        <div className="setting-value ingredients-list">
          {recipe.ingredients.map(ingredient => {
            const ingredientItem = gameData.items[ingredient.itemId];
            if (!ingredientItem) return null;

            const totalQuantity = ingredient.quantity * batchSize;
            
            return (
              <div key={ingredient.itemId} className="ingredient-item">
                <div className="ingredient-item-row">
                  <div className="ingredient-image-container">
                    <ImageWithFallback 
                      src={ingredientItem.imgUrl} 
                      alt={ingredientItem.name} 
                      className="ingredient-image"
                    />
                  </div>
                  <div className="ingredient-name-container">
                    <span className="ingredient-name">{ingredientItem.name}</span>
                    <span className="ingredient-quantity">x{totalQuantity}</span>
                  </div>
                  <div className="ingredient-price-container">
                    <div className="price-input-wrapper">
                      <input 
                        type="number" 
                        min="0" 
                        value={tempPrices[ingredient.itemId] || 0} 
                        onChange={(e) => handlePriceChange(ingredient.itemId, e.target.value)}
                        onBlur={() => handlePriceConfirm(ingredient.itemId)}
                        onKeyDown={(e) => handleKeyDown(e, ingredient.itemId)}
                        onWheel={handleWheel}
                      />
                      {tempPrices[ingredient.itemId] !== prices[ingredient.itemId] && (
                        <button 
                          className="price-validate-btn" 
                          onClick={() => handlePriceConfirm(ingredient.itemId)}
                          title="Valider le prix"
                        >
                          ✓
                        </button>
                      )}
                    </div>
                    <span className="label-kamas">kamas</span>
                  </div>
                  <div className="ingredient-indicator-container">
                    <span 
                      className={`price-indicator ${getPriceIndicator(ingredient.itemId, prices[ingredient.itemId] || 0)}`}
                      onClick={(e) => showHistory(ingredient.itemId, ingredientItem.name, e)}
                      title="Voir l'historique des prix"
                    ></span>
                  </div>
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
      <div className="setting-row results-container">
        <div className="setting-label">Résultats du calcul:</div>
        <div className="setting-value">
          <div className="calculation-row">
            <span>Cout total des ingredients:</span>
            <span className="value">{profitInfo.cost.toLocaleString()} kamas</span>
          </div>
          <div className="calculation-row">
            <span>Prix de vente total:</span>
            <span className="value">{profitInfo.totalSellingPrice.toLocaleString()} kamas</span>
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