<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import type { Swiper as SwiperType } from 'swiper'

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

  // Reviews slider: 3 columns on desktop, swipeable cards on mobile/tablet
  const swiper = ref<SwiperType | null>(null)
  const active = ref(0)
  const perView = ref(1)
  const onSwiper = (sw: SwiperType) => { swiper.value = sw; sync(sw) }
  const sync = (sw: SwiperType) => {
    active.value = sw.activeIndex
    const spv = sw.params.slidesPerView
    perView.value = typeof spv === 'number' ? Math.floor(spv) : 1
  }
  const total = computed(() => reviews.value.length)
  const lastVisible = computed(() => Math.min(active.value + perView.value, total.value))
  const counter = computed(() =>
    perView.value > 1
      ? `${active.value + 1}–${lastVisible.value} ${t('aboutPage.of')} ${total.value}`
      : `${active.value + 1} / ${total.value}`,
  )
  const atStart = computed(() => active.value === 0)
  const atEnd = computed(() => lastVisible.value >= total.value)
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

  <!-- Reviews (slider) -->
  <section class="overflow-x-clip pt-20 pb-20 md:pt-25 md:pb-25 lg:pt-32.5 lg:pb-32.5">
    <div class="container">
      <div class="mb-7 flex items-center justify-between md:mb-10 lg:mb-12.5 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <span class="hidden lg:block"></span>
        <h2 class="font-heading font-normal text-[34px]/[1.05] tracking-[-1px] md:text-[42px]/[1.05] lg:text-center lg:text-[48px]/[1.05] lg:tracking-[-1.6px]">
          {{ t('aboutPage.reviewsTitle') }}
        </h2>
        <div class="flex items-center gap-4 justify-self-end">
          <span class="text-[13px] text-[#18181880]">{{ counter }}</span>
          <button
            v-for="dir in [-1, 1]"
            :key="dir"
            type="button"
            :aria-label="dir < 0 ? 'Previous' : 'Next'"
            :disabled="dir < 0 ? atStart : atEnd"
            @click="dir < 0 ? swiper?.slidePrev() : swiper?.slideNext()"
            class="hidden size-13 cursor-pointer items-center justify-center rounded-full border border-[#181818] transition-opacity disabled:cursor-default disabled:border-[#1818181f] disabled:opacity-50 lg:inline-flex"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path :d="dir < 0 ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'" stroke="currentColor" stroke-width="1.4" /></svg>
          </button>
        </div>
      </div>

      <div class="-mr-[35px] md:-mr-15 lg:-mx-9">
        <Swiper
          :slides-per-view="1.15"
          :space-between="16"
          :breakpoints="{ 768: { slidesPerView: 1.6, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 0 } }"
          @swiper="onSwiper"
          @slide-change="sync"
          @breakpoint="sync"
          class="overflow-visible! lg:overflow-hidden!"
        >
          <SwiperSlide
            v-for="(r, i) in reviews"
            :key="i"
            class="h-auto!"
          >
            <div
              class="flex h-full flex-col justify-between gap-6 border border-[#1818181f] p-6 transition-colors duration-300 md:gap-8 md:p-7 lg:border-y-0 lg:border-r-0 lg:px-9 lg:py-0"
              :class="i === active ? 'lg:border-l-transparent' : ''"
            >
              <p class="font-heading text-[22px]/[1.35] tracking-[-0.3px] md:text-[24px]/[1.35]">{{ r.text }}</p>
              <p class="text-[14px]/[1.5]"><span class="font-semibold">{{ r.name }}</span><br /><span class="font-normal text-[#18181899]">{{ r.role }}</span></p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Desktop: progress line; mobile/tablet: dots -->
      <div class="relative mt-11 hidden h-px bg-[#1818181f] lg:block">
        <span class="absolute -top-px left-0 h-[3px] bg-[#181818] transition-[width] duration-500" :style="{ width: `${(lastVisible / total) * 100}%` }"></span>
      </div>
      <div class="mt-6.5 flex justify-center gap-2 lg:hidden">
        <button
          v-for="(r, i) in reviews"
          :key="i"
          type="button"
          :aria-label="`${i + 1}`"
          @click="swiper?.slideTo(i)"
          class="h-1.5 cursor-pointer rounded-full transition-all duration-300"
          :class="i === active ? 'w-6.5 bg-[#181818]' : 'w-1.5 bg-[#18181833]'"
        ></button>
      </div>
    </div>
  </section>
</template>
