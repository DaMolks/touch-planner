import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/themes.css';
import './styles/CustomTitleBar.css';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ItemsPanel from './components/ItemsPanel';
import RecipePanel from './components/RecipePanel';
import JobTabs from './components/JobTabs';
import { DataProvider } from './contexts/DataContext';
import { PriceProvider } from './contexts/PriceContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  // Détection si l'application fonctionne dans Electron
  useEffect(() => {
    if (window.electronAPI && window.electronAPI.isElectron) {
      setIsElectron(true);
    }
  }, []);

  // Check if data is already loaded from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('gameData');
    if (storedData) {
      setIsDataLoaded(true);
    }
  }, []);

  return (
    <ThemeProvider>
      <DataProvider>
        <PriceProvider>
          <div className={`app ${isElectron ? 'windows' : ''}`}>
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
    </ThemeProvider>
  );
}

export default App;