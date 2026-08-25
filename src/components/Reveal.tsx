import { createElement, type ElementType, type ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { REVEAL_EASE } from '../lib/motion'
import './Reveal.css'

/**
 * Появления через motion: монтирование и вход во вьюпорт.
 * Скролл-сцены (pin, scrub) остаются за GSAP — motion трогает только
 * внутренние узлы, чтобы анимации не спорили за один transform.
 */

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  /** Играть сразу после монтирования, а не по появлению во вьюпорте */
  immediate?: boolean
  amount?: number
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.85,
  y = 28,
  immediate = false,
  amount = 0.3,
}: RevealProps) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  const shown = { opacity: 1, y: 0 }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...(immediate
        ? { animate: shown }
        : { whileInView: shown, viewport: { once: true, amount } })}
      transition={{ duration, delay, ease: REVEAL_EASE }}
    >
      {children}
    </motion.div>
  )
}

type RevealWordsProps = {
  text: string
  as?: ElementType
  className?: string
  delay?: number
  duration?: number
  stagger?: number
  immediate?: boolean
  amount?: number
}

/** Текст по словам из-под маски */
export function RevealWords({
  text,
  as = 'span',
  className,
  delay = 0,
  duration = 0.9,
  stagger = 0.055,
  immediate = false,
  amount = 0.4,
}: RevealWordsProps) {
  const reduced = useReducedMotion()

  if (reduced) return createElement(as, { className }, text)

  return createElement(
    as,
    { className: className ? `reveal-words ${className}` : 'reveal-words' },
    text.split(' ').map((word, index) => (
      <span className="reveal-words__mask" key={`${word}-${index}`}>
        <motion.span
          className="reveal-words__word"
          initial={{ y: '112%' }}
          {...(immediate
            ? { animate: { y: '0%' } }
            : { whileInView: { y: '0%' }, viewport: { once: true, amount } })}
          transition={{ duration, delay: delay + index * stagger, ease: REVEAL_EASE }}
        >
          {word}
        </motion.span>
      </span>
    )),
  )
}

type RevealGroupProps = {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  amount?: number
}

/** Контейнер карточек: дети появляются каскадом */
export function RevealGroup({
  children,
  className,
  stagger = 0.12,
  delay = 0,
  amount = 0.25,
}: RevealGroupProps) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: REVEAL_EASE } },
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}
