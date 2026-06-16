import React, { useState, useEffect } from "react";
import { 
  Download, 
  Search, 
  Filter,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  User,
  Eye,
  ChevronDown,
  ChevronUp,
  Printer,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import Header from "../components/Header";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ComplianceReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("acceptedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    acceptanceRate: 0
  });

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://mycdl.cms.co.in/api/v1/terms/get-all");
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.data && Array.isArray(result.data)) {
          const sortedData = result.data.sort((a, b) => 
            new Date(b.acceptedAt || 0) - new Date(a.acceptedAt || 0)
          );
          setData(sortedData);
          setFilteredData(sortedData);
          calculateStats(sortedData);
        } else {
          throw new Error("Invalid data format received");
        }
      } else {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching compliance data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load compliance data. Please try again.",
        confirmButtonColor: "#1d4ed8",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (dataArray) => {
    const total = dataArray.length;
    const accepted = dataArray.filter(item => item.accepted).length;
    const pending = total - accepted;
    const acceptanceRate = total > 0 ? (accepted / total * 100).toFixed(1) : 0;
    
    setStats({
      total,
      accepted,
      pending,
      acceptanceRate
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter and sort data
  useEffect(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(item => 
        (item.ecode && item.ecode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.fullName && item.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.ipAddress && item.ipAddress.includes(searchTerm))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const statusBool = statusFilter === "accepted";
      result = result.filter(item => item.accepted === statusBool);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle dates
      if (sortField === "acceptedAt" || sortField === "createdAt") {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      // Handle strings
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [data, searchTerm, statusFilter, sortField, sortDirection]);

  // Calculate pagination
  useEffect(() => {
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    setTotalPages(totalPages || 1);
  }, [filteredData, recordsPerPage]);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not Accepted";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle row expansion
  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Toggle row selection (for current page only)
  const toggleSelection = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  // Select all rows in current page
  const selectCurrentPage = () => {
    const currentPageData = getCurrentPageData();
    const currentPageIds = currentPageData.map(item => item.id);
    
    // Check if all current page rows are already selected
    const allSelected = currentPageIds.every(id => selectedRows.has(id));
    
    const newSelected = new Set(selectedRows);
    
    if (allSelected) {
      // Deselect all from current page
      currentPageIds.forEach(id => newSelected.delete(id));
    } else {
      // Select all in current page
      currentPageIds.forEach(id => newSelected.add(id));
    }
    
    setSelectedRows(newSelected);
  };

  // Select all filtered rows
  const selectAllFiltered = () => {
    const filteredIds = filteredData.map(item => item.id);
    
    // Check if all filtered rows are already selected
    const allSelected = filteredIds.every(id => selectedRows.has(id));
    
    if (allSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredIds));
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = filteredData.map(item => ({
        'ECode': item.ecode || '',
        'Employee Name': item.fullName || '',
        'Status': item.accepted ? 'Accepted' : 'Pending',
        'Accepted At': item.acceptedAt ? formatDate(item.acceptedAt) : 'Not Accepted',
        'IP Address': item.ipAddress || '',
        'User Agent': item.userAgent || '',
        'Version': item.version || '',
        'Created At': formatDate(item.createdAt),
        'Updated At': formatDate(item.updatedAt)
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Compliance Report");
      
      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Save file
      saveAs(blob, `Employee_Compliance_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      Swal.fire({
        icon: "success",
        title: "Export Successful",
        text: `Exported ${exportData.length} records to Excel`,
        confirmButtonColor: "#1d4ed8",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "Failed to export data. Please try again.",
        confirmButtonColor: "#1d4ed8",
      });
    }
  };

  // Export selected rows
  const exportSelected = () => {
    if (selectedRows.size === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Selection",
        text: "Please select rows to export",
        confirmButtonColor: "#1d4ed8",
      });
      return;
    }

    const selectedData = filteredData.filter(item => selectedRows.has(item.id));
    exportDataToExcel(selectedData, `Selected_Compliance_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportDataToExcel = (dataToExport, filename) => {
    const exportData = dataToExport.map(item => ({
      'ECode': item.ecode || '',
      'Employee Name': item.fullName || '',
      'Status': item.accepted ? 'Accepted' : 'Pending',
      'Accepted At': item.acceptedAt ? formatDate(item.acceptedAt) : 'Not Accepted',
      'IP Address': item.ipAddress || '',
      'User Agent': item.userAgent || '',
      'Version': item.version || '',
      'Created At': formatDate(item.createdAt),
      'Updated At': formatDate(item.updatedAt)
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Compliance Report");
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(blob, filename);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Print report
  const printReport = () => {
    window.print();
  };

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPrevPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftSide = Math.floor(maxVisiblePages / 2);
      const rightSide = Math.ceil(maxVisiblePages / 2) - 1;
      
      let startPage = currentPage - leftSide;
      let endPage = currentPage + rightSide;
      
      if (startPage < 1) {
        endPage += Math.abs(startPage) + 1;
        startPage = 1;
      }
      
      if (endPage > totalPages) {
        startPage -= endPage - totalPages;
        endPage = totalPages;
        if (startPage < 1) startPage = 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  // Check if all rows in current page are selected
  const isCurrentPageSelected = () => {
    const currentPageData = getCurrentPageData();
    return currentPageData.length > 0 && currentPageData.every(item => selectedRows.has(item.id));
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#f8f9fa] py-16 px-4 md:px-20 font-sans mt-14 print:px-0">
        {/* Breadcrumb */}
        <div className="mb-8 print:hidden">
          <div className="text-sm text-gray-500 font-medium mb-2">
            <a href="/Dashboard" className="text-black hover:underline">Home</a> / 
            <a href="/reports" className="text-black hover:underline"> Reports</a> / 
            <span className="text-black font-semibold"> Employee Compliance Acknowledgement</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Employee Compliance Acknowledgement Report
              </h1>
              <p className="text-gray-600 mt-2">
                Track employee acceptance of company terms and policies
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={printReport}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
              >
                <Printer size={18} /> Print
              </button>
              <button
                onClick={exportToExcel}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <Download size={18} /> Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 print:grid-cols-4 print:gap-2">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Total Employees</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
              </div>
              <User className="text-blue-500 w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Accepted</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.accepted}</p>
              </div>
              <CheckCircle className="text-green-500 w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Pending</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.pending}</p>
              </div>
              <XCircle className="text-red-500 w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Acceptance Rate</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.acceptanceRate}%</p>
              </div>
              <FileText className="text-purple-500 w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 print:hidden">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by ECode or Name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="accepted">Accepted</option>
                <option value="pending">Pending</option>
              </select>

              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={recordsPerPage}
                onChange={(e) => setRecordsPerPage(Number(e.target.value))}
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
                <option value={250}>250 per page</option>
              </select>

              <button
                onClick={exportSelected}
                disabled={selectedRows.size === 0}
                className={`px-3 py-2 rounded-lg transition flex items-center gap-2 ${
                  selectedRows.size === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <Download size={16} /> Export Selected ({selectedRows.size})
              </button>

              <button
                onClick={fetchData}
                className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="animate-spin w-8 h-8 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading compliance data...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">No compliance data found</p>
              <p className="text-gray-500 text-sm mt-2">
                {searchTerm ? 'Try adjusting your search term' : 'No data available'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={isCurrentPageSelected()}
                          onChange={selectCurrentPage}
                          title="Select/Deselect all on this page"
                        />
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("ecode")}
                      >
                        <div className="flex items-center gap-1">
                          ECode
                          {sortField === "ecode" && (
                            sortDirection === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("fullName")}
                      >
                        <div className="flex items-center gap-1">
                          Employee Name
                          {sortField === "fullName" && (
                            sortDirection === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("accepted")}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          {sortField === "accepted" && (
                            sortDirection === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("acceptedAt")}
                      >
                        <div className="flex items-center gap-1">
                          Accepted At
                          {sortField === "acceptedAt" && (
                            sortDirection === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Version
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getCurrentPageData().map((item) => (
                      <React.Fragment key={item.id}>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              checked={selectedRows.has(item.id)}
                              onChange={() => toggleSelection(item.id)}
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.ecode}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">
                              {item.fullName || "N/A"}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {item.accepted ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" /> Accepted
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3 mr-1" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {item.acceptedAt ? formatDate(item.acceptedAt) : "Not Accepted"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {item.ipAddress || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs">
                              v{item.version}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <button
                              onClick={() => toggleRow(item.id)}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            >
                              {expandedRows.has(item.id) ? (
                                <>
                                  <ChevronUp size={14} /> Hide
                                </>
                              ) : (
                                <>
                                  <Eye size={14} /> View
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                        {expandedRows.has(item.id) && (
                          <tr className="bg-blue-50">
                            <td colSpan="8" className="px-4 py-3">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">User Agent:</span>
                                  <div className="text-gray-600 mt-1 text-xs font-mono bg-white p-2 rounded border">
                                    {item.userAgent || "N/A"}
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Created:</span>
                                  <div className="text-gray-600 mt-1">
                                    {formatDate(item.createdAt)}
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Updated:</span>
                                  <div className="text-gray-600 mt-1">
                                    {formatDate(item.updatedAt)}
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Record ID:</span>
                                  <div className="text-gray-600 mt-1 font-mono">
                                    {item.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-sm text-gray-600 mb-2 md:mb-0">
                    Showing{" "}
                    <span className="font-semibold">
                      {Math.min((currentPage - 1) * recordsPerPage + 1, filteredData.length)}-
                      {Math.min(currentPage * recordsPerPage, filteredData.length)}
                    </span>{" "}
                    of <span className="font-semibold">{filteredData.length}</span> records
                    {selectedRows.size > 0 && (
                      <span className="ml-4 text-blue-600">
                        ({selectedRows.size} selected)
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={goToFirstPage}
                      disabled={currentPage === 1}
                      className={`p-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                      title="First Page"
                    >
                      <ChevronsLeft size={18} />
                    </button>
                    
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className={`p-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                      title="Previous Page"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {getPageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`w-8 h-8 rounded flex items-center justify-center ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="px-1">...</span>
                          <button
                            onClick={goToPage(totalPages)}
                            className={`w-8 h-8 rounded flex items-center justify-center ${
                              currentPage === totalPages
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                      title="Next Page"
                    >
                      <ChevronRight size={18} />
                    </button>
                    
                    <button
                      onClick={goToLastPage}
                      disabled={currentPage === totalPages}
                      className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                      title="Last Page"
                    >
                      <ChevronsRight size={18} />
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-600 mt-2 md:mt-0 md:ml-4">
                    Page <span className="font-semibold">{currentPage}</span> of{" "}
                    <span className="font-semibold">{totalPages}</span>
                  </div>
                </div>
              </div>

              {/* Selection Summary */}
              {selectedRows.size > 0 && (
                <div className="bg-blue-50 px-4 py-2 border-t border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-blue-700">
                      <span className="font-semibold">{selectedRows.size}</span> row(s) selected
                      <button
                        onClick={selectAllFiltered}
                        className="ml-4 text-blue-600 hover:text-blue-800 underline text-xs"
                      >
                        {selectedRows.size === filteredData.length ? "Deselect all" : "Select all filtered"}
                      </button>
                    </div>
                    <button
                      onClick={() => setSelectedRows(new Set())}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500 print:hidden">
          <p>This report shows employee acceptance of company terms and policies.</p>
          <p className="mt-1">Data is automatically refreshed. Click Refresh to get latest data.</p>
          <p className="mt-1 text-xs text-gray-400">
            Showing {recordsPerPage} records per page • Total records: {stats.total}
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          body {
            background: white !important;
          }
          .mt-14 {
            margin-top: 0 !important;
          }
          table {
            width: 100% !important;
            font-size: 10pt !important;
          }
          th, td {
            padding: 4px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ComplianceReport;