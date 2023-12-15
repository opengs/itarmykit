import { defineStore } from 'pinia'

export const useMatrixStore = defineStore('matrix', {
  state: () => ({
    _enabled: false
  }),
    getters: {
        enabled: (state) => state._enabled
    },
  actions: {
    async setEnabled (enabled: boolean) {
        this._enabled = enabled
        await window.settingsAPI.gui.setMatrixMode(enabled)
    },
    async load() {
        const settingsData = await window.settingsAPI.get()
        this._enabled = settingsData.gui.matrixMode
    }
  }
})
