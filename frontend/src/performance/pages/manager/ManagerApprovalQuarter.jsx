import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiSend,
  FiMessageSquare,
  FiAlertCircle,
  FiEye,
  FiThumbsUp,
  FiThumbsDown,
  FiUserCheck,
  FiCalendar,
  FiPercent,
  FiTarget,
  FiLoader,
  FiBookOpen,
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

// Helper function to get employee full name
const getEmployeeFullName = (employeeData) => {
  if (!employeeData) return "Employee Name";
  const name = getFullName(employeeData);
  return name || "Employee Name";
};

// Custom Modal Component
const CustomModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "OK", cancelText = "Cancel", type = "info", autoCloseDelay = 2000 }) => {
  useEffect(() => {
    if (isOpen && type === "success") {
      const timer = setTimeout(() => {
        if (onConfirm) {
          onConfirm();
        } else {
          onClose();
        }
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, autoCloseDelay, onConfirm, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />;
      case "error":
        return <FiXCircle className="text-red-500 text-5xl mx-auto mb-4" />;
      case "warning":
        return <FiAlertCircle className="text-yellow-500 text-5xl mx-auto mb-4" />;
      default:
        return <FiMessageSquare className="text-red-500 text-5xl mx-auto mb-4" />;
    }
  };

  const handleOkClick = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-fadeIn">
        <div className="p-6 text-center">
          {getIcon()}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-center gap-3">
            {type === "success" ? (
              <button
                onClick={handleOkClick}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                OK
              </button>
            ) : (
              <>
                {onConfirm && (
                  <button
                    onClick={onConfirm}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {confirmText}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {cancelText}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ManagerApprovalQuarter = () => {
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
  const [submitting, setSubmitting] = useState(false);
  const [selectedYear, setSelectedYear] = useState(yearParam || new Date().getFullYear().toString());
  const [selectedQuarter, setSelectedQuarter] = useState(quarterParam || "Q1");
  const [approvalComment, setApprovalComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModal, setInfoModal] = useState({ title: "", message: "", type: "info", onConfirm: null });
  const [actionType, setActionType] = useState(null);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [expandedDevGoal, setExpandedDevGoal] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEmployeeDetails();
    fetchSmartGoals();
    fetchDevelopmentGoals();
  }, []);

  const showInfoModalMessage = (title, message, type = "info", onConfirm = null) => {
    setInfoModal({ title, message, type, onConfirm });
    setShowInfoModal(true);
  };

  const closeInfoModal = () => {
    setShowInfoModal(false);
  };

  const fetchEmployeeDetails = async () => {
    try {
      if (!empId) return;

      // Corrected API endpoint - using BASE_URL_EPMS_EMP with the empId
      const response = await axios.get(`${BASE_URL_EPMS_EMP}/${empId}`);

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
          firstName: employee.firstName,
          lastName: employee.lastName
        });
        setEmployeeData(employee);
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

      const pendingSmartGoals = goalsData.filter(
        (goal) => goal.status === "PENDING_APPROVAL",
      );
      setSmartGoals(pendingSmartGoals);
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

      const pendingDevGoals = devGoalsData.filter(
        (goal) => goal.status === "PENDING_APPROVAL",
      );
      setDevelopmentGoals(pendingDevGoals);
    } catch (err) {
      console.error("Error fetching development goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAll = () => {
    const totalGoals = smartGoals.length + developmentGoals.length;
    if (totalGoals === 0) {
      showInfoModalMessage("No Goals", "No goals pending for approval", "warning");
      return;
    }
    setActionType("APPROVE");
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    setSubmitting(true);
    try {
      // Process SMART Goals
      if (smartGoals.length > 0) {
        const smartGoalIds = smartGoals.map((g) => g.id);
        const smartPayload = {
          managerId: localStorage.getItem("email") || "",
          employeeId: empId,
          quarter: selectedQuarter,
          year: parseInt(selectedYear),
          action: actionType,
          managerApprovalComment: actionType === "SEND_BACK" ? approvalComment : null,
          goalIds: smartGoalIds,
        };

        await axios.put(
          `${BASE_URL_EPMS}/api/goals/manager/approve-or-send-back`,
          smartPayload,
        );
      }

      // Process Development Goals
      if (developmentGoals.length > 0) {
        const devGoalIds = developmentGoals.map((g) => g.id);

        for (const goalId of devGoalIds) {
          if (actionType === "APPROVE") {
            await axios.put(
              `${BASE_URL_EPMS}/api/development-goals/approve/${goalId}`,
              null,
              {
                params: { comment: null },
              },
            );
          } else {
            await axios.put(
              `${BASE_URL_EPMS}/api/development-goals/send-back/${goalId}`,
              null,
              {
                params: { comment: approvalComment },
              },
            );
          }
        }
      }

      const totalGoals = smartGoals.length + developmentGoals.length;
      const message =
        actionType === "APPROVE"
          ? `${totalGoals} goal(s) approved successfully!`
          : `${totalGoals} goal(s) sent back to employee with comments!`;

      setShowModal(false);
      setApprovalComment("");
      setActionType(null);

      await fetchSmartGoals();
      await fetchDevelopmentGoals();

      showInfoModalMessage("Success", message, "success", () => {
        navigate(-1);
      });
    } catch (err) {
      console.error("Error processing approval:", err);
      setShowModal(false);
      showInfoModalMessage(
        "Error",
        err.response?.data?.message || "Failed to process. Please try again.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreviewGoal = (goal) => {
    setExpandedGoal(expandedGoal === goal.id ? null : goal.id);
  };

  const handlePreviewDevGoal = (goal) => {
    setExpandedDevGoal(expandedDevGoal === goal.id ? null : goal.id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
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
  const totalGoals = smartGoals.length + developmentGoals.length;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <LoadingAnimation message="Loading goals..." />
      </div>
    );
  }

  const hasAnyGoals = smartGoals.length > 0 || developmentGoals.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      {submitting && <LoadingAnimation message="Processing approval..." />}

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
            className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors ml-2 font-medium"
          >
            Home
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span
            onClick={() => navigate("/AppraisalList")}
            className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors font-medium"
          >
            Performance List
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600">Goal Approval</span>
        </nav>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiUserCheck className="text-red-500" />
            Review & Approve Goals
          </h1>
          <p className="text-gray-500 mt-1 ml-9">
            Review employee SMART goals and development goals, then approve with comments
          </p>
        </div>

        {/* Employee Profile Card */}
        <div className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-3">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <FiUser />
              Employee Information
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-inner">
                <FiUser className="text-red-500 text-3xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {getEmployeeFullName(employeeData)}
                </h3>
                <p className="text-gray-500">
                  {employeeData?.designationName || "Designation"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiBriefcase className="text-gray-400 text-lg" />
                <div>
                  <p className="text-xs text-gray-500">Employee ID</p>
                  <p className="font-semibold text-gray-800">
                    {employeeData?.empCode || empId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiMail className="text-gray-400 text-lg" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800 truncate max-w-[200px]">
                    {employeeData?.emailId || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiUserCheck className="text-gray-400 text-lg" />
                <div>
                  <p className="text-xs text-gray-500">Reporting Manager</p>
                  <p className="font-semibold text-gray-800">
                    {employeeData?.reportingManager || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quarter Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-md mb-6 p-6 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-blue-600 font-medium">
                Financial Year
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {selectedYear}-{parseInt(selectedYear) + 1}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-600 font-medium">Quarter</p>
              <p className="text-2xl font-bold text-red-600">
                {selectedQuarter}
              </p>
            </div>
            <div className="text-center md:col-span-2">
              <p className="text-sm text-blue-600 font-medium">Period</p>
              <p className="text-lg font-semibold text-gray-700">
                {getQuarterDates(selectedQuarter, selectedYear)}
              </p>
            </div>
          </div>
        </div>

        {/* SMART Goals Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-6">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4">
            <div>
              <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                <FiTarget />
                SMART Goals
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                {smartGoals.length} SMART goal(s) awaiting your review
              </p>
            </div>
          </div>

          <div className="p-6">
            {smartGoals.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiCheckCircle className="text-green-500 text-2xl" />
                </div>
                <p className="text-gray-500">No SMART goals pending approval</p>
              </div>
            ) : (
              <>
                {/* Weightage Summary */}
                <div
                  className={`rounded-xl p-4 mb-6 flex items-center justify-between ${isValidWeightage
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {isValidWeightage ? (
                      <FiCheckCircle className="text-green-600 text-xl" />
                    ) : (
                      <FiAlertCircle className="text-red-600 text-xl" />
                    )}
                    <div>
                      <p className="text-sm font-semibold">Total Weightage</p>
                      <p
                        className={`text-2xl font-bold ${isValidWeightage ? "text-green-700" : "text-red-700"
                          }`}
                      >
                        {totalWeightage}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Required: 100%</p>
                    {!isValidWeightage && (
                      <p className="text-xs text-red-500 mt-1">
                        ⚠️ Weightage must be 100% before approval
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {smartGoals.map((goal, index) => (
                    <div
                      key={goal.id || index}
                      className="border border-gray-200 rounded-xl transition-all duration-200 hover:border-red-200 hover:shadow-md"
                    >
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-semibold text-red-600">
                                  {index + 1}
                                </span>
                                <h3 className="font-semibold text-gray-800 text-lg">
                                  {goal.title}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                                  <FiClock size={10} />
                                  Pending Approval
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-gray-500">Target</p>
                                <p className="text-sm font-medium text-gray-700 break-words line-clamp-2">
                                  {goal.target || "No target specified"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Weightage
                                </p>
                                <p className="text-sm font-medium flex items-center gap-1">
                                  <FiPercent className="text-gray-400 text-xs" />
                                  {goal.weightage}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Created On
                                </p>
                                <p className="text-sm font-medium flex items-center gap-1">
                                  <FiCalendar className="text-gray-400 text-xs" />
                                  {formatDate(goal.createdAt)}
                                </p>
                              </div>
                            </div>

                            {expandedGoal === goal.id && (
                              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm font-semibold text-gray-700 mb-2">
                                  Full Description
                                </p>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                  {goal.target || "No target specified"}
                                </p>
                                {goal.remarks && (
                                  <>
                                    <p className="text-sm font-semibold text-gray-700 mt-3 mb-1">
                                      Additional Remarks
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {goal.remarks}
                                    </p>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Development Goals Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4">
            <div>
              <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                <FiBookOpen />
                Development Goals
              </h2>
              <p className="text-red-100 text-sm mt-1">
                {developmentGoals.length} Development goal(s) awaiting your
                review
              </p>
            </div>
          </div>

          <div className="p-6">
            {developmentGoals.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiCheckCircle className="text-green-500 text-2xl" />
                </div>
                <p className="text-gray-500">
                  No development goals pending approval
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {developmentGoals.map((goal, index) => (
                  <div
                    key={goal.id || index}
                    className="border border-gray-200 rounded-xl transition-all duration-200 hover:border-red-200 hover:shadow-md"
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-semibold text-red-600">
                                {index + 1}
                              </span>
                              <h3 className="font-semibold text-gray-800 text-lg">
                                {goal.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                                <FiClock size={10} />
                                Pending Approval
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">
                                Training Name
                              </p>
                              <p className="text-sm font-medium text-gray-700 break-words">
                                {goal.trainingName || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Created On
                              </p>
                              <p className="text-sm font-medium flex items-center gap-1">
                                <FiCalendar className="text-gray-400 text-xs" />
                                {formatDate(goal.createdAt)}
                              </p>
                            </div>
                          </div>

                          {expandedDevGoal === goal.id && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-sm font-semibold text-gray-700 mb-2">Description / Plan</p>
                              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                {goal.description || "No description provided"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        {hasAnyGoals && (
          <div className="flex justify-end pt-8 mt-4">
            <button
              onClick={handleApproveAll}
              disabled={
                submitting || (smartGoals.length > 0 && !isValidWeightage)
              }
              className={`px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium shadow-md ${smartGoals.length > 0 && !isValidWeightage
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={
                smartGoals.length > 0 && !isValidWeightage
                  ? "SMART goals total weightage must be 100% before approval"
                  : ""
              }
            >
              {submitting ? (
                <FiLoader className="animate-spin" />
              ) : (
                <FiThumbsUp />
              )}
              Approve All Goals ({totalGoals})
            </button>
          </div>
        )}

        {/* Info Note */}
        {hasAnyGoals && (
          <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-sm text-red-700 flex items-start gap-2">
              <FiMessageSquare className="mt-0.5 flex-shrink-0" />
              <span>
                <strong>SMART Goals:</strong> Total weightage must be 100%
                before approval. <strong>Development Goals:</strong> These are
                for training and skill development purposes.
              </span>
            </p>
          </div>
        )}

        {/* No Goals Message */}
        {!hasAnyGoals && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-green-500 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Pending Goals
            </h3>
            <p className="text-gray-500">
              All goals have been reviewed or no goals are pending approval.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>

      {/* Approval Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full animate-fadeIn">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FiThumbsUp className="text-green-600" />
                Confirm Goals Approval
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setApprovalComment("");
                  setActionType(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiXCircle size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Are you sure you want to approve all <strong>{totalGoals}</strong> goal(s) ({smartGoals.length} SMART, {developmentGoals.length} Development)?
                </p>

                {smartGoals.length > 0 && !isValidWeightage && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <FiAlertCircle />
                      <span className="text-sm font-medium">
                        Weightage Issue
                      </span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                      SMART goals total weightage is {totalWeightage}%. It
                      must be 100% before approval.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setApprovalComment("");
                    setActionType(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={
                    (smartGoals.length > 0 && !isValidWeightage) ||
                    submitting
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <FiLoader className="animate-spin" /> : <FiThumbsUp />}
                  Confirm Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Info Modal */}
      <CustomModal
        isOpen={showInfoModal}
        onClose={closeInfoModal}
        onConfirm={infoModal.onConfirm}
        title={infoModal.title}
        message={infoModal.message}
        type={infoModal.type}
      />

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

export default ManagerApprovalQuarter;