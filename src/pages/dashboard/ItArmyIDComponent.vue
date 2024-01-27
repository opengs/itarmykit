<template>
  <q-card flat bordered class="row q-pa-sm bg-transparent">
    <div
      :class="'col ' + ($q.dark.isActive ? 'bg-grey-9' : 'bg-yellow-7')"
      style="max-width: 62px; height: 62px"
    >
      <q-icon
        name="fa-solid fa-user"
        size="32px"
        class="q-pt-md q-pl-md"
      ></q-icon>
    </div>
    <div class="col q-pl-md q-pt-md">
      <div class="text-caption text-uppercase text-bold text-grey">
        IT Army ({{ configDetails }})

        <q-icon
          name="info"
          size="20px"
          style="margin-bottom: 2px"
          color="negative"
          v-if="ITArmyNameLoadError != ''"
          ><q-tooltip> {{ ITArmyNameLoadError }} </q-tooltip></q-icon
        >

        <q-icon
          name="info"
          size="20px"
          style="margin-bottom: 2px"
          color="info"
          v-if="ITArmyAPIKeyEmpty"
          ><q-tooltip>
            {{ $t("dashboard.itarmyAPIKeyEmpty") }}
          </q-tooltip></q-icon
        >
      </div>
      <div class="text-subtitle1 text-bold">{{ name }} {{ uuid }}</div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const configDetails = ref("ID + API KEY");
const name = ref("");
const uuid = ref("NOT CONFIGURED");

const ITArmyNameLoadError = ref("");
const ITArmyAPIKeyEmpty = ref(false);

async function loadItArmyName() {
  const response = await window.itArmyAPI.getStats();
  if (response.success) {
    name.value = response.data.login;
    ITArmyAPIKeyEmpty.value = false;
    ITArmyNameLoadError.value = "";
  } else {
    if (response.error === "EMPTY_API_KEY") {
      ITArmyAPIKeyEmpty.value = true;
      ITArmyNameLoadError.value = "";
    } else {
      ITArmyAPIKeyEmpty.value = false;
      ITArmyNameLoadError.value = JSON.stringify(response);
    }
  }
}

async function loadId() {
  const settings = await window.settingsAPI.get();
  if (settings.itarmy.uuid != "") {
    uuid.value = settings.itarmy.uuid;
    uuid.value =
      uuid.value.substr(0, 1) +
      "..." +
      uuid.value.substr(uuid.value.length - 3, uuid.value.length);
  }

  if (settings.itarmy.uuid != "" && settings.itarmy.apiKey != "") {
    configDetails.value = "ID + API KEY";
  } else if (settings.itarmy.uuid != "") {
    configDetails.value = "ID";
  } else if (settings.itarmy.apiKey != "") {
    configDetails.value = "API KEY";
  } else {
    configDetails.value = "NOT CONFIGURED";
  }
}

onMounted(async () => {
  await loadId();
  await loadItArmyName();
});
</script>
