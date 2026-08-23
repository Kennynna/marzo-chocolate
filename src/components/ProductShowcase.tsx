import { useRef } from 'react'
import { bars, collectionSection, cta, links } from '../content/site'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'
import { MediaImage } from './MediaImage'
import './ProductShowcase.css'

export function ProductShowcase() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const intro = root.current?.querySelector('.showcase__intro')
      const title = root.current?.querySelector('.showcase__title')
      const lead = root.current?.querySelector('.showcase__lead')
      if (!intro || !title || !lead) return

      let split: SplitText | undefined
      let cancelled = false

      const revealIntro = () => {
        if (cancelled) return

        split = SplitText.create(title, { type: 'lines', mask: 'lines' })
        gsap.set(title, { visibility: 'visible' })

        if (reduced) {
          gsap.set([split.lines, lead], { autoAlpha: 1, yPercent: 0 })
          return
        }

        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: intro,
            start: 'top 78%',
            once: true,
          },
        })

        introTl.from(split.lines, {
          yPercent: 110,
          duration: 1.15,
          ease: 'expo.out',
          stagger: 0.09,
        })
        introTl.from(
          lead,
          { y: 28, autoAlpha: 0, duration: 0.9, ease: 'power3.out' },
          '-=0.7',
        )
      }

      if (document.fonts.status === 'loaded') revealIntro()
      else void document.fonts.ready.then(revealIntro)

      if (reduced) {
        gsap.set('.showcase__slide', { autoAlpha: 1, clearProps: 'clipPath' })
        return () => {
          cancelled = true
          split?.revert()
        }
      }

      const mm = gsap.matchMedia()

      mm.add('(min-width: 961px)', () => {
        const pin = '.showcase__pin'
        const slides = gsap.utils.toArray<HTMLElement>('.showcase__slide')
        const fill = '.showcase__fill'
        const indexEl = '.showcase__index-current'

        gsap.set(slides, { autoAlpha: 0 })
        gsap.set(slides[0], { autoAlpha: 1 })
        gsap.set(slides[0].querySelector('.showcase__frame'), {
          clipPath: 'inset(0% 0% 0% 0%)',
        })
        slides.slice(1).forEach((slide) => {
          gsap.set(slide.querySelector('.showcase__frame'), {
            clipPath: 'inset(100% 0% 0% 0%)',
          })
        })

        const tl = gsap.timeline({
          defaults: { ease: 'power3.inOut' },
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${window.innerHeight * slides.length * 1.15}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const current = Math.min(
                slides.length - 1,
                Math.floor(self.progress * slides.length),
              )
              const node = root.current?.querySelector(indexEl)
              if (node) node.textContent = bars[current].number
              gsap.set(fill, { scaleX: Math.max(0.12, self.progress) })
            },
          },
        })

        slides.forEach((slide, index) => {
          const frame = slide.querySelector('.showcase__frame')
          const image = slide.querySelector('.media-image')
          const copy = slide.querySelectorAll('.showcase__copy > *')
          const next = slides[index + 1]
          const nextFrame = next?.querySelector('.showcase__frame')
          const nextImage = next?.querySelector('.media-image')

          if (index === 0) {
            tl.fromTo(image, { scale: 1.16 }, { scale: 1, duration: 1.2, ease: 'none' }, 0)
          }

          if (!next || !nextFrame) {
            tl.to(image, { scale: 1, duration: 0.45 })
            return
          }

          tl.to(frame, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1 }, '+=0.4')
          tl.to(copy, { y: -24, autoAlpha: 0, duration: 0.55, stagger: 0.04 }, '<')
          tl.to(slide, { autoAlpha: 0, duration: 0.2 }, '<+0.45')
          tl.to(next, { autoAlpha: 1, duration: 0.01 }, '<')
          tl.fromTo(
            nextFrame,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 },
            '<',
          )
          tl.fromTo(nextImage, { scale: 1.2 }, { scale: 1, duration: 1.1, ease: 'none' }, '<')
          tl.from(
            next.querySelectorAll('.showcase__copy > *'),
            { y: 40, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out' },
            '-=0.55',
          )
        })

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      })

      mm.add('(max-width: 960px)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('.showcase__slide')

        cards.forEach((card) => {
          const frame = card.querySelector('.showcase__frame')
          const image = card.querySelector('.media-image')
          const copy = card.querySelectorAll('.showcase__copy > *')

          gsap.set(frame, { clipPath: 'inset(100% 0% 0% 0%)' })
          gsap.set(image, { scale: 1.2 })
          gsap.set(copy, { y: 28, autoAlpha: 0 })

          const cardTl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              end: 'top 28%',
              toggleActions: 'play none none reverse',
            },
          })

          cardTl.to(frame, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.15,
            ease: 'expo.out',
          })
          cardTl.to(image, { scale: 1, duration: 1.35, ease: 'power2.out' }, 0)
          cardTl.to(
            copy,
            { y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.08, ease: 'power3.out' },
            0.28,
          )
        })
      })

      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh)
      void document.fonts.ready.then(() => {
        if (!cancelled) refresh()
      })

      return () => {
        cancelled = true
        split?.revert()
        window.removeEventListener('load', refresh)
        mm.revert()
      }
    },
    { scope: root },
  )

  return (
    <section className="showcase" id="product" ref={root}>
      <span className="section-rail showcase__rail">02 · коллекция</span>

      <div className="showcase__intro">
        <p className="showcase__count" aria-hidden>
          03
        </p>
        <div className="showcase__intro-copy">
          <p className="showcase__eyebrow">коллекция</p>
          <h2 className="showcase__title">{collectionSection.title}</h2>
          <p className="showcase__lead">{collectionSection.description}</p>
        </div>
      </div>

      <div className="showcase__pin">
        <div className="showcase__stage">
          {bars.map((bar) => (
            <article className="showcase__slide" key={bar.id} data-product={bar.id}>
              <span className="showcase__ghost">{bar.number}</span>
              <div className="showcase__visual">
                <div className="showcase__frame frame-brackets">
                  <MediaImage className="showcase__image" src={bar.image} alt={bar.title} />
                </div>
              </div>

              <div className="showcase__copy">
                <p className="showcase__number">{bar.number}</p>
                <h3 className="showcase__name">{bar.title}</h3>
                <p className="showcase__name-en">{bar.titleEn}</p>
                <p className="showcase__ingredients">
                  <span>Состав</span>
                  {bar.ingredients}
                </p>
                <a className="showcase__cta" href="#contact">
                  {cta.order}
                </a>
                <a className="showcase__details" href={bar.href}>
                  {cta.details}
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="showcase__progress" aria-hidden>
          <span className="showcase__index-current">01</span>
          <div className="showcase__track">
            <div className="showcase__fill" />
          </div>
          <span>03</span>
        </div>
      </div>

      <a className="showcase__catalog" href={links.catalog}>
        {cta.allCollection}
      </a>
    </section>
  )
}
