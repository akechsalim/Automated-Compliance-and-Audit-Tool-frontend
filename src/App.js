import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import RuleList from "./components/RuleList";
import RuleForm from "./components/RuleForm";
import ComplianceCheckForm from "./components/ComplianceCheckForm";
import Reports from "./components/Reports";
import AuditLog from "./components/AuditLog";

function App() {
  return (
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="*"
                element={
                  <>
                    <Navbar />
                    <Routes>
                      <Route path="/rules" element={<RuleList />} />
                      <Route path="/rules/new" element={<RuleForm />} />
                      <Route path="/rules/edit/:id" element={<RuleForm />} />
                      <Route path="/checks/rule/:ruleId" element={<ComplianceCheckForm />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/audit-logs" element={<AuditLog />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/logout" element={<Logout />} />
                      <Route path="/" element={<h1>Welcome to Compliance Tool</h1>} />
                    </Routes>
                  </>
                }
            />
          </Routes>
        </div>
      </Router>
  );
}

export default App;



