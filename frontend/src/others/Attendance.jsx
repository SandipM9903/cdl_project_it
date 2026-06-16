import React, { useState, useEffect } from 'react'
import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  subMonths,
  addMonths,
} from "date-fns";
import { useNavigate } from "react-router";
import Header from '../components/Header';
import { BASE_URL } from '../config/Config';

export const Attendance = () => {

  const [attendanceData, setAttendanceData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const [leaveBalanceData, setLeaveBalanceData] = useState([]);
 useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

  useEffect(() => {
    const fetchLeaveBalanceReport = async () => {
      if (!empId) return;
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${BASE_URL}:9025/api/leave-balance/report`,
          { params: { empId } }
        );

        console.log("Full API Response:", response.data);
        console.log("Extracted Data:", response.data?.payload?.data);

        // Extract leave balance array correctly and exclude Adoption Leave
        const data = response.data?.payload?.data || [];
        const filteredData = data.filter((item) => item.leave_type !== "Adoption Leave");

        if (filteredData.length > 0) {
          setLeaveBalanceData(filteredData);
        } else {
          setError("No leave balance available");
        }
      } catch (err) {
        setError("Failed to fetch leave balance.");
        console.error("Error fetching leave balance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveBalanceReport();
  }, [empId]);


  const [fromDate, setFromDate] = useState("2023-01-01");
  const [toDate, setToDate] = useState("2025-12-01");
  const [leaveData, setLeaveData] = useState([]);


  useEffect(() => {
    const fetchLeaveReport = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${BASE_URL}:9025/leave-report`, {
          params: { empId, fromDate, toDate },
        });

        console.log("Leave Report API Response:", response.data);

        if (response.data?.payload?.data) {
          setLeaveData(response.data.payload.data);
        } else {
          setError("No leave history found.");
        }
      } catch (err) {
        setError("Failed to fetch leave report.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveReport();
  }, [empId, fromDate, toDate]);


  const statusStyles = {
    Approved: "bg-green-500 text-white",
    Pending: "bg-yellow-400 text-black",
    Declined: "bg-red-500 text-white",
  };
  useEffect(() => {
    fetchAttendance();
  }, [currentMonth]);

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${BASE_URL}:9025/api/attendance/report`,
        { params: { empId } }
      );

      console.log("Fetched Data:", response.data);

      const records = response.data.payload?.data || [];

      const mappedData = records.reduce((acc, item) => {
        if (item["Emp ID"] === empId) {
          // Convert "dd-MM-yyyy" to "yyyy-MM-dd"
          const [day, month, year] = item.for_date.split("-");
          const formattedDate = `${year}-${month}-${day}`;

          acc[formattedDate] = {
            status: item.description?.toLowerCase() || "weekly-off",
            hoursWorked: item["Total Hours"] === "NA" ? 0 : parseFloat(item["Total Hours"]),
            inTime: item.start_time && item.start_time !== "NA" ? item.start_time.split(" ")[1] : "N/A",
            outTime: item.end_time && item.end_time !== "NA" ? item.end_time.split(" ")[1] : "N/A",
          };
        }
        return acc;
      }, {});

      console.log("Processed Attendance Data:", mappedData);
      setAttendanceData(mappedData);
    } catch (err) {
      setError("Failed to fetch attendance report.");
    } finally {
      setLoading(false);
    }
  };


  const handleMonthChange = (direction) => {
    setCurrentMonth(direction === "prev" ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1));
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getAttendanceStatus = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return (
      attendanceData[formattedDate] || {
        status: "weekly-off",
        hoursWorked: 0,
        inTime: "N/A",
        outTime: "N/A",
      }
    );
  };

  const getBackgroundColor = (date, hoursWorked, status) => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (dayOfWeek === 0 || dayOfWeek === 6) return "#E2E8F0"; // Grey for weekends
    if (status === "leave") return "#63B3ED"; // Leave (Blue)
    if (status === "absent") return "#FC8181";// Absent (Light Grey)
    if (hoursWorked > 8.5) return "#C6F6D5"; // Present (Green)
    if (hoursWorked > 6.5) return "#63B3ED"; // More than 6.5 hrs (Blue)
    // if (hoursWorked <= 6.5) return "#F6E05E"; // Half-day (Yellow)

    return "#E2E8F0"; // Default (Absent or Unmarked)
  };



  const handleAll = () => {
    navigate("/holiday");
  };
return (
  <>
    <Header />

    {/* Breadcrumbs */}
    <div className="pt-[90px] px-6 md:px-20 text-sm text-gray-500 bg-white space-x-1 mb-8">
      <span
        onClick={() => window.location.href = "/dashboard"}
        className="hover:underline cursor-pointer text-black"
      >
        Home
      </span>
      <span>/</span>
      <span
        onClick={() => window.location.href = "/attendance"}
        className="hover:underline cursor-pointer text-black"
      >
        Attendance
      </span>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-4 mt-8  text-xs">
          <button className="text-blue-500" onClick={() => handleMonthChange("prev")}>
            &lt; Prev
          </button>
          <h3 className="font-bold text-xs">{format(currentMonth, "MMMM yyyy")}</h3>
          <button className="text-blue-500" onClick={() => handleMonthChange("next")}>
            Next &gt;
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 text-center font-bold text-xs">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-gray-500 text-xs">
              {day}
            </div>
          ))}

          {/* Empty spaces for first week */}
          {Array(getDay(startOfMonth(currentMonth)))
            .fill(null)
            .map((_, index) => (
              <div key={`empty-${index}`} className="text-gray-300"></div>
            ))}

          {/* Actual Days */}
          {daysInMonth.map((date) => {
            const { status, hoursWorked, inTime, outTime } = getAttendanceStatus(date);
            const bgColor = getBackgroundColor(date, hoursWorked, status);
            const progressWidth = (hoursWorked / 8.5) * 100;

            return (
              <div
                key={date}
                className="p-3 rounded-md relative group"
                style={{ backgroundColor: bgColor }}
              >
                {format(date, "d")}

                {/* Tooltip */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 w-36 bg-black/90 text-white text-xs rounded-md shadow-md p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 border border-gray-600">
                  <p className="flex justify-between items-center text-gray-300">
                    <span className="font-medium text-white">IN:</span>
                    <span className="ml-1 text-green-400">{inTime}</span>
                  </p>
                  <p className="flex justify-between items-center text-gray-300 mt-1">
                    <span className="font-medium text-white">OUT:</span>
                    <span className="ml-1 text-red-400">{outTime}</span>
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300">
                  <div className="h-1 bg-green-500" style={{ width: `${progressWidth}%` }}></div>
                </div>
              </div>
            );
          })}

        </div>

        {/* Legend */}
        <div className="flex justify-between items-center mt-4 text-xs">
          <span className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: "#C6F6D5" }}></div> Present
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: "#FC8181" }}></div> Absent
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: "#F6E05E" }}></div> Half Day
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: "#63B3ED" }}></div> Less then 8.5hrs
          </span>
        </div>
      </div><div className=" bg-white-300 min-h-screen flex flex-col p-4">
        <div className="p-6 bg-white shadow-md rounded-lg w-full flex flex-col min-h-screen">
      <div className="flex justify-between items-center mb-6">
  <h2 className="text-sm font-semibold">Leave Balances</h2>

  <div className="flex gap-3">
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-md transition"
      onClick={handleAll}
    >
      Holidays
    </button>

    <button
      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-md transition"
      onClick={() =>
        window.open("https://cms.uknowva.com/my-leaves/apply-for-leave", "_blank")
      }
    >
      Apply Leave
    </button>
  </div>
</div>


          {/* Leave Balance Section */}
          {loading ? (
            <p>Loading leave balances...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-3 gap-4 mb-6 text-xs ">
              {leaveBalanceData.map((leave, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-md shadow">
                  <p className="text-xl font-bold text-blue-600">{leave.leave_balance} days</p>
                  <p className="text-gray-600">{leave.leave_type}</p>
                </div>
              ))}
            </div>
          )}

          {/* Leave History Section */}
          <h2 className="text-sm font-semibold mb-4">Leave History</h2>
          <div className="border border-gray-300 rounded-md overflow-hidden flex-grow">
            <div className="overflow-x-auto max-h-[70vh]">
              <table className="w-full text-xs border-collapse text-center">
                <thead className="sticky top-0 bg-gray-100 shadow-md">
                  <tr>
                    <th className="border p-2">Leave Type</th>
                    <th className="border p-2">Applied On</th>
                    {/* <th className="border p-2">From Date</th>
    <th className="border p-2">To Date</th> */}
                    <th className="border p-2">No of Days</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Attachment</th>
                  </tr>
                </thead>
                <tbody>
                  {[...leaveData]
                    .sort((a, b) => new Date(b.applied_on) - new Date(a.applied_on))
                    .map((leave, index) => (
                      <tr key={index} className="border">
                        <td className="border p-2">{leave.leave_type || "N/A"}</td>
                        <td className="border p-2">{leave.applied_on || "N/A"}</td>
                        {/* <td className="border p-2">{leave.from_date || "N/A"}</td>
        <td className="border p-2">{leave.to_date || "N/A"}</td> */}
                        <td className="border p-2">{leave.no_of_days || "N/A"}</td>
                        <td className="border p-2">
                          <span
                            className={`px-2 py-1 rounded text-white ${leave.status === "APPROVED"
                                ? "bg-green-500"
                                : leave.status === "PENDING"
                                  ? "bg-yellow-500"
                                  : leave.status === "CANCELLED"
                                    ? "bg-red-500"
                                    : "bg-gray-400"
                              }`}
                          >
                            {leave.status}
                          </span>
                        </td>
                        <td className="border p-2 text-center">
                          {leave.attachment ? (
                            <a
                              href={leave.attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              📄
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </div></>
  );




};
