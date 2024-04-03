import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import internal, { EventEmitter } from 'stream'
import path from 'path'
import { app } from 'electron'
import fs from 'fs'
import fetch from 'electron-fetch'
import decompress from 'decompress'
import { v4 as uuid4 } from 'uuid'
import { Settings } from '../../src-electron/handlers/settings'
import { getCPUArchitecture } from './archLib'
import { ca } from 'app/dist/electron/UnPackaged/assets/index.3949846e'

export type ModuleName = 'DB1000N' | 'DISTRESS' | 'MHDDOS_PROXY'

export interface Version {
    // Unique identifier of the version
    tag: string;
    // Human readable name of the version
    name: string;
    // Description / cahngelog
    body: string;
    // Is this specific version already installed or not
    installed: boolean;
}

export enum InstallationErrorCodes {
    OK = 'OK',
    UNSUPPORTED_PLATFORM = 'UNSUPPORTED_PLATFORM',
    CANT_FIND_ASSET = 'CANT_FIND_ASSET',
    UNKNOWN = 'UNKNOWN',
}

export type InstallationProgressStage = 'DOWNLOADING' | 'EXTRACTING' | 'VALIDATING' | 'DONE' | 'FAILED'

export interface InstallProgress {
    // Current stage
    stage: InstallationProgressStage;
    // Progress in %
    progress: number;
    // Error code if stage is FAILED
    errorCode?: InstallationErrorCodes
    // Error message if stage is FAILED
    errorMessage?: string;
}

export interface InstallationTarget {
    arch: 'x64' | 'arm64' | 'ia32';
    platform: 'linux' | 'win32' | 'darwin';
}

export interface BaseConfig {
    // Automatically update module to the newest version
    autoUpdate: boolean;
    // Version of the module to run
    selectedVersion?: string;
    // Additional arguments to pass to the executable
    executableArguments: string[];
}

export type ModuleExecutionEvent = 'execution:statistics' | 'execution:stdout' | 'execution:stderr' | 'execution:error' | 'execution:started' | 'execution:stopped'
export interface ModuleExecutionStatisticsEventData {
    type: 'execution:statistics';
    // Total number of bytes currently sending per second
    currentSendBitrate: number
    // Number of bytes sent since last event
    bytesSend: number
    // When the statistics were collected
    timestamp: number
}
export interface ModuleExecutionStdoutEventData {
    type: 'execution:stdout';
    data: string;
}
export interface ModuleExecutionStderrEventData {
    type: 'execution:stderr';
    data: string;
}
export interface ModuleExecutionErrorEventData {
    type: 'execution:error';
    error: Error;
}
export interface ModuleExecutionStartedEventData {
    type: 'execution:started';
}
export interface ModuleExecutionStoppedEventData {
    type: 'execution:stopped';
    exitCode: number;
}
export type ModuleExecutionEventData = ModuleExecutionStatisticsEventData | ModuleExecutionStdoutEventData | ModuleExecutionStderrEventData | ModuleExecutionErrorEventData | ModuleExecutionStartedEventData | ModuleExecutionStoppedEventData

export abstract class Module<ConfigType extends BaseConfig> {
    // Unique identifier of the module
    public abstract get name(): ModuleName
    // URL to the homepage (owner name) of the module
    public abstract get homeURL(): string
    // List of supported architectures and platforms
    public abstract get supportedInstallationTargets(): Array<InstallationTarget>

    public async getConfig (): Promise<ConfigType> {
      if (this._config === undefined) {
        await this.loadConfig()
      }
      if (this._config === undefined) {
        this._config = this.defaultConfig
        await this.saveConfig(this._config)
      }
      return this._config
    }

    public async setConfig (config: ConfigType): Promise<void> {
      this._config = config
      await this.saveConfig(this._config)
    }

    protected settings: Settings

    private _config?: ConfigType
    protected abstract get defaultConfig(): ConfigType

    private autoupdateInterval?: NodeJS.Timeout

