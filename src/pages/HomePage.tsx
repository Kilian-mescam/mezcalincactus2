import { useEffect, useMemo, useState } from 'react'
import ConcertCard from '../components/ConcertCard'
import Section from '../components/Section'
import logoImage from '../assets/logo.png'
import pageBackground from '../assets/background-1.jpg'
import tourBackground from '../assets/background-3.jpg'
import { bandBio } from '../data/bio'
import { bandConfig } from '../data/config'
import { videoItems } from '../data/gallery'
import { supabase } from '../lib/supabase'

function HomePage() {
  const [concerts, setConcerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchConcerts() {
      try {
        setLoading(true)
        const { data, error: supabaseError } = await supabase
          .from('concerts')
          .select('*')
          .order('date', { ascending: true })

        if (supabaseError) {
          throw supabaseError
        }

        if (isMounted) {
          setConcerts(data ?? [])
          setError('')
        }
      } catch (fetchError) {
        console.error(fetchError)

        if (isMounted) {
          setError('Les dates de concert sont actuellement indisponibles.')
          setConcerts([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchConcerts()

    return () => {
      isMounted = false
    }
  }, [])

  const sortedConcerts = useMemo(
    () => [...concerts].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [concerts],
  )

  const upcomingConcerts = sortedConcerts.filter(
    (concert) => new Date(concert.date) >= new Date(),
  )
  const pastConcerts = sortedConcerts.filter(
    (concert) => new Date(concert.date) < new Date(),
  )

  return (
    <div
      className="page-shell"
      style={{
        backgroundImage: `url(${pageBackground})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand-mark">
            <img src={logoImage} alt="Mezcal in Cactus" className="brand-logo" />
          </div>
          <nav className="font-bold nav-links text-white" aria-label="Navigation principale">
            <a href="#algues">Les algues vertes</a>
            <a href="#merch">Merch</a>
            <a href="#videos">Vidéos</a>
            <a href="#about">About</a>
            <a href="#tour">Tour</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section
          className="hero"
          id="algues"
        >
          <div className="flex items-center justify-center flex-col text-center hero-copy">
              <img className="hero-logo" src={logoImage} alt={bandConfig.name} />
          </div>
        </section>

        <Section
          id="merch"
          eyebrow="Merchandising"
          title="Supporter le son"
          description="Un petit morceau de la nuit à porter avec soi."
        >
          <div className="shop-card">
            {bandConfig.shopUrl ? (
              <>
                <p>Le merch et les formats audio arrivent directement depuis la boutique.</p>
                <div className="hero-actions" style={{ justifyContent: 'center' }}>
                  <a className="primary-btn" href={bandConfig.shopUrl} target="_blank" rel="noreferrer">
                    Accéder à la boutique
                  </a>
                </div>
              </>
            ) : (
              <>
                <p>Boutique bientôt disponible.</p>
                <div className="hero-actions" style={{ justifyContent: 'center' }}>
                  <button type="button" className="secondary-btn" disabled>
                    Boutique bientôt disponible
                  </button>
                </div>
              </>
            )}
          </div>
        </Section>

        <Section
          id="videos"
          eyebrow="Vidéos"
          title="Images et captures"
          description="Le live, les textures, les corps dansants et la nuit qui tremble."
        >
          <div className="video-grid">
            {videoItems.map((video) => (
              <div className="video-frame" key={video.id}>
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="about"
          eyebrow="About"
          title="Le groupe"
          description="Une histoire de riffs, de poussière et de lumière."
        >
          <div className="bio-layout">
            <img className="bio-photo" src={bandBio.photo} alt="Le groupe en concert" />
            <div className="bio-copy">
              {bandBio.text.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph.trim()}</p>
              ))}
            </div>
          </div>
        </Section>

        <section
          className="tour-section"
          id="tour"
          style={{
            backgroundImage: `linear-gradient(160deg, rgba(10, 8, 18, 0.55), rgba(10, 8, 18, 0.85)), url(${tourBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="container tour-layout">
            <div className="tour-heading">
              <span className="eyebrow">Tour</span>
              <h2>
                Dates de
                <br />
                concert
              </h2>
              <p>
                Les prochaines dates sont lues directement depuis Supabase et peuvent être
                modifiées sans redéploiement.
              </p>
            </div>

            <div className="tour-lists">
              {loading ? (
                <div className="state-box">Chargement des dates…</div>
              ) : error ? (
                <div className="state-box">{error}</div>
              ) : upcomingConcerts.length === 0 && pastConcerts.length === 0 ? (
                <div className="empty-box">Aucune date publiée pour le moment.</div>
              ) : (
                <>
                  {upcomingConcerts.length > 0 ? (
                    <div className="tour-list">
                      {upcomingConcerts.map((concert) => (
                        <ConcertCard key={concert.id} concert={concert} />
                      ))}
                    </div>
                  ) : null}

                  {pastConcerts.length > 0 ? (
                    <>
                      <h3 className="tour-list-subtitle">Anciens shows</h3>
                      <div className="tour-list">
                        {[...pastConcerts].reverse().map((concert) => (
                          <ConcertCard key={concert.id} concert={concert} />
                        ))}
                      </div>
                    </>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </section>

        <Section
          id="contact"
          eyebrow="Contact"
          title="Réserver / parler au groupe"
          description="Pour les bookings, les dates, les collaborations et les soirées."
        >
          <div className="shop-card">
            <p>booking@mezcalincactus.com</p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <a className="primary-btn" href="mailto:booking@mezcalincactus.com">
                Écrire au groupe
              </a>
            </div>
            <div className="social-list" style={{ justifyContent: 'center', marginTop: '1.25rem' }}>
              {bandConfig.socialLinks.map((link) => (
                <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </Section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="brand-mark">
            <img src={logoImage} alt="Mezcal in Cactus" className="brand-logo brand-logo-footer" />
          </div>
          <div className="social-list">
            {bandConfig.socialLinks.map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
