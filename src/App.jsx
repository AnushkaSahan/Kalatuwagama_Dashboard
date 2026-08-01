import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";

// Temple modules
import TempleHistory from "./pages/Temple/TempleHistory";
import TempleHistoryCreate from "./pages/Temple/TempleHistoryCreate";
import TempleHistoryEdit from "./pages/Temple/TempleHistoryEdit";
import MonkManagement from "./pages/Temple/MonkManagement";
import Events from "./pages/Temple/Events";
import Gallery from "./pages/Temple/Gallery";
import DonationDetails from "./pages/Temple/DonationDetails";
import Messages from "./pages/Temple/Messages";

// Users
import Users from "./pages/Users/Users";
import Roles from "./pages/Users/Roles";

// Settings
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Settings/Profile";

// Auth
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";

import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Temple */}
        <Route path="temple-history" element={<TempleHistory />} />
        <Route path="temple-history/create" element={<TempleHistoryCreate />} />
        <Route path="temple-history/edit/:id" element={<TempleHistoryEdit />} />
        <Route path="monks" element={<MonkManagement />} />
        <Route path="events" element={<Events />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="donations" element={<DonationDetails />} />
        <Route path="messages" element={<Messages />} />

        {/* Users */}
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<Roles />} />

        {/* Settings */}
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
