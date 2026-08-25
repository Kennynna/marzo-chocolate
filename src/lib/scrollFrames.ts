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

export async function preloadFrames(
  sequence: FrameSequence,
  onProgress?: (loaded: number, total: number) => void,
): Promise<HTMLImageElement[]> {
  const { count, getPath } = sequence
  const frames: HTMLImageElement[] = new Array(count)
  const batchSize = 16

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
            resolve()
          }
          img.onerror = () => resolve()
          img.src = getPath(index)
        })
      }),
    )
    onProgress?.(end, count)
  }

  return frames
}

/** Одна очередь: Hero → gifts, без гонки за сеть. */
let framePreloadQueue: Promise<unknown> = Promise.resolve()

export function enqueueFramePreload(
  sequence: FrameSequence,
  onProgress?: (loaded: number, total: number) => void,
): Promise<HTMLImageElement[]> {
  const run = framePreloadQueue.then(() => preloadFrames(sequence, onProgress))
  framePreloadQueue = run.then(
    () => undefined,
    () => undefined,
  )
  return run
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

  const scale = Math.max(width / iw, height / ih)
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

  const frame = frames[index]
  if (!frame?.complete || !frame.naturalWidth) return

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
