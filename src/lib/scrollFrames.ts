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

export function drawFrameBlend(
  ctx: CanvasRenderingContext2D,
  frames: HTMLImageElement[],
  progress: number,
  width: number,
  height: number,
) {
  if (!frames.length || width <= 0 || height <= 0) return

  const max = frames.length - 1
  const position = Math.min(Math.max(progress, 0), 1) * max
  const indexA = Math.floor(position)
  const indexB = Math.min(indexA + 1, max)
  const blend = position - indexA

  const frameA = frames[indexA]
  if (!frameA?.complete || !frameA.naturalWidth) return

  ctx.clearRect(0, 0, width, height)

  if (blend < 0.001 || indexA === indexB) {
    paintFrameCover(ctx, frameA, width, height)
    return
  }

  const frameB = frames[indexB]
  if (!frameB?.complete || !frameB.naturalWidth) {
    paintFrameCover(ctx, frameA, width, height)
    return
  }

  paintFrameCover(ctx, frameA, width, height)
  ctx.globalAlpha = blend
  paintFrameCover(ctx, frameB, width, height)
  ctx.globalAlpha = 1
}
