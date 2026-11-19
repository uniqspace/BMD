<script setup lang="ts">
import { CONTACT_ICONS } from '@/lib/contacts'

// tone="soft": light grey circles with dark icons, for light backgrounds (desktop footer)
defineProps<{ tone?: 'light' | 'soft' }>()
</script>

<template>
    <!-- Equal circles that always fit in one row (shrink on narrow phones, max 56px) -->
    <div class="grid grid-cols-4 gap-2 max-w-[248px]">
        <a
            v-for="item in CONTACT_ICONS"
            :key="item.key"
            :href="item.href"
            :aria-label="item.label"
            v-bind="item.external ? { target: '_blank', rel: 'noopener' } : {}"
            :class="[
                'aspect-square w-full rounded-full flex items-center justify-center transition-colors',
                tone === 'soft' ? 'bg-[#ececea] text-[#181818] hover:bg-[#e0e0dc]' : 'bg-white text-[#181818] hover:bg-white/85',
            ]"
        >
            <svg class="size-[45%]" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path :d="item.d" /></svg>
        </a>
    </div>
</template>
