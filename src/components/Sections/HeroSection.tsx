import logoImage from '../../assets/logo.png'
import heroBackground from '../../assets/band-3.webp'
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
        <div
          className="logo-trip relative mt-[28rem] w-[min(100%,1000px)]"
          style={{ '--logo-url': `url(${logoImage})` } as React.CSSProperties}
        >
          <img
            className="logo-trip__img relative block w-full [filter:drop-shadow(0_12px_30px_rgba(0,0,0,0.5))]"
            src={logoImage}
            alt={bandConfig.name}
          />
          <span className="logo-trip__ghost logo-trip__ghost--a" aria-hidden="true" />
          <span className="logo-trip__ghost logo-trip__ghost--b" aria-hidden="true" />
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="font-display text-[2.25rem] font-black uppercase tracking-[0.05em] text-white">Agave &amp; Peyotl</p>
          <p className="font-display text-[1.1rem] font-black uppercase tracking-[0.25em] text-white">Out now</p>
        </div>

        <a
          className="font-display mt-5 inline-flex w-fit items-center justify-center bg-accent px-[1.8rem] py-[0.95rem] text-[0.95rem] font-black uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:bg-accent-2 hover:text-bg"
          href={bandConfig.linktreeUrl}
          target="_blank"
          rel="noreferrer"
        >
          Listen
        </a>
      </div>
    </section>
  )
}

export default HeroSection
