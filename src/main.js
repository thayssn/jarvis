const { app, BrowserWindow, ipcMain } = require('electron')

const {cpu, mem, netstat} = require('node-os-utils');
const {processes} = require('systeminformation');
const toMB = (value) => value / 1024 / 1000;
const toGB = (value) => value / 1024 / 1000 / 1000;

 function createWindow () {
  let win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.loadFile('index.html');

  const contents = win.webContents;

  contents.on('did-finish-load', () => {
    setInterval(async () => {
      const cpu_usage = await cpu.usage();
      contents.send('cpu', parseInt(cpu_usage));

      const {freeMemPercentage:  mem_free_percentage} = await mem.info();
      contents.send('memory', parseInt(100 - mem_free_percentage) );
      }, 1000);
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // No macOS é comum para aplicativos e sua barra de menu 
    // permaneçam ativo até que o usuário explicitamente encerre com Cmd + Q
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
  
app.whenReady().then(createWindow).then()