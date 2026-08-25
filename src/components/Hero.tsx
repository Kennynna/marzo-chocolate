import { useRef } from 'react'
import { heroFrames } from '../lib/scrollFrames'
import { useScrollFrameSection } from '../lib/useScrollFrameSection'
import './ScrollFrameSection.css'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  const { loadProgress, ready } = useScrollFrameSection({
    sequence: heroFrames,
    scrollTriggerId: 'hero-frames',
    sectionRef,
    canvasRef,
    hintRef,
    scrollLength: { desktop: 400, mobile: 300 },
    scrub: true,
    zoomFrom: 1.08,
  })

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section
      className={`scroll-frames${reduced ? ' scroll-frames--reduced' : ''}`}
      id="hero"
      ref={sectionRef}
      aria-label="Главный экран"
    >
      <div className="scroll-frames__stage">
        <canvas className="scroll-frames__canvas" ref={canvasRef} aria-hidden />
        <div className="scroll-frames__shade scroll-frames__shade--hero" aria-hidden />

        {!ready && loadProgress < 100 && (
          <div className="scroll-frames__loader" aria-hidden>
            <span
              className="scroll-frames__loader-bar"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        )}

        {!reduced && (
          <div className="scroll-frames__scroll-hint" ref={hintRef} aria-hidden>
            <span>scroll</span>
          </div>
        )}
      </div>
    </section>
  )
}
