<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  image: string
  name: string
  role: string
  bio: string
  revealed?: boolean
}>()

const emit = defineEmits<{
  (e: 'open'): void
  (e: 'toggle'): void
  (e: 'close'): void
}>()

const rootRef = ref<HTMLElement | null>(null)

const onOpen = () => emit('open')

// Close the revealed bio when clicking outside the card
function onDocumentClick(e: MouseEvent) {
  if (props.revealed && rootRef.value && !rootRef.value.contains(e.target as Node)) {
    emit('close')
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div ref="rootRef" class="flex flex-col gap-7.5">
    <div @click="onOpen" class="relative group h-105.5 w-full overflow-hidden bg-[#f3f4f1]">
      <img class="absolute inset-0 h-full w-full object-cover" :src="image" :alt="`photo of ${name}`">

      <div :class="['absolute inset-0 flex flex-col bg-[#181818] p-11', revealed ? 'opacity-100' : 'pointer-events-none opacity-0']">
        <p class="text-[14px]/[1.3] font-medium tracking-[-0.42px] text-white/80">{{ bio }}</p>
      </div>
    </div>

    <div class="flex flex-col gap-3 px-5">
      <h3 class="font-body text-[22px]/[100%] font-medium uppercase tracking-[-1.32px]">{{ name }}</h3>
      <p class="text-[16px]/[100%] font-medium tracking-[-0.96px] text-[#18181880]">{{ role }}</p>
    </div>
  </div>
</template>
