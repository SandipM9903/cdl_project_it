import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { BASE_URL } from "../config/Config";

function RecentReport() {
  const [recentReports, setRecentReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [financialYear, setFinancialYear] = useState("2023-2024");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${BASE_URL}/api/report-records`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch reports: ${response.status}`);
        }

        const reportsData = await response.json();
        setRecentReports(reportsData);
        setFilteredReports(reportsData);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.message);
        setRecentReports([]);
        setFilteredReports([]);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchReports();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredReports(recentReports);
    } else {
      const filtered = recentReports.filter(
        (report) =>
          report.reportRecordName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          report.reportRecordId?.toString().includes(searchTerm) ||
          formatDateForDisplay(report.reportRecordDownloadedDateTime)?.includes(
            searchTerm
          )
      );
      setFilteredReports(filtered);
    }
  }, [searchTerm, recentReports]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownload = async (reportId, reportName) => {
    try {
      console.log(`Downloading report ${reportId}`);

      const response = await fetch(
        `${BASE_URL}/api/report-records/${reportId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to download report: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        const reportData = await response.json();
        console.log("Report data:", reportData);

        if (reportData.reportData) {
          const binaryString = atob(reportData.reportData);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = `${reportName || "report"}-${reportId}.xlsx`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);

          alert(`Report ${reportName || reportId} downloaded successfully!`);
        } else {
          alert(`Report ${reportName || reportId} data loaded successfully!`);
        }
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        const contentDisposition = response.headers.get("content-disposition");
        let filename = `${reportName || "report"}-${reportId}.xlsx`;
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (filenameMatch && filenameMatch.length === 2) {
            filename = filenameMatch[1];
          }
        }

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert(`Report ${reportName || reportId} downloaded successfully!`);
      }
    } catch (err) {
      console.error("Error downloading report:", err);
      alert(`Failed to download report: ${err.message}`);
    }
  };

  const handleReportClick = (reportName, reportId) => {
    if (reportName === "Mood Report") {
      navigate("/mood-report", { state: { reportId } });
    } else if (reportName === "CDL Report") {
      navigate("/cdl-report", { state: { reportId } });
    } else {
      navigate("/report-details", { state: { reportId } });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFinancialYearChange = (e) => {
    setFinancialYear(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleDurationFilter = () => {
    if (startDate && endDate) {
      const filtered = recentReports.filter((report) => {
        if (!report.reportRecordDownloadedDateTime) return false;

        const reportDate = new Date(report.reportRecordDownloadedDateTime);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return reportDate >= start && reportDate <= end;
      });
      setFilteredReports(filtered);
    } else {
      setFilteredReports(recentReports);
    }
  };

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setFilteredReports(recentReports);
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recently";

      const now = new Date();
      const diffInMs = now - date;
      const diffInHours = diffInMs / (1000 * 60 * 60);
      const diffInDays = diffInHours / 24;

      if (diffInHours < 1) {
        return "Just now";
      } else if (diffInHours < 24) {
        const hours = Math.floor(diffInHours);
        return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
      } else if (diffInDays < 7) {
        const days = Math.floor(diffInDays);
        return `${days} day${days !== 1 ? "s" : ""} ago`;
      } else {
        return formatDateForDisplay(dateString);
      }
    } catch (error) {
      console.error("Error formatting time ago:", error);
      return "Recently";
    }
  };

  const financialYears = ["2023-2024", "2022-2023", "2021-2022", "2020-2021"];

  return (
    <div className="min-h-screen flex flex-col font-content bg-gray-50">
      <style>
        {`
                input[type="checkbox"]:checked {
                    background-color: #ef4444;
                    border-color: #ef4444;
                }
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(0.5);
                }
                select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
    -webkit-print-color-adjust: exact;
}
                `}
      </style>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Header />
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Back Button and Title */}
        <div className="flex items-center relative">
          <button
            onClick={handleBack}
            className="flex items-center mt-10 mb-4 px-4 py-2 text-[#ef4444] hover:bg-red-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:ring-offset-2"
          >
            <IoArrowBackCircleOutline className="h-6 w-6 mr-2 text-[#ef4444]" />
            <span className="font-medium text-[#ef4444]">Back</span>
          </button>

          <h1 className="absolute left-1/2 transform -translate-x-1/2 mt-10 mb-4 font-header text-3xl font-bold text-gray-900">
            Recent Report
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              <span className="ml-3 text-gray-600">Loading reports...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-red-500 mb-3">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="font-header text-lg font-medium text-gray-900 mb-1">
              Error loading reports
            </h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Financial Year and Duration Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <h2 className="font-header text-base font-semibold text-gray-900 mb-4">
                Filter Reports
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                {/* Financial Year */}
                <div className="lg:col-span-2">
                  <label
                    htmlFor="financialYear"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Financial Year
                  </label>
                  <select
                    id="financialYear"
                    value={financialYear}
                    onChange={handleFinancialYearChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-white"
                  >
                    {financialYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration Selection */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Duration
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          From Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={handleStartDateChange}
                          placeholder="dd-mm-yyyy"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
               focus:outline-none focus:ring-2 focus:ring-red-500 
               focus:border-red-500 transition-colors duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          To Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={handleEndDateChange}
                          placeholder="dd-mm-yyyy"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
               focus:outline-none focus:ring-2 focus:ring-red-500 
               focus:border-red-500 transition-colors duration-200"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDurationFilter}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 font-medium whitespace-nowrap"
                      >
                        Apply
                      </button>
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium whitespace-nowrap"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Dates Display */}
              {(startDate || endDate) && (
                <div className="mt-3 p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center text-xs text-gray-600">
                    <svg
                      className="w-3 h-3 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Filtering by: </span>
                    {startDate && (
                      <span className="font-medium ml-1">
                        From {formatDateForDisplay(startDate)}
                      </span>
                    )}
                    {endDate && (
                      <span className="font-medium ml-1">
                        To {formatDateForDisplay(endDate)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Recent Reports List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h2 className="font-header text-base font-semibold text-gray-900">
                  Recently Generated Reports
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  {filteredReports.length} report
                  {filteredReports.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredReports.map((report) => (
                  <div
                    key={report.reportRecordId}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
                    onClick={() =>
                      handleReportClick(
                        report.reportRecordName,
                        report.reportRecordId
                      )
                    }
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <h3 className="font-header font-semibold text-gray-900 text-base group-hover:text-red-600 transition-colors duration-200">
                            {report.reportRecordName ||
                              `Report ${report.reportRecordId}`}
                          </h3>
                          <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium">
                            {formatTimeAgo(
                              report.reportRecordDownloadedDateTime
                            )}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600 ml-4">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Generated on{" "}
                          {formatDateForDisplay(
                            report.reportRecordDownloadedDateTime
                          )}
                        </div>
                      </div>

                      <div className="sm:pl-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(
                              report.reportRecordId,
                              report.reportRecordName
                            );
                          }}
                          className="w-full sm:w-auto px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 font-medium flex items-center justify-center gap-1.5"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredReports.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">
                        {filteredReports.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {recentReports.length}
                      </span>{" "}
                      results
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                        First
                      </button>
                      <button className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                        &lt;
                      </button>
                      <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 border border-red-500 rounded-md">
                        1
                      </span>
                      <button className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                        &gt;
                      </button>
                      <button className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                        Last
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredReports.length === 0 && recentReports.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-gray-300 mb-3">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-header text-lg font-medium text-gray-900 mb-1">
                  No reports available
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  There are no reports generated yet.
                </p>
              </div>
            )}

            {/* No Results State */}
            {filteredReports.length === 0 && recentReports.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-gray-300 mb-3">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-header text-lg font-medium text-gray-900 mb-1">
                  No reports found
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Try adjusting your search criteria or duration filter.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default RecentReport;
