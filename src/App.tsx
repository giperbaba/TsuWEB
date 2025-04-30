import "./utils/i18n/config.ts";
import { Routes, Route } from "react-router-dom";
import { AuthorizationPage } from "./pages/AuthorizationPage.tsx";
import { ErrorPage } from "./pages/ErrorPage.tsx";
import {ProfilePage} from "./pages/ProfilePage.tsx";
import {AdministrationPage} from "./pages/AdministrationPage.tsx";
import {ServicesPage} from "./pages/ServicesPage.tsx";
import {CertificatesPage} from "./pages/CertificatesPage.tsx";
import {EventsPage} from "./pages/EventsPage.tsx";
import {MainMenuLayout} from "./components/common/ui/menu/MainMenuLayout.tsx"; // Assuming your ErrorPage is in this location

function App() {
    return (
        <Routes>
            {/* Страницы без меню */}
            <Route path="/login" element={<AuthorizationPage />} />
            <Route path="/internalservererror" element={<ErrorPage errorCode="500" />} />
            <Route path="*" element={<ErrorPage errorCode="404" />} />

            {/* Страницы с меню */}
            <Route element={<MainMenuLayout />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdministrationPage />} />
                <Route path="/usefulservices" element={<ServicesPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/events" element={<EventsPage />} />
            </Route>
        </Routes>
    )
}

export default App;