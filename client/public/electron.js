const { app, BrowserWindow, clipboard, ipcMain, Tray, Menu } = require('electron')
const clipboardListener = require('clipboard-event');
require('@electron/remote/main').initialize();
const Store = require('electron-store');
const path = require('path');
// const isDev = require('electron-is-dev');

//contants
const { COPIED_TEXT } = require("../src/utils/constants");

const store = new Store();

//create tray element
let win = null;
let tray = null;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  //load the index.html from a url when the user is not logged in else load '/clipboard'
  if (store.get('userInfo') === undefined) {
    win.loadURL('http://localhost:3001');
    console.log("user info: ", store.get('userInfo'));
    console.log("login");
  }
  else {
    win.loadURL('http://localhost:3001/clipboard');
    console.log("user info: ", store.get('userInfo'));
    console.log("clipboard");

  }


  // Open the DevTools.
  // win.webContents.openDevTools();

  //stores the remote copied text send from renderer
  let remote_copied_text;

  //recieves the text copied on remote platform via the renderer
  ipcMain.on("remote_copied_text", (evt, data) => {
    console.log("this is the copied text from remote devices: ", data.message);

    //sets remote_copied_text
    remote_copied_text = data.message;

    //saves the recieve copied text to clipboard
    clipboard.writeText(data.message);
  });


  //recieves the user data from renderer and stores it in application
  ipcMain.on("user-data", (evt, data) => {
    console.log("this is user data from renderer: ", data.id, 'data name:', data.name);

    store.set('userInfo', { name: data.name, id: data.id });
    console.log(store.get('userInfo'));
  });

  //handle logout and remove user data from electron store
  ipcMain.on("remove_user", (evt, data) => {
    console.log("this is user data from renderer: ", data);

    store.delete('userInfo');
    console.log('userdelete!');
    win.loadURL('http://localhost:3001');
  });


  // To start listening
  clipboardListener.startListening();

  //when text is copied i.e. the event occurs [also caused by clipboard.writeText() fn]
  clipboardListener.on('change', () => {
    const text = clipboard.readText();

    //check if the message copied same as the one just saved in clipboard
    //to prevent copy and paste infinite loop
    if (remote_copied_text !== text) {
      //sends message to the renderer
      win.webContents.send(COPIED_TEXT, text);
      console.log(text);
    } else {
      console.log("same as latest copied element");
    }
  });

  //set up tray element
  try {
    const iconPath = path.join(__dirname, 'icon.png');

    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => {
          tray.destroy();
          app.exit();
        }
      }
    ]);

    //show text on hover on tray icon
    tray.setToolTip('Clipboard Sync');

    // Call this again for Linux because we modified the context menu
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
      win.isVisible() ? win.hide() : win.show();
    });

  } catch (error) {
    console.log(error)
  }

  //hides the window instead of closing
  win.on('close', (event) => {
    // Prevent the window from closing
    event.preventDefault();
    // Hide the window instead
    win.hide();
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
    app.quit();
  }

});


app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.