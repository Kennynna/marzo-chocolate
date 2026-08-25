import { useEffect, useRef, useState, type RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from './gsap'
import { preloadSiteImages } from './preloadSiteImages'
import { scheduleScrollRefresh } from './scheduleScrollRefresh'
import {
  drawFrameAtProgress,
  drawFrameCover,
  enqueueFramePreload,
  getLastFramePath,
  type FrameSequence,
} from './scrollFrames'

type Breakpointed = { desktop: number; mobile: number }

/**
 * Этап 1 «zoom through»: вырез в плите приближается к камере,
 * покадровая анимация секции на это время стоит на первом кадре.
 */
type ZoomMaskConfig = {
  svgRef: RefObject<SVGSVGElement | null>
  /** Группа с фигурой выреза, центрированной относительно своего origin */
  shapeRef: RefObject<SVGGElement | null>
  /** Доля общего скролла секции, отданная под этап 1 */
  gateRatio?: number
  /** Подпись, которая гаснет на подлёте к фигуре */
  captionRef?: RefObject<SVGElement | null>
  /** Центр фигуры в координатах viewBox */
  shapeOrigin: { x: number; y: number }
  /** Резкая фаза: масштаб фигуры внутри SVG (вектор, без растрового мыла) */
  shapeScaleFrom: number
  shapeScaleTo: Breakpointed
  /** Фаза пролёта: transform-масштаб всей плиты */
  scaleTo?: Breakpointed
}

type ScrollFrameConfig = {
  sequence: FrameSequence
  scrollTriggerId: string
  sectionRef: RefObject<HTMLElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  stageRef?: RefObject<HTMLElement | null>
  scrollLength?: { desktop: number; mobile: number }
  /** Доля скролла, на которой достигается последний кадр; остаток — удержание */
  holdEndRatio?: number
  scrub?: number | boolean
  zoomFrom?: number
  zoomMask?: ZoomMaskConfig
  contentRef?: RefObject<HTMLElement | null>
  hintRef?: RefObject<HTMLElement | null>
  /** Затухание текста при скролле (по умолчанию включено, если передан contentRef) */
  fadeContent?: boolean
  /** Затухание подсказки scroll */
  fadeHint?: boolean
  contentFadeEnd?: string
  hintFadeEnd?: string
}

const isMobileViewport = () => window.innerWidth < 960

const pickByViewport = (value: Breakpointed) =>
  isMobileViewport() ? value.mobile : value.desktop

/** Скролл до gate — этап 1, после — прогресс основной анимации 0→1 */
function toStageProgress(scrollProgress: number, gate: number) {
  if (gate <= 0) return scrollProgress
  if (scrollProgress <= gate) return 0
  return (scrollProgress - gate) / (1 - gate)
}

function toFrameProgress(scrollProgress: number, holdEndRatio: number) {
  if (holdEndRatio >= 1) return scrollProgress
  return Math.min(scrollProgress / holdEndRatio, 1)
}

function applyPosterSurface(el: HTMLElement | null | undefined, posterUrl: string) {
  if (!el) return
  el.style.setProperty('--frame-poster', `url("${posterUrl}")`)
}

function syncPinSpacerPoster(section: HTMLElement, posterUrl: string) {
  const spacer = section.parentElement
  if (!spacer?.classList.contains('pin-spacer')) return
  applyPosterSurface(spacer, posterUrl)
  spacer.classList.add('scroll-frames__pin-spacer')
}

export function useScrollFrameSection({
  sequence,
  scrollTriggerId,
  sectionRef,
  canvasRef,
  stageRef,
  scrollLength = { desktop: 380, mobile: 280 },
  holdEndRatio = 1,
  scrub = true,
  zoomFrom = 1.08,
  zoomMask,
  contentRef,
  hintRef,
  fadeContent = true,
  fadeHint = true,
  contentFadeEnd = '+=24%',
  hintFadeEnd = '+=10%',
}: ScrollFrameConfig) {
  const posterPath = getLastFramePath(sequence)
  const gate = zoomMask ? Math.min(Math.max(zoomMask.gateRatio ?? 0.32, 0), 0.9) : 0
  const framesRef = useRef<HTMLImageElement[]>([])
  const progressRef = useRef(0)
  const lastFrameRef = useRef(-1)
  const [loadProgress, setLoadProgress] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setReady(true)
      return
    }

    let cancelled = false

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

      const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true })
      if (!ctx) return

      ScrollTrigger.getById(scrollTriggerId)?.kill()
      lastFrameRef.current = -1

      applyPosterSurface(section, posterPath)
      applyPosterSurface(stageRef?.current, posterPath)

      const paint = (scrollProgress: number) => {
        const frames = framesRef.current
        if (!frames.length) return
        drawFrameAtProgress(
          ctx,
          frames,
          toFrameProgress(toStageProgress(scrollProgress, gate), holdEndRatio),
          canvas.clientWidth,
          canvas.clientHeight,
          lastFrameRef,
        )
      }

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, isMobileViewport() ? 1 : 1.5)
        canvas.width = Math.floor(canvas.clientWidth * dpr)
        canvas.height = Math.floor(canvas.clientHeight * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        lastFrameRef.current = -1
        paint(progressRef.current)
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

      // Один таймлайн на секцию: этап 1 занимает [0, gate], этап 2 — [gate, 1]
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: scrollTriggerId,
          trigger: section,
          start: 'top top',
          end: () => `+=${pickByViewport(scrollLength)}%`,
          pin: true,
          pinSpacing: true,
          scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => syncPinSpacerPoster(section, posterPath),
          onUpdate: (self) => {
            progressRef.current = self.progress
            paint(self.progress)
          },
        },
      })
      cleanups.push(() => {
        timeline.scrollTrigger?.kill()
        timeline.kill()
      })
      syncPinSpacerPoster(section, posterPath)

      const maskSvg = zoomMask?.svgRef.current
      const maskShape = zoomMask?.shapeRef.current

      if (gate > 0 && zoomMask && maskSvg && maskShape) {
        const { shapeOrigin, shapeScaleFrom, shapeScaleTo } = zoomMask
        const scaleTo = zoomMask.scaleTo ?? { desktop: 6.4, mobile: 4.2 }

        gsap.set(maskSvg, { autoAlpha: 1, scale: 1, transformOrigin: 'center center' })

        // Пишем SVG-transform руками: вектор пересчитывается каждый кадр и не мылится,
        // а GSAP не трогает getBBox у элемента внутри <mask>.
        const shapeState = { scale: shapeScaleFrom }
        const applyShapeScale = () => {
          maskShape.setAttribute(
            'transform',
            `translate(${shapeOrigin.x} ${shapeOrigin.y}) scale(${shapeState.scale})`,
          )
        }
        applyShapeScale()

        const crispPhase = gate * 0.62
        // Пролёт внутрь фигуры — композитным transform, размытие скрывает fade.
        const throughPhase = gate - crispPhase

        timeline.to(
          shapeState,
          {
            scale: () => pickByViewport(shapeScaleTo),
            duration: crispPhase,
            onUpdate: applyShapeScale,
          },
          0,
        )
        const caption = zoomMask.captionRef?.current
        if (caption) {
          gsap.set(caption, { autoAlpha: 1 })
          timeline.to(caption, { autoAlpha: 0, duration: crispPhase * 0.45 }, 0)
        }

        timeline.to(
          maskSvg,
          {
            scale: () => pickByViewport(scaleTo),
            autoAlpha: 0,
            force3D: true,
            duration: throughPhase,
          },
          crispPhase,
        )
      }

      if (fadeContent && contentRef?.current) {
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
      } else if (contentRef?.current) {
        gsap.set(contentRef.current, { y: 0, opacity: 1, clearProps: 'transform,opacity' })
      }

      if (fadeHint && hintRef?.current) {
        gsap.set(hintRef.current, { opacity: 1 })
        const hintTween = gsap.to(hintRef.current, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: hintFadeEnd,
            scrub: true,
          },
        })
        cleanups.push(() => hintTween.scrollTrigger?.kill())
      } else if (hintRef?.current) {
        gsap.set(hintRef.current, { opacity: 1, clearProps: 'opacity' })
      }

      // Этап 2: основная анимация стартует ровно там, где закончился zoom
      gsap.set(canvas, { scale: zoomFrom, force3D: true })
      timeline.to(canvas, { scale: 1, force3D: true, duration: 1 - gate }, gate)

      scheduleScrollRefresh()

      return () => cleanups.forEach((fn) => fn())
    },
    { scope: sectionRef, dependencies: [scrollTriggerId, holdEndRatio, posterPath, gate] },
  )

  useEffect(() => {
    if (!ready) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const st = ScrollTrigger.getById(scrollTriggerId)
    progressRef.current = st?.progress ?? 0
    lastFrameRef.current = -1

    if (framesRef.current.length) {
      drawFrameAtProgress(
        ctx,
        framesRef.current,
        toFrameProgress(toStageProgress(progressRef.current, gate), holdEndRatio),
        canvas.clientWidth,
        canvas.clientHeight,
        lastFrameRef,
      )
    }

    scheduleScrollRefresh()
  }, [ready, scrollTriggerId, canvasRef, holdEndRatio, gate])

  return { loadProgress, ready }
}
