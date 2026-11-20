<script setup lang="ts">
import ContactIcons from './ContactIcons.vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router';
import { FOUNDED_YEAR } from '@/lib/agency';
import ArrowIcon from './icons/ArrowUpRight.vue';
import { scrollToContacts } from '@/lib/scrollToContacts';

const INSTAGRAM = { href: 'https://www.instagram.com/sht.product', label: '@sht.product' }
const PHONE = { href: 'tel:+998992226632', label: '+998 99 222 66 32' }
const WHATSAPP = { href: 'https://wa.me/998992226632', label: 'WhatsApp' }
const TELEGRAM = { href: 'https://t.me/+998992226632', label: 'Telegram' }

// Copyright range: since the agency was founded up to the current year (updates automatically)
const currentYear = new Date().getFullYear();

const { t } = useI18n()

// Same rows as the mobile menu (MobileMenuModal.vue)
const mobileRowClass = 'flex justify-between items-center py-5 border-b border-white/12 text-[17px]/[100%] uppercase'
const linkClass = 'text-[14px]/[100%] uppercase transition-opacity hover:opacity-60'
// Dark footer on mobile/tablet, light on desktop (lg+)
const titleClass = 'block mb-4 md:mb-5 text-[12px]/[100%] uppercase tracking-[0.5px] text-white/50 lg:text-[#6b6b6b]'
</script>

