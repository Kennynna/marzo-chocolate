import { bars, collectionSection, cta, links } from '../content/site'
import { useReveal } from '../lib/useReveal'
import { MediaImage } from './MediaImage'
import { ScrollOrnamentBand } from './ScrollOrnamentBand'
import './ProductShowcase.css'

export function ProductShowcase() {
  const ref = useReveal({ stagger: 0.12, y: 48 })

  return (
    <section className="showcase" id="product" ref={ref}>
      <ScrollOrnamentBand tilt="diagonal-up" />
      <span className="section-rail showcase__rail">02 · коллекция</span>
      <span className="ghost-number showcase__ghost-bg">03</span>

      <div className="showcase__intro">
        <p className="showcase__eyebrow" data-reveal>
          коллекция
        </p>
        <h2 className="showcase__title" data-reveal>
          {collectionSection.title}
        </h2>
        <p className="showcase__lead" data-reveal>
          {collectionSection.description}
        </p>
      </div>

      <div className="showcase__grid">
        {bars.map((bar, i) => (
          <article
            className={`showcase__card showcase__card--${i + 1}`}
            key={bar.id}
            data-product={bar.id}
            data-reveal
          >
            <span className="showcase__ghost-num">{bar.number}</span>
            <div className="showcase__media frame-brackets">
              <MediaImage src={bar.image} alt={bar.title}  />
            </div>
            <div className="showcase__body">
              <p className="showcase__number">{bar.number}</p>
              <h3 className="showcase__name">{bar.title}</h3>
              <p className="showcase__name-en">{bar.titleEn}</p>
              <p className="showcase__ingredients">
                <span>Состав</span>
                {bar.ingredients}
              </p>
              <div className="showcase__actions">
                <a className="showcase__cta" href="#contact">
                  {cta.order}
                </a>
                <a className="showcase__details" href={bar.href}>
                  {cta.details}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <a className="showcase__catalog" href={links.catalog} data-reveal>
        <span>{cta.allCollection}</span>
      </a>
    </section>
  )
}
