import React, { useState, useEffect } from "react";
import ReportLayout from "../ReportLayout";
import { BASE_URL_EPMS } from "../../performance/services/api";
import * as XLSX from "xlsx";

function QuarterWiseGoalReport() {
  const [rawReportData, setRawReportData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");

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
      value: "PENDING_APPROVAL",
      label: "Pending Approval",
      color: "#3B82F6",
      bgColor: "#EFF6FF",
      icon: "⏳",
    },
    {
      value: "SENT_BACK",
      label: "Sent Back",
      color: "#EF4444",
      bgColor: "#FEF2F2",
      icon: "↩️",
    },
    {
      value: "APPROVED",
      label: "Approved",
      color: "#10B981",
      bgColor: "#D1FAE5",
      icon: "✅",
    },
    {
      value: "SELF_REVIEWED",
      label: "Self Reviewed",
      color: "#8B5CF6",
      bgColor: "#F5F3FF",
      icon: "👤",
    },
    {
      value: "MANAGER_REVIEWED",
      label: "Manager Reviewed",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      icon: "👥",
    },
    {
      value: "ACCEPTED_BY_EMPLOYEE",
      label: "Accepted by Employee",
      color: "#06B6D4",
      bgColor: "#ECFEFF",
      icon: "🤝",
    },
    {
      value: "FINAL_SUBMITTED_TO_HR",
      label: "Final Submitted to HR",
      color: "#10B981",
      bgColor: "#D1FAE5",
      icon: "🏢",
    },
  ];

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
    "Department",
    "Sub Department",
    "Location Name",
    "Manager Name",
    "Manager Code",
    "Manager Email ID",
    "Quarter",
    "Year",
    "Goal Type",
    "Goal Objective (Title)",
    "Training Name",
    "Target / Key Result",
    "Weightage",
    "Status",
    "Self Assessment Score",
    "Manager Assessment Score",
    "Manager Comment",
    "Manager Approval Comment",
    "Remarks",
    "Created At",
  ];

  const defaultSelectedColumns = [
    "Employee Name",
    "Employee Code",
    "Quarter",
    "Year",
    "Goal Type",
    "Goal Objective (Title)",
    "Training Name",
    "Weightage",
    "Status",
    "Self Assessment Score",
    "Manager Assessment Score",
  ];

  const columnKeyMap = {
    "Employee Name": "employeeFullName",
    "Employee Code": "employeeId",
    "Department": "mainDepartment",
    "Sub Department": "subDepartment",
    "Location Name": "locationName",
    "Manager Name": "managerFullName",
    "Manager Code": "managerEmpCode",
    "Manager Email ID": "managerEmailId",
    "Quarter": "quarter",
    "Year": "year",
    "Goal Type": "goalType",
    "Goal Objective (Title)": "title",
    "Training Name": "trainingName",
    "Target / Key Result": "target",
    "Weightage": "weightage",
    "Status": "status",
    "Self Assessment Score": "selfAssessmentScore",
    "Manager Assessment Score": "managerAssessmentScore",
    "Manager Comment": "managerComment",
    "Manager Approval Comment": "managerApprovalComment",
    "Remarks": "remarks",
    "Created At": "createdAt",
  };

  // Sync / filter locally whenever status or raw data changes
  useEffect(() => {
    if (selectedStatus === "ALL") {
      setReportData(rawReportData);
    } else {
      setReportData(rawReportData.filter((item) => item.status === selectedStatus));
    }
  }, [selectedStatus, rawReportData]);

  const fetchReportData = async (financialYear) => {
    setLoading(true);
    setError(null);

    try {
      const yearNum = typeof financialYear === "string" ? Number(financialYear.split("-")[0]) : financialYear;
      const url = `${BASE_URL_EPMS}/api/reports/detailed-goals-qwise?year=${yearNum}&quarter=${selectedQuarter}`;

      console.log("Fetching detailed goals report URL:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch report data: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Fetched qwise goals data:", data);
      setRawReportData(data);
      return data;
    } catch (error) {
      console.error("Error fetching report data:", error);
      setError(error.message);
      setRawReportData([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (filters) => {
    const { selectedYear } = filters;
    return await fetchReportData(selectedYear);
  };

  const getSearchableValue = (item, column) => {
    const key = columnKeyMap[column] || column;
    let value = item[key];
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value === null || value === undefined) return "";

    if (column === "Status" && value) {
      const statusOption = statusOptions.find((opt) => opt.value === value);
      return statusOption ? statusOption.label : value.replace(/_/g, " ");
    }
    return String(value);
  };

  const handleExcelExport = (data, selectedColumns, sheetName) => {
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }

    const exportData = data.map((item) => {
      const row = {};
      selectedColumns.forEach((column) => {
        const key = columnKeyMap[column] || column;
        let value = item[key];

        if (value === null || value === undefined) {
          row[column] = "";
        } else if (column === "Status" && value) {
          const statusOption = statusOptions.find((opt) => opt.value === value);
          row[column] = statusOption ? statusOption.label : value.replace(/_/g, " ");
        } else if (typeof value === "boolean") {
          row[column] = value ? "Yes" : "No";
        } else if (key === "createdAt" && value) {
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

    const ws = XLSX.utils.json_to_sheet(exportData);
    const colWidths = {};
    Object.keys(exportData[0] || {}).forEach((col) => {
      let maxLength = col.length;
      exportData.forEach((row) => {
        const cellValue = String(row[col] || "");
        maxLength = Math.max(maxLength, Math.min(cellValue.length, 40));
      });
      colWidths[col] = Math.min(maxLength, 80);
    });

    ws["!cols"] = Object.keys(exportData[0] || {}).map((col) => ({
      wch: colWidths[col],
    }));

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

    ws["!rows"] = [{ hpt: 30 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName}.xlsx`);
  };

  const getStatusBadge = (status) => {
    if (!status) return <span className="text-gray-500">N/A</span>;
    const statusConfig = {
      NOT_STARTED: { label: "Not Started", color: "bg-gray-100 text-gray-600" },
      DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-800" },
      PENDING_APPROVAL: { label: "Pending Approval", color: "bg-blue-100 text-blue-800" },
      SENT_BACK: { label: "Sent Back", color: "bg-red-100 text-red-800" },
      APPROVED: { label: "Approved", color: "bg-emerald-100 text-emerald-800" },
      SELF_REVIEWED: { label: "Self Reviewed", color: "bg-purple-100 text-purple-800" },
      MANAGER_REVIEWED: { label: "Manager Reviewed", color: "bg-pink-100 text-pink-800" },
      ACCEPTED_BY_EMPLOYEE: { label: "Accepted by Employee", color: "bg-cyan-100 text-cyan-800" },
      FINAL_SUBMITTED_TO_HR: { label: "Final Submitted to HR", color: "bg-green-100 text-green-800" },
    };

    const config = statusConfig[status] || {
      label: status.replace(/_/g, " "),
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const renderTableCell = (column, item) => {
    const key = columnKeyMap[column] || column;
    let value = item[key];

    if (key === "createdAt" && value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        value = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    }

    if (typeof value === "boolean") value = value ? "Yes" : "No";

    if (column === "Status") {
      return (
        <td className="px-3 py-2 whitespace-nowrap">{getStatusBadge(value)}</td>
      );
    }

    let displayValue = value !== null && value !== undefined ? value : "N/A";
    if (typeof displayValue === "string" && displayValue.length > 100) {
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
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
      reportTitle="Quarter wise Goal Report"
      sheetName="Quarter_Wise_Goal_Report"
      columnOptions={columnOptions}
      defaultSelectedColumns={defaultSelectedColumns}
      availableOptionsLabel="Select The Columns to display in the Quarter wise Goal Report"
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
    >
      {{
        left: (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 font-header">
              Quarter Selection
            </h2>
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-700 font-medium font-content"
            >
              <option value="Q1">Quarter 1 (Apr - Jun)</option>
              <option value="Q2">Quarter 2 (Jul - Sep)</option>
              <option value="Q3">Quarter 3 (Oct - Dec)</option>
              <option value="Q4">Quarter 4 (Jan - Mar)</option>
            </select>
          </div>
        ),
      }}
    </ReportLayout>
  );
}

export default QuarterWiseGoalReport;