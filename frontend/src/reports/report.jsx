import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [showFavorites, setShowFavorites] = useState(false);
  const [userEmpCode, setUserEmpCode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedFavorites = localStorage.getItem("reportFavorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
    
    // Get empCode from localStorage
    const empCode = localStorage.getItem("empId");
    setUserEmpCode(empCode);
  }, []);

  // Allowed employee codes for EPMS section
  const allowedEmpCodes = ["9086154", "9079909", "9084571", "9083095", "9085173"];

  // Check if user has EPMS access
  const hasEPMSAccess = userEmpCode && allowedEmpCodes.includes(userEmpCode);

  const sections = [
    {
      title: "EPMS",
      items: [
        "Quarter wise Goal Report",
        "Annual Performance Review Report",
        // "Overall Goal Setting Report",
        // "Performance Appraisal Report",
        // "Qualification Report",
      ],
    },
    {
      title: "Employee Directory",
      items: [
        "Employee Head Count Report",
        "Newly Join Employee Report",
        "Confirmation Due Report",
        "Department Wise Employee Count Report",
        "Location Wise Employee Count Report",
        "Onboarded Candidates Due for Employee Conversion",
        "Exited Employee Report",
      ],
    },
    {
      title: "Income Tax",
      items: ["IT Decleration Report", "Proof Of Investment Report"],
    },
    {
      title: "Mediclaim",
      items: ["Mediclaim Enrollment Report"],
    },
    {
      title: "CDL User Log",
      items: ["Mood Report", "CDL User Log Report"],
    },
    {
      title: "Onboarding",
      items: [
        "ERF Detailed Status Report",
        "New Candidates onboarded Report",
        "Candidates Converted to Employee Report",
        "Job Openings List Report",
        "Job Detailed Status Report",
      ],
    },
    {
      title: "Helpdesk",
      items: ["Helpdesk Report"],
    },
    {
      title: "Induction",
      items: ["Induction Report"],
    },
  ];

  const toggleFavorite = (reportName, e) => {
    e.stopPropagation();
    
    // Check if trying to favorite an EPMS report without access
    const isEPMSReport = sections.find(section => section.title === "EPMS")?.items.includes(reportName);
    if (isEPMSReport && !hasEPMSAccess) {
      toast.error("You don't have access to EPMS reports!");
      return;
    }
    
    const newFavorites = new Set(favorites);
    if (newFavorites.has(reportName)) {
      newFavorites.delete(reportName);
      toast.success("Removed from favorites!");
    } else {
      newFavorites.add(reportName);
      toast.success("Added to favorites!");
    }
    setFavorites(newFavorites);
    localStorage.setItem(
      "reportFavorites",
      JSON.stringify(Array.from(newFavorites))
    );
  };

  const handleReportClick = (reportName) => {
    // Check if trying to access an EPMS report without access
    const isEPMSReport = sections.find(section => section.title === "EPMS")?.items.includes(reportName);
    if (isEPMSReport && !hasEPMSAccess) {
      toast.error("Access Denied! You don't have permission to view EPMS reports.");
      return;
    }
    
    if (reportName === "Mood Report") {
      navigate("/mood-reports");
    } else if (reportName === "Quarter wise Goal Report") {
      navigate("/quator-wise-goal-report");
    } else if (reportName === "Annual Performance Review Report") {
      navigate("/annual-goal-report");
    // } else if (reportName === "Overall Goal Setting Report") {
    //   navigate("/overall-goal-setting-report");
    // } else if (reportName === "Performance Appraisal Report") {
    //   navigate("/performance-appraisal-report");
    // } else if (reportName === "Qualification Report") {
    //   navigate("/qualification-report");
    } else if (reportName === "Employee Head Count Report") {
      navigate("/employee-head-count-report");
    } else if (reportName === "Newly Join Employee Report") {
      navigate("/newly-joined-employee-report");
    } else if (reportName === "Confirmation Due Report") {
      navigate("/confirmation-due-report");
    } else if (reportName === "Department Wise Employee Count Report") {
      navigate("/department-wise-employee-count-report");
    } else if (reportName === "Location Wise Employee Count Report") {
      navigate("/location-wise-employee-count-report");
    } else if (
      reportName === "Onboarded Candidates Due for Employee Conversion"
    ) {
      navigate("/onboarded-candidates-due-for-employee-conversion");
    } else if (reportName === "Exited Employee Report") {
      navigate("/exited-employee-report");
    } else if (reportName === "IT Decleration Report") {
      navigate("/declared-employee-report");
    } else if (reportName === "Proof Of Investment Report") {
      navigate("/poi-submission-report");
    } else if (reportName === "Mediclaim Enrollment Report") {
      navigate("/mediclaim-enrollment-report");
    } else if (reportName === "CDL User Log Report") {
      navigate("/cdl-user-log-report");
    } else if (reportName === "ERF Detailed Status Report") {
      navigate("/erf-detailed-status-report");
    } else if (reportName === "New Candidates Onboarded Report") {
      navigate("/new-candidates-onboarded-report");
    } else if (reportName === "Candidates Converted to Employee Report") {
      navigate("/candidates-converted-to-employee-report");
    } else if (reportName === "Job Openings List Report") {
      navigate("/job-openings-list-report");
    } else if (reportName === "Job Detailed Status Report") {
      navigate("/job-detail-status-report");
    } else if (reportName === "Helpdesk Report") {
      navigate("/helpdesk-report");
    } else if (reportName === "Induction Report") {
      navigate("/induction-report");
    }
  };

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const matchesSearch = searchQuery
          ? item.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        const matchesFavorite = showFavorites ? favorites.has(item) : true;

        return matchesSearch && matchesFavorite;
      }),
    }))
    .filter((section) => section.items.length > 0);

  // Function to format long report names with line breaks
  const formatReportName = (name) => {
    // Add line breaks after key words for long report names
    const breakPoints = ["Report", "Count", "Due", "Wise", "Status"];

    for (const point of breakPoints) {
      if (name.includes(point) && name.length > 25) {
        return name.replace(point, point + "<wbr>");
      }
    }

    return name;
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          .report-name {
            word-break: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
          }
          .disabled-report {
            opacity: 0.6;
            cursor: not-allowed !important;
            background-color: #f9fafb;
          }
          .disabled-report:hover {
            background-color: #f9fafb !important;
          }
          .disabled-text {
            color: #9ca3af !important;
          }
        `}
      </style>

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <Header />
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Reports..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-[#ef4444] bg-gray-50 text-gray-700 placeholder-gray-500"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Fixed Breadcrumb Navigation */}
          <div className="flex-1">
            <div className="flex items-center text-sm flex-wrap gap-y-2">
              <span
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer text-gray-700 font-medium hover:text-[#dc2626] hover:underline hover:underline-offset-4"
              >
                Home
              </span>

              <span className="mx-2 text-gray-400">/</span>

              <span className="font-semibold text-[#dc2626] cursor-default">
                Reports
              </span>
            </div>
          </div>
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h1
            className="text-2xl font-bold text-gray-800"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
          >
            Reports Dashboard
          </h1>
          
          <div className="flex-1 flex justify-end">
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-[#ef4444] bg-white text-gray-700 placeholder-gray-500"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className={`px-4 py-2.5 rounded-lg shadow-sm transition font-medium ${
                    !showFavorites
                      ? "bg-[#ef4444] text-white hover:bg-[#dc2626] shadow-md"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
                  }`}
                  onClick={() => setShowFavorites(false)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                  }}
                >
                  All Reports
                </button>
                <button
                  className={`px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1 font-medium ${
                    showFavorites
                      ? "bg-[#ef4444] text-white hover:bg-[#dc2626] shadow-md"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
                  }`}
                  onClick={() => setShowFavorites(true)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                  }}
                >
                  <span>★</span>
                  <span>
                    {favorites.size > 0
                      ? `Favorites (${favorites.size})`
                      : "Favorites"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredSections.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg
              className="mx-auto h-16 w-16 text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3
              className="text-xl font-semibold text-gray-700 mb-2"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            >
              No results found
            </h3>
            <p
              className="text-gray-500"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
            >
              Try different search terms or check your favorites
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200 flex flex-col h-[340px] w-full relative overflow-hidden"
              >
                <div
                  className="px-5 py-4 text-white font-semibold bg-gradient-to-r from-[#ef4444] to-[#dc2626]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{section.title}</span>
                    <div className="h-6 w-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span
                        className="text-xs"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        {section.items.length}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                  <ul className="py-2 px-3 space-y-1">
                    {section.items.map((item, idx) => {
                      // Check if this is an EPMS report
                      const isEPMSReport = section.title === "EPMS";
                      const isDisabled = isEPMSReport && !hasEPMSAccess;
                      
                      return (
                        <li key={idx} className="relative">
                          <div
                            className={`flex justify-between items-center text-sm text-gray-700 py-2.5 px-3 rounded-lg transition group ${
                              isDisabled 
                                ? "disabled-report cursor-not-allowed" 
                                : "hover:bg-gray-50 cursor-pointer"
                            }`}
                            onClick={() => !isDisabled && handleReportClick(item)}
                          >
                            <div className="flex items-center max-w-[80%]">
                              <span
                                className={`report-name transition-colors ${
                                  isDisabled 
                                    ? "disabled-text" 
                                    : "text-gray-700 group-hover:text-[#ef4444]"
                                }`}
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: "14px",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: formatReportName(item),
                                }}
                              />
                              {isDisabled && (
                                <span className="ml-2 text-xs text-gray-400">
                                  (Locked)
                                </span>
                              )}
                            </div>
                            <span
                              className={`ml-2 flex-shrink-0 text-lg transition ${
                                isDisabled
                                  ? "text-gray-300 cursor-not-allowed"
                                  : favorites.has(item)
                                  ? "text-yellow-500 hover:text-yellow-600 cursor-pointer"
                                  : "text-gray-300 hover:text-yellow-500 cursor-pointer"
                              }`}
                              onClick={(e) => {
                                if (!isDisabled) {
                                  toggleFavorite(item, e);
                                } else {
                                  e.stopPropagation();
                                  toast.error("You don't have access to EPMS reports!");
                                }
                              }}
                            >
                              {favorites.has(item) ? "★" : "☆"}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ fontFamily: "'Inter', sans-serif" }}
      />
    </div>
  );
};

export default Reports;