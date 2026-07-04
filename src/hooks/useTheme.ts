import { useEffect, useState } from 'react'

const THEME_LIGHT = '#f2f1ec'
const THEME_DARK = '#0b0d10'

function updateThemeColorMeta(dark: boolean) {
  const color = dark ? THEME_DARK : THEME_LIGHT
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => { meta.content = color })
}

export function useTheme() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('fuelcast-theme', dark ? 'dark' : 'light')
    updateThemeColorMeta(dark)
  }, [dark])
  return { dark, toggle: () => setDark((d) => !d) }
}
