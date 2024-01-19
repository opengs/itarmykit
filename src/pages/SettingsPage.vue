<template>
  <q-page class="">
    <q-card flat class="bg-transparent">
      <q-card-section>
        <div class="text-h6">{{ $t("settings.system") }}</div>
        <q-separator class="q-mt-xs q-mb-xs" />
        <q-item
          class=""
          v-ripple
          clickable
          @click="setSystemAutoUpdate(!systemAutoUpdate)"
        >
          <q-item-section>
            <q-item-label>{{ $t("settings.autoUpdates") }}</q-item-label>
            <q-item-label caption>{{
              $t("settings.autoUpdatesDescription")
            }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-toggle
              color="primary"
              v-model="systemAutoUpdate"
              @update:model-value="setSystemAutoUpdate"
            />
          </q-item-section>
        </q-item>

        <q-item
          class=""
          v-ripple
          clickable
          @click="setSystemAutoStartup(!systemAutoStartup)"
        >
          <q-item-section>
            <q-item-label>{{ $t("settings.autoStartup") }}</q-item-label>
            <q-item-label caption>{{
              $t("settings.autoStartupDescription")
            }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-toggle
              color="primary"
              v-model="systemAutoStartup"
              @update:model-value="setSystemAutoStartup"
            />
          </q-item-section>
        </q-item>

        <q-item
          class=""
          v-ripple
          clickable
          @click="setSystemHideInTray(!systemHideInTray)"
        >
          <q-item-section>
            <q-item-label>{{ $t("settings.hideTray") }}</q-item-label>
            <q-item-label caption>{{
              $t("settings.hideTrayDescription")
            }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-toggle
              color="primary"
              v-model="systemHideInTray"
              @update:model-value="setSystemHideInTray"
            />
          </q-item-section>
        </q-item>

        <div class="q-pt-sm">
          <div class="text-h6">{{ $t("settings.language") }}</div>
          <q-separator class="q-mt-xs q-mb-sm" />
          <LanguageSelectorComponent />
        </div>
      </q-card-section>

      <!-- TODO Schedule -->

      <!-- <q-card-section>
                <div class="text-h5">Schedule</div>
                <q-separator class="q-mt-xs q-mb-xs"/>
                <q-item class="" v-ripple clickable @click="setSystemSheduleEnabled(!systemSheduleEnabled)" disable>
                    <q-item-section>
                        <q-item-label>Enable</q-item-label>
                        <q-item-label caption>Enable or disable sheduler. It changes behaviour of the tool in specified hour (for example during the work you can lower resource usage)</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                        <q-toggle color="primary" v-model="systemSheduleEnabled" @update:model-value="setSystemSheduleEnabled" disable/>
                    </q-item-section>
                </q-item>
                <div class="row fit q-mt-sm">
                    <div class="col-6 q-pr-xs">
                        <q-input outlined v-model="sheduleStartTime" mask="time" :rules="['time']" label="Start time" :disable="!systemSheduleEnabled">
                            <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="sheduleStartTime">
                                    <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                </q-time>
                                </q-popup-proxy>
                            </q-icon>
                            </template>
                        </q-input>
                    </div>

                    <div class="col-6 q-pl-xs">
                        <q-input outlined v-model="sheduleEndTime" mask="time" :rules="['time']" label="End time" :disable="!systemSheduleEnabled">
                            <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="sheduleEndTime">
                                    <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                </q-time>
                                </q-popup-proxy>
                            </q-icon>
                            </template>
                        </q-input>
                    </div>
                </div>
                <q-select outlined v-model="sheduleActivity" type="number" class="" :options="sheduleActivityOptions" @update:model-value="setSheduleActivity" label="Replacing activity" :disable="!systemSheduleEnabled" />
            </q-card-section> -->

      <!-- END TODO -->

      <q-card-section>
        <div class="text-h6">IT Army of Ukraine</div>
        <span
          >{{ $t("settings.idDescription") }}
          <a
            href="https://itarmy.com.ua/statistics/"
            target="_blank"
            rel="noopener noreferrer"
            >https://itarmy.com.ua</a
          >
        </span>
        <q-separator class="q-mt-xs q-mb-sm" />
        <q-input
          outlined
          label="IT Army ID"
          v-model="itArmyUUID"
          @update:model-value="setItArmyUUID"
          debounce="500"
          type="number"
        />
        <q-input
          outlined
          label="IT Army API Key"
          class="q-mt-sm"
          v-model="itArmyAPIKey"
          @update:model-value="setItArmyAPIKey"
          debounce="500"
          type="password"
        />
      </q-card-section>

      <q-card-section>
        <div class="text-h6">{{ $t("settings.look") }}</div>
        <q-separator class="q-mt-xs q-mb-xs" />
        <q-item class="" v-ripple clickable @click="setDarkMode(!guiDarkMode)">
          <q-item-section>
            <q-item-label>{{ $t("settings.darkMode") }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-toggle
              color="primary"
              v-model="guiDarkMode"
              @update:model-value="setDarkMode"
            />
          </q-item-section>
        </q-item>

        <q-item
          v-if="matrixModeUnlocked"
          class=""
          v-ripple
          clickable
          @click="setMatrixMode(!guiMatrixMode)"
        >
          <q-item-section>
            <q-item-label>{{ $t("settings.matrixMode") }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-toggle
              color="primary"
              v-model="guiMatrixMode"
              @update:model-value="setMatrixMode"
            />
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">{{ $t("settings.data") }}</div>
        <q-separator class="q-mt-xs q-mb-xs" />
        <div>
          <span class="">{{ $t("settings.dataDescription") }}</span>
          <b>{{ modulesDataFolderPath }}</b>
        </div>
        <q-btn
          outline
          :label="$t('settings.openDataFolder')"
          class="fit q-mt-sm"
          @click="openModulesDataFolder"
        />
        <q-btn
          outline
          :label="$t('settings.changeModulesDataLocation')"
          class="fit q-mt-sm"
          @click="selectFolderForModulesData"
        />
        <q-btn
          outline
          :label="$t('settings.deleteStatistics')"
          color="negative"
          class="fit q-mt-sm"
          @click="deleteStatisticsDialog = true"
        />
        <q-btn
          outline
          :label="$t('settings.deleteModulesCache')"
          color="negative"
          class="fit q-mt-sm"
          @click="deleteModuelsCacheDialog = true"
        />
        <q-btn
          outline
          :label="$t('settings.deleteAllTheData')"
          color="negative"
          class="fit q-mt-sm"
          @click="deleteAllDataDialog = true"
        />
      </q-card-section>
    </q-card>
  </q-page>

  <q-dialog v-model="deleteStatisticsDialog">
    <q-card class="q-pa-md" flat style="border: solid 3px red">
      <q-card-section class="text-center text-h5 text-bold">
        {{ $t("settings.warnDelStatistics") }}
      </q-card-section>
      <q-card-actions>
        <q-btn
          label="Delete"
          class="fit"
          color="negative"
          outline
          @click="deleteStatistics"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="deleteModuelsCacheDialog">
    <q-card class="q-pa-md" flat style="border: solid 3px red">
      <q-card-section class="text-center text-h5 text-bold">
        {{ $t("settings.warnDelCache") }}
      </q-card-section>
      <q-card-actions>
        <q-btn
          label="Delete"
          class="fit"
          color="negative"
          outline
          @click="deleteModulesCache"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="deleteAllDataDialog">
    <q-card class="q-pa-md" flat style="border: solid 3px red">
      <q-card-section class="text-center text-h5 text-bold">
        {{ $t("settings.warnDelData") }}
      </q-card-section>
      <q-card-actions>
        <q-btn
          label="Delete"
          class="fit"
          color="negative"
          outline
          @click="deleteAllData"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="matrixModeQuizDialog" persistent>
    <MatrixModeQuizDialog
      @on-close="
        matrixModeQuizDialog = false;
        void loadSettings();
      "
    />
  </q-dialog>
</template>

<script lang="ts" setup>
import { app } from "electron";
import { useQuasar } from "quasar";
import LanguageSelectorComponent from "./settings/LanguageSelectorComponent.vue";

import { onMounted, ref } from "vue";

import { useMatrixStore } from "src/layouts/matrix.store";
import MatrixModeQuizDialog from "./settings/MatrixModeQuizDialog.vue";

const $q = useQuasar();
const matrixStore = useMatrixStore();

const systemAutoUpdate = ref(true);
async function setSystemAutoUpdate(newValue: boolean) {
  await window.settingsAPI.system.setAutoUpdate(newValue);
  systemAutoUpdate.value = newValue;
}

const systemAutoStartup = ref(true);
async function setSystemAutoStartup(newValue: boolean) {
  await window.settingsAPI.system.setStartOnBoot(newValue);
  systemAutoStartup.value = newValue;
}

const systemHideInTray = ref(true);
async function setSystemHideInTray(newValue: boolean) {
  await window.settingsAPI.system.setHideInTray(newValue);
  systemHideInTray.value = newValue;
}

const systemSheduleEnabled = ref(false);
async function setSystemSheduleEnabled(newValue: boolean) {}

const sheduleStartTime = ref("08:00");
const sheduleEndTime = ref("16:00");
const sheduleActivityOptions = ref([
  { label: "Do nothing", value: "DO_NOTHING" },
  { label: "Minimal resource usage", value: "MINIMAL_USAGE" },
]);
const sheduleActivity = ref("DO_NOTHING");
async function setSheduleActivity() {}

const modulesDataFolderPath = ref("");
async function selectFolderForModulesData() {
  await window.settingsAPI.modules.promptForDataPath();
  await loadSettings();
}
async function openModulesDataFolder() {
  await window.settingsAPI.modules.openDataFolder();
}

const itArmyUUID = ref("");
async function setItArmyUUID(newValue: string | number | null) {
  await window.settingsAPI.itarmy.setUUID(String(newValue));
}

const itArmyAPIKey = ref("");
async function setItArmyAPIKey(newValue: string | number | null) {
  await window.settingsAPI.itarmy.setAPIKey(String(newValue));
}

const deleteStatisticsDialog = ref(false);
async function deleteStatistics() {
  await window.executionEngineAPI.deleteStatistics();
  deleteStatisticsDialog.value = false;
}

const deleteModuelsCacheDialog = ref(false);
async function deleteModulesCache() {
  await window.settingsAPI.modules.deleteData();
}

const deleteAllDataDialog = ref(false);
async function deleteAllData() {
  await window.settingsAPI.deleteData();
}

const guiDarkMode = ref(false);
async function setDarkMode(newValue: boolean) {
  await window.settingsAPI.gui.setDarkMode(newValue);
  guiDarkMode.value = newValue;
  $q.dark.set(newValue);

  if (itArmyUUID && newValue && !matrixModeUnlocked.value) {
    matrixModeQuizDialog.value = true;
  }
}

const guiMatrixMode = ref(false);
async function setMatrixMode(newValue: boolean) {
  matrixStore.setEnabled(newValue);
  guiMatrixMode.value = newValue;
}

const matrixModeUnlocked = ref(false);
const matrixModeQuizDialog = ref(false);

async function loadSettings() {
  const settings = await window.settingsAPI.get();
  systemAutoUpdate.value = settings.system.autoUpdate;
  systemAutoStartup.value = settings.system.startOnBoot;
  systemHideInTray.value = settings.system.hideInTray;
  systemSheduleEnabled.value = settings.schedule.enabled;
  sheduleStartTime.value = settings.schedule.startTime;
  sheduleEndTime.value = settings.schedule.endTime;
  sheduleActivity.value = settings.schedule.activity;
  modulesDataFolderPath.value = settings.modules.dataPath;
  itArmyUUID.value = settings.itarmy.uuid;
  itArmyAPIKey.value = settings.itarmy.apiKey;
  guiDarkMode.value = settings.gui.darkMode;
  guiMatrixMode.value = settings.gui.matrixMode;
  matrixModeUnlocked.value = settings.gui.matrixModeUnlocked;
}

onMounted(async () => {
  await loadSettings();
});
</script>
