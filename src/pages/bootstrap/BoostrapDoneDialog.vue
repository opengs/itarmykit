<template>
    <q-card>
        <q-card-section>
            <div class="text-h6 text-center">{{ $t('bootstrap.doneDialog.title') }}</div>
            <div class="text-caption text-center">{{ $t('bootstrap.doneDialog.body') }}</div>
        </q-card-section>

        <q-card-actions>
            <q-btn @click="finish" color="primary" :label="$t('bootstrap.doneDialog.finishButton')" class="fit" outline />
        </q-card-actions>
    </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const $router = useRouter();

async function finish() {
    await $router.push({ name: 'dashboard' });
}

</script>