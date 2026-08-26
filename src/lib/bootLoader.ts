/** Мост к бут-лоадеру из index.html: он живёт вне бандла и может отсутствовать */

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    __marzoBoot?: {
      set: (value: number) => void
      done: () => void
    }
    __marzoBooted?: boolean
  }
}

const BOOT_EVENT = 'marzo:booted'

export function setBootProgress(value: number) {
  window.__marzoBoot?.set(value)
}

export function finishBoot() {
  window.__marzoBoot?.done()
}

/** true, когда лоадер ушёл. Без лоадера в разметке — сразу true */
export function useBootReady() {
  const [ready, setReady] = useState(() => {
    if (typeof window === 'undefined') return true
    return Boolean(window.__marzoBooted) || !window.__marzoBoot
  })

  useEffect(() => {
    if (ready) return

    const onBooted = () => setReady(true)
    window.addEventListener(BOOT_EVENT, onBooted)
    return () => window.removeEventListener(BOOT_EVENT, onBooted)
  }, [ready])

  return ready
}
