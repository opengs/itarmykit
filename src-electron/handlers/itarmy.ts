import { Settings } from "./settings";
import { ItArmyClient } from '../../lib/itarmy/client'
import { ipcMain } from "electron";

export function handleItArmy(settings: Settings) {
    const client = new ItArmyClient()


    ipcMain.handle('itarmy:getStats', async () => {
        const settingsData = await settings.getData()
        const apiKey = settingsData.itarmy.apiKey

        return await client.getUserStats(apiKey)
    })
}