<script setup lang="ts">
import NotFound from "@/components/NotFound.vue"
import BookArtistModal from "@/components/BookArtistModal.vue"
import GalleryLightbox from "@/components/GalleryLightbox.vue"
import singers from "@/data/singers.json"
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import type { Singer } from '../types'

const { t, tm, te, rt } = useI18n()

const props = defineProps({
    id: String,
})

const allSingers = singers as Singer[]
const currentIndex = allSingers.findIndex(s => s.id == props.id)
const currentSinger: Singer | undefined = allSingers[currentIndex]
const key = currentSinger ? currentSinger.nameKey.split('.')[1] : ''

const isBookOpen = ref(false)
const lightboxIndex = ref<number | null>(null)

const name = computed(() => (currentSinger ? t(currentSinger.nameKey) : ''))

const tagline = computed(() => (te(`singers.${key}.tagline`) ? t(`singers.${key}.tagline`) : ''))

// Bio: the first sentence becomes the lead, the rest is split into two columns.
// Must be computed so the text re-renders when the locale changes.
const bio = computed(() => {
    if (!currentSinger) return { lead: '', columns: [] as string[] }
    const text = (tm(currentSinger.descKey) as string[]).map(String).join(' ').trim()
    const sentences = text.split(/(?<=[.!?…])\s+/).filter(Boolean)
    const lead = sentences.shift() ?? ''
    if (!sentences.length) return { lead, columns: [] as string[] }
    const half = Math.ceil(sentences.length / 2)
    const columns = [sentences.slice(0, half).join(' '), sentences.slice(half).join(' ')].filter(Boolean)
    return { lead, columns }
})

// Facts strip: optional per-artist facts from the locale + the artist's categories.
const facts = computed(() => {
    if (!currentSinger) return []
    const raw = tm(`singers.${key}.facts`) as unknown
    const own = Array.isArray(raw)
        ? (raw as { label: unknown, value: unknown }[]).map(f => ({ label: rt(f.label as string), value: rt(f.value as string) }))
        : []
    if (!own.length) return []
    return [
        ...own,
        { label: t('artist.category'), value: currentSinger.categoryIds.map(id => t(`categories.${id}`)).join(' · ') },
    ]
})

const factsGridClass = computed(() => ({
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
}[facts.value.length] ?? 'lg:grid-cols-4'))

const SOCIAL_LABELS: Record<string, string> = {
    instagram: 'Instagram',
    telegram: 'Telegram',
    threads: 'Threads',
    soundcloud: 'SoundCloud',
    youtube: 'YouTube',
    facebook: 'Facebook',
    tiktok: 'TikTok',
}

// Human-readable handle from a social link: @name for profiles, host/path for websites.
function socialHandle(id: string, link: string) {
    try {
        const url = new URL(link)
        const path = url.pathname.replace(/\/+$/, '')
        const last = path.split('/').filter(Boolean).pop() ?? ''
        if (id === 'link' || !last) return url.host.replace(/^www\./, '') + path
        return last.startsWith('@') ? last : '@' + last
    } catch {
        return link
    }
}

const socials = computed(() =>
    (currentSinger?.socials ?? []).map(s => ({
        ...s,
        label: s.id === 'link' ? t('artist.website') : (SOCIAL_LABELS[s.id] ?? s.id),
        handle: socialHandle(s.id, s.link),
    })),
)

// Gallery mosaic. Desktop (3 columns): rows of a wide + a narrow photo, alternating sides.
// Tablet and mobile (2 columns): one wide photo, then two narrow ones.
const gallery = computed(() => {
    const projects = currentSinger?.projects ?? []
    const n = projects.length
    return projects.map((p, i) => {
        const row = Math.floor(i / 2)
        const firstInRow = i % 2 === 0
        let lg: string
        if (firstInRow && i === n - 1) lg = 'lg:col-span-3 lg:h-140'
        else if (row % 2 === 0) lg = firstInRow ? 'lg:col-span-2 lg:h-140' : 'lg:col-span-1 lg:h-140'
        else lg = firstInRow ? 'lg:col-span-1 lg:h-105' : 'lg:col-span-2 lg:h-105'

        const pos = i % 3
        const lonelySmall = pos === 1 && i === n - 1
        const md = pos === 0 || lonelySmall ? 'col-span-2 h-53.5 md:h-108' : 'col-span-1 h-50 md:h-75'

        return { ...p, cls: `${md} ${lg}` }
    })
})

