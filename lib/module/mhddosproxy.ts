import { spawn } from 'child_process'
import { Module, Version, InstallProgress, InstallationTarget, BaseConfig, ModuleName } from './module'
import { getCPUArchitecture } from './archLib'

export interface Config extends BaseConfig {
  // Number of processes to launch
  copies: number;
  // Number of threads per process
  threads: number;
  // Percent of own IP address to use. 0 to disable.
  useMyIP: number;
}

export class MHDDOSProxy extends Module<Config> {
  public override get name (): ModuleName { return 'MHDDOS_PROXY' }
  public override get homeURL (): string { return 'https://github.com/porthole-ascend-cinnamon/mhddos_proxy_releases' }
  public override get supportedInstallationTargets (): Array<InstallationTarget> {
    return [
      { arch: 'x64', platform: 'linux' },
      { arch: 'arm64', platform: 'linux' },
      { arch: 'ia32', platform: 'linux' },
      { arch: 'x64', platform: 'win32' },
      { arch: 'ia32', platform: 'win32' }
    ]
  }

  protected override get defaultConfig (): Config {
    return {
      autoUpdate: true,
      executableArguments: [],
      copies: 1,
      threads: 8192,
      useMyIP: 0
    }
  }

  override async getAllVersions (): Promise<Version[]> {
    return await this.loadVersionsFromGithub('porthole-ascend-cinnamon', 'mhddos_proxy_releases')
  }

  private assetMapping = [
    { name: 'mhddos_proxy_linux', arch: 'x64', platform: 'linux' },
      { name: 'mhddos_proxy_linux_arm64', arch: 'arm64', platform: 'linux' },
      { name: 'mhddos_proxy_linux_x86', arch: 'ia32', platform: 'linux' },

      { name: 'mhddos_proxy_win.exe', arch: 'x64', platform: 'win32' },
      { name: 'mhddos_proxy_win_x86.exe', arch: 'ia32', platform: 'win32' }
  ] as Array<{
    name: string;
    arch: "x64" | "arm64" | "ia32";
    platform: "linux" | "win32" | "darwin";
  }>



  override async *installVersion (versionTag: string): AsyncGenerator<InstallProgress, void, void> {
    const progressGenerator = this.installVersionFromGithub('porthole-ascend-cinnamon', 'mhddos_proxy_releases', versionTag, this.assetMapping)

    for await (const progress of progressGenerator) {
      yield progress
    }
  }

  override executableOutputToString(data: Buffer) {
    return data.toString()
  }

  async killProcessesOnWindows(): Promise<void> {
    let filename = 'mhddos_proxy_win.exe'
    for (const asset of this.assetMapping) {
      if (asset.arch === getCPUArchitecture() && asset.platform === process.platform) {
        filename = asset.name
        break
      }
    }

    await new Promise<void>((resolve) => {
      const handler = spawn(`taskkill /F /T /PID ${filename}`, { shell: true })
      handler.on('close', () => {resolve()})
      handler.on('error', () => {resolve()})
      handler.on('exit', () => {resolve()})
    })
  }

  protected override async stopExecutable (): Promise<void> {
    if (process.platform === 'win32') {
      // on windows MHDDOS fails to kill subprocesses when the main process is killed
      await this.killProcessesOnWindows()
      this.executedProcessHandler = undefined
    } else {
      await super.stopExecutable()
    }
  }

