import Section from '../Section'
import albumCover from '../../assets/album.png'
import { album } from '../../data/album'

function AlbumSection() {
  return (
    <Section
      id="album"
      eyebrow="Album"
      title={album.title}
      description="Un voyage en deux faces, du feu de l'agave à l'éveil du peyotl."
    >
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1.05fr_1.45fr]">
        <img
          className="aspect-square w-full rounded-panel border border-white/15 object-cover shadow-soft"
          src={albumCover}
          alt={`Pochette de l'album ${album.title}`}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {album.sides.map((side, sideIndex) => {
            const trackOffset = album.sides
              .slice(0, sideIndex)
              .reduce((count, previousSide) => count + previousSide.tracks.length, 0)

            return (
              <div className="rounded-panel border border-white/15 bg-panel/84 p-6" key={side.label}>
                <h3 className="mb-4 text-[0.85rem] uppercase tracking-[0.12em] text-accent-2">{side.label}</h3>
                <ol className="grid list-none gap-3">
                  {side.tracks.map((track, trackIndex) => (
                    <li
                      className="flex items-baseline gap-3 border-b border-white/15 pb-3 last:border-b-0 last:pb-0"
                      key={track}
                    >
                      <span className="min-w-[1.4rem] font-bold text-accent-3">{trackOffset + trackIndex + 1}</span>
                      <span className="text-text">{track}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

export default AlbumSection
