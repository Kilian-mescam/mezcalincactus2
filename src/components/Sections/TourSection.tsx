import { useEffect, useMemo, useState } from 'react'
import ConcertCard from '../ConcertCard'
import tourBackground from '../../assets/background-1.jpg'
import { supabase } from '../../lib/supabase'
import type { Concert } from '../../types/entities'

function TourSection() {
  const [concerts, setConcerts] = useState<Concert[]>([])
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
    () => [...concerts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [concerts],
  )

  const upcomingConcerts = sortedConcerts
    .filter((concert) => new Date(concert.date) >= new Date())
    .slice(0, 6)

  return (
    <section
      className="flex min-h-screen flex-col justify-center py-24"
      id="tour"
      style={{
        backgroundImage: `linear-gradient(160deg, rgba(10, 8, 18, 0.55), rgba(10, 8, 18, 0.85)), url(${tourBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-auto grid w-[min(1180px,calc(100%-2rem))] grid-cols-1 items-start gap-12 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-bold uppercase leading-[0.95]">
            Upcoming
            <br />
            Tour
            <br />
            Dates
          </h2>
        </div>

        <div>
          {loading ? (
            <div className="border border-white/15 bg-panel/80 p-[1.4rem] text-text-soft">
              Chargement des dates…
            </div>
          ) : error ? (
            <div className="border border-white/15 bg-panel/80 p-[1.4rem] text-text-soft">{error}</div>
          ) : upcomingConcerts.length === 0 ? (
            <div className="border border-white/15 bg-panel/80 p-[1.4rem] text-text-soft">
              Aucune date publiée pour le moment.
            </div>
          ) : (
            <div className="grid">
              {upcomingConcerts.map((concert) => (
                <ConcertCard key={concert.id} concert={concert} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default TourSection
