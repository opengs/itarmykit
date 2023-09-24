import { Module, Version, InstallProgress, InstallationTarget, BaseConfig, ModuleName } from './module'

export interface Config extends BaseConfig {
  // Number of processes to launch
  copies: number;
  // Number of threads per process
  threads: number;
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
      threads: 16
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

  override async start (): Promise<void> {
    const config = await this.getConfig()

    const args = [] as string[]
    //args.push('--no-updates')
    //args.push('--copies', config.copies.toString())
    //args.push('--threads', config.threads.toString())
    //args.push(...config.executableArguments.filter(arg => arg !== ''))

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
              return Number(value.split(" ")[0]) * 1024
            } else if (value.includes("mb")) {
              return Number(value.split(" ")[0]) * 1024 * 1024
            } else if (value.includes("gb")) {
              return Number(value.split(" ")[0]) * 1024 * 1024 * 1024
            } else if (value.includes("tb")) {
              return Number(value.split(" ")[0]) * 1024 * 1024 * 1024 * 1024
            } else if (value.includes("pb")) {
              return Number(value.split(" ")[0]) * 1024 * 1024 * 1024 * 1024 * 1024
            } else if (value.includes("eb")) {
              return Number(value.split(" ")[0]) * 1024 * 1024 * 1024 * 1024 * 1024 * 1024
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
