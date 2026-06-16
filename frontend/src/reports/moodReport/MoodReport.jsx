import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReportLayout from "../ReportLayout";

function MoodReport() {
    const [allEmployees, setAllEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const columnOptions = [
        "Employee Name",
        "Employee Code",
        "Mood",
        "Time Stamp",
    ];

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://mycdl.cms.co.in/api/moods");
                if (response.data && Array.isArray(response.data)) {
                    // Create a comprehensive data object for both display and export
                    const formattedData = response.data.map((item) => {
                        const timestamp = new Date(item.timestamp);
                        return {
                            // For table display
                            name: item.name,
                            code: item.eCode,
                            mood: item.mood,
                            timeLog: timestamp.toLocaleString(),
                            timestamp: timestamp, // Keep the original timestamp for filtering
                            
                            // For Excel export - using exact column names as keys
                            "Employee Name": item.name || "",
                            "Employee Code": item.eCode || "",
                            "Mood": item.mood || "",
                            "Time Stamp": timestamp.toLocaleString(),
                            
                            // Raw data backup
                            raw: item
                        };
                    });
                    setAllEmployees(formattedData);
                    setFilteredEmployees(formattedData); // Initially show all data
                } else {
                    console.error("Invalid response format");
                    setAllEmployees([]);
                    setFilteredEmployees([]);
                }
            } catch (error) {
                console.error("Error fetching mood data:", error);
                setAllEmployees([]);
                setFilteredEmployees([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle filter changes from ReportLayout - wrapped in useCallback
    const handleFilterChange = useCallback((filters) => {
        const { startDate, endDate } = filters;
        
        let filteredData = [...allEmployees];

        // Apply date filtering
        if (startDate || endDate) {
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.timestamp);
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;
                
                // Set time to beginning of day for start date and end of day for end date
                if (start) start.setHours(0, 0, 0, 0);
                if (end) end.setHours(23, 59, 59, 999);
                
                const itemTime = itemDate.getTime();
                
                if (start && end) {
                    return itemTime >= start.getTime() && itemTime <= end.getTime();
                } else if (start) {
                    return itemTime >= start.getTime();
                } else if (end) {
                    return itemTime <= end.getTime();
                }
                return true;
            });
        }

        setFilteredEmployees(filteredData);
    }, [allEmployees]); // Add allEmployees as dependency

    const renderTableCell = useCallback((column, emp) => {
        switch (column) {
            case "Employee Name":
                return (
                    <td className="px-4 py-3 whitespace-nowrap text-gray-900 font-medium font-header">
                        {emp.name}
                    </td>
                );
            case "Employee Code":
                return (
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-content">
                        {emp.code}
                    </td>
                );
            case "Mood":
                return (
                    <td className="px-4 py-3 whitespace-nowrap">
                        <span
                            className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full font-content
                                ${emp.mood === "Happy"
                                    ? "bg-green-100 text-green-800"
                                    : emp.mood === "Sad"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                        >
                            {emp.mood}
                        </span>
                    </td>
                );
            case "Time Stamp":
                return (
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-content">
                        {emp.timeLog}
                    </td>
                );
            default:
                return (
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-content">
                        {emp[column] || ""}
                    </td>
                );
        }
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-600">
                Loading mood report...
            </div>
        );
    }

    return (
        <ReportLayout
            reportTitle="Mood Report"
            sheetName="Mood Report"
            columnOptions={columnOptions}
            availableOptionsLabel="Select The Columns to display in the Mood Report"
            data={filteredEmployees} // Use filtered data instead of all data
            renderTableCell={renderTableCell}
            onFilterChange={handleFilterChange} // Pass the filter handler
        />
    );
}

export default MoodReport;