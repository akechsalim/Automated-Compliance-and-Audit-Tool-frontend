import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getAccessToken } from "../auth";
import "./RuleForm.css";

function RuleForm() {
    const [rule, setRule] = useState({ name: "", description: "", category: "", severity: "LOW", active: true });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchRule = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/rules/${id}`, {
                        headers: { Authorization: getAccessToken() },
                    });
                    setRule(response.data);
                } catch (err) {
                    setError("Failed to fetch rule: " + err.message);
                }
            };
            fetchRule();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = id ? `http://localhost:8080/api/rules/${id}` : "http://localhost:8080/api/rules";
            const method = id ? "put" : "post";
            await axios({
                method,
                url,
                data: rule,
                headers: { Authorization: getAccessToken() },
            });
            navigate("/rules");
        } catch (err) {
            setError("Failed to save rule: " + err.response?.data.message || err.message);
        }
    };

    return (
        <div className="rule-form-wrapper">
            <div className="rule-form-container">
                <h2 className="form-title">{id ? "Edit Rule" : "Add New Rule"}</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            value={rule.name}
                            onChange={(e) => setRule({ ...rule, name: e.target.value })}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            value={rule.description}
                            onChange={(e) => setRule({ ...rule, description: e.target.value })}
                            className="form-textarea"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <input
                            type="text"
                            value={rule.category}
                            onChange={(e) => setRule({ ...rule, category: e.target.value })}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Severity</label>
                        <select
                            value={rule.severity}
                            onChange={(e) => setRule({ ...rule, severity: e.target.value })}
                            className="form-select"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>
                    <div className="form-group checkbox-group">
                        <label className="form-label">Active</label>
                        <input
                            type="checkbox"
                            checked={rule.active}
                            onChange={(e) => setRule({ ...rule, active: e.target.checked })}
                            className="form-checkbox"
                        />
                    </div>
                    <button type="submit" className="submit-button">Save</button>
                </form>
            </div>
        </div>
    );
}

export default RuleForm;