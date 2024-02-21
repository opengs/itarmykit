<template>
  <q-spinner size="xl" class="q-ma-xl" v-if="loadingAll" />
  <div v-if="loginRequired && !loadingAll">
    <q-card flat class="q-pa-xl">
      <q-card-section>
        <div class="text-h5 text-center">
          {{ $t("activeness.login.title") }}
        </div>
        <div class="text-subtitle1 text-center">
          {{ $t("activeness.login.info") }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          outlined
          v-model="emailInput"
          :label="$t('activeness.login.email')"
          class="q-mb-sm"
        />
        <q-input
          outlined
          v-model="passwordInput"
          :label="$t('activeness.login.password')"
          type="password"
        />
      </q-card-section>

      <q-card-actions>
        <q-btn
          color="primary"
          class="fit"
          outline
          :label="$t('activeness.login.loginButton')"
          :loading="loginLoading"
          :disable="loginLoading || !emailInput || !passwordInput"
          @click="login"
        />
      </q-card-actions>
    </q-card>
  </div>

  <div v-if="!loginRequired && !loadingAll" class="q-pa-md">
    <div class="row q-mb-sm">
      <div class="col-10"></div>
      <div class="col-2">
        <q-btn class="full-width" icon="logout" outline @click="logout">{{
          $t("activeness.logoutButton")
        }}</q-btn>
      </div>
    </div>
    <q-table
      :title="$t('activeness.tasksTable.title')"
      flat
      bordered
      :columns="columns"
      :rows="tasks"
      row-key="id"
      hide-bottom
      :pagination="{ rowsPerPage: 1000 }"
      style="width: 100%"
      :wrap-cells="true"
      dense
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" style="overflow-wrap: break-word">
          <q-btn
            round
            icon="done"
            color="positive"
            :loading="taskActionLoading"
            :disable="taskActionLoading"
            @click="makeTaskDone(props.row)"
          />
          <q-btn
            round
            icon="delete"
            color="negative"
            class="q-mt-xs"
            :loading="taskActionLoading"
            :disable="taskActionLoading"
            @click="ignoreTask(props.row)"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-link="props">
        <q-td :props="props" style="overflow-wrap: break-word">
          <a
            :href="props.row.link"
            target="_blank"
            rel="noopener noreferrer"
            @click.prevent="openTaskLink(props.row)"
          >
            {{ props.row.link }}
          </a>
        </q-td>
      </template>

      <template v-slot:body-cell-priority="props">
        <q-td :props="props">
          <q-icon
            v-if="props.row.priority"
            name="local_fire_department"
            color="red"
            size="md"
          >
            <q-tooltip>
              {{ $t("activeness.tasksTable.priority") }}
            </q-tooltip>
          </q-icon>
        </q-td>
      </template>
    </q-table>

    <a
      href="https://activeness.social/suggest"
      target="_blank"
      rel="noopener noreferrer"
      ><q-btn
        class="full-width q-mt-md"
        :label="$t('activeness.suggesttarget')"
        outline
    /></a>
  </div>
</template>

<script setup lang="ts">
import { Task } from "../../../lib/activeness/api";
import { computed, onMounted, ref } from "vue";
import { QTableColumn, useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const $i18n = useI18n();

const loadingAll = ref(true);
const loginRequired = ref(true);

async function updateLoginStatus() {
  loadingAll.value = true;
  try {
    loginRequired.value = !(await window.activenessAPI.isLoggedIn());
  } finally {
    loadingAll.value = false;
  }

  if (!loginRequired.value) {
    await loadTasks();
  }
}

const loginLoading = ref(false);
const emailInput = ref("");
const passwordInput = ref("");

async function login() {
  loginLoading.value = true;
  try {
    const success = await window.activenessAPI.login(
      emailInput.value,
      passwordInput.value
    );
    if (!success) {
      $q.notify({
        message: $i18n.t("activeness.login.failed"),
        type: "negative",
        timeout: 5000,
      });
      return;
    }

    await updateLoginStatus();
  } finally {
    loginLoading.value = false;
    passwordInput.value = "";
  }
}

async function logout() {
  await window.activenessAPI.logout();
  await updateLoginStatus();
}

const columns = computed(
  () =>
    [
      {
        name: "priority",
        label: "",
        field: "priority",
        align: "left",
        sortable: false,
      },
      {
        name: "id",
        label: $i18n.t("activeness.tasksTable.id"),
        field: "id",
        align: "left",
        sortable: false,
      },
      {
        name: "what",
        label: $i18n.t("activeness.tasksTable.what"),
        field: "whattodo",
        align: "left",
        sortable: false,
      },
      {
        name: "link",
        label: $i18n.t("activeness.tasksTable.link"),
        field: "link",
        align: "left",
        sortable: false,
      },
      {
        name: "description",
        label: $i18n.t("activeness.tasksTable.description"),
        field: "message",
        align: "left",
        sortable: false,
      },
      {
        name: "actions",
        label: $i18n.t("activeness.tasksTable.actions"),
        field: "actions",
        align: "left",
        sortable: false,
      },
    ] as Array<QTableColumn>
);

const tasks = ref<Array<Task>>([]);
async function loadTasks() {
  const response = await window.activenessAPI.getTasksList();
  if (response.status != "ok") {
    $q.notify({
      message: $i18n.t("activeness.notifyTaskLoadFailed", {
        error: JSON.stringify(response),
      }),
      type: "negative",
      timeout: 5000,
    });
    await updateLoginStatus(); // in casae of log out
    return;
  }
  // Sort bypriority flag
  response.list.sort((a, b) => {
    if (a.priority && !b.priority) {
      return -1;
    }
    if (!a.priority && b.priority) {
      return 1;
    }
    return 0;
  });

  tasks.value = response.list;
}

const taskActionLoading = ref(false);

async function makeTaskDone(task: Task) {
  const response = await window.activenessAPI.makeTaskDone(task.id);
  if (response.status != "ok") {
    $q.notify({
      message: $i18n.t("activeness.notifyFailedToMakeTaskDone", {
        error: JSON.stringify(response),
      }),
      type: "negative",
      timeout: 5000,
    });
    await logout();
    return;
  }
  await loadTasks();
}

async function ignoreTask(task: Task) {
  const response = await window.activenessAPI.ignoreTask(task.id);
  if (response.status != "ok") {
    $q.notify({
      message: $i18n.t("activeness.notifyFailedTOIgnoreTask", {
        error: JSON.stringify(response),
      }),
      type: "negative",
      timeout: 5000,
    });
    await logout();
    return;
  }
  await loadTasks();
}

async function openTaskLink(task: Task) {
  await window.helpersAPI.openURLInBrowser(task.link);
}

onMounted(async () => {
  await updateLoginStatus();
  if (!loginRequired.value) {
    await loadTasks();
  }
});
</script>
