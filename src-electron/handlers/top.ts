import { ipcMain } from "electron";
import fetch from "electron-fetch";

export interface WeeklyTopData {
    success: boolean;
    error: string
    data: {
        items: Array<{
            traffic: number,
            user_name: string,
            systems: Array<string>,
            servers_count: number,
        }>
        start_date: string
        end_data: string 
    }
}

async function getWeeklyTopData(): Promise<WeeklyTopData> {
    const response = await fetch("https://itarmy.com.ua/leaderboard/json/leaderboard.json")
    return await response.json() as WeeklyTopData
}

export function handleTop () {
    ipcMain.handle('top:getWeeklyTop', async () => {
      return await getWeeklyTopData()
    })
}