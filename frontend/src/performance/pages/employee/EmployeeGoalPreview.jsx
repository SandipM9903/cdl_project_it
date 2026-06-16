import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiBriefcase,
  FiMail,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiTarget,
  FiBookOpen,
  FiPercent,
  FiTrendingUp,
  FiAward,
  FiCalendar,
  FiUserCheck,
  FiAlertCircle,
  FiLoader,
  FiInfo,
  FiEdit,
  FiSend,
  FiEye,
} from "react-icons/fi";
import axios from "axios";
import Header from "../../../components/Header";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP } from "../../services/api";
import LoadingAnimation from "../../components/common/LoadingAnimation";

// Helper function to get full name with priority to fullNameAsAadhaar
const getFullName = (data) => {
  if (!data) return null;
  
  // Check for fullNameAsAadhaar
  if (data.fullNameAsAadhaar && data.fullNameAsAadhaar.trim() !== "") {
    return data.fullNameAsAadhaar.trim();
  }
  
  // Check for employeeFullName
  if (data.employeeFullName && data.employeeFullName.trim() !== "") {
    return data.employeeFullName.trim();
  }
  
  // Check for name
  if (data.name && data.name.trim() !== "") {
    return data.name.trim();
  }
  
  // Fallback to firstName, middleName, lastName
  const firstName = data.firstName || "";
  const middleName = data.middleName || "";
  const lastName = data.lastName || "";
  const fullName = `${firstName} ${middleName} ${lastName}`.trim();
  
  if (fullName && fullName !== "") {
    return fullName;
  }
  
  return null;
};

// Helper function to get employee full name - only fullNameAsAadhaar
const getEmployeeFullName = (employeeData) => {
  if (!employeeData) return "Employee Name";
  const name = getFullName(employeeData);
  return name || "Employee Name";
};

