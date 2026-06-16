import React, { useState, useEffect } from "react";
import ReportLayout from "../ReportLayout";

function InductionReport() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Column options for this specific report
  const columnOptions = [
    "Employee Name",
    "Employee Code",
    "Number of Modules Watched",
    "Score",
    "Status",
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://mycdl.cms.co.in/api/training/allRecords");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API data with Excel-friendly property names
        const transformedData = data.map(employee => ({
          // For display
          name: employee.name || "N/A",
          code: employee.empCode,
          modulesWatched: employee.lastWatchedModuleIndex,
          score: employee.scored,
          status: employee.status || "In Progress",
          // For Excel export - using same keys as columnOptions
          "Employee Name": employee.name || "N/A",
          "Employee Code": employee.empCode,
          "Number of Modules Watched": employee.lastWatchedModuleIndex,
          "Score": employee.scored !== null ? employee.scored : "N/A",
          "Status": employee.status || "In Progress"
        }));
        
        setEmployees(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Custom cell renderer for Induction Report
  const renderTableCell = (column, emp) => {
    switch (column) {
      case "Employee Name":
        return (
          <td className="px-4 py-3 whitespace-nowrap">
            <div className="flex items-center">
              <div className="ml-3">
                <div className="font-header font-medium text-gray-900">
                  {emp.name}
                </div>
              </div>
            </div>
          </td>
        );
      case "Employee Code":
        return (
          <td className="px-4 py-3 whitespace-nowrap text-gray-700">
            {emp.code}
          </td>
        );
      case "Number of Modules Watched":
        return (
          <td className="px-4 py-3 whitespace-nowrap text-gray-700">
            {emp.modulesWatched}
          </td>
        );
      case "Score":
        return (
          <td className="px-4 py-3 whitespace-nowrap">
            {emp.score !== null ? (
              <span
                className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full 
                            ${
                              emp.score >= 24
                                ? "bg-green-100 text-green-800"
                                : emp.score >= 18
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
              >
                {emp.score}
              </span>
            ) : (
              <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-gray-100 text-gray-800">
                N/A
              </span>
            )}
          </td>
        );
      case "Status":
        return (
          <td className="px-4 py-3 whitespace-nowrap">
            <span
              className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full 
                            ${
                              emp.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : emp.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
            >
              {emp.status}
            </span>
          </td>
        );
      default:
        return (
          <td className="px-4 py-3 whitespace-nowrap text-gray-700">
            {emp[column] || ""}
          </td>
        );
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium text-gray-600">Loading induction report data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium text-red-600">
          Error loading data: {error}
        </div>
      </div>
    );
  }

  return (
    <ReportLayout
      reportTitle="Induction Report"
      sheetName="Induction Report"
      columnOptions={columnOptions}
      availableOptionsLabel="Select The Columns to display in the Induction Report"
      data={employees}
      renderTableCell={renderTableCell}
    />
  );
}

export default InductionReport;