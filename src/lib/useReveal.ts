import { useRef } from 'react'
import { gsap, useGSAP } from './gsap'

type RevealOptions = {
  y?: number
  stagger?: number
  start?: string
  once?: boolean
}

export function useReveal(options: RevealOptions = {}) {
  const ref = useRef<HTMLElement>(null)
  const { y = 40, stagger = 0.1, start = 'top 82%', once = true } = options

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const items = ref.current?.querySelectorAll('[data-reveal]')
      if (!items?.length) return

      if (reduced) {
        gsap.set(items, { autoAlpha: 1, y: 0 })
        return
      }

      gsap.from(items, {
        y,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger,
        scrollTrigger: {
          trigger: ref.current,
          start,
          once,
        },
      })
    },
    { scope: ref },
  )

  return ref
}
