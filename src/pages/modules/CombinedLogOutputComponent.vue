<template>
    <q-scroll-area ref="scroll" outlined style="height: 200px; max-height: 300px;" class="row q-mt-sm">
        <pre>{{ log }}</pre>
    </q-scroll-area>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { IpcRendererEvent } from 'electron';
import { QScrollArea } from 'quasar';

const log = ref("")
const scroll = ref<QScrollArea>()

async function loadState() {
    const executionEngineState = await window.executionEngineAPI.getState()
    log.value = executionEngineState.executionLog.map((e) => JSON.stringify(e) + "\n").join("")
    log.value += executionEngineState.stdOut.join("")
    log.value += executionEngineState.stdErr.join("")
    
    // Has to be executed after first draw of the component to be able to adjust size
    setTimeout(() => {
        scroll.value?.setScrollPercentage("vertical", 1, 1000)
    }, 500)
}

function onExecutionLog(_e: IpcRendererEvent, data: any) {
    data = JSON.stringify(data) + "\n"
    log.value += data
    while (log.value.length > 10000) {
        log.value = log.value.slice(1000)
    }
    scroll.value?.setScrollPercentage("vertical", 1, 1000)
}

function onStdOut(_e: IpcRendererEvent, data: string) {
    log.value += data
    while (log.value.length > 10000) {
        log.value = log.value.slice(1000)
    }
    scroll.value?.setScrollPercentage("vertical", 1, 1000)
}

function onStdErr(_e: IpcRendererEvent, data: string) {
    log.value += data
    while (log.value.length > 10000) {
        log.value = log.value.slice(1000)
    }
    scroll.value?.setScrollPercentage("vertical", 1, 1000)
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