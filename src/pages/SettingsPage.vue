<template>
    <a-page padding class="">
        <q-card
            flat
            class="bg-transparent"
        >
            <q-card-section>
                <div class="text-h5">System</div>
                <q-separator class="q-mt-xs q-mb-xs"/>
                <q-item class="" v-ripple clickable @click="setSystemAutoUpdate(!systemAutoUpdate)">
                    <q-item-section>
                        <q-item-label>Automatic updates</q-item-label>
                        <q-item-label caption>Automatically update application to the newest version</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                        <q-toggle color="primary" v-model="systemAutoUpdate" @update:model-value="setSystemAutoUpdate" />
                    </q-item-section>
                </q-item>

                <q-item class="" v-ripple clickable @click="setSystemAutoStartup(!systemAutoStartup)">
                    <q-item-section>
                        <q-item-label>Automatic startup</q-item-label>
                        <q-item-label caption>Automatically startup application on system startup</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                        <q-toggle color="primary" v-model="systemAutoStartup" @update:model-value="setSystemAutoStartup" />
                    </q-item-section>
                </q-item>

                <q-item class="" v-ripple clickable @click="setSystemHideInTray(!systemHideInTray)">
                    <q-item-section>
                        <q-item-label>Hide application in tray</q-item-label>
                        <q-item-label caption>Hide application in tray instead of closing it. Also when starting up, dont show the main window.</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                        <q-toggle color="primary" v-model="systemHideInTray" @update:model-value="setSystemHideInTray" />
                    </q-item-section>
                </q-item>

                <div class="q-pt-sm">
                <LanguageSelectorComponent />
                </div>
            </q-card-section>

            <q-card-section>
                <div class="text-h5">Schedule</div>
                <q-separator class="q-mt-xs q-mb-xs"/>
                <q-item class="" v-ripple clickable @click="setSystemSheduleEnabled(!systemSheduleEnabled)" disable>
                    <q-item-section>
                        <q-item-label>Enable</q-item-label>
                        <q-item-label caption>Enable or disable sheduler. It changes behaviour of the tool in specified hour (for example during the work you can lower resource usage)</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                        <q-toggle color="primary" v-model="systemSheduleEnabled" @update:model-value="setSystemSheduleEnabled" disable/>
                    </q-item-section>
                </q-item>
                <div class="row fit q-mt-sm">
                    <div class="col-6 q-pr-xs">
                        <q-input outlined v-model="sheduleStartTime" mask="time" :rules="['time']" label="Start time" :disable="!systemSheduleEnabled">
                            <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="sheduleStartTime">
                                    <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                </q-time>
                                </q-popup-proxy>
                            </q-icon>
                            </template>
                        </q-input>
                    </div>

                    <div class="col-6 q-pl-xs">
                        <q-input outlined v-model="sheduleEndTime" mask="time" :rules="['time']" label="End time" :disable="!systemSheduleEnabled">
                            <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="sheduleEndTime">
                                    <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                </q-time>
                                </q-popup-proxy>
                            </q-icon>
                            </template>
                        </q-input>
                    </div>
                </div>
                <q-select outlined v-model="sheduleActivity" type="number" class="" :options="sheduleActivityOptions" @update:model-value="setSheduleActivity" label="Replacing activity" :disable="!systemSheduleEnabled" />
            </q-card-section>

            <q-card-section>
                <div class="text-h5">ItArmy</div>
                <q-separator class="q-mt-xs q-mb-sm"/>
                <q-input outlined label="IT Army ID" v-model="itArmyUUID" @update:model-value="setItArmyUUID" debounce="500" type="password"/>
            </q-card-section>

            <q-card-section>
                <div class="text-h5">Data</div>
                <q-separator class="q-mt-xs q-mb-xs"/>
                <div><span class="">Currently your modules located under:</span> {{ modulesDataFolderPath }}  </div>
                <q-btn outline label="Open data folder" class="fit q-mt-sm" @click="openModulesDataFolder" />
                <q-btn outline label="Change modules data location" class="fit q-mt-sm" @click="selectFolderForModulesData" />
                <q-btn outline label="Delete modules cache" color="negative" class="fit q-mt-sm" disable />
                <q-btn outline label="Delete all the data" color="negative" class="fit q-mt-sm" disable />
            </q-card-section>

        </q-card>
    </a-page>
</template>

<script lang="ts" setup>
import LanguageSelectorComponent from './settings/LanguageSelectorComponent.vue';

import { onMounted, ref } from 'vue';

const systemAutoUpdate = ref(true)
async function setSystemAutoUpdate(newValue: boolean) {
    await window.settingsAPI.system.setAutoUpdate(newValue)
    systemAutoUpdate.value = newValue
}

const systemAutoStartup = ref(true)
async function setSystemAutoStartup(newValue: boolean) {
    await window.settingsAPI.system.setStartOnBoot(newValue)
    systemAutoStartup.value = newValue
}

const systemHideInTray = ref(true)
async function setSystemHideInTray(newValue: boolean) {
    await window.settingsAPI.system.setHideInTray(newValue)
    systemHideInTray.value = newValue
}

const systemSheduleEnabled = ref(false)
async function setSystemSheduleEnabled(newValue: boolean) {

}

const sheduleStartTime = ref("08:00")
const sheduleEndTime = ref("16:00")
const sheduleActivityOptions = ref([
    { label: "Do nothing", value: "DO_NOTHING" },
    { label: "Minimal resource usage", value: "MINIMAL_USAGE" },
])
const sheduleActivity = ref("DO_NOTHING")
async function setSheduleActivity() {
    
}

const modulesDataFolderPath = ref("")
async function selectFolderForModulesData() {
    await window.settingsAPI.modules.promptForDataPath()
    await loadSettings()
}
async function openModulesDataFolder() {
    await window.settingsAPI.modules.openDataFolder()
}

const itArmyUUID = ref("")
async function setItArmyUUID(newValue: string | number | null) {
    await window.settingsAPI.itarmy.setUUID(String(newValue))
}

async function loadSettings() {
    const settings = await window.settingsAPI.get()
    systemAutoUpdate.value = settings.system.autoUpdate
    systemAutoStartup.value = settings.system.startOnBoot
    systemHideInTray.value = settings.system.hideInTray
    systemSheduleEnabled.value = settings.schedule.enabled
    sheduleStartTime.value = settings.schedule.startTime
    sheduleEndTime.value = settings.schedule.endTime
    sheduleActivity.value = settings.schedule.activity
    modulesDataFolderPath.value = settings.modules.dataPath
    itArmyUUID.value = settings.itarmy.uuid
}

onMounted(async () => {
    await loadSettings()
})

</script>
