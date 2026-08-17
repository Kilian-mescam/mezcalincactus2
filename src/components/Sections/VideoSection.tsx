import Section from '../Section'
import { videoItems } from '../../data/gallery'
import backstagePhoto from '../../assets/band-2.jpg'

function VideoSection() {
  return (
    <Section
      id="videos"
      eyebrow="Vidéos"
      title="Images et captures"
      description="Le live, les textures, les corps dansants et la nuit qui tremble."
    >
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {videoItems.map((video) => (
          <div
            className="relative aspect-video overflow-hidden rounded-panel border border-white/15 bg-panel/80"
            key={video.id}
          >
            <iframe
              className="h-full w-full border-0"
              src={`https://www.youtube.com/embed/${video.id}?rel=0`}
              title={video.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ))}
      </div>
      <figure className="mx-auto mt-8 w-[min(100%,460px)]">
        <img
          className="aspect-[3/4] w-full rounded-panel border border-white/15 object-cover object-top shadow-soft"
          src={backstagePhoto}
          alt="Le groupe sur les toits de Lyon"
        />
        <figcaption className="mt-3 text-center text-[0.85rem] italic text-text-soft">
          Entre deux balances, sur les toits de Lyon.
        </figcaption>
      </figure>
    </Section>
  )
}

export default VideoSection
