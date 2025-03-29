import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getAccessToken } from "../auth";
import "./RuleList.css";

function RuleList() {
    const [rules, setRules] = useState([]);
    const [filteredRules, setFilteredRules] = useState([]);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        status: "All",
        category: "All",
        severity: "All",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRules = async () => {
            const token = getAccessToken();
            console.log("Sending Authorization header:", token);
            try {
                const response = await axios.get("http://localhost:8080/api/rules", {
                    headers: { Authorization: token },
                });
                console.log("Rules fetched:", response.data);
                setRules(response.data);
                setFilteredRules(response.data);
            } catch (err) {
                console.error("Fetch error:", err.response);
                setError("Failed to fetch rules: " + (err.response?.status === 403 ? "Forbidden" : err.message));
                if (err.response?.status === 401) navigate("/login");
            }
        };
        fetchRules();
    }, [navigate]);

    const getComplianceStatus = (checks) => {
        if (!checks || checks.length === 0) return "PENDING";
        const latestCheck = checks.reduce((latest, check) =>
            !latest.checkedAt || check.checkedAt > latest.checkedAt ? check : latest);
        return latestCheck.status;
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));

        const filtered = rules.filter((rule) => {
            const status = getComplianceStatus(rule.checks);
            return (
                (filters.status === "All" || status === filters.status) &&
                (filters.category === "All" || rule.category === filters.category) &&
                (filters.severity === "All" || rule.severity === value)
            );
        });
        setFilteredRules(filtered);
    };

    const uniqueCategories = ["All", ...new Set(rules.map((rule) => rule.category))];
    const statuses = ["All", "COMPLIANT", "NON_COMPLIANT", "PENDING"];
    const severities = ["All", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

    return (
        <div className="rule-list-wrapper">
            <div className="rule-list-sidebar">
                <h2 className="sidebar-title">Compliance Dashboard</h2>
                <div className="filter-section">
                    <h3>Filters</h3>
                    <div className="filter-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="filter-select"
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className="filter-select"
                        >
                            {uniqueCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Severity</label>
                        <select
                            name="severity"
                            value={filters.severity}
                            onChange={handleFilterChange}
                            className="filter-select"
                        >
                            {severities.map((sev) => (
                                <option key={sev} value={sev}>
                                    {sev}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="rule-list-main">
                <div className="rule-list-header">
                    <h1>Compliance Rules</h1>
                    <Link to="/rules/new" className="add-rule-btn">+ New Rule</Link>
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="rule-table-container">
                    <table className="rule-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRules.map((rule) => (
                            <tr key={rule.id}>
                                <td>{rule.name}</td>
                                <td>{rule.description}</td>
                                <td>{rule.category}</td>
                                <td className={`severity-${rule.severity.toLowerCase()}`}>
                                    {rule.severity}
                                </td>
                                <td className={`status-${getComplianceStatus(rule.checks).toLowerCase()}`}>
                                    {getComplianceStatus(rule.checks)}
                                </td>
                                <td>{rule.active ? "Yes" : "No"}</td>
                                <td>
                                    <Link to={`/rules/edit/${rule.id}`} className="action-btn edit-btn">Edit</Link>
                                    <Link to={`/checks/rule/${rule.id}`} className="action-btn check-btn">Checks</Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default RuleList;