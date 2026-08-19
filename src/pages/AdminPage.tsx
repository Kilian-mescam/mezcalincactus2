import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Commande, Concert } from '../types/entities'

interface ConcertFormState {
  id: number | null
  date: string
  heure: string
  ville: string
  salle: string
  url_billetterie: string
  complet: boolean
  pair_band_1: string
  pair_band_2: string
  pair_band_3: string
}

const defaultForm: ConcertFormState = {
  id: null,
  date: '',
  heure: '',
  ville: '',
  salle: '',
  url_billetterie: '',
  complet: false,
  pair_band_1: '',
  pair_band_2: '',
  pair_band_3: '',
}

const labelClasses = 'font-body text-[0.78rem] font-bold uppercase tracking-[0.14em] text-white'
const fieldClasses = 'grid gap-2'
const inputClasses =
  'font-body w-full border border-white/10 bg-black/20 px-4 py-[0.85rem] text-admin-cream placeholder:text-admin-cream/30 outline-none transition-colors focus:border-admin-orange focus:ring-2 focus:ring-admin-orange/25'
const primaryBtnClasses =
  'font-body inline-flex items-center justify-center bg-admin-orange px-6 py-[0.9rem] font-bold uppercase tracking-[0.08em] text-admin-ink transition-transform duration-200 hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-orange'
const ghostBtnClasses =
  'font-body inline-flex items-center justify-center border border-white/15 bg-white/[0.03] px-6 py-[0.9rem] font-bold uppercase tracking-[0.08em] text-admin-cream/85 transition-colors hover:border-admin-orange/50 hover:text-admin-orange'
const rowActionBtnClasses =
  'font-body inline-flex w-34 items-center justify-center border py-[0.45rem] text-[0.7rem] font-bold uppercase tracking-[0.06em] transition-colors'
const editBtnClasses = `${rowActionBtnClasses} bg-white/70 text-black hover:border-admin-orange/50 hover:text-admin-orange`
const dangerBtnClasses = `${rowActionBtnClasses} bg-admin-red/70 text-white hover:bg-admin-red/10`

