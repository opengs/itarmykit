import { SID, Task, getTasksList, GetTasksListResponse, makeTaskDone, MakeTaskDoneResponse, ignoreTask, IgnoreTaskResponse, getStats, Stats, GetStatsResponse, login } from "./api";

const TASKS_CACHE_UPDATE_INTERVAL = 1000 * 60 * 2 // 2 minutes
const STATISTICS_CACHE_UPDATE_INTERVAL = 1000 * 60 * 2 // 2 minutes

/**
 * Client to work with activeness Project. Uses cache to reduce number of requests to the server. 
 */
export class ActivenessClient {
    protected _sid?: SID
    protected _score: number
    
    protected cachedTasksList?: Array<Task>
    protected lastTaskListCacheUpdate?: Date

    protected cachedStatistics?: Stats
    protected lastStatisticsCacheUpdate?: Date

    constructor () {
        this._score = 0
    }

    get score(): number {
        return this._score
    }

    async login(email: string, password: string): Promise<boolean> {
        const loginResponse = await login({ email, password })
        if (loginResponse.status == 'ok') {
            this._sid = loginResponse.sid
            this._score = loginResponse.score
            return true
        }

        return false
    }

    logout() {
        this._sid = undefined
        this._score = 0
    }

    async loginWithSID(sid: SID): Promise<boolean> {
        this._sid = sid
        //TODO: Reload score
        this._score = 0
        return true
    }

    get sid(): SID {
        if (this._sid === undefined) {
            throw new Error('Not logged in')
        }
        
        return this._sid
    }

    get isLoggedIn(): boolean {
        return this._sid !== undefined
    }

    async getTasksList(): Promise<GetTasksListResponse> {
        if (this._sid === undefined) {
            throw new Error('Not logged in')
        }

        if (this.cachedTasksList && this.lastTaskListCacheUpdate && (Date.now() - this.lastTaskListCacheUpdate.getTime()) < TASKS_CACHE_UPDATE_INTERVAL && this.cachedTasksList.length > 0) {
            return {
                status: 'ok',
                list:  JSON.parse(JSON.stringify(this.cachedTasksList)) as Array<Task>
            }
        }

        const requestResponse = await getTasksList({ sid: this._sid })
        if (requestResponse.status == 'ok') {
            this.lastTaskListCacheUpdate = new Date()
            this.cachedTasksList = requestResponse.list
        }

        return requestResponse
    }

    async makeTaskDone(taskId: number): Promise<MakeTaskDoneResponse> {
        if (this._sid === undefined) {
            throw new Error('Not logged in')
        }

        const requestResponse = await makeTaskDone({ sid: this._sid, id: taskId })
        if (requestResponse.status == 'ok') {
            this._score += 1
            
            if (this.cachedTasksList) {
                const taskIndex = this.cachedTasksList.findIndex(task => task.id === taskId)
                if (taskIndex !== -1) {
                    this.cachedTasksList.splice(taskIndex, 1)
                }
            }
        }

        return requestResponse
    }

    async ignoreTask(taskId: number): Promise<IgnoreTaskResponse> {
        if (this._sid === undefined) {
            throw new Error('Not logged in')
        }

        const requestResponse = await ignoreTask({ sid: this._sid, id: taskId })
        if (requestResponse.status == 'ok') {
            if (this.cachedTasksList) {
                const taskIndex = this.cachedTasksList.findIndex(task => task.id === taskId)
                if (taskIndex !== -1) {
                    this.cachedTasksList.splice(taskIndex, 1)
                }
            }
        }

        return requestResponse
    }

    async getStats(): Promise<GetStatsResponse> {
        if (this.cachedStatistics && this.lastStatisticsCacheUpdate && (Date.now() - this.lastStatisticsCacheUpdate.getTime()) < STATISTICS_CACHE_UPDATE_INTERVAL) {
            return {
                ...JSON.parse(JSON.stringify(this.cachedStatistics)) as Stats,
                status: 'ok',
            }
        }

        const requestResponse = await getStats()
        if (requestResponse.status == 'ok') {
            this.lastStatisticsCacheUpdate = new Date()
            this.cachedStatistics = requestResponse
        }

        return requestResponse
    }
}