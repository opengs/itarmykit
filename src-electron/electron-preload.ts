/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

import { Config as DistressConfig } from 'app/lib/module/distress'
import { Config as MHDDOSProxyConfig } from 'app/lib/module/mhddosproxy'
import { Config as DB1000NConfig } from 'app/lib/module/db1000n'
import { InstallProgress, ModuleExecutionStatisticsEventData, ModuleName, Version } from 'app/lib/module/module'
import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'

declare global {
    interface Window {
        modulesAPI: typeof modulesAPI
    }
}

const modulesAPI = {
  async getAllVersions (moduleName: ModuleName): Promise<Version[]> {
    return await ipcRenderer.invoke('modules:getAllVersions', moduleName)
  },
  async installVersion (moduleName: ModuleName, versionTag: string, progressCallback: (progress: InstallProgress) => void): Promise<void> {
    const handleProgress = (_e: IpcRendererEvent, _moduleName: ModuleName, _versionTag: string, progress: InstallProgress) => {
        if (_moduleName === moduleName && _versionTag === versionTag) {
            progressCallback(progress)
        }
    }
    ipcRenderer.on('modules:installProgress', handleProgress)
    try {
        await ipcRenderer.invoke('modules:installVersion', moduleName, versionTag)
        await new Promise(resolve => setTimeout(resolve, 100)) // wait for the last progress callback
    } finally {
        ipcRenderer.off('modules:installProgress', handleProgress)
    }
  },
  async uninstallVersion (moduleName: ModuleName, versionTag: string): Promise<void> {
    return await ipcRenderer.invoke('modules:uninstallVersion', moduleName, versionTag)
  },
  async getConfig <T = DistressConfig | MHDDOSProxyConfig | DB1000NConfig> (moduleName: ModuleName): Promise<T> {
    return await ipcRenderer.invoke('modules:getConfig', moduleName)
  },
  async setConfig <T = DistressConfig | MHDDOSProxyConfig | DB1000NConfig> (moduleName: ModuleName, config: T): Promise<void> {
    return await ipcRenderer.invoke('modules:setConfig', moduleName, config)
  }
}
contextBridge.exposeInMainWorld('modulesAPI', modulesAPI)

import { State as ExecutionEngineState, ExecutionLogEntry } from './handlers/engine'

declare global {
  interface Window {
      executionEngineAPI: typeof executionEngineAPI
  }
}

const executionEngineAPI = {
  async startModule (): Promise<void> {
    return await ipcRenderer.invoke('executionEngine:startModule')
  },
  async stopModule (): Promise<void> {
    return await ipcRenderer.invoke('executionEngine:stopModule')
  },
  async getState (): Promise<ExecutionEngineState> {
    return await ipcRenderer.invoke('executionEngine:getState')
  },
  async setModuleToRun (module?: ModuleName): Promise<void> {
    return await ipcRenderer.invoke('executionEngine:setModuleToRun', module)
  },
  async listenForExecutionLog (callback: (_e: IpcRendererEvent, data: ExecutionLogEntry) => void): Promise<void> {
    await ipcRenderer.invoke('executionEngine:listenForExecutionLog')
    ipcRenderer.on('executionEngine:executionLog', callback)
  },
  async stopListeningForExecutionLog (callback: (_e: IpcRendererEvent, data: ExecutionLogEntry) => void): Promise<void> {
    await ipcRenderer.invoke('executionEngine:stopListeningForExecutionLog')
    ipcRenderer.off('executionEngine:executionLog', callback)
  },
  async listenForStdOut (callback: (_e: IpcRendererEvent, data: string) => void): Promise<void> {
    await ipcRenderer.invoke('executionEngine:listenForStdOut')
    ipcRenderer.on('executionEngine:stdout', callback)
  },
  async stopListeningForStdOut (callback: (_e: IpcRendererEvent, data: string) => void): Promise<void> {
    await ipcRenderer.invoke('executionEngine:stopListeningForStdOut')
    ipcRenderer.off('executionEngine:stdout', callback)
  },
  async listenForStdErr (callback: (_e: IpcRendererEvent, data: string) => void): Promise<void> {
    await ipcRenderer.invoke('executionEngine:listenForStdErr')
    ipcRenderer.on('executionEngine:stderr', callback)
  },
  async stopListeningForStdErr (callback: (_e: IpcRendererEvent, data: string) => void): Promise<void> {
    await ipcRenderer.invoke('executionEngine:stopListeningForStdErr')
    ipcRenderer.off('executionEngine:stderr', callback)
  },
  async listenForStatistics (callback: (_e: IpcRendererEvent, data: ModuleExecutionStatisticsEventData) => void): Promise<void> {
    await ipcRenderer.invoke('executionEngine:listenForStatistics')
    ipcRenderer.on('executionEngine:statistics', callback)
  },
  async stopListeningForStatistics (callback: (_e: IpcRendererEvent, data: ModuleExecutionStatisticsEventData) => void): Promise<void> {
    await ipcRenderer.invoke('executionEngine:stopListeningForStatistics')
    ipcRenderer.off('executionEngine:statistics', callback)
  }
}

contextBridge.exposeInMainWorld('executionEngineAPI', executionEngineAPI)