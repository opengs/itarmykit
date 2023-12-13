<template>
    <q-input outlined v-model="log" type="textarea" class="row q-mt-sm"/>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { IpcRendererEvent } from 'electron';

const log = ref("")

async function loadState() {
    const executionEngineState = await window.executionEngineAPI.getState()
    log.value = executionEngineState.executionLog.map((e) => JSON.stringify(e) + "\n").join("[EXECUTION]: ")
    log.value += executionEngineState.stdOut.join("[STDOUT]: ")
    log.value += executionEngineState.stdErr.join("[STDERR]: ")
}

function onExecutionLog(_e: IpcRendererEvent, data: any) {
    data = JSON.stringify(data) + "\n"
    log.value += "[EXECUTION]: " + data
    while (log.value.length > 10000) {
        log.value = log.value.slice(1000)
    }
}

function onStdOut(_e: IpcRendererEvent, data: string) {
    log.value += "[STDOUT]: " + data
    while (log.value.length > 10000) {
        log.value = log.value.slice(1000)
    }
}

function onStdErr(_e: IpcRendererEvent, data: string) {
    log.value += "[STDERR]: " + data
    while (log.value.length > 10000) {
        log.value = log.value.slice(1000)
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