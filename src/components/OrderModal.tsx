import { useState, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { supabase } from '../lib/supabase'
import { merchItems } from '../data/merch'
import { bandConfig } from '../data/config'
import type { CommandeItem } from '../types/entities'

function buildItemsHtml(items: CommandeItem[]): string {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:4px 0;">${item.produitNom}${item.taille ? ` (${item.taille})` : ''} × ${item.quantite}</td>
          <td style="padding:4px 0;text-align:right;white-space:nowrap;">${(item.prixUnitaire * item.quantite).toFixed(2)} €</td>
        </tr>`,
    )
    .join('')
}

async function sendOrderAlert(params: { nom: string; email: string; adresse: string; montant: number; items: CommandeItem[] }) {
  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        nom: params.nom,
        email: params.email,
        adresse: params.adresse,
        montant: params.montant.toFixed(2),
        items_html: buildItemsHtml(params.items),
      },
      { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
    )
  } catch (emailError) {
    console.error("Échec de l'envoi de l'alerte email de commande :", emailError)
  }
}

const labelClasses = 'font-body text-[0.78rem] font-bold uppercase tracking-[0.14em] text-white'
const inputClasses =
  'font-body w-full border border-white/10 bg-black/20 px-4 py-[0.7rem] text-text outline-none transition-colors focus:border-accent-3'

type Quantites = Record<string, number>
type Tailles = Record<string, string>

interface OrderModalProps {
  onClose: () => void
  initialItemId?: string
}

function buildDefaultQuantities(initialItemId?: string): Quantites {
  return Object.fromEntries(merchItems.map((item) => [item.id, item.id === initialItemId ? 1 : 0]))
}

function buildDefaultTailles(): Tailles {
  return Object.fromEntries(
    merchItems.filter((item) => item.tailles).map((item) => [item.id, item.tailles![0]]),
  )
}

function OrderModal({ onClose, initialItemId }: OrderModalProps) {
  const [quantites, setQuantites] = useState<Quantites>(() => buildDefaultQuantities(initialItemId))
  const [tailles, setTailles] = useState<Tailles>(buildDefaultTailles)
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [rue, setRue] = useState('')
  const [codePostal, setCodePostal] = useState('')
  const [ville, setVille] = useState('')
  const [infosLivraison, setInfosLivraison] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const chosenItems: CommandeItem[] = merchItems
    .filter((item) => quantites[item.id] > 0)
    .map((item) => ({
      produitId: item.id,
      produitNom: item.name,
      taille: item.tailles ? tailles[item.id] : null,
      quantite: quantites[item.id],
      prixUnitaire: item.prix,
    }))

  const sousTotal = chosenItems.reduce((sum, item) => sum + item.prixUnitaire * item.quantite, 0)
  const fraisPort = chosenItems.length
    ? Math.max(...chosenItems.map((item) => merchItems.find((m) => m.id === item.produitId)!.fraisPort))
    : 0
  const montant = sousTotal + fraisPort

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!chosenItems.length) {
      setError('Choisis au moins un article.')
      return
    }

    if (!nom.trim() || !email.trim() || !rue.trim() || !codePostal.trim() || !ville.trim()) {
      setError('Tous les champs sont obligatoires (sauf infos livreur).')
      return
    }

    const adresse = [
      rue.trim(),
      `${codePostal.trim()} ${ville.trim()}`,
      infosLivraison.trim() ? `Infos livreur : ${infosLivraison.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    setSubmitting(true)

    const { error: insertError } = await supabase.from('commandes').insert({
      items: chosenItems,
      nom: nom.trim(),
      email: email.trim(),
      adresse,
      montant,
    })

    setSubmitting(false)

    if (insertError) {
      setError(`Impossible d'enregistrer la commande : ${insertError.message}`)
      return
    }

    await sendOrderAlert({ nom: nom.trim(), email: email.trim(), adresse, montant, items: chosenItems })

    window.location.href = `https://paypal.me/${encodeURIComponent(bandConfig.paypalUsername)}/${montant}EUR`
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[680px] max-h-full overflow-y-auto bg-[#1a1a1a] p-8 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h3 className="font-body text-[1.5rem] font-bold normal-case tracking-normal text-white">Commander</h3>
          <button type="button" className="text-text-soft hover:text-accent-3" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {merchItems.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center gap-5">
                <img className="h-28 w-28 flex-shrink-0 object-cover" src={item.image} alt={item.name} />

                <div className="min-w-[140px] flex-1">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-[0.85rem] text-text-soft">
                    {item.prix}€ (+{item.fraisPort}€ de frais de port)
                  </p>
                </div>

                {item.tailles ? (
                  <div className="flex gap-2" role="group" aria-label={`Taille ${item.name}`}>
                    {item.tailles.map((taille) => (
                      <button
                        key={taille}
                        type="button"
                        className={`font-body h-9 w-9 border text-[0.8rem] font-bold uppercase transition-colors ${
                          tailles[item.id] === taille
                            ? 'border-white bg-white text-black'
                            : 'border-white/20 bg-transparent text-text-soft hover:border-white/50'
                        }`}
                        onClick={() => setTailles({ ...tailles, [item.id]: taille })}
                      >
                        {taille}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="font-body flex items-center border border-white/10">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center text-[1.1rem] text-text-soft hover:text-accent-3"
                    onClick={() => setQuantites({ ...quantites, [item.id]: Math.max(0, quantites[item.id] - 1) })}
                    aria-label={`Retirer un ${item.name}`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center" aria-label={`Quantité ${item.name}`}>
                    {quantites[item.id]}
                  </span>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center text-[1.1rem] text-text-soft hover:text-accent-3"
                    onClick={() => setQuantites({ ...quantites, [item.id]: quantites[item.id] + 1 })}
                    aria-label={`Ajouter un ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 border-t border-white/10 pt-6">
            <div className="grid gap-2">
              <label className={labelClasses} htmlFor="order-nom">Nom</label>
              <input className={inputClasses} id="order-nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
            </div>

            <div className="grid gap-2">
              <label className={labelClasses} htmlFor="order-email">Email</label>
              <input className={inputClasses} id="order-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="grid gap-2">
              <label className={labelClasses} htmlFor="order-rue">Adresse</label>
              <input className={inputClasses} id="order-rue" value={rue} onChange={(e) => setRue(e.target.value)} required />
            </div>

            <div className="grid grid-cols-[140px_1fr] gap-4">
              <div className="grid gap-2">
                <label className={labelClasses} htmlFor="order-cp">Code postal</label>
                <input className={inputClasses} id="order-cp" value={codePostal} onChange={(e) => setCodePostal(e.target.value)} required />
              </div>

              <div className="grid gap-2">
                <label className={labelClasses} htmlFor="order-ville">Ville</label>
                <input className={inputClasses} id="order-ville" value={ville} onChange={(e) => setVille(e.target.value)} required />
              </div>
            </div>

            <div className="grid gap-2">
              <label className={labelClasses} htmlFor="order-infos">Infos supplémentaires pour le livreur (optionnel)</label>
              <textarea
                className={inputClasses}
                id="order-infos"
                rows={2}
                value={infosLivraison}
                onChange={(e) => setInfosLivraison(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <p className="text-[1.1rem] font-bold">Total : {montant}€</p>
            {chosenItems.length > 0 ? (
              <p className="text-[0.8rem] text-text-soft">dont {fraisPort}€ de port</p>
            ) : null}
          </div>

          {error ? <p className="border-l-2 border-accent pl-3 text-accent">{error}</p> : null}

          <button
            type="submit"
            className="font-body inline-flex items-center justify-center bg-white px-[1.4rem] py-[0.9rem] font-extrabold uppercase tracking-[0.06em] text-black transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent-3 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Envoi…' : 'Payer avec PayPal'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default OrderModal
