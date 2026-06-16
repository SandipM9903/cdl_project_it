import React from "react";
import ReportLayout from "../ReportLayout";

function OnboardedCandidatesDueForEmployeeConversion() {
    // Column options for this specific report
    const columnOptions = [
        "Employee Name",
        "Employee Code",
        "Department",
        "Sub-department",
        "Designation",
        "Location",
        "Mood",
        "Time Log",
    ];

    // Sample data
    const employees = [
        {
            name: "Ankita Mishra",
            code: "Emp1231",
            department: "Human Resources",
            subDepartment: "Human Resources",
            designation: "Sr.HR",
            location: "Bangalore",
            mood: "Happy",
            timeLog: "12-07-2025 10:30 AM",
            image: "https://randomuser.me/api/portraits/women/1.jpg",
        },
        {
            name: "Rajesh Kumar",
            code: "Emp1232",
            department: "Engineering",
            subDepartment: "Frontend Development",
            designation: "Senior Developer",
            location: "Hyderabad",
            mood: "Neutral",
            timeLog: "12-07-2025 09:15 AM",
            image: "https://randomuser.me/api/portraits/men/2.jpg",
        },
        {
            name: "Priya Sharma",
            code: "Emp1233",
            department: "Marketing",
            subDepartment: "Digital Marketing",
            designation: "Marketing Manager",
            location: "Delhi",
            mood: "Sad",
            timeLog: "12-07-2025 11:45 AM",
            image: "https://randomuser.me/api/portraits/women/3.jpg",
        },
        {
            name: "Amit Patel",
            code: "Emp1234",
            department: "Finance",
            subDepartment: "Accounts",
            designation: "Finance Analyst",
            location: "Mumbai",
            mood: "Happy",
            timeLog: "12-07-2025 08:20 AM",
            image: "https://randomuser.me/api/portraits/men/4.jpg",
        }
    ];
    // Custom cell renderer for Mood Report
    const renderTableCell = (column, emp) => {
        switch (column) {
            case "Employee Name":
                return (
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                                <img className="h-8 w-8 rounded-full" src={emp.image} alt={emp.name} />
                            </div>
                            <div className="ml-3">
                                <div className="font-header font-medium text-gray-900">{emp.name}</div>
                            </div>
                        </div>
                    </td>
                );
            case "Employee Code":
                return <td className="px-4 py-3 whitespace-nowrap text-gray-700">{emp.code}</td>;
            case "Department":
                return <td className="px-4 py-3 whitespace-nowrap text-gray-700">{emp.department}</td>;
            case "Sub-department":
                return <td className="px-4 py-3 whitespace-nowrap text-gray-700">{emp.subDepartment}</td>;
            case "Designation":
                return <td className="px-4 py-3 whitespace-nowrap text-gray-700">{emp.designation}</td>;
            case "Location":
                return <td className="px-4 py-3 whitespace-nowrap text-gray-700">{emp.location}</td>;
            case "Mood":
                return (
                    <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full 
                            ${emp.mood === 'Happy' ? 'bg-green-100 text-green-800' :
                                emp.mood === 'Sad' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'}`}>
                            {emp.mood}
                        </span>
                    </td>
                );
            case "Time Log":
                return <td className="px-4 py-3 whitespace-nowrap text-gray-700">{emp.timeLog}</td>;
            default:
                return <td className="px-4 py-3 whitespace-nowrap text-gray-700">{emp[column] || ''}</td>;
        }
    };

    return (
        <ReportLayout
            reportTitle="Onboarded Candidates Due for Employee Conversion"
            sheetName="Onboarded Candidates Due for Employee Conversion"
            columnOptions={columnOptions}
            availableOptionsLabel="Select The Columns to display in the Onboarded Candidates Due for Employee Conversion"
            data={employees}
            renderTableCell={renderTableCell}
        />
    );
}

export default OnboardedCandidatesDueForEmployeeConversion;