import { autoUpdater } from 'electron-updater';
import { Settings } from './settings'

export function handleUpdater(settings: Settings) {
    const updateFunction = async () => {
        const settingsData = await settings.getData()
        if (settingsData.system.autoUpdate) {
            console.log("Checking for updates...")
            await autoUpdater.checkForUpdates()
        }
    }

    void updateFunction()
    setInterval(updateFunction, 1000 * 60 * 30) // 30 minutes

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