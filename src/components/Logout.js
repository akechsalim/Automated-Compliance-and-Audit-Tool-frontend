import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearTokens, getAccessToken } from "../auth";
import "./Logout.css";

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.post("http://localhost:8080/api/auth/logout", {}, {
                    headers: { Authorization: getAccessToken() },
                });
            } catch (err) {
                console.error("Logout failed", err);
            } finally {
                clearTokens();
                navigate("/login");
            }
        };
        logout();
    }, [navigate]);

    return <div className="logout-message">Logging out...</div>;
}

export default Logout;