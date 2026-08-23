import { useRef } from 'react'
import { giftsSection } from '../content/site'
import { giftsScrollFrames } from '../lib/scrollFrames'
import { useScrollFrameSection } from '../lib/useScrollFrameSection'
import './ScrollFrameSection.css'

export function GiftsScrollSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  const { loadProgress, ready } = useScrollFrameSection({
    sequence: giftsScrollFrames,
    scrollTriggerId: 'gifts-scroll-frames',
    sectionRef,
    canvasRef,
    contentRef,
    hintRef,
    scrollLength: { desktop: 360, mobile: 270 },
    scrub: 1.5,
    zoomFrom: 1.11,
    contentFadeEnd: '+=22%',
  })

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section
      className={`scroll-frames${reduced ? ' scroll-frames--reduced' : ''}`}
      id="gifts-scroll"
      ref={sectionRef}
      aria-label="Подарочные наборы — видео"
    >
      <div className="scroll-frames__stage">
        <canvas className="scroll-frames__canvas" ref={canvasRef} aria-hidden />
        <div className="scroll-frames__shade scroll-frames__shade--gifts" aria-hidden />
        <span className="scroll-frames__watermark" aria-hidden>
          gift
        </span>

        <div className="scroll-frames__content scroll-frames__content--center" ref={contentRef}>
          <div className="scroll-frames__content-inner">
            <p className="scroll-frames__eyebrow">подарочная линейка</p>
            <h2 className="scroll-frames__title">{giftsSection.title}</h2>
          </div>
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
