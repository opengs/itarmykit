<template>
  <q-page padding>
    <div class="text-h4 text-center text-bold q-mb-md">
      {{ $t("top.volunteers") }}
    </div>
    <q-tabs v-model="activeTab" dense>
      <q-tab name="weekly" :label="$t('top.week')" />
      <q-tab name="monthly" :label="$t('top.month')" />
      <q-tab name="activeness" :label="$t('top.activeness')" />
    </q-tabs>

    <q-separator class="q-mb-sm" />

    <q-tab-panels v-model="activeTab" animated class="bg-transparent">
      <q-tab-panel name="weekly" class="bg-transparent">
        <q-table
          class="bg-transparent"
          flat
          dense
          :columns="columns"
          :rows="topWeek"
          hide-pagination
          :pagination="{ rowsPerPage: 100 }"
        />
      </q-tab-panel>
      <q-tab-panel name="monthly" class="bg-transparent">
        <q-table
          class="bg-transparent"
          flat
          dense
          :columns="columns"
          :rows="topMonth"
          hide-pagination
          :pagination="{ rowsPerPage: 100 }"
        />
      </q-tab-panel>
      <q-tab-panel name="activeness" class="bg-transparent">
        <q-table
          class="bg-transparent"
          flat
          dense
          :columns="activenessColumns"
          :rows="activenessTop10"
          hide-pagination
          :pagination="{ rowsPerPage: 100 }"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { UserStat } from "app/lib/activeness/api";
import { QTableColumn, useQuasar } from "quasar";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const $i18n = useI18n();

const activeTab = ref("weekly");

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

const columns = [
  {
    name: "Traffic",
    field: (row) => humanBytesString(row.traffic),
    align: "left",
    label: "Traffic",
    sortable: false,
  },
  {
    name: "Name",
    field: "name",
    align: "left",
    label: "Name",
    sortable: false,
  },
  {
    name: "Servers",
    field: "servers",
    align: "left",
    label: "Servers",
    sortable: false,
  },
] as Array<QTableColumn>;

const topWeek = ref(
  [] as Array<{
    traffic: number;
    name: string;
    servers: number;
  }>
);

const topMonth = ref(
  [] as Array<{
    traffic: number;
    name: string;
    servers: number;
  }>
);

async function loadTop() {
  const weeklyTop = await window.topAPI.getWeeklyTop();
  topWeek.value = [];
  for (const entry of weeklyTop.data.week_stats.items) {
    topWeek.value.push({
      traffic: entry.traffic,
      name: entry.user_name,
      servers: entry.servers_count,
    });
  }
  topMonth.value = [];
  for (const entry of weeklyTop.data.month_stats.items) {
    topMonth.value.push({
      traffic: entry.traffic,
      name: entry.user_name,
      servers: entry.servers_count,
    });
  }
}

const activenessColumns = [
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
    sortable: false,
  },
  {
    name: "acore",
    label: "Score",
    field: "score",
    align: "left",
    sortable: false,
  },
] as Array<QTableColumn>;
const activenessTop10 = ref<UserStat[]>([]);
async function loadActiveness() {
  const stats = await window.activenessAPI.getStats();
  if (stats.status != "ok") {
    $q.notify({
      message: $i18n.t("top.activenessData.notifyLoadFailed", {
        error: JSON.stringify(stats),
      }),
      type: "negative",
      timeout: 5000,
    });
    return;
  }

  console.log(stats);

  activenessTop10.value = stats.top10;
}

onMounted(async () => {
  await loadTop();
  await loadActiveness();
});
</script>
