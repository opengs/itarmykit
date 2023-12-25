<template>
  <q-card flat>
    <q-card-section>
      <q-img src="./murka_the_cat.jpg"></q-img>
    </q-card-section>
    <q-card-section> Merry Christmas and Happy New Year! </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import MeaowSound from "./cat_meaow.mp3";

onMounted(() => {
  const audio = new Audio(MeaowSound);
  audio.play();
});
</script>
