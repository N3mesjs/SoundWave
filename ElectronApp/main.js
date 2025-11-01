const { BrowserWindow, app } = require('electron');
const {shell} = require('electron');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
    mainWindow.loadFile('index.html');
    shell.openExternal('https://github.com');
};

app.whenReady().then(() => {
    createWindow();
});