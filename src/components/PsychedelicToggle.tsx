import { usePsychedelicMode } from '../context/PsychedelicModeContext'

const RING_LABEL = 'PSYCHEDELIC MODE • '.repeat(2)

function PsychedelicToggle() {
  const { enabled, toggle } = usePsychedelicMode()

  return (
    <div className="psy-toggle-wrap fixed bottom-6 right-6 z-50 flex h-[150px] w-[150px] items-center justify-center">
      <svg className="psy-ring" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path id="psy-ring-path" d="M100,100 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
        </defs>
        <text className="psy-ring__text">
          <textPath href="#psy-ring-path">{RING_LABEL}</textPath>
        </text>
      </svg>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
        className="psy-toggle relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/60 text-2xl shadow-soft backdrop-blur-sm transition-transform duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-2"
        title={enabled ? 'Revenir à la réalité' : 'Activer le mode psychédélique'}
      >
        <span aria-hidden="true" className="psy-toggle__spiral">
          🌀
        </span>
        <span className="sr-only">
          {enabled ? 'Désactiver le mode psychédélique' : 'Activer le mode psychédélique'}
        </span>
      </button>
    </div>
  )
}

export default PsychedelicToggle
