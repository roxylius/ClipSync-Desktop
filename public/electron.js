const { app, BrowserWindow, clipboard, ipcRenderer } = require('electron')
const clipboardListener = require('clipboard-event');
require('@electron/remote/main').initialize();


//
const { COPIED_TEXT } = require("../src/utils/constants");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  //load the index.html from a url
  win.loadURL('http://localhost:3000');

  // Open the DevTools.
  win.webContents.openDevTools();

  //add listener for electron native clipboard
  // win.addListener("")

  // To start listening
  clipboardListener.startListening();

  //when text is copied i.e. the event occurs
  clipboardListener.on('change', () => {
    const text = clipboard.readText();
    console.log(text);

    //sends message to the renderer
    win.webContents.send(COPIED_TEXT, text);
  });


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.