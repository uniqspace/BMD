<script setup lang="ts">
  import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import eventsData from '@/data/events.json'
  import { useBodyScrollLock } from '@/composables/useBodyScrollLock'

  // "Реализованные проекты" — card-stack carousel (design: Projects 9) on white;
  // details open in a popup over the page.
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
  useBodyScrollLock(open)
  const openModal = () => { activeImage.value = 0; open.value = true }
  const close = () => { open.value = false }
  const stepImage = (d: number) => { activeImage.value = (activeImage.value + d + images.value.length) % images.value.length }
  const onKeydown = (e: KeyboardEvent) => {
    if (!open.value) return
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  // Big project title: always two lines. Font size is fitted so the title fills
  // two lines of its box (max size per breakpoint comes from --fit-max).
  const titleEl = ref<HTMLElement | null>(null)
  const stackEl = ref<HTMLElement | null>(null)
  const titleSize = ref('')
  // Where the photo starts, measured from the title's left edge (beyond the title = no overlap)
  const overlapX = ref(9999)
  async function fitTitle() {
    await nextTick()
    const el = titleEl.value
    if (!el) return
    const max = parseFloat(getComputedStyle(el).getPropertyValue('--fit-max')) || 64
    let lo = 24
    let hi = max
    for (let i = 0; i < 12; i++) {
      const mid = (lo + hi) / 2
      el.style.fontSize = `${mid}px`
      // offsetHeight, not scrollHeight: italic/descender glyphs overflow the tight line box
      if (el.offsetHeight <= mid * 1.02 * 2 + 2) lo = mid
      else hi = mid
    }
    el.style.fontSize = `${Math.floor(lo)}px`
    titleSize.value = el.style.fontSize
    const photo = stackEl.value?.getBoundingClientRect()
    const box = el.getBoundingClientRect()
    overlapX.value = photo && photo.left > box.left && photo.top < box.bottom && photo.bottom > box.top ? photo.left - box.left : 9999
  }
  watch(() => current.value.id, fitTitle)
  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('resize', fitTitle)
    fitTitle()
    document.fonts?.ready.then(fitTitle)
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
    window.removeEventListener('resize', fitTitle)
  })
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
  <section id="events" class="scroll-mt-[var(--header-height)] overflow-x-clip bg-white py-15 text-[#181818] md:py-20 lg:scroll-mt-0 lg:py-27.5">
    <div class="container">
      <h2 class="font-heading font-normal text-[36px]/[1.05] tracking-[-1.2px] md:text-[48px]/[1.05] md:tracking-[-1.6px] lg:text-[56px]/[1] lg:tracking-[-2px]">
        {{ t('about.eventsTitle') }}
      </h2>

      <div class="mt-10 flex flex-col gap-8 md:mt-12 lg:mt-15 xl:grid xl:grid-cols-[360px_1fr] xl:items-center xl:gap-15">
        <!-- Info column -->
        <div class="order-2 flex flex-col gap-4 lg:gap-5 xl:order-1">
          <span class="font-heading text-[56px]/[0.85] tracking-[-2px] text-[#18181833] md:text-[72px]/[0.85] lg:text-[96px]/[0.85] lg:tracking-[-4px]">{{ pad(active + 1) }}</span>
          <span class="text-[12px]/[1.4] uppercase tracking-[1.5px] text-[#18181899]">{{ t(`about.events.${current.id}.location`) }}</span>
          <!-- Big two-line title. On wide screens it runs over the photo: the part over the
               photo is drawn by a white copy clipped to the photo's area. -->
          <span class="relative z-20 block lg:max-w-160 xl:w-[600px] xl:max-w-none">
            <span
              ref="titleEl"
              class="block font-heading text-[40px]/[1.02] tracking-[-0.03em] [--fit-max:46px] md:[--fit-max:64px] lg:[--fit-max:72px] xl:[--fit-max:80px]"
            >{{ t(`about.events.${current.id}.title`) }}</span>
            <span
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 font-heading leading-[1.02] tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]"
              :style="{ fontSize: titleSize, clipPath: `inset(0 0 0 ${overlapX}px)` }"
            >{{ t(`about.events.${current.id}.title`) }}</span>
          </span>
          <div class="mt-2 flex items-center justify-between gap-6 xl:flex-col xl:items-start xl:gap-10">
            <button
              type="button"
              @click="openModal"
              aria-haspopup="dialog"
              class="inline-flex cursor-pointer items-center gap-2.5 border-b border-[#181818] pb-1 text-[13px]/[1.2] uppercase tracking-[0.5px] transition-opacity hover:opacity-60"
            >
              {{ t('about.projectsMore') }}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 13L13 3M5 3h8v8" stroke="currentColor" stroke-width="1.3" />
              </svg>
            </button>
            <div class="flex gap-2.5">
              <button
                v-for="dir in [-1, 1]"
                :key="dir"
                type="button"
                @click="go(dir)"
                :aria-label="dir < 0 ? 'Previous' : 'Next'"
                class="inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-[#18181833] transition-colors hover:border-[#181818] hover:bg-[#181818] hover:text-white lg:size-14"
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
          class="order-1 pr-[calc(var(--peek)*2)] [--peek:18px] md:[--peek:30px] lg:mx-auto lg:w-full lg:max-w-190 lg:[--peek:36px] xl:order-2 xl:mr-0 xl:ml-auto xl:max-w-200 xl:[--peek:40px]"
          @touchstart.passive="onTouchStart"
          @touchend="onTouchEnd"
        >
          <div ref="stackEl" class="relative aspect-[3/2]">
            <button
              v-for="(p, i) in projects"
              :key="p.id"
              type="button"
              @click="openModal"
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

    </div>

    <!-- Project details popup -->
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div v-if="open" class="fixed inset-0 z-30 flex items-center justify-center lg:p-10">
          <div class="absolute inset-0 bg-[#080a10b8] backdrop-blur-[3px]" @click="close" aria-hidden="true"></div>

          <div
            role="dialog"
            aria-modal="true"
            :aria-label="t(`about.events.${current.id}.title`)"
            class="relative flex h-full w-full flex-col overflow-y-auto bg-[#f8f8f5] text-[#181818] lg:grid lg:h-[min(760px,100%)] lg:max-w-300 lg:grid-cols-[1.15fr_1fr] lg:overflow-hidden lg:shadow-[0_40px_100px_rgba(0,0,0,0.4)]"
          >
            <!-- Mobile / tablet top bar -->
            <div class="sticky top-0 z-10 flex shrink-0 items-center justify-between bg-[#f8f8f5] py-3 pr-3 pl-5 md:py-4 md:pr-4 md:pl-7 lg:hidden">
              <span class="text-[12px]/[1.4] uppercase tracking-[1.5px] text-[#18181880]">{{ pad(active + 1) }} / {{ pad(total) }}</span>
              <button type="button" @click="close" :aria-label="t('bookModal.close')" class="flex size-12 cursor-pointer items-center justify-center bg-[#181818] text-white md:size-13">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="1.6" /></svg>
              </button>
            </div>

            <!-- Photos -->
            <div class="flex shrink-0 flex-col gap-3.5 px-3 md:px-4 lg:min-h-0 lg:p-5">
              <div class="relative aspect-[3/2] overflow-hidden bg-[#111] lg:aspect-auto lg:min-h-0 lg:flex-1">
                <Transition mode="out-in" enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-150" enter-from-class="opacity-0" leave-to-class="opacity-0">
                  <img :key="images[activeImage]" :src="images[activeImage]" :alt="t(`about.events.${current.id}.title`)" class="absolute inset-0 size-full object-cover" />
                </Transition>
                <template v-if="images.length > 1">
                  <div class="absolute bottom-4 left-4 flex gap-2">
                    <button
                      v-for="dir in [-1, 1]"
                      :key="dir"
                      type="button"
                      @click="stepImage(dir)"
                      class="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/50 text-white transition-colors hover:bg-white hover:text-[#181818]"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path :d="dir < 0 ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'" stroke="currentColor" stroke-width="1.4" /></svg>
                    </button>
                  </div>
                  <span class="absolute right-4 bottom-4 text-[12px] tracking-[1px] text-white">{{ activeImage + 1 }} / {{ images.length }}</span>
                </template>
              </div>
              <div v-if="images.length > 1" class="flex gap-2.5">
                <button
                  v-for="(src, gi) in images"
                  :key="src + gi"
                  type="button"
                  @click="activeImage = gi"
                  class="aspect-[3/2] flex-1 cursor-pointer overflow-hidden outline-offset-2 transition-opacity md:w-24 md:flex-none"
                  :class="gi === activeImage ? 'opacity-100 outline-2 outline-[#181818]' : 'opacity-55 hover:opacity-100'"
                >
                  <img :src="src" alt="" class="size-full object-cover" loading="lazy" />
                </button>
              </div>
            </div>

            <!-- Text -->
            <div class="relative flex flex-1 flex-col px-5 pt-8 pb-6 md:px-7 md:pt-10 md:pb-8 lg:min-h-0 lg:overflow-y-auto lg:pt-16 lg:pr-14 lg:pb-10 lg:pl-9">
              <button type="button" @click="close" :aria-label="t('bookModal.close')" class="absolute top-6 right-6 hidden size-12 cursor-pointer items-center justify-center rounded-full border border-[#18181826] transition-colors hover:bg-[#181818] hover:text-white lg:flex">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="1.4" /></svg>
              </button>
              <Transition mode="out-in" enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-150" enter-from-class="opacity-0" leave-to-class="opacity-0">
                <div :key="current.id" class="flex flex-col gap-5 lg:gap-5.5 lg:pr-10">
                  <span class="text-[12px]/[1.4] uppercase tracking-[1.5px] text-[#18181880]">{{ t(`about.events.${current.id}.location`) }} · {{ current.date }}</span>
                  <span class="font-heading text-[32px]/[1.08] tracking-[-1px] md:text-[40px]/[1.06] lg:text-[46px]/[1.05] lg:tracking-[-1.6px]">{{ t(`about.events.${current.id}.title`) }}</span>
                  <div class="flex flex-col gap-3.5">
                    <p v-for="(para, pi) in paragraphs" :key="pi" class="text-[15px]/[1.6] font-normal text-[#181818b3] lg:text-[16px]/[1.6]">{{ para }}</p>
                  </div>
                  <div v-if="current.tags?.length" class="flex flex-wrap gap-2">
                    <span v-for="tag in current.tags" :key="tag" class="rounded-full border border-[#18181826] px-3.5 py-2 text-[13px]/[1]">{{ t(`about.eventTags.${tag}`) }}</span>
                  </div>
                </div>
              </Transition>
              <div class="mt-auto flex items-center justify-between gap-4 border-t border-[#18181818] pt-5 lg:pt-5.5">
                <button type="button" @click="go(-1)" class="inline-flex cursor-pointer items-center gap-2.5 text-[13px]/[1.2] uppercase text-[#18181899] transition-colors hover:text-[#181818]">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 3L5 9l6 6" stroke="currentColor" stroke-width="1.4" /></svg>
                  {{ t('about.projectsPrev') }}
                </button>
                <button type="button" @click="go(1)" class="inline-flex cursor-pointer items-center gap-2.5 text-[13px]/[1.2] uppercase transition-opacity hover:opacity-60">
                  {{ t('about.projectsNext') }}
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 3l6 6-6 6" stroke="currentColor" stroke-width="1.4" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
