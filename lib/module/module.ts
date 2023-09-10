import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { EventEmitter } from 'stream'
import path from 'path'
import { app } from 'electron'

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
    reqeustsMade: number;
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

    private _config?: ConfigType
    protected abstract get defaultConfig(): ConfigType

    protected get installationDirectory (): string { return path.join(app.getPath('appData'), 'UACyberShield', 'itarmykit', 'modules', this.name) }

    // Start execution of the module
    abstract start(): Promise<void>
    // Stop execution of the module
    abstract stop(): Promise<void>

    abstract getAllVersions(): Promise<Version[]>
    abstract installVersion(versionTag: string): AsyncGenerator<InstallProgress, void, void>
    public async uninstallVersion (versionTag: string): Promise<void> {
      // Import here to make file compatible with frontend
      const fs = (await import('fs')).promises
      await fs.rmdir(path.join(this.installationDirectory, versionTag), { recursive: true })
    }

    protected async *installVersionFromGithub (owner: string, repo: string, tag: string, assetMapping: Array<{ name: string, arch: 'x64' | 'arm64' | 'ia32', platform: 'linux' | 'win32' | 'darwin' }>): AsyncGenerator<InstallProgress, void, void> {
      // Import here to make file compatible with frontend
      const fetch = await import('node-fetch')

        interface GithubRelease {
            assets: Array<{ name: string, browser_download_url: string }>
        }

        let release: GithubRelease
        try {
          console.log(`Fetching github release: https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`)
          const releaseResponse = await fetch.default(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`)
          if (releaseResponse.status !== 200) {
            yield { stage: 'FAILED', progress: 0, errorCode: InstallationErrorCodes.UNKNOWN, errorMessage: `Cant fetch github release: ${await releaseResponse.text()}` }
            return
          }

          release = await releaseResponse.json() as GithubRelease
        } catch (err) {
          yield { stage: 'FAILED', progress: 0, errorCode: InstallationErrorCodes.UNKNOWN, errorMessage: `Cant fetch github release: ${err}` }
          return
        }

        const assetName = assetMapping.find((asset) => asset.platform === process.platform && asset.arch === process.arch)?.name
        if (assetName === undefined) {
          yield { stage: 'FAILED', progress: 0, errorCode: InstallationErrorCodes.UNSUPPORTED_PLATFORM, errorMessage: `Tour architecture is "${process.arch}" and platform "${process.platform}" which is not supported.` }
          return
        }

        const asset = release.assets.find((asset) => asset.name === assetName)
        if (asset === undefined) {
          yield { stage: 'FAILED', progress: 0, errorCode: InstallationErrorCodes.CANT_FIND_ASSET, errorMessage: `Cant find asset with name "${assetName}" in github release` }
          return
        }

        const tempDownoloadPath = path.join(app.getPath('temp'), assetName)
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
          await this.extractArchive(tempDownoloadPath, path.join(this.installationDirectory, tag))
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
      // Import here to make file compatible with frontend
      const fetch = await import('node-fetch')
      const fs = (await import('fs')).promises

      const isVersionInstalled = async (tagName: string) => {
        return await new Promise<boolean>((resolve) => {
          fs.access(path.join(this.installationDirectory, tagName))
            .then(() => resolve(true))
            .catch(() => resolve(false))
        })
      }

      //Cache github releases for 5 minutes in order to ommit Gihub API rate limit
      if (this.githubReleaseCacheTime === undefined || this.githubReleaseCacheTime.getTime() + 5 * 60 * 1000 > new Date().getTime()) {
        const response = await fetch.default(`https://api.github.com/repos/${owner}/${repo}/releases`)
        if (response.status !== 200) {
          throw new Error(`Cant fetch github releases: ${await response.text()}`)
        }
        this.githubReleaseCache = await response.json() as Array<{ tag_name: string, name: string, body: string }>
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
      // Import here to make file compatible with frontend
      const fetch = await import('node-fetch')
      const fs = await import('fs')

      const response = await fetch.default(url)
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
      response.body.pipe(fileStream)

      const e = new EventEmitter()

      response.body.on('data', (chunk) => {
        downloadedBytes += chunk.length
        e.emit('progress', downloadedBytes / contentLength * 100)
      })

      response.body.on('error', (err: any) => {
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
      // Import here to make file compatible with frontend
      const fs = (await import('fs')).promises
      const decompress = (await import('decompress')).default

      try {
        const directoryExist = await new Promise<boolean>((resolve) => {
          fs.access(outPath)
            .then(() => resolve(true))
            .catch(() => resolve(false))
        })
        if (!directoryExist) {
          await fs.mkdir(outPath, { recursive: true })
        }

        if (archivePath.endsWith('.zip') || archivePath.endsWith('.tar.gz')) {
          await decompress(archivePath, outPath)
        } else {
          await fs.copyFile(archivePath, path.join(outPath, path.basename(archivePath)))
          if (process.platform !== 'win32') {
            await fs.chmod(path.join(outPath, path.basename(archivePath)), "775") // Make executable
          }
        }
      } finally {
        if (deleteSource) {
          await fs.unlink(archivePath)
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
    protected async startExecutable (executableName: string, args: string[]): Promise<ChildProcessWithoutNullStreams> {
      const config = await this.getConfig()
      if (config.selectedVersion === undefined) {
        throw new Error('No version selected')
      }

      if (this.executedProcessHandler !== undefined) {
        throw new Error('Already running')
      }

      const executablePath = path.join(this.installationDirectory, config.selectedVersion, executableName)
      const cwd = path.join(this.installationDirectory, config.selectedVersion)
      this.executedProcessHandler = spawn(executablePath, args, { cwd, shell: false })

      this.emit('execution:started', { type: 'execution:started' })

      this.executedProcessHandler.stdout.on('data', (data: Buffer) => {
        this.emit('execution:stdout', { type: 'execution:stdout', data: data.toString() })
      })
      this.executedProcessHandler.stderr.on('data', (data: Buffer) => {
        this.emit('execution:stderr', { type: 'execution:stderr', data: data.toString() })
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
      const handler = this.executedProcessHandler // Copy handler, because other async task can chenage it in the meantime

      await new Promise<void>((resolve, reject) => {
        handler?.on('close', () => {
          clearTimeout(timeout)
          resolve()
        })
        
        handler?.kill('SIGINT')
        
        const timeout = setTimeout(() => {
          handler?.kill('SIGKILL')
          resolve()
        }, 5000)
      })

      this.executedProcessHandler = undefined
    }

    protected async loadConfig (): Promise<void> {
      // Import here to make file compatible with frontend
      const fs = (await import('fs')).promises

      const configFilePath = path.join(this.installationDirectory, 'config.json')
      try {
        const configDump = await fs.readFile(configFilePath, { encoding: 'utf-8' })
        const config = JSON.parse(configDump) as ConfigType
        this._config = config
      } catch (err) {}
    }

    protected async saveConfig(config: ConfigType): Promise<void> {
      // Import here to make file compatible with frontend
      const fs = (await import('fs')).promises

      const configDump = JSON.stringify(config)
      const configFilePath = path.join(this.installationDirectory, 'config.json')

      await fs.mkdir(this.installationDirectory, { recursive: true })
      await fs.writeFile(configFilePath, configDump, { encoding: 'utf-8' })
    }
}
