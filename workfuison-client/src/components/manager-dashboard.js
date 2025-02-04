import React from 'react';
import { Link, useNavigate,Outlet } from 'react-router-dom';
import "../stylesheets/employeeDashboard.css";

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear the token and role
    navigate('/login'); // Redirect to login page
  };
  

  return (
    <div className="employee-dashboard">
      {/* Top Horizontal Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/manager-dashboard">
            <img src="/logo.png" alt="Logo" className="brand-logo" />
            WorkFusion
          </Link>
          <button
            className="btn btn-outline-light"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="d-flex">
        {/* Vertical Sidebar */}
        (
    <div className="vertical-nav">
      <ul className="nav flex-column">
        <li className="nav-item" data-tooltip="Add Employee">
          <Link className="nav-link" to="add-employee">
            <i className="bi bi-person-add"></i>
            <span className="nav-text">Add Employee</span>
          </Link>
        </li>
        <li className="nav-item" data-tooltip="Manage Groups">
          <Link className="nav-link" to="make-group">
            <i className="bi bi-people"></i>
            <span className="nav-text">Manage Groups</span>
          </Link>
        </li>
        <li className="nav-item" data-tooltip="View Reports">
          <Link className="nav-link" to="view-reports">
            <i className="bi bi-bar-chart-fill"></i>
            <span className="nav-text">Reports</span>
          </Link>
        </li>
        <li className="nav-item" data-tooltip="Assign Tasks">
          <Link className="nav-link" to="assign-tasks">
            <i className="bi bi-list-task"></i>
            <span className="nav-text">Assign Tasks</span>
          </Link>
        </li>
        <li className="nav-item" data-tooltip="Calendar">
          <Link className="nav-link" to="calendar">
            <i className="bi bi-calendar-check-fill"></i>
            <span className="nav-text">Calendar</span>
          </Link>
        </li>
        <li className="nav-item" data-tooltip="Employee Performance">
          <Link className="nav-link" to="employee-performance">
            <i className="bi bi-person-lines-fill"></i>
            <span className="nav-text">Employee Performance</span>
          </Link>
        </li>
        <li className="nav-item" data-tooltip="Video Call">
          <Link className="nav-link" to="video-call">
            <i className="bi bi-camera-video-fill"></i>
            <span className="nav-text">Video Call</span>
          </Link>
        </li>
        <li className="nav-item" data-tooltip="Chat">
          <Link className="nav-link" to="chat">
            <i className="bi bi-chat-left-dots"></i>
            <span className="nav-text">Chat</span>
          </Link>
        </li>
      </ul>
    </div>
      {/* Main Content */}
        <div className="content">
        <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
