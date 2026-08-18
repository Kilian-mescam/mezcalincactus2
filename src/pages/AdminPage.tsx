import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const defaultForm = {
  id: null,
  date: '',
  ville: '',
  salle: '',
  url_billetterie: '',
  complet: false,
}

function AdminPage() {
  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [concerts, setConcerts] = useState([])
  const [loadingConcerts, setLoadingConcerts] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [authError, setAuthError] = useState('')
  const [message, setMessage] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

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
    () => [...concerts].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [concerts],
  )

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
    }
  }, [session])

  async function handleLogin(event) {
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

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    const payload = {
      ville: form.ville.trim(),
      salle: form.salle.trim(),
      url_billetterie: form.url_billetterie.trim() || null,
      complet: form.complet,
      date: form.date ? new Date(form.date).toISOString() : null,
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

  async function handleDelete(id) {
    const { error } = await supabase.from('concerts').delete().eq('id', id)

    if (error) {
      setMessage(`Suppression impossible : ${error.message}`)
      return
    }

    setMessage('Concert supprimé.')
    setForm(defaultForm)
    loadConcerts()
  }

  function handleEdit(concert) {
    setForm({
      id: concert.id,
      date: new Date(concert.date).toISOString().slice(0, 16),
      ville: concert.ville,
      salle: concert.salle,
      url_billetterie: concert.url_billetterie ?? '',
      complet: !!concert.complet,
    })
  }

  const fieldClasses = 'grid gap-[0.45rem]'
  const labelClasses = 'text-[0.82rem] uppercase tracking-[0.08em] text-text-soft'
  const inputClasses = 'border border-white/15 bg-white/[0.04] px-4 py-[0.85rem] text-text'
  const cardClasses = 'mx-auto w-[min(760px,calc(100%-2rem))] border border-white/15 bg-panel/84 p-8 shadow-soft'
  const primaryBtnClasses =
    'inline-flex items-center justify-center bg-gradient-to-br from-accent to-accent-2 px-[1.4rem] py-[0.9rem] font-extrabold text-[#190d1f] shadow-[0_15px_32px_rgba(255,95,210,0.4)] transition-transform duration-200 hover:-translate-y-px'
  const secondaryBtnClasses =
    'inline-flex items-center justify-center border border-white/15 bg-white/5 px-[1.4rem] py-[0.9rem] text-text transition-transform duration-200 hover:-translate-y-px'
  const manageBtnClasses =
    'inline-flex items-center justify-center border border-white/15 bg-white/[0.06] px-[1.4rem] py-[0.9rem] text-text transition-transform duration-200 hover:-translate-y-px'

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#150d25_0%,#090712_100%)] py-12">
        <div className={cardClasses}>Chargement de l’admin…</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#150d25_0%,#090712_100%)] py-12">
        <div className={cardClasses}>
          <h2 style={{ marginBottom: '1rem' }}>Connexion admin</h2>
          <form className="grid gap-4" onSubmit={handleLogin}>
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

            {authError ? <p style={{ color: '#ff7ad9' }}>{authError}</p> : null}

            <button className={primaryBtnClasses} type="submit">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#150d25_0%,#090712_100%)] py-12">
      <div className={cardClasses}>
        <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2>Gestion des concerts</h2>
            <p>Connecté en tant que {session.user.email}</p>
          </div>
          <button
            type="button"
            className={`${manageBtnClasses} px-4`}
            onClick={() => supabase.auth.signOut()}
          >
            Déconnexion
          </button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className={fieldClasses}>
            <label className={labelClasses} htmlFor="date">Date</label>
            <input
              className={inputClasses}
              id="date"
              type="datetime-local"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
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

          <label className="flex items-center gap-3 pt-[0.4rem]" htmlFor="complet">
            <input
              id="complet"
              type="checkbox"
              checked={form.complet}
              onChange={(event) => setForm({ ...form, complet: event.target.checked })}
            />
            <span>Concert complet</span>
          </label>

          {message ? <p style={{ color: '#38f0d1' }}>{message}</p> : null}

          <div className="mt-8 flex flex-wrap gap-4">
            <button className={primaryBtnClasses} type="submit">
              {form.id ? 'Modifier le concert' : 'Ajouter le concert'}
            </button>
            {form.id ? (
              <button type="button" className={secondaryBtnClasses} onClick={() => setForm(defaultForm)}>
                Annuler
              </button>
            ) : null}
          </div>
        </form>

        <div className="mt-4 overflow-x-auto">
          {loadingConcerts ? (
            <div className="border border-white/15 bg-panel/80 p-[1.4rem] text-text-soft">
              Chargement du tableau…
            </div>
          ) : (
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-white/15 px-[0.6rem] py-[0.9rem] text-left text-[0.75rem] uppercase tracking-[0.12em] text-text">Date</th>
                  <th className="border-b border-white/15 px-[0.6rem] py-[0.9rem] text-left text-[0.75rem] uppercase tracking-[0.12em] text-text">Ville</th>
                  <th className="border-b border-white/15 px-[0.6rem] py-[0.9rem] text-left text-[0.75rem] uppercase tracking-[0.12em] text-text">Salle</th>
                  <th className="border-b border-white/15 px-[0.6rem] py-[0.9rem] text-left text-[0.75rem] uppercase tracking-[0.12em] text-text">Billetterie</th>
                  <th className="border-b border-white/15 px-[0.6rem] py-[0.9rem] text-left text-[0.75rem] uppercase tracking-[0.12em] text-text">Statut</th>
                  <th className="border-b border-white/15 px-[0.6rem] py-[0.9rem] text-left text-[0.75rem] uppercase tracking-[0.12em] text-text">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedConcerts.map((concert) => (
                  <tr key={concert.id}>
                    <td className="border-b border-white/15 px-[0.6rem] py-[0.9rem] align-top text-text-soft">{new Date(concert.date).toLocaleString('fr-FR')}</td>
                    <td className="border-b border-white/15 px-[0.6rem] py-[0.9rem] align-top text-text-soft">{concert.ville}</td>
                    <td className="border-b border-white/15 px-[0.6rem] py-[0.9rem] align-top text-text-soft">{concert.salle}</td>
                    <td className="border-b border-white/15 px-[0.6rem] py-[0.9rem] align-top text-text-soft">{concert.url_billetterie ? 'Oui' : 'Non'}</td>
                    <td className="border-b border-white/15 px-[0.6rem] py-[0.9rem] align-top text-text-soft">{concert.complet ? 'Complet' : 'Ouvert'}</td>
                    <td className="border-b border-white/15 px-[0.6rem] py-[0.9rem] align-top text-text-soft">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className={manageBtnClasses} onClick={() => handleEdit(concert)}>
                          Modifier
                        </button>
                        <button type="button" className={manageBtnClasses} onClick={() => handleDelete(concert.id)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
