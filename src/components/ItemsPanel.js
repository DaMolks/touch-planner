import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import ImageWithFallback from './ImageWithFallback';
import './ItemsPanel.css';

const ItemsPanel = () => {
  const { 
    loading, 
    activeJobId,
    activeCategory, 
    setActiveCategory, 
    searchTerm, 
    setSearchTerm, 
    selectedItemId, 
    setSelectedItemId,
    getCategories,
    getFilteredItems
  } = useData();

  const [collapsedLevels, setCollapsedLevels] = useState({});
  
  // Réinitialiser la catégorie active si elle n'existe plus après un changement de métier
  useEffect(() => {
    const categories = getCategories();
    if (activeCategory !== 'all' && !categories.includes(activeCategory)) {
      setActiveCategory('all');
    }
  }, [activeJobId, getCategories, activeCategory, setActiveCategory]);

  // Gerer l'etat ouvert/ferme des niveaux
  const toggleLevel = (level) => {
    setCollapsedLevels(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  if (loading) {
    return <div className="items-panel panel loading">Chargement des données...</div>;
  }

  const categories = getCategories();
  const groupedItems = getFilteredItems();
  const levels = Object.keys(groupedItems).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="items-panel panel">
      <h2>Objets</h2>

      {/* Filtres de catégories */}
      <div className="category-filters">
        {categories.map(category => (
          <div 
            key={category} 
            className={`category-filter ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category === 'all' ? 'Toutes' : category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
        ))}
      </div>

      {/* Barre de recherche */}
      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder="Rechercher un objet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Liste des objets */}
      <div className="items-list-container">
        {levels.length === 0 ? (
          <div className="no-items-message">Aucun objet ne correspond à votre recherche.</div>
        ) : (
          levels.map(level => {
            const items = groupedItems[level];
            const isCollapsed = collapsedLevels[level];

            return (
              <div key={level} className="level-group">
                <div className="level-header" onClick={() => toggleLevel(level)}>
                  <span className="level-name">Niveau {level}</span>
                  <span className="level-count">{items.length} objet(s)</span>
                  <span className="collapse-icon">{isCollapsed ? '+' : '-'}</span>
                </div>
                {!isCollapsed && (
                  <div className="level-items-list">
                    {items.map(item => (
                      <div 
                        key={item.id} 
                        className={`item-list-row ${selectedItemId === item.id ? 'selected' : ''}`}
                        onClick={() => setSelectedItemId(item.id)}
                      >
                        <ImageWithFallback 
                          src={item.imgUrl} 
                          alt={item.name} 
                          className="item-list-image"
                        />
                        <span className="item-list-name">{item.name}</span>
                        <span className="item-list-type">{item.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ItemsPanel;