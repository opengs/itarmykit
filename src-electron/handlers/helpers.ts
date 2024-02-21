import { Settings } from "./settings";
import { ItArmyClient } from '../../lib/itarmy/client'
import { ipcMain, shell } from "electron";

export function handleHelpers() {
    ipcMain.handle('helpers:openURLInBrowser', async (_e, url: string) => {
        await shell.openExternal(url)
    })
}