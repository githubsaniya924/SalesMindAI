import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LeadUploadPage from "./pages/LeadUploadPage";
import B2BGeneratorPage from "./pages/B2BGeneratorPage";
import B2CGeneratorPage from "./pages/B2CGeneratorPage";
import DashboardPage from "./pages/DashBoardPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/leads" element={<LeadUploadPage />} />
        <Route path="/b2b" element={<B2BGeneratorPage />} />
        <Route path="/b2c" element={<B2CGeneratorPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
