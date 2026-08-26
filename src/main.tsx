import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/editorial.css'
import './index.css'
import App from './App.tsx'
import { finishBoot, setBootProgress } from './lib/bootLoader'
import { preloadSiteImages } from './lib/preloadSiteImages'
import { enqueueFramePreload, giftsScrollFrames, heroFrames } from './lib/scrollFrames'

/** Лоадер ждёт фото и первый видеоряд. Второй качается в фоне, пока пользователь скроллит. */
void (async () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  await preloadSiteImages((loaded, total) => {
    setBootProgress(8 + (loaded / total) * (reduced ? 88 : 16))
  })

  if (!reduced) {
    await enqueueFramePreload(heroFrames, (loaded, total) => {
      setBootProgress(24 + (loaded / total) * 72)
    })
    void enqueueFramePreload(giftsScrollFrames)
  }

  requestAnimationFrame(finishBoot)
})()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
