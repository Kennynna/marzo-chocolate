import { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { brand, media, welcome } from '../content/site'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { REVEAL_EASE } from '../lib/motion'
import { FiligreeOrnament } from './FiligreeOrnament'
import { Reveal, RevealWords } from './Reveal'
import './WelcomeSection.css'

export function WelcomeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const section = sectionRef.current
      const stage = stageRef.current
      const copy = copyRef.current
      const visual = visualRef.current
      if (!section || !stage || !copy || !visual) return

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * 1.15}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(copy, { y: -72, opacity: 0, ease: 'none', duration: 0.6 }, 0)
      tl.to(visual, { y: -36, scale: 1.06, opacity: 0, ease: 'none', duration: 0.8 }, 0.12)
      tl.to(stage, { opacity: 0, ease: 'none', duration: 0.4 }, 0.7)

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
        ScrollTrigger.getAll()
          .filter((st) => st.trigger === section)
          .forEach((st) => st.kill())
      }
    },
    { scope: sectionRef },
  )

  return (
    <section
      className="welcome"
      id="welcome"
      ref={sectionRef}
      aria-label="Приветствие MARZO"
    >
      <div className="welcome__stage" ref={stageRef}>
        <div className="welcome__grain" aria-hidden />
        <div className="welcome__frame" aria-hidden />

        <div className="welcome__inner">
          <div className="welcome__copy" ref={copyRef}>
            <Reveal className="welcome__eyebrow" immediate delay={0.15} y={14} duration={0.7}>
              <span className="welcome__eyebrow-rule" aria-hidden />
              {welcome.eyebrow}
            </Reveal>

            <h1 className="welcome__heading">
              <RevealWords
                className="welcome__wordmark"
                text={brand.name}
                immediate
                delay={0.3}
                duration={1.1}
              />
              <RevealWords className="welcome__title" text={welcome.title} immediate delay={0.55} />
            </h1>

            <Reveal className="welcome__filigree" immediate delay={0.9} y={10} duration={1}>
              <FiligreeOrnament className="filigree--welcome" animate={false} />
            </Reveal>

            <ul className="welcome__meta">
              {welcome.meta.map((item, index) => (
                <motion.li
                  key={item}
                  className="welcome__meta-item"
                  initial={reduced ? undefined : { opacity: 0, y: 14 }}
                  animate={reduced ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1, ease: REVEAL_EASE }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="welcome__visual" ref={visualRef}>
            <span className="welcome__arch-echo" aria-hidden />

            <motion.div
              className="welcome__arch"
              initial={reduced ? undefined : { clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={reduced ? undefined : { clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 1.35, delay: 0.25, ease: REVEAL_EASE }}
            >
              <motion.img
                className="welcome__photo"
                src={media.welcome}
                alt=""
                decoding="async"
                fetchPriority="high"
                initial={reduced ? undefined : { scale: 1.18 }}
                animate={reduced ? undefined : { scale: 1 }}
                transition={{ duration: 1.8, delay: 0.25, ease: REVEAL_EASE }}
              />
              <span className="welcome__photo-shade" aria-hidden />
            </motion.div>

            <Reveal className="welcome__caption" immediate delay={1.2} y={12} duration={0.7}>
              {welcome.caption}
            </Reveal>
          </div>
        </div>

        <Reveal className="welcome__cue" immediate delay={1.4} y={0} duration={0.8}>
          <span className="welcome__cue-label">{welcome.scrollHint}</span>
          <span className="welcome__cue-line" aria-hidden />
        </Reveal>
      </div>
    </section>
  )
}
