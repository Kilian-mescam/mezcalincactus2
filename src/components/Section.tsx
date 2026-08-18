// Composant générique pour garder un layout cohérent entre les sections du site.
function Section({ id, title, description, background, children }) {
  const isColor = background?.startsWith('#')

  const backgroundStyle = isColor
    ? { backgroundColor: background }
    : background
      ? {
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : undefined

  return (
    <section
      className="flex min-h-screen flex-col justify-center py-20"
      id={id}
      style={backgroundStyle}
    >
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-[clamp(2rem,4vw,3.5rem)]">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}

export default Section
