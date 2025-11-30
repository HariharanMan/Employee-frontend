import Sidebar1 from "../../components/Sidebar1";
import Topbar1 from "../../components/Topbar1";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function ManagerDashboard() {
  const user = useSelector((state) => state.auth.user);

  const [stats, setStats] = useState({
    totalEmployees: 25,
    presentToday: 20,
    absentToday: 3,
    lateToday: 2,
  });
  const [weeklyTrend, setWeeklyTrend] = useState([
    { day: "Mon", present: 21, absent: 2, late: 2 },
    { day: "Tue", present: 22, absent: 1, late: 2 },
    { day: "Wed", present: 19, absent: 4, late: 2 },
    { day: "Thu", present: 20, absent: 3, late: 2 },
    { day: "Fri", present: 23, absent: 1, late: 1 },
  ]);
  const [departmentData, setDepartmentData] = useState([
    { dept: "HR", present: 8 },
    { dept: "IT", present: 12 },
    { dept: "Finance", present: 5 },
  ]);
  const [absentListToday, setAbsentListToday] = useState([
    { name: "John Doe", dept: "Finance" },
    { name: "Priya Sharma", dept: "HR" },
    { name: "Amit Verma", dept: "IT" },
  ]);
  const [loading, setLoading] = useState(true);

  const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
  function getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1) manager dashboard (totals)
        const dashRes = await axios.get(`${BASE}/api/dashboard/manager`, {
          headers: getAuthHeader(),
        });

        // dashRes expected: { date, presentCount, totalEmployees, percentPresent }
        const totalEmployees = dashRes?.data?.totalEmployees ?? dashRes?.data?.totalEmployees ?? 25;
        const presentToday = dashRes?.data?.presentCount ?? dashRes?.data?.presentCount ?? 20;

        // 2) who is present today (to compute absent list)
        const todayRes = await axios.get(`${BASE}/api/attendance/today-status`, {
          headers: getAuthHeader(),
        });
        const presentRecords = todayRes?.data?.present ?? todayRes?.data ?? [];
        // presentRecords items have userId populated when called from backend in controllers
        const presentIds = presentRecords.map((r) => r.userId?._id || r.userId);

        // fetch all employees (for absent list and department counts)
        const employeesRes = await axios.get(`${BASE}/api/admin/employees?page=1&limit=1000`, {
          headers: getAuthHeader(),
        }).catch(()=>({ data: { employees: [] } }));
        const allEmployees = employeesRes?.data?.employees || [];

        // compute absent list: employees not in presentIds
        const absentees = allEmployees
          .filter((e) => e.role === "employee" && !presentIds.includes(String(e._id)))
          .slice(0, 10) // limit to first 10 for UI
          .map((e) => ({ name: e.name, dept: e.department || "—" }));

        // 3) weekly trend: fetch last 5 weekdays (Mon-Fri). We'll do last 7 days and reduce to weekdays
        const dayjs = (await import("dayjs")).default;
        const days = [];
        for (let i = 6; i >= 0; i--) {
          days.push(dayjs().subtract(i, "day").format("YYYY-MM-DD"));
        }

        // fetch attendance for each day in parallel (use /api/attendance/all?date=YYYY-MM-DD)
        const dayCalls = days.map((d) =>
          axios.get(`${BASE}/api/attendance/all`, { headers: getAuthHeader(), params: { date: d } })
            .then(r => ({ date: d, records: r.data.records || [] }))
            .catch(() => ({ date: d, records: [] }))
        );

        const dayResults = await Promise.all(dayCalls);

        // reduce to Mon..Fri latest (map weekday names)
        const trendMap = {};
        dayResults.forEach((dr) => {
          const dayName = (function (dd) {
            const d = new Date(dd);
            return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
          })(dr.date);
          // count statuses
          const counts = { present: 0, absent: 0, late: 0 };
          dr.records.forEach((r) => {
            const s = (r.status || "").toLowerCase();
            if (s === "present") counts.present++;
            else if (s === "late") counts.late++;
            else if (s === "absent") counts.absent++;
            else if (s === "half-day") counts.present++; // treat half-day as present for trend
          });
          trendMap[dayName] = (trendMap[dayName] || { present:0, absent:0, late:0 });
          trendMap[dayName].present += counts.present;
          trendMap[dayName].absent += counts.absent;
          trendMap[dayName].late += counts.late;
        });

        // pick Mon-Fri in order
        const WEEKDAYS = ["Mon","Tue","Wed","Thu","Fri"];
        const finalTrend = WEEKDAYS.map((wd) => ({
          day: wd,
          present: trendMap[wd]?.present ?? 0,
          absent: trendMap[wd]?.absent ?? 0,
          late: trendMap[wd]?.late ?? 0,
        }));

        // 4) department data: aggregate present counts per department for today (from presentRecords)
        const deptMap = {};
        presentRecords.forEach((r) => {
          const u = r.userId || {};
          const dept = u.department || "Other";
          deptMap[dept] = (deptMap[dept] || 0) + 1;
        });
        const deptDataArr = Object.keys(deptMap).map((k) => ({ dept: k, present: deptMap[k] }));

        // Setup final state
        setStats({
          totalEmployees: totalEmployees,
          presentToday: presentToday,
          absentToday: (allEmployees.length ? allEmployees.length - presentToday : dashRes?.data?.totalEmployees - presentToday) || 0,
          lateToday: presentRecords.filter(r => (r.status || '').toLowerCase() === 'late').length || 0,
        });

        setWeeklyTrend(finalTrend.length ? finalTrend : weeklyFallback());
        setDepartmentData(deptDataArr.length ? deptDataArr : departmentFallback());
        setAbsentListToday(absentees.length ? absentees : absentFallback());
      } catch (err) {
        console.error("Manager dashboard fetch failed:", err?.response?.data || err.message);
        // fallback to existing dummy data
        setStats({
          totalEmployees: 25,
          presentToday: 20,
          absentToday: 3,
          lateToday: 2,
        });
        setWeeklyTrend([
          { day: "Mon", present: 21, absent: 2, late: 2 },
          { day: "Tue", present: 22, absent: 1, late: 2 },
          { day: "Wed", present: 19, absent: 4, late: 2 },
          { day: "Thu", present: 20, absent: 3, late: 2 },
          { day: "Fri", present: 23, absent: 1, late: 1 },
        ]);
        setDepartmentData([
          { dept: "HR", present: 8 },
          { dept: "IT", present: 12 },
          { dept: "Finance", present: 5 },
        ]);
        setAbsentListToday([
          { name: "John Doe", dept: "Finance" },
          { name: "Priya Sharma", dept: "HR" },
          { name: "Amit Verma", dept: "IT" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    // helper fallbacks
    function weeklyFallback() {
      return [
        { day: "Mon", present: 21, absent: 2, late: 2 },
        { day: "Tue", present: 22, absent: 1, late: 2 },
        { day: "Wed", present: 19, absent: 4, late: 2 },
        { day: "Thu", present: 20, absent: 3, late: 2 },
        { day: "Fri", present: 23, absent: 1, late: 1 },
      ];
    }
    function departmentFallback() {
      return [
        { dept: "HR", present: 8 },
        { dept: "IT", present: 12 },
        { dept: "Finance", present: 5 },
      ];
    }
    function absentFallback() {
      return [
        { name: "John Doe", dept: "Finance" },
        { name: "Priya Sharma", dept: "HR" },
        { name: "Amit Verma", dept: "IT" },
      ];
    }
  }, []);

  return (
    <div className="flex">
      <Sidebar1 />

      <div className="flex-1 bg-purple-100 ml-64 min-h-screen">
        <Topbar1 />

        <div className="p-8 space-y-10">
          {/* PAGE HEADER */}
          <PageHeader
            title={`Welcome, ${user?.name || user?.email} 👋`}
            subtitle="Manager overview of employee attendance system"
          />

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard label="Total Employees" value={stats.totalEmployees} color="text-purple-600" />
            <StatCard label="Present Today" value={stats.presentToday} color="text-green-600" />
            <StatCard label="Absent Today" value={stats.absentToday} color="text-red-600" />
            <StatCard label="Late Arrivals" value={stats.lateToday} color="text-yellow-500" />
          </div>

          {/* WEEKLY TREND CHART */}
          <div className="bg-white rounded-2xl shadow-xl border border-purple-200 p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">Weekly Attendance Trend</h2>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={3} />
                  <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={3} />
                  <Line type="monotone" dataKey="late" stroke="#eab308" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DEPARTMENTWISE CHART */}
          <div className="bg-white rounded-2xl shadow-xl border border-purple-200 p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
              Department-Wise Attendance (Today)
            </h2>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dept" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#7c3aed" barSize={55} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ABSENT LIST TODAY */}
          <div className="bg-white rounded-2xl shadow-xl border border-purple-200 p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">Absent Employees Today</h2>

            {absentListToday.length === 0 ? (
              <p className="text-center text-gray-600 text-lg">🎉 No absentees today!</p>
            ) : (
              <ul className="space-y-3">
                {absentListToday.map((emp, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-purple-50 px-6 py-3 rounded-lg shadow-sm hover:bg-purple-100 transition"
                  >
                    <span className="font-semibold text-gray-900">{emp.name}</span>
                    <span className="text-purple-700 font-semibold">{emp.dept}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
