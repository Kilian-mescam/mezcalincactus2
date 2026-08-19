import Section from '../Section'
import { videoItems } from '../../data/gallery'
import videoBackground from '../../assets/background-2.webp'

function VideoSection() {
  return (
    <Section
      id="videos"
      title="Live Session"
      description="Le live, les textures, les corps dansants et la nuit qui tremble."
      background={videoBackground}
    >
      <div className="mt-6 flex justify-center">
        {videoItems.map((video) => (
          <div
            className="relative aspect-video w-full max-w-full overflow-hidden border border-white/15 bg-panel/80"
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
      
    </Section>
  )
}

export default VideoSection
