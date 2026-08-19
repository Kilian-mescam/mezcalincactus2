import type { Concert } from '../types/entities'

// Ligne réutilisable pour afficher un concert dans la liste publique.
function ConcertCard({ concert }: { concert: Concert }) {
  const concertDate = new Date(concert.date)
  const dateLabel = concertDate
    .toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' })
    .replace('.', '')
  const timeLabel = concertDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const pairBands = [concert.pair_band_1, concert.pair_band_2, concert.pair_band_3].filter(Boolean)

  return (
    <article className="flex flex-wrap items-center justify-between gap-6 border-b border-white/15 py-[1.4rem] md:flex-nowrap">
      <div className="flex-1">
        <span className="block text-[0.8rem] uppercase tracking-[0.1em] text-text-soft">
          {dateLabel} - {timeLabel}
        </span>
        <h3 className="mt-1 text-[1.25rem] font-bold tracking-[0.04em]">{concert.salle}</h3>
        <p>{concert.ville}</p>
        {pairBands.length > 0 ? <p className="text-text-soft">avec {pairBands.join(', ')}</p> : null}
      </div>

      {concert.complet ? (
        <span className="inline-flex items-center bg-accent/12 px-[0.7rem] py-[0.34rem] text-[0.68rem] font-bold uppercase tracking-[0.12em] text-accent">
          Complet
        </span>
      ) : concert.url_billetterie ? (
        <a
          className="inline-flex w-fit items-center justify-center border border-white/[0.12] bg-white/5 px-[1.4rem] py-[0.9rem] text-text transition-transform duration-200 hover:-translate-y-px"
          href={concert.url_billetterie}
          target="_blank"
          rel="noreferrer"
        >
          Tickets
        </a>
      ) : null}
    </article>
  )
}

export default ConcertCard
