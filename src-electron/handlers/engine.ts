import fs from 'fs'
import path from 'path'
import { WebContents, app, ipcMain } from 'electron'

import { Distress } from "app/lib/module/distress";
import { DB1000N } from "app/lib/module/db1000n";
import { MHDDOSProxy } from "app/lib/module/mhddosproxy";
import { ModuleExecutionErrorEventData, ModuleExecutionStdoutEventData, ModuleName } from "app/lib/module/module";

export interface ExecutionLogEntry {
    type: 'STARTED' | 'STOPPED' | 'ERROR'
    timestamp: Date
    message: string
}

export interface Config {
    moduleToRun?: ModuleName
    run: boolean
}

export class ExecutionEngine {
    private static configFilePath = path.join(app.getPath('appData'), 'UACyberShield', 'itarmykit', 'engine.config.json')

    private modules: Array<Distress | DB1000N | MHDDOSProxy> = []
    private runningModule: Distress | DB1000N | MHDDOSProxy | null
    private config?: Config


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

                    listener.send('executionEngine:executionLog', {
                        type: 'STARTED',
                        timestamp: new Date(),
                        message: `Module ${module.name} started`
                    } as ExecutionLogEntry)
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
                }
            })
            module.on('execution:stopped', () => {
                const alreadySended = new Set<WebContents>()
                for (const listener of this.executionLogListeners) {
                    if (alreadySended.has(listener)) {
                        continue
                    }
                    alreadySended.add(listener)

                    listener.send('executionEngine:executionLog', {
                        type: 'STOPPED',
                        timestamp: new Date(),
                        message: `Module ${module.name} stopped`
                    } as ExecutionLogEntry)
                }
            })
            module.on('execution:error', (error) => {
                const alreadySended = new Set<WebContents>()
                for (const listener of this.executionLogListeners) {
                    if (alreadySended.has(listener)) {
                        continue
                    }
                    alreadySended.add(listener)

                    listener.send('executionEngine:executionLog', {
                        type: 'ERROR',
                        timestamp: new Date(),
                        message: `Module ${module.name} error: ${(error as ModuleExecutionErrorEventData).error}`
                    } as ExecutionLogEntry)
                }
            })
        }
    }

    public async startModule() {
        if (this.runningModule != null) {
            throw new Error(`Module ${this.runningModule.name} is already running`)
        }
        
        const config = await this.getConfig()
        const moduleName = config.moduleToRun
        config.run = true
        await this.setConfig(config)

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

            const config = await this.getConfig()
            config.run = false
            await this.setConfig(config)
        }
    }

    public async dispose() {
        await this.stopModule()
    }

    public async getConfig(): Promise<Config> {
        if (this.config === undefined) {
            try {
                const configString = await fs.promises.readFile(ExecutionEngine.configFilePath, 'utf8')
                this.config = JSON.parse(configString) as Config
            } catch {
                this.config = { run: false } // To enable TS types
                this.setConfig(this.config)
            }
        }

        return this.config
    }

    public async setConfig(config: Config) {
        this.config = config
        await fs.promises.mkdir(path.dirname(ExecutionEngine.configFilePath), { recursive: true })
        await fs.promises.writeFile(ExecutionEngine.configFilePath, JSON.stringify(config))
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
}

export function handleExecutionEngine(modules: Array<Distress | DB1000N | MHDDOSProxy>) {
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

    ipcMain.handle('executionEngine:getConfig', async () => {
        return await engine.getConfig()
    })

    ipcMain.handle('executionEngine:setConfig', async (_e, config: Config) => {
        await engine.setConfig(config)
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
}