<template>
    <q-page padding>
        <div class="row">
            <div class="col-3 q-pr-xs"><ModuleStatusComponent  /></div>
            <div class="col-3 q-pr-xs q-pl-xs"><BytesSendComponent  /></div>
            <div class="col-3 q-pr-xs q-pl-xs"><UpdateComponent  /></div>
            <div class="col-3 q-pl-xs"><ItArmyIDComponent  /></div>
        </div>
        <q-card class="row q-mt-sm q-pa-md bg-transparent" flat bordered>
            <q-card-section class="text-bold text-h5 q-pa-none q-pl-md">{{ $t('dashboard.statistics') }}</q-card-section>
            <BitrateChartComponent class="fit" />
        </q-card>
        <div class="col q-pl-lg">
			<q-separator></q-separator>
			<details closed>
			<summary class="text-bold text-h5 q-mt-lg" style="cursor: pointer;">{{ $t('modules.active.executionLog') }}</summary>
				
				<q-input outlined v-model="executionLog" type="textarea" class="row q-mt-sm"/>
				<q-input outlined v-model="stdOUT" type="textarea" class="row q-mt-sm"/>
				<q-input outlined v-model="stdERR" type="textarea" class="row q-mt-sm"/>
			</details>
			<q-separator></q-separator>
        </div>
    </q-page>
</template>

<script lang="ts" setup>

import ModuleStatusComponent from './ModuleStatusComponent.vue';
import BytesSendComponent from './BytesSendComponent.vue';
import UpdateComponent from './UpdateComponent.vue';
import ItArmyIDComponent from './ItArmyIDComponent.vue';
import BitrateChartComponent from './BitrateChartComponent.vue';

onMounted(async () => {
})

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

async function loadState() {
    const executionEngineState = await window.executionEngineAPI.getState()
    moduleEnabled.value = executionEngineState.run
    selectedModule.value = executionEngineState.moduleToRun || null

    executionLog.value = executionEngineState.executionLog.map((e) => JSON.stringify(e) + "\n").join("")
    stdOUT.value = executionEngineState.stdOut.join("")
    stdERR.value = executionEngineState.stdErr.join("")
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
    await loadState()
})

onUnmounted(() => {
    window.executionEngineAPI.stopListeningForExecutionLog(onExecutionLog)
    window.executionEngineAPI.stopListeningForStdOut(onStdOut)
    window.executionEngineAPI.stopListeningForStdErr(onStdErr)
})

</script>
