<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { yearsInBusiness } from '@/lib/agency'
  import AboutAdvantages from '@/components/AboutAdvantages.vue'
  import AboutPartners from '@/components/AboutPartners.vue'
  import AboutProjects from '@/components/AboutProjects.vue'
  import AboutServices from '@/components/AboutServices.vue'
  import { computed, onMounted, ref } from 'vue'

  const { t, locale } = useI18n()

  // Intro text: paragraphs of both columns, interleaved (col1 p1, col2 p1, col1 p2, col2 p2)
  const introParagraphs = computed(() => {
    const a = t('about.introCol1').split('\n\n')
    const b = t('about.introCol2').split('\n\n')
    return Array.from({ length: Math.max(a.length, b.length) }).flatMap((_, i) => [a[i], b[i]]).filter(Boolean) as string[]
  })

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

      <div class="absolute inset-x-0 bottom-0 pb-16 md:pb-18 lg:pb-[clamp(110px,14vh,160px)]">
        <div class="container">
          <div class="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-end lg:gap-5">
            <div class="lg:col-span-9">
              <span class="hidden lg:block mb-7 text-[13px]/[100%] uppercase tracking-[2px] text-white/75">{{ t('about.heroEyebrow') }}</span>
              <h1
                v-html="t('about.heroTitle', { years: yearsInBusiness(locale) })"
                class="font-heading font-normal text-[calc((100vw-70px)*0.1125)]/[1.05] tracking-[-0.03em] md:text-[calc((100vw-120px)*0.0648)]/[1.03] lg:text-[min(66px,9vh,calc((100vw-120px)*0.064))]/[0.98] lg:tracking-[-0.042em] xl:text-[min(80px,10vh)]/[0.98] xl:tracking-[-0.042em]"
              />
            </div>
          </div>
        </div>
      </div>

    </section>

    <!-- Intro (variant 10): heading, centered text, partner logos in two rows -->
    <section class="overflow-x-clip pt-10 pb-15 md:pt-14 md:pb-20 lg:pt-27.5 lg:pb-27.5">
      <div class="container flex flex-col items-center text-center">
        <!-- Signature above the heading -->
        <span class="text-[12px]/[1.4] uppercase tracking-[2px] text-[#1818184d] md:text-[13px]/[1.4]">{{ t('about.quoteBy') }}</span>
        <h2
          v-html="t('about.quote')"
          class="mt-8 max-w-270 font-heading font-normal text-[28px]/[1.2] tracking-[-0.6px] md:mt-10 md:text-[36px]/[1.2] md:tracking-[-1px] lg:mt-12 lg:text-[42px]/[1.2] lg:tracking-[-1.2px]"
        />

        <!-- Body text: left-aligned on mobile and tablet (easier to read), centered on desktop -->
        <div class="mt-9 max-w-190 flex flex-col gap-5 text-left md:mt-[46px] lg:mt-[50px] lg:text-center">
          <p
            v-for="(paragraph, i) in introParagraphs"
            :key="i"
            class="font-normal text-[15px]/[1.65] text-[#181818b3] md:text-[16px]/[1.7]"
          >{{ paragraph }}</p>
        </div>

        <div class="w-full mt-15 md:mt-20 lg:mt-24">
          <AboutPartners rows />
        </div>
      </div>
    </section>

    <!-- Advantages ("Подход", light grey block) -->
    <section class="bg-[#efefed] py-15 overflow-hidden md:py-20 lg:py-30">
      <div class="container">
        <AboutAdvantages />
      </div>
    </section>

    <!-- Completed projects (card-stack carousel) -->
    <AboutProjects />

    <!-- Services (big list, photo follows the cursor) -->
    <AboutServices />

  </main>

</template>
