import React, { useEffect, useState } from "react";
import axios from "axios";
import ReportLayout from "../ReportLayout";
import { BASE_URL } from "../../config/Config";

function ExitedEmployeeReport() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lastDownloadTime, setLastDownloadTime] = useState(null);

  const columnOptions = [
    "Employee Code",
    "Employee Name",
    "Department",
    "Sub-department",
    "Project",
    "Location",
    "Designation",
    "Payroll Area",
    "Date of Joining",
    "Date of Exit",
    "Type of Exit",
    "Reason for Exit",
    "Reporting Manager Name",
    "R1 Approver Status",
    "Notice Period Required as per Policy",
    "Notice Period Served",
    "Shortfall of Notice Period",
    "Recovery(If applicable)",
    "Notice Recovery Recovery Amount",
    "Exit form Status",
    "Exit form submission date",
    "ITR",
    "FBR",
    "IT Department Clearance",
    "Approver Name(IT Department)",
    "IT Clearance Date",
    "Admin Department Clearance",
    "Approver Name(Admin Department)",
    "Admin Clearance Date",
    "Sales Department Clearance",
    "Approver Name(Sales Department)",
    "Sales Clearance Date",
    "Stores Department Clearance",
    "Approver Name(Stores Department)",
    "Stores Clearance Date",
    "Accounts Department Clearance",
    "Approver Name(Accounts Department)",
    "Accounts Clearance Date",
    "HR Department Clearance",
    "Approver Name(HR Department)",
    "HR Clearance Date",
    "BU Department Clearance",
    "Approver Name(BU Department)",
    "BU Clearance Date",
    "KT Department Clearance",
    "Approver Name(KT Department)",
    "KT Clearance Date"
  ];

  const empCode = localStorage.getItem("empId");
  const overAllStatus = "Exited";

  const fetchExitedEmployees = async () => {
    try {
      setLoading(true);

      // Fetch resignation data
      const resignResponse = await axios.get(
        `${BASE_URL}:9029/api/eSeparation/getResignDataByOverAllStatus/${overAllStatus}/9085119`
      );

      const resignData = resignResponse.data;

      // Fetch employee details for each resignation
      const employeeDetailPromises = resignData.map((resignDetail) => {
        console.log(resignDetail.empCode, "resignDetail.empCode");
        return axios.get(
          `${BASE_URL}:9029/api/eSeparation/getEmployee/${resignDetail.empCode}`
        );
      });
      const employeeResponses = await Promise.all(employeeDetailPromises);
      const empDetails = employeeResponses.map((response) => response.data);

      // Merge resignation details with employee details
      let mergedData = empDetails.map((empDetail) => {
        const matchingResignDetail = resignData.find(
          (resignDetail) =>
            empDetail.fileAndObjectTypeBean.empResDTO.empCode ===
            resignDetail.empCode
        );
        return { ...empDetail, ...matchingResignDetail };
      });

      // Fetch department details for each employee
      const deptDetailPromises = mergedData.map((employee) => {
        if (employee.wfSeqId) {
          return axios
            .get(
              `${BASE_URL}:9029/api/eSeparation/getAllDeptDetailsForExport/${employee.wfSeqId}`
            )
            .then((deptRes) => ({
              ...employee,
              deptDetails: deptRes.data,
            }))
            .catch((error) => {
              console.error("Error fetching dept details:", error);
              return { ...employee, deptDetails: null };
            });
        }
        return Promise.resolve({ ...employee, deptDetails: null });
      });

      const finalData = await Promise.all(deptDetailPromises);
      
      setEmployees(finalData);
      setFilteredEmployees(finalData); // Initialize filtered data with all employees
    } catch (error) {
      console.error("Error fetching exited employees data:", error);
      setEmployees([]);
      setFilteredEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExitedEmployees();
  }, []);

  // Filter employees based on date range
  const filterEmployeesByDate = (start, end) => {
    if (!start && !end) {
      return employees; // Return all if no dates selected
    }

    return employees.filter((employee) => {
      const exitDate = employee?.lastWorkingDay;
      if (!exitDate) return false;

      const exitDateObj = new Date(exitDate);
      const startDateObj = start ? new Date(start) : null;
      const endDateObj = end ? new Date(end) : null;

      // If only start date is provided, filter from start date onwards
      if (startDateObj && !endDateObj) {
        return exitDateObj >= startDateObj;
      }

      // If only end date is provided, filter up to end date
      if (!startDateObj && endDateObj) {
        return exitDateObj <= endDateObj;
      }

      // If both dates are provided, filter within range
      if (startDateObj && endDateObj) {
        return exitDateObj >= startDateObj && exitDateObj <= endDateObj;
      }

      return true;
    });
  };

  // Handle date changes from ReportLayout
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    
    const filtered = filterEmployeesByDate(start, end);
    setFilteredEmployees(filtered);
  };

  // Handle download completion
  const handleDownloadComplete = (downloadTime) => {
    setLastDownloadTime(downloadTime);
    console.log(`Report downloaded at: ${downloadTime}`);
  };

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return "-";
    }
    const date = new Date(dateString);
    const day = date
      .getDate()
      .toString()
      .padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const cleanClearance = (value) => {
    if (value === undefined || value === null || value === "") return "-";

    const status = String(value)
      .replace(/^\d+\./, "")
      .trim()
      .toLowerCase();

    if (status.startsWith("approve")) return "Approved";
    if (status.startsWith("reject")) return "Rejected";
    if (status === "null" || status === "undefined") return "-";

    return status
      .split(/\s+/)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  };

  // Transform API data to match the expected format for ReportLayout
  const transformEmployeeData = (employee) => {
    const empResDTO = employee?.fileAndObjectTypeBean?.empResDTO || {};
    const userDTO = employee?.userDTO || {};
    const deptDetails = employee?.deptDetails || {};

    // Extract the missing data from API response
    const department = empResDTO.mainDeptResDTO?.mainDepartment || "-";
    const subDepartment = empResDTO.subDeptResDTO?.subDept || "-";
    const project = empResDTO.projectResDTO?.projectName || "-";
    const location = userDTO.locationResDTO?.locationName || "-";
    const designation = empResDTO.designationResDTO?.designationName || "-";

    // Create an object with only the columns specified in columnOptions
    const transformedData = {
      // Basic employee info
      "Employee Code": empResDTO.empCode || "-",
      "Employee Name": empResDTO.fullNameAsAadhaar || "-",
      Department: department,
      "Sub-department": subDepartment,
      Project: project,
      Location: location,
      Designation: designation,
      "Payroll Area": "-",

      // Exit specific fields
      "Date of Joining": formatDate(empResDTO.dateOfJoining),
      "Date of Exit": formatDate(employee?.lastWorkingDay),
      "Type of Exit": employee?.exitType || "-",
      "Reason for Exit": employee?.reason || "-",
      "Reporting Manager Name": empResDTO.reportingManager || "-",
      "R1 Approver Status": employee?.r1Status || "-",
      "Notice Period Required as per Policy": "90 days",
      "Notice Period Served":
        employee?.noticePeriodWaiver === false ? "Yes" : "No",
      "Shortfall of Notice Period": "-",
      "Recovery(If applicable)": "-",
      "Notice Recovery Recovery Amount": "-",
      "Exit form Status": employee?.overAllStatus || "-",
      "Exit form submission date": formatDate(employee?.createdDate),
      ITR: "Cleared",
      FBR: "Cleared",

      // IT Department
      "IT Department Clearance": cleanClearance(deptDetails?.itDeptClearance),
      "Approver Name(IT Department)": deptDetails?.itApproverName || "-",
      "IT Clearance Date": formatDate(deptDetails?.itClearanceDate),
      
      // Admin Department
      "Admin Department Clearance": cleanClearance(deptDetails?.adminDeptClearance),
      "Approver Name(Admin Department)": deptDetails?.adminApproverName || "-",
      "Admin Clearance Date": formatDate(deptDetails?.adminClearanceDate),
      
      // Sales Department
      "Sales Department Clearance": cleanClearance(deptDetails?.salesDeptClearance),
      "Approver Name(Sales Department)": deptDetails?.salesApproverName || "-",
      "Sales Clearance Date": formatDate(deptDetails?.salesClearanceDate),
      
      // Stores Department
      "Stores Department Clearance": cleanClearance(deptDetails?.storeDeptClearance),
      "Approver Name(Stores Department)": deptDetails?.storeApproverName || "-",
      "Stores Clearance Date": formatDate(deptDetails?.storeClearanceDate),
      
      // Accounts Department (Finance)
      "Accounts Department Clearance": cleanClearance(deptDetails?.financeDeptClearance),
      "Approver Name(Accounts Department)": deptDetails?.financeApproverName || "-",
      "Accounts Clearance Date": formatDate(deptDetails?.financeClearanceDate),
      
      // HR Department
      "HR Department Clearance": cleanClearance(deptDetails?.hrDeptClearance),
      "Approver Name(HR Department)": deptDetails?.hrApproverName || "-",
      "HR Clearance Date": formatDate(deptDetails?.hrClearanceDate),
      
      // BU Department (Business Unit)
      "BU Department Clearance": cleanClearance(deptDetails?.buDeptClearance),
      "Approver Name(BU Department)": deptDetails?.buApproverName || "-",
      "BU Clearance Date": formatDate(deptDetails?.buClearanceDate),
      
      // KT Department (Knowledge Transfer)
      "KT Department Clearance": cleanClearance(deptDetails?.ktDeptClearance),
      "Approver Name(KT Department)": deptDetails?.ktApproverName || "-",
      "KT Clearance Date": formatDate(deptDetails?.ktClearanceDate),
    };

    return transformedData;
  };

  // Custom cell renderer for Exited Employee Report
  const renderTableCell = (column, emp) => {
    switch (column) {
      case "Employee Name":
        return (
          <td key={column} className="px-4 py-3 whitespace-nowrap">
            <div className="flex items-center">
              <div className="ml-3">
                <div className="font-header font-medium text-gray-900">
                  {emp["Employee Name"]}
                </div>
              </div>
            </div>
          </td>
        );
      case "Employee Code":
        return (
          <td
            key={column}
            className="px-4 py-3 whitespace-nowrap text-gray-700"
          >
            {emp["Employee Code"]}
          </td>
        );
      default:
        return (
          <td
            key={column}
            className="px-4 py-3 whitespace-nowrap text-gray-700"
          >
            {emp[column] || "-"}
          </td>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">
          Loading exited employees data...
        </div>
      </div>
    );
  }

  const transformedEmployees = filteredEmployees.map(transformEmployeeData);

  return (
    <ReportLayout
      reportTitle="Exited Employee Report"
      sheetName="Exited Employee Report"
      columnOptions={columnOptions}
      availableOptionsLabel="Select The Columns to display in the Exited Employee Report"
      data={transformedEmployees}
      renderTableCell={renderTableCell}
      onDateChange={handleDateChange}
      onDownloadComplete={handleDownloadComplete}
      employeeCount={filteredEmployees.length}
    />
  );
}

export default ExitedEmployeeReport;