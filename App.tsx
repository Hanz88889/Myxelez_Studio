import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './lib/theme'
import { ToastProvider } from './components/ui'
import StudioLayout from './components/StudioLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Workspace from './pages/Workspace'
import Resources from './pages/Resources'
import Projects from './pages/Projects'
import Settings from './pages/Settings'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/studio" element={<StudioLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="generate" element={<Workspace />} />
              <Route path="resources" element={<Resources />} />
              <Route path="projects" element={<Projects />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}
