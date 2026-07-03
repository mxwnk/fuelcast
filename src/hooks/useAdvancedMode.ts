import { useEffect, useState } from 'react'
import { hasAdvancedParams } from '../lib/share'

/** Advanced-mode toggle — opens automatically for links carrying advanced settings */
export function useAdvancedMode() {
  const [advanced, setAdvanced] = useState(
    () =>
      hasAdvancedParams(location.search) ||
      localStorage.getItem('fuelcast-advanced') === '1',
  )
  useEffect(() => {
    localStorage.setItem('fuelcast-advanced', advanced ? '1' : '0')
  }, [advanced])
  return { advanced, toggleAdvanced: () => setAdvanced((a) => !a) }
}
