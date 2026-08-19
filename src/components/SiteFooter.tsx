import { Link } from 'react-router-dom'
import logoImage from '../assets/logo.png'
import { bandConfig } from '../data/config'

function SiteFooter() {
  return (
    <footer className="border-t border-white/15 pt-8 pb-12">
      <div className="mx-auto flex w-[min(1180px,calc(100%-2rem))] flex-wrap items-center justify-between gap-4">
        <div className="flex min-h-[52px] items-center justify-center">
          <img
            src={logoImage}
            alt="Mezcal in Cactus"
            className="block h-auto max-h-[34px] object-contain [filter:drop-shadow(0_0_18px_rgba(255,255,255,0.18))]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-[0.8rem]">
          {bandConfig.socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-[0.8rem] uppercase tracking-[0.09em] text-text-soft transition-all duration-200 ease-out hover:-translate-y-0.5 hover:text-accent-3"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/mentions-legales"
            className="inline-block text-[0.8rem] uppercase tracking-[0.09em] text-text-soft transition-all duration-200 ease-out hover:-translate-y-0.5 hover:text-accent-3"
          >
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
