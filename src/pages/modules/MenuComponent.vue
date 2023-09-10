<template>
    <q-card flat square class="fit bg-transparent q-pr-md" style="border-right: solid #ccc 1px;">
        <q-card-section>
            <div class="text-overline q-mt-md">Main</div>
            <div :class="'text-subtitle2 q-pl-xs ' + (isPageActive('modules_active') ? 'bg-grey-4' : 'selectable_menu')" style="border-top: solid #ccc 1px; border-bottom: solid #ccc 1px;" @click="goToPage('modules_active')">Active Module</div>

            <div class="text-overline q-mt-md">Available modules</div>
            <div  :class="'text-subtitle2 q-pl-xs ' + (isPageActive('modules_db1000n') ? 'bg-grey-4' : 'selectable_menu')" style="border-top: solid #ccc 1px; border-bottom: solid #ccc 1px;" @click="goToPage('modules_db1000n')">DB1000N</div>
            <div  :class="'text-subtitle2 q-pl-xs ' + (isPageActive('modules_mhddosproxy') ? 'bg-grey-4' : 'selectable_menu')" style="border-bottom: solid #ccc 1px;"  @click="goToPage('modules_mhddosproxy')">MHDDOS PROXY</div>
            <div  :class="'text-subtitle2 q-pl-xs ' + (isPageActive('modules_distress') ? 'bg-grey-4' : 'selectable_menu')" style="border-bottom: solid #ccc 1px;"  @click="goToPage('modules_distress')">DISTRESS</div>
        </q-card-section>
    </q-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

function isPageActive(name: string) {
    return (route.name as string).startsWith(name)
}

function goToPage(name: string) {
    router.push({ name: name })
}

</script>

<style lang="scss" scoped>
.selectable_menu:hover {
  background-color: #dddddd;
  cursor: pointer;
}
</style>