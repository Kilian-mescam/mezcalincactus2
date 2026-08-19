// Données biographiques et visuelles, faciles à modifier sans toucher au layout.
import bandPhoto1 from '../assets/band-1.webp'
import bandPhoto2 from '../assets/band-2.webp'
import bandPhoto3 from '../assets/band-3.webp'
import type { BandBio } from '../types/entities'

export const bandBio: BandBio = {
  photos: [bandPhoto1, bandPhoto2, bandPhoto3],
  columns: [
    [
      'Mezcal in Cactus voit le jour en 2021 à Lyon (France), lorsque les musiciens rentrent de longs mois de voyage.',
      'Après 2 ans passés à jammer, composer et perfectionner leur style, Neblina, leur premier album, voit le jour. Fruit de cette longue maturation, l’album aux sonorités psychédéliques et aux multiples inspirations sort en 2023.',
    ],
    [
      'Bien décidé à aller plus loin dans le recherche de sonorités toujours plus abouties, le groupe n’en reste pas là et se remet à composer très rapidement un deuxième album — Agave & Peyotl — enregistré en septembre 2025 à Lyon, et prévu pour octobre 2026.',
      'Sur scène comme en studio, le groupe navigue sans frontières entre rock, krautrock, pop, stoner, jazz et rock progressif — une palette large, toujours unifiée par une esthétique et un son résolument psychédélique.',
    ],
  ],
}
