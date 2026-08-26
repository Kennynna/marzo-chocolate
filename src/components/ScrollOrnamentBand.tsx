import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { scheduleScrollRefresh } from '../lib/scheduleScrollRefresh'
import { buildOrnamentPath } from './ornamentPath'
import './ScrollOrnamentBand.css'

const MOBILE_MAX_WIDTH = 960

/** Ширина одного S-витка на экране. Форма не тянется — меняется только длина цепочки. */
const MODULE_TARGET_PX = { desktop: 168, mobile: 118 }

/**
 * Предел наклона к горизонтали. На узких экранах секции сильно вытянуты, и честная
 * диагональ выродилась бы в почти вертикальную полосу — узор перестал бы «бежать» в сторону.
 */
const MAX_TILT_DEG = { desktop: 58, mobile: 42 }

/** Минимум как на флаге: четыре связанных спирали. Верх — чтобы путь не стал слишком длинным. */
const MODULE_RANGE = { min: 4, max: 14 }

/**
 * Наклон ленты: угол в градусах по часовой стрелке либо диагональ секции.
 * `diagonal-down` — из левого верхнего угла в правый нижний, `diagonal-up` — из правого верхнего в левый нижний.
 */
export type OrnamentTilt = number | 'diagonal-down' | 'diagonal-up'

type ScrollOrnamentBandProps = {
  /** Тон подложки, на которой лежит орнамент */
  tone?: 'light' | 'dark'
  tilt?: OrnamentTilt
  className?: string
}

type Box = { width: number; height: number; mobile: boolean }

const resolveAngle = (tilt: OrnamentTilt, { width, height, mobile }: Box) => {
  if (typeof tilt === 'number') return tilt

  const limit = mobile ? MAX_TILT_DEG.mobile : MAX_TILT_DEG.desktop
  const diagonal = Math.min((Math.atan2(height, width) * 180) / Math.PI, limit)

  return tilt === 'diagonal-down' ? diagonal : 180 - diagonal
}

/** Длина хорды через центр секции под этим углом — лента упирается ровно в границы. */
const resolveLength = (angle: number, { width, height }: Box) => {
  const radians = (angle * Math.PI) / 180
  const cos = Math.abs(Math.cos(radians))
  const sin = Math.abs(Math.sin(radians))

  const acrossX = cos < 1e-4 ? Infinity : width / cos
  const acrossY = sin < 1e-4 ? Infinity : height / sin

  return Math.min(acrossX, acrossY)
}

export function ScrollOrnamentBand({
  tone = 'light',
  tilt = 'diagonal-down',
  className,
}: ScrollOrnamentBandProps) {
  const root = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [box, setBox] = useState<Box | null>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const measure = () => {
      const { clientWidth, clientHeight } = el
      if (!clientWidth || !clientHeight) return

      const next: Box = {
        width: clientWidth,
        height: clientHeight,
        mobile: window.innerWidth < MOBILE_MAX_WIDTH,
      }

      setBox((prev) =>
        prev && prev.width === next.width && prev.height === next.height && prev.mobile === next.mobile
          ? prev
          : next,
      )
    }

    // ResizeObserver отдаёт начальный размер сам, поэтому измерять вручную не нужно.
    const observer = new ResizeObserver(measure)
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  const angle = box ? resolveAngle(tilt, box) : 0
  const length = box ? resolveLength(angle, box) : 0
  const target = box?.mobile ? MODULE_TARGET_PX.mobile : MODULE_TARGET_PX.desktop
  const modules = length
    ? Math.min(MODULE_RANGE.max, Math.max(MODULE_RANGE.min, Math.round(length / target)))
    : 0
  const geometry = modules > 0 ? buildOrnamentPath(modules) : null
  const ribbonWidth = geometry ? length : 0
  const strokeWidth =
    geometry && length ? ((box?.mobile ? 3.2 : 2.8) * geometry.width) / length : 2.8

  useGSAP(
    () => {
      const path = pathRef.current
      const band = root.current
      if (!path || !band || !geometry) return

      const pathLength = path.getTotalLength()

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(path, { strokeDasharray: 'none', strokeDashoffset: 0 })
        return
      }

      gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength })

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: band,
          start: 'top 85%',
          end: 'bottom 15%',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })

      scheduleScrollRefresh()
    },
    { scope: root, dependencies: [geometry?.d, angle] },
  )

  return (
    <div
      ref={root}
      className={`ornament-band ornament-band--${tone}${className ? ` ${className}` : ''}`}
      aria-hidden
    >
      {geometry ? (
        <div
          className="ornament-band__ribbon"
          style={{
            width: `${ribbonWidth}px`,
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          }}
        >
          <svg
            className="ornament-band__svg"
            viewBox={`0 0 ${geometry.width} ${geometry.height}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              ref={pathRef}
              className="ornament-band__path"
              d={geometry.d}
              strokeWidth={strokeWidth}
            />
          </svg>
        </div>
      ) : null}
    </div>
  )
}
