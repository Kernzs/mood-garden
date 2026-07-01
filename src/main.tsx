import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/App'
import { GardenProvider } from '@/context/GardenContext'
import { ToastProvider } from '@/hooks/useToast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GardenProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </GardenProvider>
  </StrictMode>,
)