  override async start (): Promise<void> {
    // MHDDOS requires fix on Windows. In some cases, when program is killed, it fails to kill subprocesses. For example on automatic updates.
    // This is a workaround for this problem.
    if (process.platform === 'win32') {
      await this.killProcessesOnWindows()
    }
    // ------

    const settings = await this.settings.getData()
    let lang = 'ua'
    if (settings.system.language === 'en-US') {
      lang = 'en'
    }

    const config = await this.getConfig()

    const args = [] as string[]
    if (settings.itarmy.uuid !== '') {
      args.push('--user-id', settings.itarmy.uuid)
    }
    args.push('--no-updates')
    if (config.copies !== 0) {
      args.push('--copies', config.copies.toString())
    }
    if (config.copies == 0) {
      args.push('--copies', "auto")
    }
    if (config.threads > 0) {
      args.push('--threads', config.threads.toString())
    }
    if (config.useMyIP > 0) {
      args.push('--use-my-ip', config.useMyIP.toString())
    }
    args.push('--source', "itarmykit")
    args.push('--lang', lang)
    args.push(...config.executableArguments.filter(arg => arg !== ''))

    let filename = 'mhddos_proxy_linux'
    for (const asset of this.assetMapping) {
      if (asset.arch === getCPUArchitecture() && asset.platform === process.platform) {
        filename = asset.name
        break
      }
    }

    const handler = await this.startExecutable(filename, args)

    // Process statistics
    let lastStatisticsEvent = null as Date | null
    let statisticsBuffer = ''
    handler.stdout.on('data', (data: Buffer) => {
      statisticsBuffer += data.toString()

      const lines = statisticsBuffer.trimEnd().split('\n')
      if (statisticsBuffer.endsWith('\n')) {
        statisticsBuffer = ''
      } else {
        statisticsBuffer = lines.pop() as string
      }

      for (const line of lines) {
        try {
          if (lang === 'ua') {
            // Sample line: [19:26:37 - INFO] Потужність: 77.3%, З'єднань: 2, Пакети: 12.00/s, Трафік: 70.49 kBit/s
            if (!line.includes("Трафік") || !line.includes("Пакети") || !line.includes("Потужність")) {
              continue
            }
          } else {
            // Sample line: [19:53:44 - INFO] Capacity: 19.7%, Connections: 5, Packets: 1.86k/s, Traffic: 2.27 MBit/s
            if (!line.includes("Capacity") || !line.includes("Connections") || !line.includes("Packets")) {
              continue
            }
          }

          let bytesSend = 0
          let currentSendBitrate = 0

          const convertToBytes = (value: string): number => {
            value = value.toLowerCase()
            
            if (value.includes("kb")) {
              return Number(value.split(" ")[0]) * 125
            } else if (value.includes("mb")) {
              return Number(value.split(" ")[0]) * 125 * 1024
            } else if (value.includes("gb")) {
              return Number(value.split(" ")[0]) * 125 * 1024 * 1024
            } else if (value.includes("tb")) {
              return Number(value.split(" ")[0]) * 125 * 1024 * 1024 * 1024
            } else if (value.includes("pb")) {
              return Number(value.split(" ")[0]) * 125 * 1024 * 1024 * 1024 * 1024
            } else if (value.includes("eb")) {
              return Number(value.split(" ")[0]) * 125 * 1024 * 1024 * 1024 * 1024 * 1024
            } else {
              return Number(value.split(" ")[0])
            }
          }

          let msg = ""
          if (lang === 'ua') {
            msg = line.split("Трафік:")[1].trim()
          } else {
            msg = line.split("Traffic:")[1].trim()
          }
          currentSendBitrate = convertToBytes(msg)

          if (lastStatisticsEvent != null) {
            const now = new Date()
            const timeDiff = (now.getTime() - lastStatisticsEvent.getTime()) / 1000.0
            
            // Bugfix [https://github.com/opengs/itarmykit/issues/19]. When PC goes to sleep mode, timediff is huge and not relevant
            if (timeDiff > 60) {
              lastStatisticsEvent = new Date()
              continue
            }

            if (timeDiff > 0) {
              bytesSend = currentSendBitrate * timeDiff
            }
          }
          lastStatisticsEvent = new Date()

          this.emit('execution:statistics', {
            type: 'execution:statistics',
            bytesSend: bytesSend,
            currentSendBitrate,
            timestamp: new Date().getTime()
          })
        } catch (e) {
          console.error(String(e) + '\n' + line)
        }
      }
    })
  }
  override async stop (): Promise<void> {
    this.stopExecutable()
  }
}
