import type { ReactNode } from 'react'

// Composant générique pour garder un layout cohérent entre les sections du site.
interface SectionProps {
  id: string
  title?: string
  background?: string
  hideTitle?: boolean
  compact?: boolean
  titleClassName?: string
  children: ReactNode
}

function Section({
  id,
  title = '',
  background,
  hideTitle = false,
  compact = false,
  titleClassName = '',
  children,
}: SectionProps) {
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
      className={`flex flex-col justify-center ${compact ? 'min-h-[40vh] py-10' : 'min-h-screen py-20'}`}
      id={id}
      style={backgroundStyle}
    >
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
        {!hideTitle && (
          <div className="mb-12 flex flex-col gap-3">
            <h2 className={`text-[clamp(2rem,4vw,3.5rem)] ${titleClassName}`}>{title}</h2>
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

export default Section
