<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref, toRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBodyScrollLock } from '@/composables/useBodyScrollLock';
import { cn } from '@/lib/cn';
import Spinner from './icons/Spinner.vue';
import TIckIcon from './icons/TIckIcon.vue';

const API_URL = "https://the-show-time.agency/api"
const PHONE = { href: 'tel:+998992226632', label: '+998 99 222 66 32' }

const { t } = useI18n()

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const form = reactive({ name: '', tel: '', message: '' })
const errors = reactive({ name: false, tel: false, message: false })
const shake = ref(false)
const isLoading = ref(false)
const isSuccess = ref<boolean | null>(null)
const nameInput = ref<HTMLInputElement | null>(null)

type Field = keyof typeof form

function onInput(field: Field) {
    errors[field] = false
}

function close() {
    emit('update:open', false)
}

async function onSubmit(e: Event) {
    e.preventDefault()

    const name = form.name.trim()
    const tel = form.tel.trim()
    const message = form.message.trim()

    errors.name = !name
    errors.tel = !tel
    errors.message = !message

    if (errors.name || errors.tel || errors.message) {
        // Restart the shake animation on every failed submit
        shake.value = false
        requestAnimationFrame(() => {
            shake.value = true
        })
        return
    }

    try {
        isLoading.value = true
        const res = await fetch(`${API_URL}/send-to-telegram`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, tel, message }),
        })
        isSuccess.value = res.ok
    } catch {
        isSuccess.value = false
    } finally {
        isLoading.value = false
    }
}

function reset() {
    form.name = ''
    form.tel = ''
    form.message = ''
    errors.name = errors.tel = errors.message = false
    shake.value = false
    isLoading.value = false
    isSuccess.value = null
}

useBodyScrollLock(toRef(props, 'open'))

// Slide-in drawer only on desktop (lg+); on mobile/tablet the popup just appears
const desktopMq = typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)') : null
const isDesktop = ref(desktopMq?.matches ?? true)
function onMqChange(e: MediaQueryListEvent) { isDesktop.value = e.matches }

watch(
  () => props.open,
  async (open) => {
    if (open) {
      // Keep what the visitor typed if they close and reopen without sending
      if (isSuccess.value !== null) reset()
      shake.value = false
      await nextTick()
      // Autofocus on desktop only: on phones/tablets it pops the keyboard and iOS pans the
      // whole popup up, so the logo no longer lines up with the header
      if (isDesktop.value) nameInput.value?.focus({ preventScroll: true })
    }
  }
)

function onKeydown(e: KeyboardEvent) {
    if (props.open && e.key === 'Escape') close()
}


onMounted(() => {
    window.addEventListener('keydown', onKeydown)
    desktopMq?.addEventListener('change', onMqChange)
})
onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
    desktopMq?.removeEventListener('change', onMqChange)
})

const fieldClass = 'w-full bg-[#F3F3F3] border-0 outline-none text-[#181818] placeholder:text-[#8f8f8f] font-normal text-[16px]/[130%] px-5 py-4.5 md:px-5.5 md:py-5 transition-shadow duration-200'
const errorClass = 'shadow-[inset_0_0_0_1.5px_#e5484d]'
</script>

