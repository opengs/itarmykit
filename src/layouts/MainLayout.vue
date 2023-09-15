<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <q-header bordered class="bg-grey-2 text-black">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          color="primary"
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
        </q-toolbar-title>

        <div>v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
    >
      <q-list>
        <q-item-label
          header
          class="text-center text-bold text-uppercase text-h4 q-mt-md q-mb-md text-grey-9"
        >
          IT Army Kit
        </q-item-label>

        <div class="row" style="border-top: solid 1px #aaa;">
          <div v-for="page of pages" :key="page.name" class="row fit" @click="goToPage(page.page)">
            <div class="col bg-yellow-7" style="max-width: 6px;border-bottom: solid 1px #aaa;border-right: solid 1px #aaa;" v-if="($route.name as string).startsWith(page.name)"></div>
            <div :class="'col text-subtitle1 text-bold q-pl-md selectable_menu ' + (($route.name as string).startsWith(page.name) ? 'bg-grey-4':'')" style="border-bottom: solid 1px #aaa;"> <q-icon size="xs" :name="page.icon" class="q-mr-xs"></q-icon> {{ page.title }}</div>
          </div>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()

const pages = [
  { name: 'dashboard', title: 'Dashboard', page: 'dashboard', icon: 'dashboard' },
  { name: 'modules', title: 'DDOS modules', page: 'modules_active', icon: 'fa-solid fa-layer-group' },
  { name: 'settings', title: 'Settings', page: 'settings', icon: 'settings' },
  { name: 'top', title: 'Leaderboard', page: 'top', icon: 'leaderboard' },
  { name: 'developers', title: 'Developers', page: 'developers', icon: 'person' }
] as Array<{
  name: string
  title: string
  page: string
  icon: string
}>

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function goToPage (page: string) {
  await router.push({ name: page })
}

</script>

<style lang="scss" scoped>
.selectable_menu:hover {
  background-color: #ddd;
  cursor: pointer;
}
</style>
