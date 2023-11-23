<template>
    <q-page padding class="row">
        <div class="col" style="max-width: 300px;">
            <MenuComponent />
        </div>
        <div class="col q-pl-lg">
            <div class="row text-h5 text-bold text-grey-10">DISTRESS</div>
            <q-separator />
            <div class="row col q-pt-sm">
                <div class="col-12 q-pt-xs"><span class="text-subtitle2">Author: <a class="text-primary cursor-pointer" href="https://github.com/Yneth" target="_blank">Yneth</a></span></div>
                <div class="col-12 q-pt-xs"><span class="text-subtitle2">Repository: <a class="text-primary" href="https://github.com/Yneth/distress-releases" target="_blank">https://github.com/Yneth/distress-releases</a></span> </div>
                <div class="col-12 q-pt-xs"><span class="text-subtitle2">Support: <a class="text-primary" href="https://t.me/distress_support" target="_blank">Distress Community</a>, <a class="text-primary" href="https://t.me/+H6PnjkydZX0xNDky" target="_blank">IT Army Chat</a></span> </div>

                
                <div class="col-12 q-pt-xs"><span class="text-subtitle2">Author readme: </span> By default uses proxies of all possible countries.</div>    
            </div>

            <div class="row text-h5 text-bold text-grey-10 q-mt-lg">{{ $t('modules.available.configuration') }}</div>
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
                <div class="col text-subtitle1">{{ $t('modules.distress.concurrency') }}</div>
                <q-slider v-model="configConcurrency" :min="128" :max="65534" :inner-min="128" :step="64" label color="primary" class="col-8 q-pr-md" @update:model-value="setConfigDebouced"/>
                <q-input outlined v-model="configConcurrency" type="number" dense class="col-2" @update:model-value="setConfigDebouced"/>
                <div class="col-12 text-caption text-grey-8" style="margin-top: -15px;">{{ $t('modules.distress.concurrencyDescription') }}</div>
            </div>
            <div class="row q-pt-sm">
                <div class="col text-subtitle1">{{ $t('modules.distress.torConnections') }}</div>
                <q-slider v-model="configTorConnections" :min="0" :max="100" :step="1" label color="primary" class="col-8 q-pr-md" @update:model-value="setConfigDebouced"/>
                <q-input outlined v-model="configTorConnections" type="number" dense class="col-2" @update:model-value="setConfigDebouced"/>
                <div class="col-12 text-caption text-grey-8" style="margin-top: -15px;">{{ $t('modules.distress.torConnectionsDescription') }}</div>
            </div>
            <div class="row q-pt-sm">
                <div class="col text-subtitle1">{{ $t('modules.distress.useMyIp') }}</div>
                <q-slider v-model="configUseMyIP" :min="0" :max="100" :step="1" label color="primary" class="col-8 q-pr-md" @update:model-value="setConfigDebouced"/>
                <q-input outlined v-model="configUseMyIP" type="number" dense class="col-2" @update:model-value="setConfigDebouced"/>
                <div class="col-12 text-caption text-grey-8" style="margin-top: -15px;">{{ $t('modules.distress.useMyIpDescription') }}</div>
            </div>
            <q-item class="row q-pa-none q-pt-sm">
                <q-item-section>
                <q-item-label>{{ $t('modules.distress.udpFlood') }}</q-item-label>
                <q-item-label caption><b>{{ $t('modules.distress.udpFloodDescription') }}</b></q-item-label>
                </q-item-section>
                <q-item-section side top>
                <q-toggle color="primary" v-model="configAllowUdpFlood" @update:model-value="setConfigDebouced"/>
                </q-item-section>
            </q-item>
            <div class="row q-pt-sm">
                <div class="col-12 text-subtitle1">{{ $t('modules.available.arguments') }}</div>
                <q-input outlined v-model="configExecutableArguments" dense class="col-12" hint="" :prefix="configExecutableArgumentsPrefix" @update:model-value="setConfigDebouced"/>
                <q-item-label caption>{{ $t('modules.available.argumentsDescription') }}</q-item-label>
            </div>

            <div class="row text-h5 text-bold text-grey-10 q-mt-lg">{{ $t('modules.available.versions.versions') }}</div>
            <q-separator/>
            <VersionsListComponent
                module-name="DISTRESS"
                v-model:installed-versions="installedVersions"
                v-model:selected-version="configSelectedVersion"
                @update:selected-version="setConfigDebouced"
            />
        </div>
    </q-page>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import MenuComponent from './MenuComponent.vue';
import VersionsListComponent from './VersionsListComponent.vue'
import { debounce, } from 'quasar'
import { Config } from 'lib/module/distress'

const configSelectedVersion = ref(null as string | null)
const configAutoUpdate = ref(true)
const configAllowUdpFlood = ref(true)
const configConcurrency = ref(4096)
const configUseMyIP = ref(0)
const configTorConnections = ref(0)
const configExecutableArguments = ref("")
const configExecutableArgumentsPrefix = computed(() => {
    return `--disable-auto-update --json-logs --concurrency ${configConcurrency.value}` + (configUseMyIP.value != 0 ? ` --use-my-ip ${configUseMyIP.value}` : "") + (configTorConnections.value != 0 ? ` --use-tor ${configTorConnections.value}` : "") + (configAllowUdpFlood.value ? ` --direct-udp-mixed-flood` : "")
})

const installedVersions = ref([] as string[])

async function loadConfig() {
    const config = await window.modulesAPI.getConfig<Config>('DISTRESS')
    configSelectedVersion.value = config.selectedVersion || null
    configAutoUpdate.value = config.autoUpdate
    configAllowUdpFlood.value = config.directUDPFailover
    configConcurrency.value = Number(config.concurrency)
    configUseMyIP.value = Number(config.useMyIP)
    configTorConnections.value = Number(config.useTor)
    configExecutableArguments.value = config.executableArguments.join(" ")
}

const setConfigDebouced = debounce(setConfig, 1000)
async function setConfig() {
    const config = {
        selectedVersion: configSelectedVersion.value || undefined,
        autoUpdate: configAutoUpdate.value,
        concurrency: Number(configConcurrency.value),
        executableArguments: configExecutableArguments.value.split(" "),
        useMyIP: Number(configUseMyIP.value),
        useTor: Number(configTorConnections.value),
        directUDPFailover: configAllowUdpFlood.value,
    } as Config

    await window.modulesAPI.setConfig<Config>('DISTRESS', config)
}

onMounted(async () => {
    await loadConfig()
})
</script>