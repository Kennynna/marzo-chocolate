import { ScrollTrigger } from './gsap'

let refreshFrame = 0

export function scheduleScrollRefresh() {
  if (refreshFrame) cancelAnimationFrame(refreshFrame)
  refreshFrame = requestAnimationFrame(() => {
    ScrollTrigger.refresh()
    refreshFrame = 0
  })
}