function StatusDot({ colorClass }: { colorClass: string }) {
  return <span className={`inline-block size-[0.5rem] rounded-full ${colorClass}`} />
}

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [tab, setTab] = useState<'concerts' | 'commandes'>('concerts')
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [loadingConcerts, setLoadingConcerts] = useState(false)
  const [form, setForm] = useState<ConcertFormState>(defaultForm)
  const [authError, setAuthError] = useState('')
  const [message, setMessage] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [loadingCommandes, setLoadingCommandes] = useState(false)
  const [commandeMessage, setCommandeMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSession() {
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession()

      if (isMounted) {
        setSession(activeSession)
        setLoadingSession(false)
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoadingSession(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const sortedConcerts = useMemo(
    () => [...concerts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [concerts],
  )

  const messageIsError = /impossible|erreur/i.test(message)

  async function loadConcerts() {
    setLoadingConcerts(true)
    const { data, error } = await supabase.from('concerts').select('*').order('date', { ascending: true })

    setLoadingConcerts(false)

    if (error) {
      setMessage(`Erreur lors du chargement : ${error.message}`)
      return
    }

    setConcerts(data ?? [])
  }

  useEffect(() => {
    if (session) {
      loadConcerts()
      loadCommandes()
    }
  }, [session])

  async function loadCommandes() {
    setLoadingCommandes(true)
    const { data, error } = await supabase.from('commandes').select('*').order('created_at', { ascending: false })

    setLoadingCommandes(false)

    if (error) {
      setCommandeMessage(`Erreur lors du chargement : ${error.message}`)
      return
    }

    setCommandes(data ?? [])
  }

  async function handleToggleStatut(commande: Commande) {
    const nextStatut = commande.statut === 'expediee' ? 'nouvelle' : 'expediee'
    const { error } = await supabase.from('commandes').update({ statut: nextStatut }).eq('id', commande.id)

    if (error) {
      setCommandeMessage(`Modification impossible : ${error.message}`)
      return
    }

    loadCommandes()
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthError('')

    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    })

    if (error) {
      setAuthError(error.message)
      return
    }

    setLoginForm({ email: '', password: '' })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    const payload = {
      ville: form.ville.trim(),
      salle: form.salle.trim(),
      url_billetterie: form.url_billetterie.trim() || null,
      complet: form.complet,
      date: form.date && form.heure ? new Date(`${form.date}T${form.heure}`).toISOString() : null,
      pair_band_1: form.pair_band_1.trim() || null,
      pair_band_2: form.pair_band_2.trim() || null,
      pair_band_3: form.pair_band_3.trim() || null,
    }

    if (!payload.ville || !payload.salle || !payload.date) {
      setMessage('Tous les champs obligatoires doivent être remplis.')
      return
    }

    if (form.id) {
      const { error } = await supabase.from('concerts').update(payload).eq('id', form.id)

      if (error) {
        setMessage(`Modification impossible : ${error.message}`)
        return
      }

      setMessage('Concert modifié avec succès.')
    } else {
      const { error } = await supabase.from('concerts').insert(payload)

      if (error) {
        setMessage(`Ajout impossible : ${error.message}`)
        return
      }

      setMessage('Concert ajouté avec succès.')
    }

    setForm(defaultForm)
    loadConcerts()
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from('concerts').delete().eq('id', id)

    if (error) {
      setMessage(`Suppression impossible : ${error.message}`)
      return
    }

    setMessage('Concert supprimé.')
    setForm(defaultForm)
    loadConcerts()
  }

  function handleEdit(concert: Concert) {
    const concertDate = new Date(concert.date)
    setForm({
      id: concert.id,
      date: concertDate.toISOString().slice(0, 10),
      heure: concertDate.toISOString().slice(11, 16),
      ville: concert.ville,
      salle: concert.salle,
      url_billetterie: concert.url_billetterie ?? '',
      complet: !!concert.complet,
      pair_band_1: concert.pair_band_1 ?? '',
      pair_band_2: concert.pair_band_2 ?? '',
      pair_band_3: concert.pair_band_3 ?? '',
    })
  }

  if (loadingSession) {
    return (
      <div className="admin-texture flex min-h-screen items-center justify-center px-4 py-12">
        <div className="admin-card w-full max-w-[440px] p-10 text-admin-cream/70">Chargement de l’admin…</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="admin-texture flex min-h-screen items-center justify-center px-4 py-12">
        <div className="admin-card w-full max-w-[440px] p-10">
          <span className="font-body mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.32em] text-white/60">
            Mezcal In Cactus
          </span>
          <h2 className="mb-1 text-[2.4rem] leading-none">Admin</h2>
          <div className="mb-8 h-[3px] w-12 bg-admin-orange" />

          <form className="grid gap-5" onSubmit={handleLogin}>
            <div className={fieldClasses}>
              <label className={labelClasses} htmlFor="email">Email</label>
              <input
                className={inputClasses}
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                required
              />
            </div>

            <div className={fieldClasses}>
              <label className={labelClasses} htmlFor="password">Mot de passe</label>
              <input
                className={inputClasses}
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                required
              />
            </div>

            {authError ? (
              <p className="border-l-2 border-admin-red pl-3 text-admin-red">{authError}</p>
            ) : null}

            <button className={`${primaryBtnClasses} mt-2`} type="submit">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-texture min-h-screen px-6 py-10 md:px-12">
      <div className="mb-8 flex flex-col items-start gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="font-body mb-1 block text-[0.72rem] font-bold uppercase tracking-[0.32em] text-white/60">
            Mezcal In Cactus
          </span>
          <h2 className="text-[1.7rem] leading-none">{tab === 'concerts' ? 'Gestion des concerts' : 'Commandes merch'}</h2>
          <p className="mt-2 text-admin-cream/60">Connecté en tant que {session.user.email}</p>
        </div>
        <button type="button" className={ghostBtnClasses} onClick={() => supabase.auth.signOut()}>
          Déconnexion
        </button>
      </div>

      <div className="mb-8 flex gap-3">
        <button
          type="button"
          className={tab === 'concerts' ? primaryBtnClasses : ghostBtnClasses}
          onClick={() => setTab('concerts')}
        >
          Concerts
        </button>
        <button
          type="button"
          className={tab === 'commandes' ? primaryBtnClasses : ghostBtnClasses}
          onClick={() => setTab('commandes')}
        >
          Commandes
        </button>
      </div>

      {tab === 'concerts' ? (
      <>
      <form className="grid gap-6 border-b border-white/10 pb-10" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-3">
          <div className={fieldClasses}>
            <label className={labelClasses} htmlFor="date">Date</label>
            <input
              className={inputClasses}
              id="date"
              type="date"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
              required
            />
          </div>

          <div className={fieldClasses}>
            <label className={labelClasses} htmlFor="heure">Heure</label>
            <input
              className={inputClasses}
              id="heure"
              type="time"
              value={form.heure}
              onChange={(event) => setForm({ ...form, heure: event.target.value })}
              required
            />
          </div>

          <div className={fieldClasses}>
            <label className={labelClasses} htmlFor="ville">Ville</label>
            <input
              className={inputClasses}
              id="ville"
              type="text"
              value={form.ville}
              onChange={(event) => setForm({ ...form, ville: event.target.value })}
              required
            />
          </div>
        </div>

        <div className={fieldClasses}>
          <label className={labelClasses} htmlFor="salle">Salle</label>
          <input
            className={inputClasses}
            id="salle"
            type="text"
            value={form.salle}
            onChange={(event) => setForm({ ...form, salle: event.target.value })}
            required
          />
        </div>

        <div className={fieldClasses}>
          <span className={labelClasses}>Groupes en co-affiche (optionnel)</span>
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              className={inputClasses}
              type="text"
              aria-label="Groupe co-affiche 1"
              placeholder="Groupe 1"
              value={form.pair_band_1}
              onChange={(event) => setForm({ ...form, pair_band_1: event.target.value })}
            />
            <input
              className={inputClasses}
              type="text"
              aria-label="Groupe co-affiche 2"
              placeholder="Groupe 2"
              value={form.pair_band_2}
              onChange={(event) => setForm({ ...form, pair_band_2: event.target.value })}
            />
            <input
              className={inputClasses}
              type="text"
              aria-label="Groupe co-affiche 3"
              placeholder="Groupe 3"
              value={form.pair_band_3}
              onChange={(event) => setForm({ ...form, pair_band_3: event.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className={fieldClasses}>
            <label className={labelClasses} htmlFor="url_billetterie">URL billetterie</label>
            <input
              className={inputClasses}
              id="url_billetterie"
              type="url"
              value={form.url_billetterie}
              onChange={(event) => setForm({ ...form, url_billetterie: event.target.value })}
              placeholder="https://..."
            />
          </div>

          <label className="flex items-center gap-3 pb-[0.85rem]" htmlFor="complet">
            <input
              id="complet"
              type="checkbox"
              className="size-4 accent-admin-orange"
              checked={form.complet}
              onChange={(event) => setForm({ ...form, complet: event.target.checked })}
            />
            <span className="font-body text-admin-cream/85">Concert complet</span>
          </label>
        </div>

        {message ? (
          <p className={`border-l-2 pl-3 ${messageIsError ? 'border-admin-red text-admin-red' : 'border-white text-white'}`}>
            {message}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-4">
          <button className={primaryBtnClasses} type="submit">
            {form.id ? 'Modifier le concert' : 'Ajouter le concert'}
          </button>
          {form.id ? (
            <button type="button" className={ghostBtnClasses} onClick={() => setForm(defaultForm)}>
              Annuler
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-10 overflow-x-auto">
        {loadingConcerts ? (
          <div className="p-[1.4rem] text-admin-cream/60">Chargement du tableau…</div>
        ) : (
          <table className="font-body w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                <th className="border-b border-white/10 px-[0.6rem] py-[0.9rem] text-left text-[0.72rem] uppercase tracking-[0.12em] text-white/70">Date</th>
                <th className="border-b border-white/10 px-[0.6rem] py-[0.9rem] text-left text-[0.72rem] uppercase tracking-[0.12em] text-white/70">Ville</th>
                <th className="border-b border-white/10 px-[0.6rem] py-[0.9rem] text-left text-[0.72rem] uppercase tracking-[0.12em] text-white/70">Salle</th>
                <th className="border-b border-white/10 px-[0.6rem] py-[0.9rem] text-left text-[0.72rem] uppercase tracking-[0.12em] text-white/70">Co-affiche</th>
                <th className="border-b border-white/10 px-[0.6rem] py-[0.9rem] text-left text-[0.72rem] uppercase tracking-[0.12em] text-white/70">Billetterie</th>
                <th className="border-b border-white/10 px-[0.6rem] py-[0.9rem] text-left text-[0.72rem] uppercase tracking-[0.12em] text-white/70">Statut</th>
                <th className="border-b border-white/10 px-[0.6rem] py-[0.9rem] text-left text-[0.72rem] uppercase tracking-[0.12em] text-white/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedConcerts.length === 0 ? (
                <tr>
                  <td className="px-[0.6rem] py-[1.6rem] text-admin-cream/50" colSpan={7}>
                    Aucun concert enregistré. Ajoutez la première date ci-dessus.
                  </td>
                </tr>
              ) : (
                sortedConcerts.map((concert) => (
                  <tr key={concert.id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="border-b border-white/10 px-[0.6rem] py-[0.9rem] align-top text-admin-cream/80">{new Date(concert.date).toLocaleString('fr-FR')}</td>
                    <td className="border-b border-white/10 px-[0.6rem] py-[0.9rem] align-top text-admin-cream/80">{concert.ville}</td>
                    <td className="border-b border-white/10 px-[0.6rem] py-[0.9rem] align-top text-admin-cream/80">{concert.salle}</td>
                    <td className="border-b border-white/10 px-[0.6rem] py-[0.9rem] align-top text-admin-cream/80">
                      {[concert.pair_band_1, concert.pair_band_2, concert.pair_band_3].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="border-b border-white/10 px-[0.6rem] py-[0.9rem] align-top text-admin-cream/80">{concert.url_billetterie ? 'Oui' : 'Non'}</td>
                    <td className="border-b border-white/10 px-[0.6rem] py-[0.9rem] align-top text-admin-cream/80">
                      <span className="inline-flex items-center gap-2">
                        <StatusDot colorClass={concert.complet ? 'bg-admin-red' : 'bg-admin-green'} />
                        {concert.complet ? 'Complet' : 'Ouvert'}
                      </span>
                    </td>
                    <td className="border-b border-white/10 px-[0.6rem] py-[0.9rem] align-top">
                      <div className="flex flex-row gap-2">
                        <button type="button" className={editBtnClasses} onClick={() => handleEdit(concert)}>
                          Modifier
                        </button>
                        <button type="button" className={dangerBtnClasses} onClick={() => handleDelete(concert.id)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      </>
      ) : (
      <div className="overflow-x-auto">
        {commandeMessage ? (
          <p className={`mb-4 border-l-2 pl-3 ${/impossible|erreur/i.test(commandeMessage) ? 'border-admin-red text-admin-red' : 'border-white text-white'}`}>
            {commandeMessage}
          </p>
        ) : null}

        {loadingCommandes ? (
          <div className="p-[1.4rem] text-admin-cream/60">Chargement du tableau…</div>
        ) : (
          <table className="font-body w-full min-w-[820px] border-collapse">
            <thead>
              <tr>
                <th className="border-b border-white/10 px-[0.6rem] py-[0.9rem] text-left text-[0.72rem] uppercase tracking-[0.12em] text-white/70">Date</th>
                <th className="border-b border-white/10 px-[0.6rem] py-[0.9rem] text-left text-[0.72rem] uppercase tracking-[0.12em] text-white/70">Articles</th>
                <th className="border-b border-white/10 px-[0.6rem] py-[0.9rem] text-left text-[0.72rem] uppercase tracking-[0.12em] text-white/70">Client</th>
                <th className="border-b border-white/10 px-[0.6rem] py-[0.9rem] text-left text-[0.72rem] uppercase tracking-[0.12em] text-white/70">Adresse</th>
                <th className="border-b border-white/10 px-[0.6rem] py-[0.9rem] text-left text-[0.72rem] uppercase tracking-[0.12em] text-white/70">Montant</th>
                <th className="border-b border-white/10 px-[0.6rem] py-[0.9rem] text-left text-[0.72rem] uppercase tracking-[0.12em] text-white/70">Statut</th>
                <th className="border-b border-white/10 px-[0.6rem] py-[0.9rem] text-left text-[0.72rem] uppercase tracking-[0.12em] text-white/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commandes.length === 0 ? (
                <tr>
                  <td className="px-[0.6rem] py-[1.6rem] text-admin-cream/50" colSpan={7}>
                    Aucune commande pour le moment.
                  </td>
                </tr>
              ) : (
                commandes.map((commande) => (
                  <tr key={commande.id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="border-b border-white/10 px-[0.6rem] py-[0.9rem] align-top text-admin-cream/80">{new Date(commande.created_at).toLocaleString('fr-FR')}</td>
                    <td className="border-b border-white/10 px-[0.6rem] py-[0.9rem] align-top text-admin-cream/80">
                      {commande.items.map((item) => `${item.quantite}x ${item.produitNom}${item.taille ? ` (${item.taille})` : ''}`).join(', ')}
                    </td>
                    <td className="border-b border-white/10 px-[0.6rem] py-[0.9rem] align-top text-admin-cream/80">
                      <div>{commande.nom}</div>
                      <div className="text-admin-cream/50">{commande.email}</div>
                    </td>
                    <td className="border-b border-white/10 px-[0.6rem] py-[0.9rem] align-top whitespace-pre-wrap text-admin-cream/80">{commande.adresse}</td>
                    <td className="border-b border-white/10 px-[0.6rem] py-[0.9rem] align-top text-admin-cream/80">{commande.montant}€</td>
                    <td className="border-b border-white/10 px-[0.6rem] py-[0.9rem] align-top text-admin-cream/80">
                      <span className="inline-flex items-center gap-2">
                        <StatusDot colorClass={commande.statut === 'expediee' ? 'bg-admin-green' : 'bg-admin-orange'} />
                        {commande.statut === 'expediee' ? 'Expédiée' : 'Nouvelle'}
                      </span>
                    </td>
                    <td className="border-b border-white/10 px-[0.6rem] py-[0.9rem] align-top">
                      <button
                        type="button"
                        className="font-body inline-flex items-center justify-center whitespace-nowrap border bg-white/70 px-3 py-[0.45rem] text-[0.7rem] font-bold uppercase tracking-[0.06em] text-black transition-colors hover:border-admin-orange/50 hover:text-admin-orange"
                        onClick={() => handleToggleStatut(commande)}
                      >
                        {commande.statut === 'expediee' ? 'Marquer nouvelle' : 'Marquer expédiée'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      )}
    </div>
  )
}

export default AdminPage
