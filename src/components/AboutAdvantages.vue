<script setup lang="ts">
  import { computed, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const advantages = [1, 2, 3, 4, 5, 6]

  // "Подход": light grey block, 1 column on mobile, 2 on tablet, 3x2 grid on desktop.
  // Animation (variant 6): the heading appears word by word when it scrolls into view,
  // then each cell's number and text rise in, staggered along the row.

  // Split the heading into words, keeping <i>…</i> words italic.
  const titleWords = computed(() =>
    (t('about.advTitle').match(/<i>.*?<\/i>|\S+/g) ?? []).flatMap((token) =>
      token.startsWith('<i>')
        ? token.replace(/<\/?i>/g, '').split(/\s+/).map((w) => ({ text: w, italic: true }))
        : [{ text: token, italic: false }],
    ),
  )

  const seen = reactive<Record<string, boolean>>({})
  // Cells that come into view together with the heading wait until it has appeared
  const extra = reactive<Record<string, number>>({})
  let headAt = 0
  const vReveal = {
    mounted(el: HTMLElement, binding: { value: string }) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            const now = performance.now()
            if (binding.value === 'head') headAt = now
            else if (now - headAt < 400 || !seen.head) extra[binding.value] = 1300
            seen[binding.value] = true
            io.disconnect()
          }
        },
        { rootMargin: '0px 0px -15% 0px' },
      )
      io.observe(el)
    },
  }

  const WORD_MS = 220
  // Cells start after the heading has had time to appear; then stagger along a row (3 per row on desktop)
  const cellDelay = (index: number) => `${(index % 3) * 240 + (extra['cell' + (index + 1)] ?? 0)}ms`
</script>

<template>
  <div class="flex flex-col gap-10 md:gap-14 lg:gap-18">
    <div v-reveal="'head'" class="flex flex-col items-center gap-4 text-center md:gap-5.5" :class="{ 'is-in': seen.head }">
      <span class="reveal-fade text-[12px]/[100%] uppercase tracking-[3px] text-[#18181880]">{{ t('about.advEyebrow') }}</span>
      <h2 class="font-heading font-normal text-[#181818] text-[36px]/[1.05] tracking-[-1.2px] md:text-[48px]/[1.05] md:tracking-[-1.6px] lg:text-[56px]/[1.05] lg:tracking-[-2px]">
        <template v-for="(w, wi) in titleWords" :key="wi">
          <span class="reveal-word" :style="{ transitionDelay: `${300 + wi * WORD_MS}ms` }"><i v-if="w.italic">{{ w.text }}</i><template v-else>{{ w.text }}</template></span>{{ ' ' }}
        </template>
      </h2>
    </div>

    <div class="grid grid-cols-1 border-b border-[#1818181f] md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(i, index) in advantages"
        :key="i"
        v-reveal="'cell' + i"
        :class="[
          'flex flex-col gap-8 border-t border-[#1818181f] py-8 md:gap-12 md:px-8 md:py-10 lg:gap-14 lg:px-10 lg:pt-11 lg:pb-12',
          index % 2 === 1 && 'md:max-lg:border-l',
          index % 3 !== 0 && 'lg:border-l',
          seen['cell' + i] && 'is-in',
        ]"
      >
        <span class="reveal-up font-heading text-[56px]/[0.9] tracking-[-2px] text-[#18181833] md:text-[64px]/[0.9] lg:text-[72px]/[0.9]" :style="{ transitionDelay: cellDelay(index) }">
          {{ String(i).padStart(2, '0') }}
        </span>
        <div class="reveal-up flex flex-col gap-2.5" :style="{ transitionDelay: `calc(${cellDelay(index)} + 240ms)` }">
          <p class="text-[18px]/[1.25] tracking-[-0.4px] text-[#181818] md:text-[20px]/[1.25]">{{ t(`about.slider.slide${i}.title`) }}</p>
          <p class="font-normal text-[15px]/[1.5] text-[#18181899]">{{ t(`about.slider.slide${i}.text`) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reveal-word {
  display: inline-block;
  opacity: 0;
  transform: translateY(0.45em);
  filter: blur(6px);
  transition: opacity 1.2s ease, transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), filter 1.2s ease;
}
.reveal-fade {
  opacity: 0;
  transition: opacity 1s ease;
}
.reveal-up {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 1.2s ease, transform 1.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.is-in .reveal-word,
.is-in .reveal-up,
.is-in.reveal-up {
  opacity: 1;
  transform: none;
  filter: none;
}
.is-in .reveal-fade {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .reveal-word,
  .reveal-fade,
  .reveal-up {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
}
</style>
