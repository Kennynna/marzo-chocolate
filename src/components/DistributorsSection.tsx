import { cta, distributors, distributorsSection } from '../content/site'
import { useReveal } from '../lib/useReveal'
import './DistributorsSection.css'

export function DistributorsSection() {
  const ref = useReveal({ stagger: 0.12 })

  return (
    <section className="distributors" id={distributorsSection.id} ref={ref}>
      <span className="section-rail">05 · партнёрам</span>
      <span className="section-watermark distributors__watermark">partner</span>

      <div className="distributors__intro">
        <p className="distributors__eyebrow" data-reveal>
          дистрибьюторам
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

      <a className="distributors__cta" href="#contact" data-reveal>
        {cta.contactUs}
      </a>
    </section>
  )
}
