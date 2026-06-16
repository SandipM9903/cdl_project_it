import React, { useState, useCallback } from "react";
import axios from "axios";
import ReportLayout from "../ReportLayout";
import { simpleEncrypt } from "../../simpleEncrypt";

// const REPORT_API_URL = "http://localhost:9026/api/it-proof-investment-report/report";
const REPORT_API_URL = "http://43.205.24.208:9026/api/it-proof-investment-report/report";

const BASE_URL = "http://43.205.24.208";
const DOC_SERVICE_PORT = "9023";
const DOCUMENT_ACCESS_URL = `${BASE_URL}:${DOC_SERVICE_PORT}/documents/my-docs/download`;

const BASE_COLUMNS = [
  "Employee Name",
  "Employee Code",
  "PAN No.",
  "Financial Year",
  "Department",
  "Section",
  "Component",
  "Particular",
  "Revised Amount",
  "Modified Date",
  "Remarks",
  "Landlord Name",
  "Landlord PAN No.",
  "Uploaded Docs",
  "Actions"
];

// Columns for Excel export (exclude Actions)
const EXCEL_COLUMNS = BASE_COLUMNS.filter(col => col !== "Actions");

function ITProofInvestmentReport() {
  const [columnOptions, setColumnOptions] = useState(BASE_COLUMNS);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [hideZeroAmounts, setHideZeroAmounts] = useState(true);
  const [lastFilters, setLastFilters] = useState(null);
  const [departmentMap, setDepartmentMap] = useState({});
  const [showDocumentPopup, setShowDocumentPopup] = useState(false);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState("");
  const [selectedDocumentIds, setSelectedDocumentIds] = useState("");
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState("");
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("");
  const [downloadAllProgress, setDownloadAllProgress] = useState({ current: 0, total: 0 });

  const handleFilterChange = useCallback(async (filters) => {
    const year = filters?.selectedYear;
    if (!year) return;

    try {
      setLoading(true);

      const { data } = await axios.get(`${REPORT_API_URL}?financialYear=${year}`);

      const reports = data?.data || [];

      setColumnOptions(BASE_COLUMNS);
    } catch (err) {
      console.error("Error in filter change:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyDurationFilter = (reports, startDate, endDate) => {
    if (!startDate || !endDate) return reports;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return reports.filter((report) => {
      if (!report.modifiedDate) return false;
      const modified = new Date(report.modifiedDate);
      return modified >= start && modified <= end;
    });
  };

  const toggleHideZeroAmounts = () => {
    setHideZeroAmounts(prev => !prev);
    if (lastFilters) {
      handleGenerate(lastFilters);
    }
  };

  const getDepartmentName = (empCode) => {
    return departmentMap[empCode] || "N/A";
  };

  const handleGenerate = useCallback(async (filters) => {
    const { selectedYear, startDate, endDate } = filters;
    
    setLastFilters(filters);

    if (!selectedYear) {
      alert("Please select a Financial Year");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(`${REPORT_API_URL}?financialYear=${selectedYear}`);

      let reports = data?.data || [];
      
      // Apply date filter first
      reports = applyDurationFilter(reports, startDate, endDate);
      
      // Apply zero amount filter based on state
      if (hideZeroAmounts) {
        reports = reports.filter(report => report.revisedAmount !== 0);
      }

      const formatted = reports.map((report) => {        
        return {
          "Employee Name": report.employeeName || "Unknown Employee",
          "Employee Code": report.employeeCode || "",
          "PAN No.": report.panNo || "Not Available",
          "Financial Year": report.financialYear || "",
          "Department": report.department,
          "Section": report.section || "",
          "Component": report.component || "",
          "Particular": report.particular || "",
          "Revised Amount": report.revisedAmount?.toFixed(2) || "0.00",
          "Modified Date": report.modifiedDate || "",
          "Remarks": report.remarks || "",
          "Landlord Name": report.landlordName || "",
          "Landlord PAN No.": report.landlordPanNumber || "",
          "Uploaded Docs": report.uploadedDocs || "No",
          "Document IDs": report.documentIds || "", // Keep for internal use
          "Document Name": report.documentCaption || "", // Document captions
          "Actions": "" // Placeholder for actions
        };
      });

      setFilteredEmployees(formatted);
    } catch (err) {
      console.error("Error generating report:", err);
      alert("Failed to fetch report. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [hideZeroAmounts, departmentMap]);

  const buildSecureViewUrl = (docId, empCode) => {
    if (!empCode) {
      throw new Error("Employee code missing");
    }

    return (
      `${DOCUMENT_ACCESS_URL}` +
      `?docId=${simpleEncrypt(docId.toString())}` +
      `&empCode=${simpleEncrypt(empCode)}`
    );
  };

  const handleViewDocuments = (documentNames, documentIds, employeeName, employeeCode, financialYear) => {
    setSelectedDocumentNames(documentNames || "No documents available");
    setSelectedDocumentIds(documentIds || "");
    setSelectedEmployeeName(employeeName || "Unknown Employee");
    setSelectedEmployeeCode(employeeCode || "");
    setSelectedFinancialYear(financialYear || "");
    setShowDocumentPopup(true);
  };

  // FIXED: Download file without opening new tab
  const handleDownloadFile = async (documentId, fileName, empCode) => {
    try {
      setDownloading(true);
      
      const url = buildSecureViewUrl(documentId, empCode);
      
      // Create a hidden anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `document_${documentId}`; // Set the filename for download
      link.target = '_blank'; // Keep target blank but it won't open new tab visibly
      link.style.display = 'none';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
        setDownloading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Unable to download document.");
      setDownloading(false);
    }
  };

  // New function to handle Download All
  const handleDownloadAll = async () => {
    // Collect all document IDs from filtered employees
    const allDocumentIds = [];
    const documentMap = new Map(); // To store document names by ID
    
    filteredEmployees.forEach(emp => {
      if (emp["Document IDs"] && emp["Document IDs"].trim() !== "") {
        const ids = emp["Document IDs"].split(',').map(id => id.trim()).filter(id => id);
        const names = emp["Document Name"] ? emp["Document Name"].split(',').map(name => name.trim()) : [];
        
        ids.forEach((id, index) => {
          if (!allDocumentIds.includes(id)) {
            allDocumentIds.push(id);
            documentMap.set(id, names[index] || `Document_${id}`);
          }
        });
      }
    });

    if (allDocumentIds.length === 0) {
      alert("No documents available to download.");
      return;
    }

    // Confirm with user
    if (!window.confirm(`You are about to download ${allDocumentIds.length} document(s). Continue?`)) {
      return;
    }

    try {
      setDownloading(true);
      setDownloadAllProgress({ current: 0, total: allDocumentIds.length });

      // Create a zip file using JSZip (you'll need to install it)
      const JSZip = require('jszip');
      const zip = new JSZip();
      
      // Download each file and add to zip
      for (let i = 0; i < allDocumentIds.length; i++) {
        const docId = allDocumentIds[i];
        const fileName = documentMap.get(docId) || `document_${docId}`;
        
        try {
          // Create download URL for each document
          const url = buildSecureViewUrl(docId, filteredEmployees[0]?.["Employee Code"] || "");
          
          // Fetch the file as blob
          const response = await fetch(url);
          const blob = await response.blob();
          
          zip.file(fileName, blob);
          setDownloadAllProgress({ current: i + 1, total: allDocumentIds.length });
        } catch (error) {
          console.error(`Error downloading document ${docId}:`, error);
          // Continue with other files even if one fails
        }
      }

      // Generate and download zip file
      const zipContent = await zip.generateAsync({ type: 'blob' });
      const zipUrl = window.URL.createObjectURL(zipContent);
      const zipLink = document.createElement('a');
      zipLink.href = zipUrl;
      zipLink.setAttribute('download', `All_Documents_${new Date().toISOString().split('T')[0]}.zip`);
      document.body.appendChild(zipLink);
      zipLink.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(zipLink);
        window.URL.revokeObjectURL(zipUrl);
        setDownloading(false);
        setDownloadAllProgress({ current: 0, total: 0 });
      }, 1000);

    } catch (error) {
      console.error('Error in bulk download:', error);
      alert('Failed to download documents. Please try again.');
      setDownloading(false);
      setDownloadAllProgress({ current: 0, total: 0 });
    }
  };

  const closePopup = () => {
    setShowDocumentPopup(false);
    setSelectedDocumentNames("");
    setSelectedDocumentIds("");
    setSelectedEmployeeName("");
    setSelectedEmployeeCode("");
    setSelectedFinancialYear("");
  };

  const renderTableCell = (column, emp, rowIndex) => {
    if (column === "Revised Amount" && emp[column]) {
      return (
        <td
          key={`${rowIndex}-${column}`}
          className="px-4 py-3 whitespace-nowrap text-gray-700 text-right font-medium"
        >
          ₹{emp[column]}
        </td>
      );
    }

    if (column === "Uploaded Docs") {
      const value = emp[column];
      return (
        <td
          key={`${rowIndex}-${column}`}
          className="px-4 py-3 whitespace-nowrap"
        >
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Yes" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {value}
          </span>
        </td>
      );
    }

    if (column === "Department") {
      return (
        <td
          key={`${rowIndex}-${column}`}
          className="px-4 py-3 whitespace-nowrap"
        >
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
            emp[column] !== "N/A" 
              ? "bg-purple-50 text-purple-700" 
              : "bg-gray-50 text-gray-500"
          }`}>
            {emp[column]}
          </span>
        </td>
      );
    }

    if (column === "Actions") {
      return (
        <td
          key={`${rowIndex}-${column}`}
          className="px-4 py-3 whitespace-nowrap text-center"
        >
          <button
            onClick={() => handleViewDocuments(
              emp["Document Name"], 
              emp["Document IDs"],
              emp["Employee Name"],
              emp["Employee Code"],
              emp["Financial Year"]
            )}
            className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 group"
            title="View Document Names"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.color = '#b91c1c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.color = '#ef4444';
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-200" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </td>
      );
    }

    return (
      <td
        key={`${rowIndex}-${column}`}
        className="px-4 py-3 whitespace-nowrap text-gray-700"
      >
        {emp[column] ?? ""}
      </td>
    );
  };

  const getSearchableValue = (item, column) => {
    if (column === "Revised Amount") {
      return item[column]?.toString() || "";
    }
    if (column === "Actions") {
      return ""; // Actions column is not searchable
    }
    return item[column] || "";
  };

  const columnKeyMap = {
    "Employee Name": "Employee Name",
    "Employee Code": "Employee Code",
    "PAN No.": "PAN No.",
    "Financial Year": "Financial Year",
    "Department": "Department",
    "Section": "Section",
    "Component": "Component",
    "Particular": "Particular",
    "Revised Amount": "Revised Amount",
    "Modified Date": "Modified Date",
    "Remarks": "Remarks",
    "Landlord Name": "Landlord Name",
    "Landlord PAN No.": "Landlord PAN No.",
    "Uploaded Docs": "Uploaded Docs",
    "Actions": "Actions"
  };

  // Function to get document IDs array
  const getDocumentIdsArray = () => {
    if (!selectedDocumentIds) return [];
    return selectedDocumentIds.split(',').map(id => id.trim()).filter(id => id);
  };

  // Function to get document names array
  const getDocumentNamesArray = () => {
    if (!selectedDocumentNames) return [];
    return selectedDocumentNames.split(',').map(name => name.trim()).filter(name => name);
  };

  // Combine document names with their IDs
  const getDocumentsList = () => {
    const ids = getDocumentIdsArray();
    const names = getDocumentNamesArray();
    
    // Create array of objects with id and name
    return ids.map((id, index) => ({
      id: id,
      name: names[index] || `Document ${id}`
    }));
  };

  // Prepare Excel data (exclude Actions column)
  const prepareExcelData = () => {
    return filteredEmployees.map(emp => {
      const excelRow = {};
      EXCEL_COLUMNS.forEach(col => {
        // Handle special formatting for certain columns
        if (col === "Revised Amount" && emp[col]) {
          excelRow[col] = `₹${emp[col]}`;
        } else if (col === "Uploaded Docs") {
          excelRow[col] = emp[col] || "No";
        } else {
          excelRow[col] = emp[col] || "";
        }
      });
      return excelRow;
    });
  };

  return (
    <>
      {/* Add Font Awesome CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" 
      />

      {(loading || downloading) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="loader mb-4" style={{ color: '#ef4444' }}></div>
            <p className="text-gray-700 font-medium">
              {downloading ? (
                downloadAllProgress.total > 0 ? (
                  <>Downloading files... {downloadAllProgress.current} of {downloadAllProgress.total}</>
                ) : (
                  'Downloading file...'
                )
              ) : (
                'Loading IT Proof Investment Report...'
              )}
            </p>
          </div>
        </div>
      )}

      {/* Document Names Popup */}
      {showDocumentPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b rounded-t-xl" 
                 style={{ background: 'linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.1))' }}>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg className="h-5 w-5 mr-2" style={{ color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Document Names
                </h3>
                <div className="mt-1 ml-7">
                  <p className="text-sm font-medium text-gray-700">{selectedEmployeeName}</p>
                  {selectedEmployeeCode && (
                    <p className="text-xs text-gray-500">Code: {selectedEmployeeCode}</p>
                  )}
                  {selectedFinancialYear && (
                    <p className="text-xs text-gray-500">FY: {selectedFinancialYear}</p>
                  )}
                </div>
              </div>
              <button
                onClick={closePopup}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 max-h-80 overflow-y-auto">
              {selectedDocumentNames && selectedDocumentNames !== "No documents available" ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-2">Associated Documents:</p>
                  <div className="flex flex-col gap-2">
                    {getDocumentsList().map((doc, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg text-sm border shadow-sm hover:shadow-md transition-shadow group"
                        style={{ 
                          background: 'linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.1))',
                          borderColor: 'rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#ef4444' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="font-medium truncate" style={{ color: '#b91c1c' }} title={doc.name}>
                            {doc.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(doc.id, doc.name, selectedEmployeeCode)}
                          className="ml-3 w-8 h-8 flex items-center justify-center rounded-md bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 flex-shrink-0"
                          title="Download file"
                          disabled={downloading}
                        >
                          <i className="fas fa-download text-sm"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-500 font-medium">{selectedDocumentNames}</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={closePopup}
                className="px-5 py-2 text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg text-sm font-medium"
                style={{ 
                  background: 'linear-gradient(to right, #ef4444, #dc2626)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, #dc2626, #b91c1c)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, #ef4444, #dc2626)';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .loader {
          width: 40px;
          height: 40px;
          background: 
            conic-gradient(from -45deg at top 20px left 50%, #0000, currentColor 1deg 90deg, #0000 91deg),
            conic-gradient(from 45deg at right 20px top 50%, #0000, currentColor 1deg 90deg, #0000 91deg),
            conic-gradient(from 135deg at bottom 20px left 50%, #0000, currentColor 1deg 90deg, #0000 91deg),
            conic-gradient(from -135deg at left 20px top 50%, #0000, currentColor 1deg 90deg, #0000 91deg);
          animation: l4 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
        }
        @keyframes l4 {
          50% {
            width: 60px;
            height: 60px;
            transform: rotate(180deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        /* Ensure Font Awesome icons are visible */
        .fas {
          font-family: "Font Awesome 6 Free";
          font-weight: 900;
          display: inline-block;
          font-style: normal;
          font-variant: normal;
          text-rendering: auto;
          line-height: 1;
        }
      `}</style>

      <div className="mb-4 flex items-center justify-between -mt-10">
        <div className="flex items-center gap-4">
          <label className="flex items-center cursor-pointer bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={hideZeroAmounts}
              onChange={toggleHideZeroAmounts}
              className="form-checkbox h-5 w-5 rounded border-gray-300 focus:ring-offset-0"
              style={{ color: '#ef4444' }}
            />
            <span className="ml-2 text-sm text-gray-700 font-medium">
              Hide rows with Revised Amount = ₹0
            </span>
          </label>
          
          {Object.keys(departmentMap).length > 0 && (
            <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
              ✓ Department data loaded for {Object.keys(departmentMap).length} employees
            </div>
          )}
        </div>
        
        {filteredEmployees.length > 0 && (
          <div className="text-sm px-4 py-2 rounded-lg" 
               style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#b91c1c' }}>
            Showing {filteredEmployees.length} records {hideZeroAmounts ? '(excluding zero amounts)' : ''}
          </div>
        )}
      </div>

      <ReportLayout
        reportTitle="IT Proof Investment Report"
        sheetName="IT Proof Investment Report"
        columnOptions={columnOptions}
        data={filteredEmployees}
        renderTableCell={renderTableCell}
        onGenerate={handleGenerate}
        onFilterChange={handleFilterChange}
        getSearchableValue={getSearchableValue}
        columnKeyMap={columnKeyMap}
        financialYears={["2025-26", "2024-25", "2023-24", "2022-23"]}
        excelColumns={EXCEL_COLUMNS} // Pass columns without Actions
        excelData={prepareExcelData()} // Pass data without Actions
        // showDownloadAllButton={true} // Enable Download All button for this report
        // onDownloadAll={handleDownloadAll} // Pass the Download All handler
      />
    </>
  );
}

export default ITProofInvestmentReport;