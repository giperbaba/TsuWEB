import "./utils/i18n/config.ts";
import { Routes, Route } from "react-router-dom";
import { AuthorizationPage } from "./pages/AuthorizationPage.tsx";
import { ErrorPage } from "./pages/ErrorPage.tsx"; // Assuming your ErrorPage is in this location

function App() {
    return (
        <Routes>
            <Route path="/" element={<AuthorizationPage/>} />
            <Route path="/internalservererror" element={<ErrorPage errorCode='500'/>} />
            <Route path="*" element={<ErrorPage errorCode='404'/>} />
        </Routes>
    )
}

export default App;