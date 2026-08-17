import logoImage from '../assets/logo.png'

const navLinkClasses =
  'text-[0.8rem] uppercase tracking-[0.12em] text-black transition-colors duration-200 hover:text-accent-3 focus-visible:text-accent-3'

function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-20">
      <div className="mx-auto flex min-h-[72px] w-[min(1180px,calc(100%-2rem))] flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-h-[52px] items-center justify-center">
          <img
            src={logoImage}
            alt="Mezcal in Cactus"
            className="block h-auto max-h-11 object-contain [filter:drop-shadow(0_0_18px_rgba(255,255,255,0.18))]"
          />
        </div>
        <nav
          className="flex flex-wrap items-center justify-start gap-x-4 gap-y-[0.7rem] font-bold md:justify-end"
          aria-label="Navigation principale"
        >
          <a className={navLinkClasses} href="#album">Agave & Peyotl</a>
          <a className={navLinkClasses} href="#merch">Merch</a>
          <a className={navLinkClasses} href="#videos">Vidéos</a>
          <a className={navLinkClasses} href="#about">About</a>
          <a className={navLinkClasses} href="#tour">Tour</a>
          <a className={navLinkClasses} href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
