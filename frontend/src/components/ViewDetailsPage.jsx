import React, { useState, useEffect } from 'react';
import moment from 'moment';
import TourBooking from './TourBooking';

// --- ICON PLACEHOLDERS (Assuming you kept these) ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>;
// ---------------------------------------------------

// Mock data for Approval History (based on your image_30fd75.png)
const MOCK_APPROVAL_HISTORY = [
    {
        srNo: '00001',
        sentBy: 'Arvind Kumar -CGM',
        sentById: '#101',
        sentTo: 'Arun Kumar -ED',
        sentToId: '#101',
        dateTime: '11/04/2024-12:30',
        purpose: 'For Approval',
        subject: 'Offer Letter',
        status: 'Forwarded',
    }
    // You would add more records here as they come from the API
];


// Helper component for detail fields
const DetailField = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-gray-600 text-sm mb-1">{label}</span>
        <span className="text-gray-800 text-base font-medium">{value || 'N/A'}</span>
    </div>
);

// Helper function to format file size
const formatFileSize = (bytes) => {
    if (bytes === 0 || bytes === null || bytes === undefined) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// **Use the provided JSON data structure**
const ALL_TOUR_DATA = [ /* Insert the entire JSON array you provided here */
    {
        "attachments": [
            { "fileName": "IFSCA TA HA Master Circular 2025 (1) (1) (1).pdf", "fileSize": 427296 },
            { "fileName": "IFSCA TA HA Master Circular 2025 (1) (1).pdf", "fileSize": 427296 }
        ],
        "itineraries": [
            {
                "journeyType": "Onward",
                "journeyDate": "2024-05-12T00:00:00Z", // Mocked date from image
                "fromCity": "Mumbai",
                "toCity": "Delhi",
                "travelMode": "Flight",
                "flightTrainNo": "AI349",
                "travelClass": "Economy",
                "departureDatetime": "2024-05-12T09:30:00Z", // Mocked time from image
                "arrivalDatetime": "2024-05-12T09:30:00Z", // Mocked time from image
                "ticketPrice": 2000, // Mocked price from image
                "remarks": "Direct flight"
            },
            {
                "journeyType": "Return",
                "journeyDate": "2024-05-12T00:00:00Z", // Mocked date from image
                "fromCity": "Delhi", // Mocked city from image
                "toCity": "Mumbai", // Mocked city from image
                "travelMode": "Flight",
                "flightTrainNo": "437999", // Mocked ticket no. from image
                "travelClass": "A", // Mocked class from image
                "departureDatetime": "2024-05-12T09:30:00Z", // Mocked time from image
                "arrivalDatetime": "2024-05-12T09:30:00Z", // Mocked time from image
                "ticketPrice": 5000, // Mocked price from image
                "remarks": "Return flight"
            }
        ],
        "tour": {
            "id": "5efc03c6-1aaf-48c2-b4e9-70b8adcc0ea6", // Tour ID we will use
            "tourName": "Official Visit to Delhi",
            "employeeId": "30432", // Mocked from image
            "designationId": "Team Lead", // Mocked from image
            "deptId": "Management", // Mocked from image
            "purposeOfTour": "Tour for office meeting", // Mocked from image
            "placeOfVisit": "New Delhi",
            "fromDate": "2024-05-12T00:00:00Z", // Mocked from image
            "toDate": "2024-05-16T00:00:00Z", // Mocked from image
            "noOfDays": 2, // Mocked from image
            "scheduledDepartureDatetime": "2024-05-12T09:00:00Z", // Mocked from image
            "scheduledDepartureReason": "Need to attend the seminar", // Mocked from image
            "scheduledArrivalDatetime": "2024-05-15T09:00:00Z", // Mocked from image
            "scheduledArrivalReason": "Need to attend the seminar", // Mocked from image
            "leaveDays": 2, // Mocked from image
            "leaveType": "CL", // Mocked from image
            "leaveStartDate": "2024-05-13T00:00:00Z", // Mocked from image
            "leaveEndDate": "2024-05-14T00:00:00Z", // Mocked from image
            "cb_tour_request_status": "In-Progress", // Mocked from image
            "approvedDate": "2024-05-12T00:00:00Z", // Mocked from image
            "remarks": "Hotel required"
        }
    },
    // ... rest of your provided tour objects would go here
];

// Function to map the API response data to the component's state structure
const mapApiDataToState = (tourRequest, approvalHistoryData) => {
    if (!tourRequest || !tourRequest.tour) {
        return null;
    }

    const { attachments, itineraries, tour } = tourRequest;
    
    // Employee Name is assumed to be known/fetched separately since it's missing in your API JSON
    const employeeName = "Aman Kumar"; 
    const tourAppliedDate = "12/05/2024"; // Mocked from image

    return {
        // Tour Details
        employeeId: tour.employeeId || 'N/A',
        employeeName: employeeName,
        designation: tour.designationId || 'Team Lead',
        department: tour.deptId || 'Management',
        purposeOfTour: tour.purposeOfTour,
        tourAppliedDate: tourAppliedDate,
        approvalDate: tour.approvedDate ? moment(tour.approvedDate).format('DD/MM/YYYY') : 'N/A',
        status: tour.cb_tour_request_status || 'Pending',
        
        // Duration
        duration: {
            fromDate: tour.fromDate ? moment(tour.fromDate).format('DD-MM-YYYY') : 'N/A',
            toDate: tour.toDate ? moment(tour.toDate).format('DD-MM-YYYY') : 'N/A',
            noOfDays: tour.noOfDays || 'N/A',
        },
        
        // Departure
        departure: {
            date: tour.scheduledDepartureDatetime ? moment(tour.scheduledDepartureDatetime).format('DD/MM/YYYY') : 'N/A',
            time: tour.scheduledDepartureDatetime ? moment(tour.scheduledDepartureDatetime).format('h:mm A') : 'N/A',
            reason: tour.scheduledDepartureReason,
        },
        
        // Arrival
        arrival: {
            date: tour.scheduledArrivalDatetime ? moment(tour.scheduledArrivalDatetime).format('DD/MM/YYYY') : 'N/A',
            time: tour.scheduledArrivalDatetime ? moment(tour.scheduledArrivalDatetime).format('h:mm A') : 'N/A',
            reason: tour.scheduledArrivalReason,
        },
        
        // Travel Details (Itineraries)
        travelDetails: itineraries.map((item, index) => ({
            srNo: String(index + 1).padStart(2, '0'),
            date: item.journeyDate ? moment(item.journeyDate).format('DD-MM-YYYY') : 'N/A',
            from: item.fromCity,
            to: item.toCity,
            ticketNo: item.flightTrainNo, 
            modeOfTravel: item.travelMode,
            departureTime: item.departureDatetime ? moment(item.departureDatetime).format('HH:mm') : 'N/A',
            arrivalTime: item.arrivalDatetime ? moment(item.arrivalDatetime).format('HH:mm') : 'N/A',
            class: item.travelClass,
            price: item.ticketPrice ? `Rs. ${item.ticketPrice.toLocaleString()}` : 'N/A',
        })),

        // Leave Details
        leaveDetails: {
            fromDate: tour.leaveStartDate ? moment(tour.leaveStartDate).format('DD-MM-YYYY') : 'N/A',
            toDate: tour.leaveEndDate ? moment(tour.leaveEndDate).format('DD-MM-YYYY') : 'N/A',
            noOfDays: tour.leaveDays || 'N/A',
            natureOfLeave: tour.leaveType || 'N/A',
        },

        // Attachments
        attachments: attachments.map(att => ({
            name: att.fileName,
            size: formatFileSize(att.fileSize),
        })),
        
        // Approval History (Uses mock data for demonstration)
        approvalHistory: approvalHistoryData
    };
};

const ViewDetailsPage = () => {
    // In a real application, you would get the tourId from URL parameters (e.g., useParams() in React Router)
    const TOUR_ID_TO_FETCH = "5efc03c6-1aaf-48c2-b4e9-70b8adcc0ea6"; 
    
    const [activeTab, setActiveTab] = useState('details');
    const [tourData, setTourData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data Fetching Logic (Using provided JSON data structure)
    useEffect(() => {
        const fetchTourDetails = () => {
            setIsLoading(true);
            setError(null);

            // SIMULATING API CALL and filtering by ID
            const foundTour = ALL_TOUR_DATA.find(item => item.tour.id === TOUR_ID_TO_FETCH);

            if (foundTour) {
                // Map the found data and include the mock approval history data
                const mappedData = mapApiDataToState(foundTour, MOCK_APPROVAL_HISTORY); 
                setTourData(mappedData);
                setIsLoading(false);
            } else {
                setError(`Tour with ID: ${TOUR_ID_TO_FETCH} not found.`);
                setIsLoading(false);
            }
        };

        // Simulating the network delay of an API call
        const timer = setTimeout(fetchTourDetails, 500); 

        return () => clearTimeout(timer); // Cleanup function
    }, []); // Empty dependency array resolves the warning and ensures run-once

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-lg text-blue-700">Loading tour details...</div>;
    }

    if (error || !tourData) {
        return <div className="min-h-screen flex items-center justify-center text-lg text-red-700">Error loading data: {error || 'No tour request data found.'}</div>;
    }

    // Determine status color/style
    const getStatusStyle = (status) => {
        let bgColor = '#f0f4ff'; 
        let textColor = '#2563eb'; 

        switch (status?.toLowerCase()) {
            case 'in-progress':
            case 'forwarded':
                bgColor = '#fff7e6'; // Light yellow
                textColor = '#ffa931'; // Orange
                break;
            case 'approved':
                bgColor = '#ecfdf5'; // Light green
                textColor = '#059669'; // Dark green
                break;
            case 'rejected':
                bgColor = '#fee2e2'; // Light red
                textColor = '#ef4444'; // Dark red
                break;
            default:
                break;
        }
        return { backgroundColor: bgColor, color: textColor };
    };

    const statusStyle = getStatusStyle(tourData.status);

    return (
        <div className="min-h-screen bg-gray-100 p-5 font-sans">
            {/* Header / Breadcrumb and Action Buttons */}
            <div className="flex justify-between items-center mb-5 bg-white p-4 rounded-md shadow-sm border border-gray-200">
                <div className="text-sm text-gray-600">
                    <span className="text-blue-700 font-normal">🏠 / Manage Tour /</span>
                    <span className="text-gray-900 font-semibold"> View Details</span>
                </div>
                
                <div className="flex space-x-2">
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                        <ArrowLeftIcon className="mr-1 h-4 w-4" /> Back
                    </button>
                    <button className="flex items-center px-4 py-2 border border-blue-700 bg-blue-700 rounded-md text-white text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm">
                        <DownloadIcon className="mr-1 h-4 w-4" /> Export
                    </button>
                </div>
            </div>

            {/* Tabs Container */}
            <div className="bg-white rounded-md shadow-sm">
                <div className="flex px-5 pt-3 border-b border-gray-200">
                    <button
                        className={`px-4 pb-3 text-base ${
                            activeTab === 'details'
                                ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                                : 'text-gray-600 font-medium hover:text-gray-800'
                        } focus:outline-none transition-all duration-150`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        className={`ml-10 px-4 pb-3 text-base ${
                            activeTab === 'approvalHistory'
                                ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                                : 'text-gray-600 font-medium hover:text-gray-800'
                        } focus:outline-none transition-all duration-150`}
                        onClick={() => setActiveTab('approvalHistory')}
                    >
                        Approval History
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6">
                    {activeTab === 'details' && (
                        <><div className="details-tab-content space-y-6">

                            {/* Employee Details Section */}
                            <div className="pb-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-4">
                                <DetailField label="Employee Id" value={tourData.employeeId} />
                                <DetailField label="Purpose of the Tour" value={tourData.purposeOfTour} />
                                <DetailField label="Employee Name" value={tourData.employeeName} />
                                <DetailField label="Approval Date" value={tourData.approvalDate} />
                                <DetailField label="Designation" value={tourData.designation} />
                                <DetailField label="Tour Applied Date" value={tourData.tourAppliedDate} />
                                <DetailField label="Department" value={tourData.department} />
                                <div className="flex flex-col">
                                    <span className="text-gray-600 text-sm mb-1">Status</span>
                                    <span className="text-xs font-normal px-2 py-1 rounded inline-block w-fit tracking-wider"
                                        style={statusStyle}>
                                        {tourData.status}
                                    </span>
                                </div>
                            </div>

                            {/* Duration of Visit Section */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Duration of Visit</h3>
                            <div className="pb-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-4">
                                <DetailField label="From Date" value={tourData.duration.fromDate} />
                                <DetailField label="To Date" value={tourData.duration.toDate} />
                                <DetailField label="No. of Days" value={tourData.duration.noOfDays} />
                            </div>

                            {/* Departure Details Section */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Departure Details</h3>
                            <div className="pb-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-4">
                                <DetailField label="Date" value={tourData.departure.date} />
                                <DetailField label="Reason" value={tourData.departure.reason} />
                                <DetailField label="Time" value={tourData.departure.time} />
                            </div>

                            {/* Arrival Details Section */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Arrival Details</h3>
                            <div className="pb-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-4">
                                <DetailField label="Date" value={tourData.arrival.date} />
                                <DetailField label="Reason" value={tourData.arrival.reason} />
                                <DetailField label="Time" value={tourData.arrival.time} />
                            </div>

                            {/* Travel Details Section */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Travel Details (Itineraries)</h3>
                            <div className="pb-4 border-b border-gray-200 overflow-x-auto rounded-md border">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            {['Sr. No.', 'Date', 'From', 'To', 'Ticket No.', 'Mode of Travel', 'Departure Time', 'Arrival Time', 'Class', 'Price'].map((header) => (
                                                <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {tourData.travelDetails.map((travel, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{travel.srNo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{travel.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{travel.from}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{travel.to}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{travel.ticketNo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{travel.modeOfTravel}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{travel.departureTime}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{travel.arrivalTime}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{travel.class}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{travel.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Leave Details Section */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave Details</h3>
                            <div className="mb-5 pb-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-4">
                                <DetailField label="From Date" value={tourData.leaveDetails.fromDate} />
                                <DetailField label="To Date" value={tourData.leaveDetails.toDate} />
                                <DetailField label="No. of Days" value={tourData.leaveDetails.noOfDays} />
                                <DetailField label="Nature of Leave" value={tourData.leaveDetails.natureOfLeave} />
                            </div>

                            {/* Attachments Section */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 pt-4">Attachments</h3>
                            <div className="flex flex-wrap gap-4">
                                {tourData.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white shadow-sm"
                                        style={{ width: '220px' }}>
                                        <div className="flex items-center">
                                            <FileTextIcon className="mr-3 text-blue-700" />
                                            <div className="flex-grow overflow-hidden">
                                                <div className="text-sm font-medium text-gray-800 truncate">{attachment.name}</div>
                                                <div className="text-xs text-gray-500">{attachment.size}</div>
                                            </div>
                                        </div>
                                        <button className="text-blue-700 hover:text-blue-800 transition-colors p-1 rounded-full ml-2 flex-shrink-0">
                                            <DownloadIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div><TourBooking /></>
                    )}

                    {activeTab === 'approvalHistory' && (
                        <div className="approval-history-tab-content">
                            <div className="overflow-x-auto rounded-md border">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            {['SR. NO.', 'SENT BY', 'SENT TO', 'DATE/TIME', 'PURPOSE', 'SUBJECT', 'STATUS'].map((header) => (
                                                <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {tourData.approvalHistory.map((record, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{record.srNo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                                                    {record.sentBy}
                                                    <br />
                                                    <span className="text-xs text-gray-500 font-normal">{record.sentById}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                                                    {record.sentTo}
                                                    <br />
                                                    <span className="text-xs text-gray-500 font-normal">{record.sentToId}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{record.dateTime}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{record.purpose}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{record.subject}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{record.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewDetailsPage;