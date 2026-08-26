import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/editorial.css'
import './index.css'
import App from './App.tsx'
import { preloadSiteImages } from './lib/preloadSiteImages'
import { finishBoot, setBootProgress } from './lib/bootLoader'

// Контентные фото — до кадров Hero, иначе сеть занята сотнями webp.
// Их прогресс и есть реальная шкала для бут-лоадера.
void preloadSiteImages((loaded, total) => {
  setBootProgress(14 + (loaded / total) * 82)
}).then(() => {
  requestAnimationFrame(finishBoot)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
