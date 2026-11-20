<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import eventsData from '@/data/events.json'

  // "Реализованные проекты" — card-stack carousel (design: Projects 9, graphite)
  // with the details panel expanding under the carousel.
  type Project = { id: string; date: string; image: string; gallery?: string[]; tags?: string[] }
  const projects = eventsData as Project[]

  const { t } = useI18n()
  const total = projects.length
  const active = ref(0)
  const open = ref(false)
  const activeImage = ref(0)

  const current = computed(() => projects[active.value]!)
  const images = computed(() => current.value.gallery?.length ? current.value.gallery : [current.value.image])
  const pad = (n: number) => String(n).padStart(2, '0')
  const paragraphs = computed(() => t(`about.events.${current.value.id}.description`).split('\n\n'))

  const go = (step: number) => {
    active.value = (active.value + step + total) % total
    activeImage.value = 0
  }

  // Position of a card relative to the active one: 0 = front, 1-2 = peeking
  // behind, total-1 = the card that just left (fades out to the left).
  const cardStyle = (i: number) => {
    const k = (i - active.value + total) % total
    if (k === total - 1 && total > 3) {
      return { transform: 'translateX(-48px) scale(1)', opacity: 0, zIndex: 11, pointerEvents: 'none' as const }
    }
    const v = Math.min(k, 3)
    return {
      transform: `translateX(calc(var(--peek) * ${v})) scale(${1 - v * 0.12})`,
      opacity: k > 2 ? 0 : 1,
      zIndex: 10 - v,
      pointerEvents: k === 0 ? ('auto' as const) : ('none' as const),
    }
  }
  const imgOpacity = (i: number) => {
    const k = (i - active.value + total) % total
    return k === 1 ? 0.75 : k === 2 ? 0.5 : 1
  }

  // Simple swipe on touch devices.
  let startX = 0
  const onTouchStart = (e: TouchEvent) => { startX = e.touches[0]!.clientX }
  const onTouchEnd = (e: TouchEvent) => {
    const dx = e.changedTouches[0]!.clientX - startX
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
  }
</script>

