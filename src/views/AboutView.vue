<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import AboutFounders from '@/components/AboutFounders.vue'
  import AboutAdvantages from '@/components/AboutAdvantages.vue'
  import AboutPartners from '@/components/AboutPartners.vue'
  import AboutEvents from '@/components/AboutEvents.vue'
  import { onMounted, ref } from 'vue'

  const { t } = useI18n()

  // Background video of the hero: don't play it for users who prefer reduced motion
  const heroVideo = ref<HTMLVideoElement | null>(null)
  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroVideo.value?.pause()
    }
  })
</script>

<template>
  <main class="bg-[#f8f8f5]">
    <!-- Hero: full-width background video with the title on top -->
    <section class="px-3 pt-3 md:px-4 md:pt-4 lg:px-5 lg:pt-5">
      <div class="relative mx-auto max-w-[1400px] h-[56svh] min-h-95 max-h-150 overflow-hidden bg-[#181818] md:h-[50vh] lg:h-[60vh]">
        <video
          ref="heroVideo"
          class="absolute inset-0 w-full h-full object-cover"
          src="/videos/hero.mp4"
          poster="/videos/hero-poster.webp"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          aria-hidden="true"
        />
        <div class="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/10" aria-hidden="true" />

        <div class="absolute inset-x-0 bottom-0 px-5 pb-8 md:px-7 md:pb-10 lg:px-8 lg:pb-14">
          <h1 v-html="t('home.title')" class="text-white tracking-tighter text-[41px]/[100%] sm:text-[62px]/[100%] lg:text-[70px]/[100%]" />
        </div>
      </div>
    </section>

    <section class="pt-10 pb-12.5 md:pt-15 md:pb-15 lg:pt-20 lg:pb-30">
      <div class="container">
        <p
          v-html="t('about.desc')"
          class="max-w-242.5 font-heading font-normal text-[20px]/[1.4] italic text-[#18181880] [&_b]:font-semibold [&_b]:text-[#181818] md:text-[24px]/[1.4]"
        />
      </div>
    </section>

    <!-- Founders (swipeable slider on tablet / mobile) -->
    <AboutFounders />

    <!-- Advantages + partners (white block) -->
    <section class="bg-white py-15 overflow-hidden md:py-20 lg:py-30">
      <div class="container">
        <AboutAdvantages />
        <div class="mt-7.5 md:mt-17.5 lg:mt-25">
          <AboutPartners />
        </div>
      </div>
    </section>

    <!-- Featured Events -->
    <AboutEvents />
  </main>
</template>
