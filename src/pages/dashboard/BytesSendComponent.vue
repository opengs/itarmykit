<template>
    <q-card flat bordered class="row q-pa-sm  bg-transparent">
        <div class="col bg-yellow-7" style="max-width: 62px; height: 62px;"> <q-icon name="fa-solid fa-arrow-up" size="32px" class="q-pt-md q-pl-md"></q-icon></div>
        <div class="col q-pl-md q-pt-md">
            <div class="text-caption text-uppercase text-bold text-grey">{{ $t('dashboard.bytes') }}</div>
            <div class="text-subtitle1 text-bold">{{ humanBytesString(totalBytesSend) }} | {{ humanBytesString(bps) }}/s</div>
        </div>

    </q-card>
</template>

<script lang="ts" setup>
import { ModuleExecutionStartedEventData, ModuleExecutionStatisticsEventData } from 'app/lib/module/module';
import { IpcRendererEvent } from 'electron';
import { onMounted, onUnmounted, ref } from 'vue';


const totalBytesSend = ref(0)
const bps = ref(0)

function humanBytesString(bytes: number, si=false, dp=1) {
  const thresh = 1000;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}

function onStatisticsUpdate(_e: IpcRendererEvent, data: ModuleExecutionStatisticsEventData) {
    totalBytesSend.value += data.bytesSend
    bps.value = data.currentSendBitrate
}

onMounted(() => {
    window.executionEngineAPI.listenForStatistics(onStatisticsUpdate)
})

onUnmounted(() => {
    window.executionEngineAPI.stopListeningForStatistics(onStatisticsUpdate)
})


</script>