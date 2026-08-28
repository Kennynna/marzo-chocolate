import { useEffect, useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useSite } from '../lib/language'
import './VideoBanner.css'

export function VideoBanner() {
  const ref = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { brand, media, ui } = useSite()

  useEffect(() => {
    const section = ref.current
    const video = videoRef.current
    if (!section || !video) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          video.pause()
          return
        }

        if (video.src !== new URL(media.video, window.location.href).href) {
          video.src = media.video
        }

        if (!reduced) {
          void video.play().catch(() => undefined)
        }
      },
      { rootMargin: '240px 0px' },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [media.video])

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const video = videoRef.current
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
        ref={videoRef}
        className="video-banner__video"
        muted
        loop
        playsInline
        preload="none"
      />
      <div className="video-banner__caption">
        <p>{brand.name}</p>
        <span>{ui.videoCaption}</span>
      </div>
    </section>
  )
}
