import fs from 'fs'
import path from 'path'
import { WebContents, app, ipcMain } from 'electron'
import { Mutex } from 'async-mutex'


import { Distress } from "app/lib/module/distress";
import { DB1000N } from "app/lib/module/db1000n";
import { MHDDOSProxy } from "app/lib/module/mhddosproxy";
import { ModuleExecutionErrorEventData, ModuleExecutionStatisticsEventData, ModuleExecutionStdoutEventData, ModuleName } from "app/lib/module/module";

export interface ExecutionLogEntry {
    type: 'STARTED' | 'STOPPED' | 'ERROR'
    moduleName: ModuleName
    timestamp: number
    message: string
}

export interface StatisticsTotals {
    totalBytesSent: number
}

export interface State {
    moduleToRun?: ModuleName
    run: boolean

    executionLog: Array<ExecutionLogEntry>
    stdOut: Array<string>
    stdErr: Array<string>
    statistics: Array<ModuleExecutionStatisticsEventData>
    statisticsTotals: StatisticsTotals
}



export class ExecutionEngine {
    private static stateFilePath = path.join(app.getPath('appData'), 'UACyberShield', 'itarmykit', 'engine.state.json')

    private modules: Array<Distress | DB1000N | MHDDOSProxy> = []
    private runningModule: Distress | DB1000N | MHDDOSProxy | null
    private state?: State
    private stateLock: Mutex = new Mutex()

    private async appendToExecutionLog(entry: ExecutionLogEntry) {
        await this.stateLock.runExclusive(async () => {
            const state = await this.getState()
            state.executionLog.push(entry)
            if (state.executionLog.length > 100) {
                state.executionLog.shift()
            }
            await this.setState(state)
        })
    }

    private async appendToStdOut(data: string) {
        await this.stateLock.runExclusive(async () => {
            const state = await this.getState()
            state.stdOut.push(data)
            if (state.stdOut.length > 100) {
                state.stdOut.shift()
            }
            await this.setState(state)
        })
    }

    private async appendToStdErr(data: string) {
        await this.stateLock.runExclusive(async () => {
            const state = await this.getState()
            state.stdErr.push(data)
            if (state.stdErr.length > 100) {
                state.stdErr.shift()
            }
            await this.setState(state)
        })
    }

    private async appendToStatistics(data: ModuleExecutionStatisticsEventData) {
        await this.stateLock.runExclusive(async () => {
            const state = await this.getState()
            state.statistics.push(data)
            if (state.statistics.length > 100) {
                state.statistics.shift()
            }
            state.statisticsTotals.totalBytesSent += data.bytesSend
            await this.setState(state)
        })
    }

    constructor(modules: Array<Distress | DB1000N | MHDDOSProxy>) {
        this.modules = modules
        this.runningModule = null

        for (const module of modules) {
            module.on('execution:started', () => {
                const alreadySended = new Set<WebContents>()
                for (const listener of this.executionLogListeners) {
                    if (alreadySended.has(listener)) {
                        continue
                    }
                    alreadySended.add(listener)

                    const entry = {
                        type: 'STARTED',
                        moduleName: module.name,
                        timestamp: new Date().getTime(),
                        message: `Module ${module.name} started`
                    } as ExecutionLogEntry

                    listener.send('executionEngine:executionLog', entry)
                    void this.appendToExecutionLog(entry)
                }
            })
            module.on('execution:stdout', (data) => {
                const alreadySended = new Set<WebContents>()
                for (const listener of this.stdOutListeners) {
                    if (alreadySended.has(listener)) {
                        continue
                    }
                    alreadySended.add(listener)

                    listener.send('executionEngine:stdout', (data as ModuleExecutionStdoutEventData).data)
                    void this.appendToStdOut((data as ModuleExecutionStdoutEventData).data)
                }
            })
            module.on('execution:stderr', (data) => {
                const alreadySended = new Set<WebContents>()
                for (const listener of this.stdErrListeners) {
                    if (alreadySended.has(listener)) {
                        continue
                    }
                    alreadySended.add(listener)

                    listener.send('executionEngine:stderr', (data as ModuleExecutionStdoutEventData).data)
                    void this.appendToStdErr((data as ModuleExecutionStdoutEventData).data)
                }
            })
            module.on('execution:stopped', () => {
                const alreadySended = new Set<WebContents>()
                for (const listener of this.executionLogListeners) {
                    if (alreadySended.has(listener)) {
                        continue
                    }
                    alreadySended.add(listener)

                    const entry = {
                        type: 'STOPPED',
                        moduleName: module.name,
                        timestamp: new Date().getTime(),
                        message: `Module ${module.name} stopped`
                    } as ExecutionLogEntry

                    listener.send('executionEngine:executionLog', entry)
                    void this.appendToExecutionLog(entry)
                }
            })
            module.on('execution:error', (error) => {
                const alreadySended = new Set<WebContents>()
                for (const listener of this.executionLogListeners) {
                    if (alreadySended.has(listener)) {
                        continue
                    }
                    alreadySended.add(listener)

                    const entry = {
                        type: 'ERROR',
                        moduleName: module.name,
                        timestamp: new Date().getTime(),
                        message: `Module ${module.name} error: ${(error as ModuleExecutionErrorEventData).error}`
                    } as ExecutionLogEntry

                    listener.send('executionEngine:executionLog', entry)
                    void this.appendToExecutionLog(entry)
                }
            })
            module.on('execution:statistics', (data) => {
                const alreadySended = new Set<WebContents>()
                for (const listener of this.statisticsListeners) {
                    if (alreadySended.has(listener)) {
                        continue
                    }
                    alreadySended.add(listener)

                    listener.send('executionEngine:statistics', data as ModuleExecutionStatisticsEventData)
                    void this.appendToStatistics(data as ModuleExecutionStatisticsEventData)
                }
            })
        }
    }

    public async init() {
        const config = await this.getState()
        if (config.run) {
            await this.startModule()
        }
    }

    public async setModuleToRun(module?: ModuleName) {
        await this.stateLock.runExclusive(async () => {
            const config = await this.getState()
            config.moduleToRun = module
            await this.setState(config)
        })
    }

    public async startModule() {
        if (this.runningModule != null) {
            throw new Error(`Module ${this.runningModule.name} is already running`)
        }
        
        let moduleName = undefined as ModuleName | undefined

        await this.stateLock.runExclusive(async () => {
            const config = await this.getState()
            moduleName = config.moduleToRun
            config.run = true
            config.stdOut = []
            config.stdErr = []
            await this.setState(config)
        })

        const module = this.modules.find(m => m.name === moduleName)
        if (!module) {
            throw new Error(`Module ${moduleName} not found`)
        }

        await module.start()
        this.runningModule = module
    }

    public async stopModule() {
        if (this.runningModule != null) {
            await this.runningModule.stop()
            this.runningModule = null

            await this.stateLock.runExclusive(async () => {
                const config = await this.getState()
                config.run = false
                await this.setState(config)
            })
        }
    }

    public async dispose() {
        if (this.runningModule != null) {
            await this.runningModule.stop()
            this.runningModule = null
        }
    }

    public async getState(): Promise<State> {
        if (this.state === undefined) {
            try {
                const configString = await fs.promises.readFile(ExecutionEngine.stateFilePath, 'utf8')
                this.state = JSON.parse(configString) as State
            } catch {
                this.state = { run: false, executionLog: [] ,statistics: [], stdErr: [], stdOut: [], statisticsTotals: { totalBytesSent: 0 } } // To enable TS types
                await this.setState(this.state)
            }
        }

        // Backwards compatibility for v1.0.8
        if (this.state.statisticsTotals === undefined) {
            this.state.statisticsTotals = { totalBytesSent: 0 }
        }

        return this.state
    }

