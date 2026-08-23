import { useRef } from 'react'
import { brand, hero } from '../content/site'
import { heroFrames } from '../lib/scrollFrames'
import { useScrollFrameSection } from '../lib/useScrollFrameSection'
import './ScrollFrameSection.css'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  const { loadProgress, ready } = useScrollFrameSection({
    sequence: heroFrames,
    scrollTriggerId: 'hero-frames',
    sectionRef,
    canvasRef,
    contentRef,
    hintRef,
    scrollLength: { desktop: 400, mobile: 300 },
    scrub: 1.5,
    zoomFrom: 1.13,
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
        <span className="scroll-frames__watermark" aria-hidden>
          {brand.name}
        </span>

        <div className="scroll-frames__content" ref={contentRef}>
          <p className="scroll-frames__eyebrow">{brand.name}</p>
          <h1 className="scroll-frames__title">{hero.title}</h1>
        </div>

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
