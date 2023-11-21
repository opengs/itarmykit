<template>
    <q-card flat bordered class="row q-pa-sm bg-transparent">
        <div class="col bg-yellow-7" style="max-width: 62px; height: 62px;"> <q-icon name="fa-solid fa-layer-group" size="md" class="q-pt-md q-pl-md"></q-icon></div>
        <div class="col q-pl-md q-pt-md">
            <div class="text-caption text-uppercase text-bold text-grey">{{ $t('dashboard.moduleStatus') }}</div>
            <div class="text-subtitle1 text-bold">{{ displayMessage }}</div>
        </div>
    </q-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { ModuleName } from 'app/lib/module/module';

const selectedModule = ref("DB1000N" as ModuleName | null)
const moduleEnabled = ref(false)

const displayMessage = computed(()=>{
    if (selectedModule.value == null) {
        return "NOT CONFIGURED"
    }
    if (moduleEnabled.value) {
        return "RUNNING | " + selectedModule.value
    }
    return "IDLE | " + selectedModule.value
})

async function loadState() {
    const executionEngineState = await window.executionEngineAPI.getState()
    moduleEnabled.value = executionEngineState.run
    selectedModule.value = executionEngineState.moduleToRun || null
}

onMounted(async () => {
    await loadState()
})

</script>