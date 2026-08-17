// Composant générique pour garder un layout cohérent entre les sections du site.
function Section({ id, eyebrow, title, description, children }) {
  return (
    <section className="section" id={id}>
      <div className="container">
        <div className="section-header">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  )
}

export default Section
