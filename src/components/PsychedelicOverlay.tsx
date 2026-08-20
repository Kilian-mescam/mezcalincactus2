import { useEffect, useRef } from 'react'
import { usePsychedelicMode } from '../context/PsychedelicModeContext'

function PsychedelicOverlay() {
  const { enabled } = usePsychedelicMode()
  const trailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const trail = trailRef.current
    if (!trail) return

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let x = targetX
    let y = targetY
    let frame = 0

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
    }

    const animate = () => {
      x += (targetX - x) * 0.18
      y += (targetY - y) * 0.18
      trail.style.transform = `translate3d(${x - 60}px, ${y - 60}px, 0)`
      frame = requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', handlePointerMove)
    frame = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="psy-overlay" aria-hidden="true">
      <div className="psy-blob psy-blob--a" />
      <div className="psy-blob psy-blob--b" />
      <div className="psy-blob psy-blob--c" />
      <div className="psy-blob psy-blob--d" />
      <div ref={trailRef} className="psy-cursor-trail" />
    </div>
  )
}

export default PsychedelicOverlay
