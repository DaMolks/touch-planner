import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import './ItemsPanel.css';

const ItemsPanel = () => {
  const { 
    loading, 
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
  } = useData();

  const [collapsedLevels, setCollapsedLevels] = useState({});

  // Gérer l'état ouvert/fermé des niveaux
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
  const jobs = getJobs();
  const groupedItems = getFilteredItems();
  const levels = Object.keys(groupedItems).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="items-panel panel">
      <h2>Objets</h2>

      {/* Onglets des métiers */}
      <div className="job-tabs">
        {jobs.map(job => (
          <div 
            key={job.id} 
            className={`job-tab ${activeJobId === job.id ? 'active' : ''}`}
            onClick={() => setActiveJobId(job.id)}
          >
            {job.name}
          </div>
        ))}
      </div>

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
      <div className="items-list">
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
                  <div className="level-items">
                    {items.map(item => (
                      <div 
                        key={item.id} 
                        className={`item ${selectedItemId === item.id ? 'selected' : ''}`}
                        onClick={() => setSelectedItemId(item.id)}
                      >
                        {item.imgUrl && (
                          <img 
                            src={item.imgUrl} 
                            alt={item.name} 
                            className="item-image"
                            onError={(e) => e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}
                          />
                        )}
                        <span className="item-name">{item.name}</span>
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
