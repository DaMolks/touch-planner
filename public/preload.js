const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// Tentative d'import de remote
let remote;
try {
  remote = require('@electron/remote');
} catch (error) {
  console.error('Module @electron/remote non disponible :', error);
}

// Exposer des fonctionnalités sécurisées à la fenêtre de rendu
contextBridge.exposeInMainWorld('electronAPI', {
  // Version Electron de localStorage pour rendre les sauvegardes plus robustes
  saveGameData: (data) => {
    try {
      // Fallback vers localStorage si remote n'est pas disponible
      if (!remote) {
        localStorage.setItem('gameData', JSON.stringify(data));
        return true;
      }
      
      const userDataPath = remote.app.getPath('userData');
      const filePath = path.join(userDataPath, 'gameData.json');
      fs.writeFileSync(filePath, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
      // Fallback vers localStorage en cas d'erreur
      try {
        localStorage.setItem('gameData', JSON.stringify(data));
        return true;
      } catch (e) {
        return false;
      }
    }
  },
  
  loadGameData: () => {
    try {
      // Fallback vers localStorage si remote n'est pas disponible
      if (!remote) {
        const data = localStorage.getItem('gameData');
        return data ? JSON.parse(data) : null;
      }
      
      const userDataPath = remote.app.getPath('userData');
      const filePath = path.join(userDataPath, 'gameData.json');
      
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      }
      
      // Si le fichier n'existe pas, essayer de lire depuis localStorage
      const data = localStorage.getItem('gameData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Fallback vers localStorage en cas d'erreur
      try {
        const data = localStorage.getItem('gameData');
        return data ? JSON.parse(data) : null;
      } catch (e) {
        return null;
      }
    }
  },
  
  // Enregistrer et charger l'historique des prix
  savePriceHistory: (data) => {
    try {
      // Fallback vers localStorage si remote n'est pas disponible
      if (!remote) {
        localStorage.setItem('priceHistory', JSON.stringify(data));
        return true;
      }
      
      const userDataPath = remote.app.getPath('userData');
      const filePath = path.join(userDataPath, 'priceHistory.json');
      fs.writeFileSync(filePath, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique des prix:', error);
      // Fallback vers localStorage en cas d'erreur
      try {
        localStorage.setItem('priceHistory', JSON.stringify(data));
        return true;
      } catch (e) {
        return false;
      }
    }
  },
  
  loadPriceHistory: () => {
    try {
      // Fallback vers localStorage si remote n'est pas disponible
      if (!remote) {
        const data = localStorage.getItem('priceHistory');
        return data ? JSON.parse(data) : {};
      }
      
      const userDataPath = remote.app.getPath('userData');
      const filePath = path.join(userDataPath, 'priceHistory.json');
      
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      }
      
      // Si le fichier n'existe pas, essayer de lire depuis localStorage
      const data = localStorage.getItem('priceHistory');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique des prix:', error);
      // Fallback vers localStorage en cas d'erreur
      try {
        const data = localStorage.getItem('priceHistory');
        return data ? JSON.parse(data) : {};
      } catch (e) {
        return {};
      }
    }
  },
  
  // Ouvrir un fichier JSON - cette fonction ne fonctionnera qu'avec remote
  openJsonFile: async () => {
    if (!remote) {
      console.error('La fonctionnalité openJsonFile nécessite @electron/remote');
      return null;
    }
    
    try {
      const result = await remote.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'JSON', extensions: ['json'] }]
      });
      
      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du fichier:', error);
      return null;
    }
  }
});