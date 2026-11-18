<script setup lang="ts">
import { normalizeClass, useAttrs } from 'vue'
import { cn } from '@/lib/cn'

defineProps<{
  link?: boolean
}>()

const attrs = useAttrs()
</script>

<template>
  <component
    :is="link ? 'a' : 'button'"
    v-bind="attrs"
    :class="cn('p-5.5 flex justify-center items-center border border-[#181818] bg-transparent text-[14px]/[100%] font-medium uppercase cursor-pointer', normalizeClass(attrs.class))"
  >
    <slot />
  </component>
</template>
