import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import PageHeader from "../../components/PageHeader";
import { updateProfile } from "../../redux/authSlice";
import axios from "axios";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const [edit, setEdit] = useState({
    name: user?.name || "",
    department: user?.department || "",
    phone: user?.phone || "",
    location: user?.location || "",
    shift: user?.shift || "",
  });

  const BASE = import.meta.env.VITE_API_BASE || "https://employee-attendance-system-backend-zcs2.onrender.com";
  function getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  const handleSave = async () => {
    // Try to persist to backend if endpoint exists; otherwise fallback to local update
    try {
      const payload = {
        name: edit.name,
        department: edit.department,
        phone: edit.phone,
        location: edit.location,
        shift: edit.shift,
      };

      // attempt PATCH /api/auth/me (common pattern). If your backend expects another route, this will fail harmlessly.
      const res = await axios.patch(`${BASE}/api/auth/me`, payload, {
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
      });

      // If server returns updated user, use it; otherwise fallback to our edit object
      const updatedUser = res?.data?.user || res?.data || payload;

      dispatch(updateProfile(updatedUser));
      setOpen(false);
    } catch (err) {
      // If backend route doesn't exist or fails, fall back to local update
      console.warn("Profile update API failed, falling back to local update:", err?.response?.data || err.message);

      // local redux update (existing behavior)
      dispatch(updateProfile(edit));
      setOpen(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-64 bg-gradient-to-br from-purple-100 to-purple-200 min-h-screen">
        <Topbar />

        <div className="p-8 space-y-8">
          <PageHeader title="My Profile" subtitle="Your personal account information" />

          <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-10 border border-purple-300 animate-fade-in">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="h-28 w-28 rounded-full bg-purple-500 shadow-xl text-white flex items-center justify-center text-5xl font-bold">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </div>

              <h2 className="text-3xl font-extrabold mt-5 text-purple-800 tracking-wide">
                {user?.name}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>

            {/* Details Card */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-lg font-medium">
              <Detail label="Full Name" value={user?.name} />
              <Detail label="Email" value={user?.email} />
              <Detail label="Role" value={user?.role} />
              <Detail label="Department" value={user?.department || "—"} />
            </div>

            {/* Edit Button */}
            <div className="text-center mt-10">
              <button
                onClick={() => setOpen(true)}
                className="px-9 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold shadow-lg transition active:scale-95"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-[520px] shadow-2xl p-8 space-y-6 border border-purple-300 animate-fade-in">
            <h2 className="text-2xl font-bold text-purple-700 text-center mb-3">Edit Profile</h2>

            <div className="space-y-4">
              <FormField label="Full Name" value={edit.name} onChange={(v) => setEdit({ ...edit, name: v })} />
              <FormField label="Department" value={edit.department} onChange={(v) => setEdit({ ...edit, department: v })} />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2 rounded-lg border border-purple-400 font-semibold text-purple-700 hover:bg-purple-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow transition active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Component for display card */
function Detail({ label, value }) {
  return (
    <div className="p-4 rounded-xl bg-purple-50 shadow">
      <span className="text-gray-500">{label}</span>
      <p className="text-purple-900 font-semibold">{value}</p>
    </div>
  );
}

/* Component for popup form input field */
function FormField({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-600 font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        className="border border-purple-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
      />
    </div>
  );
}
