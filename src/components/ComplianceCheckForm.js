import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getAccessToken } from "../auth";
import "./ComplianceCheckForm.css";

function ComplianceCheckForm() {
    const [check, setCheck] = useState({ description: "", status: "PENDING" });
    const [error, setError] = useState("");
    const [checks, setChecks] = useState([]);
    const navigate = useNavigate();
    const { ruleId } = useParams();

    useEffect(() => {
        const fetchChecks = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/checks/rule/${ruleId}`, {
                    headers: { Authorization: getAccessToken() },
                });
                setChecks(response.data);
            } catch (err) {
                setError("Failed to fetch checks: " + err.message);
            }
        };
        fetchChecks();
    }, [ruleId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/api/checks/rule/${ruleId}`, check, {
                headers: { Authorization: getAccessToken() },
            });
            setCheck({ description: "", status: "PENDING" });
            const response = await axios.get(`http://localhost:8080/api/checks/rule/${ruleId}`, {
                headers: { Authorization: getAccessToken() },
            });
            setChecks(response.data);
        } catch (err) {
            setError("Failed to save check: " + err.message);
        }
    };

    return (
        <div className="check-form-wrapper">
            <div className="check-form-container">
                <h2 className="form-title">Compliance Checks for Rule #{ruleId}</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            value={check.description}
                            onChange={(e) => setCheck({ ...check, description: e.target.value })}
                            className="form-textarea"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                            value={check.status}
                            onChange={(e) => setCheck({ ...check, status: e.target.value })}
                            className="form-select"
                        >
                            <option value="PENDING">Pending</option>
                            <option value="COMPLIANT">Compliant</option>
                            <option value="NON_COMPLIANT">Non-Compliant</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-button">Add Check</button>
                </form>
                <h3 className="checks-title">Existing Checks</h3>
                <div className="checks-table-container">
                    <table className="checks-table">
                        <thead>
                        <tr>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Checked At</th>
                        </tr>
                        </thead>
                        <tbody>
                        {checks.map((c) => (
                            <tr key={c.id}>
                                <td>{c.description}</td>
                                <td className={`status-${c.status.toLowerCase()}`}>{c.status}</td>
                                <td>{c.checkedAt}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={() => navigate("/rules")} className="back-button">Back to Rules</button>
            </div>
        </div>
    );
}

export default ComplianceCheckForm;