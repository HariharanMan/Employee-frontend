import { createSlice } from "@reduxjs/toolkit";

// Demo data shaped similar to schema
const demoEmployees = [
  {
    id: "emp1",
    name: "Alice Johnson",
    email: "alice@company.com",
    role: "employee",
    employeeId: "EMP001",
    department: "Engineering",
    createdAt: "2025-10-01",
  },
  {
    id: "emp2",
    name: "Bob Smith",
    email: "bob@company.com",
    role: "employee",
    employeeId: "EMP002",
    department: "Sales",
    createdAt: "2025-09-12",
  },
  {
    id: "emp3",
    name: "Carol Lee",
    email: "carol@company.com",
    role: "employee",
    employeeId: "EMP003",
    department: "HR",
    createdAt: "2025-08-20",
  },
];

const demoAttendance = [
  {
    id: "a1",
    userId: "emp1",
    date: "2025-11-25",
    checkInTime: "09:05",
    checkOutTime: "17:10",
    status: "present",
    totalHours: 8,
    createdAt: "2025-11-25T09:05:00",
  },
  {
    id: "a2",
    userId: "emp1",
    date: "2025-11-24",
    checkInTime: "09:20",
    checkOutTime: "17:00",
    status: "late",
    totalHours: 7.5,
    createdAt: "2025-11-24T09:20:00",
  },
  {
    id: "a3",
    userId: "emp1",
    date: "2025-11-23",
    checkInTime: null,
    checkOutTime: null,
    status: "absent",
    totalHours: 0,
    createdAt: "2025-11-23T00:00:00",
  },
  {
    id: "a4",
    userId: "emp2",
    date: "2025-11-25",
    checkInTime: "09:10",
    checkOutTime: "17:15",
    status: "present",
    totalHours: 8,
    createdAt: "2025-11-25T09:10:00",
  },
  {
    id: "a5",
    userId: "emp3",
    date: "2025-11-25",
    checkInTime: null,
    checkOutTime: null,
    status: "absent",
    totalHours: 0,
    createdAt: "2025-11-25T00:00:00",
  },
];

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    employees: demoEmployees,
    records: demoAttendance,
    todayStatus: "not-checked-in",
  },
  reducers: {
    checkIn: (state) => {
      state.todayStatus = "checked-in";
      // For demo, not modifying records list
    },
    checkOut: (state) => {
      state.todayStatus = "checked-out";
    },
  },
});

export const { checkIn, checkOut } = attendanceSlice.actions;
export default attendanceSlice.reducer;
