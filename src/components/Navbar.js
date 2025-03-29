import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearTokens } from "../auth";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearTokens();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/rules" className="navbar-logo">Compliance Tool</Link>
            </div>
            <div className="navbar-links">
                <Link to="/rules" className="navbar-link">Rules</Link>
                {/* Add more check-related pages later if needed */}
                <button onClick={handleLogout} className="navbar-btn logout-btn">Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;