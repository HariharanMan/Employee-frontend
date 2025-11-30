// src/api/employeeApi.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

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

// REGISTER (manager/employee)
export async function register(payload) {
  try {
    const res = await api.post('/auth/register', payload);
    return res.data;
  } catch (e) { handleError(e); }
}

// LOGIN
export async function login(email, password) {
  try {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  } catch (e) { handleError(e); }
}

// ME
export async function me(token) {
  try {
    const res = await api.get('/auth/me', { headers: getAuthHeader(token) });
    return res.data;
  } catch (e) { handleError(e); }
}

/* ---------- EMPLOYEE ATTENDANCE ---------- */

export async function checkIn(token) {
  try {
    const res = await api.post('/attendance/checkin', null, { headers: getAuthHeader(token) });
    return res.data;
  } catch (e) { handleError(e); }
}

export async function checkOut(token) {
  try {
    const res = await api.post('/attendance/checkout', null, { headers: getAuthHeader(token) });
    return res.data;
  } catch (e) { handleError(e); }
}

export async function myHistory({ token, from, to, page = 1, limit = 100 } = {}) {
  try {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    params.page = page;
    params.limit = limit;

    const res = await api.get('/attendance/my-history', { headers: getAuthHeader(token), params });
    return res.data;
  } catch (e) { handleError(e); }
}

export async function mySummary({ token, year, month } = {}) {
  try {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;

    const res = await api.get('/attendance/my-summary', { headers: getAuthHeader(token), params });
    return res.data;
  } catch (e) { handleError(e); }
}

export async function todayStatus({ token } = {}) {
  try {
    const res = await api.get('/attendance/today', { headers: getAuthHeader(token) });
    return res.data;
  } catch (e) { handleError(e); }
}

/* ---------- EMPLOYEE DASHBOARD ---------- */
export async function dashboardEmployee(token) {
  try {
    const res = await api.get('/dashboard/employee', { headers: getAuthHeader(token) });
    return res.data;
  } catch (e) { handleError(e); }
}

export default {
  register,
  login,
  me,
  checkIn,
  checkOut,
  myHistory,
  mySummary,
  todayStatus,
  dashboardEmployee
};
