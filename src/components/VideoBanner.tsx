import { useRef } from 'react'
import { brand, media } from '../content/site'
import { gsap, useGSAP } from '../lib/gsap'
import './VideoBanner.css'

export function VideoBanner() {
  const ref = useRef<HTMLElement>(null)

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
    <section className="video-banner" ref={ref} aria-label="Видео о фабрике MARZO">
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
        <span>производство · Грозный · Чеченская Республика</span>
      </div>
    </section>
  )
}
