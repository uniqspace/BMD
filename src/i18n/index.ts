import { createI18n } from 'vue-i18n'

export const SUPPORT_LOCALES = ['en', 'ru'] as const
type Locale = typeof SUPPORT_LOCALES[number]

const STORAGE_KEY = 'locale'

function isSupported(locale: string | null | undefined): locale is Locale {
  return SUPPORT_LOCALES.includes(locale as Locale)
}

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && isSupported(saved)) return saved
  } catch {}

  return (
    (navigator.languages ?? [navigator.language])
      .map((lang) => lang.slice(0, 2).toLowerCase())
      .find(isSupported) ?? 'en'
  )
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {},
})

export async function loadLocale(locale: string, persist = true) {
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
    } catch {}
  }

  if (i18n.global.te('meta.homeTitle')) {
    document.title = i18n.global.t('meta.homeTitle')
  }
}

export async function bootstrap() {
  await loadLocale(detectLocale(), false)
}
