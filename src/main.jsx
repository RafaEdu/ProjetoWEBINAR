import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CadastroTreinamento from './pages/CadastroTreinamento'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CadastroTreinamento />
  </StrictMode>,
)
