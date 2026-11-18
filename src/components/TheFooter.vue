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
    <footer class="bg-[#f8f8f5] text-[#181818] border-t border-[#18181814] pt-15 pb-8 md:pt-18 md:pb-10">
        <div class="container">
            <div class="flex flex-col gap-12 md:grid md:grid-cols-12 md:gap-5">
                <p class="font-heading text-[24px]/[1.25] tracking-[-0.5px] md:col-span-12 md:text-[28px]/[1.25] lg:col-span-5 lg:text-[30px]/[1.25]">
                    {{ t("footer.aboutText") }}
                </p>

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
                            <button type="button" @click="isOpenBookModal = true" class="text-left uppercase cursor-pointer transition-opacity hover:opacity-60">{{ t("nav.book") }} →</button>
                        </div>
                    </div>

                    <div class="col-span-2 md:col-span-1">
                        <span :class="titleClass">{{ t("contact.adress") }}</span>
                        <p class="text-[14px]/[1.5]" v-html="t('contact.adressText')" />
                    </div>
                </div>
            </div>

            <RouterLink to="/" class="footer-wordmark block font-heading whitespace-nowrap mt-14 mb-7 md:mt-18 md:mb-9" aria-label="The Show Time">
                The Show Time
            </RouterLink>

            <div class="flex flex-col gap-3 text-[13px]/[100%] text-[#6b6b6b] md:flex-row md:justify-between md:text-[14px]/[100%]">
                <span>{{ currentYear }}, The Show Time. {{ t("footer.rights") }}.</span>
                <RouterLink to="/privacy-policy" class="underline underline-offset-4 hover:no-underline">
                    {{ t("footer.privacyText") }}
                </RouterLink>
            </div>
        </div>
    </footer>

    <BookArtistModal v-model:open="isOpenBookModal" />
</template>

<style scoped>
/*
  The wordmark always spans the full content width.
  Playfair Display "The Show Time" is ~6.29em wide with -0.0524em letter spacing,
  so font-size = content width / 6.29 ≈ 0.159 × content width.
  Content width = min(viewport, 1382px container) − side paddings.
*/
.footer-wordmark {
    --content-width: calc(min(100vw, 1382px) - 120px);
    font-size: calc(var(--content-width) * 0.159);
    line-height: 0.85;
    letter-spacing: -0.0524em;
}

@media (max-width: 767px) {
    .footer-wordmark {
        --content-width: calc(100vw - 70px);
    }
}
</style>
