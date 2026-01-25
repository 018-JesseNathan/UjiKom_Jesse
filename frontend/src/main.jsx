import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import LoginPage from './Register.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginPage />
  </StrictMode>,
)
