import fetch, { RequestInit } from 'electron-fetch'

const BASE_URL = 'https://cossackguard.pp.ua/api'
const BASE_REQUEST_OPTIONS: RequestInit = {
    timeout: 10000, // 10 seconds
    size: 1024 * 1024 * 10, // 10MB
}

export interface UserStats {
    login: string
    totalTraffic: number
    createdDate: Date
}

export interface GetUserStatsRequest {
    apiKey: string
}
export interface GetUserStatsResponse {
    success: boolean
    error: string
    errorType: 'OK' | 'BAD_STATUS_CODE' | 'ERR_FROM_BACKEND' | 'REQUEST_FAILED'
    data: UserStats
}

export async function getUserStats(params: GetUserStatsRequest): Promise<GetUserStatsResponse> {
    try {
        const statsResponse = await fetch(`${BASE_URL}/user/get-user-stats?apiKey=${encodeURI(params.apiKey)}`, BASE_REQUEST_OPTIONS)
        if (statsResponse.status !== 200) {
            return {
                success: false,
                errorType: 'BAD_STATUS_CODE',
                error: `Bad status code: ${statsResponse.status}. Message: ${await statsResponse.text()}`,
                data: undefined as unknown as UserStats
            }
        }

        const responseJSON = await statsResponse.json() as GetUserStatsResponse
        if (!responseJSON.success) {
            return {
                ...responseJSON,
                errorType: 'ERR_FROM_BACKEND',
            }
        }

        if (responseJSON.data?.createdDate) {
            responseJSON.data.createdDate = new Date(responseJSON.data?.createdDate)
        }
        return responseJSON
    } catch (err) {
        return {
            success: false,
            errorType: 'REQUEST_FAILED',
            error: String(err),
            data: undefined as unknown as UserStats
        }
    }
}