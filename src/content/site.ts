/**
 * Реестр локалей. Компоненты берут контент через useSite(),
 * прямой импорт словаря допустим только для данных вне языка — например, для медиа.
 */

import { en } from './locales/en'
import { ru, type SiteContent } from './locales/ru'

export type { SiteContent }

export const DEFAULT_LANG = 'ru'

export const locales = { ru, en }

export type Lang = keyof typeof locales

export const languages: { code: Lang; label: string; title: string }[] = [
  { code: 'ru', label: 'RU', title: 'Русский' },
  { code: 'en', label: 'EN', title: 'English' },
]

export function isLang(value: unknown): value is Lang {
  return value === 'ru' || value === 'en'
}

/** Пути к файлам одинаковы во всех локалях — берём из базового словаря */
export const media = ru.media
