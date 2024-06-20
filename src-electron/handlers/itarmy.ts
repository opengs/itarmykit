import { Settings } from "./settings";
import { ItArmyClient } from '../../lib/itarmy/client';
import { ipcMain } from "electron";

// Define color-coding functions
// These functions use ANSI escape codes to add color to the console output for different log levels
const logInfo = (message: string) => console.log(`\x1b[32m%s\x1b[0m`, `INFO: ${message}`); // Green for informational messages
const logWarning = (message: string) => console.log(`\x1b[33m%s\x1b[0m`, `WARNING: ${message}`); // Yellow for warnings
const logError = (message: string) => console.log(`\x1b[31m%s\x1b[0m`, `ERROR: ${message}`); // Red for errors

export function handleItArmy(settings: Settings) {
    const client = new ItArmyClient();

    ipcMain.handle('itarmy:getStats', async () => {
        // Log an informational message when fetching IT Army stats
        logInfo('Fetching IT Army stats');
        
        // Retrieve settings data
        const settingsData = await settings.getData();
        const apiKey = settingsData.itarmy.apiKey;

        // Check if the API key is missing and log a warning if it is
        if (!apiKey) {
            logWarning('API Key is missing');
            return { error: 'API Key is missing' };
        }

        try {
            // Attempt to fetch user stats using the API key
            const stats = await client.getUserStats(apiKey);
            
            // Log an informational message upon successful fetch
            logInfo('IT Army stats fetched successfully');
            return stats;
        } catch (error) {
            // Log an error message if the fetch fails
            logError(`Failed to fetch IT Army stats: ${error.message}`);
            return { error: error.message };
        }
    });
}
