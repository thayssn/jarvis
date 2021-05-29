const { app, BrowserWindow, ipcMain } = require('electron')

const {cpu, mem, osCmd, drive, proc, os} = require('node-os-utils');
const { networkConnections, inetLatency } = require("systeminformation");


const toMB = (value) => value / 1024 / 1000;
const toGB = (value) => value / 1024 / 1000 / 1000;

function createWindow () {
  let win = new BrowserWindow({
    width: 1024,
    height: 768,
    transparent: true,
    frame: false,
    icon: __dirname + './icon.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // devTools: false
    }
  })

  win.show();

  win.loadFile('index.html');

  const contents = win.webContents;

  contents.on('did-finish-load', async () => {
    
    const user = await osCmd.whoami()
    const driveInfo = await drive.info()
    const osInfo = {
      oos: await os.oos(),
      platform: await os.platform(),
      ip: await os.ip(),
      hostname: await os.hostname()
    }

    contents.send('user_info', {
      user,
      drive: driveInfo,
      os: osInfo
    })
    
    await getSystemInfos();

    async function getSystemInfos() {
      const cpu_usage = await cpu.usage()
      const cpu_model = await cpu.model()
      const {totalMemMb: mem_total ,usedMemMb: mem_total_used, freeMemPercentage:  mem_free_percentage} = await mem.info()
      const memory_usage = 100 - mem_free_percentage;

      const ping = await inetLatency();
      const connections = await networkConnections();

      contents.send('system_info', {
        cpu: {
          usage: parseInt(cpu_usage),
          model: cpu_model
        },
        memory: {
          usage: parseInt(memory_usage),
          total: mem_total,
          used: mem_total_used,
        },
        network: {
          ping,
          connections
        },
        os: {
          processes: await proc.totalProcesses(),
          uptime: `${Math.floor(await os.uptime() / 60) }min`,
        }
      })
    
      setTimeout(async () => await getSystemInfos(), 5000)
    }
  })

  const takeActions = {
    minimize(){
      win.minimize()
    },
    close(){
      if (process.platform !== 'darwin') {
        app.quit()
      }
    }
  }

  ipcMain.on('title-bar', (event, { action }) => {
    takeActions[action]()
    event.returnValue = '';
  })

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
  
app.whenReady().then(createWindow)


// opening urls

  // const urls = [
  // ]
  // win.loadURL(urls[0]);
    // // win.loadURL(url.format({
    // //     pathname: path.join(__dirname,"index.html"),
    // //     protocol: 'file',
    // //     slashes: true
    // // }));
  // win.once('ready-to-show',()=>{
  //     win.show()
  // });

  // win.on('closed',()=>{
  //     win = null;
  // });