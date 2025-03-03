const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV !== 'production';

let mainWindow;

function createWindow() {
  // Créer la fenêtre avec frame natif Windows (incluant les boutons agrandir, réduire et fermer)
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false, // Ne pas afficher jusqu'à ce que tout soit chargé
    frame: true, // Utiliser le cadre de fenêtre natif avec les contrôles standards
    icon: path.join(__dirname, '../assets/icon.png')
  });

  // Charger l'application
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Afficher la fenêtre une fois chargée pour éviter les flashs blancs
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // En développement, ouvrir les DevTools
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Gestion de la fermeture de la fenêtre
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Initialiser l'app une fois Electron prêt
app.whenReady().then(createWindow);

// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});