<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBodyScrollLock } from '@/composables/useBodyScrollLock'

const props = defineProps<{
    images: { src: string, alt: string }[]
    index: number | null
}>()

const emit = defineEmits<{
    (e: 'update:index', value: number | null): void
}>()

const { t } = useI18n()

const isOpen = computed(() => props.index !== null)
const current = computed(() => (props.index !== null ? props.images[props.index] : undefined))

useBodyScrollLock(isOpen)

function close() {
    emit('update:index', null)
}

function go(step: number) {
    if (props.index === null || !props.images.length) return
    emit('update:index', (props.index + step + props.images.length) % props.images.length)
}

function onKeydown(e: KeyboardEvent) {
    if (!isOpen.value) return
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowLeft') go(-1)
    else if (e.key === 'ArrowRight') go(1)
}

let touchStartX = 0
function onTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0]?.clientX ?? 0
}
function onTouchEnd(e: TouchEvent) {
    const diff = (e.changedTouches[0]?.clientX ?? touchStartX) - touchStartX
    if (Math.abs(diff) > 40) go(diff < 0 ? 1 : -1)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-300"
            leave-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen && current"
                class="fixed inset-0 z-50 bg-[#111111f2] flex flex-col"
                role="dialog"
                aria-modal="true"
                @click.self="close"
                @touchstart.passive="onTouchStart"
                @touchend.passive="onTouchEnd"
            >
                <div class="flex items-center justify-between px-5 py-4 md:px-8 md:py-6 text-white">
                    <span class="text-[13px] md:text-[14px] tabular-nums">{{ (index ?? 0) + 1 }} / {{ images.length }}</span>
                    <button type="button" @click="close" :aria-label="t('artist.close')" class="size-12 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M2 2l18 18M20 2L2 20" stroke="currentColor" stroke-width="1.6"/></svg>
                    </button>
                </div>

                <div class="relative flex-1 min-h-0 flex items-center justify-center px-4 pb-6 md:px-24 md:pb-10" @click.self="close">
                    <img :key="current.src" :src="current.src" :alt="current.alt" class="max-w-full max-h-full object-contain select-none">

                    <template v-if="images.length > 1">
                        <button type="button" @click="go(-1)" :aria-label="t('artist.prevPhoto')" class="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 size-14 items-center justify-center border border-white/30 text-white cursor-pointer hover:bg-white hover:text-[#181818] transition-colors">
                            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true"><path d="M7 1L1 7l6 6M1 7h16" stroke="currentColor" stroke-width="1.6"/></svg>
                        </button>
                        <button type="button" @click="go(1)" :aria-label="t('artist.nextPhoto')" class="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 size-14 items-center justify-center border border-white/30 text-white cursor-pointer hover:bg-white hover:text-[#181818] transition-colors">
                            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true"><path d="M11 1l6 6-6 6M17 7H1" stroke="currentColor" stroke-width="1.6"/></svg>
                        </button>
                    </template>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
