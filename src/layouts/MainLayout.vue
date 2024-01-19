<template>
  <MatrixCanvas />
  <q-layout view="lHh Lpr lFf" class="">
    <q-header
      bordered
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white text-black'"
    >
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

        <q-toolbar-title class="text-right q-pr-xl text-subtitle2">
          <ShortStatisticsComponent />
        </q-toolbar-title>

        <div>
          v{{ version }}
          <!--
          <q-btn flat class="q-pa-sm q-ma-xs" @click="showMurkaDialog = true">
            <q-avatar
              style="outline: 2px solid #555"
              class="cursor-pointer"
              square
            >
              <img src="./snowEffect/murka_the_cat.jpg" />
            </q-avatar>
            <q-tooltip> Slamy's (developer) cat </q-tooltip>
          </q-btn>
          -->

          <q-dialog v-model="showMurkaDialog">
            <MurkaDialog />
          </q-dialog>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="">
      <q-list>
        <q-item-label
          header
          :class="
            'text-center text-bold text-uppercase text-h4 q-mt-md q-mb-md' +
            ($q.dark.isActive ? ' text-grey-1 ' : ' text-grey-9 ')
          "
        >
          IT Army Kit
          <!--🎅-->
        </q-item-label>

        <div class="row" style="border-top: solid 1px #aaa">
          <div
            v-for="page of pages"
            :key="page.name"
            class="row fit"
            @click="goToPage(page.page)"
          >
            <div
              class="col bg-yellow-7"
              style="
                max-width: 6px;
                border-bottom: solid 1px #aaa;
                border-right: solid 1px #aaa;
              "
              v-if="($route.name as string).startsWith(page.name)"
            ></div>
            <div
              :class="'col text-subtitle1 text-bold q-pl-md selectable_menu ' + (($route.name as string).startsWith(page.name) ? ($q.dark.isActive ? 'bg-black':'bg-grey-4'):'')"
              style="border-bottom: solid 1px #aaa"
            >
              <q-icon size="xs" :name="page.icon" class="q-mr-xs"></q-icon>
              {{ $t(page.title) }}
            </div>
          </div>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <!-- <SnowEffectComponent /> -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { version } from "../../package.json";

const router = useRouter();

import MatrixCanvas from "./MatrixCanvas.vue";
import SnowEffectComponent from "./snowEffect/SnowEffectComponent.vue";
import MurkaDialog from "./snowEffect/MurkaDialog.vue";

import ShortStatisticsComponent from "./ShortStatisticsComponent.vue";

const pages = [
  {
    name: "dashboard",
    title: "layout.dashboard",
    page: "dashboard",
    icon: "dashboard",
  },
  {
    name: "modules",
    title: "layout.modules",
    page: "modules_active",
    icon: "fa-solid fa-layer-group",
  },
  {
    name: "activeness",
    title: "layout.activeness",
    page: "activeness",
    icon: "fa-solid fa-globe",
  },
  {
    name: "settings",
    title: "layout.settings",
    page: "settings",
    icon: "settings",
  },
  { name: "top", title: "layout.top", page: "top", icon: "leaderboard" },
  {
    name: "developers",
    title: "layout.developers",
    page: "developers",
    icon: "person",
  },
] as Array<{
  name: string;
  title: string;
  page: string;
  icon: string;
}>;

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function goToPage(page: string) {
  await router.push({ name: page });
}

const showMurkaDialog = ref(false);
</script>

<style lang="scss" scoped>
.selectable_menu:hover {
  background-color: #ddd;
  cursor: pointer;
}
</style>
