import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔥 BACKEND LOGIN API CALL
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      console.log("LOGIN SUCCESS:", res.data);

      // store token + user in redux
      dispatch(login(res.data.user));

      // store token in localStorage
      localStorage.setItem("token", res.data.token);

      // redirect based on role
      navigate(`/${res.data.user.role}/dashboard`);

    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid credentials ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-white border border-purple-300 p-6 rounded-xl shadow-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-purple-600">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:border-purple-500"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:border-purple-500"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          className="w-full py-2 bg-purple-500 text-white font-semibold rounded hover:bg-purple-600 transition"
        >
          Login
        </button>

        <p className="text-center text-sm">
          New user?{" "}
          <Link
            to="/register"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}
