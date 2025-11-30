import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MarkAttendance from "./pages/employee/MarkAttendance";
import MyHistory from "./pages/employee/MyHistory";
import Profile from "./pages/employee/Profile";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AllAttendance from "./pages/manager/AllAttendance";
import Reports from "./pages/manager/Reports";
import TeamCalendar from "./pages/manager/TeamCalendar";

export default function App() {
  const user = useSelector((s) => s.auth.user);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Employee Pages */}
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="/employee/mark" element={<MarkAttendance />} />
      <Route path="/employee/history" element={<MyHistory />} />
      <Route path="/employee/profile" element={<Profile />} />

      {/* Manager Pages */}
      <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      <Route path="/manager/all-attendance" element={<AllAttendance />} />
      <Route path="/manager/reports" element={<Reports />} />
      <Route path="/manager/team-calendar" element={<TeamCalendar />} />
      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
