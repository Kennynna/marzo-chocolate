import { useRef } from 'react'
import { bars, collectionSection, cta, links, media } from '../content/site'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { scheduleScrollRefresh } from '../lib/scheduleScrollRefresh'
import { MediaImage } from './MediaImage'
import { FiligreeOrnament } from './FiligreeOrnament'
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
        gsap.set('.showcase__slide', { autoAlpha: 1 })
        gsap.set('.showcase__reveal', { yPercent: 0 })
        gsap.set('.showcase__image-wrap', { scale: 1 })
        gsap.set('.showcase__copy', { y: 0, opacity: 1 })
        return () => {
          cancelled = true
          split?.revert()
        }
      }

      const mm = gsap.matchMedia()

      mm.add('(min-width: 961px)', () => {
        const pin = root.current?.querySelector('.showcase__pin')
        const slides = gsap.utils.toArray<HTMLElement>('.showcase__slide')
        const indexEl = root.current?.querySelector('.showcase__index-current')
        const fillEl = root.current?.querySelector('.showcase__fill')
        if (!pin || !slides.length) return

        slides.forEach((slide, index) => {
          const reveal = slide.querySelector('.showcase__reveal')
          const imageWrap = slide.querySelector('.showcase__image-wrap')
          const copy = slide.querySelector('.showcase__copy')
          if (!reveal || !imageWrap || !copy) return

          if (index === 0) {
            gsap.set(slide, { autoAlpha: 1 })
            gsap.set(reveal, { yPercent: 0, force3D: true })
            gsap.set(imageWrap, { scale: 1.1, force3D: true })
            gsap.set(copy, { y: 0, opacity: 1 })
            return
          }

          gsap.set(slide, { autoAlpha: 0 })
          gsap.set(reveal, { yPercent: 100, force3D: true })
          gsap.set(imageWrap, { scale: 1.08, force3D: true })
          gsap.set(copy, { y: 20, opacity: 0 })
        })

        let lastIndex = 0

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${window.innerHeight * slides.length * 1.1}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const current = Math.min(
                slides.length - 1,
                Math.floor(self.progress * slides.length),
              )

              if (current !== lastIndex && indexEl) {
                lastIndex = current
                indexEl.textContent = bars[current].number
              }

              if (fillEl instanceof HTMLElement) {
                fillEl.style.transform = `scaleX(${Math.max(0.12, self.progress)})`
              }
            },
          },
        })

        slides.forEach((slide, index) => {
          const reveal = slide.querySelector('.showcase__reveal')
          const imageWrap = slide.querySelector('.showcase__image-wrap')
          const copy = slide.querySelector('.showcase__copy')
          const next = slides[index + 1]
          if (!reveal || !imageWrap || !copy) return

          if (index === 0) {
            tl.to(imageWrap, { scale: 1, duration: 1.1 }, 0)
          }

          if (!next) {
            tl.to(imageWrap, { scale: 1, duration: 0.4 })
            return
          }

          const nextReveal = next.querySelector('.showcase__reveal')
          const nextImageWrap = next.querySelector('.showcase__image-wrap')
          const nextCopy = next.querySelector('.showcase__copy')
          if (!nextReveal || !nextImageWrap || !nextCopy) return

          const at = index === 0 ? 1.1 : '+=0.35'

          tl.to(reveal, { yPercent: -100, duration: 0.95, force3D: true }, at)
          tl.to(copy, { y: -16, opacity: 0, duration: 0.45 }, '<')
          tl.to(slide, { autoAlpha: 0, duration: 0.15 }, '<+0.6')

          tl.to(next, { autoAlpha: 1, duration: 0.15 }, '<')
          tl.fromTo(
            nextReveal,
            { yPercent: 100, force3D: true },
            { yPercent: 0, duration: 0.95, force3D: true },
            '<',
          )
          tl.fromTo(nextImageWrap, { scale: 1.08, force3D: true }, { scale: 1, duration: 0.95, force3D: true }, '<')
          tl.fromTo(nextCopy, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '<+0.25')
        })

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      })

      mm.add('(max-width: 960px)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('.showcase__slide')

        cards.forEach((card) => {
          const reveal = card.querySelector('.showcase__reveal')
          const imageWrap = card.querySelector('.showcase__image-wrap')
          const copy = card.querySelector('.showcase__copy')
          if (!reveal || !imageWrap || !copy) return

          gsap.set(reveal, { yPercent: 100, force3D: true })
          gsap.set(imageWrap, { scale: 1.08, force3D: true })
          gsap.set(copy, { y: 20, opacity: 0 })

          const cardTl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              end: 'top 28%',
              toggleActions: 'play none none reverse',
            },
          })

          cardTl.to(reveal, {
            yPercent: 0,
            duration: 1,
            ease: 'expo.out',
            force3D: true,
          })
          cardTl.to(imageWrap, { scale: 1, duration: 1.1, ease: 'power2.out', force3D: true }, 0)
          cardTl.to(copy, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.22)
        })
      })

      const refresh = () => scheduleScrollRefresh()
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
          <img className="showcase__logo" src={media.logo} alt="MARZO" />
          <FiligreeOrnament className="filigree--in-showcase" />
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
                  <div className="showcase__reveal">
                    <div className="showcase__image-wrap">
                      <MediaImage
                        className="showcase__image"
                        src={bar.image}
                        alt={bar.title}
                        priority
                      />
                    </div>
                  </div>
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
