import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
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
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/privacy-policy',
      name: 'privacy policy',
      component: () => import('../views/PrivacyPolicyView.vue'),
    },
    {
      path: '/singers/:id',
      name: 'singer',
      component: () => import('../views/SingerView.vue'),
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

export default router