    protected async getInstallationDirectory () {
      const settingsData = await this.settings.getData()  
      return path.join(settingsData.modules.dataPath, this.name)
    }
    protected async getCacheDirectory () {
      // Dont use app.getPath('temp') because on windows you will have to specify multiple folders as exception in windows defender / antivirus
      const settingsData = await this.settings.getData()  
      const location = path.join(settingsData.modules.dataPath, "cache")
      await fs.promises.mkdir(location, { recursive: true })
      return location
    }

    constructor (settings: Settings) {
      this.settings = settings
    }

    // Start execution of the module
    abstract start(): Promise<void>
    // Stop execution of the module
    abstract stop(): Promise<void>

    abstract getAllVersions(): Promise<Version[]>
    abstract installVersion(versionTag: string): AsyncGenerator<InstallProgress, void, void>
    public async uninstallVersion (versionTag: string): Promise<void> {
      const installDirectory = await this.getInstallationDirectory()
      await fs.promises.rmdir(path.join(installDirectory, versionTag), { recursive: true })
    }

    public async installLatestVersion (): Promise<boolean> {
      const versions = await this.getAllVersions()
      if (versions.length > 0 && !versions[0].installed) {
        const progressGenerator = this.installVersion(versions[0].tag)
        for await (const progress of progressGenerator) {
          if (progress.stage === 'DONE') {
            const config = await this.getConfig()
            config.selectedVersion = versions[0].tag
            await this.setConfig(config)
            return true
          }
        }
      }
      return false
    }

    protected async *installVersionFromGithub (owner: string, repo: string, tag: string, assetMapping: Array<{ name: string, arch: 'x64' | 'arm64' | 'ia32', platform: 'linux' | 'win32' | 'darwin' }>): AsyncGenerator<InstallProgress, void, void> {
        interface GithubRelease {
            assets: Array<{ name: string, browser_download_url: string }>
        }

        let release: GithubRelease
        try {
          console.log(`Fetching github release: https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`)
          const releaseResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`)
          if (releaseResponse.status !== 200) {
            yield { stage: 'FAILED', progress: 0, errorCode: InstallationErrorCodes.UNKNOWN, errorMessage: `Cant fetch github release: ${await releaseResponse.text()}` }
            return
          }

          release = await releaseResponse.json() as GithubRelease
        } catch (err) {
          yield { stage: 'FAILED', progress: 0, errorCode: InstallationErrorCodes.UNKNOWN, errorMessage: `Cant fetch github release: ${err}` }
          return
        }

        const assetName = assetMapping.find((asset) => asset.platform === process.platform && asset.arch === getCPUArchitecture())?.name
        if (assetName === undefined) {
          yield { stage: 'FAILED', progress: 0, errorCode: InstallationErrorCodes.UNSUPPORTED_PLATFORM, errorMessage: `Tour architecture is "${getCPUArchitecture()}" and platform "${process.platform}" which is not supported.` }
          return
        }

        const asset = release.assets.find((asset) => asset.name === assetName)
        if (asset === undefined) {
          yield { stage: 'FAILED', progress: 0, errorCode: InstallationErrorCodes.CANT_FIND_ASSET, errorMessage: `Cant find asset with name "${assetName}" in github release` }
          return
        }

        const installDirectory = await this.getInstallationDirectory()
        const cacheDirectory = await this.getCacheDirectory()
        
        const tempDownoloadPath = path.join(cacheDirectory, assetName)
        try {
          for await (const progress of this.downloadFile(asset.browser_download_url, tempDownoloadPath)) {
            yield { stage: 'DOWNLOADING', progress: progress.progress }
          }
        } catch (err) {
          yield { stage: 'FAILED', progress: 0, errorCode: InstallationErrorCodes.UNKNOWN, errorMessage: `Cant download release asset file: ${err}` }
          return
        }

        yield { stage: 'EXTRACTING', progress: 0 }
        try {
          
          await this.extractArchive(tempDownoloadPath, path.join(installDirectory, tag))
        } catch (err) {
          yield { stage: 'FAILED', progress: 0, errorCode: InstallationErrorCodes.UNKNOWN, errorMessage: `Cant extract archive: ${err}` }
          return
        }

        yield { stage: 'VALIDATING', progress: 0 }
        yield { stage: 'DONE', progress: 0 }

        return
    }

    private githubReleaseCache = [] as { tag_name: string, name: string, body: string }[]
    private githubReleaseCacheTime?: Date
    protected async loadVersionsFromGithub (owner: string, repo: string): Promise<Version[]> {
      const installDirectory = await this.getInstallationDirectory()

      const isVersionInstalled = async (tagName: string) => {
        return await new Promise<boolean>((resolve) => {
          fs.promises.access(path.join(installDirectory, tagName))
            .then(() => resolve(true))
            .catch(() => resolve(false))
        })
      }

      //Cache github releases for 5 minutes in order to ommit Gihub API rate limit
      if (this.githubReleaseCacheTime === undefined || this.githubReleaseCacheTime.getTime() + 5 * 60 * 1000 > new Date().getTime()) {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`)
        if (response.status !== 200) {
          throw new Error(`Cant fetch github releases: ${await response.text()}`)
        }
        let newReleasesList = await response.json() as Array<{ tag_name: string, name: string, body: string, prerelease: boolean, draft: boolean }>
        newReleasesList = newReleasesList.filter((release) => !release.prerelease && !release.draft)
        this.githubReleaseCache = newReleasesList
        this.githubReleaseCacheTime = new Date()
      }

