<template>
    <q-page padding class="row">
        <div class="col" style="max-width: 300px;">
            <MenuComponent />
        </div>
        <div class="col q-pl-lg">
            <div class="row text-h5 text-bold text-grey-10">Death by 1000 needles (DB1000N)</div>
            <q-separator />
            <div class="row col q-pt-sm">
                <div class="col-12 q-pt-xs"><span class="text-subtitle2">Author: <a class="text-primary cursor-pointer" href="https://github.com/arriven" target="_blank">arriven</a></span></div>
                <div class="col-12 q-pt-xs"><span class="text-subtitle2">Repository: <a class="text-primary" href="https://github.com/arriven/db1000n" target="_blank">https://github.com/arriven/db1000n</a></span> </div>
                <div class="col-12 q-pt-xs"><span class="text-subtitle2">Docs and FAQ: <a class="text-primary" href="https://blog.arriven.wtf/db1000n/faq/" target="_blank">https://blog.arriven.wtf/db1000n/faq/</a></span> </div>
                <div class="col-12 q-pt-xs"><span class="text-subtitle2">Support: <a class="text-primary" href="https://t.me/+H6PnjkydZX0xNDky" target="_blank">IT Army Chat</a></span> </div>
                <div class="col-12 q-pt-xs text-subtitle2">
                    Social:
                    <a href="https://www.facebook.com/ddos.attack.separ" target="_blank"><q-icon name="fa-brands fa-facebook" color="primary" /></a>
                    <a href="https://t.me/ddos_separ" target="_blank" class="q-pl-xs"><q-icon name="fa-brands fa-telegram" color="primary" /></a>
                </div>
                <div class="col-12 q-pt-xs"><span class="text-subtitle2">Author readme: </span> The software is provided as is under no guarantee. I will update both the repository and this documentation as I go during following days (date of writing this is 26th of February 2022, third day of Russian invasion into Ukraine).</div>    
            </div>

            <div class="row text-h5 text-bold text-grey-10 q-mt-lg">Configuration</div>
            <q-separator />
            <div class="row q-pt-md">
                <div class="col text-subtitle1">Selected version</div>
                <q-select outlined v-model="configSelectedVersion" type="number" dense class="col-4" :options="installedVersions" @update:model-value="setConfigDebouced" />
                <div class="col-12 text-caption text-grey-8" style="margin-top: -15px;">Version of the module to run</div>
            </div>
            <q-item class="row q-pa-none q-pt-sm">
                <q-item-section>
                <q-item-label>Automatic updates</q-item-label>
                <q-item-label caption>Automatically update module to the newest version</q-item-label>
                </q-item-section>
                <q-item-section side top>
                <q-toggle color="primary" v-model="configAutoUpdate" @update:model-value="setConfigDebouced" />
                </q-item-section>
            </q-item>
            <div class="row q-pt-sm">
                <div class="col text-subtitle1">Scale</div>
                <q-slider v-model="configScale" :min="0.05" :max="10" :inner-min="0.05" :step="0.01" label color="primary" class="col-8 q-pr-md" @update:model-value="setConfigDebouced" />
                <q-input outlined v-model="configScale" type="number" dense class="col-2" @update:model-value="setConfigDebouced" />
                <div class="col-12 text-caption text-grey-8" style="margin-top: -15px;">Used to scale the amount of jobs being launched, effect is similar to launching multiple instances at once</div>
            </div>
            <div class="row q-pt-sm">
                <div class="col text-subtitle1 ">Interval</div>
                <q-slider v-model="configInterval" :min="0" :max="100" :step="5" label color="primary" class="col-8 q-pr-md " @update:model-value="setConfigDebouced"/>
                <q-input outlined v-model="configInterval" type="number" dense class="col-2" @update:model-value="setConfigDebouced" />
                <div class="col-12 text-caption text-grey-8" style="margin-top: -15px;">Minimum interval between job iterations</div>
            </div>
            <q-item class="row q-pa-none q-pt-sm">
                <q-item-section>
                <q-item-label>Enable primitive</q-item-label>
                <q-item-label caption>Set to true if you want to run primitive jobs that are less resource-efficient</q-item-label>
                </q-item-section>
                <q-item-section side top>
                <q-toggle color="primary" v-model="configEnablePrimitive" @update:model-value="setConfigDebouced" />
                </q-item-section>
            </q-item>
            <div class="row q-pt-sm">
                <div class="col-12 text-subtitle1">Proxies list</div>
                <q-input outlined v-model="configProxiesList" dense class="col-12" hint="Address (in filesystem or on internet) to the file with proxies in format 'protocol://ip:port' or 'ip:port'" @update:model-value="setConfigDebouced"/>
            </div>
            <div class="row q-pt-md">
                <div class="col text-subtitle1">Default proxy protocol</div>
                <q-select outlined v-model="configProxiesListProtocol" type="number" dense class="col-4" :options="configProxiesListProtocolOptions" @update:model-value="setConfigDebouced" clearable/>
                <div class="col-12 text-caption text-grey-8" style="margin-top: -15px;">Protocol to use if it not defined in proxy list</div>
            </div>
            <div class="row q-pt-sm">
                <div class="col-12 text-subtitle1">Executable arguments (only for advanced users)</div>
                <q-input outlined v-model="configExecutableArguments" dense class="col-12" hint="Additional executable arguments that will be used when starting binary" :prefix="configExecutableArgumentsPrefix" @update:model-value="setConfigDebouced"/>
            </div>
            

            <div class="row text-h5 text-bold text-grey-10 q-mt-lg">Versions</div>
            <q-separator/>
            <VersionsListComponent
                module-name="DB1000N"
                v-model:installed-versions="installedVersions"
                v-model:selected-version="configSelectedVersion"
                @update:selected-version="setConfigDebouced"
            />
            
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { debounce } from 'quasar'
import MenuComponent from './MenuComponent.vue'
import VersionsListComponent from './VersionsListComponent.vue'
import { Config } from 'lib/module/db1000n'
import { computed, onMounted, ref } from 'vue';

