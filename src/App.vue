<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n';

const i18n = useI18n()

async function applyLanguage() {
  const settings = await window.settingsAPI.get()
  i18n.locale.value = settings.system.language
}

onMounted(async () => {
  await applyLanguage()
})

</script>
