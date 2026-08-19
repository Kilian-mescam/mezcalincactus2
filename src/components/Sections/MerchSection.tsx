import { useState } from 'react'
import Section from '../Section'
import OrderModal from '../OrderModal'
import albumCover from '../../assets/album.webp'
import { album } from '../../data/album'
import { merchItems } from '../../data/merch'
import { bandConfig } from '../../data/config'

const gridItems = merchItems.filter((item) => item.id !== 'vinyle')

const listenLinks = bandConfig.socialLinks.filter((link) => ['Spotify', 'Bandcamp'].includes(link.label))

function MerchSection() {
  const [orderState, setOrderState] = useState<string | null | undefined>(undefined)

  function openOrder(itemId: string | null = null) {
    setOrderState(itemId)
  }

  function closeOrder() {
    setOrderState(undefined)
  }

  return (
    <Section
      id="merch"
      title="Merch"
      background="#242424"
    >
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-center">
          <div className="group relative w-full max-w-[280px] flex-shrink-0 self-center md:self-start">
            <div
              className="absolute inset-0 z-0 translate-x-[6%] rounded-full shadow-[0_0_40px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out group-hover:translate-x-[48%] group-hover:rotate-45"
              style={{
                backgroundColor: '#000',
                backgroundImage:
                  'repeating-radial-gradient(circle at center, #1a1a1a 0px, #1a1a1a 4px, #2b2b2b 4px, #2b2b2b 8px)',
              }}
            >
              <div className="absolute left-1/2 top-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent to-accent-2" />
              <div className="absolute left-1/2 top-1/2 h-[6%] w-[6%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg" />
            </div>
            <img
              className="relative z-10 aspect-square w-full object-cover shadow-soft"
              src={albumCover}
              alt={`Pochette de l'album ${album.title}`}
            />
          </div>

          <div className="flex-1">
            <h3 className="text-[1.4rem]">{album.title}</h3>
            <p className="mt-2">Un voyage en deux faces, du feu de l'agave à l'éveil du peyotl.</p>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {album.sides.map((side, index) => {
                const trackOffset = album.sides
                  .slice(0, index)
                  .reduce((sum, s) => sum + s.tracks.length, 0)

                return (
                  <div
                    key={side.label}
                    className={index > 0 ? 'sm:border-l sm:border-white/15 sm:pl-6' : ''}
                  >
                    <h4 className="font-display text-[0.8rem] font-bold uppercase tracking-[0.1em] text-text-soft">
                      {side.label}
                    </h4>
                    <ol className="mt-2 space-y-1">
                      {side.tracks.map((track, trackIndex) => (
                        <li key={track} className="font-body text-[0.9rem]">
                          <span className="mr-2 text-text-soft/70">
                            {String(trackOffset + trackIndex + 1).padStart(2, '0')}
                          </span>
                          {track}
                        </li>
                      ))}
                    </ol>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <button
                type="button"
                className="font-body inline-flex items-center justify-center bg-white px-[1.4rem] py-[0.9rem] font-extrabold uppercase tracking-[0.06em] text-black transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent-3 hover:text-white"
                onClick={() => openOrder('vinyle')}
              >
                Commander le vinyle
              </button>

              {listenLinks.map((link) => (
                <a
                  key={link.label}
                  className="text-[0.85rem] font-bold uppercase tracking-[0.1em] text-text-soft transition-colors duration-200 hover:text-accent-3"
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12">
          <h3 className="font-display text-[0.85rem] font-bold uppercase tracking-[0.15em] text-text-soft">
            La boutique
          </h3>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {gridItems.map((item) => (
              <div className="flex flex-col border border-white/10 p-5 transition-colors hover:border-white/25" key={item.id}>
                <img
                  className="aspect-square w-full object-cover"
                  src={item.image}
                  alt={item.name}
                />
                <div className="mt-5 flex flex-1 flex-col">
                  <h4 className="text-[0.95rem] font-bold uppercase tracking-[0.08em]">{item.name}</h4>
                  <p className="mt-1">{item.prix}€</p>
                  <button
                    type="button"
                    className="font-body mt-5 inline-flex items-center justify-center self-stretch border border-white/20 px-4 py-[0.7rem] text-[0.75rem] font-bold uppercase tracking-[0.08em] text-text-soft transition-colors hover:border-white hover:text-white"
                    onClick={() => openOrder(item.id)}
                  >
                    Commander
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {orderState !== undefined ? (
        <OrderModal onClose={closeOrder} initialItemId={orderState ?? undefined} />
      ) : null}
    </Section>
  )
}

export default MerchSection
