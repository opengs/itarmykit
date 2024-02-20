<template>
  <q-linear-progress
    stripe
    size="5px"
    :value="biohazardActivationMenu"
    v-if="biohazardActivationMenu > 0.05"
  />
  <div class="row q-pt-lg">
    <div class="col-2"></div>
    <q-card class="col-8 bg-transparent" flat>
      <q-card-section class="row">
        <q-btn
          @click="biohazardClick"
          class="q-pa-xs col"
          style="max-width: 135px"
        >
          <img src="UCS512.png" width="128" height="128" />
        </q-btn>
        <div class="col q-pl-md">
          <div class="full-width text-h4 text-bold">#UACyberShield</div>
          <div class="full-width text-subtitle2">
            {{ $t("developers.shieldSubtitle") }}
          </div>
          <a href="https://t.me/uashield" target="_blank"
            >https://t.me/uashield</a
          >
        </div>
      </q-card-section>

      <q-card-section />

      <div class="text-h5">{{ $t("developers.partners") }}</div>
      <q-separator></q-separator>

      <q-card-section class="items-center allign-center">
        <q-btn
          class="q-pa-sm q-ma-xs"
          @click="openExternalLink('https://t.me/itarmyofukraine2022')"
        >
          <q-avatar
            style="outline: 2px solid #555"
            class="cursor-pointer"
            square
          >
            <img src="itArmyLogo.jpg" />
          </q-avatar>
          <q-tooltip> IT Army of Ukraine </q-tooltip>
        </q-btn>

        <q-btn class="q-pa-sm q-ma-xs" @click="showMurka()">
          <q-avatar
            style="outline: 2px solid #555"
            class="cursor-pointer"
            square
          >
            <img src="../../layouts/snowEffect/murka_the_cat.jpg" />
          </q-avatar>
          <q-tooltip> Slamy's (developer) cat </q-tooltip>
        </q-btn>

        <q-btn
          class="q-pa-sm q-ma-xs"
          @click="openExternalLink('https://t.me/+63wu1QC3KM04ZTJi')"
        >
          <q-avatar
            style="outline: 2px solid #555"
            class="cursor-pointer"
            square
          >
            <img src="./kiberkozak.png" />
          </q-avatar>
          <q-tooltip>Кіберкозаки</q-tooltip>
        </q-btn>

        <q-btn
          class="q-pa-sm q-ma-xs"
          @click="openExternalLink('https://t.me/+U1y6GhTcu701YWVi')"
        >
          <q-avatar
            style="outline: 2px solid #555"
            class="cursor-pointer"
            square
          >
            <img src="./kiberpalanica1.jpg" />
          </q-avatar>
          <q-tooltip
            >КіберПаляниця. Працює з перших днів повномасштабного вторгнення,
            Кожен день - це нова битва</q-tooltip
          >
        </q-btn>

        <q-btn
          class="q-pa-sm q-ma-xs"
          @click="openExternalLink('https://cyberarmy.com.ua/')"
        >
          <q-avatar
            style="outline: 2px solid #555"
            class="cursor-pointer"
            square
          >
            <img src="./kiberpalanica2.jpg" />
          </q-avatar>
          <q-tooltip>КіберПаляниця Wiki</q-tooltip>
        </q-btn>

        <q-btn
          class="q-pa-sm q-ma-xs"
          @click="openExternalLink('https://t.me/studentcyberarmy')"
        >
          <q-avatar
            style="outline: 2px solid #555"
            class="cursor-pointer"
            square
          >
            <img src="./SKKO.jpg" />
          </q-avatar>
          <q-tooltip>СККО</q-tooltip>
        </q-btn>
      </q-card-section>

      <div class="text-h5">{{ $t("developers.contacts") }}</div>
      <q-separator></q-separator>
      <q-card-section>
        <p>
          1. {{ $t("developers.contactP1") }}
          <a href="https://t.me/itarmyofukraine2022" target="_blank"
            >https://t.me/itarmyofukraine2022</a
          >, {{ $t("developers.contactP1_1") }}
          <a href="https://t.me/uashield" target="_blank"
            >https://t.me/uashield</a
          >. {{ $t("developers.contactP1_2") }}
        </p>
        <p>
          2. {{ $t("developers.contactP2") }}
          <a href="https://github.com/opengs/itarmykit" target="_blank"
            >https://github.com/opengs/itarmykit</a
          >, {{ $t("developers.contactP2_1") }}
        </p>
        <p>3. {{ $t("developers.contactP3") }}</p>
      </q-card-section>

      <div class="text-h5">{{ $t("developers.contributors") }}</div>
      <q-separator></q-separator>

      <q-card-section>
        <q-btn
          v-for="contributor of contributors"
          :key="contributor.id"
          class="q-pa-sm q-ma-xs"
          round
          @click="openContributorPage(contributor)"
        >
          <q-avatar style="outline: 2px solid #555" class="cursor-pointer">
            <img :src="contributor.avatar_url" />
          </q-avatar>
          <q-tooltip>
            {{ contributor.login }}:
            {{ contributor.contributions }} contributions
          </q-tooltip>
        </q-btn>
        <div class="text-subtitle2 text-grey text-center">
          {{ $t("developers.contributorsSubtitle") }}
        </div>
      </q-card-section>
    </q-card>
    <div class="col-2"></div>

    <q-dialog v-model="showMurkaDialog">
      <q-img src="../../layouts/snowEffect/murka_the_cat.jpg"></q-img>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

import MeaovSound from "../../layouts/snowEffect/cat_meaow.mp3";

import { Contributor } from "app/src-electron/handlers/developers";

const contributors = ref([] as Contributor[]);

async function loadContributors() {
  contributors.value = await window.developersAPI.getContributors();
}

const biohazardActivationMenu = ref(0);
function biohazardClick() {
  biohazardActivationMenu.value += 0.1;
  if (biohazardActivationMenu.value >= 1) {
    if (window.location.pathname == "/") {
      // DEV
      window.location.pathname = "/hazard/index.html";
    } else {
      window.location.pathname =
        window.location.pathname.split("index.html")[0] + "hazard/index.html";
    }
  }
}
function openContributorPage(contributor: Contributor) {
  window.open(contributor.html_url, "_blank");
}

function openExternalLink(link: string) {
  window.open(link, "_blank");
}

let hazardTimeout: NodeJS.Timeout | null = null;

const showMurkaDialog = ref(false);
function showMurka() {
  showMurkaDialog.value = true;
  const audio = new Audio(MeaovSound);
  audio.play();
}

onMounted(async () => {
  hazardTimeout = setInterval(() => {
    biohazardActivationMenu.value *= 0.8;
  }, 300);
  await loadContributors();
  console.log(contributors.value);
});
onUnmounted(() => {
  if (hazardTimeout) {
    clearInterval(hazardTimeout);
  }
});
</script>