const configSelectedVersion = ref(null as string | null)
const configAutoUpdate = ref(true)
const configScale = ref(1)
const configInterval = ref(0)
const configEnablePrimitive = ref(false)
const configProxiesList = ref("")
const configProxiesListProtocol = ref(null as "socks4" | "socks5" | "http" | null)
const configProxiesListProtocolOptions = ["socks4", "socks5", "http"]
const configExecutableArguments = ref("")
const configExecutableArgumentsPrefix = computed(() => {
    return `--log-format json --scale ${configScale.value} --min-interval ${configInterval.value}ms` + (configEnablePrimitive.value ? ' --enable-primitive' : '') + (configProxiesList.value ? ` --proxylist ${configProxiesList.value}` : '') + (configProxiesListProtocol.value ? ` --default-proxy-proto ${configProxiesListProtocol.value}` : '')
})

const installedVersions = ref([] as string[])

async function loadConfig() {
    const config = await window.modulesAPI.getConfig<Config>('DB1000N')
    configSelectedVersion.value = config.selectedVersion || null
    configAutoUpdate.value = config.autoUpdate
    configScale.value = Number(config.scale)
    configInterval.value = Number(config.minInterval)
    configEnablePrimitive.value = config.enablePrimitive
    configProxiesList.value = config.proxylist
    configProxiesListProtocol.value = config.defaultProxyProto
    configExecutableArguments.value = config.executableArguments.join(" ")
}

const setConfigDebouced = debounce(setConfig, 1000)
async function setConfig() {
    const config = {
        selectedVersion: configSelectedVersion.value || undefined,
        autoUpdate: configAutoUpdate.value,
        scale: Number(configScale.value),
        minInterval: Number(configInterval.value),
        enablePrimitive: configEnablePrimitive.value,
        proxylist: configProxiesList.value,
        defaultProxyProto: configProxiesListProtocol.value,
        executableArguments: configExecutableArguments.value.split(" "),
    } as Config

    await window.modulesAPI.setConfig<Config>('DB1000N', config)
}

onMounted(async () => {
    await loadConfig()
})

</script>
