import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSite } from '../lib/language'
import { setSmoothScrollPaused } from '../lib/useSmoothScroll'
import { buildOrnamentPath } from './ornamentPath'
import './ContactModal.css'

/** Длительность закрывающей анимации, синхронизирована с ContactModal.css */
const EXIT_MS = 260

const ORNAMENT = buildOrnamentPath(1)

const FOCUSABLE = 'a[href], button:not([disabled])'

type ContactModalProps = {
  open: boolean
  onClose: () => void
}

function CornerOrnament({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      className={`contact-modal__ornament contact-modal__ornament--${side}`}
      viewBox={`0 0 ${ORNAMENT.width} ${ORNAMENT.height}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d={ORNAMENT.d} strokeWidth={3.2} />
    </svg>
  )
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const [mounted, setMounted] = useState(open)
  const { contacts, ui } = useSite()

  // Портал живёт до конца закрывающей анимации, поэтому размонтирование отложено
  if (open && !mounted) setMounted(true)

  useEffect(() => {
    if (open) return

    const timer = window.setTimeout(() => setMounted(false), EXIT_MS)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return

    const previous = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()

    // Lenis глушим, чтобы он не догонял позицию; класс на <html> держит нативный скролл
    setSmoothScrollPaused(true)
    document.documentElement.classList.add('is-modal-open')

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const dialog = dialogRef.current
      if (!dialog) return

      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      setSmoothScrollPaused(false)
      document.documentElement.classList.remove('is-modal-open')
      previous?.focus()
    }
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <div
      className={`contact-modal${open ? '' : ' contact-modal--closing'}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="contact-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
      >
        <button
          type="button"
          className="contact-modal__close"
          onClick={onClose}
          aria-label={ui.closeModal}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M5 5 19 19M19 5 5 19" />
          </svg>
        </button>

        <h2 className="contact-modal__title" id={titleId}>
          {contacts.title}
        </h2>
        <p className="contact-modal__lead">{contacts.lead}</p>

        <div className="contact-modal__actions">
          <a
            className="contact-modal__action contact-modal__action--primary"
            href={`tel:${contacts.phone.replace(/[^+\d]/g, '')}`}
          >
            {contacts.phone}
          </a>
          <a className="contact-modal__action" href={`mailto:${contacts.email}`}>
            {contacts.email}
          </a>
        </div>

        <div className="contact-modal__hours">
          <p className="contact-modal__hours-label">{contacts.hoursLabel}</p>
          <p className="contact-modal__hours-value">{contacts.hours}</p>
        </div>

        <CornerOrnament side="left" />
        <CornerOrnament side="right" />
      </div>
    </div>,
    document.body,
  )
}
