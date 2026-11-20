<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCategoryStore } from '@/store/category'
import singers from '@/data/singers.json'
import { useI18n } from 'vue-i18n'
import ArrowRightIcon from './icons/ArrowRightIcon.vue'
import { RouterLink } from 'vue-router'
import type { Singer } from '../types'
import BookArtistModal from './BookArtistModal.vue'

// The last card: "name any artist and we'll bring them". For now it opens the
// booking form; a dedicated popup comes later.
const isBookOpen = ref(false)

const { t } = useI18n()
const categoryStore = useCategoryStore()

// Stagger only the first rows of cards so the grid doesn't fade in for too long
const ANIMATION_STEP_COUNT = 9

// Artists that always stay at the end of the list, in this order
const PINNED_LAST = ['silkband', 'Ben']

// Shuffle once per visit so the order changes on every page load
function shuffle<T>(list: T[]): T[] {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}

const allSingers = singers as Singer[]
const orderedSingers: Singer[] = [
  ...shuffle(allSingers.filter(singer => !PINNED_LAST.includes(singer.id))),
  ...PINNED_LAST.map(id => allSingers.find(singer => singer.id === id)).filter((s): s is Singer => !!s),
]

// Filter singers by selected category
const filteredSingers = computed<Singer[]>(() => {
  if (categoryStore.currentCategory === 'viewAll') {
    return orderedSingers
  }

  return orderedSingers.filter(singer =>
    singer.categoryIds.includes(categoryStore.currentCategory)
  )
})
</script>

<template>
    <div class="mb-16.25 md:mb-17.5 lg:mb-22.5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-7.5 md:gap-y-10 lg:gap-y-15">
            <div  
                v-for="(singer, index) in filteredSingers"
                :key="categoryStore.currentCategory + '-' + singer.id"
                :style="{ animationDelay: Math.min(index, ANIMATION_STEP_COUNT) * 0.08 + 's' }"
                class="card-in w-full flex flex-col gap-3 relative  hover:[&_svg]:ml-2"
            >   
                <div class="flex gap-2 absolute z-10 top-6.5 left-6.5">
                    <span
                        v-for="catId in singer.categoryIds"
                        class="px-3 py-1.5 text-sm text-white border border-[#FFFFFF4D]"
                    >
                        {{ t(`categories.${catId}`) }}
                    </span>
                </div>
    
                <RouterLink :to="'/singers/' + singer.id" class="w-full h-92.5 transition-all duration-300  hover:opacity-80 md:h-101.5 lg:h-124.25">
                    <img class="w-full h-full object-cover" :src="singer.image" :style="{ objectPosition: singer.imagePosition }" :alt="t(singer.nameKey)" :loading="index < 3 ? 'eager' : 'lazy'" decoding="async">
                </RouterLink>
                
                <RouterLink :to="'/singers/' + singer.id" class="flex gap-3 items-center ">
                    <h4 class="text-[18px] md:text-[22px] uppercase">{{ t(singer.nameKey) }}</h4>
                    <ArrowRightIcon class="transition-all duration-300" />
                </RouterLink>
            </div>

            <!-- "Any artist" card: always last -->
            <div
                :key="categoryStore.currentCategory + '-any'"
                :style="{ animationDelay: Math.min(filteredSingers.length, ANIMATION_STEP_COUNT) * 0.08 + 's' }"
                class="card-in group w-full flex flex-col gap-3 relative hover:[&_.arrow]:ml-2"
            >
                <button
                    type="button"
                    @click="isBookOpen = true"
                    class="relative w-full h-92.5 md:h-101.5 lg:h-124.25 cursor-pointer overflow-hidden bg-[#181818] text-left text-white flex flex-col justify-between p-6.5 lg:p-8"
                >
                    <span class="self-start px-3 py-1.5 text-sm border border-[#FFFFFF4D]">{{ t('anyArtist.tag') }}</span>
                    <span
                        aria-hidden="true"
                        class="absolute right-6.5 top-6.5 size-14 rounded-full border border-white/30 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-[#181818] group-hover:rotate-90 lg:right-8 lg:top-8"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3v14M3 10h14" stroke="currentColor" stroke-width="1.5" /></svg>
                    </span>
                    <span class="flex flex-col gap-4 lg:gap-5">
                        <span v-html="t('anyArtist.title')" class="font-heading text-[34px]/[1.05] tracking-[-1px] md:text-[38px]/[1.05] lg:text-[44px]/[1.04] lg:tracking-[-1.5px]" />
                        <span class="font-normal text-[15px]/[1.5] text-white/65 lg:text-[16px]/[1.5]">{{ t('anyArtist.text') }}</span>
                    </span>
                </button>
                <button type="button" @click="isBookOpen = true" class="flex gap-3 items-center cursor-pointer text-left">
                    <h4 class="text-[18px] md:text-[22px] uppercase">{{ t('anyArtist.cta') }}</h4>
                    <ArrowRightIcon class="arrow transition-all duration-300" />
                </button>
            </div>
        </div>
    
        <BookArtistModal v-model:open="isBookOpen" />
    </div>
</template>

<style scoped>
@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-in {
  animation: card-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .card-in {
    animation: none;
  }
}
</style>
