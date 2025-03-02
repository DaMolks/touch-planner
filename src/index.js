import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { GameDataProvider } from './contexts/GameDataContext';
import { PricesProvider } from './contexts/PricesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GameDataProvider>
      <PricesProvider>
        <App />
      </PricesProvider>
    </GameDataProvider>
  </React.StrictMode>
);
