import { useRef } from 'react'
import { aboutFeatures, brand, cta, hero, media } from '../content/site'
import { gsap, useGSAP } from '../lib/gsap'
import { useReveal } from '../lib/useReveal'
import { MediaImage } from './MediaImage'
import { ScrollOrnamentBand } from './ScrollOrnamentBand'
import './AboutSection.css'

export function AboutSection() {
  const ref = useReveal({ stagger: 0.12 })
  const visualRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced || !visualRef.current) return

      gsap.to('.about__ornament', {
        y: (i) => (i % 2 ? -18 : 14),
        rotation: (i) => (i % 2 ? 6 : -4),
        ease: 'none',
        scrollTrigger: {
          trigger: visualRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      })
    },
    { scope: visualRef },
  )

  return (
    <section className="about" id="about" ref={ref}>
      <ScrollOrnamentBand tone="dark" tilt="diagonal-down" />
      <span className="section-rail">01 · о фабрике</span>
      <span className="section-watermark about__watermark">{brand.name}</span>

      <div className="about__grid">
        <div className="about__visual" ref={visualRef}>
          <div className="about__photo about__photo--main frame-brackets" data-reveal>
            <MediaImage src={media.aboutHero} alt="Фабрика MARZO" priority />
          </div>
          <div className="about__photo about__photo--secondary frame-brackets" data-reveal>
            <MediaImage src={media.aboutSecondary} alt="Производство шоколада MARZO" priority />
          </div>
          <div className="about__photo about__photo--tertiary frame-brackets" data-reveal>
            <MediaImage src={media.aboutTertiary} alt="Шоколад MARZO" priority />
          </div>
          <div className="about__ornaments" aria-hidden>
            {media.ornaments.map((src, i) => (
              <img key={src} className={`about__ornament about__ornament--${i + 1}`} src={src} alt="" />
            ))}
          </div>
        </div>

        <div className="about__content">
          <p className="about__eyebrow" data-reveal>
            {brand.name}
          </p>
          <h2 className="about__title" data-reveal>
            {hero.title}
          </h2>
          <p className="about__text" data-reveal>
            {hero.paragraphs[0]}
          </p>
          <p className="about__text" data-reveal>
            {hero.paragraphs[1]}
          </p>
          <blockquote className="about__style pull-quote" data-reveal>
            {brand.style}
          </blockquote>
          <a className="about__cta" href="#product" data-reveal>
            {cta.collection}
          </a>
        </div>
      </div>

      <ul className="about__features">
        {aboutFeatures.map((feature, i) => (
          <li key={feature} data-reveal>
            <span className="about__feature-index">{String(i + 1).padStart(2, '0')}</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
