<template>
    <q-card>
        <q-card-section>
            <div class="text-h6">{{ $t('bootstrap.module.installation.title') }}</div>
            <div class="text-subtitle2 text-center">{{ stage }}</div>
        </q-card-section>
        <q-card-section flat class="background-transparent">
            <q-linear-progress :value="stageProgress"></q-linear-progress>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Preset, configure } from './moduleConfig';
import { InstallProgress, InstallationErrorCodes } from 'app/lib/module/module';

const props = defineProps<{
    presetName: Preset
}>()

const emit = defineEmits<{
    (event: 'configured'): void,
    (event: 'error', error: string): void
}>()

const stageProgress = ref(0)
const stage = ref("")

function configurationCallback(progress: InstallProgress) {
    if (progress.errorMessage) {
        throw progress.errorMessage
    }

    if (progress.stage == 'DONE') {
        emit('configured')
        return
    }

    stageProgress.value = progress.progress / 100
    stage.value = progress.stage
}

onMounted(async () => {
    try {
        await configure(props.presetName, configurationCallback)
        console.log("ended")
        emit('configured')
    } catch (e) {
        console.log(e)
        emit('error', String(e))
    }
})

</script>