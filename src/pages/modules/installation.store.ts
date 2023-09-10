import { InstallProgress, ModuleName, InstallationProgressStage, InstallationErrorCodes } from 'app/lib/module/module'
import { defineStore } from 'pinia'

export interface ModuleVersionInstallationProgress {
    module: ModuleName
    version: string
    progress: InstallProgress
}

export const useModulesInstallationStore = defineStore('modulesInstallation', {
  state: () => ({
    stage: 'DONE' as InstallationProgressStage,
    progress: 0,
    errorCode: 'OK' as InstallationErrorCodes,
    errorMessage: '',
    installingModule: "DB1000N" as ModuleName,
    installingTag: ""
  }),
  getters: {
  },
  actions: {
    supplyProgress (progress: ModuleVersionInstallationProgress) {
        if (progress.progress.stage === 'DONE') {
            this.installingTag = "-------------------------------"
            return 
        }

        this.stage = progress.progress.stage
        this.progress = progress.progress.progress
        if (progress.progress.errorCode !== undefined) {
            this.errorCode = progress.progress.errorCode
        }
        if (progress.progress.errorMessage !== undefined) {
            this.errorMessage = progress.progress.errorMessage
        }
        this.installingModule = progress.module
        this.installingTag = progress.version
    }
  }
})
