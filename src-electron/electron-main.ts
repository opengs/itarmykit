import { app, BrowserWindow, nativeTheme, nativeImage } from 'electron'
import path from 'path'
import os from 'os'

import { handle } from './handlers'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    )
  }
} catch (_) {}

let mainWindow: BrowserWindow | undefined

function createWindow () {
  let appIcon: string | undefined = undefined
  if (platform == 'win32'){
    appIcon = path.resolve(__dirname, 'src-electron/icons/icon.ico')
  } else if (platform == 'linux'){
    appIcon = path.resolve(__dirname, 'src-electron/icons/256x256.png')
  }
  
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: appIcon,
    width: 1400,
    height: 660,
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    },
  })

  console.log(process.env.APP_URL)
  mainWindow.loadURL(process.env.APP_URL)
  mainWindow.webContents.session

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    /*mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools()
    })*/
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined
  })

  handle(mainWindow)
}

// On windows, when downloading modules, data is saved to cache thus requring for user to add several folders to exception of windows defender / antivirus
if (process.platform === 'win32') {
  app.commandLine.appendSwitch("disable-http-cache");
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow()
  }
})
