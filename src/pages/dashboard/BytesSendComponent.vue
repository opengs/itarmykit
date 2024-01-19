<template>
  <q-card flat bordered class="row q-pa-sm bg-transparent">
    <div
      :class="'col ' + ($q.dark.isActive ? 'bg-grey-9' : 'bg-yellow-7')"
      style="max-width: 62px; height: 62px"
    >
      <q-icon
        name="fa-solid fa-arrow-up"
        size="32px"
        class="q-pt-md q-pl-md"
      ></q-icon>
    </div>
    <div class="col q-pl-md q-pt-md">
      <div class="text-caption text-uppercase text-bold text-grey">
        {{ $t("dashboard.bytes") }}
        <q-icon name="info" size="20px" style="margin-bottom: 3px"
          ><q-tooltip style="width: 400px">
            {{ $t("dashboard.bytesHint") }}</q-tooltip
          ></q-icon
        >
      </div>
      <div class="text-subtitle1 text-bold">
        {{ humanBytesString(totalBytesSend) }} | {{ humanBytesString(bps) }}/s |
        {{
          totalStatisticsAvailable
            ? `${humanBytesString(totalBytesSendFromAllTools)}`
            : ""
        }}
      </div>
    </div>
  </q-card>
</template>

<script lang="ts" setup>
import {
  ModuleExecutionStartedEventData,
  ModuleExecutionStatisticsEventData,
} from "app/lib/module/module";
import { IpcRendererEvent } from "electron";
import { onMounted, onUnmounted, ref } from "vue";

const totalBytesSend = ref(0);
const bps = ref(0);

function humanBytesString(bytes: number, si = false, dp = 1) {
  const thresh = 1024; // 1024 instead of 1000 to be consistent with other places

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

function onStatisticsUpdate(
  _e: IpcRendererEvent,
  data: ModuleExecutionStatisticsEventData
) {
  totalBytesSend.value += data.bytesSend;
  bps.value = data.currentSendBitrate;
}

async function loadLastStatistics() {
  const state = await window.executionEngineAPI.getState();
  totalBytesSend.value = state.statisticsTotals.totalBytesSent;
  if (state.statistics.length > 0) {
    const lastStatistics = state.statistics[state.statistics.length - 1];
    bps.value = lastStatistics.currentSendBitrate;
  }
}

const totalStatisticsAvailable = ref(false);
const totalBytesSendFromAllTools = ref(0);
async function loadTotalBytesSendFromAllTools() {
  const response = await window.itArmyAPI.getStats();
  if (response.success) {
    totalBytesSendFromAllTools.value = response.data.totalTraffic;
    totalStatisticsAvailable.value = true;
  } else {
    totalStatisticsAvailable.value = false;
  }
}

onMounted(async () => {
  window.executionEngineAPI.listenForStatistics(onStatisticsUpdate);
  await loadLastStatistics();
  await loadTotalBytesSendFromAllTools();
});

onUnmounted(() => {
  window.executionEngineAPI.stopListeningForStatistics(onStatisticsUpdate);
});
</script>
