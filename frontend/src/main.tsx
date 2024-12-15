import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BaseProvider } from './context/BaseContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BaseProvider>
      <App />
    </BaseProvider>
  </StrictMode>,
)
