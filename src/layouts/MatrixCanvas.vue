<template>
    <canvas v-if="matrixStore._enabled" ref="canvas" width="1000" height="2000" style="position: fixed; overflow: hidden;" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar';
import { useMatrixStore } from './matrix.store'


const $q = useQuasar()
const matrixStore = useMatrixStore()

const canvas = ref<HTMLCanvasElement>()

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const zeroone = '01';

//const alphabet = katakana + latin + nums;
const alphabet = zeroone;


const fontSize = 16;
let columns = window.innerWidth/fontSize;

const rainDrops = [] as Array<number>;

watch([matrixStore.$state], () => {
	setTimeout(() => {
		resize()
	}, 100)
}, {deep: true})

function draw() {
	if (!matrixStore._enabled) return;

    const context = canvas?.value?.getContext('2d');
	
	if (!context) return;
    if (!canvas.value) return;

	if ($q.dark.isActive) {
		context.fillStyle = 'rgba(27, 27, 27, 0.1)';
	} else {
		context.fillStyle = 'rgba(255, 255, 255, 0.1)';
	}
	context.fillRect(0, 0, canvas.value.width, canvas.value.height);
	
	context.fillStyle = '#0F05';
	context.font = fontSize + 'px monospace';

	for(let i = 0; i < rainDrops.length; i++)
	{
		const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
		context.fillText(text, i*fontSize, rainDrops[i]*fontSize);
		
		if(rainDrops[i]*fontSize > canvas.value.height && Math.random() > 0.9){
			rainDrops[i] = 0;
        }
		rainDrops[i]++;
	}
};

let interval: NodeJS.Timeout | null =  null

function resize() {
	if (!canvas.value) return;
	canvas.value.width = window.innerWidth - 20;
	canvas.value.height = window.innerHeight;
	columns = window.innerWidth/fontSize;
	for( let x = 0; x < columns; x++ ) {
		rainDrops[x] = Math.round(Math.random() * canvas.value.height/fontSize);
	}
}

onMounted(async () => {
	await matrixStore.load()
	
	resize()
	window.addEventListener("resize", resize);
	interval = setInterval(draw, 33);
})

onUnmounted(() => {
	window.removeEventListener("resize", resize);
	if (interval) clearInterval(interval)
})

</script>