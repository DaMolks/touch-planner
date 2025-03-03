const { contextBridge, ipcRenderer } = require('electron');
const { app } = require('@electron/remote');
const fs = require('fs');
const path = require('path');

// Exposer des fonctionnalités sécurisées à la fenêtre de rendu
contextBridge.exposeInMainWorld('electronAPI', {
  // Exemples de fonctions qui pourraient être utiles pour votre application
  // Ces fonctions permettront d'accéder au système de fichiers natif pour les sauvegardes
  
  // Version Electron de localStorage pour rendre les sauvegardes plus robustes
  saveGameData: (data) => {
    try {
      const userDataPath = app.getPath('userData');
      const filePath = path.join(userDataPath, 'gameData.json');
      fs.writeFileSync(filePath, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
      return false;
    }
  },
  
  loadGameData: () => {
    try {
      const userDataPath = app.getPath('userData');
      const filePath = path.join(userDataPath, 'gameData.json');
      
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      return null;
    }
  },
  
  // Enregistrer et charger l'historique des prix
  savePriceHistory: (data) => {
    try {
      const userDataPath = app.getPath('userData');
      const filePath = path.join(userDataPath, 'priceHistory.json');
      fs.writeFileSync(filePath, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique des prix:', error);
      return false;
    }
  },
  
  loadPriceHistory: () => {
    try {
      const userDataPath = app.getPath('userData');
      const filePath = path.join(userDataPath, 'priceHistory.json');
      
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      }
      return {};
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique des prix:', error);
      return {};
    }
  }
});