import { BrowserWindow, Tray, app, Menu, nativeImage } from "electron";
import path from "path";
import { Settings } from "./settings";

export function handleTray(settings: Settings, mainWindow: BrowserWindow) {
    let isQuiting = false;
    app.on('before-quit', function () { // allow task managers to forcefully quit application
        isQuiting = true;
    });

    const tray = new Tray(nativeImage.createEmpty());
    tray.setContextMenu(Menu.buildFromTemplate([
        {
        label: 'Show App', click: function () {
            mainWindow.show();
        }
        },
        {
        label: 'Quit', click: function () {
            isQuiting = true;
            app.quit();
        }
        }
    ]));

    const appIcon = nativeImage.createFromPath(path.resolve(__dirname, 'icons/trey.png'))

    tray.setImage(appIcon); // tray icon
    tray.setToolTip('IT Army Kit');

    mainWindow.on('close', async function (event) {
        const settingsData = await settings.getData()

        if (!isQuiting && settingsData.system.hideInTray) {
            event.preventDefault();
            mainWindow.hide();
        }

        return false;
    });


    const settingsData = settings.getDataSync()
    if (settingsData.system.hideInTray) {
        mainWindow.hide();
    } else {
        mainWindow.show();
    }
}