import React, { useState, useCallback } from "react";
import axios from "axios";
import ReportLayout from "../ReportLayout";

const API_URL = "http://localhost:9026/it-declaration-info/report/all";

// Base columns without Declaration Name, Declaration Amount, Created Date
const BASE_COLUMNS = [
  "Employee Name",
  "Employee Code",
  "Pan Number",
  "Financial Year"
];

function ITDeclarationReport() {
  const [columnOptions, setColumnOptions] = useState(BASE_COLUMNS);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allDeclarations, setAllDeclarations] = useState([]);

  const handleFilterChange = useCallback(async (filters) => {
    const year = filters?.selectedYear;
    if (!year) return;

    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/${year}`);
      const employees = data?.data || [];

      // Store all declarations for later use
      setAllDeclarations(employees);

      // Extract all unique declaration names for column options
      const declarationSet = new Set();
      employees.forEach((emp) => {
        emp.declarations?.forEach((dec) => {
          const name = dec.declarationName?.trim();
          if (name) declarationSet.add(name);
        });
      });

      setColumnOptions([...BASE_COLUMNS, ...Array.from(declarationSet)]);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyDurationFilter = (employees, startDate, endDate) => {
    if (!startDate || !endDate) return employees;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return employees.filter((emp) => {
      // Check if any declaration's created date falls within range
      return emp.declarations?.some((dec) => {
        if (!dec.createdDate) return false;
        const created = new Date(dec.createdDate);
        return created >= start && created <= end;
      });
    });
  };

  const handleGenerate = useCallback(async (filters) => {
    const { selectedYear, startDate, endDate } = filters;

    if (!selectedYear) {
      alert("Please select a Financial Year");
      return;
    }

    try {
      setLoading(true);

      let employees = allDeclarations;

      // Fetch if not already loaded
      if (employees.length === 0) {
        const { data } = await axios.get(`${API_URL}/${selectedYear}`);
        employees = data?.data || [];
        setAllDeclarations(employees);
      }

      // Apply date filter
      employees = applyDurationFilter(employees, startDate, endDate);

      // Format data for table display
      const formatted = employees.map((emp) => {
        const row = {
          "Employee Name": emp.empName || "",
          "Employee Code": emp.empCode || "",
          "Pan Number": emp.panNo || "Not Available",
          "Financial Year": selectedYear
        };

        // Add each declaration amount as a column (using declaration name as column header)
        emp.declarations?.forEach((dec) => {
          const name = dec.declarationName?.trim();
          if (name) {
            row[name] = dec.declarationAmount ?? 0;
          }
        });

        return row;
      });

      setFilteredEmployees(formatted);
    } catch (err) {
      console.error("Error generating report:", err);
      alert("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [allDeclarations]);

  const renderTableCell = (column, emp, rowIndex) => {
    const value = emp[column];
    return (
      <td
        key={`${rowIndex}-${column}`}
        className="px-4 py-3 whitespace-nowrap text-gray-700 border-b border-gray-200"
      >
        {typeof value === 'number' ? value.toLocaleString() : (value ?? "")}
      </td>
    );
  };

  const getSearchableValue = (item, column) => {
    const value = item[column];
    if (value === undefined || value === null) return "";
    return String(value).toLowerCase();
  };

  const columnKeyMap = {
    "Employee Name": "Employee Name",
    "Employee Code": "Employee Code",
    "Pan Number": "Pan Number",
    "Financial Year": "Financial Year"
  };

  // Add declaration columns to the key map for searching
  columnOptions.forEach(col => {
    if (!columnKeyMap[col]) {
      columnKeyMap[col] = col;
    }
  });

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="loader mb-4"></div>
            <p className="text-gray-700 font-medium">Loading IT Declaration Report...</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .loader {
          width: 40px;
          height: 40px;
          color: #f03355;
          background:
            conic-gradient(from  -45deg at top    20px left 50% ,#0000 ,currentColor 1deg 90deg,#0000 91deg),
            conic-gradient(from   45deg at right  20px top  50% ,#0000 ,currentColor 1deg 90deg,#0000 91deg),
            conic-gradient(from  135deg at bottom 20px left 50% ,#0000 ,currentColor 1deg 90deg,#0000 91deg),
            conic-gradient(from -135deg at left   20px top  50% ,#0000 ,currentColor 1deg 90deg,#0000 91deg);
          animation: l4 1.5s infinite cubic-bezier(0.3,1,0,1);
        }
        @keyframes l4 {
          50%  {width:60px;height: 60px;transform: rotate(180deg)}
          100% {transform: rotate(360deg)}
        }
      `}</style>

      <ReportLayout
        reportTitle="IT Declaration Report"
        sheetName="IT Declaration Report"
        columnOptions={columnOptions}
        data={filteredEmployees}
        renderTableCell={renderTableCell}
        onGenerate={handleGenerate}
        onFilterChange={handleFilterChange}
        getSearchableValue={getSearchableValue}
        columnKeyMap={columnKeyMap}
        financialYears={["2026-27", "2025-26", "2024-25", "2023-24", "2022-23"]}
      />
    </>
  );
}

export default ITDeclarationReport;