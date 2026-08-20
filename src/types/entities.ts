// Types partagés décrivant les entités manipulées par l'app (données statiques et tables Supabase).

export interface Concert {
  id: number
  created_at: string
  date: string
  ville: string
  salle: string
  url_billetterie: string | null
  complet: boolean
  pair_band_1: string | null
  pair_band_2: string | null
  pair_band_3: string | null
}

export interface CommandeItem {
  produitId: string
  produitNom: string
  taille: string | null
  quantite: number
  prixUnitaire: number
}

export type CommandeStatut = 'nouvelle' | 'expediee'

export interface Commande {
  id: number
  created_at: string
  items: CommandeItem[]
  nom: string
  email: string
  adresse: string
  montant: number
  statut: CommandeStatut
  paye: boolean
}

export interface MerchItem {
  id: string
  name: string
  image: string
  prix: number
  fraisPort: number
  tailles?: string[]
}

export interface AlbumSide {
  label: string
  tracks: string[]
}

export interface Album {
  title: string
  sides: AlbumSide[]
}

export interface SocialLink {
  label: string
  url: string
}

export interface BandConfig {
  name: string
  paypalUsername: string
  socialLinks: SocialLink[]
}

export interface BandBio {
  photos: string[]
  columns: string[][]
}

export interface VideoItem {
  id: string
  title: string
}
