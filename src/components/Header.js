import React from 'react';
import ReloadButton from './ReloadButton';
import { useTheme } from '../contexts/ThemeContext';
import './Header.css';

const Header = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <div className="logo-icon">TP</div>
              <div className="logo-text">
                <h1>Touch Planner</h1>
                <p>Calculatrice de craft avancée pour Dofus Touch</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button 
              className="theme-toggle-btn" 
              onClick={toggleTheme}
              title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
            <ReloadButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;