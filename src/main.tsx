import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/editorial.css'
import './index.css'
import App from './App.tsx'
import { finishBoot, setBootProgress } from './lib/bootLoader'
import { preloadCriticalImages } from './lib/preloadSiteImages'
import { enqueueFramePreload, heroFrames } from './lib/scrollFrames'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Лоадер ждёт только Welcome и первый кадр. Остальной видеоряд качается, пока читают первый экран. */
const criticalReady = preloadCriticalImages((loaded, total) => {
  setBootProgress(8 + (loaded / total) * 88)
})

void criticalReady.then(() => {
  requestAnimationFrame(finishBoot)
  if (!reducedMotion) void enqueueFramePreload(heroFrames)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
