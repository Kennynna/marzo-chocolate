import { useEffect, useState } from 'react'

type MediaImageProps = {
  src: string
  alt: string
  className?: string
  fallback?: string
}

export function MediaImage({ src, alt, className, fallback }: MediaImageProps) {
  const [current, setCurrent] = useState(fallback ?? src)

  useEffect(() => {
    let cancelled = false
    const probe = new Image()
    probe.onload = () => {
      if (!cancelled && probe.naturalWidth > 0) setCurrent(src)
    }
    probe.src = encodeURI(src)
    return () => {
      cancelled = true
    }
  }, [src, fallback])

  return (
    <img className={className ?? 'media-image'} src={encodeURI(current)} alt={alt} loading="lazy" />
  )
}
