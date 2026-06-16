import React, { useEffect, useState, useCallback } from "react";
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
  FiEdit2,
  FiUserCheck,
  FiCalendar,
  FiPercent,
  FiTarget,
  FiStar,
  FiLoader,
  FiSave,
  FiInfo,
  FiBookOpen,
  FiAward,
  FiChevronLeft,
  FiChevronRight,
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-fadeIn">
        <div className="p-6 text-center">
          {getIcon()}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-center gap-3">
            {onConfirm && type !== "success" && (
              <button
                onClick={onConfirm}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {confirmText}
              </button>
            )}
            {type !== "success" && (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {cancelText}
              </button>
            )}
            {type === "success" && (
              <div className="text-sm text-gray-500 mt-2">Redirecting...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StartSelfReview = () => {
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
  
  // Self review data for SMART goals only
  const [selfReviews, setSelfReviews] = useState({});
  
  // Overall rating and comment (popup)
  const [showOverallModal, setShowOverallModal] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const [overallComment, setOverallComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  
  // Modal state
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModal, setInfoModal] = useState({ title: "", message: "", type: "info", onConfirm: null });

  // Active section for review
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  
  const hasSmartGoals = smartGoals.length > 0;
  const hasDevelopmentGoals = developmentGoals.length > 0;

  const showInfoModalMessage = (title, message, type = "info", onConfirm = null) => {
    setInfoModal({ title, message, type, onConfirm });
    setShowInfoModal(true);
  };

  const closeInfoModal = () => {
    setShowInfoModal(false);
    if (infoModal.onConfirm) {
      infoModal.onConfirm();
    }
  };

  // Determine available sections - SMART Goals first, then Development Goals
  const availableSections = [];
  if (hasSmartGoals) availableSections.push({ name: "SMART Goals", key: "smart", icon: FiTarget });
  if (hasDevelopmentGoals) availableSections.push({ name: "Development Goals", key: "development", icon: FiBookOpen });

  const currentSection = availableSections[activeSectionIndex];
  const isFirstSection = activeSectionIndex === 0;
  const isLastSection = activeSectionIndex === availableSections.length - 1;

  const handleNextSection = () => {
    if (!isLastSection) {
      setActiveSectionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevSection = () => {
    if (!isFirstSection) {
      setActiveSectionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle section click from progress indicator
  const handleSectionClick = (index) => {
    setActiveSectionIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEmployeeDetails();
    fetchSmartGoals();
    fetchDevelopmentGoals();
  }, []);

  const fetchEmployeeDetails = async () => {
    try {
      const storedEmpId = empId;
      if (!storedEmpId) return;
      
      // Corrected API endpoint - using BASE_URL_EPMS_EMP with the storedEmpId
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

      const approvedGoals = goalsData.filter(goal => goal.status === "APPROVED");
      setSmartGoals(approvedGoals);
      
      const initialReviews = {};
      approvedGoals.forEach(goal => {
        initialReviews[goal.id] = {
          remarks: goal.remarks || "",
          selfAssessmentScore: goal.selfAssessmentScore || "",
        };
      });
      setSelfReviews(initialReviews);
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

      const approvedDevGoals = devGoalsData.filter(goal => goal.status === "APPROVED");
      setDevelopmentGoals(approvedDevGoals);
    } catch (err) {
      console.error("Error fetching development goals:", err);
    } finally {
      setLoading(false);
    }
  };

  // SMART Goals handlers
  const handleRemarksChange = (goalId, value) => {
    setSelfReviews(prev => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        remarks: value,
      },
    }));
  };

  const handleSelfAssessmentChange = (goalId, value) => {
    const score = parseInt(value) || 0;
    if (score >= 0 && score <= 100) {
      setSelfReviews(prev => ({
        ...prev,
        [goalId]: {
          ...prev[goalId],
          selfAssessmentScore: value,
        },
      }));
    }
  };

  const validateSelfReviews = () => {
    let isValid = true;
    const errors = [];

    smartGoals.forEach(goal => {
      const review = selfReviews[goal.id];
      if (!review.remarks || review.remarks.trim() === "") {
        errors.push(`Please add remarks for SMART goal: ${goal.title}`);
        isValid = false;
      }
      const score = parseInt(review.selfAssessmentScore);
      if (isNaN(score) || score < 0 || score > 100) {
        errors.push(`Please enter a valid self assessment score (0-100) for SMART goal: ${goal.title}`);
        isValid = false;
      }
    });

    if (!isValid) {
      showInfoModalMessage("Validation Error", errors.join("\n"), "warning");
    }
    return isValid;
  };

  const handleSubmitReview = () => {
    if (!validateSelfReviews()) {
      return;
    }
    setShowOverallModal(true);
  };

  const handleFinalSubmit = async () => {
    if (overallRating === 0) {
      showInfoModalMessage("Rating Required", "Please provide an overall rating (1-5 stars)", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const smartGoalsPayload = smartGoals.map(goal => ({
        id: goal.id,
        remarks: selfReviews[goal.id].remarks,
        selfAssessmentScore: parseInt(selfReviews[goal.id].selfAssessmentScore) || 0,
      }));

      if (smartGoalsPayload.length > 0) {
        const smartPayload = {
          employeeId: empId,
          quarter: selectedQuarter,
          year: parseInt(selectedYear),
          overallSelfAssessmentRating: overallRating,
          overallSelfReviewComments: overallComment,
          goals: smartGoalsPayload,
        };

        await axios.put(`${BASE_URL_EPMS}/api/goals/self-review/submit`, smartPayload);
      }

      showInfoModalMessage("Success", "Self review submitted successfully! Your manager will now review your assessment.", "success", () => {
        navigate(-1);
      });
    } catch (err) {
      console.error("Error submitting self review:", err);
      showInfoModalMessage("Error", err.response?.data?.message || "Failed to submit self review. Please try again.", "error");
    } finally {
      setSubmitting(false);
      setShowOverallModal(false);
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

  const StarRating = ({ rating, onRatingChange, onHoverChange, size = "lg" }) => {
    const starSizes = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => onHoverChange && onHoverChange(star)}
            onMouseLeave={() => onHoverChange && onHoverChange(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <FiStar
              className={`${starSizes[size]} ${
                star <= (hoveredRating || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  const hasAnyGoals = smartGoals.length > 0 || developmentGoals.length > 0;

  const ProgressIndicator = () => {
    if (availableSections.length <= 1) return null;
    
    return (
      <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
        {availableSections.map((section, idx) => (
          <button
            key={section.key}
            onClick={() => handleSectionClick(idx)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              activeSectionIndex === idx
                ? "bg-red-600 text-white shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            <section.icon size={14} />
            <span className="text-sm font-medium">{section.name}</span>
            {activeSectionIndex > idx && (
              <FiCheckCircle size={14} className="text-green-500" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const NavigationButtons = () => {
    if (availableSections.length <= 1) {
      // If only one section, show only the submit button
      return (
        <div className="flex justify-end pt-6 mt-4 border-t border-gray-200">
          <button
            onClick={handleSubmitReview}
            disabled={submitting || smartGoals.length === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {submitting ? <FiLoader className="animate-spin" /> : <FiSend />}
            Submit Self Review
          </button>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-200">
        <button
          onClick={handlePrevSection}
          disabled={isFirstSection}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
            !isFirstSection
              ? "bg-gray-600 text-white hover:bg-gray-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <FiChevronLeft size={18} />
          Previous
        </button>
        
        <div className="text-sm text-gray-500">
          {activeSectionIndex + 1} of {availableSections.length}
        </div>
        
        {!isLastSection ? (
          <button
            onClick={handleNextSection}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all bg-red-600 text-white hover:bg-red-700"
          >
            Next
            <FiChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmitReview}
            disabled={submitting || smartGoals.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {submitting ? <FiLoader className="animate-spin" /> : <FiSend />}
            Submit Self Review
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading self review details..." />
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
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors mr-4"
          >
            <FiArrowLeft size={16} />
            Back
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
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
          <span className="font-semibold text-red-600">Self Review</span>
        </nav>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiEdit2 className="text-red-600" />
            Self Performance Review
          </h1>
          <p className="text-gray-500 mt-1 ml-9">
            Review your SMART goals and development goals, add remarks, and provide self assessment scores
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
                  <p className="font-semibold text-gray-800">{employeeData?.reportingManager || "N/A"}</p>
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

        {/* Progress Indicator */}
        <ProgressIndicator />

        {/* SMART Goals Section */}
        {currentSection?.key === "smart" && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gray-800 px-6 py-4">
              <div>
                <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                  <FiTarget />
                  SMART Goals for Self Review
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  {smartGoals.length} SMART goal(s) ready for your review
                </p>
              </div>
            </div>

            <div className="p-6">
              {smartGoals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiClock className="text-yellow-500 text-3xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No SMART Goals Ready for Review</h3>
                  <p className="text-gray-500">Your SMART goals need to be approved by your manager before you can start self review.</p>
                </div>
              ) : (
                <>
                  <div className={`rounded-xl p-4 mb-6 flex items-center justify-between ${isValidWeightage ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                    <div className="flex items-center gap-3">
                      {isValidWeightage ? (
                        <FiCheckCircle className="text-green-600 text-xl" />
                      ) : (
                        <FiAlertCircle className="text-red-600 text-xl" />
                      )}
                      <div>
                        <p className="text-sm font-semibold">Total Weightage</p>
                        <p className={`text-2xl font-bold ${isValidWeightage ? "text-green-700" : "text-red-700"}`}>
                          {totalWeightage}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Required: 100%</p>
                      {!isValidWeightage && (
                        <p className="text-xs text-red-500 mt-1">⚠️ Weightage must be 100%</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {smartGoals.map((goal, index) => (
                      <div key={goal.id || index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-700">
                                {index + 1}
                              </span>
                              <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                                <FiCheckCircle size={10} />
                                Approved
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {goal.weightage}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">Target</p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {goal.target || "No target specified"}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <FiMessageSquare className="inline mr-1 text-red-600 text-xs" />
                                Remarks / Comments <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                value={selfReviews[goal.id]?.remarks || ""}
                                onChange={(e) => handleRemarksChange(goal.id, e.target.value)}
                                placeholder="Add your comments, achievements, challenges, or any relevant notes for this goal..."
                                rows="3"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <FiStar className="inline mr-1 text-red-600 text-xs" />
                                Self Assessment Score <span className="text-red-500">*</span>
                                <span className="text-xs text-gray-400 ml-2">(Out of 100)</span>
                              </label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="number"
                                  value={selfReviews[goal.id]?.selfAssessmentScore || ""}
                                  onChange={(e) => handleSelfAssessmentChange(goal.id, e.target.value)}
                                  placeholder="0-100"
                                  min="0"
                                  max="100"
                                  className="w-32 px-4 py-2.5 border border-gray-300 rounded-xl text-center focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                />
                                <span className="text-gray-500">out of 100</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Rate your performance: 0-100 where 100 is outstanding
                              </p>
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
        )}

        {/* Development Goals Section - Read Only (No Assessment) */}
        {currentSection?.key === "development" && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gray-800 px-6 py-4">
              <div>
                <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                  <FiBookOpen />
                  Development Goals for Review
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  {developmentGoals.length} Development goal(s) ready for your review
                </p>
              </div>
            </div>

            <div className="p-6">
              {developmentGoals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiClock className="text-yellow-500 text-3xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Development Goals Ready for Review</h3>
                  <p className="text-gray-500">Your development goals need to be approved by your manager before you can start self review.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {developmentGoals.map((goal, index) => (
                    <div key={goal.id || index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
                      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-700">
                              {index + 1}
                            </span>
                            <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                              <FiCheckCircle size={10} />
                              Approved
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Training Name</p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
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

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-2 text-blue-700">
                            <FiInfo size={16} />
                            <p className="text-sm font-medium">Information</p>
                          </div>
                          <p className="text-sm text-blue-600 mt-1">
                            Development goals are for tracking your training and skill development. 
                            No self-assessment score is required. Your progress will be reviewed by your manager.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {hasAnyGoals && smartGoals.length > 0 && <NavigationButtons />}

        {/* If only development goals exist (no SMART goals) */}
        {hasDevelopmentGoals && !hasSmartGoals && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiClock className="text-yellow-500 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No SMART Goals Available</h3>
            <p className="text-gray-500">You need approved SMART goals to perform a self review. Development goals alone do not require a self review.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}

        {/* Info Note - Only show if SMART goals exist */}
        {hasSmartGoals && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-700 flex items-start gap-2">
              <FiInfo className="mt-0.5 flex-shrink-0" />
              <span>
                <strong>SMART Goals:</strong> Add remarks and self assessment scores (0-100). 
                <strong> Development Goals:</strong> Review only - no self assessment score required.
              </span>
            </p>
          </div>
        )}

        {/* No Goals Message - Only when absolutely no goals exist */}
        {!hasAnyGoals && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiClock className="text-yellow-500 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Goals Ready for Review</h3>
            <p className="text-gray-500">Your goals need to be approved by your manager before you can start self review.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>

      {/* Overall Rating Modal */}
      {showOverallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-fadeIn">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FiStar className="text-yellow-500" />
                Overall Performance Rating
              </h2>
              <button
                onClick={() => {
                  setShowOverallModal(false);
                  setOverallRating(0);
                  setOverallComment("");
                  setHoveredRating(0);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiXCircle size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">
                  Please rate your overall performance for {selectedQuarter} {selectedYear}
                </p>
                <div className="flex justify-center">
                  <StarRating 
                    rating={overallRating}
                    onRatingChange={setOverallRating}
                    onHoverChange={setHoveredRating}
                    size="lg"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  {overallRating === 5 && "🌟 Outstanding performance!"}
                  {overallRating === 4 && "👍 Very Good performance!"}
                  {overallRating === 3 && "👌 Satisfactory performance"}
                  {overallRating === 2 && "⚠️ Needs improvement"}
                  {overallRating === 1 && "🔴 Below expectations"}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Comments <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  value={overallComment}
                  onChange={(e) => setOverallComment(e.target.value)}
                  placeholder="Add any overall comments about your performance this quarter..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowOverallModal(false);
                    setOverallRating(0);
                    setOverallComment("");
                    setHoveredRating(0);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={submitting || overallRating === 0}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                  Submit Review
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

export default StartSelfReview;