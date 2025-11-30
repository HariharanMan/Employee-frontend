import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import PageHeader from "../../components/PageHeader";
import confetti from "canvas-confetti";
import axios from "axios";

export default function MarkAttendance() {
  const navigate = useNavigate();
  const [checkedIn, setCheckedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const BASE = import.meta.env.VITE_API_BASE || "https://employee-attendance-system-backend-zcs2.onrender.com";

  function getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  useEffect(() => {
    // On mount, check today's status to set initial state
    const fetchToday = async () => {
      try {
        const res = await axios.get(`${BASE}/api/attendance/today`, {
          headers: getAuthHeader(),
        });
        // if status is present/later/half-day treat as checked in
        const status = res?.data?.status;
        if (status && status !== "not_checked_in") {
          setCheckedIn(true);
        } else {
          setCheckedIn(false);
        }
      } catch (err) {
        // silently ignore or show a console.warn
        console.warn("Failed to fetch today's attendance:", err?.response?.data || err.message);
      }
    };
    fetchToday();
  }, []);

  const triggerConfetti = () => {
    const duration = 1200;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 6,
        spread: 70,
        startVelocity: 45,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ["#6b21a8", "#8b5cf6", "#c084fc", "#d8b4fe"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleToggle = async () => {
    // prevent double clicks while processing
    if (loading) return;
    setLoading(true);

    if (!checkedIn) {
      // Check-in flow
      try {
        const res = await axios.post(`${BASE}/api/attendance/checkin`, {}, {
          headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        });
        // success
        setCheckedIn(true);
        triggerConfetti();
      } catch (err) {
        console.error("Check-in error:", err?.response?.data || err.message);
        alert(err?.response?.data?.message || "Failed to check in");
      } finally {
        setLoading(false);
      }
    } else {
      // Check-out flow
      try {
        const res = await axios.post(`${BASE}/api/attendance/checkout`, {}, {
          headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        });
        // success
        setCheckedIn(false);
        triggerConfetti();
        setShowPopup(true);
      } catch (err) {
        console.error("Check-out error:", err?.response?.data || err.message);
        alert(err?.response?.data?.message || "Failed to check out");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate("/employee/history"); // 🔥 Redirect to Attendance History page
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-64 bg-purple-100 min-h-screen">
        <Topbar />

        <div className="p-6">
          <PageHeader title="Mark Attendance" subtitle="Record your attendance instantly" />

          <div className="bg-white border border-purple-300/70 shadow-xl p-10 rounded-xl text-center">
            <h2 className="text-2xl font-semibold text-purple-700 mb-5">
              {checkedIn ? "You are Checked In 🎉" : "You haven't Checked In yet"}
            </h2>

            <button
              onClick={handleToggle}
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white text-lg shadow font-semibold transition active:scale-95 cursor-pointer ${
                checkedIn ? "bg-red-500 hover:bg-red-600" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "Processing..." : (checkedIn ? "Check Out" : "Check-In")}
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal After Checkout */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm transition">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[380px] text-center border border-purple-300 animate-fade-in">
            <h2 className="text-2xl font-bold text-purple-700 mb-3">
              Day Completed 🎯
            </h2>
            <p className="text-gray-700 mb-6">
              Your workday has been successfully completed.  
              See you tomorrow!
            </p>

            <button
              onClick={handlePopupClose}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
