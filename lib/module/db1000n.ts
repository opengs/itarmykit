import { Module, Version, InstallProgress, InstallationTarget, BaseConfig, ModuleName } from './module'

export interface Config extends BaseConfig {
    // Used to scale the amount of jobs being launched, effect is similar to launching multiple instances at once
    scale: number;
    // Minimum interval between job iterations
    minInterval: number;
    // Set to true if you want to run primitive jobs that are less resource-efficient
    enablePrimitive: boolean;
    // Path to the file with proxies. can be on internet
    proxylist: string;
    // Deefault proxy protocol to use
    defaultProxyProto: 'socks4' | 'socks5' | null;
}

export class DB1000N extends Module<Config> {
  public override get name (): ModuleName { return 'DB1000N' }
  public override get homeURL (): string { return 'https://github.com/arriven/db1000n' }
  public override get supportedInstallationTargets (): Array<InstallationTarget> {
    return [
      { arch: 'x64', platform: 'linux' },
      { arch: 'arm64', platform: 'linux' },
      { arch: 'x64', platform: 'win32' },
      { arch: 'arm64', platform: 'win32' },
      { arch: 'x64', platform: 'darwin' },
      { arch: 'arm64', platform: 'darwin' }
    ]
  }

  protected override get defaultConfig (): Config {
    return {
      autoUpdate: true,
      scale: 1,
      minInterval: 0,
      enablePrimitive: false,
      executableArguments: [],
      proxylist: '',
      defaultProxyProto: null
    }
  }

  override async getAllVersions (): Promise<Version[]> {
    return await this.loadVersionsFromGithub('arriven', 'db1000n')
  }

  override async *installVersion (versionTag: string): AsyncGenerator<InstallProgress, void, void> {
    const progressGenerator = this.installVersionFromGithub('arriven', 'db1000n', versionTag, [
      { name: 'db1000n_linux_amd64.tar.gz', arch: 'x64', platform: 'linux' },
      { name: 'db1000n_linux_arm64.tar.gz', arch: 'arm64', platform: 'linux' },
      { name: 'db1000n_windows_386.zip', arch: 'ia32', platform: 'win32' },
      { name: 'db1000n_windows_amd64.zip', arch: 'x64', platform: 'win32' },
      { name: 'db1000n_windows_arm64.zip', arch: 'arm64', platform: 'win32' },
      { name: 'db1000n_darwin_amd64.tar.gz', arch: 'x64', platform: 'darwin' },
      { name: 'db1000n_darwin_arm64.tar.gz', arch: 'arm64', platform: 'darwin' }
    ])

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

    args.push('--log-format', 'json')
    args.push('--scale', config.scale.toString())
    if (config.minInterval > 0) {
      args.push('--min-interval', config.minInterval.toString() + "ms")
    }
    if (config.enablePrimitive) {
      args.push('--enable-primitive')
    }
    if (config.proxylist !== '') {
      args.push('--proxylist', config.proxylist)
    }
    if (config.proxylist !== '' && config.defaultProxyProto !== null) {
      args.push('--default-proxy-proto', config.defaultProxyProto)
    }
    args.push('--source', "itarmykit")
    args.push(...config.executableArguments.filter(arg => arg !== ''))

    const executableName = process.platform === 'win32' ? 'db1000n.exe' : 'db1000n'
    const handler = await this.startExecutable(executableName, args)

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
          const lineJSON = JSON.parse(line)
          if (lineJSON["msg"] !== "stats") {
            continue
          }

          const bytesSend = lineJSON["total"]["bytes_sent"]
          if (bytesSend === undefined) {
            continue
          }
          let currentSendBitrate = 0
          if (lastStatisticsEvent == null) {
            lastStatisticsEvent = new Date()
          } else {
            const now = new Date()
            const timeDiff = (now.getTime() - lastStatisticsEvent.getTime()) / 1000.0

            // Bugfix [https://github.com/opengs/itarmykit/issues/19]. When PC goes to sleep mode, timediff is huge and not relevant
            if (timeDiff > 60) {
              lastStatisticsEvent = new Date()
              continue
            }

            if (timeDiff > 0) {
              currentSendBitrate = bytesSend * 1.0 / timeDiff
            }
            lastStatisticsEvent = now
          }

          this.emit('execution:statistics', {
            type: 'execution:statistics',
            bytesSend: Number(bytesSend),
            currentSendBitrate,
            timestamp: new Date().getTime()
          })
          //TODO: extract statistics
        } catch (e) {
          console.error(String(e) + '\n' + line)
        }
      }
    })
  }

  override async stop (): Promise<void> {
    await this.stopExecutable()
  }
}
