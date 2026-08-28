import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useSite } from '../lib/language'
import './VideoBanner.css'

export function VideoBanner() {
  const ref = useRef<HTMLElement>(null)
  const { brand, media, ui } = useSite()

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const video = ref.current?.querySelector('video')
      if (!video || reduced) return

      gsap.from(video, {
        scale: 1.08,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          once: true,
        },
      })
    },
    { scope: ref },
  )

  return (
    <section className="video-banner" ref={ref} aria-label={ui.aria.video}>
      <video
        className="video-banner__video"
        src={media.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="video-banner__caption">
        <p>{brand.name}</p>
        <span>{ui.videoCaption}</span>
      </div>
    </section>
  )
}
