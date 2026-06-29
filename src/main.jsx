import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// On first load, persist the build-time env key into localStorage
const envKey = import.meta.env.VITE_OPENAI_API_KEY
if (envKey && !localStorage.getItem('bim_openai_key')) {
  localStorage.setItem('bim_openai_key', envKey)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
