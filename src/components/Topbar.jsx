import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // ✅ redirect to login
  };

  return (
    <header className="bg-purple-100 shadow-md p-4 flex justify-between items-center rounded-b-2xl">
      {/* Title */}
      <h1 className="text-2xl font-bold text-purple-700 tracking-wide">
        Employee Dashboard
      </h1>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {/* Profile Initial */}
        <div className="h-10 w-10 bg-purple-400 text-white rounded-full flex items-center justify-center text-lg font-semibold shadow">
          {userInitial}
        </div>

        {/* Username */}
        <span className="font-semibold text-purple-800 text-lg">
          {user?.name || user?.email}
        </span>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg font-medium shadow transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
