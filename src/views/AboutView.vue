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
    <!-- Hero: full-screen background video (runs under the floating header) -->
    <section class="relative -mt-19 h-svh min-h-180 overflow-hidden bg-[#111] text-white md:-mt-21 md:min-h-180 lg:-mt-23 lg:min-h-170">
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
      <div class="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.4)_100%)]" aria-hidden="true" />

      <div class="absolute inset-x-0 bottom-0 pb-16 md:pb-18 lg:pb-14">
        <div class="container">
          <div class="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-end lg:gap-5">
            <div class="lg:col-span-9">
              <span class="hidden lg:block mb-7 text-[13px]/[100%] uppercase tracking-[2px] text-white/75">{{ t('about.heroEyebrow') }}</span>
              <h1
                v-html="t('about.heroTitle')"
                class="font-heading font-normal text-[calc((100vw-70px)*0.1125)]/[1.05] tracking-[-0.03em] md:text-[calc((100vw-120px)*0.0648)]/[1.03] lg:text-[min(66px,9vh,calc((100vw-120px)*0.064))]/[0.98] lg:tracking-[-0.042em] xl:text-[min(80px,10vh)]/[0.98] xl:tracking-[-0.042em]"
              />
            </div>
            <div class="flex flex-col gap-6 lg:col-start-10 lg:col-span-3 lg:max-w-none lg:gap-7">
              <p class="font-normal text-[15px]/[1.5] text-white/80">{{ t('about.heroText') }}</p>
            </div>
          </div>
        </div>
      </div>

    </section>

    <!-- Intro: centered lead, two columns of text, partner logos -->
    <section class="overflow-x-clip pt-15 pb-15 md:pt-20 md:pb-20 lg:pt-30 lg:pb-30">
      <div class="container">
        <p
          v-html="t('about.desc')"
          class="mx-auto max-w-242.5 text-center font-heading font-normal text-[20px]/[1.4] italic text-[#18181880] [&_b]:font-semibold [&_b]:text-[#181818] md:text-[24px]/[1.4]"
        />

        <div class="mx-auto max-w-242.5 grid gap-6 mt-10 md:grid-cols-2 md:gap-10 md:mt-14 lg:gap-15 lg:mt-16">
          <p class="font-normal text-[15px]/[1.6] text-[#181818b3] md:text-[16px]/[1.65]">{{ t('about.introCol1') }}</p>
          <p class="font-normal text-[15px]/[1.6] text-[#181818b3] md:text-[16px]/[1.65]">{{ t('about.introCol2') }}</p>
        </div>

        <div class="mt-15 md:mt-20 lg:mt-25">
          <AboutPartners />
        </div>
      </div>
    </section>

    <!-- Advantages (white block) -->
    <section class="bg-white py-15 overflow-hidden md:py-20 lg:py-30">
      <div class="container">
        <AboutAdvantages />
      </div>
    </section>

    <!-- Featured Events -->
    <AboutEvents />

    <!-- Founders (swipeable slider on tablet / mobile) -->
    <AboutFounders />
  </main>

</template>
