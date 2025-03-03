import React from 'react';

const WindowControls = () => {
  // Ces fonctions ne fonctionneront que dans le contexte Electron
  const isElectron = window.electronAPI !== undefined;

  const handleMinimize = () => {
    if (isElectron && window.electronAPI.minimize) {
      window.electronAPI.minimize();
    }
  };

  const handleMaximize = () => {
    if (isElectron && window.electronAPI.maximize) {
      window.electronAPI.maximize();
    }
  };

  const handleClose = () => {
    if (isElectron && window.electronAPI.close) {
      window.electronAPI.close();
    }
  };

  // Ne pas afficher les contrôles dans un environnement web
  if (!isElectron) return null;

  return (
    <div className="window-controls">
      <button 
        className="window-control-button minimize" 
        onClick={handleMinimize}
        aria-label="Minimiser"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <button 
        className="window-control-button maximize" 
        onClick={handleMaximize}
        aria-label="Maximiser"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <rect x="5" y="5" width="14" height="14" rx="1" />
        </svg>
      </button>
      <button 
        className="window-control-button close" 
        onClick={handleClose}
        aria-label="Fermer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default WindowControls;