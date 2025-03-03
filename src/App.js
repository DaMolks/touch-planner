import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ItemsPanel from './components/ItemsPanel';
import RecipePanel from './components/RecipePanel';
import JobTabs from './components/JobTabs'; // Nouveau composant pour les onglets de métiers
import { DataProvider } from './contexts/DataContext';
import { PriceProvider } from './contexts/PriceContext';

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Check if data is already loaded from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('gameData');
    if (storedData) {
      setIsDataLoaded(true);
    }
  }, []);

  return (
    <DataProvider>
      <PriceProvider>
        <div className="app">
          <Header />
          <div className="container">
            {!isDataLoaded && (
              <FileUploader onDataLoaded={() => setIsDataLoaded(true)} />
            )}
            
            {isDataLoaded && (
              <>
                <div className="job-tabs-container">
                  <JobTabs />
                </div>
                <div className="main-content">
                  <ItemsPanel />
                  <RecipePanel />
                </div>
              </>
            )}
          </div>
        </div>
      </PriceProvider>
    </DataProvider>
  );
}

export default App;
