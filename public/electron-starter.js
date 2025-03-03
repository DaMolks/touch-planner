const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

// S'assurer que @electron/remote est correctement importé
let remote;
try {
  remote = require('@electron/remote/main');
} catch (error) {
  console.error('Erreur lors du chargement de @electron/remote/main:', error);
  console.log('Vous devez installer le module avec: npm install --save @electron/remote');
}

// Initialiser le module remote seulement s'il est correctement chargé
if (remote) {
  remote.initialize();
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
    frame: true,
    icon: path.join(__dirname, '../assets/icon.png')
  });

  // Activer remote pour cette fenêtre seulement si le module est correctement chargé
  if (remote) {
    remote.enable(mainWindow.webContents);
  }

  // Charger l'application
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  
  mainWindow.loadURL(startUrl);

  // Afficher la fenêtre une fois chargée
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // En développement, ouvrir les DevTools
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});