<template>
    <footer id="contacts" class="md:sticky md:bottom-0 md:z-0 bg-[#181818] text-white lg:bg-white lg:text-[#181818] pt-15 pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pt-18 md:pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pt-20 lg:pb-20">
        <div class="container">
            <!-- Booking call -->
            <div class="flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-10">
                <h2
                    class="font-heading font-normal max-w-225 text-[32px]/[1.08] tracking-[-1px] md:text-[42px]/[1.05] md:tracking-[-1.6px] lg:text-[52px]/[1.02] lg:tracking-[-2.2px] [&_span]:text-white/45 lg:[&_span]:text-[#18181873]"
                    v-html="t('footer.ctaTitle')"
                />
            </div>

            <!-- Logo + about text under the heading (mobile and tablet; desktop shows it in the info columns) -->
            <div class="flex flex-col gap-4 mt-9 pt-9 border-t border-white/12 md:mt-12 md:pt-10 lg:hidden">
                <RouterLink to="/" class="self-start font-bold text-[22px]/[100%]">The Show Time</RouterLink>
                <p class="font-normal text-[14px]/[1.45] text-white/65 max-w-90">{{ t("footer.aboutText") }}</p>
                <ContactIcons class="hidden md:grid mt-4" />
            </div>

            <!-- Mobile: menu as full-width rows, round contact buttons, phone and address -->
            <div class="mt-11 md:hidden">
                <nav :aria-label="t('nav.nav')" class="border-t border-white/12">
                    <RouterLink to="/" :class="mobileRowClass">{{ t("nav.about") }}<ArrowIcon /></RouterLink>
                    <RouterLink to="/artists" :class="mobileRowClass">{{ t("nav.artists") }}<ArrowIcon /></RouterLink>
                    <RouterLink to="/#events" :class="mobileRowClass">{{ t("nav.events") }}<ArrowIcon /></RouterLink>
                    <button type="button" :class="[mobileRowClass, 'w-full cursor-pointer']" @click="scrollToContacts">{{ t("nav.feedback") }}<ArrowIcon /></button>
                </nav>

                <ContactIcons class="mt-9" />

                <div class="flex flex-col gap-2.5 mt-6 text-[15px]/[1.45]">
                    <a :href="PHONE.href">{{ PHONE.label }}</a>
                    <p class="font-normal text-white/55" v-html="t('contact.adressText')" />
                </div>
            </div>

            <!-- Info columns (tablet and desktop) -->
            <div class="hidden flex-col gap-10 mt-12 pt-10 border-t border-white/12 lg:border-[#18181814] md:grid md:grid-cols-12 md:gap-5 md:mt-16">
                <div class="hidden lg:flex flex-col gap-4 lg:col-span-5">
                    <RouterLink to="/" class="self-start font-bold text-[22px]/[100%]">The Show Time</RouterLink>
                    <p class="font-normal text-[14px]/[1.45] text-white/65 lg:text-[#181818a6] max-w-90">{{ t("footer.aboutText") }}</p>
                </div>

                <div class="grid grid-cols-2 gap-x-5 gap-y-10 md:col-span-12 md:grid-cols-3 lg:col-start-7 lg:col-span-6 lg:flex lg:justify-end lg:gap-24">
                    <!-- Navigation column: tablet only (removed on desktop) -->
                    <div class="lg:hidden">
                        <span :class="titleClass">{{ t("nav.nav") }}</span>
                        <ul class="flex flex-col gap-3">
                            <li><RouterLink to="/" :class="linkClass">{{ t("nav.about") }}</RouterLink></li>
                            <li><RouterLink to="/artists" :class="linkClass">{{ t("nav.artists") }}</RouterLink></li>
                            <li><RouterLink to="/#events" :class="linkClass">{{ t("nav.events") }}</RouterLink></li>
                            <li><button type="button" :class="[linkClass, 'cursor-pointer']" @click="scrollToContacts">{{ t("nav.feedback") }}</button></li>
                        </ul>
                    </div>

                    <div>
                        <span :class="titleClass">{{ t("footer.contacts") }}</span>
                        <div class="flex flex-col gap-3 text-[14px]/[100%]">
                            <a :href="PHONE.href">{{ PHONE.label }}</a>
                            <!-- Tablet: messenger links; desktop: the address instead (socials move to the right column) -->
                            <a :href="INSTAGRAM.href" target="_blank" rel="noopener" class="transition-opacity hover:opacity-60 lg:hidden">{{ t("nav.instagram") }}</a>
                            <a :href="WHATSAPP.href" target="_blank" rel="noopener" class="transition-opacity hover:opacity-60 lg:hidden">{{ WHATSAPP.label }}</a>
                            <a :href="TELEGRAM.href" target="_blank" rel="noopener" class="transition-opacity hover:opacity-60 lg:hidden">{{ TELEGRAM.label }}</a>
                            <p class="hidden lg:block text-[14px]/[1.5]" v-html="t('contact.adressText')" />
                        </div>
                    </div>

                    <div class="col-span-2 md:col-span-1 lg:hidden">
                        <span :class="titleClass">{{ t("contact.adress") }}</span>
                        <p class="text-[14px]/[1.5]" v-html="t('contact.adressText')" />
                    </div>

                    <!-- Desktop: social icons, sized to fit the column -->
                    <div class="hidden lg:block min-w-0">
                        <span :class="titleClass">{{ t("footer.socials") }}</span>
                        <ContactIcons tone="soft" class="grid-cols-[repeat(4,32px)]! xl:grid-cols-[repeat(4,40px)]!" />
                    </div>
                </div>
            </div>

            <div class="font-normal flex flex-col gap-2 mt-11 pt-8 border-t border-white/12 lg:border-t-0 lg:pt-0 text-[13px]/[100%] md:gap-3 md:mt-12 md:pt-10 text-white/55 lg:text-[#9a9a9a] md:flex-row md:flex-wrap md:gap-x-8 md:mt-14 md:text-[14px]/[100%]">
                <span>{{ FOUNDED_YEAR }}-{{ currentYear }}, The Show Time. {{ t("footer.rights") }}.</span>
                <div class="flex flex-col gap-2 md:flex-row md:gap-5 lg:text-[#b5b5b5]">
                    <RouterLink to="/terms" class="underline underline-offset-4 hover:no-underline">
                        {{ t("footer.termsText") }}
                    </RouterLink>
                    <RouterLink to="/privacy-policy" class="underline underline-offset-4 hover:no-underline">
                        {{ t("footer.privacyText") }}
                    </RouterLink>
                </div>
            </div>
        </div>
    </footer>

</template>
