import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Lang } from '../content/site'
import {
  detectLang,
  getContent,
  LANG_STORAGE_KEY,
  LanguageContext,
  type LanguageApi,
} from '../lib/language'
import { scheduleScrollRefresh } from '../lib/scheduleScrollRefresh'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectLang)
  const mounted = useRef(false)

  const changeLang = useCallback((next: Lang) => {
    setLang(next)
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next)
    } catch {
      // приватный режим — язык живёт только до перезагрузки
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang

    // Длина текста меняет высоту страницы — пересчитываем скролл-триггеры
    if (mounted.current) scheduleScrollRefresh()
    mounted.current = true
  }, [lang])

  const api = useMemo<LanguageApi>(
    () => ({ lang, setLang: changeLang, content: getContent(lang) }),
    [lang, changeLang],
  )

  return <LanguageContext value={api}>{children}</LanguageContext>
}
