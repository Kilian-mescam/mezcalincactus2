import AboutSection from '../components/Sections/AboutSection'
import AlbumSection from '../components/Sections/AlbumSection'
import ContactSection from '../components/Sections/ContactSection'
import HeroSection from '../components/Sections/HeroSection'
import MerchSection from '../components/Sections/MerchSection'
import SiteFooter from '../components/SiteFooter'
import SiteHeader from '../components/SiteHeader'
import TourSection from '../components/Sections/TourSection'
import VideoSection from '../components/Sections/VideoSection'
import pageBackground from '../assets/Frame.jpg'

function HomePage() {
  return (
    <div
      style={{
        backgroundImage: `url(${pageBackground})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <SiteHeader />

      <main>
        <HeroSection />
        <AlbumSection />
        <MerchSection />
        <VideoSection />
        <AboutSection />
        <TourSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  )
}

export default HomePage