// Next three artists in the list (wrapping around).
const moreArtists = computed(() => {
    if (currentIndex < 0) return []
    const result: Singer[] = []
    for (let step = 1; step < allSingers.length && result.length < 3; step++) {
        result.push(allSingers[(currentIndex + step) % allSingers.length]!)
    }
    return result
})

const hasListenSection = computed(() => !!currentSinger && (currentSinger.streaming.length > 0 || socials.value.length > 0))
</script>

<template>
    <main v-if="currentSinger">
        <!-- Hero -->
        <section class="pt-1 md:pt-4 lg:pt-10"><div class="container">
            <RouterLink to="/" class="flex items-center gap-2.5 min-h-11 text-[12px] md:text-[13px] uppercase text-[#6b6b6b] mb-5 md:mb-7 lg:hidden">
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true"><path d="M7 1L1 7l6 6M1 7h16" stroke="currentColor" stroke-width="1.6"/></svg>
                {{ t('artist.allArtists') }}
            </RouterLink>

            <div class="flex flex-col gap-5 md:gap-7 lg:grid lg:grid-cols-2 lg:gap-20 lg:items-end">
                <div class="flex flex-col gap-5 md:gap-7 lg:gap-10 lg:pb-2">
                    <RouterLink to="/" class="hidden lg:flex items-center gap-2.5 text-[13px] uppercase text-[#6b6b6b]">
                        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true"><path d="M7 1L1 7l6 6M1 7h16" stroke="currentColor" stroke-width="1.6"/></svg>
                        {{ t('artist.allArtists') }}
                    </RouterLink>

                    <div class="hidden md:flex gap-2">
                        <span v-for="catId in currentSinger.categoryIds" :key="catId" class="border border-[#18181833] px-3.5 py-2 text-[13px]">
                            {{ t(`categories.${catId}`) }}
                        </span>
                    </div>

                    <h1 class="text-[68px]/[0.95] tracking-[-2.5px] md:text-[112px]/[0.92] md:tracking-[-4.5px] lg:text-[112px]/[0.92] lg:tracking-[-4.5px] xl:text-[128px]/[0.92] xl:tracking-[-5px]">{{ name }}</h1>

                    <p v-if="tagline" class="font-heading italic text-[20px]/[1.35] md:text-[24px]/[1.35] lg:text-[26px]/[1.35] text-[#18181899] max-w-140">{{ tagline }}</p>

                    <div class="flex flex-col gap-2.5 md:flex-row md:gap-3">
                        <button type="button" @click="isBookOpen = true" class="bg-[#181818] text-white px-6 py-5.25 md:flex-1 lg:flex-none lg:px-11 lg:py-5.5 text-[14px] uppercase font-semibold cursor-pointer">
                            {{ t('artist.book') }}
                        </button>
                        <a v-if="hasListenSection" href="#listen" class="text-center border border-[#181818] px-6 py-5 md:flex-none md:px-9 md:py-5.25 text-[14px] uppercase">
                            {{ t('artist.listen') }}
                        </a>
                    </div>
                </div>

                <div class="relative order-first md:order-last lg:order-none">
                    <img
                        class="block w-full object-cover h-110 md:h-190"
                        :src="currentSinger.heroImage || currentSinger.image"
                        :style="{ objectPosition: currentSinger.heroPosition }"
                        :alt="name"
                    >
                    <div class="flex gap-2 absolute left-4 top-4 md:hidden">
                        <span v-for="catId in currentSinger.categoryIds" :key="catId" class="border border-white text-white px-3 py-1.5 text-[13px]">
                            {{ t(`categories.${catId}`) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        </section>

        <!-- Facts -->
        <section v-if="facts.length"><div class="container">
            <div :class="['grid grid-cols-2 gap-px bg-[#18181826] border-y border-[#18181826] mt-11 md:mt-14 lg:mt-20', factsGridClass]">
                <div
                    v-for="(fact, index) in facts"
                    :key="fact.label"
                    :class="['bg-white py-4.5 pr-3.5 md:py-6 md:pr-5 lg:py-7 lg:pr-6', index % 2 === 1 && 'pl-3.5 md:pl-5', index > 0 && 'lg:pl-6', facts.length % 2 === 1 && index === facts.length - 1 && 'col-span-2 lg:col-span-1']"
                >
                    <div class="text-[11px] md:text-[12px] uppercase text-[#6b6b6b] mb-2 md:mb-2.5">{{ fact.label }}</div>
                    <div class="text-[15px]/[1.35] md:text-[16px]/[1.35] lg:text-[17px]/[1.35]">{{ fact.value }}</div>
                </div>
            </div>
        </div>
        </section>

        <!-- Bio -->
        <section class="py-15 md:py-22 lg:py-30"><div class="container lg:grid lg:grid-cols-12 lg:gap-5">
            <h2 class="font-body text-[12px] md:text-[13px] uppercase font-semibold mb-5 md:mb-7 lg:mb-0 lg:col-span-3">{{ t('artist.about') }}</h2>
            <div class="flex flex-col gap-5 md:gap-7 lg:gap-8 lg:col-span-9">
                <p class="font-heading text-[26px]/[1.25] tracking-[-0.5px] md:text-[34px]/[1.22] md:tracking-[-1px] lg:text-[40px]/[1.2]">{{ bio.lead }}</p>
                <div v-if="bio.columns.length" class="flex flex-col gap-4 md:gap-5 lg:grid lg:grid-cols-2 lg:gap-10 text-[15px]/[1.6] md:text-[16px]/[1.6] font-normal text-[#181818cc]">
                    <p v-for="(column, index) in bio.columns" :key="index">{{ column }}</p>
                </div>
            </div>
        </div>
        </section>

        <!-- Listen + socials -->
        <section v-if="hasListenSection" id="listen" class="bg-[#f8f8f5] py-14 md:py-20 lg:py-25 scroll-mt-[var(--header-height)] lg:scroll-mt-0">
            <div class="container flex flex-col gap-12 md:gap-16 lg:grid lg:grid-cols-2 lg:gap-20">
                <div v-if="currentSinger.streaming.length">
                    <h2 class="text-[34px] tracking-[-1px] mb-4 md:text-[42px] md:tracking-[-1.5px] md:mb-6 lg:text-[48px] lg:tracking-[-2px] lg:mb-8">{{ t('artist.listen') }}</h2>
                    <div class="flex flex-col border-t border-[#18181826]">
                        <a
                            v-for="service in currentSinger.streaming"
                            :key="service.id"
                            :href="service.link"
                            target="_blank"
                            rel="noopener"
                            class="flex justify-between items-center py-4.5 md:py-5.5 lg:py-6 border-b border-[#18181826] text-[17px] md:text-[19px] lg:text-[20px] transition-colors hover:text-[#555555]"
                        >
                            {{ service.label }} <span aria-hidden="true">↗</span>
                        </a>
                    </div>
                </div>

                <div v-if="socials.length" :class="!currentSinger.streaming.length && 'lg:col-span-2'">
                    <h2 class="text-[34px] tracking-[-1px] mb-4 md:text-[42px] md:tracking-[-1.5px] md:mb-6 lg:text-[48px] lg:tracking-[-2px] lg:mb-8">{{ t('artist.socials') }}</h2>
                    <div :class="['flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-3', !currentSinger.streaming.length && 'lg:grid-cols-4']">
                        <a
                            v-for="(social, index) in socials"
                            :key="social.id + index"
                            :href="social.link"
                            target="_blank"
                            rel="noopener"
                            class="bg-white px-5 py-4.5 flex justify-between items-center gap-4 md:flex-col md:items-start md:justify-start md:gap-6 md:p-6 lg:gap-7 lg:p-7 transition-colors hover:bg-[#efefef]"
                        >
                            <span class="text-[12px] uppercase text-[#6b6b6b]">{{ social.label }}</span>
                            <span class="text-[15px] md:text-[17px] lg:text-[18px] break-all">{{ social.handle }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Gallery -->
        <section v-if="gallery.length" class="py-15 md:py-22 lg:py-30"><div class="container">
            <div class="flex justify-between items-end mb-5 md:mb-7 lg:mb-10">
                <h2 class="text-[34px] tracking-[-1px] md:text-[42px] md:tracking-[-1.5px] lg:text-[48px] lg:tracking-[-2px]">{{ t('artist.gallery') }}</h2>
                <span class="text-[12px] md:text-[13px] text-[#6b6b6b]">{{ t('artist.photos', { n: gallery.length }) }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2.5 md:gap-4 lg:grid-cols-3 lg:gap-5">
                <button
                    v-for="(photo, index) in gallery"
                    :key="index"
                    type="button"
                    @click="lightboxIndex = index"
                    :aria-label="t('artist.openPhoto', { n: index + 1 })"
                    :class="['group relative block w-full overflow-hidden cursor-zoom-in', photo.cls]"
                >
                    <img
                        :src="photo.coverPhoto.src"
                        :alt="photo.coverPhoto.alt"
                        class="block w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                    >
                    <span class="absolute inset-0 flex items-center justify-center bg-[#18181833] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
                        <span class="size-16 rounded-full bg-white flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#181818" stroke-width="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6"/></svg>
                        </span>
                    </span>
                </button>
            </div>
        </div>
        </section>

        <!-- Booking -->
        <section :class="['pb-15 md:pb-22 lg:pb-30', !gallery.length && 'pt-15 md:pt-22 lg:pt-30']"><div class="container">
            <div class="bg-[#181818] text-white px-7 py-10 md:px-12 md:py-14 lg:p-18 flex flex-col gap-5 md:gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
                <div class="flex flex-col gap-5 md:gap-7 lg:gap-3.5">
                    <h2 class="text-[34px]/[1.05] tracking-[-1px] md:text-[44px] md:tracking-[-1.5px] lg:text-[52px] lg:tracking-[-2px]">{{ t('artist.inviteTitle', { name }) }}</h2>
                    <p class="text-[15px]/[1.45] md:text-[16px] font-normal text-white/70">{{ t('artist.inviteText') }}</p>
                </div>
                <button type="button" @click="isBookOpen = true" class="bg-white text-[#181818] px-6 py-5 md:self-start md:px-11 md:py-5.5 lg:self-auto lg:px-12 lg:py-6 text-[14px] uppercase font-semibold whitespace-nowrap cursor-pointer">
                    {{ t('artist.bookShort') }}
                </button>
            </div>
        </div>
        </section>

        <!-- More artists -->
        <section v-if="moreArtists.length" class="pb-15 md:pb-22 lg:pb-30"><div class="container">
            <h2 class="font-body text-[12px] md:text-[13px] uppercase font-semibold mb-5 md:mb-6 lg:mb-8">{{ t('artist.moreArtists') }}</h2>
            <div class="overflow-x-auto no-scrollbar -mr-8.75 md:-mr-15 lg:mr-0 lg:overflow-visible">
                <div class="flex gap-3 pr-8.75 md:gap-4 md:pr-15 lg:grid lg:grid-cols-3 lg:gap-5 lg:pr-0">
                    <RouterLink
                        v-for="artist in moreArtists"
                        :key="artist.id"
                        :to="'/singers/' + artist.id"
                        class="flex-none w-60 md:w-75 lg:w-auto flex flex-col gap-2.5 md:gap-3 lg:gap-3.5 group"
                    >
                        <img
                            class="block w-full object-cover h-75 md:h-95 lg:h-100 transition-opacity duration-300 group-hover:opacity-80"
                            :src="artist.image"
                            :style="{ objectPosition: artist.imagePosition }"
                            :alt="t(artist.nameKey)"
                            loading="lazy"
                        >
                        <span class="text-[16px] md:text-[18px] lg:text-[20px] uppercase">{{ t(artist.nameKey) }} →</span>
                    </RouterLink>
                </div>
            </div>
        </div>
        </section>

        <BookArtistModal v-model:open="isBookOpen" />
        <GalleryLightbox
            :images="gallery.map(photo => photo.coverPhoto)"
            v-model:index="lightboxIndex"
        />
    </main>

    <NotFound v-else />
</template>
