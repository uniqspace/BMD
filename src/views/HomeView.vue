<script setup lang="ts">
import SingersArchive from '@/components/SingersArchive.vue';
import SingersCategoryList from '@/components/SingersCategoryList.vue';
import { useI18n } from 'vue-i18n'
import { onMounted, onUnmounted, ref } from 'vue'
import { useCategoryStore } from '@/store/category'
const { t } = useI18n()

// Reset the artist filter to its default when leaving the home page,
// so returning later always shows all artists (not the previous filter).
const categoryStore = useCategoryStore()
onUnmounted(() => {
  categoryStore.setCurrentCategory('viewAll')
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
  <main>
    <!-- Hero: full-width background video with the title on top -->
    <section class="px-3 pt-3 md:px-4 md:pt-4 lg:px-5 lg:pt-5">
      <div class="relative mx-auto max-w-[1400px] h-[72svh] min-h-120 max-h-215 overflow-hidden bg-[#181818] md:h-[70vh] lg:h-[78vh]">
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

    <div class="pt-12.5 md:pt-15 lg:pt-20">
      <div class="container">
        <SingersCategoryList />
        <SingersArchive />
      </div>
    </div>
  </main>
</template>
