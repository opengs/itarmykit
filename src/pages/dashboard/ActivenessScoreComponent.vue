<template>
  <q-card flat bordered class="row q-pa-sm bg-transparent">
    <div
      :class="'col ' + ($q.dark.isActive ? 'bg-grey-9' : 'bg-yellow-7')"
      style="max-width: 62px; height: 62px"
    >
      <q-icon
        name="fa-solid fa-globe"
        size="xl"
        class="q-pt-sm q-pl-sm"
      ></q-icon>
    </div>
    <div class="col q-pl-md q-pt-md">
      <div class="text-caption text-uppercase text-bold text-grey">
        {{ $t("dashboard.activeness.score") }}
      </div>
      <div :class="['text-subtitle1', 'text-bold', scoreColorClass]">{{ score }}</div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';

const score = ref(0);

const scoreColorClass = computed(() => {
  if (score.value > 75) {
    return 'text-green';
  } else if (score.value > 50) {
    return 'text-yellow';
  } else {
    return 'text-red';
  }
});

async function loadActivenessScore() {
  const response = await window.activenessAPI.getMyStats();
  score.value = response.score;
}

onMounted(async () => {
  await loadActivenessScore();
});
</script>
