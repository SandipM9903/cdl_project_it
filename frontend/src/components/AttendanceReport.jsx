import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/Config";

const AttendanceReport = () => {
  const [empId, setEmpId] = useState("9085500");
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAttendanceReport = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${BASE_URL}:9025/api/attendance/report`, {
        params: { empId },
      });
      setAttendanceData(response.data);
      
    } catch (err) {
      setError("Failed to fetch attendance report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Attendance Report</h2>

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
          onClick={fetchAttendanceReport}
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Report"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {attendanceData ? (
        <pre className="bg-gray-100 p-3 rounded mt-3">
          {JSON.stringify(attendanceData, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-500 mt-3">No attendance records found.</p>
      )}
    </div>
  );
};

export default AttendanceReport;
