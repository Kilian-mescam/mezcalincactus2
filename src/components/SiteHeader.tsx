import logoImage from '../assets/logo.png'

const navLinkClasses =
  'inline-block text-[1rem] uppercase tracking-[0.12em] text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:text-accent-3 focus-visible:text-accent-3'

function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-[2px]">
      <div className="mx-auto flex min-h-[72px] w-full px-10 flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-h-[52px] items-center justify-center ">
          <a href="#algues" aria-label="Retour à l'accueil">
            <img
              src={logoImage}
              alt="Mezcal in Cactus"
              className="block h-auto max-h-11 object-contain [filter:drop-shadow(0_0_18px_rgba(255,255,255,0.18))]"
            />
          </a>
        </div>
        <nav
          className="flex flex-wrap items-center justify-start gap-x-4 gap-y-[0.7rem] font-bold md:justify-end"
          aria-label="Navigation principale"
        >
          <a className={navLinkClasses} href="#tour">Tour</a>
          <a className={navLinkClasses} href="#merch">Merch</a>
          <a className={navLinkClasses} href="#videos">Vidéos</a>
          <a className={navLinkClasses} href="#about">About</a>
          <a className={navLinkClasses} href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
