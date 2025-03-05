import React, { useState, useEffect } from 'react';
import ReloadButton from './ReloadButton';
import ThemeToggle from './ThemeToggle';
import WindowControls from './WindowControls';
// Importation du logo depuis le dossier public
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

  // Utiliser le chemin du dossier public pour l'image
  const logoPath = process.env.PUBLIC_URL + '/touch-planner-logo.png';

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            {logoError ? (
              <h1>Touch Planner</h1>
            ) : (
              <img 
                src={logoPath}
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