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

  if (loadingSession) {
    return (
      <div className="admin-shell">
        <div className="login-card">Chargement de l’admin…</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="admin-shell">
        <div className="login-card">
          <h2 style={{ marginBottom: '1rem' }}>Connexion admin</h2>
          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                required
              />
            </div>

            {authError ? <p style={{ color: '#ff7ad9' }}>{authError}</p> : null}

            <button className="form-submit" type="submit">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <div className="admin-panel">
        <div className="admin-header">
          <div>
            <h2>Gestion des concerts</h2>
            <p>Connecté en tant que {session.user.email}</p>
          </div>
          <button
            type="button"
            className="logout-btn"
            onClick={() => supabase.auth.signOut()}
          >
            Déconnexion
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="datetime-local"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="ville">Ville</label>
            <input
              id="ville"
              type="text"
              value={form.ville}
              onChange={(event) => setForm({ ...form, ville: event.target.value })}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="salle">Salle</label>
            <input
              id="salle"
              type="text"
              value={form.salle}
              onChange={(event) => setForm({ ...form, salle: event.target.value })}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="url_billetterie">URL billetterie</label>
            <input
              id="url_billetterie"
              type="url"
              value={form.url_billetterie}
              onChange={(event) => setForm({ ...form, url_billetterie: event.target.value })}
              placeholder="https://..."
            />
          </div>

          <label className="inline-check" htmlFor="complet">
            <input
              id="complet"
              type="checkbox"
              checked={form.complet}
              onChange={(event) => setForm({ ...form, complet: event.target.checked })}
            />
            <span>Concert complet</span>
          </label>

          {message ? <p style={{ color: '#38f0d1' }}>{message}</p> : null}

          <div className="hero-actions">
            <button className="form-submit" type="submit">
              {form.id ? 'Modifier le concert' : 'Ajouter le concert'}
            </button>
            {form.id ? (
              <button type="button" className="secondary-btn" onClick={() => setForm(defaultForm)}>
                Annuler
              </button>
            ) : null}
          </div>
        </form>

        <div className="table-wrap">
          {loadingConcerts ? (
            <div className="state-box">Chargement du tableau…</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Ville</th>
                  <th>Salle</th>
                  <th>Billetterie</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedConcerts.map((concert) => (
                  <tr key={concert.id}>
                    <td>{new Date(concert.date).toLocaleString('fr-FR')}</td>
                    <td>{concert.ville}</td>
                    <td>{concert.salle}</td>
                    <td>{concert.url_billetterie ? 'Oui' : 'Non'}</td>
                    <td>{concert.complet ? 'Complet' : 'Ouvert'}</td>
                    <td>
                      <div className="admin-actions">
                        <button type="button" className="manage-btn" onClick={() => handleEdit(concert)}>
                          Modifier
                        </button>
                        <button type="button" className="manage-btn" onClick={() => handleDelete(concert.id)}>
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
