<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import AboutFounderCard from './AboutFounderCard.vue'
import maratImg from '@/assets/images/marat.webp'
import iskandarImg from '@/assets/images/iskandar.webp'
import azizbekImg from '@/assets/images/azizbek.webp'

const { t } = useI18n()

const revealedKey = ref<string | null>(null)

const founders = [
  { key: 'about.founders.founder1', image: azizbekImg },
  { key: 'about.founders.founder2', image: iskandarImg },
  { key: 'about.founders.founder3', image: maratImg },
]

const breakpoints = {
  768: { slidesPerView: 2, spaceBetween: 20 },
  1024: { slidesPerView: 3, spaceBetween: 20 },
}

// Fade the cards in once the section scrolls into view
const isVisible = ref(false)
const sectionRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!sectionRef.value) return

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer?.disconnect()
      }
    })
  }, { threshold: 0.2 })

  observer.observe(sectionRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <section class="overflow-x-clip pb-15 md:pb-25 lg:pb-30">
    <div class="container">
      <div ref="sectionRef" class="mx-auto max-w-261.5">
        <Swiper :slides-per-view="1" :space-between="16" :breakpoints="breakpoints" class="overflow-visible!">
          <SwiperSlide v-for="(founder, index) in founders" :key="founder.key" class="h-auto!">
            <div :class="['founder-in', { play: isVisible }]" :style="{ animationDelay: index * 0.15 + 's' }">
              <AboutFounderCard
                :image="founder.image"
                :name="t(`${founder.key}.name`)"
                :role="t(`${founder.key}.role`)"
                :bio="t(`${founder.key}.bio`)"
                :revealed="revealedKey === founder.key"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes founder-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.founder-in {
  opacity: 0;
}

.founder-in.play {
  animation: founder-in 0.5s ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  .founder-in {
    opacity: 1;
  }

  .founder-in.play {
    animation: none;
  }
}
</style>
