import { Module, Version, InstallProgress, InstallationTarget, BaseConfig, ModuleName } from './module'
import { getCPUArchitecture } from './archLib'

export interface Config extends BaseConfig {
  // Disable UDP flood or not
  DisableUDPFlood: boolean;
  // Enable ICMP flood or not
  EnableICMPFlood: boolean;
  // Enable PACKET flood or not
  EnablePACKETFlood: boolean;
  // Number of concurrent tasks
  concurrency: number;
  // Number of Tor connections
  useTor: number;
  // Percentage of own IP usage
  useMyIP: number;
}

export class Distress extends Module<Config> {
  public override get name (): ModuleName { return 'DISTRESS' }
  public override get homeURL (): string { return 'https://github.com/Yneth/distress-releases' }
  public override get supportedInstallationTargets (): Array<InstallationTarget> {
    return [
      { arch: 'x64', platform: 'linux' },
      { arch: 'arm64', platform: 'linux' },
      { arch: 'x64', platform: 'win32' },
      { arch: 'ia32', platform: 'win32' },
      { arch: 'x64', platform: 'darwin' },
      { arch: 'arm64', platform: 'darwin' }
    ]
  }

  protected override get defaultConfig (): Config {
    return {
      autoUpdate: true,
      executableArguments: [],
      concurrency: 4096,
      DisableUDPFlood: false,
      EnableICMPFlood: false,
      EnablePACKETFlood: false,
      useMyIP: 0,
      useTor: 0
    }
  }

  override async getAllVersions (): Promise<Version[]> {
    return await this.loadVersionsFromGithub('Yneth', 'distress-releases')
  }

  private assetMapping = [
    { name: 'distress_x86_64-unknown-linux-musl', arch: 'x64', platform: 'linux' },
    { name: 'distress_aarch64-unknown-linux-musl', arch: 'arm64', platform: 'linux' },

    { name: 'distress_x86_64-pc-windows-msvc.exe', arch: 'x64', platform: 'win32' },
    { name: 'distress_i686-pc-windows-msvc.exe', arch: 'ia32', platform: 'win32' },

    { name: 'distress_x86_64-apple-darwin', arch: 'x64', platform: 'darwin' },
    { name: 'distress_aarch64-apple-darwin', arch: 'arm64', platform: 'darwin' }
  ] as Array<{
      name: string;
      arch: "x64" | "arm64" | "ia32";
      platform: "linux" | "win32" | "darwin";
  }>

  override async *installVersion (versionTag: string): AsyncGenerator<InstallProgress, void, void> {
    const progressGenerator = this.installVersionFromGithub('Yneth', 'distress-releases', versionTag, this.assetMapping)

    for await (const progress of progressGenerator) {
      yield progress
    }
  }

  override async start (): Promise<void> {
    const settings = await this.settings.getData()
    const config = await this.getConfig()

    const args = [] as string[]
    if (settings.itarmy.uuid !== '') {
      args.push('--user-id', settings.itarmy.uuid)
    }
    args.push('--child', '--json-logs')
    if (config.concurrency > 0) {
      args.push('--concurrency', config.concurrency.toString())
    }
    if (config.useTor > 0) {
      args.push('--use-tor', config.useTor.toString())
    }
    if (config.useMyIP > 0) {
      args.push('--use-my-ip', config.useMyIP.toString())
    }
    if (config.useMyIP > 0 && config.DisableUDPFlood) {
      args.push('--disable-udp-flood')
    }
    if (config.useMyIP > 0 && config.EnableICMPFlood) {
      args.push('--enable-icmp-flood')
    }
    if (config.useMyIP > 0 && config.EnablePACKETFlood) {
      args.push('--enable-packet-flood')
    }
    args.push('--source', "itarmykit")
    args.push(...config.executableArguments.filter(arg => arg !== ''))

    let filename = 'distress_x86_64-unknown-linux-musl'
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
          const lineJSON = JSON.parse(line)
          const msg = lineJSON["msg"] as string

          if (!msg.includes("active connections") || !msg.includes("bps") || !msg.includes("bytes")) {
            continue
          }

          let bytesSend = 0
          let currentSendBitrate = 0

          const convertToBytes = (value: string): number => {
            value = value.toLowerCase()
            
            if (value.includes("kb")) {
              return Number(value.split("kb")[0]) * 125
            } else if (value.includes("mb")) {
              return Number(value.split("mb")[0]) * 125 * 1024
            } else if (value.includes("gb")) {
              return Number(value.split("gb")[0]) * 125 * 1024 * 1024
            } else if (value.includes("tb")) {
              return Number(value.split("tb")[0]) * 125 * 1024 * 1024 * 1024
            } else if (value.includes("pb")) {
              return Number(value.split("pb")[0]) * 125 * 1024 * 1024 * 1024 * 1024
            } else if (value.includes("eb")) {
              return Number(value.split("eb")[0]) * 125 * 1024 * 1024 * 1024 * 1024 * 1024
            } else {
              return Number(value.split("b")[0])
            }
          }

          const parameters = msg.split(",").map((parameter) => parameter.trim())
          for (const parameter of parameters) {
            if (parameter.includes("bytes")) {
              bytesSend = convertToBytes(parameter.split("=")[1])
            } else if (parameter.includes("bps")) {
              currentSendBitrate = convertToBytes(parameter.split("=")[1])
            }
          }

          this.emit('execution:statistics', {
            type: 'execution:statistics',
            bytesSend: Number(bytesSend),
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
