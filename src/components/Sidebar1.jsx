import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

export default function Sidebar1() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-purple-300 text-black shadow-xl flex flex-col font-semibold tracking-wide">
      
      {/* Logo */}
      <div className="py-6 text-center border-b border-purple-500">
        <h1 className="text-2xl font-extrabold tracking-wider">📌 Employee Attendance System </h1>
      </div>

      {/* Manager Name */}
      <div className="text-center py-5 border-b border-purple-500">
        <p className="text-lg">{user?.name || "Manager"}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 text-lg">
        <SidebarLink to="/manager/dashboard" icon="📊" label="Dashboard" />
        <SidebarLink to="/manager/all-attendance" icon="👥" label="All Employees" />
        <SidebarLink to="/manager/team-calendar" icon="📅" label="Team Attendance" />
        <SidebarLink to="/manager/reports" icon="📄" label="Reports" />
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="m-4 py-3 rounded-lg bg-purple-400 text-black hover:bg-purple-500 transition text-lg"
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
        `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
          isActive ? "bg-white text-black shadow-md" : "hover:bg-purple-200"
        }`
      }
    >
      <span className="text-2xl">{icon}</span>
      {label}
    </NavLink>
  );
}
