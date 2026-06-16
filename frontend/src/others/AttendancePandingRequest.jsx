import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
// Removed: import "react-toastify/dist/ReactToastify.css"; 
// This CSS import should be handled globally, e.g., in your public/index.html
// or through a global CSS file that your build system processes.
import { BASE_URL } from "../config/Config";
import { Calendar, Clock, User, Tag, ArrowRight } from 'lucide-react'; // Import new icons
import Header from "../components/Header";

const AttendancePendingRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Define API endpoints
  const LEAVE_REPORT_API = `http://43.20524.208:9050/api/leave-pending/report`;
  const ATTENDANCE_REPORT_API = `http://43.20524.208:9050/api/attendance-pending/report`;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const myEmpCode = String(localStorage.getItem("empId") || "").trim();

      if (!myEmpCode) {
        console.warn("Employee ID not found in localStorage. Cannot fetch requests.");
        toast.warn("Employee ID not found. Cannot fetch approval requests.");
        setIsLoading(false);
        return;
      }

      // --- Fetch Leave Requests ---
      const leaveFormData = new URLSearchParams();
      leaveFormData.append("managerCode", myEmpCode); 

      const leaveRes = await axios.post(LEAVE_REPORT_API, leaveFormData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).catch((error) => {
        console.error("Error fetching leave requests:", error);
        return null;
      });

      if (leaveRes?.data?.payload?.data) { 
        const leaveData = Array.isArray(leaveRes.data.payload.data) ? leaveRes.data.payload.data : [];
        setLeaveRequests(leaveData);
      } else {
        setLeaveRequests([]);
        console.log("No leave data found or data structure is unexpected:", leaveRes?.data);
      }

      // --- Fetch Attendance Requests ---
      const attendanceFormData = new URLSearchParams();
      attendanceFormData.append("managerEmpCode", myEmpCode); 

      const attendanceRes = await axios.post(ATTENDANCE_REPORT_API, attendanceFormData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).catch((error) => {
        console.error("Error fetching attendance requests:", error);
        return null;
      });

      if (attendanceRes?.data?.payload?.data) { 
        const attendanceData = Array.isArray(attendanceRes.data.payload.data) ? attendanceRes.data.payload.data : [];
        setAttendanceRequests(attendanceData);
      } else {
        setAttendanceRequests([]);
        console.log("No attendance data found or data structure is unexpected:", attendanceRes?.data);
      }

    } catch (error) {
      console.error("Error fetching approval requests:", error);
      toast.error("Error fetching approval requests.");
      setLeaveRequests([]);
      setAttendanceRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const Card = ({ data, type }) => {
    const handleViewClick = () => {
      window.open("https://cms.uknowva.com/my-team/my-teams-attendance", "_blank");
    };

    // Helper function to format date/time
    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return 'N/A';
      try {
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) { // Check for invalid date
          return dateTimeString; // Return original if invalid but not null/undefined
        }
        return date.toLocaleString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch (e) {
        console.error("Error formatting date:", e);
        return dateTimeString;
      }
    };

    // Helper function to format date only
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) { // Check for invalid date
          return dateString; // Return original if invalid but not null/undefined
        }
        return date.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (e) {
        console.error("Error formatting date:", e);
        return dateString;
      }
    };

    return (
      // Card container: w-full for horizontal length, flex-col for stacking content
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-200 flex flex-col justify-between w-full">
       
        {/* Main content area, using a responsive grid for distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-3 mb-4 mt-20">
          {/* Name and Employee Code - span full width on small, then distribute */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center font-content">
              <User size={20} className="mr-2 text-blue-600" />
              {data?.name || 'N/A'}
            </h3>
            <p className="text-xs text-gray-600 flex items-center font-content">
              <Tag size={16} className="mr-2 text-purple-500" />
              Employee Code: <strong className="ml-1 text-gray-800">{data?.username || 'N/A'}</strong>
            </p>
          </div>

          {/* Request Type - span full width on small, then distribute */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-1 flex items-center">
            <p className="text-sm text-gray-700 font-medium flex items-center font-content">
              <ArrowRight size={16} className="mr-2 text-green-500" />
              Type: <span className="ml-1 font-semibold text-blue-700">{type} Request</span>
            </p>
          </div>
          
          {type === "Leave" && (
            <>
              {/* Leave specific details - distributed across columns */}
              <div className="col-span-1 md:col-span-1 flex items-center">
                <p className="flex items-center text-gray-700 font-content">
                  <Calendar size={16} className="mr-2 text-red-500" />
                  Start: <span className="ml-1 font-medium">{formatDateTime(data?.start_time)}</span>
                </p>
              </div>
              <div className="col-span-1 md:col-span-1 flex items-center">
                <p className="flex items-center text-gray-700 font-content">
                  <Calendar size={16} className="mr-2 text-red-500" />
                  End: <span className="ml-1 font-medium">{formatDateTime(data?.end_time)}</span>
                </p>
              </div>
              {data?.reason && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-start"> {/* Reason spans wider */}
                  <p className="flex items-start text-gray-700 font-content">
                    <span className="text-xs text-gray-600 mr-2">Reason:</span>
                    <span className="text-xs font-medium text-gray-800 flex-1 line-clamp-2">{data.reason}</span>
                  </p>
                </div>
              )}
            </>
          )}

          {type === "Attendance" && (
            <>
              {/* Attendance specific details - distributed across columns */}
              <div className="col-span-1 md:col-span-1 flex items-center">
                <p className="flex items-center text-gray-700 font-content">
                  <Calendar size={16} className="mr-2 text-orange-500 text-sm" />
                  Date: <span className="ml-1 text-sm">{formatDate(data?.for_date)}</span>
                </p>
              </div>
              <div className="col-span-1 md:col-span-1 flex items-center">
                <p className="flex items-center text-gray-700 font-content">
                  <Clock size={16} className="mr-2 text-teal-500 text-sm" />
                  Punch In: <span className="ml-1 text-sm">{data?.start_time || 'N/A'}</span>
                </p>
              </div>
              <div className="col-span-1 md:col-span-1 flex items-center">
                <p className="flex items-center text-gray-700 font-content">
                  <Clock size={16} className="mr-2 text-teal-500 text-sm" />
                  Punch Out: <span className="ml-1 text-sm">{data?.end_time || 'N/A'}</span>
                </p>
              </div>
              {data?.attendance_type && (
                <div className="col-span-1 md:col-span-1 flex items-center">
                  <p className="flex items-center text-gray-700 font-content">
                    <Tag size={16} className="mr-2 text-blue-500 text-sm" />
                    Attendance Type: <span className="ml-1 text-sm">{data.attendance_type}</span>
                  </p>
                </div>
              )}
              {data?.reason && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-start"> {/* Reason spans wider */}
                  <p className="flex items-start text-gray-700 font-content">
                    <span className="text-xs text-gray-600 mr-2">Reason:</span>
                    <span className="text-xs font-medium text-gray-800 flex-1 line-clamp-2">{data.reason}</span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* View Details Button */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
          <button
            onClick={handleViewClick}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 px-8 rounded-full text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <><Header /><div className="p-6 bg-gray-50 min-h-screen mt-20">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Approval Dashboard</h2>

      {isLoading ? (
        <div className="text-center text-gray-500 text-lg py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          Loading pending requests...
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Pending Leave Requests</h3>
            <div className="flex flex-col gap-6 mb-10">
              {Array.isArray(leaveRequests) && leaveRequests.length > 0 ? (
                leaveRequests.map((req) => (
                  <Card key={req?.id || Math.random()} data={req} type="Leave" />
                ))
              ) : (
                <p className="text-gray-500 text-center w-full font-content">No pending leave requests.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Pending Attendance Requests</h3>
            <div className="flex flex-col gap-6">
              {Array.isArray(attendanceRequests) && attendanceRequests.length > 0 ? (
                attendanceRequests.map((req) => (
                  <Card key={req?.id || Math.random()} data={req} type="Attendance" />
                ))
              ) : (
                <p className="text-gray-500 text-center w-full font-content">No pending attendance requests.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div></>
  );
};

export default AttendancePendingRequests;