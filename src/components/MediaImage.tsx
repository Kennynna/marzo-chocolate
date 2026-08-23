type MediaImageProps = {
  src: string
  alt: string
  className?: string
  /** Высокий приоритет сети (первые фото после Hero). */
  priority?: boolean
}

export function MediaImage({ src, alt, className, priority }: MediaImageProps) {
  return (
    <img
      className={className ?? 'media-image'}
      src={encodeURI(src)}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  )
}
