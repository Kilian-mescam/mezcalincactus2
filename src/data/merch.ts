import albumCover from '../assets/album.jpg'
import cdImage from '../assets/merch/neblina.jpg'
import tshirtBlancImage from '../assets/merch/tshirt-white.jpg'
import tshirtNoirImage from '../assets/merch/tshirt-back.jpg'
import { album } from './album'
import type { MerchItem } from '../types/entities'

// Produits commandables (vinyle inclus) — items d'une même commande partagent
// un seul frais de port : le plus élevé parmi les articles choisis.
export const merchItems: MerchItem[] = [
  { id: 'vinyle', name: `Vinyle – ${album.title}`, image: albumCover, prix: 20, fraisPort: 10 },
  { id: 'cd', name: 'CD – Neblina', image: cdImage, prix: 10, fraisPort: 5 },
  { id: 'tshirt-blanc', name: 'T-shirt blanc', image: tshirtBlancImage, prix: 15, fraisPort: 5, tailles: ['S', 'M', 'L', 'XL'] },
  { id: 'tshirt-noir', name: 'T-shirt noir', image: tshirtNoirImage, prix: 15, fraisPort: 5, tailles: ['S', 'M', 'L', 'XL'] },
]
