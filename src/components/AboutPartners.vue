<script setup lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { useI18n } from 'vue-i18n'
  import { useMediaQuery } from '@/composables/useMediaQuery'

  const { t } = useI18n()

  // rows: tablet/desktop shows both sets as two staggered rows of dark logos, without the caption (home intro, variant 10)
  defineProps<{ rows?: boolean }>()

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
  const allPartners = partnerSets.flat()

  const isTabletUp = useMediaQuery('(min-width: 768px)')
  const middleIndex = Math.floor(partners.length / 2)
</script>

<template>
  <div class="flex flex-col items-center gap-5 md:gap-10">
    <!-- rows: all logos in one strip, centered under the text, slowly moving right to left (all screen sizes) -->
    <div
      v-if="rows"
      class="partners-marquee mx-auto w-full max-w-270 overflow-hidden"
    >
      <div class="partners-track flex w-max items-center">
        <img
          v-for="(p, i) in [...allPartners, ...allPartners]"
          :key="i"
          :src="p.src"
          :alt="i < allPartners.length ? p.name : ''"
          :aria-hidden="i >= allPartners.length"
          class="mx-8 h-auto max-h-12 w-auto max-w-30 object-contain brightness-0 opacity-45 md:mx-11 md:max-h-14 md:max-w-37.5"
        />
      </div>
    </div>

    <!-- Tablet / desktop: static row -->
    <div
      v-else-if="isTabletUp"
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
      v-else-if="!rows"
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

    <p v-if="!rows" class="text-center font-heading text-[17px]/[1.4] italic text-[#18181866]">
      {{ t('about.partnersCaption') }}
    </p>
  </div>
</template>

<style scoped>
/* Soft fade at both edges of the strip */
.partners-marquee {
  mask-image: linear-gradient(to right, transparent, #000 18%, #000 82%, transparent);
}

/* Track holds the logos twice; shifting it by half its width loops seamlessly. Moves right → left. */
@keyframes partners-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.partners-track {
  animation: partners-scroll 45s linear infinite;
}

.partners-marquee:hover .partners-track {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .partners-track {
    animation: none;
  }
}
</style>
