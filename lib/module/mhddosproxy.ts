import { spawn } from 'child_process'
import { Module, Version, InstallProgress, InstallationTarget, BaseConfig, ModuleName } from './module'

export interface Config extends BaseConfig {
  // Number of processes to launch
  copies: number;
  // Number of threads per process
  threads: number;
  // Percent of own IP address to use. 0 to disable.
  vpnPercents: number;
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
      vpnPercents: 0
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

  protected override async stopExecutable (): Promise<void> {
    if (process.platform === 'win32') {
      // on windows MHDDOS fails to kill subprocesses when the main process is killed
      spawn(`taskkill /F /T /PID ${this.executedProcessHandler?.pid}`, { shell: true })
      this.executedProcessHandler = undefined
    } else {
      await super.stopExecutable()
    }
  }

  override async start (): Promise<void> {
    const settings = await this.settings.getData()
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
    if (config.vpnPercents > 0) {
      args.push('--vpn')
      args.push('--vpn-percents', config.vpnPercents.toString())
    }
    args.push('--source', "itarmykit")
    args.push(...config.executableArguments.filter(arg => arg !== ''))

    let filename = 'mhddos_proxy_linux'
    for (const asset of this.assetMapping) {
      if (asset.arch === process.arch && asset.platform === process.platform) {
        filename = asset.name
        break
      }
    }

    const handler = await this.startExecutable(filename, args)

    // Process statistics
    let lastStatisticsEvent = null as Date | null
    let statisticsBuffer = ''
    handler.stderr.on('data', (data: Buffer) => {
      statisticsBuffer += data.toString()

      const lines = statisticsBuffer.trimEnd().split('\n')
      if (statisticsBuffer.endsWith('\n')) {
        statisticsBuffer = ''
      } else {
        statisticsBuffer = lines.pop() as string
      }

      for (const line of lines) {
        try {
          // Sample line: [19:26:37 - INFO] Потужність: 77.3%, З'єднань: 2, Пакети: 12.00/s, Трафік: 70.49 kBit/s
          if (!line.includes("Трафік") || !line.includes("Пакети") || !line.includes("Потужність")) {
            continue
          }

          let bytesSend = 0
          let currentSendBitrate = 0

          const convertToBytes = (value: string): number => {
            value = value.toLowerCase()
            
            if (value.includes("kb")) {
              return Number(value.split(" ")[0]) * 125
            } else if (value.includes("mb")) {
              return Number(value.split(" ")[0]) * 125 * 1000
            } else if (value.includes("gb")) {
              return Number(value.split(" ")[0]) * 125 * 1000 * 1000
            } else if (value.includes("tb")) {
              return Number(value.split(" ")[0]) * 125 * 1000 * 1000 * 1000
            } else if (value.includes("pb")) {
              return Number(value.split(" ")[0]) * 125 * 1000 * 1000 * 1000 * 1000
            } else if (value.includes("eb")) {
              return Number(value.split(" ")[0]) * 125 * 1000 * 1000 * 1000 * 1000 * 1000
            } else {
              return Number(value.split(" ")[0])
            }
          }

          const msg = line.split("Трафік:")[1].trim()
          currentSendBitrate = convertToBytes(msg)

          if (lastStatisticsEvent != null) {
            const now = new Date()
            const timeDiff = (now.getTime() - lastStatisticsEvent.getTime()) / 1000.0
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
