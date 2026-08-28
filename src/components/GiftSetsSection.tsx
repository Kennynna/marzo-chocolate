import { useContactModal } from '../lib/contactModal'
import { useSite } from '../lib/language'
import { useReveal } from '../lib/useReveal'
import { MediaImage } from './MediaImage'
import { ScrollOrnamentBand } from './ScrollOrnamentBand'
import './GiftSetsSection.css'

export function GiftSetsSection() {
  const ref = useReveal({ stagger: 0.14 })
  const contactModal = useContactModal()
  const { cta, gifts, giftsSection, links, ui } = useSite()

  return (
    <section className="gifts" id="gifts" ref={ref}>
      <ScrollOrnamentBand tilt={9} />
      <span className="section-rail gifts__rail">{ui.rails.gifts}</span>
      <span className="ghost-number gifts__ghost">gift</span>

      <div className="gifts__intro">
        <p className="gifts__eyebrow" data-reveal>
          {ui.eyebrows.gifts}
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
                <button
                  type="button"
                  className="u-button-reset gifts__cta"
                  onClick={contactModal.open}
                >
                  {cta.order}
                </button>
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
