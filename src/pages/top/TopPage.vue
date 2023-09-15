<template>
    <q-page padding>
        <div class="text-h4 text-center text-bold q-mb-md">TOP USERS</div>
        <q-table
        flat
        bordered
            dense
            :columns="columns"
            :rows="top"
            hide-pagination
            :pagination="{rowsPerPage: 100}"
        ></q-table>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
]

const top = ref([] as Array<{
    traffic: number
    name: string
    servers: number
}>)

async function loadTop() {
    const weeklyTop = await window.topAPI.getWeeklyTop()
    console.log(weeklyTop)
    console.log(weeklyTop.data.items)
    top.value = []
    for (const entry of weeklyTop.data.items) {
        top.value.push({
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