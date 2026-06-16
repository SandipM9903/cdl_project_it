import React, { useEffect, useState } from "react";

import axios from "axios";
import { BASE_URL } from "../config/Config";

const FetchDataComponent = () => {
 
      const [empId, setEmpId] = useState("9085500");
      const [fromDate, setFromDate] = useState("2023-01-01");
      const [toDate, setToDate] = useState("2025-12-01");
      const [leaveData, setLeaveData] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");
    
      const fetchLeaveReport = async () => {
        setLoading(true);
        setError("");
        try {
          const response = await axios.get(`${BASE_URL}:9025/leave-report`, {
            params: { empId, fromDate, toDate },
          });
          setLeaveData(response.data);
        } catch (err) {
          setError("Failed to fetch leave report.");
        } finally {
          setLoading(false);
        }
      };
    
      return (
        <div className="max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-4">Leave Report</h2>
    
          <div className="space-y-3">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Employee ID"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
            />
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white p-2 rounded"
              onClick={fetchLeaveReport}
              disabled={loading}
            >
              {loading ? "Loading..." : "Fetch Report"}
            </button>
          </div>
    
          {error && <p className="text-red-500 mt-3">{error}</p>}
    
          {leaveData && leaveData.payload?.data?.length > 0 ? (
            <div className="mt-5">
              <h3 className="text-lg font-semibold">Leave Details:</h3>
              <table className="w-full border-collapse border mt-2">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Leave Type</th>
                    <th className="border p-2">From</th>
                    <th className="border p-2">To</th>
                    <th className="border p-2">Days</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveData.payload.data.map((leave) => (
                    <tr key={leave.id} className="text-center">
                      <td className="border p-2">{leave.leave_type}</td>
                      <td className="border p-2">{leave.from}</td>
                      <td className="border p-2">{leave.to}</td>
                      <td className="border p-2">{leave.days}</td>
                      <td className="border p-2">{leave.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            leaveData && <p className="text-gray-500 mt-3">No leave records found.</p>
          )}
        </div>
      );
    };
    

    
export default FetchDataComponent;
