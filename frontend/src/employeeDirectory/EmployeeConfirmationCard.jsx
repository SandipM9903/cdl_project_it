import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdCall } from "react-icons/md";
import ViewDetails from "./ViewDetails";

const EmployeeConfirmation = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const [searchText, setSearchText] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeHiredDropdownId, setActiveHiredDropdownId] = useState(null);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advancedFilter, setAdvancedFilter] = useState({
    department: "",
    manager: "",
  });
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/probation/employees",
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const transformedData = await Promise.all(
          data.map(async (item) => {
            let confirmationOverdueDays = "0";
            let actualProbationEndDate = "N/A";
            let currentProbationEndDate = "N/A";
            let probationExtendedNoOfTimes = "0";
            let status = item.status || "Probation";
            let r1ApprovalStatus = item.r1ApprovalStatus || "Pending";
            let hrStatus = item.hrStatus || "Pending";
            let createdAt = null;

            if (item.dateOfJoining && typeof item.probationDay === "number") {
              const joinDate = new Date(item.dateOfJoining);
              const probationEnd = new Date(joinDate);
              probationEnd.setDate(joinDate.getDate() + item.probationDay);
              actualProbationEndDate = formatDate(probationEnd);
              currentProbationEndDate = actualProbationEndDate;
            }

            try {
              const probationResponse = await fetch(
                `http://localhost:8080/api/probation/probation-record/${item.empCode}`,
              );
              if (probationResponse.ok) {
                const record = await probationResponse.json();
                createdAt = record.createdAt
                  ? new Date(record.createdAt)
                  : null;
                if (createdAt) {
                  createdAt = new Date(
                    Date.UTC(
                      createdAt.getFullYear(),
                      createdAt.getMonth(),
                      createdAt.getDate(),
                    ),
                  );
                }

                actualProbationEndDate = formatDate(
                  record.actualProbationEndDate,
                );
                currentProbationEndDate = formatDate(
                  record.currentProbationEndDate,
                );
                probationExtendedNoOfTimes =
                  record.totalNumberExtended?.toString() || "0";
                status = record.status || status;
                r1ApprovalStatus = record.r1ApprovalStatus || r1ApprovalStatus;
                hrStatus = record.hrStatus || hrStatus;
                console.log(
                  `✅ Overridden with probation record for ${item.empCode}`,
                );
              }
            } catch (err) {
              if (!err.message.includes("404")) {
                console.warn(
                  `⚠️ Failed to fetch probation record for ${item.empCode}:`,
                  err,
                );
              }
            }

            let hiredPercent = 0;
            let extensionBars = [];

            try {
              if (
                item.dateOfJoining &&
                actualProbationEndDate !== "N/A" &&
                currentProbationEndDate !== "N/A"
              ) {
                const today = new Date();

                const [joinDay, joinMonth, joinYear] = formatDate(
                  item.dateOfJoining,
                ).split("-");
                const [
                  actualDay,
                  actualMonth,
                  actualYear,
                ] = actualProbationEndDate.split("-");
                const [
                  currentDay,
                  currentMonth,
                  currentYear,
                ] = currentProbationEndDate.split("-");

                const joinDate = new Date(
                  Date.UTC(joinYear, joinMonth - 1, joinDay),
                );
                const actualEndDate = new Date(
                  Date.UTC(actualYear, actualMonth - 1, actualDay),
                );
                const currentEndDate = new Date(
                  Date.UTC(currentYear, currentMonth - 1, currentDay),
                );
                const todayUTC = new Date(
                  Date.UTC(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate(),
                  ),
                );

                const mainTotalDays = Math.max(
                  1,
                  Math.floor(
                    (actualEndDate - joinDate) / (1000 * 60 * 60 * 24),
                  ),
                );

                let mainElapsedDays = Math.floor(
                  (todayUTC - joinDate) / (1000 * 60 * 60 * 24),
                );

                // ✅ Prevent negative progress
                mainElapsedDays = Math.max(0, mainElapsedDays);

                let mainPercent = Math.round(
                  (mainElapsedDays / mainTotalDays) * 100,
                );

                // ✅ Clamp between 0–100
                mainPercent = Math.min(Math.max(mainPercent, 0), 100);

                hiredPercent += mainPercent;
                extensionBars.push({
                  label: "Main Probation",
                  percent: mainPercent,
                });

                // ✅ Extension logic
                const extensions = parseInt(
                  probationExtendedNoOfTimes || "0",
                  10,
                );

                // Push full 100% bars for previous extensions (assumed complete)
                for (let i = 0; i < extensions - 1; i++) {
                  extensionBars.push({
                    label: `Extended Probation ${i + 1}`,
                    percent: 100,
                  });
                  hiredPercent += 100;
                }

                // For the most recent extension, calculate from `createdAt` to `currentProbationEndDate`
                if (
                  extensions > 0 &&
                  createdAt &&
                  currentEndDate > actualEndDate
                ) {
                  const extensionTotal = Math.floor(
                    (currentEndDate - createdAt) / (1000 * 60 * 60 * 24),
                  );
                  let extensionElapsed = Math.floor(
                    (todayUTC - createdAt) / (1000 * 60 * 60 * 24),
                  );
                  if (
                    extensionElapsed < 0 ||
                    todayUTC.getTime() === createdAt.getTime()
                  )
                    extensionElapsed = 0;

                  const extensionPercent = Math.round(
                    (extensionElapsed / extensionTotal) * 100,
                  );
                  extensionBars.push({
                    label: `Extended Probation ${extensions}`,
                    percent: extensionPercent,
                  });
                  hiredPercent += extensionPercent;
                }

                hiredPercent = Math.min(hiredPercent, 300);
              }
            } catch (e) {
              console.warn("⚠️ Error calculating hiredPercent:", e);
              hiredPercent = 100;
            }

            if (currentProbationEndDate && currentProbationEndDate !== "N/A") {
              const [day, month, year] = currentProbationEndDate.split("-");
              const endDate = new Date(`${year}-${month}-${day}T00:00:00`);
              const today = new Date();
              // Zero out time for today
              today.setHours(0, 0, 0, 0);
              const diffMs = today - endDate;
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              confirmationOverdueDays =
                diffDays > 0 ? diffDays.toString() : "0";
            }

            let extendedPercent = null;
            try {
              if (
                probationExtendedNoOfTimes !== "0" &&
                actualProbationEndDate !== "N/A" &&
                currentProbationEndDate !== "N/A"
              ) {
                const [
                  actualDay,
                  actualMonth,
                  actualYear,
                ] = actualProbationEndDate.split("-");
                const [
                  currentDay,
                  currentMonth,
                  currentYear,
                ] = currentProbationEndDate.split("-");

                const actualDate = new Date(
                  `${actualYear}-${actualMonth}-${actualDay}`,
                );
                const currentDate = new Date(
                  `${currentYear}-${currentMonth}-${currentDay}`,
                );
                const today = new Date();

                const totalExtendedDays = Math.max(
                  1,
                  Math.ceil((currentDate - actualDate) / (1000 * 60 * 60 * 24)),
                );
                const elapsedExtendedDays = Math.max(
                  0,
                  Math.ceil((today - actualDate) / (1000 * 60 * 60 * 24)),
                );

                extendedPercent = Math.round(
                  (elapsedExtendedDays / totalExtendedDays) * 100,
                );
                extendedPercent = Math.min(extendedPercent, 300);
              }
            } catch (e) {
              console.warn("⚠️ Error calculating extendedPercent:", e);
              extendedPercent = null;
            }

            return {
              id: item.empId,
              empCode: item.empCode,
              profilePic:
                item.profilePicUrl ||
                "https://placehold.co/48x48/aabbcc/ffffff?text=EMP",
              name: `${item.firstName || ""} ${item.lastName || ""}`.trim(),
              email: item.emailId,
              role: item.roles,
              phoneNumber: item.primaryContactNo,
              rsManager: item.reportingManager,
              dateOfJoining: formatDate(item.dateOfJoining),
              probationDays: item.probationDay
                ? `${item.probationDay} Days`
                : "N/A",
              department: item.department || "N/A",
              r1ApprovalStatus,
              hrStatus,
              probationExtendedNoOfTimes,
              confirmationOverdueDays: "0",
              actualProbationEndDate,
              currentProbationEndDate,
              status,
              hiredPercent,
              extendedPercent,
              extensionBars,
              confirmationOverdueDays,
            };
          }),
        );
        setEmployees(transformedData);
      } catch (error) {
        console.error("❌ Error fetching employees:", error);
        setError(
          "Failed to load employees. Please ensure your Spring Boot API is running.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!loading && empId && employees.length > 0) {
      const employeeFromUrl = employees.find((emp) => String(emp.id) === empId);
      if (employeeFromUrl) {
        setSelectedEmployee(employeeFromUrl);
        setShowViewDetails(true);
      } else {
        navigate("/", { replace: true });
      }
    } else if (!loading && !empId && showViewDetails) {
      setShowViewDetails(false);
      setSelectedEmployee(null);
    }
  }, [empId, employees, loading, navigate, showViewDetails]);

  const filteredEmployees = employees.filter((employee) => {
    const normalizedStatus = employee.status?.toLowerCase();

    const matchesFilter =
      activeFilter === "All"
        ? normalizedStatus === "probation" ||
          normalizedStatus.includes("extended")
        : activeFilter === "Probation"
        ? normalizedStatus === "probation"
        : activeFilter === "Probation Extended"
        ? normalizedStatus.includes("extended")
        : true;

    const matchesSearch =
      employee.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchText.toLowerCase());

    const matchesAdvanced =
      (!advancedFilter.department ||
        employee.department
          ?.toLowerCase()
          .includes(advancedFilter.department.toLowerCase())) &&
      (!advancedFilter.manager ||
        employee.rsManager
          ?.toLowerCase()
          .includes(advancedFilter.manager.toLowerCase()));

    return matchesFilter && matchesSearch && matchesAdvanced;
  });

  const EmployeeCard = ({ employee }) => {
    const [showEmailDropdown, setShowEmailDropdown] = useState(false);
    const emailWrapperRef = useRef(null);
    const percentWrapperRef = useRef(null);

    const toggleEmailDropdown = () => {
      setShowEmailDropdown(!showEmailDropdown);
    };

    useEffect(() => {
      function handleClickOutside(event) {
        if (
          emailWrapperRef.current &&
          !emailWrapperRef.current.contains(event.target)
        ) {
          setShowEmailDropdown(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleViewDetails = () => {
      setSelectedEmployee(employee);
      setShowViewDetails(true);
      navigate(`/view-details/${employee.empCode}`);
    };

    const getProgressColor = (percent) => {
      if (percent === 100) return "bg-green-500";
      if (percent >= 70) return "bg-cyan-500";
      if (percent >= 50) return "bg-yellow-400";
      return "bg-gray-400";
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          percentWrapperRef.current &&
          !percentWrapperRef.current.contains(event.target)
        ) {
          setActiveHiredDropdownId(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [setActiveHiredDropdownId]);

    return (
      <div className="bg-[#FAFAFA] rounded-[40px] shadow-lg p-4 sm:p-6 mb-6 mx-auto w-full max-w-full md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between border-b border-gray-200 pb-4 mb-4 gap-y-4 sm:gap-y-0 min-w-0">
          <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
            <img
              src={
                employee.profilePic ||
                "https://placehold.co/48x48/aabbcc/ffffff?text=EMP"
              }
              alt={employee.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex flex-col gap-1 min-w-0 flex-grow">
              <p className="font-semibold text-lg text-gray-800 truncate">
                {employee.name}
              </p>
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center gap-x-2 gap-y-1 relative min-w-0"
                ref={emailWrapperRef}
              >
                <div className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap min-w-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-600 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p
                    className="text-gray-600 text-sm underline-offset-2 hover:underline cursor-pointer truncate"
                    onClick={toggleEmailDropdown}
                  >
                    {employee.email}
                  </p>
                </div>

                <span className="text-gray-400 text-sm hidden sm:inline">
                  |
                </span>

                <div className="flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                  <MdCall className="text-gray-600 opacity-50 text-sm" />
                  <span className="text-gray-600 text-sm">
                    {employee.phoneNumber}
                  </span>
                </div>

                <div
                  className="flex items-center gap-2 mt-2 sm:mt-0 mx-auto w-fit relative"
                  ref={percentWrapperRef}
                >
                  <button
                    className="flex items-center gap-2 text-sm font-semibold group focus:outline-none"
                    onClick={() =>
                      setActiveHiredDropdownId(
                        activeHiredDropdownId === employee.empCode
                          ? null
                          : employee.empCode,
                      )
                    }
                  >
                    <div className="w-28 h-2 rounded-full bg-gray-200 overflow-hidden group-hover:shadow-md group-hover:scale-[1.02] transition-transform duration-200">
                      <div
                        className={`h-full ${getProgressColor(
                          employee.hiredPercent,
                        )} rounded-full`}
                        style={{ width: `${employee.hiredPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-blue-600 group-hover:text-blue-800 group-hover:transition duration-200">
                      {employee.hiredPercent}%
                    </span>
                  </button>

                  {activeHiredDropdownId === employee.empCode && (
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-md rounded-md z-10">
                      <div className="px-4 py-2 text-sm text-gray-800 space-y-3">
                        {employee.extensionBars?.length > 0 ? (
                          employee.extensionBars.map((ext, index) => (
                            <div key={index}>
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Extended Percentage {index + 1}: {ext.percent}%
                              </p>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getProgressColor(
                                    ext.percent,
                                  )} rounded-full`}
                                  style={{ width: `${ext.percent}%` }}
                                ></div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-600">
                            No probation extension.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {showEmailDropdown && (
                  <div className="absolute z-10 bg-white shadow-lg rounded-md mt-2 w-40 left-0 top-full border border-gray-200">
                    <a
                      href={`mailto:${employee.email}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowEmailDropdown(false)}
                    >
                      Open Default Client
                    </a>
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${employee.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowEmailDropdown(false)}
                    >
                      Open in Gmail
                    </a>
                    <a
                      href={`https://outlook.live.com/mail/0/deeplink/compose?to=${employee.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowEmailDropdown(false)}
                    >
                      Open in Outlook
                    </a>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm">{employee.role}</p>
            </div>
          </div>
          {/* Approval Statuses: Stack vertically on mobile, then go side-by-side on sm breakpoint */}
          <div className="flex flex-col xs:flex-row items-start xs:items-center sm:flex-row sm:items-center sm:justify-end gap-x-6 gap-y-2 flex-wrap sm:flex-nowrap min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
              <span className="text-gray-600 text-sm whitespace-nowrap">
                R1 Approval:
              </span>
              <span
                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
                                ${
                                  employee.r1ApprovalStatus === "Approved"
                                    ? "bg-green-100 text-green-800 border border-green-500"
                                    : "bg-orange-100 text-orange-800 border border-orange-500"
                                }`}
              >
                {employee.r1ApprovalStatus === "Approved" ? (
                  <span className="mr-1 text-green-600">✓</span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 flex-shrink-0 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {employee.r1ApprovalStatus}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
              <span className="text-gray-600 text-sm whitespace-nowrap">
                HR Status:
              </span>
              <span
                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
                                ${
                                  employee.hrStatus === "Completed"
                                    ? "bg-green-100 text-green-800 border border-green-500"
                                    : "bg-orange-100 text-orange-800 border border-orange-500"
                                }`}
              >
                {employee.hrStatus === "Completed" ? (
                  <span className="mr-1 text-green-600">✓</span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 flex-shrink-0 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {employee.hrStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Section - Probation Details */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-y-6 gap-x-4 text-sm text-gray-700 border-b border-gray-300 pb-5 mb-6">
          <div>
            <p className="text-gray-500 text-xs">Department</p>
            <p className="text-gray-800 font-semibold break-words">
              {employee.department}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">R1 Manager</p>
            <p className="text-gray-900 font-bold break-words">
              {employee.rsManager}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Date of Joining</p>
            <p className="text-gray-800 font-medium break-words">
              {employee.dateOfJoining}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Probation Days</p>
            <p className="text-gray-900 font-bold break-words">
              {employee.probationDays}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Actual End Date</p>
            <p className="text-gray-800 font-medium break-words">
              {employee.actualProbationEndDate}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Extended No. of Times</p>
            <p className="text-gray-800 font-medium break-words">
              {employee.probationExtendedNoOfTimes}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Status</p>
            <p className="text-gray-900 font-bold break-words">
              {employee.status}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm items-center">
          <div className="sm:col-span-1 text-center">
            <p className="text-gray-500">Confirmation Overdue in Days</p>
            <p className="text-red-500 text-xl font-bold">
              {employee.confirmationOverdueDays}
            </p>
          </div>

          <div className="sm:col-span-1 text-center">
            <p className="text-gray-500">Current Probation End Date</p>
            <p className="text-gray-800 font-medium break-words">
              {employee.currentProbationEndDate}
            </p>
          </div>

          <div className="flex justify-center sm:justify-end sm:col-span-1">
            <button
              className="text-red-600 font-semibold flex items-center gap-1 hover:text-red-700 transition duration-200"
              onClick={handleViewDetails}
            >
              View Details
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleCloseViewDetails = () => {
    setShowViewDetails(false);
    setSelectedEmployee(null);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-white py-6 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6 text-center sm:text-left">
          Employee Confirmation
        </h1>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4 px-2 sm:px-0">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-80 max-w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search Employees"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <button
            className="flex-shrink-0 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 w-full sm:w-auto max-w-full"
            onClick={() => {
              setShowAdvancedFilter((prev) => {
                if (prev) {
                  setAdvancedFilter({ department: "", manager: "" }); // 🔁 Reset filter fields when hiding
                }
                return !prev;
              });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293-.707V19l-4 4v-3.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Advance Filter
          </button>
        </div>
        {showAdvancedFilter && (
          <div className="mb-6 mt-2 border p-4 rounded-md bg-gray-50 shadow-sm flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Filter by Department"
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-gray-500 text-sm"
              value={advancedFilter.department}
              onChange={(e) =>
                setAdvancedFilter((prev) => ({
                  ...prev,
                  department: e.target.value,
                }))
              }
            />
            <input
              type="text"
              placeholder="Filter by R1 Manager"
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder:text-gray-500 text-sm"
              value={advancedFilter.manager}
              onChange={(e) =>
                setAdvancedFilter((prev) => ({
                  ...prev,
                  manager: e.target.value,
                }))
              }
            />
          </div>
        )}
        <div className="flex flex-wrap gap-3 mb-8 px-2 sm:px-0">
          <button
            className={`px-5 py-2 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${
              activeFilter === "All"
                ? "bg-[#ef4444] text-white border border-[#ef4444]"
                : "bg-white text-black border border-gray-800 hover:bg-gray-100"
            }`}
            onClick={() => setActiveFilter("All")}
          >
            All
          </button>

          <button
            className={`px-5 py-2 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${
              activeFilter === "Probation"
                ? "bg-[#ef4444] text-white border border-[#ef4444]"
                : "bg-white text-black border border-gray-800 hover:bg-gray-100"
            }`}
            onClick={() => setActiveFilter("Probation")}
          >
            Probation
          </button>

          <button
            className={`px-5 py-2 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${
              activeFilter === "Probation Extended"
                ? "bg-[#ef4444] text-white border border-[#ef4444]"
                : "bg-white text-black border border-gray-800 hover:bg-gray-100"
            }`}
            onClick={() => setActiveFilter("Probation Extended")}
          >
            Probation Extended
          </button>
        </div>

        <div className="space-y-6 flex flex-col items-center">
          {loading && (
            <p className="text-gray-700 text-lg">Loading employees...</p>
          )}
          {error && <p className="text-red-600 text-lg">{error}</p>}
          {!loading && !error && filteredEmployees.length === 0 && (
            <p className="text-gray-700 text-lg">
              No employees found for the selected filter.
            </p>
          )}
          {!loading &&
            !error &&
            filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                activeHiredDropdownId={activeHiredDropdownId}
                setActiveHiredDropdownId={setActiveHiredDropdownId}
              />
            ))}
        </div>
      </div>

      {showViewDetails && selectedEmployee && (
        <ViewDetails
          employee={selectedEmployee}
          onClose={handleCloseViewDetails}
        />
      )}
    </div>
  );
};

export default EmployeeConfirmation;
