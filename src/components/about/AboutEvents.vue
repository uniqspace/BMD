<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, type Directive } from 'vue'
import { useI18n } from 'vue-i18n'
import events from '@/data/events.json'
import LoadingIcon from '../icons/LoadingIcon.vue'

interface EventItem {
  id: string
  date: string
  image: string
  tags: string[]
}

const INITIAL_COUNT = 5
const CLOSING_DURATION = 600

const { t } = useI18n()

const openIds = reactive(new Set<string>())
const isOpen = (id: string) => openIds.has(id)

const showAll = ref(false)
const isLoading = ref(false)
const isDesktop = ref(true)

const updateIsDesktop = () => {
  isDesktop.value = window.innerWidth >= 1024
}

const visibleEvents = computed<EventItem[]>(() =>
  showAll.value ? events : events.slice(0, INITIAL_COUNT)
)

// Keep a slower colour transition on the row that is closing
const closingId = ref<string | null>(null)
let closingTimer: ReturnType<typeof setTimeout> | null = null

const markClosing = (id: string) => {
  closingId.value = id
  if (closingTimer) clearTimeout(closingTimer)
  closingTimer = setTimeout(() => {
    closingId.value = null
    closingTimer = null
  }, CLOSING_DURATION)
}

const toggle = (id: string) => {
  if (openIds.has(id)) {
    openIds.delete(id)
    markClosing(id)
    return
  }

  // On desktop only one event can be open at a time
  if (isDesktop.value) {
    openIds.forEach((openId) => {
      openIds.delete(openId)
      markClosing(openId)
    })
  }

  openIds.add(id)
}

function loadAll() {
  if (isLoading.value) return

  isLoading.value = true
  setTimeout(() => {
    showAll.value = true
    isLoading.value = false
  }, 1000)
}

onMounted(() => {
  updateIsDesktop()
  window.addEventListener('resize', updateIsDesktop)
})

onUnmounted(() => window.removeEventListener('resize', updateIsDesktop))

const paragraphs = (id: string) => t(`about.events.${id}.description`).split('\n\n')

// Reveal rows as they scroll into view
const revealed = reactive<Record<string, boolean>>({})

const vReveal: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealed[binding.value] = true
          observer.unobserve(el)
        }
      })
    }, { threshold: 0, rootMargin: '0px 0px -20% 0px' })

    observer.observe(el)
  },
}
</script>

<template>
  <section id="events" class="scroll-mt-[var(--header-height)] overflow-x-clip py-20 lg:scroll-mt-0 lg:py-22.5">
    <div class="container">
      <div class="mx-auto flex max-w-261 flex-col items-center gap-12 lg:gap-15">
        <h2 class="w-full text-left text-[34px]/[100%] tracking-tight md:text-center md:text-[45px]/[100%] lg:text-[50px]/[100%] lg:tracking-[-3px]">{{ t('about.eventsTitle') }}</h2>

        <div class="w-[calc(100%+70px)] md:w-full">
          <div
            v-for="(event, index) in visibleEvents"
            :key="event.id"
            v-reveal="event.id"
            :style="{ '--reveal-delay': (index % INITIAL_COUNT) * 0.1 + 's' }"
            :class="[
              'event-row group transition-colors duration-300 px-8.75 md:px-0 first:[&_button]:border-t',
              [
                isOpen(event.id) ? 'bg-[#181818] border-y border-[#a1a1a126]' : 'hover:bg-[#181818]',
                { 'is-visible': revealed[event.id], closing: closingId === event.id },
              ],
            ]"
          >
            <button
              type="button"
              @click="toggle(event.id)"
              :aria-expanded="isOpen(event.id)"
              class="flex w-full cursor-pointer items-center gap-5 px-5 py-8 text-left border-b border-[#18181826] md:px-10 lg:gap-25 lg:px-20"
            >
              <div class="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-0">
                <span :class="['text-[16px]/[100%] font-medium tracking-[-0.48px] transition-colors md:w-20 md:shrink-0', isOpen(event.id) ? 'text-white' : 'text-[#181818] group-hover:text-white']">{{ event.date }}</span>
                <span :class="['font-heading text-[22px]/[100%] tracking-[-1.56px] transition-colors md:ms-10 lg:ms-20 lg:text-[26px]/[100%]', isOpen(event.id) ? 'text-white' : 'text-[#181818] group-hover:text-white']">{{ t(`about.events.${event.id}.title`) }}</span>
                <span :class="['hidden text-[16px]/[1.3] font-medium uppercase tracking-[-0.48px] transition-colors lg:block lg:ms-auto', isOpen(event.id) ? 'text-white/50' : 'text-[#18181880] group-hover:text-white/50']">{{ t(`about.events.${event.id}.location`) }}</span>
              </div>

              <span :class="['shrink-0 self-center transition-all duration-300', [isOpen(event.id) ? 'rotate-180' : '', isOpen(event.id) ? 'text-white' : 'text-[#181818] group-hover:text-white']]">
                <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 1V16M1 10L7 16L13 10" stroke="currentColor" stroke-width="2" />
                </svg>
              </span>
            </button>

            <div :class="['grid transition-all duration-500 ease-out', isOpen(event.id) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]']">
              <div class="overflow-hidden">
                <div class="px-5 pb-10 md:px-10 lg:px-20">
                  <div class="flex flex-col gap-10 border-t border-white/15 pt-10 lg:flex-row lg:justify-between lg:gap-5">
                    <div class="flex flex-col gap-10 lg:w-106">
                      <div class="flex flex-col gap-4">
                        <p v-for="(paragraph, pIndex) in paragraphs(event.id)" :key="pIndex" class="text-[14px]/[1.3] font-normal tracking-[-0.42px] text-white/90">{{ paragraph }}</p>
                      </div>

                      <div v-if="event.tags?.length" class="flex flex-wrap items-center gap-2.5">
                        <span v-for="tag in event.tags" :key="tag" class="bg-white/10 px-4 py-2.5 text-[14px]/[100%] font-medium tracking-[-0.42px] text-white">{{ t(`about.eventTags.${tag}`) }}</span>
                      </div>
                    </div>

                    <div class="shrink-0">
                      <img :src="event.image" :alt="t(`about.events.${event.id}.title`)" class="h-[338px] w-full object-cover lg:w-97.5">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          v-if="!showAll && events.length > INITIAL_COUNT"
          type="button"
          @click="loadAll"
          :disabled="isLoading"
          class="relative flex h-14.5 cursor-pointer items-center justify-center bg-[#181818] px-8 text-[14px]/[100%] font-semibold uppercase tracking-[-0.42px] text-white"
        >
          <span v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-[#181818]">
            <LoadingIcon class="size-4" />
          </span>
          {{ t('about.eventsBtn') }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.event-row {
  opacity: 0;
  transform: translateX(-30px);
  transition:
    opacity 0.5s ease-out var(--reveal-delay, 0s),
    transform 0.5s ease-out var(--reveal-delay, 0s),
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;
}

.event-row.is-visible {
  opacity: 1;
  transform: translateX(0);
}

.event-row.closing {
  transition:
    opacity 0.5s ease-out var(--reveal-delay, 0s),
    transform 0.5s ease-out var(--reveal-delay, 0s),
    background-color 0.6s ease,
    border-color 0.6s ease,
    color 0.6s ease;
}

.event-row.closing span {
  transition-duration: 0.6s !important;
}

@media (prefers-reduced-motion: reduce) {
  .event-row {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
