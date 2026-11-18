<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useMediaQuery } from '@/composables/useMediaQuery'

const { t } = useI18n()

const partnerSets = [
  [
    { name: 'Courtyard', src: '/images/partners/courtyard.svg' },
    { name: 'FIFA', src: '/images/partners/fifa.svg' },
    { name: 'Community', src: '/images/partners/community.svg' },
    { name: 'DoubleTree', src: '/images/partners/doubletree.svg' },
    { name: 'Hilton', src: '/images/partners/hilton.svg' },
  ],
  [
    { name: 'Nachalo', src: '/images/partners/nachalo.svg' },
    { name: 'Humo', src: '/images/partners/humo.svg' },
    { name: 'Novikov Cafe', src: '/images/partners/novikov-cafe.svg' },
    { name: 'IHG', src: '/images/partners/ihg.svg' },
    { name: 'Coca-Cola', src: '/images/partners/coca-cola.svg' },
  ],
]

// Rotate partner sets between visits
let setIndex = 0
try {
  setIndex = (Number(localStorage.getItem('partnersSetIndex') ?? '-1') + 1) % partnerSets.length
  localStorage.setItem('partnersSetIndex', String(setIndex))
} catch {
  setIndex = Math.floor(Math.random() * partnerSets.length)
}

const partners = partnerSets[setIndex] ?? partnerSets[0] ?? []
const isDesktop = useMediaQuery('(min-width: 768px)')
const initialSlide = Math.floor(partners.length / 2)
</script>

<template>
  <div class="flex flex-col items-center gap-5 md:gap-10">
    <div v-if="isDesktop" class="mx-auto flex w-full max-w-261 flex-wrap items-center gap-7.5 lg:gap-0 lg:justify-between">
      <img v-for="partner in partners" :key="partner.name" :src="partner.src" :alt="partner.name" class="w-auto object-contain md:w-26 lg:w-auto">
    </div>

    <Swiper
      v-else
      :slides-per-view="2.4"
      :centered-slides="true"
      :initial-slide="initialSlide"
      :space-between="60"
      class="w-full [&_.swiper-wrapper]:items-center overflow-visible!"
    >
      <SwiperSlide v-for="partner in partners" :key="partner.name" class="flex! w-auto! items-center justify-center">
        <img :src="partner.src" :alt="partner.name" class="w-26 object-contain">
      </SwiperSlide>
    </Swiper>

    <p class="text-center font-heading text-[17px]/[1.4] italic text-[#18181866]">{{ t('about.partnersCaption') }}</p>
  </div>
</template>
