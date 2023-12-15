<template>
    <q-page padding class="row">
        <div class="col" style="max-width: 300px;">
            <MenuComponent />
        </div>
        <div class="col q-pl-lg">
            <div class="row text-h5 text-bold">MHDDOS PROXY</div>
            <q-separator />
            <div class="row col q-pt-sm">
                <div class="col-12 q-pt-xs"><span class="text-subtitle2">Author: <a class="text-primary cursor-pointer" href="https://github.com/porthole-ascend-cinnamon" target="_blank">porthole-ascend-cinnamon</a></span></div>
                <div class="col-12 q-pt-xs"><span class="text-subtitle2">Repository: <a class="text-primary" href="https://github.com/porthole-ascend-cinnamon/mhddos_proxy_releases" target="_blank">https://github.com/porthole-ascend-cinnamon/mhddos_proxy_releases</a></span> </div>
                <div class="col-12 q-pt-xs"><span class="text-subtitle2">Support: <a class="text-primary" href="https://t.me/+H6PnjkydZX0xNDky" target="_blank">IT Army Chat</a></span> </div>

                
                <div class="col-12 q-pt-xs"><span class="text-subtitle2">Author readme: </span> Own proxy database creates the attack from the whole world, which makes it much more difficult to protect against.</div>    
            </div>

            <div class="row text-h5 text-bold q-mt-lg">{{ $t('modules.available.configuration') }}</div>
            <q-separator />
            <div class="row q-pt-md">
                <div class="col text-subtitle1">{{ $t('modules.available.selVersion') }}</div>
                <q-select outlined v-model="configSelectedVersion" type="number" dense class="col-4" :options="installedVersions" @update:model-value="setConfigDebouced"/>
                <div class="col-12 text-caption text-grey-8" style="margin-top: -15px;">{{ $t('modules.available.selVersionDescription') }}</div>
            </div>
            <q-item class="row q-pa-none q-pt-sm">
                <q-item-section>
                <q-item-label>{{ $t('modules.available.autoupdates') }}</q-item-label>
                <q-item-label caption>{{ $t('modules.available.autoupdatesDescription') }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                <q-toggle color="primary" v-model="configAutoUpdate" @update:model-value="setConfigDebouced"/>
                </q-item-section>
            </q-item>
            <div class="row q-pt-sm">
                <div class="col text-subtitle1">{{ $t('modules.mhddosProxy.copies') }}</div>
                <q-slider v-model="configCopies" :min="0" :max="64" :step="1" label color="primary" class="col-7 q-pr-md" @update:model-value="setConfigDebouced"/>
                <q-input outlined v-model="configCopies" type="number" dense class="col-2" @update:model-value="setConfigDebouced"/>
                <div class="col-12 text-caption text-grey-8" style="margin-top: -15px;">{{ $t('modules.mhddosProxy.copiesDescription') }}</div>
            </div>
            <div class="row q-pt-sm">
                <div class="col text-subtitle1">{{ $t('modules.mhddosProxy.threads') }}</div>
                <q-slider v-model="configThreads" :min="0" :max="65534" :step="64" label color="primary" class="col-7 q-pr-md" @update:model-value="setConfigDebouced"/>
                <q-input outlined v-model="configThreads" type="number" dense class="col-2" @update:model-value="setConfigDebouced"/>
                <div class="col-12 text-caption text-grey-8" style="margin-top: -15px;">{{ $t('modules.mhddosProxy.threadsDescription') }}</div>
            </div>
            <div class="row q-pt-sm">
                <div class="col text-subtitle1">{{ $t('modules.mhddosProxy.useMyIp') }}</div>
                <q-slider v-model="configUseMyIP" :min="0" :max="100" :step="1" label color="primary" class="col-7 q-pr-md" @update:model-value="setConfigDebouced"/>
                <q-input outlined v-model="configUseMyIP" type="number" dense class="col-2" @update:model-value="setConfigDebouced"/>
                <div class="col-12 text-caption text-grey-8" style="margin-top: -15px;">{{ $t('modules.mhddosProxy.useMyIpDescription') }}</div>
            </div>
            <div class="row q-pt-sm">
                <div class="col-12 text-subtitle1">{{ $t('modules.available.arguments') }}</div>
                <q-input outlined v-model="configExecutableArguments" dense class="col-12" hint="" :prefix="configExecutableArgumentsPrefix" @update:model-value="setConfigDebouced"/>
                <div class="text-caption text-grey-8" style="margin-top: -15px;">{{ $t('modules.available.argumentsDescription') }}</div>
            </div>

            <div class="row text-h5 text-bold q-mt-lg">{{ $t('modules.available.versions.versions') }}</div>
            <q-separator/>
            <VersionsListComponent
                module-name="MHDDOS_PROXY"
                v-model:installed-versions="installedVersions"
                v-model:selected-version="configSelectedVersion"
                @update:selected-version="setConfigDebouced"
            />
        </div>
    </q-page>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { debounce } from 'quasar'
import MenuComponent from './MenuComponent.vue';
import VersionsListComponent from './VersionsListComponent.vue'
import { Config } from 'lib/module/mhddosproxy'

const configSelectedVersion = ref(null as string | null)
const configAutoUpdate = ref(true)
const configCopies = ref(1)
const configThreads = ref(8)
const configUseMyIP = ref(0)
const configExecutableArguments = ref("")
const configExecutableArgumentsPrefix = computed(() => {
    return `--no-updates` + (configUseMyIP.value != 0 ? ` --use-my-ip ${configUseMyIP.value}` : "") + (configCopies.value > 0 ? ` --copies ${configCopies.value}` : "") + (configThreads.value > 0 ? ` --threads ${configThreads.value}` : "")
})

const installedVersions = ref([] as string[])

async function loadConfig() {
    const config = await window.modulesAPI.getConfig<Config>('MHDDOS_PROXY')
    configSelectedVersion.value = config.selectedVersion || null
    configAutoUpdate.value = config.autoUpdate
    configCopies.value = Number(config.copies)
    configThreads.value = Number(config.threads)
    configUseMyIP.value = Number(config.useMyIP)
    configExecutableArguments.value = config.executableArguments.join(" ")
}

const setConfigDebouced = debounce(setConfig, 1000)
async function setConfig() {
    const config = {
        selectedVersion: configSelectedVersion.value || undefined,
        autoUpdate: configAutoUpdate.value,
        copies: Number(configCopies.value),
        threads: Number(configThreads.value),
        executableArguments: configExecutableArguments.value.split(" "),
        useMyIP: Number(configUseMyIP.value),
    } as Config

    await window.modulesAPI.setConfig<Config>('MHDDOS_PROXY', config)
}

onMounted(async () => {
    await loadConfig()
})
</script>
