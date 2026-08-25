import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

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
    }
  }, [])
}
