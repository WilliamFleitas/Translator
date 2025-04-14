import { Routes, Route, HashRouter, useLocation } from 'react-router-dom'
import TranslatorPage from './pages/translator/TranslatorPage'
import { AzureSettingsContext } from './components/context/AzureSettingsContext'
import TranslationOverlay from './pages/translationOverlay/TranslationOverlay'
import { useEffect } from 'react'
import { DeepgramSettingsContext } from './components/context/DeepgramSettingsContext'

const PUBLIC_URL = ''

const MainRoutes: React.FC = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/translationOverlay') {
      document.body.classList.add('overlay-mode')
    } else {
      document.body.classList.remove('overlay-mode')
    }
  }, [location])

  return (
    <Routes>
      <Route
        path="/*"
        element={
          <AzureSettingsContext>
            <DeepgramSettingsContext>
              <TranslatorPage />
            </DeepgramSettingsContext>
          </AzureSettingsContext>
        }
      />
      <Route
        path="translator"
        element={
          <AzureSettingsContext>
            <DeepgramSettingsContext>
              <TranslatorPage />
            </DeepgramSettingsContext>
          </AzureSettingsContext>
        }
      />
      <Route path="translationOverlay" element={<TranslationOverlay />} />
      <Route
        path="*"
        element={
          <div>
            <h1>Are you lost? We all are</h1>
          </div>
        }
      />
    </Routes>
  )
}

function App(): JSX.Element {
  return (
    <HashRouter basename={PUBLIC_URL}>
      <MainRoutes />
    </HashRouter>
  )
}

export default App
