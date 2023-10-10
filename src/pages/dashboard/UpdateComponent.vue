<template>
    <q-card flat bordered class="row q-pa-sm  bg-transparent">
        <div class="col bg-yellow-7" style="max-width: 62px; height: 62px;"> <q-icon name="terminal" size="xl" class="q-pt-sm q-pl-sm"></q-icon></div>
        <div class="col q-pl-md q-pt-md">
            <div class="text-caption text-uppercase text-bold text-grey">Kit Updates</div>
            <div class="text-subtitle1 text-bold"> {{ version }} | LATEST</div>
        </div>
    </q-card>
</template>

<script setup lang="ts">
import { version } from '../../../package.json'
</script>