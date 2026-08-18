// Ligne réutilisable pour afficher un concert dans la liste publique.
function ConcertCard({ concert }) {
  const concertDate = new Date(concert.date)
  const dateLabel = concertDate
    .toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' })
    .replace('.', '')
  const timeLabel = concertDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <article className="flex flex-wrap items-center justify-between gap-6 border-b border-white/15 py-[1.4rem] md:flex-nowrap">
      <span className="min-w-[9rem] text-[0.8rem] uppercase tracking-[0.1em] text-text-soft">
        {dateLabel} - {timeLabel}
      </span>

      <div className="flex-1">
        <h3 className="text-[1.25rem] tracking-[0.04em]">{concert.salle}</h3>
        <p>{concert.ville}</p>
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
