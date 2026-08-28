import { useContactModal } from '../lib/contactModal'
import { useSite } from '../lib/language'
import { useReveal } from '../lib/useReveal'
import { ScrollOrnamentBand } from './ScrollOrnamentBand'
import './DistributorsSection.css'

export function DistributorsSection() {
  const ref = useReveal({ stagger: 0.12 })
  const contactModal = useContactModal()
  const { cta, distributors, distributorsSection, ui } = useSite()

  return (
    <section className="distributors" id={distributorsSection.id} ref={ref}>
      <ScrollOrnamentBand tone="dark" tilt={161} />
      <span className="section-rail">{ui.rails.distributors}</span>
      <span className="section-watermark distributors__watermark">partner</span>

      <div className="distributors__intro">
        <p className="distributors__eyebrow" data-reveal>
          {ui.eyebrows.distributors}
        </p>
        <h2 className="distributors__title" data-reveal>
          {distributors.title}
        </h2>
        <p className="distributors__lead" data-reveal>
          {distributors.intro}
        </p>
      </div>

      <div className="distributors__grid">
        {distributors.items.map((item, i) => (
          <article className="distributors__card" key={item.title} data-reveal>
            <span className="distributors__index">{String(i + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="u-button-reset distributors__cta"
        onClick={contactModal.open}
        data-reveal
      >
        {cta.contactUs}
      </button>
    </section>
  )
}
