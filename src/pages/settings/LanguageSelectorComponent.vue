<template>
    <q-select
      v-model="language"
      color="secondary"
      dense
      rounded
      outlined
      dark
      :options="languages"
      :option-value="opt => opt.symbol"
      :option-label="opt => opt.name"
      options-selected-class="text-yellow"
      bg-color="blue-grey-10"
      behavior="menu"
      @update:model-value="onLanguageSelected"
    >
      <template v-slot:option="scope">
        <q-item class="menu-item" v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label caption v-text="scope.opt.name" />
          </q-item-section>
        </q-item>
      </template>
    </q-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
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
]

const language = ref(languages[0])

async function onLanguageSelected(lang: Language) {
    
}

</script>