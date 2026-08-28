import { createContext, useContext } from 'react'
import { DEFAULT_LANG, isLang, locales, type Lang, type SiteContent } from '../content/site'

export const LANG_STORAGE_KEY = 'marzo:lang'

export type LanguageApi = {
  lang: Lang
  setLang: (lang: Lang) => void
  content: SiteContent
}

export const LanguageContext = createContext<LanguageApi | null>(null)

/** Язык из localStorage, иначе по языку браузера. Тот же порядок читает бут-лоадер */
export function detectLang(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG

  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY)
    if (isLang(stored)) return stored
  } catch {
    // приватный режим — просто идём дальше
  }

  return window.navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

export function getContent(lang: Lang): SiteContent {
  return locales[lang]
}

export function useLanguage() {
  const api = useContext(LanguageContext)
  if (!api) throw new Error('useLanguage должен вызываться внутри LanguageProvider')
  return api
}

/** Контент текущей локали */
export function useSite(): SiteContent {
  return useLanguage().content
}
