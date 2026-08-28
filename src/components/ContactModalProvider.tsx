import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ContactModalContext, type ContactModalApi } from '../lib/contactModal'
import { ContactModal } from './ContactModal'

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const api = useMemo<ContactModalApi>(() => ({ isOpen, open, close }), [isOpen, open, close])

  return (
    <ContactModalContext value={api}>
      {children}
      <ContactModal open={isOpen} onClose={close} />
    </ContactModalContext>
  )
}
