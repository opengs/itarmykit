import { autoUpdater } from 'electron-updater';


export function handleUpdater() {
    try {
        console.log("Checking for updates...")
        void autoUpdater.checkForUpdates()
    } catch {}

    setInterval(async () => {
        console.log("Checking for updates...")
        await autoUpdater.checkForUpdates()
    }, 1000 * 60 * 30) // 30 minutes

    autoUpdater.on('update-downloaded', (event) => {
        console.log("Downloaded update file: " + event.downloadedFile)
        autoUpdater.quitAndInstall()
    })
    autoUpdater.on('update-available', (info) => {
        console.log('Update available.')
    })
    autoUpdater.on('update-not-available', (info) => {
        console.log('Update not available.')
    })
}