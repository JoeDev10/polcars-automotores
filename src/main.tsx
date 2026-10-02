import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { config } from './config'
import './index.css'

const root = document.documentElement.style
root.setProperty('--color-accent', config.colores.acento)
root.setProperty('--color-accent-ink', config.colores.acentoTexto)
root.setProperty('--color-on-accent', config.colores.textoSobreAcento)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
