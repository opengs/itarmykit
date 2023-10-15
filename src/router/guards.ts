import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export async function bootstrapGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    const settings = await window.settingsAPI.get()
    console.log(settings)
    if (settings.bootstrap.step !== "DONE") {
        return next({ name: 'bootstrap' })
    }

    return next()
}