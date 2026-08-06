import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import PrivateRoute from "./components/PrivateRoute";

// Auth Pages
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";

// Dashboard
import Dashboard from "./pages/Dashboard";

// ====== TEMPLE SECTION ======
import TempleHistory from "./pages/Temple/TempleHistory";
import MonkManagement from "./pages/Temple/MonkManagement";

import Events from "./pages/Temple/Events";
import Gallery from "./pages/Temple/Gallery";

import DonationDetails from "./pages/Temple/DonationDetails";
import Messages from "./pages/Temple/Messages";
import Announcements from "./pages/Temple/Announcements";

// ====== DAHAM PASALA SECTION ======
import Teachers from "./pages/DahamPasala/Teachers";
import Students from "./pages/DahamPasala/Students";

// ====== FOUNDATION SECTION ======
import FoundationProjects from "./pages/Foundation/FoundationProjects";

// ====== USERS SECTION ======
import Users from "./pages/Users/Users";
import Roles from "./pages/Users/Roles";

// ====== SETTINGS SECTION ======
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Settings/Profile";

// ====== 404 ======
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes with layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Temple */}
        <Route path="temple-history" element={<TempleHistory />} />
        <Route path="monks" element={<MonkManagement />} />

        <Route path="events" element={<Events />} />
        <Route path="gallery" element={<Gallery />} />

        <Route path="donations" element={<DonationDetails />} />
        <Route path="messages" element={<Messages />} />
        <Route path="announcements" element={<Announcements />} />

        {/* Daham Pasala */}
        <Route path="teachers" element={<Teachers />} />
        <Route path="students" element={<Students />} />

        {/* Foundation */}
        <Route path="foundation-projects" element={<FoundationProjects />} />

        {/* Users */}
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<Roles />} />

        {/* Settings */}
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
