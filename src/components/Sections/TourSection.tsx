import { useEffect, useMemo, useState } from 'react'
import ConcertCard from '../ConcertCard'
import tourBackground from '../../assets/background-3.jpg'
import { supabase } from '../../lib/supabase'

function TourSection() {
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
    <section
      className="py-24"
      id="tour"
      style={{
        backgroundImage: `linear-gradient(160deg, rgba(10, 8, 18, 0.55), rgba(10, 8, 18, 0.85)), url(${tourBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-auto grid w-[min(1180px,calc(100%-2rem))] grid-cols-1 items-start gap-12 md:grid-cols-[1fr_1.4fr]">
        <div>
          <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/[0.04] px-[0.9rem] py-[0.45rem] text-[0.68rem] uppercase tracking-[0.18em] text-accent-3">
            Tour
          </span>
          <h2 className="mt-4 text-[clamp(2.5rem,5vw,4rem)] leading-[0.95]">
            Dates de
            <br />
            concert
          </h2>
          <p className="mt-4 max-w-[28rem]">
            Les prochaines dates sont lues directement depuis Supabase et peuvent être
            modifiées sans redéploiement.
          </p>
        </div>

        <div>
          {loading ? (
            <div className="rounded-panel border border-white/15 bg-panel/80 p-[1.4rem] text-text-soft">
              Chargement des dates…
            </div>
          ) : error ? (
            <div className="rounded-panel border border-white/15 bg-panel/80 p-[1.4rem] text-text-soft">{error}</div>
          ) : upcomingConcerts.length === 0 && pastConcerts.length === 0 ? (
            <div className="rounded-panel border border-white/15 bg-panel/80 p-[1.4rem] text-text-soft">
              Aucune date publiée pour le moment.
            </div>
          ) : (
            <>
              {upcomingConcerts.length > 0 ? (
                <div className="grid">
                  {upcomingConcerts.map((concert) => (
                    <ConcertCard key={concert.id} concert={concert} />
                  ))}
                </div>
              ) : null}

              {pastConcerts.length > 0 ? (
                <>
                  <h3 className="mt-10 mb-2 text-base uppercase tracking-[0.16em] text-accent-2">Anciens shows</h3>
                  <div className="grid">
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
  )
}

export default TourSection
