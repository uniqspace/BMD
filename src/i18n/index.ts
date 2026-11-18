import { createI18n } from 'vue-i18n'

export const SUPPORT_LOCALES = ['en', 'ru'] as const
type Locale = typeof SUPPORT_LOCALES[number]

const STORAGE_KEY = 'locale'

function isSupported(locale: string): locale is Locale {
  return (SUPPORT_LOCALES as readonly string[]).includes(locale)
}

// Decide which locale to start with:
// 1. the one the user previously chose (saved in localStorage)
// 2. otherwise the browser's language, if we support it
// 3. otherwise fall back to English
function resolveInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && isSupported(saved)) return saved
  } catch {
    // localStorage unavailable — ignore and fall through
  }

  const browser = (navigator.languages ?? [navigator.language])
    .map((l) => l.slice(0, 2).toLowerCase())
    .find(isSupported)

  return browser ?? 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {},
})

export async function loadLocale(locale: Locale, persist = true) {
  if (!isSupported(locale)) return

  if (!i18n.global.availableLocales.includes(locale)) {
    const response = await fetch(`/locales/${locale}.json`)
    const messages = await response.json()

    i18n.global.setLocaleMessage(locale, messages)
  }

  i18n.global.locale.value = locale
  document.documentElement.setAttribute('lang', locale)

  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // localStorage unavailable — ignore
    }
  }

  if (i18n.global.te('meta.homeTitle')) {
    document.title = i18n.global.t('meta.homeTitle')
  }
}

export async function bootstrap() {
  // Don't persist here — we're only restoring the existing choice / default,
  // not recording a new user selection.
  await loadLocale(resolveInitialLocale(), false)
}
