import "./utils/i18n/config.ts";
import {Routes, Route, Navigate} from "react-router-dom";
import { AuthorizationPage } from "./pages/AuthorizationPage.tsx";
import { ErrorPage } from "./pages/ErrorPage.tsx";
import {ProfilePage} from "./pages/ProfilePage.tsx";
import {AdministrationPage} from "./pages/administration/AdministrationPage.tsx";
import {ServicesPage} from "./pages/ServicesPage.tsx";
import {CertificatesPage} from "./pages/CertificatesPage.tsx";
import {EventsPage} from "./pages/EventsPage.tsx";
import {MainMenuLayout} from "./components/common/ui/menu/MainMenuLayout.tsx";
import {AdminEventsPage} from "./pages/administration/AdminEventsPage.tsx";
import {AdminServicesPage} from "./pages/administration/AdminServicesPage.tsx";
import {AdminUsersPage} from "./pages/administration/AdminUsersPage.tsx";
import {AdminItemUserPage} from "./pages/administration/AdminItemUserPage.tsx";
import {AdminAddEventPage} from "./pages/administration/AdminAddEventPage.tsx";
import {AdminEditEventPage} from "./pages/administration/AdminEditEventPage.tsx";
import {AdminItemEventPage} from "./pages/administration/AdminItemEventPage.tsx";
import {EventItemPage} from "./pages/EventItemPage.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<AuthorizationPage />} />
            <Route path="/internalservererror" element={<ErrorPage errorCode="500" />} />
            <Route path="*" element={<ErrorPage errorCode="404" />} />

            <Route element={<MainMenuLayout />}>
                <Route path="/profile" element={<ProfilePage />} />

                <Route path="/admin" element={<AdministrationPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/users/:userId" element={<AdminItemUserPage />} />
                <Route path="/admin/usefulservices" element={<AdminServicesPage />} />
                <Route path="/admin/events" element={<AdminEventsPage />} />
                <Route path="/admin/events/creating" element={<AdminAddEventPage />} />
                <Route path="/admin/events/editing/:id" element={<AdminEditEventPage />} />
                <Route path="/admin/events/:eventId" element={<AdminItemEventPage/>} />


                <Route path="/usefulservices" element={<ServicesPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:eventId" element={<EventItemPage/>} />
            </Route>
        </Routes>
    )
}

export default App;