      return await Promise.all(this.githubReleaseCache.map(async (release: any) => {
        return {
          tag: release.tag_name,
          name: release.name,
          body: release.body,
          installed: await isVersionInstalled(release.tag_name)
        }
      }))
    }

    protected async *downloadFile (url: string, outPath: string): AsyncGenerator<{progress: number}, void, void> {
      const response = await fetch(url)
      const fileStream = fs.createWriteStream(outPath)
      const contentLengthHeader = response.headers.get('content-length')
      if (contentLengthHeader == null) {
        throw new Error('Content length is null')
      }
      const contentLength = parseInt(contentLengthHeader, 10)
      let downloadedBytes = 0

      yield { progress: 0.001 }

      if (response.body == null) {
        throw new Error('Response body is null')
      }
      const body = response.body as internal.Readable
      body.pipe(fileStream)

      const e = new EventEmitter()

      body.on('data', (chunk) => {
        downloadedBytes += chunk.length
        e.emit('progress', downloadedBytes / contentLength * 100)
      })

      body.on('error', (err: any) => {
        e.emit('err', err)
      })

      let lastYieldProgress = 0
      while (true) {
        const r = await new Promise<{ progress: number }>((resolve, reject) => {
          e.on('progress', (progress: number) => {
            e.removeAllListeners()
            return resolve({ progress })
          })
 
          e.on('err', (err: any) => {
            e.removeAllListeners()
            return reject(err)
          })
        })
        if (r.progress == 100) {
          return
        }
        if (lastYieldProgress + 5 < r.progress || r.progress == 100) {
          lastYieldProgress = r.progress
          yield r
        }
      }
    }

    protected async extractArchive (archivePath: string, outPath: string, deleteSource = true): Promise<void> {
      try {
        const directoryExist = await new Promise<boolean>((resolve) => {
          fs.promises.access(outPath)
            .then(() => resolve(true))
            .catch(() => resolve(false))
        })
        if (!directoryExist) {
          await fs.promises.mkdir(outPath, { recursive: true })
        }

        if (archivePath.endsWith('.zip') || archivePath.endsWith('.tar.gz')) {
          await decompress(archivePath, outPath)
        } else {
          await fs.promises.copyFile(archivePath, path.join(outPath, path.basename(archivePath)))
          if (process.platform !== 'win32') {
            await fs.promises.chmod(path.join(outPath, path.basename(archivePath)), "775") // Make executable
          }
        }
      } finally {
        if (deleteSource) {
          await fs.promises.unlink(archivePath)
        }
      }
    }

    private executionEventEmitter = new EventEmitter()
    public on (event: ModuleExecutionEvent, listener: (data: ModuleExecutionEventData) => void) {
      this.executionEventEmitter.on(event, listener)
    }

    public once (event: ModuleExecutionEvent, listener: (data: ModuleExecutionEventData) => void) {
      this.executionEventEmitter.once(event, listener)
    }

    public off (event: ModuleExecutionEvent, listener: (data: ModuleExecutionEventData) => void) {
      this.executionEventEmitter.off(event, listener)
    }

    protected emit (event: ModuleExecutionEvent, data: ModuleExecutionEventData) {
      this.executionEventEmitter.emit(event, data)
    }

    // Indicates if module is currently running
    public get isRunning (): boolean {
      return this.executedProcessHandler !== undefined
    }

    protected executedProcessHandler?: ChildProcessWithoutNullStreams
    protected executableOutputToString(data: Buffer) {
      return data.toString()
    }
    protected async startExecutable (executableName: string, args: string[]): Promise<ChildProcessWithoutNullStreams> {
      let config = await this.getConfig()
      if (config.autoUpdate) {
        await this.installLatestVersion()
        config = await this.getConfig()
      }

      this.autoupdateInterval = setInterval(async () => {
        const updateConfig = await this.getConfig()
        if (updateConfig.autoUpdate && await this.installLatestVersion() && this.isRunning) {
          await this.stop()
          await this.start()
        }
      }, 1000 * 60 * 30) // Try to autoupdate once in 30 minutes

      const installDirectory = await this.getInstallationDirectory()

      if (config.selectedVersion === undefined) {
        const error = new Error('Failed to start executable. No version selected')
        this.emit('execution:error', { type: 'execution:error', error })
        throw error
      }

      if (this.executedProcessHandler !== undefined) {
        throw new Error('Already running')
      }

      const executablePath = path.join(installDirectory, config.selectedVersion, executableName)
      const cwd = path.join(installDirectory, config.selectedVersion)
      this.executedProcessHandler = spawn(executablePath, args, { cwd, shell: false })

      this.emit('execution:started', { type: 'execution:started' })

      this.executedProcessHandler.stdout.on('data', (data: Buffer) => {
        this.emit('execution:stdout', { type: 'execution:stdout', data: this.executableOutputToString(data) })
      })
      this.executedProcessHandler.stderr.on('data', (data: Buffer) => {
        this.emit('execution:stderr', { type: 'execution:stderr', data: this.executableOutputToString(data) })
      })
      this.executedProcessHandler.on('error', (error: Error) => {
        this.emit('execution:error', { type: 'execution:error', error })
      })
      this.executedProcessHandler.on('close', (code: number) => {
        this.emit('execution:stopped', { type: 'execution:stopped', exitCode: code })
      })

      return this.executedProcessHandler
    }

    protected async stopExecutable (): Promise<void> {
      clearInterval(this.autoupdateInterval)
      this.autoupdateInterval = undefined

      const handler = this.executedProcessHandler // Copy handler, because other async task can chenage it in the meantime

      await new Promise<void>((resolve, reject) => {
        const termTimeout = setTimeout(() => {
          handler?.kill('SIGTERM')
        }, 5000) 

        const killTimeout = setTimeout(() => {
          handler?.kill('SIGKILL')
          resolve()
        }, 10000)
        
        handler?.on('close', () => {
          clearTimeout(termTimeout)
          clearTimeout(killTimeout)
          resolve()
        })
        
        handler?.kill('SIGINT')
        
        
      })

      this.executedProcessHandler = undefined
    }

    protected async loadConfig (): Promise<void> {
      const installDirectory = await this.getInstallationDirectory()
      const configFilePath = path.join(installDirectory, 'config.json')
      try {
        const configDump = await fs.promises.readFile(configFilePath, { encoding: 'utf-8' })
        const config = JSON.parse(configDump) as ConfigType
        this._config = {
          ...this.defaultConfig, // do this to ensure config backward compatibility in future
          ...config
        }
      } catch (err) {}
    }

    protected async saveConfig(config: ConfigType): Promise<void> {
      const installDirectory = await this.getInstallationDirectory()
      const configDump = JSON.stringify(config)
      const configFilePath = path.join(installDirectory, 'config.json')

      await fs.promises.mkdir(installDirectory, { recursive: true })
      await fs.promises.writeFile(configFilePath, configDump, { encoding: 'utf-8' })
    }
}