<template>
  <section id="events" class="scroll-mt-[var(--header-height)] overflow-x-clip bg-[#2c2e31] py-15 text-white md:py-20 lg:scroll-mt-0 lg:py-27.5">
    <div class="container">
      <h2 class="font-heading font-normal text-[36px]/[1.05] tracking-[-1.2px] md:text-[48px]/[1.05] md:tracking-[-1.6px] lg:text-[56px]/[1] lg:tracking-[-2px]">
        {{ t('about.eventsTitle') }}
      </h2>

      <div class="mt-10 flex flex-col gap-8 md:mt-12 lg:mt-15 lg:grid lg:grid-cols-[340px_1fr] lg:items-center lg:gap-15 xl:grid-cols-[360px_1fr]">
        <!-- Info column -->
        <div class="order-2 flex flex-col gap-4 lg:order-1 lg:gap-5">
          <span class="font-heading text-[56px]/[0.85] tracking-[-2px] text-white/20 md:text-[72px]/[0.85] lg:text-[96px]/[0.85] lg:tracking-[-4px]">{{ pad(active + 1) }}</span>
          <span class="text-[12px]/[1.4] uppercase tracking-[1.5px] text-white/60">{{ t(`about.events.${current.id}.location`) }}</span>
          <span class="font-heading text-[30px]/[1.1] tracking-[-0.8px] md:text-[36px]/[1.1] lg:text-[40px]/[1.08] lg:tracking-[-1.2px]">{{ t(`about.events.${current.id}.title`) }}</span>
          <div class="mt-2 flex items-center justify-between gap-6 lg:flex-col lg:items-start lg:gap-10">
            <button
              type="button"
              @click="open = !open"
              :aria-expanded="open"
              class="inline-flex cursor-pointer items-center gap-2.5 border-b border-white/60 pb-1 text-[13px]/[1.2] uppercase tracking-[0.5px] transition-colors hover:border-white"
            >
              {{ open ? t('about.projectsLess') : t('about.projectsMore') }}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="transition-transform duration-300" :class="open ? 'rotate-180' : ''">
                <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" stroke-width="1.3" />
              </svg>
            </button>
            <div class="flex gap-2.5">
              <button
                v-for="dir in [-1, 1]"
                :key="dir"
                type="button"
                @click="go(dir)"
                :aria-label="dir < 0 ? 'Previous' : 'Next'"
                class="inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-white/40 transition-colors hover:border-white hover:bg-white hover:text-[#2c2e31] lg:size-14"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path :d="dir < 0 ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'" stroke="currentColor" stroke-width="1.4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Card stack -->
        <div
          class="order-1 pr-[calc(var(--peek)*2)] [--peek:18px] md:[--peek:30px] lg:order-2 lg:[--peek:44px]"
          @touchstart.passive="onTouchStart"
          @touchend="onTouchEnd"
        >
          <div class="relative aspect-[3/2]">
            <button
              v-for="(p, i) in projects"
              :key="p.id"
              type="button"
              @click="open = !open"
              class="absolute inset-0 origin-right cursor-pointer overflow-hidden bg-[#111] shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition-[transform,opacity] duration-500 ease-out"
              :style="cardStyle(i)"
              :aria-label="t(`about.events.${p.id}.title`)"
            >
              <img
                :src="p.image"
                :alt="t(`about.events.${p.id}.title`)"
                class="size-full object-cover transition-opacity duration-500"
                :style="{ opacity: imgOpacity(i) }"
                loading="lazy"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Details panel (expands under the carousel) -->
      <div class="grid transition-[grid-template-rows] duration-500 ease-out" :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
        <div class="overflow-hidden">
          <Transition mode="out-in" enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
            <div :key="current.id" class="mt-10 border-t border-white/14 pt-10 md:mt-12 md:pt-12 lg:mt-15 lg:pt-14">
              <div class="flex flex-col gap-10 lg:grid lg:gap-18" :class="images.length > 1 ? 'lg:grid-cols-[1fr_1.25fr]' : ''">
                <div class="flex flex-col gap-5 lg:gap-6" :class="images.length > 1 ? '' : 'max-w-180'">
                  <span class="text-[12px]/[1.4] uppercase tracking-[1.5px] text-white/55">{{ t(`about.events.${current.id}.location`) }} · {{ current.date }}</span>
                  <span class="font-heading text-[30px]/[1.1] tracking-[-0.8px] lg:text-[40px]/[1.08] lg:tracking-[-1.2px]">{{ t('about.projectsAbout') }}</span>
                  <div class="flex flex-col gap-3.5">
                    <p v-for="(para, pi) in paragraphs" :key="pi" class="text-[15px]/[1.6] font-normal text-white/70 lg:text-[16px]/[1.6]">{{ para }}</p>
                  </div>
                  <div v-if="current.tags?.length" class="flex flex-wrap gap-2">
                    <span v-for="tag in current.tags" :key="tag" class="rounded-full border border-white/25 px-3.5 py-2 text-[13px]/[1] text-white/85">{{ t(`about.eventTags.${tag}`) }}</span>
                  </div>
                </div>
                <div v-if="images.length > 1" class="flex flex-col gap-3.5">
                  <img :src="images[activeImage]" :alt="t(`about.events.${current.id}.title`)" class="aspect-[3/2] w-full bg-black object-cover" />
                  <div class="flex gap-2.5">
                    <button
                      v-for="(src, gi) in images"
                      :key="src + gi"
                      type="button"
                      @click="activeImage = gi"
                      class="aspect-[3/2] flex-1 cursor-pointer overflow-hidden outline-offset-2 transition-opacity md:w-28 md:flex-none"
                      :class="gi === activeImage ? 'opacity-100 outline-2 outline-white' : 'opacity-55 hover:opacity-100'"
                    >
                      <img :src="src" alt="" class="size-full object-cover" loading="lazy" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>
