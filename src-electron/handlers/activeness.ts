import { ipcMain } from 'electron'

import { ActivenessClient } from '../../lib/activeness/client'
import { Settings } from './settings'

class ActivenessHandler {
    readonly client: ActivenessClient
    protected settings: Settings

    constructor(settings: Settings) {
        this.client = new ActivenessClient()
        this.settings = settings
    }

    async tryLoginFromSettings(): Promise<boolean> {
        const sid = this.settings.getDataSync().activeness.sid
        if (sid !== undefined) {
            return await this.client.loginWithSID(sid)
        }

        return false
    }

    async login(email: string, password: string): Promise<boolean> {
        const success = await this.client.login(email, password)

        if (success) {
            await this.settings.setActivenessSID(this.client.sid)
        }

        return success
    }

    async logout() {
        await this.settings.setActivenessSID(undefined)
        this.client.logout()
    }
}

export function handleActiveness (settings: Settings) {
    const handler = new ActivenessHandler(settings)
    
    void handler.tryLoginFromSettings()

    ipcMain.handle('activeness:isLoggedIn', async () => {
      return handler.client.isLoggedIn
    })
    ipcMain.handle('activeness:login', async (event, email: string, password: string) => {
        return await handler.login(email, password)
    })
    ipcMain.handle('activeness:logout', async () => {
        return await handler.logout()
    })

    ipcMain.handle('activeness:getTasksList', async () => {
        const response = await handler.client.getTasksList()
        if (response.status === 'sidcheckfail' || response.status === 'sidexpired') {
            await handler.logout()
        }

        return response
    })

    ipcMain.handle('activeness:makeTaskDone', async (event, taskId: number) => {
        return await handler.client.makeTaskDone(taskId)
    })

    ipcMain.handle('activeness:ignoreTask', async (event, taskId: number) => {
        return await handler.client.ignoreTask(taskId)
    })

    ipcMain.handle('activeness:getStats', async () => {
        return await handler.client.getStats()
    })

    ipcMain.handle('activeness:getMyStats', async () => {
        return { score: handler.client.score }
    })

    return handler
}