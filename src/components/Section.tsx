// Composant générique pour garder un layout cohérent entre les sections du site.
function Section({ id, eyebrow, title, description, children }) {
  return (
    <section className="py-20" id={id}>
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
        <div className="mb-8 flex flex-col gap-2">
          {eyebrow ? (
            <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/[0.04] px-[0.9rem] py-[0.45rem] text-[0.68rem] uppercase tracking-[0.18em] text-accent-3">
              {eyebrow}
            </span>
          ) : null}
          <h2 className="text-[clamp(2rem,4vw,3.5rem)]">{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  )
}

export default Section
