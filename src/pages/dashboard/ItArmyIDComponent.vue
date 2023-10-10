<template>
    <q-card flat bordered class="row q-pa-sm  bg-transparent">
        <div class="col bg-yellow-7" style="max-width: 62px; height: 62px;"> <q-icon name="fa-solid fa-user" size="32px" class="q-pt-md q-pl-md"></q-icon></div>
        <div class="col q-pl-md q-pt-md">
            <div class="text-caption text-uppercase text-bold text-grey">IT Army ID</div>
            <div class="text-subtitle1 text-bold">{{ uuid }}</div>
        </div>
    </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const uuid = ref('NOT CONFIGURED')

async function loadId() {
    const settings = await window.settingsAPI.get()
    if (settings.itarmy.uuid != '') {
        uuid.value = settings.itarmy.uuid
        uuid.value = uuid.value.substr(0, 1) + '...' + uuid.value.substr(uuid.value.length - 3, uuid.value.length)
    }
}

onMounted(async () => {
    await loadId()
})

</script>