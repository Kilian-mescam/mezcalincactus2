// Données de l'album, éditables à la main sans toucher au layout.
import type { Album } from '../types/entities'

export const album: Album = {
  title: 'Agave & Peyotl',
  sides: [
    {
      label: 'Face A – Agave',
      tracks: [
        'Agave & Peyotl',
        'La fièvre',
        'Vague de chaleur',
        'Sur mon océan',
      ],
    },
    {
      label: 'Face B – Peyotl',
      tracks: [
        'Les algues vertes',
        'La marche de l’éléphant',
        'L’Éveil du peyotl',
      ],
    },
  ],
}
