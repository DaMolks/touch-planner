const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const remote = require('@electron/remote/main');

// Initialiser le module remote
remote.initialize();

let mainWindow;

function createWindow() {
  // Récupérer les dimensions de l'écran principal
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  
  // Créer la fenêtre avec une taille maximisée (mais pas plein écran)
  mainWindow = new BrowserWindow({
    width: Math.round(width * 0.9),
    height: Math.round(height * 0.9),
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
    titleBarStyle: 'hidden', // Cacher la barre de titre native
    icon: path.join(__dirname, '../assets/icon.png'),
    autoHideMenuBar: true // Masquer la barre de menu par défaut
  });

  // Activer remote pour cette fenêtre
  remote.enable(mainWindow.webContents);

  // Charger l'application
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  
  mainWindow.loadURL(startUrl);

  // Afficher la fenêtre une fois chargée et la maximiser
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize(); // Maximiser la fenêtre au démarrage
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