    private async setState(config: State) {
        this.state = config
        await fs.promises.mkdir(path.dirname(ExecutionEngine.stateFilePath), { recursive: true })
        await fs.promises.writeFile(ExecutionEngine.stateFilePath, JSON.stringify(config))
    }

    private executionLogListeners = [] as Array<WebContents>
    public startListeningForExecutionLog(webContents: WebContents) {
        this.executionLogListeners.push(webContents)
    }
    public stopListeningForExecutionLog(webContents: WebContents) {
        const index = this.executionLogListeners.indexOf(webContents)
        if (index !== -1) {
            this.executionLogListeners.splice(index, 1)
        }
    }

    private stdOutListeners = [] as Array<WebContents>
    public startListeningForStdOut(webContents: WebContents) {
        this.stdOutListeners.push(webContents)
    }
    public stopListeningForStdOut(webContents: WebContents) {
        const index = this.stdOutListeners.indexOf(webContents)
        if (index !== -1) {
            this.stdOutListeners.splice(index, 1)
        }
    }

    private stdErrListeners = [] as Array<WebContents>
    public startListeningForStdErr(webContents: WebContents) {
        this.stdErrListeners.push(webContents)
    }
    public stopListeningForStdErr(webContents: WebContents) {
        const index = this.stdErrListeners.indexOf(webContents)
        if (index !== -1) {
            this.stdErrListeners.splice(index, 1)
        }
    }

    private statisticsListeners = [] as Array<WebContents>
    public startListeningForStatistics(webContents: WebContents) {
        this.statisticsListeners.push(webContents)
    }
    public stopListeningForStatistics(webContents: WebContents) {
        const index = this.statisticsListeners.indexOf(webContents)
        if (index !== -1) {
            this.statisticsListeners.splice(index, 1)
        }
    }

    public async deleteStatistics() {
        const config = await this.getState()
        config.statistics = []
        config.statisticsTotals.totalBytesSent = 0
        await this.setState(config)
    }
}

export function handleExecutionEngine(modules: Array<Distress | DB1000N | MHDDOSProxy>): ExecutionEngine {
    const engine = new ExecutionEngine(modules)

    app.on('before-quit', async () => {
        await engine.dispose()
    })

    ipcMain.handle('executionEngine:startModule', async () => {
        await engine.startModule()
    })

    ipcMain.handle('executionEngine:stopModule', async () => {
        await engine.stopModule()
    })

    ipcMain.handle('executionEngine:getState', async () => {
        return await engine.getState()
    })

    ipcMain.handle('executionEngine:setModuleToRun', async (_e, module?: ModuleName) => {
        await engine.setModuleToRun(module)
    })

    ipcMain.handle('executionEngine:listenForExecutionLog', async (e) => {
        engine.startListeningForExecutionLog(e.sender)
    })
    ipcMain.handle('executionEngine:stopListeningForExecutionLog', async (e) => {
        engine.stopListeningForExecutionLog(e.sender)
    })

    ipcMain.handle('executionEngine:listenForStdOut', async (e) => {
        engine.startListeningForStdOut(e.sender)
    })
    ipcMain.handle('executionEngine:stopListeningForStdOut', async (e) => {
        engine.stopListeningForStdOut(e.sender)
    })

    ipcMain.handle('executionEngine:listenForStdErr', async (e) => {
        engine.startListeningForStdErr(e.sender)
    })
    ipcMain.handle('executionEngine:stopListeningForStdErr', async (e) => {
        engine.stopListeningForStdErr(e.sender)
    })

    ipcMain.handle('executionEngine:listenForStatistics', async (e) => {
        engine.startListeningForStatistics(e.sender)
    })
    ipcMain.handle('executionEngine:stopListeningForStatistics', async (e) => {
        engine.stopListeningForStatistics(e.sender)
    })
    ipcMain.handle('executionEngine:deleteStatistics', async () => {
        await engine.deleteStatistics()
    })


    void engine.init()

    return engine
}