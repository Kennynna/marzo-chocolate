import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/editorial.css'
import './index.css'
import App from './App.tsx'
import { finishBoot, setBootProgress } from './lib/bootLoader'
import { preloadSiteImages } from './lib/preloadSiteImages'
import { enqueueFramePreload, giftsScrollFrames, heroFrames } from './lib/scrollFrames'

/** Фото лендинга, затем оба видеоряда — лоадер не отпускает, пока анимация не готова. */
void (async () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  await preloadSiteImages((loaded, total) => {
    setBootProgress(8 + (loaded / total) * (reduced ? 88 : 16))
  })

  if (!reduced) {
    const frameTotal = heroFrames.count + giftsScrollFrames.count
    let heroLoaded = 0
    let giftsLoaded = 0

    const pushFrameProgress = () => {
      setBootProgress(24 + ((heroLoaded + giftsLoaded) / frameTotal) * 72)
    }

    await Promise.all([
      enqueueFramePreload(heroFrames, (loaded) => {
        heroLoaded = loaded
        pushFrameProgress()
      }),
      enqueueFramePreload(giftsScrollFrames, (loaded) => {
        giftsLoaded = loaded
        pushFrameProgress()
      }),
    ])
  }

  requestAnimationFrame(finishBoot)
})()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
