import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'psychedelic-mode'
const CLASS_NAME = 'psychedelic'

type PsychedelicModeContextValue = {
  enabled: boolean
  toggle: () => void
}

const PsychedelicModeContext = createContext<PsychedelicModeContextValue | null>(null)

function readInitialState() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on'
  } catch {
    return document.documentElement.classList.contains(CLASS_NAME)
  }
}

export function PsychedelicModeProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(readInitialState)

  useEffect(() => {
    document.documentElement.classList.toggle(CLASS_NAME, enabled)
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
    } catch {
      // localStorage unavailable (private mode, etc.) — trip stays session-only
    }
  }, [enabled])

  const toggle = useCallback(() => setEnabled((current) => !current), [])

  return <PsychedelicModeContext.Provider value={{ enabled, toggle }}>{children}</PsychedelicModeContext.Provider>
}

export function usePsychedelicMode() {
  const context = useContext(PsychedelicModeContext)
  if (!context) {
    throw new Error('usePsychedelicMode must be used within a PsychedelicModeProvider')
  }
  return context
}
