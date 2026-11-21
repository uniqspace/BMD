<script setup lang="ts">
    import Logo from './Logo.vue';
    import { useI18n } from 'vue-i18n'
    import LangSwitch from './LangSwitch.vue'
    import BurgerMenu from './icons/BurgerMenu.vue';
    import BookArtistModal from './BookArtistModal.vue';
    import { ref, computed, onMounted, onUnmounted } from 'vue';
    import MobileMenuModal from './MobileMenuModal.vue';
    import { useHeaderHeight } from '@/composables/useHeaderHeight';
    import CloseIcon from './icons/CloseIcon.vue';
    import { RouterLink } from 'vue-router';
    import { useRoute } from 'vue-router'
    import { cn } from '@/lib/cn.ts';
    import { scrollToContacts } from '@/lib/scrollToContacts';

    const route = useRoute()
    const isAboutPage = computed(() => route.path === '/')

    const headerRef = ref<HTMLElement | null>(null)

    useHeaderHeight(headerRef)

    const isOpenBookModal = ref(false)
    const isOpenMobileModal = ref(false)
    const { t } = useI18n()

    // The floating bar compacts once the page is scrolled.
    const isScrolled = ref(false)
    const onScroll = () => {
        isScrolled.value = window.scrollY > 40
    }

    onMounted(() => {
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
    })

    onUnmounted(() => {
        window.removeEventListener('scroll', onScroll)
    })

    const navItems = computed(() => [
        { to: '/about', label: t('nav.about'), active: route.path === '/about' },
        { to: '/artists', label: t('nav.artists'), active: route.path === '/artists' || route.path.startsWith('/singers') },
        { to: '/#events', label: t('nav.events'), active: route.path === '/' && route.hash === '#events' },
        { to: '#contacts', label: t('nav.feedback'), active: false, scroll: true },
    ])
</script>

<template>
    <!-- Keeps page content below the fixed header (height of the header at the top of the page) -->
    <!-- On the About page the area behind the header matches the page's cream background -->
    <div :class="cn('h-19 md:h-21 lg:h-23', isAboutPage && 'bg-[#f8f8f5]')" aria-hidden="true"></div>

    <header
        ref="headerRef"
        :class="cn(
            'fixed left-0 top-0 z-20 w-full px-3 pt-3 md:px-4 md:pt-4 lg:px-5 lg:pt-5 transition-[padding] duration-300',
            isScrolled && 'lg:pt-4',
        )"
    >
        <div
            :class="cn(
                'mx-auto max-w-[1400px] bg-[#181818] text-white flex items-center justify-between h-16 pl-5 pr-2 md:h-17 md:pl-7 lg:h-18 lg:pl-8 lg:pr-2.5 transition-all duration-300',
                isScrolled && 'shadow-[0_12px_32px_rgba(24,24,24,0.25)] lg:max-w-300 lg:h-15 lg:pl-6.5 lg:pr-2',
            )"
        >
            <Logo
                color="text-white"
                :class="cn('text-[18px]/[100%] md:text-[20px]/[100%] transition-[font-size] duration-300', isScrolled && 'lg:text-[17px]/[100%]')"
            />

            <nav class="hidden xl:block" :aria-label="t('nav.nav')">
                <ul :class="cn('flex items-center gap-9 transition-[gap] duration-300', isScrolled && 'gap-7')">
                    <li v-for="item in navItems" :key="item.to">
                        <button
                            v-if="item.scroll"
                            type="button"
                            @click="scrollToContacts"
                            :class="cn(
                                'block whitespace-nowrap cursor-pointer uppercase py-1 text-[13px]/[100%] transition-colors hover:text-white/70',
                                isScrolled && 'text-[12px]/[100%]',
                            )"
                        >{{ item.label }}</button>
                        <RouterLink
                            v-else
                            :to="item.to"
                            :class="cn(
                                'block whitespace-nowrap uppercase py-1 text-[13px]/[100%] transition-colors hover:text-white/70',
                                isScrolled && 'text-[12px]/[100%]',
                                // Active page: same colour as hover, no underline
                                item.active && 'text-white/70',
                            )"
                        >{{ item.label }}</RouterLink>
                    </li>
                </ul>
            </nav>

            <div :class="cn('flex items-center gap-5 md:gap-7 xl:gap-5.5 transition-[gap] duration-300', isScrolled && 'xl:gap-4.5')">
                <!-- Language switcher: desktop only; on mobile/tablet it lives in the menu -->
                <div class="hidden xl:block xl:mr-4"><LangSwitch :compact="isScrolled" /></div>

                <button
                    type="button"
                    @click="isOpenBookModal = true"
                    :class="cn(
                        // Fixed width (fits the longer RU label) so switching language doesn't resize the button or shift the switcher
                        'hidden xl:block w-45 text-center whitespace-nowrap cursor-pointer bg-white text-[#181818] uppercase font-semibold text-[13px]/[100%] py-4.75 transition-all duration-300 hover:bg-white/85',
                        isScrolled && 'w-[158px] text-[12px]/[100%] py-3.5',
                    )"
                >{{ isScrolled ? t('nav.book') : t('artist.bookShort') }}</button>

                <button
                    type="button"
                    @click="isOpenMobileModal = !isOpenMobileModal"
                    :aria-label="isOpenMobileModal ? 'Close menu' : 'Open menu'"
                    :aria-expanded="isOpenMobileModal"
                    class="size-12 md:size-13 flex justify-center items-center bg-white cursor-pointer xl:hidden"
                >
                    <BurgerMenu v-if="isOpenMobileModal == false" class="[&_path]:stroke-[#181818]" />
                    <CloseIcon class="[&_path]:fill-[#181818]" v-else />
                </button>
            </div>
        </div>
    </header>

    <BookArtistModal v-model:open="isOpenBookModal" />
    <MobileMenuModal v-on:update:open="isOpenBookModal = $event" v-on:update:close="isOpenMobileModal = $event" :open="isOpenMobileModal" />
</template>
