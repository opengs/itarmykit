<template>
    <q-select
      v-model="language"
      outlined
      :options="languages"
      :option-value="opt => opt.symbol"
      :option-label="opt => opt.name"
      behavior="menu"
      @update:model-value="onLanguageSelected"
    >
      <template v-slot:option="scope">
        <q-item class="menu-item" v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label v-text="scope.opt.name" />
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-dialog v-model="showThatRussiaIsTerroistCountry" persistent>
      <PeopleAreLikeShipsComponent @closed="showThatRussiaIsTerroistCountry = false"/>
    </q-dialog>
</template>

<script lang="ts" setup>
import PeopleAreLikeShipsComponent from '../top/achivements/PeopleAreLikeShipsComponent.vue'

import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

interface Language {
  name: string
  symbol: string
}

const languages: Language[] = [
  {
    name: 'Українська',
    symbol: 'ua-UA'
  },
  {
    name: 'English',
    symbol: 'en-US'
  },
  {
    name: "Московский",
    symbol: 'ru-RU'
  }
]

const language = ref(languages[0])
const showThatRussiaIsTerroistCountry = ref(false)

async function onLanguageSelected(lang: Language) { 
  if (lang.name === "Московский") {
    showThatRussiaIsTerroistCountry.value = true
    await loadSavedLanguage()
    return
  }

  i18n.locale.value = language.value.symbol
  await window.settingsAPI.system.setLanguage(language.value.symbol as unknown as "en-US")
}

async function loadSavedLanguage() {
    const settings = await window.settingsAPI.get()
    language.value = languages.find(l => l.symbol === settings.system.language) || languages[0]
}

onMounted(async () => {
    await loadSavedLanguage()
})

</script>