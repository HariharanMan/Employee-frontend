import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

export default function Sidebar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ added

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // ✅ redirect to login
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-purple-200 text-black shadow-xl flex flex-col font-semibold tracking-wide">
      {/* Logo */}
      <div className="py-6 text-center border-b border-purple-400">
        <h1 className="text-2xl font-extrabold tracking-wider">⚡ Employee Attendance System</h1>
      </div>

      {/* User Role */}
      <div className="text-center font-semibold py-5 border-b border-purple-400">
        <p className="text-lg capitalize">{user?.role}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-2 text-lg">
        <SidebarLink to="/employee/dashboard" icon="📊" label="Dashboard" />
        <SidebarLink to="/employee/mark" icon="⏱" label="Mark Attendance" />
        <SidebarLink to="/employee/history" icon="📅" label="Attendance History" />
        <SidebarLink to="/employee/profile" icon="👤" label="Profile" />
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="m-4 py-3 rounded-lg bg-purple-300 text-black text-lg hover:bg-purple-400 transition"
      >
        🚪 Logout
      </button>
    </aside>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition text-lg tracking-wide ${
          isActive
            ? "bg-white text-black shadow-md"
            : "text-black hover:bg-purple-300"
        }`
      }
    >
      <span className="text-2xl">{icon}</span>
      {label}
    </NavLink>
  );
}
