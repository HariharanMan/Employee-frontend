import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function Topbar1() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-purple-100 shadow-md p-4 flex justify-between items-center rounded-b-2xl">
      <h1 className="text-2xl font-bold text-purple-700 tracking-wide">
        Manager Dashboard
      </h1>

      <div className="flex items-center gap-4">
        {/* Initial Icon */}
        <div className="h-10 w-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-lg font-semibold shadow">
          {initial}
        </div>

        {/* Name */}
        <span className="font-semibold text-purple-900">{user?.name}</span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium shadow transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
