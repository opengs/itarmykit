<template>
  <VueApexCharts
    width="100%"
    height="300"
    type="area"
    :options="chartOptions"
    :series="seriesData"
  />
</template>

<script lang="ts" setup>
import { ModuleExecutionEvent } from "app/lib/module/module";
import {
  ModuleExecutionStartedEventData,
  ModuleExecutionStatisticsEventData,
} from "app/lib/module/module";
import { ExecutionLogEntry } from "app/src-electron/handlers/engine";
import { IpcRendererEvent } from "electron";
import { onMounted, onUnmounted, ref, computed } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useQuasar } from "quasar";

const $q = useQuasar();

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

const seriesData = ref([
  {
    data: [] as Array<[number, number]>,
  },
]);

const executionEvents = ref([] as ExecutionLogEntry[]);

const chartOptions = computed(() => {
  return {
    chart: {
      id: "area-datetime",
      type: "area",
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        show: false,
      },
    },
    annotations: {
      xaxis: executionEvents.value.map((e) => {
        return {
          x: e.timestamp,
          yAxisIndex: 0,
          borderColor: "#999",
          label: {
            show: true,
            style: {
              color: "#fff",
              background: "#775DD0",
            },
            text: e.type,
          },
        };
      }),
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: "hollow",
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
        style: {
          colors: $q.dark.isActive ? "#fff" : "#000",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val: number) {
          return humanBytesString(val) + "/s";
        },
        style: {
          colors: $q.dark.isActive ? "#fff" : "#000",
        },
      },
    },
    tooltip: {},
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: $q.dark.isActive ? 0 : 1,
        opacityFrom: 0.7,
        opacityTo: $q.dark.isActive ? 0 : 0.9,
        stops: [0, 100],
      },
    },
    theme: {
      mode: $q.dark.isActive ? "dark" : "modern",
    },
  };
});

async function loadInitialState() {
  const state = await window.executionEngineAPI.getState();
  state.statistics.sort((a, b) => a.timestamp - b.timestamp);
  seriesData.value[0].data = state.statistics.map((s) => [
    s.timestamp,
    Number(s.currentSendBitrate.toFixed()),
  ]);
  // filter entries older than hour ago
  seriesData.value[0].data = seriesData.value[0].data.filter(
    (s) => s[0] > Date.now() - 1000 * 60 * 60
  );

  executionEvents.value = state.executionLog;
}

function onStatisticsUpdate(
  _e: IpcRendererEvent,
  data: ModuleExecutionStatisticsEventData
) {
  seriesData.value[0].data.push([
    Date.now(),
    Number(data.currentSendBitrate.toFixed()),
  ]);
  if (seriesData.value[0].data.length > 100) {
    seriesData.value[0].data.shift();
  }
}

onMounted(async () => {
  await loadInitialState();
  window.executionEngineAPI.listenForStatistics(onStatisticsUpdate);
});

onUnmounted(() => {
  window.executionEngineAPI.stopListeningForStatistics(onStatisticsUpdate);
});
</script>
