import { cta, media, privateLabel } from '../content/site'
import { useReveal } from '../lib/useReveal'
import { MediaImage } from './MediaImage'
import { ScrollOrnamentBand } from './ScrollOrnamentBand'
import './PrivateLabelSection.css'

export function PrivateLabelSection() {
  const ref = useReveal({ stagger: 0.12 })

  return (
    <section className="private-label" id={privateLabel.id} ref={ref}>
      <ScrollOrnamentBand tilt={-31} />
      <span className="section-rail private-label__rail">04 · b2b</span>
      <div className="private-label__band" aria-hidden />

      <div className="private-label__grid">
        <div className="private-label__content">
          <p className="private-label__eyebrow" data-reveal>
            для бизнеса
          </p>
          <h2 className="private-label__title" data-reveal>
            {privateLabel.title}
          </h2>
          <p className="private-label__subtitle" data-reveal>
            {privateLabel.subtitle}
          </p>
          <p className="private-label__text" data-reveal>
            {privateLabel.description}
          </p>
          <a className="private-label__cta" href="#contact" data-reveal>
            {cta.createBrand}
          </a>
        </div>

        <div className="private-label__visual frame-brackets" data-reveal>
          <MediaImage src={media.privateLabel} alt={privateLabel.title} />
          <span className="private-label__stamp">your brand</span>
        </div>
      </div>

      <div className="private-label__facts">
        {privateLabel.facts.map((fact, i) => (
          <article className="private-label__fact" key={fact.value} data-reveal>
            <span className="private-label__fact-index">{String(i + 1).padStart(2, '0')}</span>
            <p className="private-label__fact-value">{fact.value}</p>
            <p className="private-label__fact-label">{fact.label}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
