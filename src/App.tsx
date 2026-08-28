import { Header } from './components/Header'
import { WelcomeSection } from './components/WelcomeSection'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { AboutSection } from './components/AboutSection'
import { ProductShowcase } from './components/ProductShowcase'
import { GiftsScrollSection } from './components/GiftsScrollSection'
import { GiftSetsSection } from './components/GiftSetsSection'
import { PrivateLabelSection } from './components/PrivateLabelSection'
import { DistributorsSection } from './components/DistributorsSection'
import { VideoBanner } from './components/VideoBanner'
import { ContactFooter } from './components/ContactFooter'
import { ContactModalProvider } from './components/ContactModalProvider'
import { LanguageProvider } from './components/LanguageProvider'
import { useSmoothScroll } from './lib/useSmoothScroll'

function App() {
  useSmoothScroll()

  return (
    <LanguageProvider>
      <ContactModalProvider>
        <Header />
        <main>
          <WelcomeSection />
          <Hero />
          <Marquee source="brand" variant="gold" />
          <AboutSection />
          <Marquee source="collection" variant="light" />
          <ProductShowcase />
          <GiftSetsSection />
          <PrivateLabelSection />
          <DistributorsSection />
          <Marquee source="brand" variant="dark" />
          <VideoBanner />
          <GiftsScrollSection />
        </main>
        <ContactFooter />
      </ContactModalProvider>
    </LanguageProvider>
  )
}

export default App
