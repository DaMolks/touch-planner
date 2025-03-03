import React from 'react';
import ReloadButton from './ReloadButton';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <h1>Touch Planner</h1>
            <p>Calculatrice de craft avancée pour Dofus Touch</p>
          </div>
          <div className="header-right">
            <ReloadButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;