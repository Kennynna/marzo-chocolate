import { useId, useRef } from 'react'
import { FILIGREE_PATH } from './filigreePath'
import { gsap, useGSAP } from '../lib/gsap'
import './FiligreeOrnament.css'

type FiligreeOrnamentProps = {
  className?: string
  /** Скролл-прорисовка контура → заливка */
  animate?: boolean
}

const VB_W = 2945
const VB_H = 510

export function FiligreeOrnament({ className, animate = true }: FiligreeOrnamentProps) {
  const root = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const uid = useId().replace(/:/g, '')

  useGSAP(
    () => {
      if (!animate) return

      const path = pathRef.current
      if (!path) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(path, { strokeDashoffset: 0, fillOpacity: 1, strokeOpacity: 0 })
        return
      }

      const length = path.getTotalLength()

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fillOpacity: 0,
        strokeOpacity: 1,
      })

      // scrub — надёжнее once после pin Hero: к моменту About уже дорисовано
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 92%',
          end: 'top 45%',
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      })

      tl.to(path, {
        strokeDashoffset: 0,
        duration: 0.72,
        ease: 'none',
      }).to(
        path,
        {
          fillOpacity: 1,
          strokeOpacity: 0,
          duration: 0.28,
          ease: 'none',
        },
        '-=0.12',
      )
    },
    { scope: root, dependencies: [animate] },
  )

  return (
    <div
      ref={root}
      className={`filigree${className ? ` ${className}` : ''}${animate ? '' : ' filigree--static'}`}
      aria-hidden
    >
      <svg
        className="filigree__svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          className="filigree__path"
          id={`filigree-path-${uid}`}
          d={FILIGREE_PATH}
        />
      </svg>
    </div>
  )
}
