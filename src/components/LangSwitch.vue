<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { loadLocale } from '@/i18n'
import { cn } from '@/lib/cn'

// Capsule language switcher (RU | EN): active language on a white pill
defineProps<{ compact?: boolean }>()

const { locale } = useI18n()
const LANGS = ['ru', 'en'] as const
</script>

<template>
    <div class="inline-flex p-[3px] rounded-full border border-white/25" role="group" aria-label="Language">
        <button
            v-for="lang in LANGS"
            :key="lang"
            type="button"
            @click="loadLocale(lang)"
            :aria-pressed="locale === lang"
            :class="cn(
                'rounded-full uppercase tracking-[0.5px] text-[12px]/[100%] px-3 py-[7px] cursor-pointer transition-colors',
                compact && 'py-1.5',
                locale === lang ? 'bg-white text-[#181818]' : 'text-white/60 hover:text-white',
            )"
        >{{ lang }}</button>
    </div>
</template>
