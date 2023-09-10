<template>
    <q-page padding class="row">
        <div class="col" style="max-width: 300px;">
            <MenuComponent />
        </div>
        <div class="col q-pl-lg">
            <q-select outlined v-model="selectedModule" type="number" class="row q-mt-sm" :options="availableModules" label="Selected module to run" :disable="moduleEnabled" @update:model-value="setConfig"/>
            <q-item class="row q-mt-sm" :v-ripple="selectedModule != null" clickable @click="setModuleEnabled(!moduleEnabled)" :disable="selectedModule == null">
                <q-item-section>
                <q-item-label>Module enabled</q-item-label>
                <q-item-label caption>Enable or disable module execution</q-item-label>
                </q-item-section>
                <q-item-section side top>
                <q-toggle color="primary" v-model="moduleEnabled" disable/>
                </q-item-section>
            </q-item>
            
            <div class="text-bold text-h6 q-mt-lg">Execution Log:</div>
            <q-separator></q-separator> 
            <q-input outlined v-model="executionLog" type="textarea" class="row q-mt-sm"/>

            <div class="text-bold text-h6 q-mt-lg">STD OUT:</div>
            <q-separator></q-separator> 
            <q-input outlined v-model="stdOUT" type="textarea" class="row q-mt-sm"/>

            <div class="text-bold text-h6 q-mt-lg">STD ERR:</div>
            <q-separator></q-separator> 
            <q-input outlined v-model="stdERR" type="textarea" class="row q-mt-sm"/>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { debounce } from 'quasar'
import MenuComponent from './MenuComponent.vue'
import { ModuleName } from 'app/lib/module/module';
import { IpcRendererEvent } from 'electron';

const moduleEnabled = ref(false)
const selectedModule = ref(null as ModuleName | null)
const availableModules = ref([ 'DB1000N', 'DISTRESS', 'MHDDOS_PROXY' ] as ModuleName[])

const executionLog = ref("")
const stdOUT = ref("")
const stdERR = ref("")

async function loadConfig() {
    const executionEngineConfig = await window.executionEngineAPI.getConfig()
    moduleEnabled.value = executionEngineConfig.run
    selectedModule.value = executionEngineConfig.moduleToRun || null
}

const setConfigDebounce = debounce(setConfig, 1000)
async function setConfig() {
    await window.executionEngineAPI.setConfig({
        run: moduleEnabled.value,
        moduleToRun: selectedModule.value || undefined
    })
}

async function setModuleEnabled(enable: boolean) {
    moduleEnabled.value = enable
    if (enable) {
        await window.executionEngineAPI.startModule()
    } else {
        await window.executionEngineAPI.stopModule()
    }
}

function onExecutionLog(_e: IpcRendererEvent, data: any) {
    data = JSON.stringify(data) + "\n"
    executionLog.value += data
    while (executionLog.value.length > 10000) {
        executionLog.value = executionLog.value.slice(1000)
    }
}

function onStdOut(_e: IpcRendererEvent, data: string) {
    stdOUT.value += data
    while (stdOUT.value.length > 10000) {
        stdOUT.value = stdOUT.value.slice(1000)
    }
}

function onStdErr(_e: IpcRendererEvent, data: string) {
    stdERR.value += data
    while (stdERR.value.length > 10000) {
        stdERR.value = stdERR.value.slice(1000)
    }
}

onMounted(async () => {
    window.executionEngineAPI.listenForExecutionLog(onExecutionLog)
    window.executionEngineAPI.listenForStdOut(onStdOut)
    window.executionEngineAPI.listenForStdErr(onStdErr)
    await loadConfig()
})

onUnmounted(() => {
    window.executionEngineAPI.stopListeningForExecutionLog(onExecutionLog)
    window.executionEngineAPI.stopListeningForStdOut(onStdOut)
    window.executionEngineAPI.stopListeningForStdErr(onStdErr)
})

</script>