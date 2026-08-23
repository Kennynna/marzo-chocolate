import './Marquee.css'

type MarqueeProps = {
  items: readonly string[]
  variant?: 'dark' | 'light' | 'gold'
}

export function Marquee({ items, variant = 'dark' }: MarqueeProps) {
  const line = items.join(' · ') + ' · '
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
