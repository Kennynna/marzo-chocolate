export type FrameSequence = {
  count: number
  getPath: (index: number) => string
}

export const heroFrames: FrameSequence = {
  count: 296,
  getPath: (index) => `/video-frames/frame_${String(index + 1).padStart(4, '0')}.webp`,
}

export const giftsScrollFrames: FrameSequence = {
  count: 274,
  getPath: (index) => `/video2-frames/frame_${String(index + 1).padStart(4, '0')}.webp`,
}

export function getLastFramePath(sequence: FrameSequence) {
  return sequence.getPath(sequence.count - 1)
}

const MOBILE_FRAME_MAX_WIDTH = 960
const MOBILE_FRAME_STEP = 2

/** Равномерная прореживание: первый и последний кадры остаются. */
export function subsampleFrameSequence(sequence: FrameSequence, step: number): FrameSequence {
  if (step <= 1) return sequence

  const count = Math.ceil(sequence.count / step)
  return {
    count,
    getPath: (index) => {
      const t = count <= 1 ? 0 : index / (count - 1)
      return sequence.getPath(Math.round(t * (sequence.count - 1)))
    },
  }
}

/** На телефоне грузим вдвое меньше кадров — скролл-анимация та же, запросов меньше. */
export function resolveFrameSequence(sequence: FrameSequence): FrameSequence {
  if (typeof window === 'undefined' || window.innerWidth >= MOBILE_FRAME_MAX_WIDTH) {
    return sequence
  }
  return subsampleFrameSequence(sequence, MOBILE_FRAME_STEP)
}

export type FrameProgressHandler = (
  loaded: number,
  total: number,
  frames: HTMLImageElement[],
) => void

function isPaintReady(img: HTMLImageElement | undefined) {
  return Boolean(img?.complete && img.naturalWidth)
}

/** Ближайший уже скачанный кадр — чтобы скролл не ждал всю последовательность. */
export function pickLoadedFrame(frames: HTMLImageElement[], index: number) {
  if (isPaintReady(frames[index])) return frames[index]

  for (let delta = 1; delta < frames.length; delta += 1) {
    const prev = frames[index - delta]
    if (isPaintReady(prev)) return prev
    const next = frames[index + delta]
    if (isPaintReady(next)) return next
  }

  return undefined
}

export async function preloadFrames(
  sequence: FrameSequence,
  onProgress?: FrameProgressHandler,
  frames: HTMLImageElement[] = new Array(sequence.count),
): Promise<HTMLImageElement[]> {
  const { count, getPath } = sequence
  const batchSize = 24
  let loaded = 0

  for (let start = 0; start < count; start += batchSize) {
    const end = Math.min(start + batchSize, count)
    await Promise.all(
      Array.from({ length: end - start }, (_, offset) => {
        const index = start + offset
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.decoding = 'async'
          img.onload = () => {
            frames[index] = img
            loaded += 1
            onProgress?.(loaded, count, frames)
            resolve()
          }
          img.onerror = () => {
            loaded += 1
            onProgress?.(loaded, count, frames)
            resolve()
          }
          img.src = getPath(index)
        })
      }),
    )
  }

  return frames
}

type FrameJob = {
  promise: Promise<HTMLImageElement[]>
  frames: HTMLImageElement[]
  listeners: FrameProgressHandler[]
  loaded: number
}

const frameJobs = new Map<string, FrameJob>()

/** Одна загрузка на последовательность: бут-лоадер и секции делят один кэш. */
export function enqueueFramePreload(
  sequence: FrameSequence,
  onProgress?: FrameProgressHandler,
): Promise<HTMLImageElement[]> {
  const key = `${sequence.getPath(0)}#${sequence.count}`
  let job = frameJobs.get(key)

  if (!job) {
    const frames: HTMLImageElement[] = new Array(sequence.count)
    const listeners: FrameJob['listeners'] = []
    const created: FrameJob = {
      promise: Promise.resolve(frames),
      frames,
      listeners,
      loaded: 0,
    }
    frameJobs.set(key, created)
    created.promise = preloadFrames(
      sequence,
      (loaded, total, current) => {
        created.loaded = loaded
        listeners.forEach((fn) => fn(loaded, total, current))
      },
      frames,
    ).then((result) => {
      created.loaded = sequence.count
      return result
    })
    job = created
  }

  if (onProgress) {
    job.listeners.push(onProgress)
    if (job.loaded > 0) onProgress(job.loaded, sequence.count, job.frames)
  }

  return job.promise
}

/** Поля 16:9 на узком экране. Совпадает с --color-cream */
export const FRAME_LETTERBOX = '#e7dfcc'

function isMobileFrameLayout() {
  return typeof window !== 'undefined' && window.innerWidth < 960
}

function paintFrameCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
) {
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  if (!iw || !ih) return

  const letterbox = isMobileFrameLayout()
  if (letterbox) {
    ctx.fillStyle = FRAME_LETTERBOX
    ctx.fillRect(0, 0, width, height)
  }

  const scale = letterbox
    ? Math.min(width / iw, height / ih)
    : Math.max(width / iw, height / ih)
  const dw = iw * scale
  const dh = ih * scale
  const dx = (width - dw) / 2
  const dy = (height - dh) / 2

  ctx.drawImage(img, dx, dy, dw, dh)
}

export function drawFrameCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
) {
  ctx.clearRect(0, 0, width, height)
  paintFrameCover(ctx, img, width, height)
}

export function drawFrameAtProgress(
  ctx: CanvasRenderingContext2D,
  frames: HTMLImageElement[],
  progress: number,
  width: number,
  height: number,
  lastIndexRef?: { current: number },
) {
  if (!frames.length || width <= 0 || height <= 0) return

  const max = frames.length - 1
  const index = Math.round(Math.min(Math.max(progress, 0), 1) * max)

  if (lastIndexRef && lastIndexRef.current === index) return

  const frame = pickLoadedFrame(frames, index)
  if (!frame) return

  if (lastIndexRef) lastIndexRef.current = index

  ctx.clearRect(0, 0, width, height)
  paintFrameCover(ctx, frame, width, height)
}

/** @deprecated — blend рисует 2 кадра FullHD каждый тик, тормозит. */
export function drawFrameBlend(
  ctx: CanvasRenderingContext2D,
  frames: HTMLImageElement[],
  progress: number,
  width: number,
  height: number,
) {
  drawFrameAtProgress(ctx, frames, progress, width, height)
}
