import Section from '../Section'

function ContactSection() {
  return (
    <Section id="contact" title="Contact" background="#242424" compact>
      <div className="flex justify-center">
        <div className="w-full max-w-md border border-white/15 bg-white/5 p-8 text-center backdrop-blur-sm">
          
          <p className="mt-4 text-[1.25rem] font-bold text-text">mezcalincactus@gmail.com</p>
          <a
            className="font-display mt-6 inline-flex items-center justify-center bg-accent px-[1.4rem] py-[0.9rem] font-extrabold text-text transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent-3"
            href="mailto:mezcalincactus@gmail.com"
          >
            ÉCRIRE AU GROUPE
          </a>
        </div>
      </div>
    </Section>
  )
}

export default ContactSection
