<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const advantages = [1, 2, 3, 4, 5, 6]

  // Dark block (variant 4): 1 column on mobile, 2 on tablet, 3x2 grid on desktop.
  // Cells are separated by thin lines; big translucent serif numbers.
</script>

<template>
  <div class="flex flex-col gap-10 md:gap-14 lg:gap-18">
    <div class="flex flex-col items-center gap-4 text-center md:gap-5.5">
      <span class="text-[12px]/[100%] uppercase tracking-[3px] text-[#18181880]">{{ t('about.advEyebrow') }}</span>
      <h2
        v-html="t('about.advTitle')"
        class="font-heading font-normal text-[#181818] text-[36px]/[1.05] tracking-[-1.2px] md:text-[48px]/[1.05] md:tracking-[-1.6px] lg:text-[56px]/[1.05] lg:tracking-[-2px]"
      />
    </div>

    <div class="grid grid-cols-1 border-b border-[#1818181f] md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(i, index) in advantages"
        :key="i"
        :class="[
          'flex flex-col gap-8 border-t border-[#1818181f] py-8 md:gap-12 md:px-8 md:py-10 lg:gap-14 lg:px-10 lg:pt-11 lg:pb-12',
          index % 2 === 1 && 'md:max-lg:border-l',
          index % 3 !== 0 && 'lg:border-l',
        ]"
      >
        <span class="font-heading text-[56px]/[0.9] tracking-[-2px] text-[#18181833] md:text-[64px]/[0.9] lg:text-[72px]/[0.9]">
          {{ String(i).padStart(2, '0') }}
        </span>
        <div class="flex flex-col gap-2.5">
          <p class="text-[18px]/[1.25] tracking-[-0.4px] text-[#181818] md:text-[20px]/[1.25]">{{ t(`about.slider.slide${i}.title`) }}</p>
          <p class="font-normal text-[15px]/[1.5] text-[#18181899]">{{ t(`about.slider.slide${i}.text`) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
