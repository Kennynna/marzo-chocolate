import { locales, media } from '../content/site'

/**
 * Все фото лендинга — грузим до кадров Hero, чтобы секции не «вспыхивали».
 * Пути к товарным фото не зависят от языка, поэтому читаем их из базовой локали.
 */
export const siteImageUrls: string[] = [
  media.logo,
  media.welcome,
  media.aboutHero,
  media.aboutSecondary,
  media.aboutTertiary,
  media.privateLabel,
  ...media.ornaments,
  ...locales.ru.bars.map((bar) => bar.image),
  ...locales.ru.gifts.map((gift) => gift.image),
]

function loadOne(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      void img.decode().finally(() => resolve())
    }
    img.onerror = () => resolve()
    img.src = encodeURI(src)
  })
}

let pending: Promise<void> | null = null

export function preloadSiteImages(
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  if (!pending) {
    const total = siteImageUrls.length
    let loaded = 0

    pending = Promise.all(
      siteImageUrls.map((src) =>
        loadOne(src).then(() => {
          loaded += 1
          onProgress?.(loaded, total)
        }),
      ),
    ).then(() => undefined)
  }
  return pending
}
