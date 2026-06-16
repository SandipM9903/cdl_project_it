import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/Config";

const LeaveBalanceReport = () => {
  const [empId, setEmpId] = useState("9085119");
  const [leaveBalanceData, setLeaveBalanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLeaveBalanceReport = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${BASE_URL}:9025/api/leave-balance/report`, {
        params: { empId },
      });
      setLeaveBalanceData(response.data);
    } catch (err) {
      setError("Failed to fetch leave balance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Leave Balance Report</h2>

      <div className="space-y-3">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Employee ID"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded"
          onClick={fetchLeaveBalanceReport}
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Report"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {leaveBalanceData ? (
        <pre className="bg-gray-100 p-3 rounded mt-3">
          {JSON.stringify(leaveBalanceData, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-500 mt-3">No leave balance records found.</p>
      )}
    </div>
  );
};

export default LeaveBalanceReport;













