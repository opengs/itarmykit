<template>
  {{ userName + " | " + selectedModule }} |
  <span
    :class="
      moduleState == 'RUNNING'
        ? 'text-positive'
        : moduleState == 'ERROR'
        ? 'text-negative'
        : ''
    "
    >{{ moduleState }}</span
  >
  | {{ moduleTraffic }} | {{ moduleTotalBytesSend }}
</template>

<script setup lang="ts">
import { ModuleExecutionStatisticsEventData } from "app/lib/module/module";
import { ExecutionLogEntry } from "app/src-electron/handlers/engine";
import { IpcRendererEvent } from "electron/renderer";
import { onBeforeMount, onMounted, onUnmounted, ref } from "vue";

const userName = ref("");
const selectedModule = ref("");
const moduleState = ref("");
const moduleTraffic = ref("");
const moduleTotalBytesSend = ref("");

function humanBytesString(bytes: number, dp = 1) {
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

async function loadInitialState() {
  const executionEngineState = await window.executionEngineAPI.getState();
  selectedModule.value = executionEngineState.moduleToRun || "";
  moduleState.value = executionEngineState.run ? "RUNNING" : "IDLE";

  let bitrate = 0;
  if (executionEngineState.statistics.length > 0) {
    bitrate =
      executionEngineState.statistics[
        executionEngineState.statistics.length - 1
      ].currentSendBitrate;
  }
  moduleTraffic.value = humanBytesString(bitrate) + "/s";

  const response = await window.itArmyAPI.getStats();
  if (response.success) {
    moduleTotalBytesSend.value = humanBytesString(response.data.totalTraffic);
  }
}

function onExecutionLog(_e: IpcRendererEvent, data: ExecutionLogEntry) {
  selectedModule.value = data.moduleName;
  if (data.type === "STARTED") {
    moduleState.value = "RUNNING";
  } else if (data.type === "STOPPED") {
    moduleState.value = "IDLE";
  } else if (data.type === "ERROR") {
    moduleState.value = "ERROR";
  }
}

function onStatisticsUpdate(
  _e: IpcRendererEvent,
  data: ModuleExecutionStatisticsEventData
) {
  moduleTraffic.value = humanBytesString(data.currentSendBitrate) + "/s";
}

async function updateITArmyData() {
  const response = await window.itArmyAPI.getStats();
  if (response.success) {
    moduleTotalBytesSend.value = humanBytesString(response.data.totalTraffic);
    userName.value = response.data.login;
  }
}
let updateStatisticsInterval = null as any;

onMounted(async () => {
  window.executionEngineAPI.listenForStatistics(onStatisticsUpdate);
  window.executionEngineAPI.listenForExecutionLog(onExecutionLog);
  await loadInitialState();
  updateStatisticsInterval = setInterval(updateITArmyData, 5000);
});

onUnmounted(() => {
  window.executionEngineAPI.stopListeningForExecutionLog(onExecutionLog);
  window.executionEngineAPI.stopListeningForStatistics(onStatisticsUpdate);
  if (updateStatisticsInterval) {
    clearInterval(updateStatisticsInterval);
  }
});
</script>
