<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import VideoModal from './VideoModal.vue'
import PlayIcon from '../icons/PlayIcon.vue'
import ArrowLeftIcon from '../icons/ArrowLeftIcon.vue'
import ArrowRightIcon from '../icons/ArrowRightIcon.vue'

interface Project {
  coverPhoto: { src: string; alt: string }
  video: { src: string; type: string } | null
}

const props = defineProps<{
  projects?: Project[]
}>()

const items = computed(() => props.projects ?? [])

const isVideoOpen = ref(false)
const activeIndex = ref(1)
const viewportRef = ref<HTMLElement | null>(null)
const viewportWidth = ref(0)
const isReady = ref(false)

const sizes = reactive({
  activeW: 834,
  activeH: 487,
  sideW: 439,
  sideH: 353,
  gap: 20,
})

function updateSizes() {
  const width = window.innerWidth

  if (width >= 1024) {
    sizes.activeW = 835
    sizes.activeH = 530
    sizes.sideW = 600
    sizes.sideH = 355
    sizes.gap = 20
  } else if (width >= 768) {
    sizes.activeW = 648
    sizes.activeH = 379
    sizes.sideW = 302
    sizes.sideH = 244
    sizes.gap = 20
  } else {
    sizes.activeW = 305
    sizes.activeH = 219
    sizes.sideW = 192
    sizes.sideH = 154
    sizes.gap = 16
  }
}

function onResize() {
  updateSizes()
  viewportWidth.value = viewportRef.value?.clientWidth ?? window.innerWidth
}

// Shift the track so the active slide is centered in the viewport
const translateX = computed(() => {
  const activeCenter = activeIndex.value * (sizes.sideW + sizes.gap) + sizes.activeW / 2
  return viewportWidth.value / 2 - activeCenter
})

function slideStyle(index: number) {
  const isActive = index === activeIndex.value
  return {
    width: `${isActive ? sizes.activeW : sizes.sideW}px`,
    height: `${isActive ? sizes.activeH : sizes.sideH}px`,
  }
}

const activeProject = computed(() => items.value[activeIndex.value])

function prev() {
  if (activeIndex.value > 0) activeIndex.value--
}

function next() {
  if (activeIndex.value < items.value.length - 1) activeIndex.value++
}

function onSlideClick(index: number) {
  if (index !== activeIndex.value) {
    activeIndex.value = index
    return
  }

  if (items.value[index]?.video) isVideoOpen.value = true
}

let touchStartX = 0

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0]?.clientX ?? 0
}

function onTouchEnd(e: TouchEvent) {
  const diff = (e.changedTouches[0]?.clientX ?? touchStartX) - touchStartX
  if (Math.abs(diff) > 40) {
    diff < 0 ? next() : prev()
  }
}

onMounted(() => {
  onResize()
  requestAnimationFrame(() => {
    isReady.value = true
  })
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="mb-17.5 overflow-hidden lg:mb-22.5">
    <div class="container">
      <div
        ref="viewportRef"
        class="projects-slider"
        :style="{ height: `${sizes.activeH}px` }"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <div
          :class="['projects-track', { 'is-ready': isReady }]"
          :style="{ transform: `translateX(${translateX}px)`, gap: `${sizes.gap}px` }"
        >
          <div
            v-for="(project, index) in items"
            :key="index"
            :class="['projects-slide', { active: index === activeIndex }]"
            :style="slideStyle(index)"
            @click="onSlideClick(index)"
          >
            <img class="w-full h-full object-cover" :src="project.coverPhoto.src" :alt="project.coverPhoto.alt">

            <div v-if="project.video && index === activeIndex" class="play-icon cursor-pointer bg-white rounded-full absolute left-1/2 top-1/2 p-3.25 md:p-5.5">
              <PlayIcon class="size-4.75" />
            </div>
          </div>
        </div>
      </div>

      <VideoModal
        v-if="activeProject && activeProject.video"
        :open="isVideoOpen"
        @update:open="isVideoOpen = !!$event"
        :video-src="activeProject.video.src"
        :video-type="activeProject.video.type"
      />

      <div class="gap-7.5 hidden justify-center items-center mt-7.5 lg:flex">
        <ArrowLeftIcon class="cursor-pointer" @click="prev" />
        <ArrowRightIcon class="cursor-pointer" @click="next" />
      </div>
    </div>
  </div>
</template>

<style>
.projects-slider {
  width: 100%;
  overflow: visible;
  display: flex;
  align-items: center;
}

.projects-track {
  display: flex;
  align-items: center;
  will-change: transform;
}

.projects-track.is-ready,
.projects-track.is-ready .projects-slide {
  transition: transform 0.5s ease, width 0.5s ease, height 0.5s ease, opacity 0.5s ease;
}

.projects-slide {
  position: relative;
  flex: 0 0 auto;
  opacity: 0.5;
  cursor: pointer;
}

.projects-slide.active {
  opacity: 1;
  cursor: default;
  z-index: 2;
}

@media (min-width: 1024px) {
  .projects-slide:not(.active):hover {
    opacity: 1;
  }
}

.projects-slide .play-icon {
  transform: translate(-50%, -50%) scale(1);
  transition: transform 0.3s ease;
}

.projects-slide.active:hover .play-icon {
  transform: translate(-50%, -50%) scale(1.2);
}
</style>
