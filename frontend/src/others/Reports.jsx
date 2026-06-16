import React from "react";
import { Folder } from "lucide-react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const reports = [
  { id: 1, name: "Induction Report", route: "/reports/induction", hasNew: true, color: "from-red-400 to-red-900" },
  { id: 2, name: "Mood Meter", route: "/reports/mood", hasNew: false, color: "from-red-400 to-red-900" },
  { id: 3, name: "Attendance Report", route: "/reports/attendance", hasNew: true, color: "from-red-400 to-red-900" },
  { id: 4, name: "Training Progress", route: "/reports/training", hasNew: false, color: "from-red-400 to-red-900" },
  { id: 5, name: "Employee Compliance Acknowledgement", route: "/reports/compliance", hasNew: true, color: "from-red-400 to-red-900" },
  { id: 6, name: "Others", route: "/reports/others", hasNew: false, color: "from-red-400 to-red-900" },
];

// ✅ Access Control (per report basis)
const accessMap = {
  "/reports/mood": ["9083095", "9085176", "9084571"],
  "/reports/induction": ["9085176", "9082697", "9079597"],
  "/reports/attendance": ["9085176", "9083095", "9084571", "9082697", "9079597"],
  "/reports/training": ["9085176"],
  "/reports/compliance": ["9085176", "9083095"],
  "/reports/others": ["9085176"],
};

export default function AllReports() {
  const navigate = useNavigate();
  const ecode = localStorage.getItem("empId") || localStorage.getItem("ecode") || "admin";

  const handleReportClick = (route) => {
    const allowedEcodes = accessMap[route] || [];

    if (allowedEcodes.includes(ecode) || ecode === "admin" || ecode === "supervisor") {
      navigate(route);
    } else {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You are not authorized to view this report.",
        confirmButtonColor: "#1d4ed8",
        confirmButtonText: "OK",
        background: "#ffffff",
        color: "#333333",
        allowOutsideClick: false,
        customClass: {
          title: "text-xl font-semibold",
          popup: "rounded-xl shadow-lg border border-gray-200",
          confirmButton: "px-6 py-2 rounded-lg font-medium",
        },
      });
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#f8f9fa] py-16 px-6 md:px-20 font-sans mt-14">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="text-sm text-gray-500 font-medium mb-2">
            <a href="/Dashboard" className="text-black hover:underline">
              Home
            </a>{" "}
            / <span className="text-black font-semibold">Reports</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Reports Dashboard</h1>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => handleReportClick(report.route)}
              className="bg-white rounded-2xl shadow-lg group hover:shadow-2xl transition duration-300 p-6 cursor-pointer border border-transparent hover:border-gray-200 relative"
            >
              {report.hasNew && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10 shadow">
                  NEW
                </span>
              )}

              <div
                className={`w-14 h-14 bg-gradient-to-br ${report.color} rounded-full flex items-center justify-center text-white shadow-md mb-5`}
              >
                <Folder size={28} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-[#4a4a4a]">
                {report.name}
              </h2>

              <div className="flex justify-between mt-6 text-sm text-gray-500">
                <span className="hover:text-blue-600 flex items-center gap-1 cursor-pointer">
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}