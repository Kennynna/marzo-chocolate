import { media } from '../content/site'
import { heroFrames } from './scrollFrames'

/**
 * Только то, без чего нельзя снять лоадер: фото Welcome и первый кадр Hero.
 * Остальные фото секций грузит браузер по мере появления в вёрстке.
 */
export const criticalImageUrls: string[] = [media.welcome, heroFrames.getPath(0)]

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

export function preloadCriticalImages(
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  if (!pending) {
    const total = criticalImageUrls.length
    let loaded = 0

    pending = Promise.all(
      criticalImageUrls.map((src) =>
        loadOne(src).then(() => {
          loaded += 1
          onProgress?.(loaded, total)
        }),
      ),
    ).then(() => undefined)
  }

  return pending
}

/** Hero не стартует 296 кадров, пока не готовы критичные фото — иначе они дерутся за сеть. */
export function whenCriticalReady() {
  return pending ?? Promise.resolve()
}
