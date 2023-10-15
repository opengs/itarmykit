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
            {{ $t('bootstrap.data.body') }} <span class="text-bold text-h5">{{ dataFolder }} </span>
            <q-btn :label="$t('bootstrap.data.openDataFolderButton')" outline class="q-ma-sm" @click="openDataFodler"/>
            <q-btn :label="$t('bootstrap.data.changeDataFolderButton')" outline class="q-ma-sm" @click="changeDataFolder"/>

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
            :header-nav="step > 3"
        >
            <div class="q-mb-md">{{ $t('bootstrap.itarmy.body') }}</div>
            <q-input :label="$t('bootstrap.itarmy.uuidInputTitle')" outlined v-model="itArmyUUID" @update:model-value="setItArmyUUID" :debounce="500" />

            <q-stepper-navigation class="row">
                <q-btn @click="step = 2" color="primary" :label="$t('bootstrap.data.backButton')" class="q-mr-sm col-2" outline />
            <q-btn @click="finishItArmyStep" color="primary" :label="$t('bootstrap.data.continueButton')" class="col fit" outline />
            </q-stepper-navigation>
        </q-step>
        </q-stepper>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import LanguageSelectorComponent from '../settings/LanguageSelectorComponent.vue';

const step = ref(1);
const router = useRouter();

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
    await window.settingsAPI.bootstrap.setStep("DONE")
    await router.push({ name: "dashboard" })
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