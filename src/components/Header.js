import React, { useState, useEffect } from 'react';
import ReloadButton from './ReloadButton';
import ThemeToggle from './ThemeToggle';
import WindowControls from './WindowControls';
import logo from '../assets/touch-planner-logo.png'; // Importation du logo
import './Header.css';

const Header = () => {
  const [isElectron, setIsElectron] = useState(false);

  // Détecter si on est dans Electron
  useEffect(() => {
    if (window.electronAPI && window.electronAPI.isElectron) {
      setIsElectron(true);
    }
  }, []);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <img src={logo} alt="Touch Planner" className="header-logo" />
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