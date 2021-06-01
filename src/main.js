const { app, BrowserWindow, ipcMain } = require('electron')

const {mem, cpu, osCmd, drive, proc, os} = require('node-os-utils');
const {networkConnections, inetLatency, wifiConnections, battery, bluetoothDevices } = require("systeminformation");

const toMB = (value) => (value / 1024 / 1000).toFixed(2);
const toGB = (value) => (value / 1024 / 1000 / 1000).toFixed(2);

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

    const batteryStatus = await battery();
    const cpu_usage = await cpu.usage()
    const {usedMemPercentage } = await mem.info();
    contents.send('user_info', {
      user,
      drive: driveInfo,
      os: osInfo,
      battery: batteryStatus,
      cpu_usage,
      mem_usage: usedMemPercentage
    })

    let batteryInitialChargingStatus = batteryStatus.isCharging;

    await getSystemInfos();


    async function getSystemInfos(time = 0) {
      const cpu_usage = await cpu.usage()
      const cpu_model = await cpu.model();
      const {usedMemPercentage, usedMemMb, totalMemMb } = await mem.info();
      const ping = await inetLatency();
      const connections = await networkConnections();
      let bluetooth = []

      if(process.platform === 'darwin')
         bluetooth = await bluetoothDevices()

      const batteryStatus = await battery();

      if(batteryInitialChargingStatus !== batteryStatus.isCharging) {
        batteryInitialChargingStatus = batteryStatus.isCharging;

        contents.send('charging', {
          isCharging: batteryInitialChargingStatus
        })
      }
  
      const wifi = await wifiConnections()
      
      contents.send('system_info', {
        cpu: {
          usage: cpu_usage,
          model: cpu_model
        },
        memory: {
          usage: usedMemPercentage,
          total: totalMemMb,
          used: usedMemMb,
        },
        network: {
          ping,
          connections
        },
        battery: batteryStatus,
        wifi,
        bluetooth,
        os: {
          processes: await proc.totalProcesses(),
          uptime: Math.floor(await os.uptime() / 60),
        }
      })

      setTimeout(async () => await getSystemInfos(time), 2000)
    }
  })

  const takeActions = {
    minimize(){
      win.minimize()
    },
    close(){
      app.quit()
    }
  }

  ipcMain.on('title-bar', (event, { action }) => {
    takeActions[action]()
    event.returnValue = '';
  })

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
        app.quit()
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