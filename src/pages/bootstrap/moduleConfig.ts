import { Config as DistressConfig } from 'lib/module/distress'
import { Config as MHDDOSProxyConfig } from 'lib/module/mhddosproxy'
import { Config as DB1000NConfig } from 'lib/module/db1000n'
import { InstallProgress, ModuleName } from 'app/lib/module/module'

export enum Preset {
    GOVERNMENT_AGENCY = 'GOVERNMENT_AGENCY',
    NORMAL = 'NORMAL',
    LAPTOP = 'LAPTOP',
    MAX = 'MAX',
}

function selectRandomModuleWithWeight(): ModuleName {
    const modules = [
        { name: 'DISTRESS' as ModuleName, weight: 2 },
        { name: 'MHDDOS_PROXY' as ModuleName, weight: 2 },
        { name: 'DB1000N' as ModuleName, weight: 1 },
    ]

    const totalWeight = modules.reduce((acc, module) => acc + module.weight, 0)
    const randomNumber = Math.random() * totalWeight
    let accumulatedWeight = 0

    for (const module of modules) {
        accumulatedWeight += module.weight
        if (accumulatedWeight > randomNumber) {
            return module.name
        }
    }

    return 'DISTRESS'
}

async function installModule(mhddosProxyConfig:MHDDOSProxyConfig, distressConfig: DistressConfig, db1000nConfig: DB1000NConfig,  callback: (progress: InstallProgress) => void) {
    const moduleName: ModuleName = selectRandomModuleWithWeight()

    const versions = await window.modulesAPI.getAllVersions(moduleName)
    const tag = versions[0].tag
    await window.modulesAPI.installVersion(moduleName, tag, callback)

    switch (moduleName) {
        case 'MHDDOS_PROXY':
            mhddosProxyConfig.selectedVersion = tag
            await window.modulesAPI.setConfig(moduleName, mhddosProxyConfig)
            break
        case 'DISTRESS':
            distressConfig.selectedVersion = tag
            await window.modulesAPI.setConfig(moduleName, distressConfig)
            break
        case 'DB1000N':
            db1000nConfig.selectedVersion = tag
            await window.modulesAPI.setConfig(moduleName, db1000nConfig)
            break
    }

    await window.executionEngineAPI.setModuleToRun(moduleName)
}

async function getDefaultConfigs() {
    interface ret {
        mhddosProxyConfig: MHDDOSProxyConfig
        distressConfig: DistressConfig
        db1000nConfig: DB1000NConfig
    }

    const mhddosProxyConfig = await window.modulesAPI.getConfig('MHDDOS_PROXY')
    const distressConfig = await window.modulesAPI.getConfig('DISTRESS')
    const db1000nConfig = await window.modulesAPI.getConfig('DB1000N')

    return { mhddosProxyConfig, distressConfig, db1000nConfig } as ret
}

export async function configureGovernmentAgencyPreset(callback: (progress: InstallProgress) => void) {
    const { mhddosProxyConfig, distressConfig, db1000nConfig } = await getDefaultConfigs()

    distressConfig.concurrency = 212

    mhddosProxyConfig.copies = 1
    mhddosProxyConfig.threads = 160

    db1000nConfig.scale = 0.05

    await installModule(mhddosProxyConfig, distressConfig, db1000nConfig, callback)

    await window.executionEngineAPI.startModule()
    await window.settingsAPI.system.setAutoUpdate(true)
    await window.settingsAPI.system.setStartOnBoot(true)
    await window.settingsAPI.system.setHideInTray(true)
}

export async function configureNormalPreset(callback: (progress: InstallProgress) => void) {
    const { mhddosProxyConfig, distressConfig, db1000nConfig } = await getDefaultConfigs()
    await installModule(mhddosProxyConfig, distressConfig, db1000nConfig, callback)
    await window.executionEngineAPI.startModule()
    await window.settingsAPI.system.setAutoUpdate(true)
    await window.settingsAPI.system.setStartOnBoot(true)
    await window.settingsAPI.system.setHideInTray(true)
}

export async function configureLaptopPreset(callback: (progress: InstallProgress) => void) {
    const { mhddosProxyConfig, distressConfig, db1000nConfig } = await getDefaultConfigs()

    distressConfig.concurrency = 2048
    mhddosProxyConfig.copies = 1
    mhddosProxyConfig.threads = 4096
    db1000nConfig.scale = 0.5

    await installModule(mhddosProxyConfig, distressConfig, db1000nConfig, callback)
    await window.executionEngineAPI.startModule()
    await window.settingsAPI.system.setAutoUpdate(true)
    await window.settingsAPI.system.setStartOnBoot(true)
    await window.settingsAPI.system.setHideInTray(true)
}

export async function configureMaxPreset(callback: (progress: InstallProgress) => void) {
    const { mhddosProxyConfig, distressConfig, db1000nConfig } = await getDefaultConfigs()

    distressConfig.concurrency = 65534
    db1000nConfig.scale = 5

    mhddosProxyConfig.copies = 0 // Auto
    mhddosProxyConfig.threads = 0 // Auto

    await installModule(mhddosProxyConfig, distressConfig, db1000nConfig, callback)
    await window.executionEngineAPI.startModule()
    await window.settingsAPI.system.setAutoUpdate(true)
    await window.settingsAPI.system.setStartOnBoot(true)
    await window.settingsAPI.system.setHideInTray(true)
}

export async function configure(preset: Preset, callback: (progress: InstallProgress) => void) {
    switch (preset) {
        case Preset.GOVERNMENT_AGENCY:
            await configureGovernmentAgencyPreset(callback)
            break
        case Preset.NORMAL:
            await configureNormalPreset(callback)
            break
        case Preset.LAPTOP:
            await configureLaptopPreset(callback)
            break
        case Preset.MAX:
            await configureMaxPreset(callback)
            break
    }
}