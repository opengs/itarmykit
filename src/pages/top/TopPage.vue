<template>
    <q-page padding>
        <div class="text-h4 text-center text-bold q-mb-md">TOP USERS</div>
        <q-tabs
            v-model="activeTab"
            dense
        >
            <q-tab name="weekly" label="This week" />
            <q-tab name="monthly" label="This month" />
        </q-tabs>

        <q-separator class="q-mb-sm"/>

        <q-tab-panels v-model="activeTab" animated class="bg-transparent">
            <q-tab-panel name="weekly" class="bg-transparent">
                <q-table
                    class="bg-transparent"
                    flat
                    
                    dense
                    :columns="columns"
                    :rows="topWeek"
                    hide-pagination
                    :pagination="{rowsPerPage: 100}"
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
                    :pagination="{rowsPerPage: 100}"
                />
            </q-tab-panel>
        </q-tab-panels>

    </q-page>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar';
import { ref, onMounted } from 'vue'

const activeTab = ref('weekly')

function humanBytesString(bytes: number, dp=1) {
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

const columns = [
    {'name': "Traffic", 'field': (row) => humanBytesString(row.traffic), 'align': "left", 'label': "Traffic", 'sortable': false},
    {'name': "Name", 'field': "name", 'align': "left", 'label': "Name", 'sortable': false},
    {'name': "Servers", 'field': "servers", 'align': "left", 'label': "Servers", 'sortable': false}
] as Array<QTableColumn>

const topWeek = ref([] as Array<{
    traffic: number
    name: string
    servers: number
}>)

const topMonth = ref([] as Array<{
    traffic: number
    name: string
    servers: number
}>)

async function loadTop() {
    const weeklyTop = await window.topAPI.getWeeklyTop()
    topWeek.value = []
    for (const entry of weeklyTop.data.week_stats.items) {
        topWeek.value.push({
            traffic: entry.traffic,
            name: entry.user_name,
            servers: entry.servers_count
        })
    }
    topMonth.value = []
    for (const entry of weeklyTop.data.month_stats.items) {
        topMonth.value.push({
            traffic: entry.traffic,
            name: entry.user_name,
            servers: entry.servers_count
        })
    }
}

onMounted(async () => {
    await loadTop()
})

</script>