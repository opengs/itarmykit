import { UserStats, getUserStats, GetUserStatsResponse } from './api'

const USERSTATS_CACHE_UPDATE_INTERVAL = 1000 * 60 * 2 // 2 minutes

export class ItArmyClient {
    protected userStatsCache?: UserStats
    protected userStatsCacheTimestamp?: Date
    protected userStatsCacheAPIKeyUsed?: string

    async getUserStats(apiKey: string): Promise<GetUserStatsResponse> {
        // Prevent requests with empty API key so the API will not be spammed
        if (apiKey === '') {
            return {
                success: false,
                error: 'EMPTY_API_KEY',
                errorType: 'REQUEST_FAILED',
                data: undefined as unknown as UserStats
            }
        }
        
        if (this.userStatsCache && this.userStatsCacheTimestamp && apiKey === this.userStatsCacheAPIKeyUsed && (Date.now() - this.userStatsCacheTimestamp.getTime()) < USERSTATS_CACHE_UPDATE_INTERVAL) {
            return {
                success: true,
                error: '',
                errorType: 'OK',
                data: this.userStatsCache
            }
        }

        const response = await getUserStats({ apiKey })

        if (response.success) {
            this.userStatsCache = response.data
            this.userStatsCacheTimestamp = new Date()
            this.userStatsCacheAPIKeyUsed = apiKey
        }

        return response
    }
}