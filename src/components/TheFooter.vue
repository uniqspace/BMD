<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import BookArtistModal from './BookArtistModal.vue';

const INSTAGRAM = { href: 'https://www.instagram.com/sht.product', label: '@sht.product' }
const PHONE = { href: 'tel:+998992226632', label: '+998 99 222 66 32' }

const isOpenBookModal = ref(false)
const currentYear = new Date().getFullYear();

const { t } = useI18n()

const ARROW_ICON = '<svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 13L13 3M5 3h8v8" stroke="currentColor" stroke-width="1.2"/></svg>'
const mobileRowClass = 'flex justify-between items-center py-4.5 border-b border-white/12 text-[15px]/[100%] uppercase'
const linkClass = 'text-[14px]/[100%] uppercase transition-opacity hover:opacity-60'
// Dark footer on mobile/tablet, light on desktop (lg+)
const titleClass = 'block mb-4 md:mb-5 text-[12px]/[100%] uppercase tracking-[0.5px] text-white/50 lg:text-[#6b6b6b]'
</script>

<template>
    <footer id="contacts" class="bg-[#181818] text-white lg:bg-white lg:text-[#181818] lg:border-t lg:border-[#18181814] pt-15 pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pt-18 md:pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pt-20 lg:pb-10">
        <div class="container">
            <!-- Booking call -->
            <div class="flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-10">
                <h2
                    class="font-heading font-normal max-w-225 text-[32px]/[1.08] tracking-[-1px] md:text-[42px]/[1.05] md:tracking-[-1.6px] lg:text-[52px]/[1.02] lg:tracking-[-2.2px] [&_span]:text-white/45 lg:[&_span]:text-[#18181873]"
                    v-html="t('footer.ctaTitle')"
                />
                <button
                    type="button"
                    @click="isOpenBookModal = true"
                    class="hidden lg:block shrink-0 bg-[#181818] text-white px-8 py-5 text-[13px]/[100%] font-semibold uppercase cursor-pointer transition-opacity hover:opacity-80"
                >
                    {{ t("footer.ctaButton") }}
                </button>
            </div>

            <!-- Mobile: menu as full-width rows, round contact buttons, phone and address -->
            <div class="mt-11 md:hidden">
                <nav :aria-label="t('nav.nav')" class="border-t border-white/12">
                    <RouterLink to="/" :class="mobileRowClass">{{ t("nav.about") }}<span v-html="ARROW_ICON" /></RouterLink>
                    <RouterLink to="/artists" :class="mobileRowClass">{{ t("nav.artists") }}<span v-html="ARROW_ICON" /></RouterLink>
                    <RouterLink to="/#events" :class="mobileRowClass">{{ t("nav.events") }}<span v-html="ARROW_ICON" /></RouterLink>
                    <a :href="INSTAGRAM.href" target="_blank" rel="noopener" :class="mobileRowClass">{{ t("nav.instagram") }}<span v-html="ARROW_ICON" /></a>
                </nav>

                <div class="flex gap-3 mt-9">
                    <a :href="PHONE.href" :aria-label="PHONE.label" class="size-14 rounded-full border border-white/25 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/></svg>
                    </a>
                    <a :href="INSTAGRAM.href" target="_blank" rel="noopener" aria-label="Instagram" class="size-14 rounded-full border border-white/25 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/></svg>
                    </a>
                </div>

                <div class="flex flex-col gap-2.5 mt-6 text-[15px]/[1.45]">
                    <a :href="PHONE.href">{{ PHONE.label }}</a>
                    <p class="font-normal text-white/55" v-html="t('contact.adressText')" />
                </div>
            </div>

            <!-- Info columns (tablet and desktop) -->
            <div class="hidden flex-col gap-10 mt-12 pt-10 border-t border-white/12 lg:border-[#18181814] md:grid md:grid-cols-12 md:gap-5 md:mt-16">
                <div class="flex flex-col gap-4 md:col-span-12 lg:col-span-5">
                    <RouterLink to="/" class="self-start font-bold text-[22px]/[100%]">The Show Time</RouterLink>
                    <p class="font-normal text-[14px]/[1.45] text-white/65 lg:text-[#181818a6] max-w-90">{{ t("footer.aboutText") }}</p>
                </div>

                <div class="grid grid-cols-2 gap-x-5 gap-y-10 md:col-span-12 md:grid-cols-3 lg:col-start-7 lg:col-span-6">
                    <div>
                        <span :class="titleClass">{{ t("nav.nav") }}</span>
                        <ul class="flex flex-col gap-3">
                            <li><RouterLink to="/" :class="linkClass">{{ t("nav.about") }}</RouterLink></li>
                            <li><RouterLink to="/artists" :class="linkClass">{{ t("nav.artists") }}</RouterLink></li>
                            <li><RouterLink to="/#events" :class="linkClass">{{ t("nav.events") }}</RouterLink></li>
                            <li><a :href="INSTAGRAM.href" target="_blank" rel="noopener" :class="linkClass">{{ t("nav.instagram") }}</a></li>
                        </ul>
                    </div>

                    <div>
                        <span :class="titleClass">{{ t("footer.contacts") }}</span>
                        <div class="flex flex-col gap-3 text-[14px]/[100%]">
                            <a :href="PHONE.href" class="transition-opacity hover:opacity-60">{{ PHONE.label }}</a>
                            <a :href="INSTAGRAM.href" target="_blank" rel="noopener" class="transition-opacity hover:opacity-60">{{ INSTAGRAM.label }}</a>
                        </div>
                    </div>

                    <div class="col-span-2 md:col-span-1">
                        <span :class="titleClass">{{ t("contact.adress") }}</span>
                        <p class="text-[14px]/[1.5]" v-html="t('contact.adressText')" />
                    </div>
                </div>
            </div>

            <div class="font-normal flex flex-col gap-2 mt-11 text-[13px]/[100%] md:gap-3 md:mt-12 text-white/55 lg:text-[#6b6b6b] md:flex-row md:justify-between md:mt-14 md:text-[14px]/[100%]">
                <span>{{ currentYear }}, The Show Time. {{ t("footer.rights") }}.</span>
                <RouterLink to="/privacy-policy" class="underline underline-offset-4 hover:no-underline">
                    {{ t("footer.privacyText") }}
                </RouterLink>
            </div>
        </div>
    </footer>

    <BookArtistModal v-model:open="isOpenBookModal" />
</template>
