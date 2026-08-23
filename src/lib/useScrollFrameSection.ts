import { useEffect, useRef, useState, type RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from './gsap'
import { preloadSiteImages } from './preloadSiteImages'
import { scheduleScrollRefresh } from './scheduleScrollRefresh'
import {
  drawFrameBlend,
  drawFrameCover,
  enqueueFramePreload,
  type FrameSequence,
} from './scrollFrames'

type ScrollFrameConfig = {
  sequence: FrameSequence
  scrollTriggerId: string
  sectionRef: RefObject<HTMLElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  scrollLength?: { desktop: number; mobile: number }
  scrub?: number
  zoomFrom?: number
  contentRef?: RefObject<HTMLElement | null>
  hintRef?: RefObject<HTMLElement | null>
  contentFadeEnd?: string
  hintFadeEnd?: string
}

export function useScrollFrameSection({
  sequence,
  scrollTriggerId,
  sectionRef,
  canvasRef,
  scrollLength = { desktop: 380, mobile: 280 },
  scrub = 1.5,
  zoomFrom = 1.12,
  contentRef,
  hintRef,
  contentFadeEnd = '+=24%',
  hintFadeEnd = '+=10%',
}: ScrollFrameConfig) {
  const framesRef = useRef<HTMLImageElement[]>([])
  const progressRef = useRef(0)
  const [loadProgress, setLoadProgress] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setReady(true)
      return
    }

    let cancelled = false

    // Сначала фото секций, потом кадры — иначе картинки появляются с лагом.
    void preloadSiteImages()
      .then(() => {
        if (cancelled) return undefined
        return enqueueFramePreload(sequence, (loaded, total) => {
          if (!cancelled) setLoadProgress(Math.round((loaded / total) * 100))
        })
      })
      .then((frames) => {
        if (cancelled || !frames) return
        framesRef.current = frames.filter(Boolean)
        setReady(true)
        setLoadProgress(100)

        const st = ScrollTrigger.getById(scrollTriggerId)
        progressRef.current = st?.progress ?? 0
        scheduleScrollRefresh()
      })

    return () => {
      cancelled = true
    }
  }, [sequence, scrollTriggerId])

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const section = sectionRef.current
      const canvas = canvasRef.current
      if (!section || !canvas) return

      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) return

      ScrollTrigger.getById(scrollTriggerId)?.kill()

      const paint = (progress: number) => {
        const frames = framesRef.current
        if (!frames.length) return
        drawFrameBlend(ctx, frames, progress, canvas.clientWidth, canvas.clientHeight)
      }

      const redraw = () => {
        paint(progressRef.current)
      }

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = Math.floor(canvas.clientWidth * dpr)
        canvas.height = Math.floor(canvas.clientHeight * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        redraw()
      }

      resize()
      window.addEventListener('resize', resize)

      const cleanups: Array<() => void> = [() => window.removeEventListener('resize', resize)]

      if (reduced) {
        const img = new Image()
        img.onload = () => {
          drawFrameCover(ctx, img, canvas.clientWidth, canvas.clientHeight)
        }
        img.src = sequence.getPath(0)
        return () => cleanups.forEach((fn) => fn())
      }

      const frameTrigger = ScrollTrigger.create({
        id: scrollTriggerId,
        trigger: section,
        start: 'top top',
        end: () =>
          `+=${window.innerWidth < 960 ? scrollLength.mobile : scrollLength.desktop}%`,
        pin: true,
        pinSpacing: true,
        scrub,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress
          paint(self.progress)
        },
      })
      cleanups.push(() => frameTrigger.kill())

      if (contentRef?.current) {
        gsap.set(contentRef.current, { y: 0, opacity: 1 })
        const contentTween = gsap.to(contentRef.current, {
          y: -64,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: contentFadeEnd,
            scrub: true,
          },
        })
        cleanups.push(() => contentTween.scrollTrigger?.kill())
      }

      if (hintRef?.current) {
        gsap.set(hintRef.current, { opacity: 1, y: 0 })
        const hintTween = gsap.to(hintRef.current, {
          opacity: 0,
          y: 14,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: hintFadeEnd,
            scrub: true,
          },
        })
        cleanups.push(() => hintTween.scrollTrigger?.kill())
      }

      gsap.set(canvas, { scale: zoomFrom })
      const zoomTween = gsap.to(canvas, {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      cleanups.push(() => zoomTween.scrollTrigger?.kill())

      scheduleScrollRefresh()

      return () => cleanups.forEach((fn) => fn())
    },
    { scope: sectionRef, dependencies: [scrollTriggerId] },
  )

  useEffect(() => {
    if (!ready) return

    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const st = ScrollTrigger.getById(scrollTriggerId)
    progressRef.current = st?.progress ?? 0

    if (framesRef.current.length) {
      drawFrameBlend(
        ctx,
        framesRef.current,
        progressRef.current,
        canvas.clientWidth,
        canvas.clientHeight,
      )
    }

    scheduleScrollRefresh()
  }, [ready, scrollTriggerId, sectionRef, canvasRef])

  return { loadProgress, ready }
}
