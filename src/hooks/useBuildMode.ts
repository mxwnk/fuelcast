import { useEffect, useState } from 'react'
import { hasBuildParams } from '../lib/share'

export type CalculatorMode = 'auto' | 'build'

const STORAGE_KEY = 'fuelcast-mode'

/** Auto/Build mode toggle — opens Build automatically for links carrying items */
export function useBuildMode() {
  const [mode, setMode] = useState<CalculatorMode>(() => {
    if (hasBuildParams(location.search)) return 'build'
    return localStorage.getItem(STORAGE_KEY) === 'build' ? 'build' : 'auto'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  return {
    mode,
    setMode,
    toggleMode: () => setMode((current) => (current === 'auto' ? 'build' : 'auto')),
  }
}
