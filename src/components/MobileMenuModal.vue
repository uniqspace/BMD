<script setup lang="ts">
import { toRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useBodyScrollLock } from '@/composables/useBodyScrollLock';
import { scrollToContacts } from '@/lib/scrollToContacts';
import ArrowIcon from './icons/ArrowUpRight.vue';


const { t } = useI18n()
const route = useRoute()

const props = defineProps<{
  open: boolean
}>()

useBodyScrollLock(toRef(props, 'open'))

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'update:close', value: boolean): void
}>()

watch(
  () => route.fullPath,
  () => {
    emit('update:close', false)
    document.body.style.overflow = "none"
  }
)

const INSTAGRAM = 'https://www.instagram.com/sht.product'
const PHONE = { href: 'tel:+998992226632', label: '+998 99 222 66 32' }
const rowClass = 'flex justify-between items-center py-5 border-b border-white/12 text-[17px]/[100%] uppercase'

// Links to the current page don't change the route, so close the menu explicitly
function close() {
  emit('update:close', false)
}

function openBooking() {
  emit('update:close', false)
  emit('update:open', true)
}

// Close the menu first (releases the scroll lock), then scroll to the footer contacts
function goToContacts() {
  emit('update:close', false)
  setTimeout(scrollToContacts, 50)
}
</script>

<template>
    <div v-if="open" class="fixed inset-0 z-10 h-dvh overflow-auto bg-[#181818] text-white pt-[var(--header-height)] flex flex-col">
        <!-- .container overrides padding utilities, so vertical spacing lives on this wrapper -->
        <div class="flex-1 flex flex-col pt-6 pb-8">
        <div class="container flex-1 flex flex-col w-full">
            <nav :aria-label="t('nav.nav')" class="border-t border-white/12">
                <RouterLink to="/" :class="rowClass" @click="close">{{ t('nav.about') }}<ArrowIcon /></RouterLink>
                <RouterLink to="/artists" :class="rowClass" @click="close">{{ t('nav.artists') }}<ArrowIcon /></RouterLink>
                <RouterLink to="/#events" :class="rowClass" @click="close">{{ t('nav.events') }}<ArrowIcon /></RouterLink>
                <button type="button" :class="[rowClass, 'w-full cursor-pointer']" @click="goToContacts">{{ t('nav.feedback') }}<ArrowIcon /></button>
            </nav>

            <div class="flex gap-3 mt-7">
                <a :href="PHONE.href" :aria-label="PHONE.label" class="size-13 rounded-full border border-white/25 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/></svg>
                </a>
                <a :href="INSTAGRAM" target="_blank" rel="noopener" aria-label="Instagram" class="size-13 rounded-full border border-white/25 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/></svg>
                </a>
            </div>
            <a :href="PHONE.href" class="self-start mt-4 text-[15px]/[100%]">{{ PHONE.label }}</a>

            <button
                type="button"
                @click="openBooking"
                class="mt-auto pt-10 w-full"
            >
                <span class="block w-full bg-white text-[#181818] py-5 text-[13px]/[100%] font-semibold uppercase cursor-pointer">{{ t('nav.book') }}</span>
            </button>
        </div>
        </div>
    </div>
</template>
