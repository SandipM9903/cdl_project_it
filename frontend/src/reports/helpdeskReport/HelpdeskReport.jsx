import React, { useState, useEffect } from "react";
import ReportLayout from "../ReportLayout";

function HelpdeskReport() {
    // Column options for this specific report
    const columnOptions = [
        "Ticket Id",
        "Ticket Raised By(Employee Name)",
        "Ticket Raised By(Employee Code)",
        "User Cell Number",
        "Category",
        "Sub Category",
        "Type",
        "Security Level",
        "Turn-Around-Time",
        "Ticket Created On Date",
        "Ticket Owner",
        "Status",
    ];

    const [ticketData, setTicketData] = useState([]);
    const [filteredTicketData, setFilteredTicketData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const baseURL = 'https://mycdl.cms.co.in';
    const empCode = '9085176';

    // Fetch initial ticket data
    useEffect(() => {
        const fetchInitialTicketData = async () => {
            try {
                setLoading(true);
                console.log('Fetching initial ticket data...');
                
                const response = await fetch(`${baseURL}/tickets/generate/report/${empCode}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({})
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Raw API response:', data); // Debug log
                
                if (data && data.length > 0) {
                    const transformedData = transformReportData(data);
                    setTicketData(transformedData);
                    setFilteredTicketData(transformedData);
                    console.log('Transformed data:', transformedData); // Debug log
                } else {
                    setTicketData([]);
                    setFilteredTicketData([]);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching initial ticket data:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchInitialTicketData();
    }, [empCode]);

    // Transform report API data to match the report structure
    const transformReportData = (apiData) => {
        if (!apiData || !Array.isArray(apiData)) {
            console.log('Invalid API data for transformation:', apiData);
            return [];
        }

        return apiData.map(ticket => {
            console.log('Processing ticket:', ticket); // Debug log

            // Map the fields to the new column names
            const transformedTicket = {
                "Ticket Id": ticket.id || ticket.ticketId || 'N/A',
                "Ticket Raised By(Employee Name)": ticket.raisedByEmpName || ticket.raisedBy || "Not specified",
                "Ticket Raised By(Employee Code)": ticket.raisedByEmpCode || ticket.employeeCode || "Not specified",
                "User Cell Number": ticket.userCellNo || ticket.contactNumber || ticket.phone || "Not specified",
                "Category": ticket.category || "Unknown",
                "Sub Category": ticket.subCategory || "Unknown",
                "Type": ticket.ticketClassification || ticket.type || "Not specified",
                "Security Level": ticket.securityLevel || ticket.severity || "MEDIUM",
                "Turn-Around-Time": ticket.timeLine || ticket.tat || "Not specified",
                "Ticket Created On Date": ticket.createdDate ? formatDate(ticket.createdDate) : 
                                       ticket.creationDate ? formatDate(ticket.creationDate) : 
                                       ticket.raisedDate ? formatDate(ticket.raisedDate) : formatDate(new Date()),
                "Ticket Owner": ticket.assignedToEmpName || ticket.assignedTo || ticket.assignee || "Not assigned",
                "Status": ticket.status || "Unknown",
                // Include raw data for debugging
                rawData: ticket
            };

            console.log('Transformed ticket:', transformedTicket); // Debug log
            return transformedTicket;
        });
    };

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        
        try {
            let date;
            
            if (dateString instanceof Date) {
                date = dateString;
            } else if (typeof dateString === 'number') {
                date = new Date(dateString);
            } else {
                date = new Date(dateString);
                
                if (isNaN(date.getTime())) {
                    // Handle DD/MM/YYYY format
                    if (dateString.includes('/')) {
                        const parts = dateString.split('/');
                        if (parts.length === 3) {
                            const day = parseInt(parts[0], 10);
                            const month = parseInt(parts[1], 10) - 1;
                            const year = parseInt(parts[2], 10);
                            date = new Date(year, month, day);
                        }
                    }
                    // Handle DD-MM-YYYY format
                    else if (dateString.includes('-')) {
                        const parts = dateString.split('-');
                        if (parts.length === 3) {
                            const day = parseInt(parts[0], 10);
                            const month = parseInt(parts[1], 10) - 1;
                            const year = parseInt(parts[2], 10);
                            date = new Date(year, month, day);
                        }
                    }
                }
            }
            
            if (isNaN(date.getTime())) {
                console.warn('Invalid date:', dateString);
                return "-";
            }
            
            return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
        } catch (error) {
            console.error('Error formatting date:', error, dateString);
            return "-";
        }
    };

    // Handle date range filtering
    const handleDateChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        
        if (!start && !end) {
            setFilteredTicketData(ticketData);
            return;
        }

        const filteredData = ticketData.filter(ticket => {
            const ticketDate = parseDate(ticket["Ticket Created On Date"]);
            if (!ticketDate) return false;

            const ticketTime = ticketDate.getTime();
            const startTime = start ? new Date(start).getTime() : -Infinity;
            const endTime = end ? new Date(end).getTime() : Infinity;

            return ticketTime >= startTime && ticketTime <= endTime;
        });

        setFilteredTicketData(filteredData);
    };

    // Helper function to parse date strings in DD/MM/YYYY format
    const parseDate = (dateString) => {
        if (!dateString || dateString === "-") return null;
        
        try {
            if (dateString.includes('/')) {
                const parts = dateString.split('/');
                if (parts.length === 3) {
                    const day = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1;
                    const year = parseInt(parts[2], 10);
                    return new Date(year, month, day);
                }
            }
            return new Date(dateString);
        } catch (error) {
            console.error('Error parsing date:', error);
            return null;
        }
    };

    // Handle reset - reload all data
    const handleReset = async () => {
        try {
            setLoading(true);
            
            const response = await fetch(`${baseURL}/tickets/generate/report/${empCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data && data.length > 0) {
                const transformedData = transformReportData(data);
                setTicketData(transformedData);
                setFilteredTicketData(transformedData);
                setStartDate("");
                setEndDate("");
            } else {
                setTicketData([]);
                setFilteredTicketData([]);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error resetting ticket data:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    // Custom cell renderer for Helpdesk Report
    const renderTableCell = (column, ticket) => {
        const value = ticket[column] || '';
        
        switch (column) {
            case "Ticket Id":
                return (
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-header font-medium text-blue-600">{value}</div>
                    </td>
                );
            case "Type":
                return (
                    <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {value}
                        </span>
                    </td>
                );
            case "Security Level":
                const securityColor = 
                    value === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    value === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    value === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800';
                
                return (
                    <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${securityColor}`}>
                            {value}
                        </span>
                    </td>
                );
            case "Status":
                const statusColor = 
                    value === 'CREATED' || value === 'OPEN' ? 'bg-red-100 text-red-800' :
                    value === 'INPROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                    value === 'RESOLVED' ? 'bg-blue-100 text-blue-800' :
                    value === 'CLOSED' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800';
                
                return (
                    <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${statusColor}`}>
                            {value}
                        </span>
                    </td>
                );
            case "Ticket Raised By(Employee Name)":
            case "Ticket Owner":
                return (
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">
                        {value}
                    </td>
                );
            case "Ticket Raised By(Employee Code)":
            case "User Cell Number":
                return (
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-mono text-sm">
                        {value}
                    </td>
                );
            case "Ticket Created On Date":
            case "Turn-Around-Time":
                return (
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-mono text-sm">
                        {value}
                    </td>
                );
            default:
                return <td className="px-4 py-3 whitespace-nowrap text-gray-700">{value}</td>;
        }
    };

    // Show loading state only when actively loading and no data exists
    if (loading && ticketData.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading helpdesk data...</div>
            </div>
        );
    }

    if (error && ticketData.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-red-600">Error loading data: {error}</div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            
            {loading && (
                <div className="text-center py-4">
                    <div className="text-lg">Loading data...</div>
                </div>
            )}
            
            <ReportLayout
                reportTitle="Helpdesk Report"
                sheetName="Helpdesk Report"
                columnOptions={columnOptions}
                availableOptionsLabel="Select The Columns to display in the Helpdesk Report"
                data={filteredTicketData}
                renderTableCell={renderTableCell}
                onDateChange={handleDateChange}
                onReset={handleReset}
                employeeCount={filteredTicketData.length}
                showDateFilter={true}
            />
        </div>
    );
}

export default HelpdeskReport;