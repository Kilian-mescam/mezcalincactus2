import Section from '../Section'
import { bandConfig } from '../../data/config'

function MerchSection() {
  return (
    <Section
      id="merch"
      title="Merch"
      description="Un petit morceau de la nuit à porter avec soi."
      background="#242424"
    >
      <div className="border border-white/15 bg-panel/84 p-8 text-center shadow-soft">
        {bandConfig.shopUrl ? (
          <>
            <p>Le merch et les formats audio arrivent directement depuis la boutique.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                className="inline-flex items-center justify-center bg-gradient-to-br from-accent to-accent-2 px-[1.4rem] py-[0.9rem] font-extrabold text-[#190d1f] shadow-[0_15px_32px_rgba(255,95,210,0.4)] transition-transform duration-200 hover:-translate-y-px"
                href={bandConfig.shopUrl}
                target="_blank"
                rel="noreferrer"
              >
                Accéder à la boutique
              </a>
            </div>
          </>
        ) : (
          <>
            <p>Boutique bientôt disponible.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-[1.4rem] py-[0.9rem] text-text transition-transform duration-200 hover:-translate-y-px"
                disabled
              >
                Boutique bientôt disponible
              </button>
            </div>
          </>
        )}
      </div>
    </Section>
  )
}

export default MerchSection
