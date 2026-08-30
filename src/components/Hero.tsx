import { useRef } from 'react'
import { useSite } from '../lib/language'
import { heroFrames } from '../lib/scrollFrames'
import { useScrollFrameSection } from '../lib/useScrollFrameSection'
import './ScrollFrameSection.css'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const { scrollCue, ui } = useSite()

  const { loadProgress } = useScrollFrameSection({
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
      aria-label={ui.aria.hero}
    >
      <div className="scroll-frames__stage">
        <canvas className="scroll-frames__canvas" ref={canvasRef} aria-hidden />
        <div className="scroll-frames__shade scroll-frames__shade--hero" aria-hidden />

        {loadProgress < 100 && (
          <div className="scroll-frames__loader" aria-hidden>
            <span
              className="scroll-frames__loader-bar"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        )}

          <div className="scroll-frames__scroll-hint" ref={hintRef} aria-hidden>
            <span>{scrollCue.label}</span>
          </div>
      </div>
    </section>
  )
}
