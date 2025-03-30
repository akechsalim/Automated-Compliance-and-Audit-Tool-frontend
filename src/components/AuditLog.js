import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../auth";
import "./AuditLog.css";

function AuditLog() {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLogs = async () => {
            const token = getAccessToken();
            try {
                const response = await axios.get("http://localhost:8080/api/audit-logs", {
                    headers: { Authorization: token },
                });
                setLogs(response.data);
            } catch (err) {
                setError("Failed to fetch audit logs: " + (err.response?.status === 401 ? "Unauthorized" : err.message));
                if (err.response?.status === 401) navigate("/login");
            }
        };
        fetchLogs();
    }, [navigate]);

    if (!logs.length && !error) return <div className="loading">Loading...</div>;

    return (
        <div className="audit-log-wrapper">
            <div className="audit-log-container">
                <h1 className="audit-log-title">Audit Logs</h1>
                {error && <div className="error-message">{error}</div>}
                <div className="logs-table-container">
                    <table className="logs-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Action</th>
                            <th>Details</th>
                            <th>Timestamp</th>
                            <th>IP Address</th>
                        </tr>
                        </thead>
                        <tbody>
                        {logs.map((log) => (
                            <tr key={log.id}>
                                <td>{log.id}</td>
                                <td>{log.username}</td>
                                <td>{log.action}</td>
                                <td>{log.details}</td>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.ipAddress}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AuditLog;