import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dasboard/Dashboard";
import Layout from "./components/Layout";
import TicketManagement from "./pages/Tickets/TicketManagement";
import UserManagement from "./pages/Users/UserManagement";
import PackageManagement from "./pages/Packages/PackageManagement";
import ReportPage from "./pages/Reports/ReportPage";
import SettingsPage from "./pages/SettingsPage";
import SecuritySettings from "./pages/SecuritySettings";
import ContentModeration from "./pages/ContentModeration/ContentModeration";
import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Add more routes here that need the sidebar */}
            <Route path="/users" element={<UserManagement/>} />
            <Route path="/tickets" element={<TicketManagement/>} />
            <Route
              path="/packages"
              element={<PackageManagement/>}
            />
            <Route path="/reports" element={<ReportPage/>} />
            <Route path="/content-moderation" element={<ContentModeration/>} />
            <Route path="/settings" element={<SecuritySettings/>} />
             <Route path="/profile" element={<SettingsPage/>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
