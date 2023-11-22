<template>
    <q-spinner v-if="loadingVersions" class="full-width q-mt-md q-mb-md" size="xl" color="primary"/>
    <div v-if="versionsLoadingError != ''" class="text-h6 text-negative text-center q-mt-md q-mb-md">{{ versionsLoadingError }}</div>
    <q-list separator>
        <q-item v-for="version of versions" active-class="bg-teal-1 text-grey-8" dense>
            <q-item-section style="max-width: 100px;">{{ version.tag }}</q-item-section>
            <q-item-section style="max-width: 125px;" class="text-grey">{{ (installationStore.installingModule == props.moduleName && installationStore.installingTag == version.tag) ? installationStore.stage  : ((version.installed) ? 'INSTALLED' : '') }}</q-item-section>
            <q-item-section class="text-grey" v-if="installationStore.installingModule == props.moduleName && installationStore.installingTag == version.tag">
                <span class="text-negative" v-if="installationStore.stage == 'FAILED'" >{{ installationStore.errorCode + ': ' + installationStore.errorMessage }}</span>
                <q-linear-progress v-if="installationStore.stage != 'FAILED'" stripe rounded size="md" :value="installationStore.progress / 100" :indeterminate="installationStore.progress == 0" color="warning" class="q-mt-sm" />
            </q-item-section>
            <q-item-section style="white-space: pre-line; " v-else>{{ version.body.trimEnd() }}</q-item-section>
            <q-item-section side>
                <q-btn v-if="version.installed && props.selectedVersion != version.tag" color="dark" size="sm" @click="emit('update:selectedVersion', version.tag)">{{ $t('modules.available.versions.selectUse') }}</q-btn>
                <q-btn v-if="!version.installed" icon="download" color="primary" size="sm" :loading="installingVersion" :disable="installingVersion" @click="installVersion(version.tag)">{{ $t('modules.available.versions.downloadInstall') }}</q-btn>
            </q-item-section>
        </q-item>
    </q-list>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ModuleName, Version } from 'app/lib/module/module';
import { useModulesInstallationStore } from './installation.store'

const props = defineProps<{
    moduleName: ModuleName,
    selectedVersion: string | null,
    installedVersions: string[]
}>()

const emit = defineEmits<{
    (event: 'update:selectedVersion', version: string | null): void,
    (event: 'update:installedVersions', versions: string[]): void
}>()

const loadingVersions = ref(false)
const versions = ref([] as Version[])
const versionsLoadingError = ref("")

async function loadVersions() {
    loadingVersions.value = true
    try {
        versions.value = await window.modulesAPI.getAllVersions(props.moduleName)
        emit('update:installedVersions', versions.value.filter(v => v.installed).map(v => v.tag))
        versionsLoadingError.value = ""
    } catch (e) {
        versionsLoadingError.value = String(e)
    } finally {
        loadingVersions.value = false
    }
}

const installingVersion = ref(false)
const installationStore = useModulesInstallationStore()

async function installVersion(versionTag: string) {
    installingVersion.value = true
    try {
        await window.modulesAPI.installVersion(props.moduleName, versionTag, (progress) => {
            console.log(progress)
            installationStore.supplyProgress({
                module: props.moduleName,
                progress:   progress,
                version:    versionTag
            })
        })
    } catch (e) {
        console.error(e)
    } finally {
        installingVersion.value = false
        await loadVersions()
    }
}

onMounted(async () => {
    await loadVersions()
})
</script>