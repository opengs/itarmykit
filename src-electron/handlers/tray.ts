import { BrowserWindow, Tray, app, Menu, nativeImage } from "electron";
import path from "path";
import { Settings } from "./settings";

const lang = {
    "en-US": {
        "open": "Open",
        "exit": "Exit",
    },
    "ua-UA": {
        "open": "Відкрити",
        "exit": "Вийти",
    }
}

export function handleTray(settings: Settings, mainWindow: BrowserWindow) {
    let isQuiting = false;
    app.on('before-quit', function () { // allow task managers to forcefully quit application
        isQuiting = true;
    });

    const locale = settings.getDataSync().system.language
    let translation = lang["en-US"]
    if (locale in lang) {
        translation = lang[locale]
    }

    const tray = new Tray(nativeImage.createEmpty());
    tray.setContextMenu(Menu.buildFromTemplate([
        {
        label: translation.open, click: function () {
            mainWindow.show();
        }
        },
        {
        label: translation.exit, click: function () {
            isQuiting = true;
            app.quit();
        }
        }
    ]));

    const appIcon = nativeImage.createFromPath(path.resolve(__dirname, 'icons/trey.png'))

    tray.setImage(appIcon); // tray icon
    tray.setToolTip('IT Army Kit');

    tray.on('double-click', (event) => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    });

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