import { useEffect } from 'react'
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { CalculatorPage } from './components/pages/CalculatorPage'
import { ImprintPage } from './components/pages/ImprintPage'
import { KnowHowPage } from './components/pages/KnowHowPage'
import { PrivacyPage } from './components/pages/PrivacyPage'
import { useAdvancedMode } from './hooks/useAdvancedMode'
import { useBuildMode } from './hooks/useBuildMode'
import { usePlanInput } from './hooks/usePlanInput'
import { useSeo } from './hooks/useSeo'
import { useTheme } from './hooks/useTheme'
import type { Lang } from './lib/i18n'
import { detectLang, I18nProvider, isLang, persistLang } from './lib/i18n'

export type CalculatorContext = ReturnType<typeof usePlanInput> &
  ReturnType<typeof useAdvancedMode> &
  ReturnType<typeof useBuildMode>

/** Prefixes prefix-less URLs with the preferred language, e.g. /science → /de/science */
function RedirectToLang() {
  const location = useLocation()
  return (
    <Navigate
      to={`/${detectLang()}${location.pathname}${location.search}`}
      replace
    />
  )
}

/** Validates the :lang segment and owns everything shared across pages */
function LangLayout() {
  const { lang } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { dark, toggle } = useTheme()
  const planState = usePlanInput()
  const advancedState = useAdvancedMode()
  const buildState = useBuildMode()

  const validLang = isLang(lang)

  useSeo(validLang ? lang : 'en', location.pathname)

  // New page → start at the top (query-param changes don't navigate)
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  if (!validLang) return <RedirectToLang />

  const changeLang = (next: Lang) => {
    persistLang(next)
    const rest = location.pathname.replace(`/${lang}`, '')
    navigate(`/${next}${rest}${location.search}`, { replace: true })
  }

  const context: CalculatorContext = {
    ...planState,
    ...advancedState,
    ...buildState,
  }

  return (
    <I18nProvider lang={lang} onChangeLang={changeLang}>
      <div className="min-h-screen">
        <Header dark={dark} onToggleTheme={toggle} />
        <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:pt-10">
          <Outlet context={context} />
          <Footer />
        </main>
      </div>
    </I18nProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/:lang" element={<LangLayout />}>
        <Route index element={<CalculatorPage />} />
        <Route path="know-how" element={<KnowHowPage />} />
        {/* Former names of the know-how page keep working */}
        <Route path="science" element={<Navigate to="../know-how" replace />} />
        <Route path="background" element={<Navigate to="../know-how" replace />} />
        <Route path="imprint" element={<ImprintPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Route>
      <Route path="*" element={<RedirectToLang />} />
    </Routes>
  )
}
