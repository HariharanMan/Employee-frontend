import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import illustration from "../assets/illustration.png";   // adjust "../" if path differs


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-300">
      {/* Navbar */}
      <header className="flex justify-between items-center px-12 py-6 shadow bg-white/50 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-purple-800 tracking-wide">
          ⚡ Employee Attendance System
        </h1>
        <Link
          to="/login"
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow transition"
        >
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <section className="px-12 py-16 flex flex-col md:flex-row justify-between items-center">
        <div className="max-w-xl space-y-6">
          <h2 className="text-5xl font-extrabold text-purple-800 leading-tight">
            Smarter Attendance
            <span className="text-purple-600">. Simplified Workflow</span>
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed font-medium">
            Track employee attendance, automate timesheets, and easily manage
            daily workforce performance — all from one smart dashboard.
          </p>

          <Link
            to="/register"
            className="px-8 py-3 bg-purple-700 hover:bg-purple-800 text-white text-lg font-semibold rounded-xl shadow-xl transition active:scale-95 inline-block"
          >
            Get Started for Free 🚀
          </Link>
        </div>

        {/* Floating Illustration */}
        <motion.img
          src={illustration}
          className="w-[380px] md:w-[520px] drop-shadow-xl cursor-pointer"
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.08, rotate: 2, y: -8 }}
          transition={{ duration: 0.6 }}
        />
      </section>

      {/* Features Section */}
      <section className="px-12 py-16 bg-white/40 backdrop-blur-lg shadow-inner">
        <h2 className="text-center text-4xl font-extrabold text-purple-800 mb-12">
          Why Choose Employee Attendance System?
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Realtime Attendance",
              desc: "Live check-in / check-out with auto-timestamp & GPS.",
              icon: "⏱",
            },
            {
              title: "Automated Timesheets",
              desc: "Total working hours calculated without manual effort.",
              icon: "📅",
            },
            {
              title: "Smart Insights",
              desc: "Charts, analytics & reports to improve employee workflow.",
              icon: "📊",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white p-8 text-center rounded-2xl shadow-xl border border-purple-200"
            >
              <p className="text-6xl mb-4">{f.icon}</p>
              <h3 className="text-2xl font-bold text-purple-700">{f.title}</h3>
              <p className="text-gray-600 mt-2 text-lg">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Extra Highlights */}
      <section className="px-12 py-16">
        <h2 className="text-center text-4xl font-extrabold text-purple-800 mb-10">
          Powerful for Employees & Managers
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-purple-200/60 p-8 rounded-2xl shadow-xl border border-purple-300"
          >
            <h3 className="text-2xl font-bold text-purple-800 mb-4">
              👨‍💻 Employee Features
            </h3>
            <ul className="text-lg text-gray-700 space-y-2">
              <li>✔ Mark daily attendance</li>
              <li>✔ Attendance history & monthly summary</li>
              <li>✔ Hours worked report</li>
              <li>✔ Profile management</li>
            </ul>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-purple-200/60 p-8 rounded-2xl shadow-xl border border-purple-300"
          >
            <h3 className="text-2xl font-bold text-purple-800 mb-4">
              🧑‍💼 Manager Features
            </h3>
            <ul className="text-lg text-gray-700 space-y-2">
              <li>✔ View attendance of all employees</li>
              <li>✔ Daily/weekly/monthly analytics</li>
              <li>✔ Late & absent employees list</li>
              <li>✔ Export reports in one click</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center bg-purple-900 text-white mt-12">
        <p className="text-lg font-medium tracking-wide">
          © {new Date().getFullYear()} Attendify — Smart Attendance for Smart Teams
        </p>
      </footer>
    </div>
  );
}
