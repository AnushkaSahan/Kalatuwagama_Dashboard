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
import TempleHistoryCreate from "./pages/Temple/TempleHistoryCreate";
import TempleHistoryEdit from "./pages/Temple/TempleHistoryEdit";
import MonkManagement from "./pages/Temple/MonkManagement";
import MonkCreate from "./pages/Temple/MonkCreate";
import MonkEdit from "./pages/Temple/MonkEdit";
import Events from "./pages/Temple/Events";
import EventCreate from "./pages/Temple/EventCreate";
import EventEdit from "./pages/Temple/EventEdit";
import Gallery from "./pages/Temple/Gallery";
import GalleryCreate from "./pages/Temple/GalleryCreate";
import GalleryEdit from "./pages/Temple/GalleryEdit";
import DonationDetails from "./pages/Temple/DonationDetails";
import DonationCreate from "./pages/Temple/DonationCreate";
import DonationEdit from "./pages/Temple/DonationEdit";
import Messages from "./pages/Temple/Messages";
import Announcements from "./pages/Temple/Announcements";
import AnnouncementCreate from "./pages/Temple/AnnouncementCreate";
import AnnouncementEdit from "./pages/Temple/AnnouncementEdit";

// ====== DAHAM PASALA SECTION ======
import Teachers from "./pages/DahamPasala/Teachers";
import TeacherCreate from "./pages/DahamPasala/TeacherCreate";
import TeacherEdit from "./pages/DahamPasala/TeacherEdit";
import Students from "./pages/DahamPasala/Students";
import StudentCreate from "./pages/DahamPasala/StudentCreate";
import StudentEdit from "./pages/DahamPasala/StudentEdit";

// ====== FOUNDATION SECTION ======
import FoundationProjects from "./pages/Foundation/FoundationProjects";
import FoundationProjectCreate from "./pages/Foundation/FoundationProjectCreate";
import FoundationProjectEdit from "./pages/Foundation/FoundationProjectEdit";

// ====== USERS SECTION ======
import Users from "./pages/Users/Users";
import UserCreate from "./pages/Users/UserCreate";
import UserEdit from "./pages/Users/UserEdit";
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
        <Route path="temple-history/create" element={<TempleHistoryCreate />} />
        <Route path="temple-history/edit/:id" element={<TempleHistoryEdit />} />
        <Route path="monks" element={<MonkManagement />} />
        <Route path="monks/create" element={<MonkCreate />} />
        <Route path="monks/edit/:id" element={<MonkEdit />} />
        <Route path="events" element={<Events />} />
        <Route path="events/create" element={<EventCreate />} />
        <Route path="events/edit/:id" element={<EventEdit />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="gallery/create" element={<GalleryCreate />} />
        <Route path="gallery/edit/:id" element={<GalleryEdit />} />
        <Route path="donations" element={<DonationDetails />} />
        <Route path="donations/create" element={<DonationCreate />} />
        <Route path="donations/edit/:id" element={<DonationEdit />} />
        <Route path="messages" element={<Messages />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="announcements/create" element={<AnnouncementCreate />} />
        <Route path="announcements/edit/:id" element={<AnnouncementEdit />} />

        {/* Daham Pasala */}
        <Route path="teachers" element={<Teachers />} />
        <Route path="teachers/create" element={<TeacherCreate />} />
        <Route path="teachers/edit/:id" element={<TeacherEdit />} />
        <Route path="students" element={<Students />} />
        <Route path="students/create" element={<StudentCreate />} />
        <Route path="students/edit/:id" element={<StudentEdit />} />

        {/* Foundation */}
        <Route path="foundation-projects" element={<FoundationProjects />} />
        <Route
          path="foundation-projects/create"
          element={<FoundationProjectCreate />}
        />
        <Route
          path="foundation-projects/edit/:id"
          element={<FoundationProjectEdit />}
        />

        {/* Users */}
        <Route path="users" element={<Users />} />
        <Route path="users/create" element={<UserCreate />} />
        <Route path="users/edit/:id" element={<UserEdit />} />
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
