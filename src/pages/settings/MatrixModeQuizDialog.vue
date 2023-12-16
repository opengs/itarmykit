<template>
    <q-card flat style="min-width: 500px;">
        <q-card-section>
            <div class="text-h5 text-bold text-light-green-13">{{ $t('settings.matrixQuiz.header', {name: itArmyUUID}) }}</div>
            <div class="text-caption text-light-green-13">{{ $t('settings.matrixQuiz.body') }}</div>
        </q-card-section>

        <q-card-section>
            {{ $t('settings.matrixQuiz.q1')  }}
            <q-input
                filled
                v-model="q1Answer"
                ref="input1"
                :rules="[ val => val.toLowerCase() === 'липа' || val.toLowerCase() === 'tilia' || '' ]"
            />
            {{ $t('settings.matrixQuiz.q2')  }}
            <q-input
                filled
                v-model="q2Answer"
                ref="input2"
                :rules="[ val => val.toLowerCase() === 'хуйло' || val.toLowerCase() === 'dick' || '' ]"
            />
            {{ $t('settings.matrixQuiz.q3')  }}
            <q-input
                filled
                v-model="q3Answer"
                ref="input3"
                :rules="[ val => val.toLowerCase() === 'груша' || val.toLowerCase() === 'pear' || '' ]"
            />
        </q-card-section>

        <q-card-actions>
            <div class="row fit">
                <q-btn color="blue-8" class="col-5" @click="emits('onClose')">{{ $t('settings.matrixQuiz.cancell')  }}</q-btn>
                <div class="col-2"></div>
                <q-btn color="red-8" class="col-5" @click="solve">{{ $t('settings.matrixQuiz.submit')  }}</q-btn>
            </div>
        </q-card-actions>
    </q-card>
</template>

<script lang="ts" setup>
import { QInput } from 'quasar';
import { onMounted, ref, defineEmits } from 'vue';

import { useMatrixStore } from 'src/layouts/matrix.store';

const matrixStore = useMatrixStore()

const emits = defineEmits<{
    (_e: 'onClose'): void
}>()

const q1Answer = ref('')
const input1 = ref<QInput>()
const q2Answer = ref('')
const input2 = ref<QInput>()
const q3Answer = ref('')
const input3 = ref<QInput>()


const itArmyUUID = ref('')





async function solve() {
    const valid = await input1.value?.validate() && await input2.value?.validate() && await input3.value?.validate()
    if (!valid) {
        return
    }

    await window.settingsAPI.gui.setMatrixModeUnlocked(true)
    await matrixStore.setEnabled(true)
    emits('onClose')
}




onMounted(async () => {
    const settings = await window.settingsAPI.get()
    itArmyUUID.value = settings.itarmy.uuid
})


</script>