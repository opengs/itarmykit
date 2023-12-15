<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n';

const i18n = useI18n()
const $q = useQuasar()

async function applySettings() {
  const settings = await window.settingsAPI.get()
  i18n.locale.value = settings.system.language
  $q.dark.set(settings.gui.darkMode)
}

onMounted(async () => {
  await applySettings()
})

</script>
