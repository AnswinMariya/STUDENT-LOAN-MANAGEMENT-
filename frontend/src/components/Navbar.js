import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">🎓 Student Loan Tracker</div>

      <div className="navbar-links">
        <NavLink to="/dashboard" className="nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/loans" className="nav-link">
          Loans
        </NavLink>
        <NavLink to="/payments" className="nav-link">
          Payments
        </NavLink>
        <NavLink to="/profile" className="nav-link">
          Profile
        </NavLink>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
