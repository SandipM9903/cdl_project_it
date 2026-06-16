import React, { useEffect, useState, useMemo } from "react";
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
  FiAward,
  FiTrendingUp,
  FiUsers,
  FiBarChart2,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCcw,
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
const CustomModal = ({ isOpen, onClose, onConfirm, title, message, type = "info" }) => {
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
        return <FiInfo className="text-red-500 text-5xl mx-auto mb-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-fadeIn">
        <div className="p-6 text-center">
          {getIcon()}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6 whitespace-pre-line">{message}</p>
          <div className="flex justify-center gap-3">
            {type === "success" ? (
              <button onClick={onClose} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">OK</button>
            ) : (
              <>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Confirm</button>
                <button onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 9-Box Grid Info Modal Component
const NineBoxGridInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const gridData = [
    { achievement: "Exceptional", potential: "High", performance: "High", category: "Key Talent", rating: "A+", description: "Outstanding Contributor" },
    { achievement: "Excellent", potential: "High", performance: "Medium", category: "Emerging Talent", rating: "A", description: "Exceeds Expectations" },
    { achievement: "Performer", potential: "High", performance: "Low", category: "Misfit", rating: "B", description: "Partially Meets Expectations" },
    { achievement: "Excellent", potential: "Medium", performance: "High", category: "Talent", rating: "A", description: "Exceeds Expectations" },
    { achievement: "Performer", potential: "Medium", performance: "Medium", category: "Critical Resource", rating: "B+", description: "Strongly Meets Expectations" },
    { achievement: "Performer", potential: "Medium", performance: "Low", category: "Watch List", rating: "B", description: "Partially Meets Expectations" },
    { achievement: "Performer", potential: "Low", performance: "High", category: "Expert", rating: "B+", description: "Strongly Meets Expectations" },
    { achievement: "Performer", potential: "Low", performance: "Medium", category: "Stable", rating: "B", description: "Partially Meets Expectations" },
    { achievement: "Unsatisfactory", potential: "Low", performance: "Low", category: "Risk", rating: "C", description: "Does Not Meet Expectations" },
  ];

  const getRatingBadgeClass = (rating) => {
    switch (rating) {
      case "A+": return "bg-purple-100 text-purple-700";
      case "A": return "bg-red-100 text-red-700";
      case "B+": return "bg-green-100 text-green-700";
      case "B": return "bg-yellow-100 text-yellow-700";
      case "C": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[85vh] overflow-hidden animate-fadeIn">
        <div className="bg-red-600 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2"><FiBarChart2 className="text-white text-xl" /><h2 className="text-white font-semibold text-xl">9-Box Grid Reference Guide</h2></div>
          <button onClick={onClose} className="text-white hover:text-red-200 transition-colors"><FiXCircle size={24} /></button>
        </div>
        <div className="p-6 overflow-auto max-h-[calc(85vh-80px)]">
          <p className="text-gray-600 mb-4 text-sm">The 9-Box Grid automatically determines the employee's category, rating, and rating description based on the combination of Achievement Level, Potential, and Performance.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Achievement Level</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Potential</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Performance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gridData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700">{row.achievement}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.potential}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.performance}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{row.category}</td>
                    <td className="px-4 py-3"><span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getRatingBadgeClass(row.rating)}`}>{row.rating}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"><p className="text-sm text-blue-800 flex items-center gap-2"><FiInfo className="text-blue-600" /><strong>Note:</strong> The Category (Talent Status), Rating, and Rating Description fields are automatically populated based on the selected combination and cannot be edited manually.</p></div>
        </div>
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end"><button onClick={onClose} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Close</button></div>
      </div>
    </div>
  );
};

const ManagerReviewQuarter = () => {
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

  const [managerReviews, setManagerReviews] = useState({});
  const [devManagerReviews, setDevManagerReviews] = useState({});

  const [achievementLevel, setAchievementLevel] = useState("");
  const [potential, setPotential] = useState("");
  const [performance, setPerformance] = useState("");
  const [talentOrCriticalResource, setTalentOrCriticalResource] = useState("");

  const [matrixCategory, setMatrixCategory] = useState("");
  const [matrixRating, setMatrixRating] = useState("");
  const [matrixRatingDescription, setMatrixRatingDescription] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: "info", title: "", message: "", onConfirm: null });
  const [showGridInfo, setShowGridInfo] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [showOverallModal, setShowOverallModal] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const [overallComment, setOverallComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const achievementLevelOptions = [
    { value: "Exceptional", label: "Exceptional" },
    { value: "Excellent", label: "Excellent" },
    { value: "Performer", label: "Performer" },
    { value: "Unsatisfactory", label: "Unsatisfactory" },
  ];

  const nineBoxGridMapping = {
    "Exceptional-High-High": { category: "Key Talent", rating: "A+", ratingDescription: "Outstanding Contributor" },
    "Excellent-High-Medium": { category: "Emerging Talent", rating: "A", ratingDescription: "Exceeds Expectations" },
    "Performer-High-Low": { category: "Misfit", rating: "B", ratingDescription: "Partially Meets Expectations" },
    "Excellent-Medium-High": { category: "Talent", rating: "A", ratingDescription: "Exceeds Expectations" },
    "Performer-Medium-Medium": { category: "Critical Resource", rating: "B+", ratingDescription: "Strongly Meets Expectations" },
    "Performer-Medium-Low": { category: "Watch List", rating: "B", ratingDescription: "Partially Meets Expectations" },
    "Performer-Low-High": { category: "Expert", rating: "B+", ratingDescription: "Strongly Meets Expectations" },
    "Performer-Low-Medium": { category: "Stable", rating: "B", ratingDescription: "Partially Meets Expectations" },
    "Unsatisfactory-Low-Low": { category: "Risk", rating: "C", ratingDescription: "Does Not Meet Expectations" },
  };

  const validCombinations = Object.keys(nineBoxGridMapping);

  const getPotentialOptions = (achievement, selectedPerformance) => {
    const potentials = [];
    validCombinations.forEach((key) => {
      const [ach, pot, perf] = key.split("-");
      if (ach === achievement && (!selectedPerformance || perf === selectedPerformance)) potentials.push(pot);
    });
    return [...new Set(potentials)];
  };

  const getPerformanceOptions = (achievement, selectedPotential) => {
    const performances = [];
    validCombinations.forEach((key) => {
      const [ach, pot, perf] = key.split("-");
      if (ach === achievement && (!selectedPotential || pot === selectedPotential)) performances.push(perf);
    });
    return [...new Set(performances)];
  };

  const availablePotentialOptions = useMemo(() => getPotentialOptions(achievementLevel, performance).map(item => ({ value: item, label: item })), [achievementLevel, performance]);
  const availablePerformanceOptions = useMemo(() => getPerformanceOptions(achievementLevel, potential).map(item => ({ value: item, label: item })), [achievementLevel, potential]);

  const handleAchievementLevelChange = (value) => {
    setAchievementLevel(value);
    setPotential("");
    setPerformance("");
    setMatrixCategory("");
    setMatrixRating("");
    setMatrixRatingDescription("");
  };

  const handlePotentialChange = (value) => {
    setPotential(value);
    if (performance && !isValidCombination(achievementLevel, value, performance)) {
      setPerformance("");
      setMatrixCategory("");
      setMatrixRating("");
      setMatrixRatingDescription("");
    }
  };

  const handlePerformanceChange = (value) => {
    setPerformance(value);
    if (potential && !isValidCombination(achievementLevel, potential, value)) {
      setPotential("");
      setMatrixCategory("");
      setMatrixRating("");
      setMatrixRatingDescription("");
    }
  };

  const resetPotentialAndPerformance = () => {
    setPotential("");
    setPerformance("");
    setMatrixCategory("");
    setMatrixRating("");
    setMatrixRatingDescription("");
  };

  const isValidCombination = (achievement, pot, perf) => {
    if (!achievement || !pot || !perf) return false;
    return validCombinations.includes(`${achievement}-${pot}-${perf}`);
  };

  const calculateNineBoxFields = (achievement, pot, perf) => {
    if (!achievement || !pot || !perf) return { category: "", rating: "", ratingDescription: "" };
    return nineBoxGridMapping[`${achievement}-${pot}-${perf}`] || { category: "", rating: "", ratingDescription: "" };
  };

  useEffect(() => {
    const { category, rating, ratingDescription } = calculateNineBoxFields(achievementLevel, potential, performance);
    setMatrixCategory(category);
    setMatrixRating(rating);
    setMatrixRatingDescription(ratingDescription);
    if (category) setTalentOrCriticalResource(category);
  }, [achievementLevel, potential, performance]);

  const getPotentialHelperText = () => {
    if (!achievementLevel) return null;
    switch (achievementLevel) {
      case "Exceptional": return <><strong>For "Exceptional":</strong> Potential is <strong>"High"</strong>.</>;
      case "Excellent": return <><strong>For "Excellent":</strong> Potential can be <strong>High or Medium</strong>.</>;
      case "Performer": return <><strong>For "Performer":</strong> Potential can be <strong>High, Medium, or Low</strong>.</>;
      case "Unsatisfactory": return <><strong>For "Unsatisfactory":</strong> Potential is <strong>"Low"</strong>.</>;
      default: return null;
    }
  };

  const getPerformanceHelperText = () => {
    if (!achievementLevel) return null;
    switch (achievementLevel) {
      case "Exceptional": return <><strong>For "Exceptional":</strong> Performance is <strong>"High"</strong>.</>;
      case "Excellent": return <><strong>For "Excellent":</strong> Performance can be <strong>High or Medium</strong>.</>;
      case "Performer": return <><strong>For "Performer":</strong> Performance can be <strong>High, Medium, or Low</strong>.</>;
      case "Unsatisfactory": return <><strong>For "Unsatisfactory":</strong> Performance is <strong>"Low"</strong>.</>;
      default: return null;
    }
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case "A+": return "bg-purple-100 text-purple-700 border-purple-200";
      case "A": return "bg-red-100 text-red-700 border-red-200";
      case "B+": return "bg-green-100 text-green-700 border-green-200";
      case "B": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "C": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const showInfoModal = (type, title, message, onConfirm = null) => {
    setModalConfig({ type, title, message, onConfirm });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    if (modalConfig.onConfirm) modalConfig.onConfirm();
  };

  const hasSmartGoals = smartGoals.length > 0;
  const hasDevelopmentGoals = developmentGoals.length > 0;

  const availableSections = [];
  if (hasSmartGoals) availableSections.push({ name: "SMART Goals", key: "smart", icon: FiTarget });
  if (hasDevelopmentGoals) availableSections.push({ name: "Development Goals", key: "development", icon: FiBookOpen });
  if (hasSmartGoals || hasDevelopmentGoals) availableSections.push({ name: "Talent Matrix", key: "talent", icon: FiBarChart2 });

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
      if (response.data && response.data.data) goalsData = response.data.data;
      else if (Array.isArray(response.data)) goalsData = response.data;
      const selfReviewedGoals = goalsData.filter(goal => goal.status === "SELF_REVIEWED");
      setSmartGoals(selfReviewedGoals);
      const initialReviews = {};
      selfReviewedGoals.forEach(goal => {
        initialReviews[goal.id] = {
          managerAssessmentScore: goal.managerAssessmentScore || "",
          managerComment: goal.managerComment || "",
        };
      });
      setManagerReviews(initialReviews);
    } catch (err) {
      console.error("Error fetching SMART goals:", err);
    }
  };

  const fetchDevelopmentGoals = async () => {
    try {
      const url = `${BASE_URL_EPMS}/api/development-goals/employee/${empId}/${selectedQuarter}?year=${selectedYear}`;
      const response = await axios.get(url);
      let devGoalsData = [];
      if (response.data && response.data.data) devGoalsData = response.data.data;
      else if (Array.isArray(response.data)) devGoalsData = response.data;
      const selfReviewedDevGoals = devGoalsData.filter(goal => goal.status === "SELF_REVIEWED");
      setDevelopmentGoals(selfReviewedDevGoals);
      const initialDevReviews = {};
      selfReviewedDevGoals.forEach(goal => {
        initialDevReviews[goal.id] = {
          managerAssessmentScore: goal.managerAssessmentScore || "",
          managerComment: goal.managerComment || "",
        };
      });
      setDevManagerReviews(initialDevReviews);
    } catch (err) {
      console.error("Error fetching development goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentChange = (goalId, value) => {
    const score = parseInt(value) || 0;
    if (score >= 0 && score <= 100) {
      setManagerReviews(prev => ({ ...prev, [goalId]: { ...prev[goalId], managerAssessmentScore: value } }));
    }
  };

  const handleCommentChange = (goalId, value) => {
    setManagerReviews(prev => ({ ...prev, [goalId]: { ...prev[goalId], managerComment: value } }));
  };

  const handleDevAssessmentChange = (goalId, value) => {
    const score = parseInt(value) || 0;
    if (score >= 0 && score <= 100) {
      setDevManagerReviews(prev => ({ ...prev, [goalId]: { ...prev[goalId], managerAssessmentScore: value } }));
    }
  };

  const handleDevCommentChange = (goalId, value) => {
    setDevManagerReviews(prev => ({ ...prev, [goalId]: { ...prev[goalId], managerComment: value } }));
  };

  const validateReviews = () => {
    let isValid = true;
    const errors = [];

    smartGoals.forEach(goal => {
      const review = managerReviews[goal.id];
      const score = parseInt(review.managerAssessmentScore);
      if (isNaN(score) || score < 0 || score > 100) {
        errors.push(`Please enter a valid assessment score (0-100) for SMART goal: ${goal.title}`);
        isValid = false;
      }
      if (!review.managerComment || review.managerComment.trim() === "") {
        errors.push(`Please add comments for SMART goal: ${goal.title}`);
        isValid = false;
      }
    });

    developmentGoals.forEach(goal => {
      const review = devManagerReviews[goal.id];
      const score = parseInt(review.managerAssessmentScore);
      if (isNaN(score) || score < 0 || score > 100) {
        errors.push(`Please enter a valid assessment score (0-100) for Development goal: ${goal.title}`);
        isValid = false;
      }
      if (!review.managerComment || review.managerComment.trim() === "") {
        errors.push(`Please add comments for Development goal: ${goal.title}`);
        isValid = false;
      }
    });

    if (!achievementLevel) { errors.push("Please select Achievement Level"); isValid = false; }
    if (!potential) { errors.push("Please select Potential"); isValid = false; }
    if (!performance) { errors.push("Please select Performance"); isValid = false; }

    if (!isValid) {
      showInfoModal("warning", "Validation Error", errors.join("\n"));
    }
    return isValid;
  };

  const handleSubmitReview = () => {
    if (!validateReviews()) return;
    setShowOverallModal(true);
  };

  const handleFinalSubmit = async () => {
    if (overallRating === 0) {
      showInfoModal("warning", "Rating Required", "Please provide an overall rating (1-5 stars)");
      return;
    }

    setSubmitting(true);
    try {
      if (smartGoals.length > 0) {
        const smartGoalsPayload = smartGoals.map(goal => ({
          id: goal.id,
          managerAssessmentScore: parseInt(managerReviews[goal.id].managerAssessmentScore) || 0,
          managerComment: managerReviews[goal.id].managerComment,
        }));
        const payload = {
          managerId: localStorage.getItem("email") || "",
          employeeId: empId,
          quarter: selectedQuarter,
          year: parseInt(selectedYear),
          achievementLevel: achievementLevel,
          potential: potential,
          performance: performance,
          talentOrCriticalResource: talentOrCriticalResource,
          managerOverallSelfAssessmentRating: overallRating,
          managerOverallSelfReviewComments: overallComment,
          goals: smartGoalsPayload,
        };
        await axios.put(`${BASE_URL_EPMS}/api/goals/manager/final-review/submit`, payload);
      }

      for (const goal of developmentGoals) {
        const score = parseInt(devManagerReviews[goal.id]?.managerAssessmentScore) || 0;
        const comment = devManagerReviews[goal.id]?.managerComment || "";
        await axios.put(`${BASE_URL_EPMS}/api/development-goals/manager-assessment/${goal.id}`, null, {
          params: { managerAssessmentScore: score, managerComment: comment }
        });
      }

      showInfoModal("success", "Success", "Final review submitted successfully! The employee will now review and accept the assessment.", () => {
        navigate(-1);
      });
    } catch (err) {
      console.error("Error submitting final review:", err);
      showInfoModal("error", "Error", err.response?.data?.message || "Failed to submit final review. Please try again.");
    } finally {
      setSubmitting(false);
      setShowOverallModal(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
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

  const StarRating = ({ rating, onRatingChange, onHoverChange, size = "lg" }) => {
    const starSizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" };
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => onRatingChange(star)} onMouseEnter={() => onHoverChange && onHoverChange(star)} onMouseLeave={() => onHoverChange && onHoverChange(0)} className="focus:outline-none transition-transform hover:scale-110">
            <FiStar className={`${starSizes[size]} ${star <= (hoveredRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} transition-colors`} />
          </button>
        ))}
      </div>
    );
  };

  const ProgressIndicator = () => {
    if (availableSections.length <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-3 mb-6">
        {availableSections.map((section, idx) => (
          <button key={section.key} onClick={() => { setActiveSectionIndex(idx); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeSectionIndex === idx ? "bg-red-600 text-white shadow-md" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}>
            <section.icon size={14} /><span className="text-sm font-medium">{section.name}</span>
          </button>
        ))}
      </div>
    );
  };

  const NavigationButtons = () => {
    if (availableSections.length === 0) return null;
    return (
      <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-200">
        <button onClick={handlePrevSection} disabled={isFirstSection} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${!isFirstSection ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
          <FiChevronLeft size={18} /> Previous
        </button>
        <div className="text-sm text-gray-500">{activeSectionIndex + 1} of {availableSections.length}</div>
        {!isLastSection ? (
          <button onClick={handleNextSection} className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all bg-red-600 text-white hover:bg-red-700">
            Next <FiChevronRight size={18} />
          </button>
        ) : (
          <button onClick={handleSubmitReview} disabled={submitting} className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
            {submitting ? <FiLoader className="animate-spin" /> : <FiSend />} Submit Final Review
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <LoadingAnimation message="Loading goals for review..." />
      </div>
    );
  }

  const hasAnyGoals = smartGoals.length > 0 || developmentGoals.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      {submitting && <LoadingAnimation message="Submitting final review..." />}
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
          <span className="font-semibold text-red-600">Final Review</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3"><FiAward className="text-red-600" /> Final Performance Review</h1>
          <p className="text-gray-500 mt-1 ml-9">Review employee's self assessment, provide scores, comments, and talent matrix</p>
        </div>

        {/* Employee Profile Card */}
        <div className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden border border-gray-100">
          <div className="bg-red-600 px-6 py-3"><h2 className="text-white font-semibold flex items-center gap-2"><FiUser /> Employee Information</h2></div>
          <div className="p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center shadow-inner"><FiUser className="text-red-600 text-3xl" /></div>
              <div><h3 className="text-xl font-bold text-gray-800">{getEmployeeFullName(employeeData)}</h3><p className="text-gray-500">{employeeData?.designationName || "Designation"}</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><FiBriefcase className="text-gray-400 text-lg" /><div><p className="text-xs text-gray-500">Employee ID</p><p className="font-semibold text-gray-800">{employeeData?.empCode || empId}</p></div></div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><FiMail className="text-gray-400 text-lg" /><div><p className="text-xs text-gray-500">Email</p><p className="font-semibold text-gray-800 truncate max-w-[200px]">{employeeData?.emailId || "N/A"}</p></div></div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><FiUserCheck className="text-gray-400 text-lg" /><div><p className="text-xs text-gray-500">Reporting Manager</p><p className="font-semibold text-gray-800">{employeeData?.reportingManager || "N/A"}</p></div></div>
            </div>
          </div>
        </div>

        {/* Quarter Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-md mb-6 p-6 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center md:text-left"><p className="text-sm text-blue-600 font-medium">Financial Year</p><p className="text-2xl font-bold text-gray-800">{selectedYear}-{parseInt(selectedYear) + 1}</p></div>
            <div className="text-center"><p className="text-sm text-blue-600 font-medium">Quarter</p><p className="text-2xl font-bold text-red-600">{selectedQuarter}</p></div>
            <div className="text-center md:col-span-2"><p className="text-sm text-blue-600 font-medium">Period</p><p className="text-lg font-semibold text-gray-700">{getQuarterDates(selectedQuarter, selectedYear)}</p></div>
          </div>
        </div>

        <ProgressIndicator />

        {/* SMART Goals Section */}
        {currentSection?.key === "smart" && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-6">
            <div className="bg-gray-800 px-6 py-4">
              <h2 className="text-white text-lg font-semibold flex items-center gap-2"><FiTarget /> SMART Goals for Final Review</h2>
              <p className="text-gray-300 text-sm mt-1">{smartGoals.length} SMART goal(s) ready for your final assessment</p>
            </div>
            <div className="p-6">
              {smartGoals.length === 0 ? (
                <div className="text-center py-12"><div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiClock className="text-yellow-500 text-3xl" /></div><h3 className="text-lg font-semibold text-gray-800 mb-2">No SMART Goals Ready</h3><p className="text-gray-500">Employee has not completed self review for SMART goals yet.</p></div>
              ) : (
                <div className="space-y-6">
                  {smartGoals.map((goal, index) => (
                    <div key={goal.id || index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
                      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2"><span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-700">{index + 1}</span><h3 className="font-semibold text-gray-800">{goal.title}</h3></div>
                          <div className="flex items-center gap-2"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><FiCheckCircle size={10} /> Self Reviewed</span><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{goal.weightage}% Weightage</span></div>
                        </div>
                      </div>
                      <div className="p-5 bg-blue-50/30 border-b border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><FiUser className="text-blue-500" /> Employee's Self Assessment</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><p className="text-xs text-gray-500 mb-1">Remarks</p><p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">{goal.remarks || "No remarks provided"}</p></div>
                          <div><p className="text-xs text-gray-500 mb-1">Self Assessment Score</p><p className="text-sm font-semibold text-blue-700 bg-blue-100 inline-block px-3 py-1.5 rounded-lg">{goal.selfAssessmentScore || 0} / 100</p><div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, Math.max(0, goal.selfAssessmentScore || 0))}%` }} /></div></div>
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><FiEdit2 className="text-red-600" /> Manager's Assessment</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Manager Assessment Score <span className="text-red-500">*</span><span className="text-xs text-gray-400 ml-2">(Out of 100)</span></label><div className="flex items-center gap-3"><input type="number" value={managerReviews[goal.id]?.managerAssessmentScore || ""} onChange={(e) => handleAssessmentChange(goal.id, e.target.value)} placeholder="0-100" min="0" max="100" className="w-32 px-4 py-2.5 border border-gray-300 rounded-xl text-center focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all" /><span className="text-gray-500">out of 100</span></div></div>
                          <div><label className="block text-sm font-semibold text-gray-700 mb-2"><FiMessageSquare className="inline mr-1 text-red-600 text-xs" /> Manager Comments <span className="text-red-500">*</span></label><textarea value={managerReviews[goal.id]?.managerComment || ""} onChange={(e) => handleCommentChange(goal.id, e.target.value)} placeholder="Provide feedback on employee's performance for this goal..." rows="2" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none" /></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Development Goals Section */}
        {currentSection?.key === "development" && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-6">
            <div className="bg-gray-800 px-6 py-4">
              <h2 className="text-white text-lg font-semibold flex items-center gap-2"><FiBookOpen /> Development Goals for Final Review</h2>
              <p className="text-gray-300 text-sm mt-1">{developmentGoals.length} Development goal(s) ready for your final assessment</p>
            </div>
            <div className="p-6">
              {developmentGoals.length === 0 ? (
                <div className="text-center py-12"><div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiClock className="text-yellow-500 text-3xl" /></div><h3 className="text-lg font-semibold text-gray-800 mb-2">No Development Goals Ready</h3><p className="text-gray-500">Employee has not completed self review for development goals yet.</p></div>
              ) : (
                <div className="space-y-6">
                  {developmentGoals.map((goal, index) => (
                    <div key={goal.id || index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
                      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2"><span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-700">{index + 1}</span><h3 className="font-semibold text-gray-800">{goal.title}</h3></div>
                          <div className="flex items-center gap-2"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><FiCheckCircle size={10} /> Self Reviewed</span></div>
                        </div>
                      </div>
                      <div className="p-5 bg-blue-50/30 border-b border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><FiUser className="text-blue-500" /> Employee's Self Assessment</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><p className="text-xs text-gray-500 mb-1">Training Name</p><p className="text-sm text-gray-700 bg-white p-2 rounded-lg border border-gray-200">{goal.trainingName || "N/A"}</p></div>
                          <div><p className="text-xs text-gray-500 mb-1">Self Assessment Score</p><p className="text-sm font-semibold text-blue-700 bg-blue-100 inline-block px-3 py-1.5 rounded-lg">{goal.selfAssessmentScore || 0} / 100</p><div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, Math.max(0, goal.selfAssessmentScore || 0))}%` }} /></div></div>
                        </div>
                        <div className="mt-3"><p className="text-xs text-gray-500 mb-1">Description / Plan</p><p className="text-sm text-gray-700 bg-white p-2 rounded-lg border border-gray-200">{goal.description || "No description provided"}</p></div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><FiEdit2 className="text-red-600" /> Manager's Assessment</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Manager Assessment Score <span className="text-red-500">*</span><span className="text-xs text-gray-400 ml-2">(Out of 100)</span></label><div className="flex items-center gap-3"><input type="number" value={devManagerReviews[goal.id]?.managerAssessmentScore || ""} onChange={(e) => handleDevAssessmentChange(goal.id, e.target.value)} placeholder="0-100" min="0" max="100" className="w-32 px-4 py-2.5 border border-gray-300 rounded-xl text-center focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all" /><span className="text-gray-500">out of 100</span></div></div>
                          <div><label className="block text-sm font-semibold text-gray-700 mb-2"><FiMessageSquare className="inline mr-1 text-red-600 text-xs" /> Manager Comments <span className="text-red-500">*</span></label><textarea value={devManagerReviews[goal.id]?.managerComment || ""} onChange={(e) => handleDevCommentChange(goal.id, e.target.value)} placeholder="Provide feedback on employee's progress for this development goal..." rows="2" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none" /></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Talent Matrix Section - With 9-Box Grid */}
        {currentSection?.key === "talent" && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-6">
            <div className="bg-red-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-white text-lg font-semibold flex items-center gap-2"><FiBarChart2 /> Talent Matrix & Assessment</h2>
                  <p className="text-red-100 text-sm mt-1">Evaluate employee's performance and potential for talent mapping</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={resetPotentialAndPerformance} className="flex items-center gap-1 px-2 py-1 text-xs bg-white text-red-600 rounded-md border border-red-200 hover:bg-red-50 transition-colors"><FiRefreshCcw size={12} /> <span>Reset</span></button>
                  <button type="button" onClick={() => setShowGridInfo(true)} className="flex items-center gap-1 px-2 py-1 text-xs bg-white text-red-600 rounded-md border border-red-200 hover:bg-red-50 transition-colors"><FiInfo size={12} /> <span>View Grid Guide</span></button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Achievement Level <span className="text-red-500">*</span></label>
                  <select value={achievementLevel} onChange={(e) => handleAchievementLevelChange(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white">
                    <option value="">Select Achievement Level</option>
                    {achievementLevelOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Potential <span className="text-red-500">*</span></label>
                  <select value={potential} onChange={(e) => handlePotentialChange(e.target.value)} disabled={!achievementLevel} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white disabled:bg-gray-100">
                    <option value="">Select Potential</option>
                    {availablePotentialOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  {getPotentialHelperText() && <p className="mt-1 text-xs text-blue-600">{getPotentialHelperText()}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Performance <span className="text-red-500">*</span></label>
                  <select value={performance} onChange={(e) => handlePerformanceChange(e.target.value)} disabled={!achievementLevel} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white disabled:bg-gray-100">
                    <option value="">Select Performance</option>
                    {availablePerformanceOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  {getPerformanceHelperText() && <p className="mt-1 text-xs text-blue-600">{getPerformanceHelperText()}</p>}
                </div>
              </div>

              {/* 9-Box Grid Results - Read Only Section */}
              <div className="mt-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2"><FiBarChart2 className="text-red-600" /><h3 className="text-md font-semibold text-red-800">9-Box Grid Assessment Results</h3></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/60 rounded-lg p-3 border border-red-100">
                    <p className="text-xs text-red-600 font-bold uppercase tracking-wide">Talent Status</p>
                    <p className="text-lg font-bold text-red-800 mt-1">{matrixCategory || "Awaiting selection"}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-red-100">
                    <p className="text-xs text-red-600 font-bold uppercase tracking-wide">Manager Rating</p>
                    <div className="mt-1">{matrixRating ? <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getRatingColor(matrixRating)}`}>{matrixRating}</span> : <p className="text-sm text-gray-500 mt-1 italic">Awaiting selection</p>}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-red-100">
                    <p className="text-xs text-red-600 font-bold uppercase tracking-wide">Rating Description</p>
                    <p className="font-medium text-gray-800 mt-1 text-sm">{matrixRatingDescription || "Awaiting selection"}</p>
                  </div>
                </div>
                <p className="text-xs text-red-600 mt-3 italic">* Talent Status, Manager Rating, and Rating Description are automatically populated based on selections and cannot be edited manually.</p>
              </div>
            </div>
          </div>
        )}

        <NavigationButtons />

        {hasAnyGoals && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-700 flex items-start gap-2"><FiInfo className="mt-0.5 flex-shrink-0" /><span>After submission, the employee will review the final assessment and provide their acceptance. The talent matrix will be used for career development planning.</span></p>
          </div>
        )}
      </div>

      {/* Overall Rating Modal */}
      {showOverallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-fadeIn">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2"><FiStar className="text-yellow-500" /> Overall Performance Rating</h2>
              <button onClick={() => { setShowOverallModal(false); setOverallRating(0); setOverallComment(""); setHoveredRating(0); }} className="text-gray-400 hover:text-gray-600 transition-colors"><FiXCircle size={24} /></button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">Please rate the employee's overall performance for {selectedQuarter} {selectedYear}</p>
                <div className="flex justify-center"><StarRating rating={overallRating} onRatingChange={setOverallRating} onHoverChange={setHoveredRating} size="lg" /></div>
                <p className="text-sm text-gray-500 mt-3">{overallRating === 5 && "🌟 Exceptional - Outstanding performance throughout!"}{overallRating === 4 && "👍 Very Good - Exceeded expectations"}{overallRating === 3 && "👌 Satisfactory - Met expectations"}{overallRating === 2 && "⚠️ Needs Improvement - Below expectations"}{overallRating === 1 && "🔴 Unsatisfactory - Significant improvement needed"}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Overall Comments <span className="text-gray-400 text-xs">(Optional)</span></label>
                <textarea value={overallComment} onChange={(e) => setOverallComment(e.target.value)} placeholder="Provide overall feedback about the employee's performance this quarter..." rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => { setShowOverallModal(false); setOverallRating(0); setOverallComment(""); setHoveredRating(0); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={handleFinalSubmit} disabled={submitting || overallRating === 0} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? <FiLoader className="animate-spin" /> : <FiCheckCircle />} Submit Final Review</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CustomModal isOpen={showModal} onClose={closeModal} onConfirm={modalConfig.onConfirm || closeModal} title={modalConfig.title} message={modalConfig.message} type={modalConfig.type} />
      <NineBoxGridInfoModal isOpen={showGridInfo} onClose={() => setShowGridInfo(false)} />

      <style jsx>{`@keyframes fadeIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}.animate-fadeIn{animation:fadeIn 0.2s ease-out}`}</style>
    </div>
  );
};

export default ManagerReviewQuarter;