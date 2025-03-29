import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setTokens } from "../auth";
import "./Register.css";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/auth/register", {
                username,
                password,
                email,
            });
            setTokens(response.data.accessToken, response.data.refreshToken);
            navigate("/rules");
        } catch (err) {
            setError(err.response?.data.message || "Registration failed");
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Register</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Register</button>
            </form>
        </div>
    );
}

export default Register;