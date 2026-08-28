import { createContext, useContext } from 'react'

export type ContactModalApi = {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const ContactModalContext = createContext<ContactModalApi | null>(null)

export function useContactModal() {
  const api = useContext(ContactModalContext)
  if (!api) throw new Error('useContactModal должен вызываться внутри ContactModalProvider')
  return api
}