// Helper function to get manager name from reportingManager field
const getManagerFullName = (employeeData) => {
  if (!employeeData) return "N/A";
  
  // Check for reportingManager field (which should contain the full name)
  if (employeeData.reportingManager && employeeData.reportingManager.trim() !== "") {
    return employeeData.reportingManager.trim();
  }
  
  // Fallback to reportingManagerEmailId
  if (employeeData.reportingManagerEmailId) {
    const emailName = employeeData.reportingManagerEmailId.split("@")[0];
    return emailName
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
  
  return "N/A";
};

const EmployeeGoalPreview = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const yearParam = queryParams.get("year");
  const quarterParam = queryParams.get("quarter");

  const [employeeData, setEmployeeData] = useState(null);
  const [smartGoals, setSmartGoals] = useState([]);
  const [developmentGoals, setDevelopmentGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(yearParam || new Date().getFullYear().toString());
  const [selectedQuarter, setSelectedQuarter] = useState(quarterParam || "Q1");
  const [activeTab, setActiveTab] = useState("smart");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchEmployeeDetails();
    fetchSmartGoals();
    fetchDevelopmentGoals();
  }, []);

  const fetchEmployeeDetails = async () => {
    try {
      const storedEmpId = empId;
      if (!storedEmpId) {
        console.error("Employee ID not found");
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${BASE_URL_EPMS_EMP}/${storedEmpId}`);
      
      let employee = null;
      
      if (response.data) {
        if (response.data.fileAndObjectTypeBean?.empResDTO) {
          employee = response.data.fileAndObjectTypeBean.empResDTO;
        } else if (response.data.empResDTO) {
          employee = response.data.empResDTO;
        } else {
          employee = response.data;
        }
      }
      
      if (employee && employee.empCode) {
        console.log("Employee found:", {
          fullNameAsAadhaar: employee.fullNameAsAadhaar,
          reportingManager: employee.reportingManager
        });
        setEmployeeData(employee);
      } else {
        console.error(`Employee not found with ID: ${storedEmpId}`);
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
    }
  };

  const fetchSmartGoals = async () => {
    try {
      const url = `${BASE_URL_EPMS}/api/goals/employee/${empId}/${selectedQuarter}?year=${selectedYear}`;
      const response = await axios.get(url);

      let goalsData = [];
      if (response.data && response.data.data) {
        goalsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        goalsData = response.data;
      }

      setSmartGoals(goalsData);
    } catch (err) {
      console.error("Error fetching SMART goals:", err);
    }
  };

  const fetchDevelopmentGoals = async () => {
    try {
      const url = `${BASE_URL_EPMS}/api/development-goals/employee/${empId}/${selectedQuarter}?year=${selectedYear}`;
      const response = await axios.get(url);

      let devGoalsData = [];
      if (response.data && response.data.data) {
        devGoalsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        devGoalsData = response.data;
      }

      setDevelopmentGoals(devGoalsData);
    } catch (err) {
      console.error("Error fetching development goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      DRAFT: { color: "gray", icon: FiClock, text: "Draft" },
      PENDING_APPROVAL: { color: "yellow", icon: FiClock, text: "Pending Approval" },
      APPROVED: { color: "green", icon: FiCheckCircle, text: "Approved" },
      SENT_BACK: { color: "red", icon: FiAlertCircle, text: "Sent Back" },
      SELF_REVIEWED: { color: "blue", icon: FiEye, text: "Self Reviewed" },
      MANAGER_REVIEWED: { color: "purple", icon: FiUserCheck, text: "Manager Reviewed" },
      ACCEPTED_BY_EMPLOYEE: { color: "green", icon: FiCheckCircle, text: "Accepted" },
      FINAL_SUBMITTED_TO_HR: { color: "indigo", icon: FiSend, text: "Final Submitted" },
    };
    const config = statusConfig[status] || statusConfig.DRAFT;
    const Icon = config.icon;
    const colorClasses = {
      gray: "bg-gray-100 text-gray-700",
      yellow: "bg-yellow-100 text-yellow-700",
      green: "bg-green-100 text-green-700",
      red: "bg-red-100 text-red-700",
      blue: "bg-blue-100 text-blue-700",
      purple: "bg-purple-100 text-purple-700",
      indigo: "bg-indigo-100 text-indigo-700",
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses[config.color]}`}>
        <Icon size={12} />
        {config.text}
      </span>
    );
  };

  const getQuarterDates = (quarter, year) => {
    const yearNum = parseInt(year);
    const quarterDatesMap = {
      Q1: `01-Apr-${yearNum} to 30-Jun-${yearNum}`,
      Q2: `01-Jul-${yearNum} to 30-Sep-${yearNum}`,
      Q3: `01-Oct-${yearNum} to 31-Dec-${yearNum}`,
      Q4: `01-Jan-${yearNum + 1} to 31-Mar-${yearNum + 1}`,
    };
    return quarterDatesMap[quarter] || "";
  };

  const calculateTotalWeightage = () => {
    return smartGoals.reduce((total, goal) => total + (goal.weightage || 0), 0);
  };

  const totalWeightage = calculateTotalWeightage();
  const isValidWeightage = totalWeightage === 100;
  const weightageProgress = Math.min((totalWeightage / 100) * 100, 100);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading your goals..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="mt-24 px-4 md:px-8 max-w-7xl mx-auto w-full pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors mr-4 font-medium"
          >
            <FiArrowLeft size={16} />
            Back
          </button>
          <span className="text-gray-400">/</span>
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors ml-2"
          >
            Home
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span
            onClick={() => navigate("/EmployeeAppraisal")}
            className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
          >
            My Appraisal
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600">Goal Preview</span>
        </nav>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiEye className="text-red-600" />
            Goal Summary
          </h1>
          <p className="text-gray-500 mt-1 ml-10">
            Review your SMART goals and development objectives for the quarter
          </p>
        </div>

        {/* Employee Profile Card */}
        <div className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden border border-gray-100">
          <div className="bg-red-600 px-6 py-3">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <FiUser />
              Employee Information
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center shadow-inner">
                <FiUser className="text-red-600 text-3xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {getEmployeeFullName(employeeData)}
                </h3>
                <p className="text-gray-500">{employeeData?.designationName || "Designation"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiBriefcase className="text-gray-400 text-lg" />
                <div>
                  <p className="text-xs text-gray-500">Employee ID</p>
                  <p className="font-semibold text-gray-800">{employeeData?.empCode || empId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiMail className="text-gray-400 text-lg" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800 truncate max-w-[200px]">{employeeData?.emailId || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiUserCheck className="text-gray-400 text-lg" />
                <div>
                  <p className="text-xs text-gray-500">Reporting Manager</p>
                  <p className="font-semibold text-gray-800">{getManagerFullName(employeeData)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quarter Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-md mb-6 p-6 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-blue-600 font-medium">Financial Year</p>
              <p className="text-2xl font-bold text-gray-800">{selectedYear}-{parseInt(selectedYear) + 1}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-600 font-medium">Quarter</p>
              <p className="text-2xl font-bold text-red-600">{selectedQuarter}</p>
            </div>
            <div className="text-center md:col-span-2">
              <p className="text-sm text-blue-600 font-medium">Period</p>
              <p className="text-lg font-semibold text-gray-700">{getQuarterDates(selectedQuarter, selectedYear)}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("smart")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all rounded-t-lg ${
              activeTab === "smart"
                ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FiTarget size={16} />
            SMART Goals
            {smartGoals.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-gray-200 rounded-full">{smartGoals.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("development")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all rounded-t-lg ${
              activeTab === "development"
                ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FiBookOpen size={16} />
            Development Goals
            {developmentGoals.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-gray-200 rounded-full">{developmentGoals.length}</span>
            )}
          </button>
        </div>

        {/* SMART Goals Section */}
        {activeTab === "smart" && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gray-800 px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                    <FiTarget />
                    SMART Goals
                  </h2>
                  <p className="text-gray-300 text-sm mt-1">
                    {smartGoals.length} goal(s) defined for this quarter
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center min-w-[180px]">
                  <p className="text-white text-xs">Total Weightage</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-2xl font-bold ${isValidWeightage ? "text-green-400" : "text-yellow-400"}`}>
                      {totalWeightage}%
                    </span>
                    <span className="text-white/60 text-sm">/ 100%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${isValidWeightage ? "bg-green-400" : "bg-yellow-400"}`}
                      style={{ width: `${weightageProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {smartGoals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiTarget className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No SMART Goals Found</h3>
                  <p className="text-gray-500">No SMART goals have been created for this quarter yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {smartGoals.map((goal, index) => (
                    <div key={goal.id || index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
                      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-semibold text-red-600">
                              {index + 1}
                            </span>
                            <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(goal.status)}
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                              <FiPercent size={10} />
                              {goal.weightage}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Target</p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {goal.target || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Created On</p>
                            <p className="text-sm text-gray-700 flex items-center gap-1">
                              <FiCalendar className="text-gray-400 text-xs" />
                              {formatDate(goal.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Self Review Section (if available) */}
                        {(goal.remarks || goal.selfAssessmentScore > 0) && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex items-center gap-2 text-green-700 mb-3">
                              <FiCheckCircle size={16} />
                              <p className="text-sm font-medium">Self Review</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {goal.remarks && (
                                <div>
                                  <p className="text-xs text-green-600 mb-1">Remarks</p>
                                  <p className="text-sm text-gray-700">{goal.remarks}</p>
                                </div>
                              )}
                              {goal.selfAssessmentScore > 0 && (
                                <div>
                                  <p className="text-xs text-green-600 mb-1">Self Assessment Score</p>
                                  <p className="text-2xl font-bold text-green-700">
                                    {goal.selfAssessmentScore}
                                    <span className="text-sm text-gray-500 ml-1">/100</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Manager Review Section (if available) */}
                        {(goal.managerComment || goal.managerAssessmentScore > 0) && (
                          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="flex items-center gap-2 text-purple-700 mb-3">
                              <FiUserCheck size={16} />
                              <p className="text-sm font-medium">Manager Review</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {goal.managerComment && (
                                <div>
                                  <p className="text-xs text-purple-600 mb-1">Manager Comments</p>
                                  <p className="text-sm text-gray-700">{goal.managerComment}</p>
                                </div>
                              )}
                              {goal.managerAssessmentScore > 0 && (
                                <div>
                                  <p className="text-xs text-purple-600 mb-1">Manager Assessment Score</p>
                                  <p className="text-2xl font-bold text-purple-700">
                                    {goal.managerAssessmentScore}
                                    <span className="text-sm text-gray-500 ml-1">/100</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Development Goals Section */}
        {activeTab === "development" && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gray-800 px-6 py-4">
              <div>
                <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                  <FiBookOpen />
                  Development Goals
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  {developmentGoals.length} development goal(s) for training and skill enhancement
                </p>
              </div>
            </div>

            <div className="p-6">
              {developmentGoals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiBookOpen className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Development Goals Found</h3>
                  <p className="text-gray-500">No development goals have been created for this quarter yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {developmentGoals.map((goal, index) => (
                    <div key={goal.id || index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
                      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-semibold text-red-600">
                              {index + 1}
                            </span>
                            <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(goal.status)}
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Training Name</p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {goal.trainingName || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Created On</p>
                            <p className="text-sm text-gray-700 flex items-center gap-1">
                              <FiCalendar className="text-gray-400 text-xs" />
                              {formatDate(goal.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Description / Plan</p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {goal.description || "No description provided"}
                          </p>
                        </div>

                        {/* Self Review Section for Development Goals */}
                        {goal.remarks && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex items-center gap-2 text-green-700 mb-2">
                              <FiCheckCircle size={16} />
                              <p className="text-sm font-medium">Self Review Remarks</p>
                            </div>
                            <p className="text-sm text-gray-700">{goal.remarks}</p>
                          </div>
                        )}

                        {/* Manager Review Section for Development Goals */}
                        {goal.managerComment && (
                          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="flex items-center gap-2 text-purple-700 mb-2">
                              <FiUserCheck size={16} />
                              <p className="text-sm font-medium">Manager Comments</p>
                            </div>
                            <p className="text-sm text-gray-700">{goal.managerComment}</p>
                          </div>
                        )}

                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-2 text-blue-700">
                            <FiInfo size={14} />
                            <p className="text-xs">Development goals track your training progress and skill enhancement</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary Stats Card */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total SMART Goals</p>
                <p className="text-2xl font-bold text-gray-800">{smartGoals.length}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FiTarget className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Development Goals</p>
                <p className="text-2xl font-bold text-gray-800">{developmentGoals.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FiBookOpen className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Weightage</p>
                <p className={`text-2xl font-bold ${isValidWeightage ? "text-green-600" : "text-yellow-600"}`}>
                  {totalWeightage}%
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FiPercent className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Quarter</p>
                <p className="text-2xl font-bold text-red-600">{selectedQuarter}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <FiCalendar className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <FiArrowLeft />
            Go Back
          </button>
          {smartGoals.some(goal => goal.status === "APPROVED") && (
            <button
              onClick={() => navigate(`/employee/self-review/${empId}?year=${selectedYear}&quarter=${selectedQuarter}`)}
              className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
            >
              <FiEdit />
              Start Self Review
            </button>
          )}
        </div>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-700 flex items-start gap-2">
            <FiInfo className="mt-0.5 flex-shrink-0" />
            <span>
              <strong>SMART Goals:</strong> Specific, Measurable, Achievable, Relevant, Time-bound objectives.
              <strong className="ml-2">Development Goals:</strong> Training and skill development objectives.
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EmployeeGoalPreview;