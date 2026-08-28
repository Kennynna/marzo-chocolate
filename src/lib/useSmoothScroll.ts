import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let activeLenis: Lenis | null = null

/**
 * Пауза плавного скролла для оверлеев. При prefers-reduced-motion Lenis не создаётся,
 * и вызов ничего не делает — блокировка страницы остаётся на CSS.
 */
export function setSmoothScrollPaused(paused: boolean) {
  if (!activeLenis) return

  if (paused) activeLenis.stop()
  else activeLenis.start()
}

/**
 * Lenis крутится через GSAP ticker. Без scrollerProxy —
 * иначе ScrollTrigger.update + proxy на каждый кадр едят CPU.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.1,
      lerp: 0.12,
      wheelMultiplier: 0.85,
      touchMultiplier: 1,
      smoothWheel: true,
    })

    activeLenis = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    // без lagSmoothing(0): иначе при тяжёлом canvas копится очередь кадров
    gsap.ticker.lagSmoothing(500, 33)

    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      activeLenis = null
    }
  }, [])
}
