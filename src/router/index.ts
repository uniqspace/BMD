import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import HomeView from '../views/HomeView.vue'
import SingerView from '../views/SingerView.vue'
import { i18n } from '@/i18n'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // browser back/forward button
    if (savedPosition) {
      return savedPosition
    }

    // anchor link (e.g. /#events) — wait for the (lazy) page to render
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ el: to.hash, behavior: 'smooth' }), 350)
      })
    }

    // always scroll to top on route change
    return { top: 0 }
  },
  routes: [
    {
      // Main page of the site: the agency ("О нас")
      path: '/',
      name: 'home',
      component: AboutView,
      meta: {
        titleKey: 'meta.homeTitle'
      }
    },
    {
      path: '/artists',
      name: 'artists',
      component: HomeView,
    },
    {
      path: '/privacy-policy',
      name: 'privacy policy',
      component: () => import('../views/PrivacyPolicyView.vue'),
    },
    {
      path: '/singers/:id',
      name: 'singer',
      component: SingerView,
      props: true
    }
  ],
})

router.afterEach((to) => {
  const titleKey = to.meta.titleKey as string
  if (titleKey) {
    document.title = i18n.global.t(titleKey)
  }

  if (typeof window !== 'undefined' && (window as any).ym) {
    ;(window as any).ym(107036842, 'hit', to.fullPath)
  }
})

// After a new deploy, an already open tab may ask for a page chunk that no longer exists.
// In that case load the target page with a normal (full) navigation instead of failing silently.
router.onError((error, to) => {
  if (/Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(String(error?.message))) {
    window.location.assign(to.fullPath)
  }
})

export default router
