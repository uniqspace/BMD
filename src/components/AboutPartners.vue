<script setup lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { useI18n } from 'vue-i18n'
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

  // Strictly alternate the set shown on every page load/refresh.
  let setIndex = 0
  try {
    const prev = Number(localStorage.getItem('partnersSetIndex') ?? '-1')
    setIndex = (prev + 1) % partnerSets.length
    localStorage.setItem('partnersSetIndex', String(setIndex))
  } catch {
    setIndex = Math.floor(Math.random() * partnerSets.length)
  }
  const partners = partnerSets[setIndex] ?? partnerSets[0] ?? []

  const isTabletUp = useMediaQuery('(min-width: 768px)')
  const middleIndex = Math.floor(partners.length / 2)
</script>

<template>
  <div class="flex flex-col items-center gap-5 md:gap-10">
    <!-- Tablet / desktop: static row -->
    <div
      v-if="isTabletUp"
      class="mx-auto flex w-full max-w-261 flex-wrap items-center gap-7.5 lg:gap-0 lg:justify-between"
    >
      <img
        v-for="p in partners"
        :key="p.name"
        :src="p.src"
        :alt="p.name"
        class="w-auto object-contain md:w-26 lg:w-auto"
      />
    </div>

    <!-- Mobile: centered slider starting from the middle logo -->
    <swiper
      v-else
      :slides-per-view="2.4"
      :centered-slides="true"
      :initial-slide="middleIndex"
      :space-between="60"
      class="w-full [&_.swiper-wrapper]:items-center overflow-visible!"
    >
      <swiper-slide
        v-for="p in partners"
        :key="p.name"
        class="flex! w-auto! items-center justify-center "
      >
        <img :src="p.src" :alt="p.name" class="w-26 object-contain" />
      </swiper-slide>
    </swiper>

    <p class="text-center font-heading text-[17px]/[1.4] italic text-[#18181866]">
      {{ t('about.partnersCaption') }}
    </p>
  </div>
</template>
