import AboutSection from '../components/Sections/AboutSection'
import ContactSection from '../components/Sections/ContactSection'
import HeroSection from '../components/Sections/HeroSection'
import MerchSection from '../components/Sections/MerchSection'
import SiteFooter from '../components/SiteFooter'
import SiteHeader from '../components/SiteHeader'
import TourSection from '../components/Sections/TourSection'
import VideoSection from '../components/Sections/VideoSection'

function HomePage() {
  return (
    <div>
      <SiteHeader />

      <main>
        <HeroSection />
        <TourSection />
        <MerchSection />
        <VideoSection />
        <AboutSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  )
}

export default HomePage
