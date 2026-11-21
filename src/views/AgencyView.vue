<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  // Inner page "О нас" (design: «О нас · минимал 2»): centered intro, team photo
  // shown whole (no cropping), principles as rows, client reviews in columns.
  const { t, tm, rt } = useI18n()

  const list = (key: string) =>
    computed(() =>
      (tm(key) as Record<string, unknown>[]).map((it) =>
        Object.fromEntries(Object.entries(it).map(([k, v]) => [k, rt(v as string)])),
      ),
    )
  const principles = list('aboutPage.principles')
  const reviews = list('aboutPage.reviews')
  const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <section class="pt-10 md:pt-16 lg:pt-27.5">
    <div class="container">
      <div class="flex flex-col items-center gap-5 text-center md:gap-6">
        <span class="text-[12px]/[100%] uppercase tracking-[3px] text-[#18181880]">{{ t('nav.about') }}</span>
        <h1
          v-html="t('aboutPage.title')"
          class="font-heading font-normal text-[48px]/[1] tracking-[-1.6px] md:text-[68px]/[1] md:tracking-[-2.4px] lg:text-[88px]/[1] lg:tracking-[-3px]"
        />
        <p class="max-w-160 font-normal text-[16px]/[1.6] text-[#181818b3] md:text-[17px]/[1.6] lg:text-[18px]/[1.6]">{{ t('aboutPage.lead') }}</p>
      </div>

      <!-- Team photo: always whole, natural proportions -->
      <img
        src="/images/about/backstage.webp"
        :alt="t('aboutPage.photoAlt')"
        width="1672"
        height="941"
        class="mx-auto mt-12 block h-auto w-full max-w-275 md:mt-16 lg:mt-22.5"
      />
    </div>
  </section>

  <!-- Principles -->
  <section class="pt-20 md:pt-25 lg:pt-32.5">
    <div class="container">
      <h2 class="mb-6 text-center font-heading font-normal text-[34px]/[1.05] tracking-[-1px] md:mb-7.5 md:text-[42px]/[1.05] lg:text-[48px]/[1.05] lg:tracking-[-1.6px]">
        {{ t('aboutPage.principlesTitle') }}
      </h2>
      <div class="mx-auto max-w-275 border-b border-[#1818181f]">
        <div
          v-for="(p, i) in principles"
          :key="i"
          class="grid grid-cols-[36px_1fr] gap-x-4 gap-y-2 border-t border-[#1818181f] py-5 md:grid-cols-[48px_1fr_1fr] md:items-baseline md:gap-x-8 md:py-6.5 lg:grid-cols-[60px_1fr_1fr] lg:gap-x-10"
        >
          <span class="text-[13px] text-[#18181866]">{{ pad(i + 1) }}</span>
          <span class="font-heading text-[24px]/[1.15] tracking-[-0.6px] md:text-[28px]/[1.1] lg:text-[30px]/[1.1] lg:tracking-[-0.8px]">{{ p.title }}</span>
          <span class="col-start-2 font-normal text-[15px]/[1.55] text-[#181818b3] md:col-start-3 md:text-[16px]/[1.55]">{{ p.text }}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Reviews -->
  <section class="pt-20 pb-20 md:pt-25 md:pb-25 lg:pt-32.5 lg:pb-32.5">
    <div class="container">
      <h2 class="mb-8 text-center font-heading font-normal text-[34px]/[1.05] tracking-[-1px] md:mb-10 md:text-[42px]/[1.05] lg:mb-12.5 lg:text-[48px]/[1.05] lg:tracking-[-1.6px]">
        {{ t('aboutPage.reviewsTitle') }}
      </h2>
      <div class="grid grid-cols-1 lg:grid-cols-3">
        <div
          v-for="(r, i) in reviews"
          :key="i"
          class="flex flex-col justify-between gap-6 border-t border-[#1818181f] py-8 first:border-t-0 first:pt-0 md:gap-8 lg:border-t-0 lg:px-9 lg:py-0 lg:first:pl-0 lg:last:pr-0 lg:[&:not(:first-child)]:border-l"
        >
          <p class="font-heading text-[22px]/[1.35] tracking-[-0.3px] md:text-[24px]/[1.35]">{{ r.text }}</p>
          <p class="text-[14px]/[1.5]"><span class="font-semibold">{{ r.name }}</span><br /><span class="font-normal text-[#18181899]">{{ r.role }}</span></p>
        </div>
      </div>
    </div>
  </section>
</template>
