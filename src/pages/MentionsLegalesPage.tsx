import { Link } from 'react-router-dom'
import SiteFooter from '../components/SiteFooter'

const headingClasses = 'text-[1.3rem] mt-10 mb-3'

function MentionsLegalesPage() {
  return (
    <div>
      <header className="mx-auto w-[min(760px,calc(100%-2rem))] pt-10">
        <Link
          className="text-[0.85rem] uppercase tracking-[0.1em] text-text-soft transition-colors hover:text-accent-3"
          to="/"
        >
          ← Retour à l'accueil
        </Link>
      </header>

      <main className="mx-auto w-[min(760px,calc(100%-2rem))] py-10">
        <h1 className="text-[2rem]">Mentions légales</h1>

        <h2 className={headingClasses}>Éditeur du site</h2>
        <p>
          Agave Records (association loi 1901)
          <br />
          96 ter cours Émile Zola, 69100 Villeurbanne, France
          <br />
          Contact : mezcalincactus@gmail.com
        </p>

        <h2 className={headingClasses}>Directeur de la publication</h2>
        <p>
          Kilian Mescam
        </p>

        <h2 className={headingClasses}>Hébergement</h2>
        <p>
          Netlify, Inc.
          <br />
          2325 3rd Street, Suite 296, San Francisco, CA 94107, États-Unis
        </p>

        <h2 className={headingClasses}>Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus présents sur ce site (textes, images, illustrations, musiques)
          est la propriété d'Agave Records et de Mezcal in Cactus, sauf mention contraire. Toute
          reproduction sans autorisation préalable est interdite.
        </p>

        <h2 className={headingClasses}>Données personnelles</h2>
        <p>
          Ce site ne dépose aucun cookie de suivi ni traceur publicitaire pour ses pages
          publiques. Des cookies d'authentification sont utilisés uniquement sur l'espace
          d'administration (/admin), réservé à l'équipe du groupe, pour la gestion de la
          connexion.
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}

export default MentionsLegalesPage
