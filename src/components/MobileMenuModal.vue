<script setup lang="ts">
import ContactIcons from './ContactIcons.vue'
import { toRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useBodyScrollLock } from '@/composables/useBodyScrollLock';
import { scrollToContacts } from '@/lib/scrollToContacts';
import ArrowIcon from './icons/ArrowUpRight.vue';
import LangSwitch from './LangSwitch.vue';


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
  }
)

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
    <div v-if="open" class="fixed inset-0 z-[15] h-dvh overflow-auto bg-[#181818] text-white pt-[var(--header-height)] flex flex-col">
        <!-- .container overrides padding utilities, so vertical spacing lives on this wrapper -->
        <div class="flex-1 flex flex-col pt-6 pb-8">
        <div class="container flex-1 flex flex-col w-full">
            <nav :aria-label="t('nav.nav')" class="border-t border-white/12">
                <RouterLink to="/" :class="rowClass" @click="close">{{ t('nav.about') }}<ArrowIcon /></RouterLink>
                <RouterLink to="/artists" :class="rowClass" @click="close">{{ t('nav.artists') }}<ArrowIcon /></RouterLink>
                <RouterLink to="/#events" :class="rowClass" @click="close">{{ t('nav.events') }}<ArrowIcon /></RouterLink>
                <button type="button" :class="[rowClass, 'w-full cursor-pointer']" @click="goToContacts">{{ t('nav.feedback') }}<ArrowIcon /></button>
            </nav>

            <ContactIcons class="mt-7" />

            <LangSwitch class="self-start mt-7" />

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
