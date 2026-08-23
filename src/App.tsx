import { Header } from './components/Header'
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
import { marquee } from './content/marquee'
import { useSmoothScroll } from './lib/useSmoothScroll'

function App() {
  useSmoothScroll()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee items={marquee.brand} variant="gold" />
        <AboutSection />
        <Marquee items={marquee.collection} variant="light" />
        <ProductShowcase />
        <GiftSetsSection />
        <PrivateLabelSection />
        <DistributorsSection />
        <Marquee items={marquee.brand} variant="dark" />
        <VideoBanner />
        <GiftsScrollSection />
      </main>
      <ContactFooter />
    </>
  )
}

export default App
