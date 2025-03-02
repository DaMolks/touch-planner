import React, { useState } from 'react';
import { useGameData } from './contexts/GameDataContext';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ItemsPanel from './components/ItemsPanel';
import RecipePanel from './components/RecipePanel';
import PriceHistoryModal from './components/PriceHistoryModal';
import './styles/App.css';

function App() {
  const { loaded } = useGameData();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);

  // Ouvrir la modal d'historique des prix
  const openPriceHistory = (itemId, itemName) => {
    setHistoryItem({ id: itemId, name: itemName });
  };

  // Fermer la modal d'historique des prix
  const closePriceHistory = () => {
    setHistoryItem(null);
  };

  return (
    <div className="app">
      <Header />
      
      {!loaded ? (
        <FileUploader />
      ) : (
        <div className="main-container">
          <ItemsPanel onSelectItem={setSelectedItemId} />
          <RecipePanel 
            itemId={selectedItemId} 
            onOpenPriceHistory={openPriceHistory} 
          />
        </div>
      )}
      
      {historyItem && (
        <PriceHistoryModal 
          itemId={historyItem.id} 
          itemName={historyItem.name} 
          onClose={closePriceHistory} 
        />
      )}
    </div>
  );
}

export default App;
