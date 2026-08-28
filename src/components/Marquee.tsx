import { useSite } from '../lib/language'
import './Marquee.css'

type MarqueeProps = {
  source: 'brand' | 'collection'
  variant?: 'dark' | 'light' | 'gold'
}

export function Marquee({ source, variant = 'dark' }: MarqueeProps) {
  const { marquee } = useSite()
  const line = marquee[source].join(' · ') + ' · '
  const track = line + line

  return (
    <div className={`marquee marquee--${variant}`} aria-hidden>
      <div className="marquee__track">
        <span>{track}</span>
        <span>{track}</span>
      </div>
    </div>
  )
}
