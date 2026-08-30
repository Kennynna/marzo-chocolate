import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useBootReady } from '../lib/bootLoader'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { useSite } from '../lib/language'
import { REVEAL_EASE } from '../lib/motion'
import { FiligreeOrnament } from './FiligreeOrnament'
import { Reveal, RevealWords } from './Reveal'
import './WelcomeSection.css'

/** Медленное всплытие света, после него — раскрыв круга */
const AURA_FADE = 0.75
const CIRCLE_CLOSED = 'circle(0% at 50% 52%)'
const CIRCLE_OPEN = 'circle(120% at 50% 52%)'
/** Полная длина стартового каскада: после неё задержки сбрасываются */
const INTRO_MS = 2200

export function WelcomeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const booted = useBootReady()
  const { brand, media, proverb, ui, welcome } = useSite()
  /** Появление стартует только когда лоадер ушёл, иначе каскад играет вслепую */
  const play = booted || Boolean(reduced)
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    if (!play || introDone) return

    const timer = window.setTimeout(() => setIntroDone(true), INTRO_MS)
    return () => window.clearTimeout(timer)
  }, [play, introDone])

  /** Смена языка перемонтирует слова заголовка — стартовые задержки к ней уже не относятся */
  const stage = (delay: number) => (introDone ? 0 : delay)

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
      aria-label={ui.aria.welcome}
    >
      <div className="welcome__stage" ref={stageRef}>
        <motion.div
          className="welcome__atmosphere"
          aria-hidden
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced || !play ? undefined : { opacity: 1 }}
          transition={{ duration: AURA_FADE, ease: 'easeOut' }}
        >
          <div className="welcome__aura" />
          <div className="welcome__grain" />
          <div className="welcome__frame" />
        </motion.div>

        <motion.div
          className="welcome__reveal"
          initial={reduced ? undefined : { clipPath: CIRCLE_CLOSED }}
          animate={reduced || !play ? undefined : { clipPath: CIRCLE_OPEN }}
          transition={{ duration: 0.85, delay: AURA_FADE, ease: REVEAL_EASE }}
        >
          <Reveal
            className="welcome__proverb"
            immediate
            play={play}
            delay={stage(AURA_FADE + 0.28)}
            y={12}
            duration={0.6}
          >
            <span className="welcome__proverb-quote" aria-hidden>
              “
            </span>
            <blockquote className="welcome__proverb-text">{proverb.original}</blockquote>
            <span className="welcome__proverb-translation">{proverb.translation}</span>
            <span className="welcome__proverb-source">{proverb.source}</span>
          </Reveal>

          <div className="welcome__inner">
            <div className="welcome__copy" ref={copyRef}>

              <h1 className="welcome__heading">
                <RevealWords
                  className="welcome__wordmark"
                  text={brand.name}
                  immediate
                  play={play}
                  delay={stage(AURA_FADE + 0.14)}
                  duration={0.7}
                />
                <RevealWords
                  className="welcome__title"
                  text={welcome.title}
                  immediate
                  play={play}
                  delay={stage(AURA_FADE + 0.24)}
                  duration={0.6}
                  stagger={0.04}
                />
              </h1>

              <Reveal
                className="welcome__filigree"
                immediate
                play={play}
                delay={stage(AURA_FADE + 0.4)}
                y={8}
                duration={0.6}
              >
                <FiligreeOrnament className="filigree--welcome" animate={false} />
              </Reveal>

              <ul className="welcome__meta">
                {welcome.meta.map((item, index) => (
                  <motion.li
                    key={item}
                    className="welcome__meta-item"
                    initial={reduced ? undefined : { opacity: 0, y: 12 }}
                    animate={reduced || !play ? undefined : { opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: stage(AURA_FADE + 0.46 + index * 0.07),
                      ease: REVEAL_EASE,
                    }}
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
                animate={reduced || !play ? undefined : { clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: 0.8, delay: AURA_FADE + 0.12, ease: REVEAL_EASE }}
              >
                <motion.img
                  className="welcome__photo"
                  src={media.welcome}
                  alt=""
                  width={1052}
                  height={716}
                  decoding="async"
                  fetchPriority="high"
                  draggable={false}
                  onContextMenu={(event) => event.preventDefault()}
                  initial={reduced ? undefined : { scale: 1.16 }}
                  animate={reduced || !play ? undefined : { scale: 1 }}
                  transition={{ duration: 1.4, delay: AURA_FADE + 0.12, ease: REVEAL_EASE }}
                />
                <span className="welcome__photo-shade" aria-hidden />
              </motion.div>

              <Reveal
                className="welcome__caption"
                immediate
                play={play}
                delay={stage(AURA_FADE + 0.56)}
                y={10}
                duration={0.5}
              >
                {welcome.caption}
              </Reveal>
            </div>
          </div>

          <Reveal
            className="welcome__cue"
            immediate
            play={play}
            delay={stage(AURA_FADE + 0.66)}
            y={0}
            duration={0.6}
          >
            <span className="welcome__cue-label">{welcome.scrollHint}</span>
            <span className="welcome__cue-line" aria-hidden />
          </Reveal>
        </motion.div>
      </div>
    </section>
  )
}
