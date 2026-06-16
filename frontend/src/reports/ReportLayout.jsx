import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "../components/Header";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";

function ReportLayout({
  reportTitle,
  sheetName,
  columnOptions,
  defaultSelectedColumns = [],
  availableOptionsLabel = "Select The Columns to display in the report",
  children,
  data,
  renderTableCell,
  financialYears = null,
  onDateChange,
  employeeCount = 0,
  onGenerate,
  onDownloadComplete,
  onFilterChange,
  columnKeyMap = {},
  getSearchableValue,
  excelColumns,
  excelData,
  customExcelExport,
  showDownloadAllButton = false,
  onDownloadAll,
  // Status filter props - made optional
  showStatusFilter = false, // New prop to control status filter visibility
  statusOptions = [],
  selectedStatus = "ALL",
  onStatusChange,
  loading = false,
}) {
  const [selectedColumns, setSelectedColumns] = useState(
    defaultSelectedColumns.length > 0
      ? defaultSelectedColumns
      : columnOptions.length > 0
      ? [columnOptions[0]]
      : [],
  );
  const [generatedColumns, setGeneratedColumns] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState("All Employees");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [lastDownload, setLastDownload] = useState(null);
  const [displayEmployeeCount, setDisplayEmployeeCount] = useState(0);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // State for selected rows (checkboxes)
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Highlight state for column selection
  const [highlightColumns, setHighlightColumns] = useState(false);

  const navigate = useNavigate();
  const tableRef = useRef(null);
  const columnSectionRef = useRef(null);
  const statusDropdownRef = useRef(null);

  // Load last download from localStorage on component mount
  useEffect(() => {
    const savedLastDownload = localStorage.getItem(`lastDownload_${sheetName}`);
    if (savedLastDownload) {
      setLastDownload(new Date(savedLastDownload));
    }
  }, [sheetName]);

  // Default financial years if not provided
  const currentYear = new Date().getFullYear();
  const defaultFinancialYears = Array.from({ length: 5 }, (_, i) => {
    const startYear = currentYear - i;
    const endYear = startYear + 1;
    return `${startYear}-${endYear}`;
  });

  const [selectedYear, setSelectedYear] = useState(
    financialYears ? financialYears[0] : defaultFinancialYears[0],
  );

  // Close status dropdown when clicking outside (only if status filter is shown)
  useEffect(() => {
    if (showStatusFilter) {
      const handleClickOutside = (event) => {
        if (
          statusDropdownRef.current &&
          !statusDropdownRef.current.contains(event.target)
        ) {
          setShowStatusDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showStatusFilter]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to table when showTable becomes true
  useEffect(() => {
    if (showTable && tableRef.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      });
    }
  }, [showTable, generatedColumns]);

  // Handle date changes and notify parent component
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        startDate,
        endDate,
        selectedEmployees,
        selectedYear,
      });
    }
  }, [startDate, endDate, selectedEmployees, selectedYear, onFilterChange]);

  // Filter data based on search term
  useEffect(() => {
    if (data && data.length > 0 && generatedColumns.length > 0) {
      if (!searchTerm.trim()) {
        setFilteredData(data);
      } else {
        const searchLower = searchTerm.toLowerCase().trim();
        const filtered = data.filter((item) => {
          return generatedColumns.some((column) => {
            let value;

            if (getSearchableValue) {
              value = getSearchableValue(item, column);
            } else {
              const key = columnKeyMap[column] || column;
              value = item[key];
            }

            if (value === null || value === undefined) return false;
            const stringValue = String(value).toLowerCase();
            return stringValue.includes(searchLower);
          });
        });
        setFilteredData(filtered);
      }
    } else {
      setFilteredData(data || []);
    }
  }, [data, searchTerm, generatedColumns, columnKeyMap, getSearchableValue]);

  // Reset selected rows when data changes or when employee selection changes
  useEffect(() => {
    setSelectedRows(new Set());
    setSelectAll(false);
    setCurrentPage(1);
  }, [filteredData, selectedEmployees]);

  // Remove highlight after 3 seconds
  useEffect(() => {
    if (highlightColumns) {
      const timer = setTimeout(() => {
        setHighlightColumns(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightColumns]);

  // Scroll to column section when highlighted
  useEffect(() => {
    if (highlightColumns && columnSectionRef.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          columnSectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      });
    }
  }, [highlightColumns]);

  // Pagination calculations based on filtered data
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData
    ? filteredData.slice(indexOfFirstRecord, indexOfLastRecord)
    : [];
  const totalPages = filteredData
    ? Math.ceil(filteredData.length / recordsPerPage)
    : 0;

  // Reset to first page when data changes or when generating new table
  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows(new Set());
    setSelectAll(false);
  }, [data, generatedColumns, recordsPerPage]);

  const toggleColumn = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedColumns.length === columnOptions.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns([...columnOptions]);
    }
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  const handleEmployeeSelection = (type) => {
    setSelectedEmployees(type);
    setSelectedRows(new Set());
    setSelectAll(false);
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (endDate && newStartDate > endDate) {
      setEndDate(newStartDate);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (startDate && newEndDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }
    setEndDate(newEndDate);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleRowSelect = (index) => {
    const absoluteIndex = indexOfFirstRecord + index;
    const newSelectedRows = new Set(selectedRows);

    if (newSelectedRows.has(absoluteIndex)) {
      newSelectedRows.delete(absoluteIndex);
    } else {
      newSelectedRows.add(absoluteIndex);
    }

    setSelectedRows(newSelectedRows);

    const currentPageIndices = currentRecords.map(
      (_, idx) => indexOfFirstRecord + idx,
    );
    const allSelected = currentPageIndices.every((idx) =>
      newSelectedRows.has(idx),
    );
    setSelectAll(allSelected);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      const currentPageIndices = currentRecords.map(
        (_, index) => indexOfFirstRecord + index,
      );
      setSelectedRows(new Set(currentPageIndices));
    }
    setSelectAll(!selectAll);
  };

  const handleGenerate = () => {
    if (selectedColumns.length === 0) {
      setShowPopup(true);
      return;
    }

    setGeneratedColumns([...selectedColumns]);
    setShowTable(true);

    if (onGenerate) {
      onGenerate({
        selectedYear,
        startDate,
        endDate,
        selectedEmployees,
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setHighlightColumns(true);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectAll(false);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectAll(false);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectAll(false);
  };

  const handleRecordsPerPageChange = (e) => {
    const newRecordsPerPage = parseInt(e.target.value);
    const newCurrentPage = Math.ceil(
      (indexOfFirstRecord + 1) / newRecordsPerPage,
    );
    setRecordsPerPage(newRecordsPerPage);
    setCurrentPage(newCurrentPage);
    setSelectAll(false);
  };

  const getTimeDifference = (downloadDate) => {
    const now = new Date();
    const diffInMs = now - downloadDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  const callReportRecordsAPI = async (downloadTime, workbook) => {
    try {
      const excelBinary = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const reportDataBase64 = btoa(
        new Uint8Array(excelBinary).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          "",
        ),
      );

      const reportRecordData = {
        reportRecordName: reportTitle,
        reportRecordDownloadedDateTime: downloadTime.toISOString(),
        reportData: reportDataBase64,
      };

      const response = await fetch("http://localhost:8080/api/report-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportRecordData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Report record saved successfully:", result);
      return result;
    } catch (error) {
      console.error("Error saving report record:", error);
    }
  };

  const exportToExcel = async () => {
    if (!filteredData || filteredData.length === 0) return;

    // If custom export function is provided, use it
    if (customExcelExport) {
      customExcelExport(filteredData, generatedColumns, sheetName);
      return;
    }

    // Otherwise use the default export logic
    let dataForExport;
    const exportData = excelData || filteredData;
    const exportColumns = excelColumns || generatedColumns;

    const getValueByColumn = (item, column) => {
      if (columnKeyMap && columnKeyMap[column]) {
        const key = columnKeyMap[column];
        const value = item[key];
        return value !== undefined && value !== null ? value : "";
      }
      const value = item[column];
      return value !== undefined && value !== null ? value : "";
    };

    if (selectedEmployees === "Selected Employees" && selectedRows.size > 0) {
      dataForExport = Array.from(selectedRows).map((absoluteIndex) => {
        const item = exportData[absoluteIndex];
        const exportedItem = {};
        exportColumns.forEach((col) => {
          exportedItem[col] = getValueByColumn(item, col);
        });
        return exportedItem;
      });
    } else {
      dataForExport = exportData.map((item) => {
        const exportedItem = {};
        exportColumns.forEach((col) => {
          exportedItem[col] = getValueByColumn(item, col);
        });
        return exportedItem;
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const maxWidth = 50;
    const wscols = exportColumns.map((col) => ({
      wch: Math.min(maxWidth, col.length + 5),
    }));
    worksheet["!cols"] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const fileName =
      selectedEmployees === "Selected Employees" && selectedRows.size > 0
        ? `${sheetName.replace(/\s+/g, "_")}_Selected_Employees_${
            new Date().toISOString().split("T")[0]
          }.xlsx`
        : `${sheetName.replace(/\s+/g, "_")}_${
            new Date().toISOString().split("T")[0]
          }.xlsx`;

    XLSX.writeFile(workbook, fileName);

    const downloadTime = new Date();
    setLastDownload(downloadTime);
    localStorage.setItem(
      `lastDownload_${sheetName}`,
      downloadTime.toISOString(),
    );

    await callReportRecordsAPI(downloadTime, workbook);

    if (onDownloadComplete) {
      onDownloadComplete(downloadTime);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const formatColumnHeader = (column) => {
    return column
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .trim();
  };

  // Get selected status label and color (only if status filter is shown)
  const getSelectedStatusInfo = () => {
    const selected = statusOptions.find((opt) => opt.value === selectedStatus);
    return (
      selected || {
        label: "All Statuses",
        color: "#1F2937",
        bgColor: "#FFFFFF",
        icon: "📊",
      }
    );
  };

  const selectedStatusInfo = getSelectedStatusInfo();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <style>
        {`
          input[type="checkbox"]:checked {
            background-color: #ef4444;
            border-color: #ef4444;
          }
          
          .report-table {
            border-collapse: collapse;
            width: 100%;
          }
          
          .report-table th,
          .report-table td {
            border: 1px solid #e5e7eb;
            padding: 0.75rem;
            text-align: left;
            vertical-align: middle;
          }
          
          .report-table th {
            background-color: #ef4444;
            color: white;
            font-weight: 600;
            position: sticky;
            top: 0;
            z-index: 10;
          }
          
          .report-table tbody tr:nth-child(even) {
            background-color: #f9fafb;
          }
          
          .report-table tbody tr:hover {
            background-color: #f3f4f6;
          }
          
          .table-container {
            max-height: 500px;
            overflow: auto;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
          }
          
          .table-container::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          .table-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          
          .table-container::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 4px;
          }
          
          .table-container::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
          
          .table-container:not(:hover)::-webkit-scrollbar-thumb {
            background: transparent;
          }
          
          .table-container:not(:hover)::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .table-container {
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;
          }
          
          .table-container:hover,
          .table-container:focus-within {
            scrollbar-color: #c1c1c1 #f1f1f1;
          }
          
          @keyframes highlightPulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
          
          .highlight-columns {
            animation: highlightPulse 2s ease-in-out;
            border-color: #ef4444 !important;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>

      {/* Popup for column selection warning */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-header">
              Column Selection Required
            </h3>
            <p className="text-gray-700 mb-6 font-content">
              Please select at least one column to generate the report.
            </p>
            <div className="flex justify-end">
              <button
                onClick={handlePopupClose}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-content"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Header />
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full overflow-y-auto">
        {/* Back Button and Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="flex items-center px-4 py-2 text-[#ef4444] hover:bg-red-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:ring-offset-2 font-content"
            >
              <IoArrowBackCircleOutline className="h-6 w-6 mr-2 text-[#ef4444]" />
              <span className="font-medium text-[#ef4444] font-content">
                Back
              </span>
            </button>
          </div>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold mt-5 text-gray-900 font-header">
              {reportTitle}
            </h1>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-red-500 font-semibold font-content"
            >
              {(financialYears || defaultFinancialYears).map((year) => (
                <option key={year} value={year} className="font-content">
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Status Filter Bar - Only shown when showStatusFilter is true */}
        {showStatusFilter && statusOptions.length > 0 && (
          <div className="sticky top-0 z-20 mb-6 -mt-2 pt-2 bg-gray-50">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <FaFilter className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 font-header">
                      Filter Reports
                    </h3>
                    <p className="text-xs text-gray-500">
                      Filter by submission status
                    </p>
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="relative" ref={statusDropdownRef}>
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    <FaFilter className="text-sm" />
                    <span>Filter by Status</span>
                    <span className="ml-2 px-2 py-0.5 bg-white text-gray-800 rounded-full text-xs font-semibold">
                      {selectedStatusInfo.icon} {selectedStatusInfo.label}
                    </span>
                  </button>

                  {showStatusDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowStatusDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                        <div className="p-3 bg-gradient-to-r from-red-50 to-red-100 border-b border-gray-200">
                          <h3 className="font-semibold text-gray-700">
                            Select Report Status
                          </h3>
                          <p className="text-xs text-gray-500">
                            Choose status to filter reports
                          </p>
                        </div>
                        <div className="py-2 max-h-80 overflow-y-auto">
                          {statusOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                if (onStatusChange) {
                                  onStatusChange(option.value);
                                }
                                setShowStatusDropdown(false);
                              }}
                              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                                selectedStatus === option.value
                                  ? "bg-red-50"
                                  : ""
                              }`}
                            >
                              <span className="text-xl">{option.icon}</span>
                              <div className="flex-1 text-left">
                                <div className="font-medium text-gray-800">
                                  {option.label}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {option.value === "ALL"
                                    ? "Show all reports regardless of status"
                                    : `Show only ${option.label.toLowerCase()} reports`}
                                </div>
                              </div>
                              {selectedStatus === option.value && (
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Active Filter Display */}
              {selectedStatus !== "ALL" && (
                <div className="mt-3 flex items-center gap-2 pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-600">Active Filter:</div>
                  <div
                    className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 bg-white border border-gray-200 shadow-sm"
                    style={{
                      color: selectedStatusInfo.color,
                    }}
                  >
                    <span>{selectedStatusInfo.icon}</span>
                    <span>{selectedStatusInfo.label}</span>
                    <button
                      onClick={() => {
                        if (onStatusChange) {
                          onStatusChange("ALL");
                        }
                      }}
                      className="ml-2 hover:opacity-70 text-xs font-bold text-gray-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="w-full lg:w-1/2 space-y-8">
            {/* Employee Selection */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-header">
                Employee Selection
              </h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleEmployeeSelection("All Employees")}
                  className={`px-4 py-2 rounded-md font-content ${
                    selectedEmployees === "All Employees"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  All Employees
                </button>
                <button
                  onClick={() => handleEmployeeSelection("Selected Employees")}
                  className={`px-4 py-2 rounded-md font-content ${
                    selectedEmployees === "Selected Employees"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Selected Employees
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-header">
                Select the duration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-content">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-content"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-content">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    min={startDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-content"
                  />
                </div>
              </div>
              {(startDate || endDate) && (
                <div className="mt-3 p-2 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700 font-content">
                    Filtering by creation date: {startDate || "Any"} to{" "}
                    {endDate || "Any"}
                  </p>
                </div>
              )}
            </div>

            {children && children.left}
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-1/2 space-y-8">
            {/* Column Selection */}
            <div
              ref={columnSectionRef}
              className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-300 ${
                highlightColumns ? "highlight-columns" : ""
              }`}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-header">
                {availableOptionsLabel}
              </h2>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={selectedColumns.length === columnOptions.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 accent-[#ef4444] focus:ring-[#ef4444] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="select-all"
                    className="ml-2 block text-sm text-gray-700 font-content"
                  >
                    Select All
                  </label>
                </div>
                <button
                  onClick={handleDeselectAll}
                  className="text-sm text-red-500 hover:text-red-700 font-medium font-content"
                >
                  Deselect All
                </button>
              </div>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <div className="flex-1 p-4 border-r border-gray-300 min-w-0">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm font-header">
                    Available Options
                  </h3>
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                    {columnOptions.map((column) => (
                      <div key={column} className="flex items-start">
                        <input
                          type="checkbox"
                          id={column}
                          checked={selectedColumns.includes(column)}
                          onChange={() => toggleColumn(column)}
                          className="h-4 w-4 accent-[#ef4444] focus:ring-[#ef4444] border-gray-300 rounded flex-shrink-0 mt-0.5"
                        />
                        <label
                          htmlFor={column}
                          className="ml-2 block text-sm text-gray-700 break-words min-w-0 font-content"
                          title={column}
                        >
                          {column}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 p-4 min-w-0">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm font-header">
                    Selected Options
                  </h3>
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                    {selectedColumns.length === 0 ? (
                      <p className="text-gray-500 text-sm italic font-content">
                        No columns selected
                      </p>
                    ) : (
                      selectedColumns.map((column, index) => (
                        <div key={column} className="flex items-start">
                          <div className="flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold mr-2 flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <label
                            className="block text-sm text-gray-700 break-words min-w-0 font-content"
                            title={column}
                          >
                            {column}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Count and Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-content disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Generating..." : "Generate"}
                </button>

                <button
                  onClick={() => {
                    setShowTable(false);
                    setStartDate("");
                    setEndDate("");
                    setDisplayEmployeeCount(0);
                    setCurrentPage(1);
                    setSelectedRows(new Set());
                    setSelectAll(false);
                    setSearchTerm("");
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-content"
                >
                  Cancel
                </button>
              </div>
            </div>

            {children && children.right}

            {/* Last Download Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-md font-semibold text-gray-900 mb-2 font-header">
                Last Download
              </h3>
              <p className="text-gray-600 text-sm mb-4 font-content">
                {lastDownload
                  ? getTimeDifference(lastDownload)
                  : "No downloads yet"}
              </p>
              {lastDownload && (
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-xs text-gray-600 font-content">
                    ( Financial Year : {selectedYear} ) ( Employees :{" "}
                    {selectedEmployees} )
                  </p>
                  <p className="text-xs text-gray-600 mt-1 font-content">
                    Downloaded on: {lastDownload.toLocaleDateString()} at{" "}
                    {lastDownload.toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generated Table */}
        {showTable && generatedColumns.length > 0 && (
          <div ref={tableRef} className="mt-10 flex justify-center">
            <div className="w-full max-w-6xl">
              {/* Search and Export Section */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full sm:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search in table..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-content"
                    />
                    {searchTerm && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {searchTerm && (
                    <p className="text-sm text-gray-600 mt-1 font-content">
                      Found {filteredData.length} result(s) for "{searchTerm}"
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  {selectedEmployees === "Selected Employees" && (
                    <p className="text-sm text-gray-600 font-content">
                      {selectedRows.size} employee(s) selected for export
                    </p>
                  )}
                  <div className="flex gap-2">
                    {showDownloadAllButton && (
                      <button
                        onClick={onDownloadAll}
                        disabled={!filteredData || filteredData.length === 0}
                        className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center font-content ${
                          !filteredData || filteredData.length === 0
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 8h8a2 2 0 002-2v-8a2 2 0 00-2-2h-2"
                          />
                        </svg>
                        Download All
                      </button>
                    )}

                    <button
                      onClick={exportToExcel}
                      disabled={
                        selectedEmployees === "Selected Employees" &&
                        selectedRows.size === 0
                      }
                      className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center font-content ${
                        selectedEmployees === "Selected Employees" &&
                        selectedRows.size === 0
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      {selectedEmployees === "Selected Employees"
                        ? "Export Selected"
                        : "Export to Excel"}
                    </button>
                  </div>
                </div>
              </div>

              {filteredData && filteredData.length > 0 ? (
                <>
                  <div className="table-container">
                    <table className="report-table">
                      <thead>
                        <tr>
                          {selectedEmployees === "Selected Employees" && (
                            <th className="px-4 py-3 font-semibold uppercase tracking-wider font-header whitespace-nowrap w-12">
                              <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                className="h-4 w-4 accent-[#ef4444] focus:ring-[#ef4444] border-gray-300 rounded"
                              />
                            </th>
                          )}
                          {generatedColumns.map((col) => (
                            <th
                              key={col}
                              className="px-4 py-3 font-semibold uppercase tracking-wider font-header whitespace-nowrap"
                            >
                              {formatColumnHeader(col)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentRecords.map((item, index) => {
                          const absoluteIndex = indexOfFirstRecord + index;
                          const isSelected = selectedRows.has(absoluteIndex);

                          return (
                            <tr
                              key={absoluteIndex}
                              className={`hover:bg-gray-50 ${
                                isSelected ? "bg-blue-50" : ""
                              }`}
                            >
                              {selectedEmployees === "Selected Employees" && (
                                <td className="px-4 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleRowSelect(index)}
                                    className="h-4 w-4 accent-[#ef4444] focus:ring-[#ef4444] border-gray-300 rounded"
                                  />
                                </td>
                              )}
                              {generatedColumns.map((column) =>
                                renderTableCell ? (
                                  renderTableCell(column, item, absoluteIndex)
                                ) : (
                                  <td
                                    key={column}
                                    className="px-4 py-3 text-gray-700 font-content"
                                  >
                                    {(() => {
                                      const key =
                                        columnKeyMap[column] || column;
                                      const value = item[key];
                                      return value !== null &&
                                        value !== undefined
                                        ? value
                                        : "N/A";
                                    })()}
                                  </td>
                                ),
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700 font-content">
                        Rows per page:
                      </span>
                      <select
                        value={recordsPerPage}
                        onChange={handleRecordsPerPageChange}
                        className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-content"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={40}>40</option>
                        <option value={50}>50</option>
                      </select>
                    </div>

                    <div className="text-sm text-gray-700 font-content">
                      Showing {indexOfFirstRecord + 1} to{" "}
                      {Math.min(indexOfLastRecord, filteredData.length)} of{" "}
                      {filteredData.length} entries
                      {selectedEmployees === "Selected Employees" && (
                        <span className="ml-2 text-blue-600">
                          ({selectedRows.size} selected)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md text-sm font-content ${
                          currentPage === 1
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        Previous
                      </button>

                      <div className="flex space-x-1">
                        {getPageNumbers().map((pageNumber, index) =>
                          pageNumber === "..." ? (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-3 py-1 text-gray-500 font-content"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={pageNumber}
                              onClick={() => goToPage(pageNumber)}
                              className={`px-3 py-1 rounded-md text-sm font-content ${
                                currentPage === pageNumber
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          ),
                        )}
                      </div>

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md text-sm font-content ${
                          currentPage === totalPages
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <p className="text-gray-500 text-lg font-content">
                    {searchTerm
                      ? "No matching records found for your search"
                      : "No data found for the selected criteria"}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={handleClearSearch}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-content"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">Generating Report...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportLayout;