<template>
    <Teleport to="body">
        <Transition name="drawer" :duration="isDesktop ? { enter: 450, leave: 300 } : 0">
            <div v-if="open" class="fixed inset-0 z-30">
                <div class="drawer-backdrop absolute inset-0 bg-[#18181880]" @click="close" aria-hidden="true"></div>

                <div
                    role="dialog"
                    aria-modal="true"
                    :aria-label="t('bookModal.title')"
                    class="drawer-panel absolute top-0 right-0 h-full w-full bg-white flex flex-col overflow-y-auto px-3 pt-3 pb-6 md:px-4 md:pt-4 md:pb-10 lg:w-140 lg:px-14 lg:pt-10"
                >
                    <!-- Mobile/tablet: same geometry as the header bar, so the logo doesn't jump on open.
                         shrink-0 matters: in this flex column a tall form would otherwise squash the row. -->
                    <div class="shrink-0 flex items-center justify-between h-16 pl-5 pr-2 md:h-17 md:pl-7 lg:hidden">
                        <span class="min-w-max font-bold text-[20px]/[100%] md:text-[22px]/[100%]">The Show Time</span>
                        <button
                            type="button"
                            @click="close"
                            class="h-11 flex items-center gap-3 text-[13px] uppercase cursor-pointer transition-opacity hover:opacity-60"
                        >
                            {{ t('bookModal.close') }}
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 3l14 14M17 3L3 17" stroke="currentColor" stroke-width="1.6"/></svg>
                        </button>
                    </div>

                    <!-- Desktop -->
                    <div class="hidden lg:flex shrink-0 items-center justify-between">
                        <span class="min-w-max font-bold text-[18px]/[100%]">The Show Time</span>
                        <button
                            type="button"
                            @click="close"
                            class="h-11 flex items-center gap-3 text-[13px] uppercase cursor-pointer transition-opacity hover:opacity-60"
                        >
                            {{ t('bookModal.close') }}
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 3l14 14M17 3L3 17" stroke="currentColor" stroke-width="1.6"/></svg>
                        </button>
                    </div>

                    <div class="flex-1 flex flex-col justify-center py-10 px-3 md:py-12 md:px-10 lg:px-0">
                        <form v-if="isSuccess === null" @submit="onSubmit" novalidate class="flex flex-col gap-8 md:gap-9">
                            <div class="flex flex-col gap-4 md:gap-4.5">
                                <h2 class="text-[40px]/[0.95] tracking-[-1.5px] md:text-[56px]/[0.95] md:tracking-[-2.5px]">{{ t('bookModal.title') }}</h2>
                                <p class="text-[14px]/[1.45] md:text-[15px]/[1.45] font-normal text-[#181818a6] max-w-100">{{ t('bookModal.desc') }}</p>
                            </div>

                            <div class="flex flex-col gap-3">
                                <label class="flex flex-col">
                                    <span class="sr-only">{{ t('bookModal.nameInput') }}</span>
                                    <input
                                        ref="nameInput"
                                        v-model="form.name"
                                        @input="onInput('name')"
                                        type="text"
                                        name="name"
                                        autocomplete="name"
                                        :placeholder="t('bookModal.nameInput')"
                                        :aria-invalid="errors.name"
                                        :class="cn(fieldClass, errors.name && errorClass)"
                                    >
                                </label>
                                <label class="flex flex-col">
                                    <span class="sr-only">{{ t('bookModal.telNumInput') }}</span>
                                    <input
                                        v-model="form.tel"
                                        @input="onInput('tel')"
                                        type="tel"
                                        name="tel"
                                        autocomplete="tel"
                                        :placeholder="t('bookModal.telNumInput')"
                                        :aria-invalid="errors.tel"
                                        :class="cn(fieldClass, errors.tel && errorClass)"
                                    >
                                </label>
                                <label class="flex flex-col">
                                    <span class="sr-only">{{ t('bookModal.messageInput') }}</span>
                                    <textarea
                                        v-model="form.message"
                                        @input="onInput('message')"
                                        name="message"
                                        :placeholder="t('bookModal.messageInput')"
                                        :aria-invalid="errors.message"
                                        :class="cn(fieldClass, 'h-32 md:h-35 resize-none', errors.message && errorClass)"
                                    ></textarea>
                                </label>
                            </div>

                            <button
                                type="submit"
                                :disabled="isLoading"
                                :class="cn(
                                    'relative w-full h-16 flex justify-center items-center bg-[#181818] text-white text-[14px]/[100%] font-semibold uppercase cursor-pointer transition-colors hover:bg-[#333333] disabled:cursor-wait',
                                    shake && 'form-error',
                                )"
                                @animationend="shake = false"
                            >
                                <Spinner v-if="isLoading" />
                                <span v-else>{{ t('btns.submitBtn') }}</span>
                            </button>
                        </form>

                        <div v-else class="flex flex-col items-start gap-5">
                            <TIckIcon v-if="isSuccess" />
                            <h2 class="text-[40px]/[1] tracking-[-1.5px] md:text-[48px]/[1] md:tracking-[-2px]">
                                {{ isSuccess ? t('bookModal.thankyouTitle') : t('bookModal.errorTitle') }}
                            </h2>
                            <p class="text-[15px]/[1.45] font-normal text-[#181818a6] max-w-90">
                                {{ isSuccess ? t('bookModal.thankyouDesc') : t('bookModal.errorDesc') }}
                            </p>
                            <button
                                v-if="!isSuccess"
                                type="button"
                                @click="isSuccess = null"
                                class="mt-2 bg-[#181818] text-white px-10 py-5 text-[14px] font-semibold uppercase cursor-pointer"
                            >{{ t('bookModal.tryAgain') }}</button>
                        </div>
                    </div>

                    <div class="shrink-0 flex justify-between items-center gap-4 border-t border-[#18181814] pt-5.5 mx-3 text-[13px] md:mx-10 md:text-[14px] lg:mx-0">
                        <span class="text-[#6b6b6b]">{{ t('bookModal.orCall') }}</span>
                        <a :href="PHONE.href" class="text-[#181818] transition-opacity hover:opacity-60">{{ PHONE.label }}</a>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.drawer-enter-active .drawer-backdrop,
.drawer-leave-active .drawer-backdrop {
    transition: opacity 0.3s ease;
}

.drawer-enter-from .drawer-backdrop,
.drawer-leave-to .drawer-backdrop {
    opacity: 0;
}

/* Slide-in from the right: desktop only */
@media (min-width: 1024px) {
    .drawer-enter-active .drawer-panel {
        transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .drawer-leave-active .drawer-panel {
        transition: transform 0.3s ease-in;
    }

    .drawer-enter-from .drawer-panel,
    .drawer-leave-to .drawer-panel {
        transform: translateX(100%);
    }
}

@media (max-width: 1023px) {
    .drawer-enter-active .drawer-backdrop,
    .drawer-leave-active .drawer-backdrop {
        transition: none;
    }
}

@media (prefers-reduced-motion: reduce) {
    .drawer-enter-active .drawer-panel,
    .drawer-leave-active .drawer-panel {
        transition: none;
    }
}
</style>
