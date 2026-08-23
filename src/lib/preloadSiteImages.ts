import { bars, gifts, media } from '../content/site'

/** Все фото лендинга — грузим до кадров Hero, чтобы секции не «вспыхивали». */
export const siteImageUrls: string[] = [
  media.logo,
  media.aboutHero,
  media.aboutSecondary,
  media.privateLabel,
  ...media.ornaments,
  ...bars.map((bar) => bar.image),
  ...gifts.map((gift) => gift.image),
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

export function preloadSiteImages(): Promise<void> {
  if (!pending) {
    pending = Promise.all(siteImageUrls.map(loadOne)).then(() => undefined)
  }
  return pending
}
