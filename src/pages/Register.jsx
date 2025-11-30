import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name: form.name,
      email: form.email,
      role: form.role,
      password: form.password,
    };

    try {
      // 🔥 BACKEND REGISTER API CALL ADDED HERE
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData
      );

      console.log("REGISTER SUCCESS:", res.data);

      alert("Registration successful 🎉 Please login to continue.");

      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-white border border-purple-300 p-6 rounded-xl shadow-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-purple-600">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:border-purple-500"
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

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

        <select
          className="w-full border rounded px-3 py-2 focus:outline-none focus:border-purple-500"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>

        <button className="w-full py-2 bg-purple-500 text-white font-semibold rounded hover:bg-purple-600 transition">
          Register
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
