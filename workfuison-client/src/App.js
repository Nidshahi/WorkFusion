import React from 'react';
import { Navigate, BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Login from '../src/components/login';
import Register from '../src/components/register';
import Home from '../src/components/home';
import ManagerDashboard from '../src/components/manager-dashboard';
import EmployeeDashboard from '../src/components/employee-dashboard';
import Report from './components/Reports';
import VideoCall from './components/VideoCall';
import Chat from './components/Chat';
import EmployeePerformance from './components/EmployeePerformance';
import MyCalendar from './components/Calendar';
import AssignTasks from './components/AssignTasks';
import MakeGroup from './components/assigntask/makegroup';
import AddEmployee from './components/assigntask/Addemp';
import GData from './components/assigntask/gData';
import MyTask from './components/assigntask/mytask';

const App = () => {
  const isAuthenticated = localStorage.getItem('token') !== null; // Check if token exists
  const role = localStorage.getItem('role'); // Get role from localStorage

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login/register" element={<Register />} />
        
        {/* Employee Dashboard */}
        <Route
  path="/employee-dashboard"
  element={
    isAuthenticated && role === 'employee' ? (
      <EmployeeDashboard />
    ) : (
      <Navigate to="/login" />
    )
  }
>
  {/* Nested Routes for the Employee Dashboard */}
  <Route path="calendar" element={<MyCalendar />} />
  <Route path="employee-performance" element={<EmployeePerformance />} />
  <Route path="video-call" element={<VideoCall />} />
  <Route path="chat" element={<Chat />} />
  <Route path="mytask" element={<MyTask />} />
</Route>

        {/* Manager Dashboard */}
        <Route
          path="/manager-dashboard"
          element={
            isAuthenticated && role === 'manager' ? (
              <ManagerDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="make-group" element={<MakeGroup />} />
          <Route path="view-reports" element={<Report />} />
          <Route path="assign-tasks" element={<AssignTasks />} />
          <Route path="members" element={<GData />} />
          <Route path="calendar" element={<MyCalendar />} />
          <Route path="employee-performance" element={<EmployeePerformance />} />
          <Route path="video-call" element={<VideoCall />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default App;
