import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

export function useSmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.4,
      lerp: 0.09,
      wheelMultiplier: 0.82,
      touchMultiplier: 0.95,
      smoothWheel: true,
    })

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    })

    ScrollTrigger.defaults({ scroller: document.documentElement })

    lenis.on('scroll', ScrollTrigger.update)

    ScrollTrigger.addEventListener('refresh', () => {
      lenis.resize()
    })

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      gsap.ticker.remove(onTick)
      ScrollTrigger.scrollerProxy(document.documentElement, {})
      lenis.destroy()
    }
  }, [])
}
