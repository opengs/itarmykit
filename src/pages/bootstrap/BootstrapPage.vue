<template>
    <div class="col fit">
        <div class="row full-width text-center text-h5">Looks like you are first time here :) Let us help you</div>
        <q-stepper
            v-model="step"
            class="row full-width"
            header-nav
            ref="stepper"
            color="primary"
            animated
        >
        <q-step
            :name="1"
            title="Select language"
            icon="settings"
            :done="step > 1"
            :header-nav="step > 1"
        >
            For each ad campaign that you create, you can control how much you're willing to
            spend on clicks and conversions, which networks and geographical locations you want
            your ads to show on, and more.

            <q-stepper-navigation>
            <q-btn @click="() => { step = 2 }" color="primary" label="Continue" />
            </q-stepper-navigation>
        </q-step>

        <q-step
            :name="2"
            title="Create an ad group"
            caption="Optional"
            icon="create_new_folder"
            :done="step > 2"
            :header-nav="step > 2"
        >
            Configure data folder

            <q-stepper-navigation>
            <q-btn @click="() => { step = 3 }" color="primary" label="Continue" />
            <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
            </q-stepper-navigation>
        </q-step>

        <q-step
            :name="3"
            title="Select your setup"
            icon="add_comment"
            :header-nav="step > 3"
        >
            Select your setup

            <q-stepper-navigation>
            <q-btn color="primary" label="Finish" />
            <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
            </q-stepper-navigation>
        </q-step>
        </q-stepper>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const step = ref(1);

</script>