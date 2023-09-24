import { ipcMain } from "electron";
import fetch from "electron-fetch";

export interface PeriodTopData {
    items: Array<{
        traffic: number,
        user_name: string,
        systems: Array<string>,
        servers_count: number,
    }>
    start_date: string
    end_data: string 
}

export interface TopData {
    success: boolean;
    error: string
    data: {
        week_stats: PeriodTopData
        month_stats: PeriodTopData
    }
}

async function getTopData(): Promise<TopData> {
    const response = await fetch("https://itarmy.com.ua/leaderboard/json/leaderboard.json")
    return await response.json() as TopData
}

export function handleTop () {
    ipcMain.handle('top:getWeeklyTop', async () => {
      return await getTopData()
    })
}