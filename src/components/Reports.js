import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../auth";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "./Reports.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Reports() {
    const [report, setReport] = useState(null);
    const [error, setError] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isPolling, setIsPolling] = useState(true); // Polling enabled by default
    const navigate = useNavigate();

    const fetchReport = async () => {
        const token = getAccessToken();
        try {
            const params = {};
            if (startDate) params.startDate = startDate.toISOString();
            if (endDate) params.endDate = endDate.toISOString();
            const response = await axios.get("http://localhost:8080/api/reports", {
                headers: { Authorization: token },
                params,
            });
            setReport(response.data);
            setError(""); // Clear any previous errors
        } catch (err) {
            setError("Failed to fetch report: " + (err.response?.status === 401 ? "Unauthorized" : err.message));
            if (err.response?.status === 401) navigate("/login");
        }
    };

    useEffect(() => {
        fetchReport(); // Initial fetch
        let intervalId;

        if (isPolling) {
            intervalId = setInterval(fetchReport, 30000); // Poll every 30 seconds
        }

        return () => {
            if (intervalId) clearInterval(intervalId); // Cleanup on unmount or polling toggle
        };
    }, [navigate, isPolling, startDate, endDate]); // Re-run if polling or filters change

    const handleFilter = () => {
        fetchReport();
    };

    const togglePolling = () => {
        setIsPolling((prev) => !prev);
    };

    if (!report) return <div className="loading">Loading...</div>;

    const statusChartData = {
        labels: Object.keys(report.statusSummary),
        datasets: [{
            label: "Rules by Status",
            data: Object.values(report.statusSummary),
            backgroundColor: ["#34c759", "#ff3b30", "#666"],
            borderRadius: 8,
        }],
    };

    const categoryChartData = {
        labels: Object.keys(report.categorySummary),
        datasets: [{
            label: "Rules by Category",
            data: Object.values(report.categorySummary),
            backgroundColor: "#007aff",
            borderRadius: 8,
        }],
    };

    const severityChartData = {
        labels: Object.keys(report.severitySummary),
        datasets: [{
            label: "Rules by Severity",
            data: Object.values(report.severitySummary),
            backgroundColor: ["#34c759", "#ff9500", "#ff3b30", "#ff2d55"],
            borderRadius: 8,
        }],
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { position: "top" }, title: { display: true } },
    };

    return (
        <div className="reports-wrapper">
            <div className="reports-container">
                <h1 className="reports-title">Compliance Report</h1>
                {error && <div className="error-message">{error}</div>}
                <div className="filter-section">
                    <div className="filter-group">
                        <label>Start Date</label>
                        <DatePicker
                            value={startDate}
                            onChange={setStartDate}
                            className="date-picker"
                            calendarClassName="date-picker-calendar"
                        />
                    </div>
                    <div className="filter-group">
                        <label>End Date</label>
                        <DatePicker
                            value={endDate}
                            onChange={setEndDate}
                            className="date-picker"
                            calendarClassName="date-picker-calendar"
                        />
                    </div>
                    <button onClick={handleFilter} className="filter-button">Apply Filters</button>
                    <div className="polling-toggle">
                        <label>Auto-Refresh</label>
                        <input
                            type="checkbox"
                            checked={isPolling}
                            onChange={togglePolling}
                            className="polling-checkbox"
                        />
                    </div>
                </div>
                <div className="summary-section">
                    <p>Total Rules: {report.totalRules}</p>
                    <p>Total Checks: {report.totalChecks}</p>
                    <p>Last Updated: {new Date(report.lastUpdated).toLocaleString()}</p>
                </div>
                <div className="charts-section">
                    <div className="chart-container">
                        <Bar
                            data={statusChartData}
                            options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: "Status Distribution" } } }}
                        />
                    </div>
                    <div className="chart-container">
                        <Bar
                            data={categoryChartData}
                            options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: "Category Distribution" } } }}
                        />
                    </div>
                    <div className="chart-container">
                        <Bar
                            data={severityChartData}
                            options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: "Severity Distribution" } } }}
                        />
                    </div>
                </div>
                <div className="details-section">
                    <h2 className="details-title">Detailed Rules</h2>
                    <div className="details-table-container">
                        <table className="details-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Severity</th>
                                <th>Status</th>
                                <th>Last Checked</th>
                            </tr>
                            </thead>
                            <tbody>
                            {report.detailedRules && report.detailedRules.map((rule) => (
                                <tr key={rule.id}>
                                    <td>{rule.id}</td>
                                    <td>{rule.name}</td>
                                    <td>{rule.category}</td>
                                    <td className={`severity-${rule.severity.toLowerCase()}`}>{rule.severity}</td>
                                    <td className={`status-${rule.status.toLowerCase()}`}>{rule.status}</td>
                                    <td>{rule.lastChecked ? new Date(rule.lastChecked).toLocaleString() : "N/A"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reports;