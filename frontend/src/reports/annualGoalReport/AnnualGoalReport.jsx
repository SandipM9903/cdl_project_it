import React, { useState } from "react";
import ReportLayout from "../ReportLayout";
import {
  FaGrinStars,
  FaSmile,
  FaMeh,
  FaFrown,
  FaGrinTears,
} from "react-icons/fa";
import * as XLSX from "xlsx";

function OverallGoalSettingReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Use relative URL or configure properly
  // const BASE_URL = "http://43.205.24.208:9009";
  // const BASE_URL = "http://localhost:9009";
  const BASE_URL = "https://mycdl.cms.co.in";

  const statusOptions = [
    {
      value: "ALL",
      label: "All Status",
      color: "#6B7280",
      bgColor: "#F3F4F6",
      icon: "📊",
    },
    {
      value: "DRAFT",
      label: "Draft",
      color: "#9CA3AF",
      bgColor: "#F9FAFB",
      icon: "📝",
    },
    {
      value: "SUBMITTED_TO_EMPLOYEE",
      label: "Submitted to Employee",
      color: "#3B82F6",
      bgColor: "#EFF6FF",
      icon: "👥",
    },
    {
      value: "SUBMITTED_TO_R1",
      label: "Submitted to R1",
      color: "#F59E0B",
      bgColor: "#FEF3C7",
      icon: "⭐",
    },
    {
      value: "SUBMITTED_TO_HR",
      label: "Submitted to HR",
      color: "#10B981",
      bgColor: "#D1FAE5",
      icon: "✅",
    },
  ];

  const feelingOptions = {
    very_happy: {
      value: "very_happy",
      label: "Very Happy",
      emoji: "😊",
      icon: FaGrinStars,
      color: "bg-green-100 text-green-700",
    },
    happy: {
      value: "happy",
      label: "Happy",
      emoji: "🙂",
      icon: FaSmile,
      color: "bg-emerald-100 text-emerald-700",
    },
    neutral: {
      value: "neutral",
      label: "Neutral",
      emoji: "😐",
      icon: FaMeh,
      color: "bg-yellow-100 text-yellow-700",
    },
    unhappy: {
      value: "unhappy",
      label: "Unhappy",
      emoji: "😞",
      icon: FaFrown,
      color: "bg-orange-100 text-orange-700",
    },
    very_unhappy: {
      value: "very_unhappy",
      label: "Very Unhappy",
      emoji: "😢",
      icon: FaGrinTears,
      color: "bg-red-100 text-red-700",
    },
  };

  const getFinancialYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 3; i >= 0; i--) {
      const startYear = currentYear - i;
      const endYear = startYear + 1;
      years.push(`${startYear}-${endYear}`);
    }
    return years;
  };

  const financialYears = getFinancialYears();

  const columnOptions = [
    "Employee Name",
    "Employee Code",
    "Manager Name",
    "Manager Code",
    "Manager Email ID",
    "Financial Year",
    "Status",
    "Performance",
    "Potential",
    "Achievement Level",
    "Matrix Category",
    "Manager Rating",
    "Manager Remarks",
    "Key Accomplishment",
    "Additional Feedback",
    "Employee Feeling",
    "Employee Comment",
    "Employee Comment Text",
    "Send Back Count",
    "Send Back Remarks",
    "Discussed With R1",
    "Talent Resource",
    "Main Department",
    "Sub Department",
    "Location Name",
    "Submitted To HR Date",
    "Submitted At",
    "Created At",
  ];

  const defaultSelectedColumns = [
    "Employee Name",
    "Employee Code",
    "Manager Name",
    "Financial Year",
    "Status",
    "Performance",
    "Potential",
    "Achievement Level",
    "Manager Rating",
    "Employee Feeling",
    "Location Name",
    "Key Accomplishment",
  ];

  const columnKeyMap = {
    "Employee Name": "employeeFullName",
    "Employee Code": "employeeId",
    "Manager Name": "managerFullName",
    "Manager Code": "managerEmpCode",
    "Manager Email ID": "managerEmailId",
    "Financial Year": "financialYear",
    Status: "status",
    Performance: "performance",
    Potential: "potential",
    "Achievement Level": "achievementLevel",
    "Matrix Category": "matrixCategory",
    "Manager Rating": "managerRating",
    "Manager Remarks": "managerRemarks",
    "Key Accomplishment": "keyAccomplishment",
    "Additional Feedback": "additionalFeedback",
    "Employee Feeling": "employeeFeeling",
    "Employee Comment": "employeeComment",
    "Employee Comment Text": "employeeCommentText",
    "Send Back Count": "sendBackCount",
    "Send Back Remarks": "sendBackRemarks",
    "Discussed With R1": "discussedWithR1",
    "Talent Resource": "talentResource",
    "Main Department": "mainDepartment",
    "Sub Department": "subDepartment",
    "Location Name": "locationName",
    "Submitted To HR Date": "submittedToHrDate",
    "Submitted At": "submittedAt",
    "Created At": "createdAt",
  };

  // Convert HTML to clean plain text for Excel export
  const htmlToPlainText = (html) => {
    if (!html || typeof html !== "string") return html || "";

    // Create a temporary div element
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Replace various HTML elements with proper text formatting
    let text = tempDiv.innerHTML;

    // Replace <br> and </p> with newlines
    text = text.replace(/<br\s*\/?>/gi, "\n");
    text = text.replace(/<\/p>/gi, "\n\n");
    text = text.replace(/<p[^>]*>/gi, "");
    text = text.replace(/<\/h[1-6]>/gi, "\n\n");
    text = text.replace(/<h[1-6][^>]*>/gi, "");
    text = text.replace(/<\/div>/gi, "\n");
    text = text.replace(/<div[^>]*>/gi, "");
    text = text.replace(/<\/li>/gi, "\n");
    text = text.replace(/<li[^>]*>/gi, "• ");
    text = text.replace(/<\/ul>/gi, "\n");
    text = text.replace(/<ul[^>]*>/gi, "");
    text = text.replace(/<\/ol>/gi, "\n");
    text = text.replace(/<ol[^>]*>/gi, "");
    text = text.replace(/<strong>/gi, "");
    text = text.replace(/<\/strong>/gi, "");
    text = text.replace(/<b>/gi, "");
    text = text.replace(/<\/b>/gi, "");
    text = text.replace(/<em>/gi, "");
    text = text.replace(/<\/em>/gi, "");
    text = text.replace(/<i>/gi, "");
    text = text.replace(/<\/i>/gi, "");
    text = text.replace(/&nbsp;/gi, " ");
    text = text.replace(/&amp;/gi, "&");
    text = text.replace(/&lt;/gi, "<");
    text = text.replace(/&gt;/gi, ">");
    text = text.replace(/&quot;/gi, '"');

    // Remove all remaining HTML tags
    text = text.replace(/<[^>]*>/g, "");

    // Clean up multiple newlines
    text = text.replace(/\n\s*\n\s*\n/g, "\n\n");
    text = text.replace(/[ \t]+/g, " ");
    text = text.trim();

    return text;
  };

  // Format plain text with proper indentation for better readability in Excel
  const formatPlainTextForExcel = (html) => {
    const plainText = htmlToPlainText(html);
    // Split into lines and format
    const lines = plainText.split("\n");
    const formattedLines = [];

    for (let line of lines) {
      // Check if line starts with a number pattern (like "1) Project -")
      if (/^\d+\)/.test(line.trim())) {
        formattedLines.push("\n" + line.trim());
      }
      // Check if line starts with bullet point
      else if (line.trim().startsWith("•")) {
        formattedLines.push("  " + line.trim());
      }
      // Check for client or brief lines
      else if (
        line
          .trim()
          .toLowerCase()
          .startsWith("client") ||
        line
          .trim()
          .toLowerCase()
          .startsWith("brief")
      ) {
        formattedLines.push("  " + line.trim());
      } else if (line.trim().length > 0) {
        formattedLines.push(line.trim());
      }
    }

    return formattedLines.join("\n").trim();
  };

  const fetchReportData = async (
    financialYear,
    startDate,
    endDate,
    selectedEmployees,
    status,
  ) => {
    setLoading(true);
    setError(null);

    try {
      let url;
      if (startDate && endDate) {
        const formatDate = (date) => {
          const d = new Date(date);
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          return `${day}-${month}-${year}`;
        };
        url = `${BASE_URL}/api/reports/search-by-date?startDate=${formatDate(
          startDate,
        )}&endDate=${formatDate(endDate)}&status=${status}`;
      } else {
        url = `${BASE_URL}/api/reports/search-by-year?financialYear=${financialYear}&status=${status}`;
      }

      console.log("Fetching URL:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch reports: ${response.status} - ${errorText}`,
        );
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      setReportData(data);
      return data;
    } catch (error) {
      console.error("Error fetching report data:", error);
      setError(error.message);
      setReportData([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (filters) => {
    const { selectedYear, startDate, endDate, selectedEmployees } = filters;
    return await fetchReportData(
      selectedYear,
      startDate,
      endDate,
      selectedEmployees,
      selectedStatus,
    );
  };

  const getSearchableValue = (item, column) => {
    const key = columnKeyMap[column] || column;
    let value = item[key];
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value === null || value === undefined) return "";

    if (key === "keyAccomplishment" && value) {
      return htmlToPlainText(value);
    }

    if (key === "employeeFeeling" && value) {
      const feeling = feelingOptions[value];
      return feeling ? feeling.label : value;
    }
    if (column === "Status" && value) {
      const statusOption = statusOptions.find((opt) => opt.value === value);
      return statusOption ? statusOption.label : value;
    }
    return String(value);
  };

  // Custom Excel export function with proper plain text formatting
  const handleExcelExport = (data, selectedColumns, sheetName) => {
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }

    // Prepare data for Excel
    const exportData = data.map((item) => {
      const row = {};
      selectedColumns.forEach((column) => {
        const key = columnKeyMap[column] || column;
        let value = item[key];

        if (value === null || value === undefined) {
          row[column] = "";
        } else if (key === "keyAccomplishment") {
          // Convert HTML to properly formatted plain text for Excel
          row[column] = formatPlainTextForExcel(value);
        } else if (key === "employeeFeeling" && value) {
          const feeling = feelingOptions[value];
          row[column] = feeling ? feeling.label : value;
        } else if (column === "Status" && value) {
          const statusOption = statusOptions.find((opt) => opt.value === value);
          row[column] = statusOption ? statusOption.label : value;
        } else if (typeof value === "boolean") {
          row[column] = value ? "Yes" : "No";
        } else if (
          ["submittedAt", "createdAt", "submittedToHrDate"].includes(key) &&
          value
        ) {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            row[column] = date.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          } else {
            row[column] = value;
          }
        } else {
          row[column] = value;
        }
      });
      return row;
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = {};
    Object.keys(exportData[0] || {}).forEach((col) => {
      let maxLength = col.length;
      exportData.forEach((row) => {
        const cellValue = String(row[col] || "");
        // For Key Accomplishment column, use a larger width
        if (col === "Key Accomplishment") {
          maxLength = Math.max(maxLength, Math.min(cellValue.length, 80));
        } else {
          maxLength = Math.max(maxLength, Math.min(cellValue.length, 40));
        }
      });
      colWidths[col] = Math.min(maxLength, 80);
    });

    ws["!cols"] = Object.keys(exportData[0] || {}).map((col) => ({
      wch: colWidths[col],
    }));

    // Apply text wrapping and vertical alignment to all cells
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1:A1");
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
          alignment: {
            wrapText: true,
            vertical: "top",
            horizontal: "left",
          },
        };
      }
    }

    // Set row height for better readability
    ws["!rows"] = [{ hpt: 30 }];

    // Create workbook and export
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName}.xlsx`);
  };

  const getFeelingDisplay = (feelingValue) => {
    const feeling = feelingOptions[feelingValue];
    if (!feeling)
      return <span className="capitalize">{feelingValue || "N/A"}</span>;
    const IconComponent = feeling.icon;
    return (
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${feeling.color}`}
        >
          <IconComponent className="w-4 h-4" />
          <span className="text-sm font-medium">{feeling.emoji}</span>
          <span className="text-sm font-medium capitalize">
            {feeling.label}
          </span>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    if (!status) return <span className="text-gray-500">N/A</span>;
    const statusConfig = {
      DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-800" },
      SUBMITTED_TO_EMPLOYEE: {
        label: "Submitted to Employee",
        color: "bg-blue-100 text-blue-800",
      },
      SUBMITTED_TO_R1: {
        label: "Submitted to R1",
        color: "bg-yellow-100 text-yellow-800",
      },
      SUBMITTED_TO_HR: {
        label: "Submitted to HR",
        color: "bg-green-100 text-green-800",
      },
    };
    const config = statusConfig[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  // Component for displaying Key Accomplishment with scrollable container
  const KeyAccomplishmentCell = ({ htmlContent }) => {
    const [expanded, setExpanded] = useState(false);
    const plainText = htmlContent ? htmlToPlainText(htmlContent) : "N/A";
    const previewText =
      plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText;

    if (!htmlContent) {
      return <span className="text-gray-400 text-sm">N/A</span>;
    }

    return (
      <div className="max-w-md">
        <div
          className={`text-sm text-gray-700 whitespace-pre-wrap break-words ${
            !expanded ? "line-clamp-4" : ""
          }`}
          style={{
            maxHeight: expanded ? "300px" : "80px",
            overflowY: expanded ? "auto" : "hidden",
            overflowX: "hidden",
          }}
        >
          {expanded ? plainText : previewText}
        </div>
        {(plainText.length > 150 ||
          (htmlContent &&
            htmlToPlainText(htmlContent).split("\n").length > 4)) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-red-500 hover:text-red-700 mt-1 font-medium focus:outline-none"
          >
            {expanded ? "Show Less ▲" : "Read More ▼"}
          </button>
        )}
      </div>
    );
  };

  const renderTableCell = (column, item, index) => {
    const key = columnKeyMap[column] || column;
    let value = item[key];

    // Special handling for Key Accomplishment column with scrollable view
    if (column === "Key Accomplishment") {
      return (
        <td
          className="px-3 py-2 align-top"
          style={{ minWidth: "300px", maxWidth: "400px" }}
        >
          <KeyAccomplishmentCell htmlContent={value} />
        </td>
      );
    }

    // Date formatting
    if (
      [
        "submittedAt",
        "createdAt",
        "submittedToHrDate",
        "managerAnnualReviewSubmissionDate",
        "lastSendBackAt",
      ].includes(key)
    ) {
      if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          value = date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        }
      }
    }

    if (typeof value === "boolean") value = value ? "Yes" : "No";

    if (column === "Status")
      return (
        <td className="px-3 py-2 whitespace-nowrap">{getStatusBadge(value)}</td>
      );
    if (column === "Employee Feeling")
      return <td className="px-3 py-2">{getFeelingDisplay(value)}</td>;
    if (column === "Send Back Count") value = value || 0;

    // Truncate long text for other columns
    let displayValue = value !== null && value !== undefined ? value : "N/A";
    if (
      typeof displayValue === "string" &&
      displayValue.length > 100 &&
      column !== "Key Accomplishment"
    ) {
      displayValue = displayValue.substring(0, 100) + "...";
    }

    return (
      <td
        className="px-3 py-2 text-gray-700 text-sm"
        title={typeof value === "string" && value.length > 100 ? value : ""}
      >
        {displayValue}
      </td>
    );
  };

  if (error && reportData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ReportLayout
      reportTitle="Annual Performance Review Report"
      sheetName="Annual_Performance_Report"
      columnOptions={columnOptions}
      defaultSelectedColumns={defaultSelectedColumns}
      availableOptionsLabel="Select The Columns to display in the Annual Performance Review Report"
      data={reportData}
      renderTableCell={renderTableCell}
      financialYears={financialYears}
      onGenerate={handleGenerate}
      columnKeyMap={columnKeyMap}
      getSearchableValue={getSearchableValue}
      showDownloadAllButton={false}
      showStatusFilter={true}
      statusOptions={statusOptions}
      selectedStatus={selectedStatus}
      onStatusChange={setSelectedStatus}
      loading={loading}
      customExcelExport={handleExcelExport}
    />
  );
}

export default OverallGoalSettingReport;
