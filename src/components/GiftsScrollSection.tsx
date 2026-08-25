import { useId, useRef } from 'react'
import { giftsSection } from '../content/site'
import { giftsScrollFrames } from '../lib/scrollFrames'
import { useScrollFrameSection } from '../lib/useScrollFrameSection'
import './ScrollFrameSection.css'

const VB = 1000
const PLATE = { x: -1600, y: -1600, size: 4200 }
const HEART_CENTER = { x: VB / 2, y: VB / 2 - 30 }
/** Сердце в боксе 32×29.6, центрируем сдвигом внутрь группы */
const HEART_PATH =
  'M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z'

export function GiftsScrollSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const zoomSvgRef = useRef<SVGSVGElement>(null)
  const zoomShapeRef = useRef<SVGGElement>(null)
  const zoomCaptionRef = useRef<SVGTextElement>(null)

  const uid = useId().replace(/:/g, '')
  const maskId = `gifts-zoom-mask-${uid}`
  const baseId = `gifts-zoom-base-${uid}`

  const { loadProgress, ready } = useScrollFrameSection({
    sequence: giftsScrollFrames,
    scrollTriggerId: 'gifts-scroll-frames',
    sectionRef,
    stageRef,
    canvasRef,
    hintRef,
    scrollLength: { desktop: 560, mobile: 420 },
    holdEndRatio: 1.36,
    fadeHint: false,
    scrub: true,
    zoomFrom: 1.06,
    zoomMask: {
      svgRef: zoomSvgRef,
      shapeRef: zoomShapeRef,
      captionRef: zoomCaptionRef,
      gateRatio: 0.32,
      shapeOrigin: HEART_CENTER,
      shapeScaleFrom: 11,
      shapeScaleTo: { desktop: 56, mobile: 34 },
      scaleTo: { desktop: 6.4, mobile: 4.2 },
    },
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
      <div className="scroll-frames__stage" ref={stageRef}>
        <div className="scroll-frames__poster" aria-hidden />
        <canvas className="scroll-frames__canvas" ref={canvasRef} aria-hidden />
        <div className="scroll-frames__shade scroll-frames__shade--gifts" aria-hidden />

        <svg
          className="scroll-frames__zoom"
          ref={zoomSvgRef}
          viewBox={`0 0 ${VB} ${VB}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={giftsSection.zoomTitle}
        >
          <defs>
            <linearGradient id={baseId} x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor="#161e05" />
              <stop offset="100%" stopColor="#121804" />
            </linearGradient>

            <mask
              id={maskId}
              maskUnits="userSpaceOnUse"
              x={PLATE.x}
              y={PLATE.y}
              width={PLATE.size}
              height={PLATE.size}
            >
              <rect
                x={PLATE.x}
                y={PLATE.y}
                width={PLATE.size}
                height={PLATE.size}
                fill="#fff"
              />
              <g ref={zoomShapeRef}>
                <path d={HEART_PATH} transform="translate(-16 -14.8)" fill="#000" />
              </g>
            </mask>
          </defs>

          <g mask={`url(#${maskId})`}>
            <rect
              x={PLATE.x}
              y={PLATE.y}
              width={PLATE.size}
              height={PLATE.size}
              fill={`url(#${baseId})`}
            />
          </g>

          <text
            className="scroll-frames__zoom-caption"
            ref={zoomCaptionRef}
            x={VB / 2}
            y={VB - 300}
            textAnchor="middle"
          >
            {giftsSection.zoomTitle}
          </text>
        </svg>

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
