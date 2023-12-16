<template>
    <div class="q-pa-lg">
        <div class="full-width text-center text-h5 q-mb-lg">{{ $t('bootstrap.title') }}</div>
        <q-stepper
            v-model="step"
            class="full-height"
            header-nav
            ref="stepper"
            color="primary"
            animated
            flat
            bordered

        >
        <q-step
            :name="1"
            :title="$t('bootstrap.header.language')"
            icon="settings"
            :done="step > 1"
            :header-nav="step > 1"
            class=""
        >
            <LanguageSelectorComponent />

            <q-stepper-navigation>
            <q-btn @click="finishLanguageStep" color="primary" :label="$t('bootstrap.language.continueButton')" class="fit" outline/>
            </q-stepper-navigation>
        </q-step>

        <q-step
            :name="2"
            :title="$t('bootstrap.header.data')"
            icon="create_new_folder"
            :done="step > 2"
            :header-nav="step > 2"
        >
            <div>{{ $t('bootstrap.data.body') }}</div>
            <div class="text-bold text-h5">{{ dataFolder }} </div>
            <div><q-btn :label="$t('bootstrap.data.changeDataFolderButton')" outline class="q-ma-sm" @click="changeDataFolder"/></div>

            <div class="text-h4 text-bold text-negative text-center q-pa-lg" v-if="$q.platform.is.win">{{ $t('bootstrap.data.windows') }}</div>

            <q-stepper-navigation class="row">
            <q-btn @click="step = 1" color="primary" :label="$t('bootstrap.data.backButton')" class="q-mr-sm col-2" outline />
            <q-btn @click="finishDataStep" color="primary" :label="$t('bootstrap.data.continueButton')" class="col fit" outline />

            </q-stepper-navigation>
        </q-step>

        <q-step
            :name="3"
            :title="$t('bootstrap.header.itarmy')"
            icon="add_comment"
            :done="step > 3"
            :header-nav="step > 3"
        >
            <div class="q-mb-md">{{ $t('bootstrap.itarmy.body') }}</div>
            <div class="q-mb-md">{{ $t('settings.idDescription') }} <a href="https://itarmy.com.ua/statistics/" target="_blank" rel="noopener noreferrer">https://itarmy.com.ua</a></div>
            <q-input :label="$t('bootstrap.itarmy.uuidInputTitle')" outlined v-model="itArmyUUID" @update:model-value="setItArmyUUID" :debounce="500" type="number"/>

            <q-stepper-navigation class="row">
                <q-btn @click="step = 2" color="primary" :label="$t('bootstrap.itarmy.backButton')" class="q-mr-sm col-2" outline />
            <q-btn @click="finishItArmyStep" color="primary" :label="$t('bootstrap.itarmy.continueButton')" class="col fit" outline />
            </q-stepper-navigation>
        </q-step>

        <q-step
            :name="4"
            :title="$t('bootstrap.header.module')"
            icon="view_module"
            :done="step > 4"
            :header-nav="step > 4"
        >
            <div class="q-mb-md">{{ $t('bootstrap.module.body') }}</div>
            <q-list>
                <q-item tag="label" v-ripple>
                    <q-item-section avatar>
                    <q-radio v-model="presetToInstall" :val="Preset.GOVERNMENT_AGENCY" color="yellow-7" />
                    </q-item-section>
                    <q-item-section>
                    <q-item-label>{{ $t('bootstrap.module.preset.government.title') }}</q-item-label>
                    <q-item-label caption>{{ $t('bootstrap.module.preset.government.description') }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                    <q-item-section avatar>
                    <q-radio v-model="presetToInstall" :val="Preset.LAPTOP" color="yellow-7" />
                    </q-item-section>
                    <q-item-section>
                    <q-item-label>{{ $t('bootstrap.module.preset.laptop.title') }}</q-item-label>
                    <q-item-label caption>{{ $t('bootstrap.module.preset.laptop.description') }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                    <q-item-section avatar>
                    <q-radio v-model="presetToInstall" :val="Preset.COMFORT" color="yellow-7" />
                    </q-item-section>
                    <q-item-section>
                    <q-item-label>{{ $t('bootstrap.module.preset.comfort.title') }}</q-item-label>
                    <q-item-label caption>{{ $t('bootstrap.module.preset.comfort.description') }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                    <q-item-section avatar>
                    <q-radio v-model="presetToInstall" :val="Preset.NORMAL" color="yellow-7" />
                    </q-item-section>
                    <q-item-section>
                    <q-item-label>{{ $t('bootstrap.module.preset.normal.title') }}</q-item-label>
                    <q-item-label caption>{{ $t('bootstrap.module.preset.normal.description') }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                    <q-item-section avatar>
                    <q-radio v-model="presetToInstall" :val="Preset.MAX" color="yellow-7" />
                    </q-item-section>
                    <q-item-section>
                    <q-item-label>{{ $t('bootstrap.module.preset.max.title') }}</q-item-label>
                    <q-item-label caption>{{ $t('bootstrap.module.preset.max.description') }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                    <q-item-section avatar>
                    <q-radio v-model="presetToInstall" :val="null" color="yellow-7" />
                    </q-item-section>
                    <q-item-section>
                    <q-item-label>{{ $t('bootstrap.module.preset.expert.title') }}</q-item-label>
                    <q-item-label caption>{{ $t('bootstrap.module.preset.expert.description') }}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
            <q-stepper-navigation class="row">
                <q-btn @click="step = 2" color="primary" :label="$t('bootstrap.data.backButton')" class="q-mr-sm col-2" outline />
            <q-btn @click="finishModuleStep" color="primary" :label="$t('bootstrap.data.continueButton')" class="col fit" outline />
            </q-stepper-navigation>
        </q-step>
        </q-stepper>

    <q-dialog v-model="moduleInstallationDialog">
        <ModuleInstallationComponent
            @error="moduleInstallationError"
            @configured="moduleInstalledSuccessfully"
            :preset-name="presetToInstall ? presetToInstall : Preset.NORMAL"
        />
    </q-dialog>

    <q-dialog v-model="doneDialog" persistent>
        <BoostrapDoneDialog />
    </q-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import LanguageSelectorComponent from '../settings/LanguageSelectorComponent.vue';
import { Preset } from './moduleConfig';
import ModuleInstallationComponent from './ModuleInstallationComponent.vue';
import { useQuasar } from 'quasar';

import BoostrapDoneDialog from './BoostrapDoneDialog.vue';

const step = ref(1);
const router = useRouter();
const quasar = useQuasar();
const doneDialog = ref(false);

const dataFolder = ref("")

async function finishLanguageStep() {
    await window.settingsAPI.bootstrap.setStep("DATA_FOLDER")
    step.value = 2;
}

async function openDataFodler() {
    await window.settingsAPI.modules.openDataFolder()
}

async function changeDataFolder() {
    await window.settingsAPI.modules.promptForDataPath()
    await loadSettings()
}

async function finishDataStep() {
    await window.settingsAPI.bootstrap.setStep("ITARMY_UUID")
    step.value = 3;
}

const itArmyUUID = ref("")
async function setItArmyUUID(newValue: string | number | null) {
    await window.settingsAPI.itarmy.setUUID(String(newValue))
}

async function finishItArmyStep() {
    await window.settingsAPI.bootstrap.setStep("MODULES_CONFIGURATION")
    step.value = 4;
}

const presetToInstall = ref<Preset | null>(Preset.NORMAL)
const moduleInstallationDialog = ref(false)
async function finishModuleStep() {
    if (presetToInstall.value === null) {
        await window.settingsAPI.bootstrap.setStep("DONE")
        await router.push({ name: "dashboard" }) //For expert mode will will not show notification that he need to wait several minutes, because he must do everything by himselve.
    } else {
        moduleInstallationDialog.value = true
    }
}
async function moduleInstallationError(error: string) {
    quasar.notify({
        message: error,
        type: "negative",
        timeout: 5000
    })
    moduleInstallationDialog.value = false
}
async function moduleInstalledSuccessfully() {
    moduleInstallationDialog.value = false
    await window.settingsAPI.bootstrap.setStep("DONE")
    doneDialog.value = true
}

async function loadSettings() {
    const settings = await window.settingsAPI.get()
    dataFolder.value = settings.modules.dataPath
    itArmyUUID.value = settings.itarmy.uuid
}

onMounted(async () => {
    await loadSettings()
})
</script>
