import { Module, Version, InstallProgress, InstallationTarget, BaseConfig, ModuleName } from './module'

export interface Config extends BaseConfig {
  // NUmber of concurrent tasks
  concurrency: number;
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
      concurrency: 512
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
    const config = await this.getConfig()

    const args = [] as string[]
    args.push('--disable-auto-update', '--json-logs')
    args.push('--concurrency', config.concurrency.toString())
    args.push(...config.executableArguments.filter(arg => arg !== ''))

    let filename = 'distress_x86_64-unknown-linux-musl'
    for (const asset of this.assetMapping) {
      if (asset.arch === process.arch && asset.platform === process.platform) {
        filename = asset.name
        break
      }
    }

    const handler = await this.startExecutable(filename, args)
  }
  override async stop (): Promise<void> {
    this.stopExecutable()
  }
}
