<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import AboutFounders from '@/components/AboutFounders.vue'

  // Inner page "О нас": short intro about the agency + founders.
  // More blocks (story, numbers, values, team, clients) to be added.
  const { t } = useI18n()
</script>

<template>
  <section class="pt-5 pb-12 md:pb-16 lg:pt-18.75 lg:pb-20">
    <div class="container">
      <div class="flex max-w-270 flex-col gap-5 md:gap-6 lg:gap-8">
        <span class="text-[12px]/[100%] uppercase tracking-[3px] text-[#18181880]">{{ t('nav.about') }}</span>
        <h1
          v-html="t('aboutPage.title')"
          class="font-heading font-normal text-[40px]/[1.04] tracking-[-1.4px] md:text-[56px]/[1.03] md:tracking-[-2px] lg:text-[70px]/[1.02] lg:tracking-[-2.6px]"
        />
        <p class="max-w-190 font-normal text-[16px]/[1.6] text-[#181818b3] md:text-[17px]/[1.6] lg:text-[18px]/[1.6]">{{ t('aboutPage.lead') }}</p>
      </div>
    </div>
  </section>

  <div class="pb-8 md:pb-10">
    <div class="container">
      <!-- same width as the founders row below -->
      <h2 class="mx-auto max-w-261.5 font-heading font-normal text-[32px]/[1.05] tracking-[-1px] md:text-[42px]/[1.05] lg:text-[48px]/[1.05] lg:tracking-[-1.6px]">{{ t('aboutPage.foundersTitle') }}</h2>
    </div>
  </div>
  <AboutFounders />
</template>
