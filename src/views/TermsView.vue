<script setup lang="ts">
    import { computed } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { t, tm, rt } = useI18n()

    // Computed so the text re-renders when the locale changes.
    const content = computed(() =>
        (tm('Terms.content') as Array<{ title: unknown, text: unknown[] }>).map(block => ({
            title: rt(block.title as string),
            text: block.text.map(paragraph => rt(paragraph as string)),
        })),
    )
</script>

<template>
    <section class="pb-16.25 pt-5 md:pb-17.5 lg:pb-33.75 lg:pt-18.75">
        <div class="container">
            <div class="max-w-155.25">
                <h1 class="text-start w-full text-[32px]/[100%] mb-7.5 md:mb-10 md:text-[45px] lg:text-[70px]">{{ t('Terms.title') }}</h1>

                <div class="flex flex-col gap-7.5 md:gap-10">
                    <div
                        v-for="(block, index) in content"
                        :key="index"
                    >
                        <h2 class="text-[14px]/[130%] font-body uppercase font-semibold mb-3.75 md:mb-5">
                            {{ block.title }}
                        </h2>

                        <div class="flex flex-col gap-3.75">
                            <p
                                v-for="(paragraph, pIndex) in block.text"
                                :key="pIndex"
                                class="text-[14px]/[130%] font-normal text-[#181818cc]"
                                v-html="paragraph"
                            />
                        </div>
                    </div>
                </div>

                <p class="mt-12.5 pt-6 border-t border-[#18181826] text-[13px]/[130%] text-[#6b6b6b] md:mt-15">{{ t('Terms.updated') }}</p>
            </div>
        </div>
    </section>
</template>
