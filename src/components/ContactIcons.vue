<script setup lang="ts">
import { CONTACT_ICONS } from '@/lib/contacts'

// tone="dark": dark circles with white icons, for light backgrounds (desktop footer)
defineProps<{ tone?: 'light' | 'dark' }>()
</script>

<template>
    <!-- 6 equal circles that always fit in one row (shrink on narrow phones, max 56px) -->
    <div class="grid grid-cols-6 gap-2 max-w-[376px]">
        <a
            v-for="item in CONTACT_ICONS"
            :key="item.key"
            :href="item.href"
            :aria-label="item.label"
            v-bind="item.external ? { target: '_blank', rel: 'noopener' } : {}"
            :class="[
                'aspect-square w-full rounded-full flex items-center justify-center transition-colors',
                tone === 'dark' ? 'bg-[#181818] text-white hover:bg-[#181818]/80' : 'bg-white text-[#181818] hover:bg-white/85',
            ]"
        >
            <svg class="size-[45%]" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path :d="item.d" /></svg>
        </a>
    </div>
</template>
