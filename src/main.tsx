import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {NotificationProvider} from "./context/NotificationContext.tsx";
import { BrowserRouter } from 'react-router-dom'
import {ProfileProvider} from "./context/ProfileContext.tsx";
import {MenuProvider} from "./context/MenuContext.tsx";

createRoot(document.getElementById('root')!).render(

      <ProfileProvider>
          <BrowserRouter>
              <MenuProvider>
                  <NotificationProvider>
                      <App />
                  </NotificationProvider>
              </MenuProvider>
          </BrowserRouter>
      </ProfileProvider>

)
