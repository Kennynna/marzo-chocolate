import { cta, gifts, giftsSection, links } from '../content/site'
import { useReveal } from '../lib/useReveal'
import { MediaImage } from './MediaImage'
import { ScrollOrnamentBand } from './ScrollOrnamentBand'
import './GiftSetsSection.css'

export function GiftSetsSection() {
  const ref = useReveal({ stagger: 0.14 })

  return (
    <section className="gifts" id="gifts" ref={ref}>
      <ScrollOrnamentBand tilt={9} />
      <span className="section-rail gifts__rail">03 · подарки</span>
      <span className="ghost-number gifts__ghost">gift</span>

      <div className="gifts__intro">
        <p className="gifts__eyebrow" data-reveal>
          подарочная линейка
        </p>
        <h2 className="gifts__title" data-reveal>
          {giftsSection.title}
        </h2>
        <p className="gifts__lead" data-reveal>
          {giftsSection.description}
        </p>
      </div>

      <div className="gifts__grid">
        {gifts.map((gift, i) => (
          <article
            className={`gifts__card gifts__card--${i + 1}`}
            key={gift.id}
            data-reveal
          >
            <span className="gifts__ghost-num">{gift.number}</span>
            <div className="gifts__media frame-brackets">
              <MediaImage src={gift.image} alt={gift.title} />
            </div>
            <div className="gifts__body">
              <p className="gifts__number">{gift.number}</p>
              <h3 className="gifts__name">{gift.title}</h3>
              <div className="gifts__actions">
                <a className="gifts__cta" href="#contact">
                  {cta.order}
                </a>
                <a className="gifts__details" href={gift.href}>
                  {cta.details}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <a className="gifts__all" href={links.catalog} data-reveal>
        <span>{cta.allCollection}</span>
      </a>
    </section>
  )
}
