import { ipcMain } from 'electron';
import { ActivenessClient } from '../../lib/activeness/client';
import { Settings } from './settings';

class ActivenessHandler {
    readonly client: ActivenessClient;
    protected settings: Settings;

    constructor(settings: Settings) {
        this.client = new ActivenessClient();
        this.settings = settings;
    }

    logInfo(message: string) {
        console.log(`\x1b[32m%s\x1b[0m`, `INFO: ${message}`); // Green
    }

    logWarning(message: string) {
        console.log(`\x1b[33m%s\x1b[0m`, `WARNING: ${message}`); // Yellow
    }

    logError(message: string) {
        console.log(`\x1b[31m%s\x1b[0m`, `ERROR: ${message}`); // Red
    }

    async tryLoginFromSettings(): Promise<boolean> {
        this.logInfo('Attempting login from settings');
        const sid = this.settings.getDataSync().activeness.sid;
        if (sid !== undefined) {
            const result = await this.client.loginWithSID(sid);
            if (result) {
                this.logInfo('Login from settings successful');
            } else {
                this.logWarning('Login from settings failed');
            }
            return result;
        }

        this.logWarning('SID is undefined in settings');
        return false;
    }

    async login(email: string, password: string): Promise<boolean> {
        this.logInfo('Attempting login with provided credentials');
        const success = await this.client.login(email, password);

        if (success) {
            await this.settings.setActivenessSID(this.client.sid);
            this.logInfo('Login successful');
        } else {
            this.logError('Login failed');
        }

        return success;
    }

    async logout() {
        this.logInfo('Logging out');
        await this.settings.setActivenessSID(undefined);
        this.client.logout();
    }
}

export function handleActiveness(settings: Settings) {
    const handler = new ActivenessHandler(settings);

    void handler.tryLoginFromSettings();

    ipcMain.handle('activeness:isLoggedIn', async () => {
        return handler.client.isLoggedIn;
    });
    ipcMain.handle('activeness:login', async (event, email: string, password: string) => {
        return await handler.login(email, password);
    });
    ipcMain.handle('activeness:logout', async () => {
        return await handler.logout();
    });

    ipcMain.handle('activeness:getTasksList', async () => {
        const response = await handler.client.getTasksList();
        if (response.status === 'sidcheckfail' || response.status === 'sidexpired') {
            await handler.logout();
        }

        return response;
    });

    ipcMain.handle('activeness:makeTaskDone', async (event, taskId: number) => {
        return await handler.client.makeTaskDone(taskId);
    });

    ipcMain.handle('activeness:ignoreTask', async (event, taskId: number) => {
        return await handler.client.ignoreTask(taskId);
    });

    ipcMain.handle('activeness:getStats', async () => {
        return await handler.client.getStats();
    });

    ipcMain.handle('activeness:getMyStats', async () => {
        return { score: handler.client.score };
    });

    return handler;
}
