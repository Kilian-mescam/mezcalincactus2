import logoImage from '../../assets/logo.png'
import heroBackground from '../../assets/band-3.jpg'
import { bandConfig } from '../../data/config'

function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      id="algues"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 25%',
      }}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <img
          className="mt-[28rem] w-[min(100%,1000px)] [filter:drop-shadow(0_12px_30px_rgba(0,0,0,0.5))]"
          src={logoImage}
          alt={bandConfig.name}
        />
      </div>
    </section>
  )
}

export default HeroSection
