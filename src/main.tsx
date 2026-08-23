import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/editorial.css'
import './index.css'
import App from './App.tsx'
import { preloadSiteImages } from './lib/preloadSiteImages'

// Контентные фото — до кадров Hero, иначе сеть занята сотнями webp.
void preloadSiteImages()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
