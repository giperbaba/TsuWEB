import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {NotificationProvider} from "./context/NotificationContext.tsx";
import { BrowserRouter } from 'react-router-dom'
import {ProfileProvider} from "./context/ProfileContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ProfileProvider>
          <BrowserRouter>
              <NotificationProvider>
                  <App />
              </NotificationProvider>
          </BrowserRouter>
      </ProfileProvider>
  </StrictMode>,
)
