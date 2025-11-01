const { BrowserWindow, app } = require("electron");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  mainWindow.loadURL("http://localhost:5173/");
  mainWindow.webContents.openDevTools()
}


app.whenReady().then(() => {
  createWindow();
  mainWindow.maximize();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
