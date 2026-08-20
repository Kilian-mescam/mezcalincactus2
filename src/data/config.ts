// Configuration statique du groupe, éditable à la main depuis le code.
import type { BandConfig } from '../types/entities'

export const bandConfig: BandConfig = {
  name: 'Mezcal in Cactus',
  // Pseudo paypal.me (partie après paypal.me/).
  paypalUsername: 'MezcalinCactus',
  linktreeUrl: 'https://linktr.ee/mezcalincactus',
  socialLinks: [
    { label: 'Instagram', url: 'https://instagram.com/mezcalincactus' },
    { label: 'YouTube', url: 'https://youtube.com/@mezcalincactus' },
    { label: 'Spotify', url: 'https://open.spotify.com/artist/mezcalincactus' },
    { label: 'Bandcamp', url: 'https://mezcalincactus.bandcamp.com' },
  ],
}
