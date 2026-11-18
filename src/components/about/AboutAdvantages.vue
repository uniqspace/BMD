<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useMediaQuery } from '@/composables/useMediaQuery'

const { t } = useI18n()

const advantages = [1, 2, 3, 4, 5, 6]
const isDesktop = useMediaQuery('(min-width: 768px)')
</script>

<template>
  <div class="flex flex-col items-center gap-8 md:gap-10 lg:gap-15">
    <h2 class="w-full text-left text-[34px]/[100%] tracking-tight md:text-center md:text-[45px]/[100%] lg:text-[50px]/[100%] lg:tracking-[-3px]">{{ t('about.advantagesTitle') }}</h2>

    <div v-if="isDesktop" class="mx-auto grid w-full max-w-261 grid-cols-3 gap-3">
      <div v-for="i in advantages" :key="i" class="flex flex-col gap-15 bg-[#f6f6f6] p-8">
        <span class="text-[16px]/[1.3] font-medium tracking-[-0.48px]">{{ String(i).padStart(2, '0') }}</span>
        <div class="flex flex-col gap-2">
          <p class="text-[18px]/[1.1] font-medium tracking-[-0.54px]">{{ t(`about.slider.slide${i}.title`) }}</p>
          <p class="text-[14px]/[1.3] font-medium tracking-[-0.42px] text-[#18181866]">{{ t(`about.slider.slide${i}.text`) }}</p>
        </div>
      </div>
    </div>

    <Swiper v-else :slides-per-view="1.2" :space-between="12" class="w-full overflow-visible!">
      <SwiperSlide v-for="i in advantages" :key="i" class="h-auto!">
        <div class="flex h-full min-h-55 flex-col gap-19 bg-[#f6f6f6] p-5">
          <span class="text-[16px]/[1.3] font-medium tracking-[-0.48px]">{{ String(i).padStart(2, '0') }}</span>
          <div class="flex flex-col gap-2">
            <p class="text-[18px]/[1.1] font-medium tracking-[-0.54px]">{{ t(`about.slider.slide${i}.title`) }}</p>
            <p class="text-[14px]/[1.3] font-medium tracking-[-0.42px] text-[#18181866]">{{ t(`about.slider.slide${i}.text`) }}</p>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>
