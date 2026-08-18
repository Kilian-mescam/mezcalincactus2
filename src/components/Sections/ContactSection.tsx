import Section from '../Section'
import { bandConfig } from '../../data/config'
import contactBackground from '../../assets/Frame.jpg'

function ContactSection() {
  return (
    <Section
      id="contact"
      title="Contact"
      description="Pour les bookings, les dates, les collaborations et les soirées."
      background={contactBackground}
    >
      <div className="border border-white/15 bg-panel/84 p-8 text-center shadow-soft">
        <p>booking@mezcalincactus.com</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            className="inline-flex items-center justify-center bg-gradient-to-br from-accent to-accent-2 px-[1.4rem] py-[0.9rem] font-extrabold text-[#190d1f] shadow-[0_15px_32px_rgba(255,95,210,0.4)] transition-transform duration-200 hover:-translate-y-px"
            href="mailto:booking@mezcalincactus.com"
          >
            Écrire au groupe
          </a>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-[0.8rem]">
          {bandConfig.socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-[0.8rem] uppercase tracking-[0.09em] text-text-soft"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </Section>
  )
}

export default ContactSection
