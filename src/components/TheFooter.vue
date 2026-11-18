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

const linkClass = 'text-[14px]/[100%] uppercase transition-opacity hover:opacity-60'
const titleClass = 'block mb-4 md:mb-5 text-[12px]/[100%] uppercase tracking-[0.5px] text-[#6b6b6b]'
</script>

<template>
    <footer id="contacts" class="bg-white text-[#181818] border-t border-[#18181814] pt-15 pb-8 md:pt-18 md:pb-10 lg:pt-20">
        <div class="container">
            <!-- Booking call -->
            <div class="flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-10">
                <h2
                    class="font-heading font-normal max-w-225 text-[32px]/[1.08] tracking-[-1px] md:text-[42px]/[1.05] md:tracking-[-1.6px] lg:text-[52px]/[1.02] lg:tracking-[-2.2px] [&_span]:text-[#18181873]"
                    v-html="t('footer.ctaTitle')"
                />
                <button
                    type="button"
                    @click="isOpenBookModal = true"
                    class="self-start shrink-0 bg-[#181818] text-white px-8 py-5 text-[13px]/[100%] font-semibold uppercase cursor-pointer transition-opacity hover:opacity-80 md:self-auto"
                >
                    {{ t("footer.ctaButton") }}
                </button>
            </div>

            <!-- Info columns -->
            <div class="flex flex-col gap-10 mt-12 pt-10 border-t border-[#18181814] md:grid md:grid-cols-12 md:gap-5 md:mt-16">
                <div class="flex flex-col gap-4 md:col-span-12 lg:col-span-5">
                    <RouterLink to="/about" class="self-start font-bold text-[22px]/[100%]">The Show Time</RouterLink>
                    <p class="text-[14px]/[1.45] text-[#181818a6] max-w-90">{{ t("footer.aboutText") }}</p>
                </div>

                <div class="grid grid-cols-2 gap-x-5 gap-y-10 md:col-span-12 md:grid-cols-3 lg:col-start-7 lg:col-span-6">
                    <div>
                        <span :class="titleClass">{{ t("nav.nav") }}</span>
                        <ul class="flex flex-col gap-3">
                            <li><RouterLink to="/about" :class="linkClass">{{ t("nav.about") }}</RouterLink></li>
                            <li><RouterLink to="/" :class="linkClass">{{ t("nav.artists") }}</RouterLink></li>
                            <li><RouterLink to="/about#events" :class="linkClass">{{ t("nav.events") }}</RouterLink></li>
                            <li><a :href="INSTAGRAM.href" target="_blank" rel="noopener" :class="linkClass">{{ t("nav.instagram") }}</a></li>
                            <li><button type="button" @click="isOpenBookModal = true" :class="[linkClass, 'cursor-pointer']">{{ t("nav.book") }}</button></li>
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

            <div class="flex flex-col gap-3 mt-12 text-[13px]/[100%] text-[#6b6b6b] md:flex-row md:justify-between md:mt-14 md:text-[14px]/[100%]">
                <span>{{ currentYear }}, The Show Time. {{ t("footer.rights") }}.</span>
                <RouterLink to="/privacy-policy" class="underline underline-offset-4 hover:no-underline">
                    {{ t("footer.privacyText") }}
                </RouterLink>
            </div>
        </div>
    </footer>

    <BookArtistModal v-model:open="isOpenBookModal" />
</template>
