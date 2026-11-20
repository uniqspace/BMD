<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  // "Услуги" (design: Services 8). Big list of service names. Desktop: hovering a
  // name lights it up and a photo with a short description floats next to the
  // cursor. Tablet / mobile: tapping a name opens its photo and description inline.
  const { t, tm, rt } = useI18n()

  const IMAGES = [
    '/images/events/raqs-festival.webp',
    '/images/events/independence-day.webp',
    '/images/events/luna-hilton.webp',
    '/images/events/afterparty-blackcoffee.webp',
    '/images/events/sco-show.webp',
    '/images/events/sharq-taronalari.webp',
    '/images/events/futsal-championship.webp',
  ]
  type Item = { title: string; text: string }
  const items = computed(() =>
    (tm('about.services.items') as Record<string, unknown>[]).map((it, i) => ({
      title: rt(it.title as string),
      text: rt(it.text as string),
      image: IMAGES[i % IMAGES.length]!,
    })) as (Item & { image: string })[],
  )

  const active = ref<number | null>(null) // hovered row (desktop)
  const opened = ref<number | null>(null) // tapped row (tablet / mobile)
  const listEl = ref<HTMLElement | null>(null)
  const pos = ref({ x: 0, y: 0 })

  function onMove(e: MouseEvent) {
    const box = listEl.value?.getBoundingClientRect()
    if (!box) return
    const W = 280
    const x = Math.min(e.clientX - box.left + 40, box.width - W)
    const y = Math.max(-40, Math.min(e.clientY - box.top - 180, box.height - 300))
    pos.value = { x, y }
  }
  const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <section id="services" class="bg-white pt-5 pb-15 md:pb-20 lg:pt-10 lg:pb-27.5">
    <div class="container">
      <div class="flex flex-col gap-4 md:gap-4.5">
        <span class="text-[12px]/[100%] uppercase tracking-[3px] text-[#18181880]">{{ t('about.services.eyebrow') }}</span>
        <h2
          v-html="t('about.services.title')"
          class="font-heading font-normal text-[36px]/[1.05] tracking-[-1.2px] md:text-[48px]/[1.05] md:tracking-[-1.6px] lg:text-[56px]/[1.02] lg:tracking-[-2px]"
        />
      </div>

      <div
        ref="listEl"
        class="relative mt-10 border-b border-[#1818181f] md:mt-12 lg:mt-14"
        @mousemove="onMove"
        @mouseleave="active = null"
      >
        <div v-for="(item, i) in items" :key="i" class="border-t border-[#1818181f]">
          <button
            type="button"
            class="group flex w-full cursor-pointer items-baseline justify-between gap-6 py-5 text-left md:py-6 lg:cursor-default lg:py-5.5"
            :aria-expanded="opened === i"
            @mouseenter="active = i"
            @click="opened = opened === i ? null : i"
          >
            <span
              class="font-heading text-[26px]/[1.08] tracking-[-0.8px] transition-colors duration-300 md:text-[34px]/[1.05] md:tracking-[-1.1px] lg:text-[40px]/[1] lg:tracking-[-1.4px] xl:text-[46px]/[1] xl:tracking-[-1.6px]"
              :class="[
                active === i || opened === i ? 'text-[#181818]' : active === null ? 'text-[#181818] lg:text-[#181818b3]' : 'text-[#18181840]',
                active === i && 'lg:italic',
              ]"
            >{{ item.title }}</span>
            <span class="flex shrink-0 items-center gap-3 text-[13px] text-[#18181866]">
              {{ pad(i + 1) }}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="transition-transform duration-300 lg:hidden" :class="opened === i ? 'rotate-45' : ''"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.3" /></svg>
            </span>
          </button>

          <!-- Tablet / mobile: photo + description open under the row -->
          <div class="grid transition-[grid-template-rows] duration-500 ease-out lg:hidden" :class="opened === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
            <div class="overflow-hidden">
              <div class="flex flex-col gap-4 pb-6 md:flex-row md:gap-6 md:pb-8">
                <img :src="item.image" :alt="item.title" loading="lazy" class="aspect-[3/2] w-full object-cover md:w-80 md:shrink-0" />
                <p class="font-normal text-[15px]/[1.55] text-[#181818b3]">{{ item.text }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop: floating photo next to the cursor -->
        <div
          class="pointer-events-none absolute top-0 left-0 z-10 hidden w-70 transition-[opacity,transform] duration-500 ease-out lg:block"
          :class="active === null ? 'opacity-0' : 'opacity-100'"
          :style="{ transform: `translate(${pos.x}px, ${pos.y}px) rotate(-3deg) scale(${active === null ? 0.92 : 1})` }"
        >
          <div class="relative aspect-[4/5] overflow-hidden bg-[#111] shadow-[0_30px_60px_rgba(0,0,0,0.25)]">
            <img
              v-for="(item, i) in items"
              :key="i"
              :src="item.image"
              alt=""
              class="absolute inset-0 size-full object-cover transition-opacity duration-400"
              :class="active === i ? 'opacity-100' : 'opacity-0'"
            />
          </div>
          <p class="mt-4 bg-white/90 font-normal text-[14px]/[1.5] text-[#181818]">{{ active !== null ? items[active]?.text : '' }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
