<template>
    <q-linear-progress stripe size="5px" :value="biohazardActivationMenu" v-if="biohazardActivationMenu > 0.05"/>
    <div class="row q-pt-lg">
        <div class="col-2"></div>
        <q-card class="col-8 bg-transparent" flat>
            <q-card-section class="row">
                <q-btn @click="biohazardClick" class="q-pa-xs col" style="max-width: 135px;">
                    <img src="UCS512.png" width="128" height="128" />
                </q-btn>
                <div class="col q-pl-md">
                    <div class="full-width text-h4  text-bold">#UACyberShield</div>
                    <div class="full-width text-subtitle2">Ми організація що працює від 25 лютого 2022 року - другого для повномаштабного вторгнення московії в Україну. Наша ціль це безпека нашої країни у кіберпросторі. </div>
                    Більше про нас та наші операції: <a href="https://t.me/uashield" target="_blank">https://t.me/uashield</a>
                </div>
            </q-card-section>

            <q-card-section />
            
            <div class="text-h5">Партнери</div>
            <q-separator></q-separator>
            
            <q-card-section class="items-center allign-center">
                <q-btn class="q-pa-sm q-ma-xs" @click="openExternalLink('https://t.me/itarmyofukraine2022')">
                    <q-avatar style="outline: 2px solid #555" class="cursor-pointer" square>
                        <img src="itArmyLogo.jpg">
                    </q-avatar>
                    <q-tooltip>
                        IT Army of Ukraine
                    </q-tooltip>
                </q-btn>
            </q-card-section>

            <div class="text-h5">Контакт</div>
            <q-separator></q-separator>
            <q-card-section>
                <p>1. Питання по застосунку задавайте в першу чергу на чаті ITArmy: <a href="https://t.me/itarmyofukraine2022" target="_blank">https://t.me/itarmyofukraine2022</a>, в крайньому в нас на каналі <a href="https://t.me/uashield" target="_blank">https://t.me/uashield</a>. Якщо ви будете писати до нас на канал, то памятайте що у нас дуже мало сил і може бути так що не відпишемо. Але зазвичай знаходяться люди з комюніті які можуть допомогти.</p>
                <p>2. Технічні проблеми з застосунком - якщо вмієте користуватися Github, то запрошуємо створити issue на репозиторії <a href="https://github.com/opengs/itarmykit" target="_blank">https://github.com/opengs/itarmykit</a>, якщо ні - чат ITArmy</p>
                <p>3. Питання по модулям - скеровуйте до розробників модулів</p>
            </q-card-section>

            <div class="text-h5">Контрибутори</div>
            <q-separator></q-separator>
            
            <q-card-section>
                <q-btn v-for="contributor of contributors" :key="contributor.id" class="q-pa-sm q-ma-xs" round @click="openContributorPage(contributor)">
                    <q-avatar style="outline: 2px solid #555" class="cursor-pointer">
                        <img :src="contributor.avatar_url">
                    </q-avatar>
                    <q-tooltip>
                        {{ contributor.login  }}: {{ contributor.contributions }} contributions
                    </q-tooltip>
                </q-btn>
                <div class="text-subtitle2 text-grey text-center">Допоможи вдосконалювати програму і твоє ім'я автоматично з'явиться у цьому списку. В списку також показані контрибутори до попередньої версії застосунку та деяких модулів.</div>
            </q-card-section>
        </q-card>
        <div class="col-2"></div>
    </div>

</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Contributor } from 'app/src-electron/handlers/developers';

const contributors = ref([] as Contributor[])

async function loadContributors() {
    contributors.value = await window.developersAPI.getContributors()
}


const biohazardActivationMenu = ref(0)
function biohazardClick() {
    biohazardActivationMenu.value += 0.1
    if (biohazardActivationMenu.value >= 1) {
        if (window.location.pathname == "/") { // DEV 
            window.location.pathname = "/hazard/index.html"
        } else {
            window.location.pathname = window.location.pathname.split("index.html")[0] + "hazard/index.html"
        }
    }
}
function openContributorPage(contributor: Contributor) {
    window.open(contributor.html_url, '_blank')
}

function openExternalLink(link: string) {
    window.open(link, '_blank')
}

let hazardTimeout: NodeJS.Timeout | null = null

onMounted(async () => {
    hazardTimeout = setInterval(() => {
        biohazardActivationMenu.value *= 0.8
    }, 300)
    await loadContributors()
    console.log(contributors.value)
})
onUnmounted(() => {
    if (hazardTimeout) {
        clearInterval(hazardTimeout)
    }
})

</script>