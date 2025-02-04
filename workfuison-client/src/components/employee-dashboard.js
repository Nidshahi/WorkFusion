import React from 'react';
import { Link, useNavigate ,Outlet} from 'react-router-dom';
import "../stylesheets/employeeDashboard.css";

const EmployeeDashboard = () => {
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
          <Link className="navbar-brand" to="/employee-dashboard">
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
        <div className="vertical-nav ">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link active" to="mytask">
                <i className="bi bi-list-check"></i> My Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="calendar">
                <i className="bi bi-calendar-check-fill"></i> Calendar
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="employee-performance">
                <i className="bi bi-graph-up"></i> Performance
              </Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="video-call">
                <i className="bi bi-camera-video-fill"></i> VideoCall
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="chat">
                <i className="bi bi-chat-left-dots"></i> Chat
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="content">
          <Outlet/>
          {/* Add your task list or content here */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
