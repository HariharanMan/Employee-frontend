// src/api/managerApi.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE || 'https://employee-attendance-system-backend-zcs2.onrender.com';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

function getAuthHeader(token) {
  const t = token || localStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function handleError(err) {
  if (err.response?.data) throw err.response.data;
  throw { message: err.message || 'Network error' };
}

/* ---------- AUTH ---------- */

// REGISTER (useful only for initial manager creation)
export async function register(payload) {
  try {
    const res = await api.post('/auth/register', payload);
    return res.data;
  } catch (e) { handleError(e); }
}

export async function login(email, password) {
  try {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  } catch (e) { handleError(e); }
}

export async function me(token) {
  try {
    const res = await api.get('/auth/me', { headers: getAuthHeader(token) });
    return res.data;
  } catch (e) { handleError(e); }
}

/* ---------- MANAGER ACTIONS ---------- */

// create employee
export async function createEmployee(payload, token) {
  try {
    const res = await api.post('/attendance/employee', payload, { headers: getAuthHeader(token) });
    return res.data;
  } catch (e) { handleError(e); }
}

// all attendance
export async function getAllAttendance({ token, date, page = 1, limit = 200 } = {}) {
  try {
    const params = { page, limit };
    if (date) params.date = date;

    const res = await api.get('/attendance/all', { headers: getAuthHeader(token), params });
    return res.data;
  } catch (e) { handleError(e); }
}

// specific employee attendance
export async function getAttendanceByEmployee({ token, id, from, to, page = 1, limit = 200 }) {
  try {
    const params = { page, limit };
    if (from) params.from = from;
    if (to) params.to = to;

    const res = await api.get(`/attendance/employee/${id}`, { headers: getAuthHeader(token), params });
    return res.data;
  } catch (e) { handleError(e); }
}

// team summary
export async function teamSummary({ token, year, month } = {}) {
  try {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;

    const res = await api.get('/attendance/summary', { headers: getAuthHeader(token), params });
    return res.data;
  } catch (e) { handleError(e); }
}

// export CSV
export async function exportCSV({ token, from, to } = {}) {
  try {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;

    const res = await api.get('/attendance/export', {
      headers: { ...getAuthHeader(token), Accept: 'text/csv' },
      params,
      responseType: 'text'
    });

    return res.data;
  } catch (e) { handleError(e); }
}

// today status (who is present today)
export async function todayStatusAll({ token } = {}) {
  try {
    const res = await api.get('/attendance/today-status', { headers: getAuthHeader(token) });
    return res.data;
  } catch (e) { handleError(e); }
}

/* ---------- MANAGER DASHBOARD ---------- */
export async function dashboardManager(token) {
  try {
    const res = await api.get('/dashboard/manager', { headers: getAuthHeader(token) });
    return res.data;
  } catch (e) { handleError(e); }
}

export default {
  register,
  login,
  me,
  createEmployee,
  getAllAttendance,
  getAttendanceByEmployee,
  teamSummary,
  exportCSV,
  todayStatusAll,
  dashboardManager
};
