<template>
    <q-page padding>
        <div class="row">
            <div class="col-3 q-pr-xs"><ModuleStatusComponent  /></div>
            <div class="col-3 q-pr-xs q-pl-xs"><BytesSendComponent  /></div>
            <div class="col-3 q-pr-xs q-pl-xs"><UpdateComponent  /></div>
            <div class="col-3 q-pl-xs"><ItArmyIDComponent  /></div>
        </div>
        <q-card class="row q-mt-sm q-pa-md bg-transparent" flat bordered>
            <q-card-section class="text-bold text-h5 q-pa-none q-pl-md">Atack power statistics</q-card-section>
            <BitrateChartComponent class="fit" />
        </q-card>
    </q-page>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import ModuleStatusComponent from './ModuleStatusComponent.vue';
import BytesSendComponent from './BytesSendComponent.vue';
import UpdateComponent from './UpdateComponent.vue';
import ItArmyIDComponent from './ItArmyIDComponent.vue';
import BitrateChartComponent from './BitrateChartComponent.vue';

onMounted(async () => {
})
</script>
