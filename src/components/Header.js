import React, { useState, useEffect } from 'react';
import ReloadButton from './ReloadButton';
import ThemeToggle from './ThemeToggle';
import WindowControls from './WindowControls';
// Importation directe du logo avec un chemin relatif
import logo from '../assets/touch-planner-logo.png';
import './Header.css';

const Header = () => {
  const [isElectron, setIsElectron] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Détecter si on est dans Electron
  useEffect(() => {
    if (window.electronAPI && window.electronAPI.isElectron) {
      setIsElectron(true);
    }
  }, []);

  // Gestionnaire d'erreur pour l'image
  const handleImageError = () => {
    console.error("Erreur de chargement du logo");
    setLogoError(true);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            {logoError ? (
              <h1>Touch Planner</h1>
            ) : (
              <img 
                src={logo} 
                alt="Touch Planner" 
                className="header-logo" 
                onError={handleImageError}
              />
            )}
          </div>
          <div className="header-right">
            <ReloadButton />
            <ThemeToggle />
            {isElectron && <WindowControls />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;