// Ligne réutilisable pour afficher un concert dans la liste publique.
function ConcertCard({ concert }) {
  const concertDate = new Date(concert.date)
  const dateLabel = concertDate
    .toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' })
    .replace('.', '')
  const timeLabel = concertDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <article className="concert-row">
      <span className="concert-row-date">
        {dateLabel} - {timeLabel}
      </span>

      <div className="concert-row-info">
        <h3>{concert.salle}</h3>
        <p>{concert.ville}</p>
      </div>

      {concert.complet ? (
        <span className="badge full">Complet</span>
      ) : concert.url_billetterie ? (
        <a className="card-btn" href={concert.url_billetterie} target="_blank" rel="noreferrer">
          Tickets
        </a>
      ) : null}
    </article>
  )
}

export default ConcertCard
