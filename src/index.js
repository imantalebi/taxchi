const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('node:path');
const fs = require('fs');
const { bootstrap } = require('./dist/src/main');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1400, height: 700,
  
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#fff',
      symbolColor: '#74b1be',
      height: 30
    },
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'taxchi-interface/browser/index.html'));
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};
ipcMain.on('appVersion', (event) => {
 
    event.returnValue = app.getVersion()
  
});
 ipcMain.on('backUpRestore', (event,arg) => {
  console.log(  arg)
  try { 
    // Buffer.from(new Uint8Array(this.result))
    // bootstrap(true);
    //  file = new Blob([buffer], {type: fileType});
    fs.writeFileSync('../../taxchiDataBase.db', JSON.parse(arg), 'utf-8');
    // bootstrap();
   }
  catch(e) { 
console.log(e)
   }

});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
