import React, { useEffect, useState, useCallback, useMemo } from "react";
import Header from "../../../components/Header";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaUserTie,
  FaSpinner,
  FaPlus,
  FaTrash,
  FaSave,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaPercent,
  FaBullseye,
  FaClipboardList,
  FaInfoCircle,
  FaPaperPlane,
  FaGraduationCap,
  FaChartLine,
  FaEdit,
  FaClock,
  FaChevronDown,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP } from "../../services/api";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import { FiArrowLeft } from "react-icons/fi";

// Helper function to get employee full name - only fullNameAsAadhaar
const getEmployeeFullName = (employeeData) => {
  if (!employeeData) return "Employee Name";

  // Check for fullNameAsAadhaar in employeeData
  if (
    employeeData.fullNameAsAadhaar &&
    employeeData.fullNameAsAadhaar.trim() !== ""
  ) {
    return employeeData.fullNameAsAadhaar.trim();
  }

  // Fallback to firstName, middleName, lastName
  const firstName = employeeData.firstName || "";
  const middleName = employeeData.middleName || "";
  const lastName = employeeData.lastName || "";
  const fullName = `${firstName} ${middleName} ${lastName}`.trim();

  if (fullName && fullName !== "") {
    return fullName;
  }

  return "Employee Name";
};

// Helper function to get manager name from reportingManager field
const getManagerFullName = (employeeData) => {
  if (!employeeData) return "N/A";

  // Check for reportingManager field (which should contain the full name)
  if (
    employeeData.reportingManager &&
    employeeData.reportingManager.trim() !== ""
  ) {
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

const targetOperatorOptions = ["=", "<", ">", "<=", ">="];

const CustomModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "OK", cancelText = "Cancel", type = "info", autoCloseDelay = 2000, isLoading = false }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (isProcessing || isLoading) return;
    setIsProcessing(true);
    if (onConfirm) {
      try {
        await onConfirm();
      } catch (err) {
        setIsProcessing(false);
      }
    }
  };

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
        return <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />;
      case "error":
        return <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />;
      case "warning":
        return <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />;
      default:
        return <FaInfoCircle className="text-red-500 text-5xl mx-auto mb-4" />;
    }
  };

  const isButtonDisabled = isLoading || isProcessing;

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
                onClick={handleConfirm}
                disabled={isButtonDisabled}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isButtonDisabled && <FaSpinner className="animate-spin" />}
                {confirmText}
              </button>
            )}
            {type !== "success" && (
              <button
                onClick={onClose}
                disabled={isButtonDisabled}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

const DevelopmentGoalModal = ({ isOpen, onClose, onSave, editingGoal, devGoalForm, setDevGoalForm, devErrors, titleOptions, trainingNameOptions, isAssessmentDisabled }) => {
  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setDevGoalForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FaGraduationCap className="text-red-600" />
            {editingGoal ? "Edit Development Goal" : "Add Development Goal"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimesCircle size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaBullseye className="inline mr-1 text-red-500 text-xs" />
              Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={devGoalForm.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all appearance-none ${
                  devErrors.title ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">Select Title</option>
                {titleOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {devErrors.title && <p className="text-xs text-red-500 mt-1"><FaInfoCircle className="inline mr-1" /> {devErrors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaGraduationCap className="inline mr-1 text-red-500 text-xs" />
              Training Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={devGoalForm.trainingName}
                onChange={(e) => handleChange("trainingName", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all appearance-none ${
                  devErrors.trainingName ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">Select Training Name</option>
                {trainingNameOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {devErrors.trainingName && <p className="text-xs text-red-500 mt-1"><FaInfoCircle className="inline mr-1" /> {devErrors.trainingName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaClipboardList className="inline mr-1 text-red-500 text-xs" />
              Description / Plan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={devGoalForm.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe your development plan, learning objectives, and expected outcomes..."
              rows="3"
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none ${
                devErrors.description ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {devErrors.description && <p className="text-xs text-red-500 mt-1"><FaInfoCircle className="inline mr-1" /> {devErrors.description}</p>}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
          <button onClick={onSave} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
            <FaSave size={14} /> {editingGoal ? "Update" : "Save"} Development Goal
          </button>
        </div>
      </div>
    </div>
  );
};

const EditGoalCreation = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const yearParam = queryParams.get("year");
  const quarterParam = queryParams.get("quarter");

  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(yearParam || new Date().getFullYear().toString());
  const [selectedQuarter, setSelectedQuarter] = useState(quarterParam || "Q1");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info", onConfirm: null });

  const titleOptions = ["Deep Technical Java Technologies", "Cloud Computing & AWS", "DevOps Practices", "Agile Methodologies", "Leadership Skills", "Communication Skills", "Project Management", "Database Management", "Security & Compliance", "AI/ML Fundamentals"];
  const trainingNameOptions = ["Java Full Stack Certification", "AWS Certified Developer", "Docker & Kubernetes Training", "Scrum Master Certification", "PMP Certification", "Advanced React.js Training", "Spring Boot Microservices", "Python for Data Science", "Azure Fundamentals", "Cybersecurity Awareness"];

  const [goals, setGoals] = useState([]);
  const [developmentGoals, setDevelopmentGoals] = useState([]);
  const [showDevGoalModal, setShowDevGoalModal] = useState(false);
  const [editingDevGoal, setEditingDevGoal] = useState(null);
  const [devGoalForm, setDevGoalForm] = useState({ title: "", trainingName: "", description: "", selfAssessment: "", managerAssessment: "", status: "" });
  const [errors, setErrors] = useState({});
  const [devErrors, setDevErrors] = useState({});

  const showModal = (title, message, type = "info", onConfirm = null) => setModal({ isOpen: true, title, message, type, onConfirm });
  const closeModal = () => setModal({ isOpen: false, title: "", message: "", type: "info", onConfirm: null });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchEmployeeDetails();
    fetchExistingDraftGoals();
    fetchDevelopmentGoals();
  }, []);

  const fetchEmployeeDetails = async () => {
    try {
      const storedEmpCode = localStorage.getItem("empId") || empId;
      if (!storedEmpCode) {
        setError("Employee ID not found");
        setLoading(false);
        return;
      }

      // Corrected API endpoint - using BASE_URL_EPMS_EMP with the storedEmpCode
      const response = await axios.get(`${BASE_URL_EPMS_EMP}/${storedEmpCode}`);
      
      let employee = null;
      
      // Extract employee data from response
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
        setError(`Employee not found with ID: ${storedEmpCode}`);
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
      setError("Failed to load employee details");
    }
  };

  const fetchExistingDraftGoals = async () => {
    try {
      const storedEmpId = localStorage.getItem("empId") || empId;
      const url = `${BASE_URL_EPMS}/api/goals/employee/${storedEmpId}/${selectedQuarter}?year=${selectedYear}`;
      const response = await axios.get(url);
      
      let existingGoals = [];
      if (response.data && response.data.data) existingGoals = response.data.data;
      else if (Array.isArray(response.data)) existingGoals = response.data;

      const draftGoals = existingGoals.filter((goal) => goal.status === "DRAFT" || goal.status === "SENT_BACK");
      const formattedGoals = draftGoals.map((goal) => ({
        id: goal.id,
        title: goal.title || "",
        targetOperator: goal.target && targetOperatorOptions.includes(goal.target.trim()) ? goal.target.trim() : "=",
        weightage: goal.weightage?.toString() || "",
        status: goal.status,
      }));
      
      setGoals(formattedGoals);
      if (formattedGoals.length === 0) {
        setGoals([{ id: null, title: "", targetOperator: "=", weightage: "", status: "DRAFT" }]);
      }
    } catch (err) {
      console.error("Error fetching draft goals:", err);
      setGoals([{ id: null, title: "", targetOperator: "=", weightage: "", status: "DRAFT" }]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDevelopmentGoals = async () => {
    try {
      const storedEmpId = localStorage.getItem("empId") || empId;
      const url = `${BASE_URL_EPMS}/api/development-goals/employee/${storedEmpId}/${selectedQuarter}?year=${selectedYear}`;
      const response = await axios.get(url);
      
      let devGoals = [];
      if (response.data && response.data.data) devGoals = response.data.data;
      else if (Array.isArray(response.data)) devGoals = response.data;

      if (devGoals.length > 0) {
        const formattedDevGoals = devGoals.map((goal) => ({
          id: goal.id,
          title: goal.title || "",
          trainingName: goal.trainingName || "",
          description: goal.description || "",
          selfAssessment: goal.selfAssessmentScore || "",
          managerAssessment: goal.managerAssessmentScore || "",
          status: goal.status,
        }));
        setDevelopmentGoals(formattedDevGoals);
      }
    } catch (err) {
      console.error("Error fetching development goals:", err);
    }
  };

  const handleGoalChange = (index, field, value) => {
    const updatedGoals = [...goals];
    updatedGoals[index][field] = value;
    setGoals(updatedGoals);
    if (errors[index] && errors[index][field]) {
      const newErrors = { ...errors };
      delete newErrors[index][field];
      if (Object.keys(newErrors[index] || {}).length === 0) delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const addNewGoal = () => {
    setGoals([...goals, { id: null, title: "", targetOperator: "=", weightage: "", status: "DRAFT" }]);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
  };

  const removeGoal = async (index) => {
    const goalToRemove = goals[index];
    if (goals.length === 1 && !goalToRemove.id) {
      setGoals([{ id: null, title: "", targetOperator: "=", weightage: "", status: "DRAFT" }]);
      return;
    }
    if (goalToRemove.id) {
      showModal("Confirm Delete", "Are you sure you want to delete this SMART goal?", "warning", async () => {
        try {
          await axios.delete(`${BASE_URL_EPMS}/api/goals/${goalToRemove.id}`);
          const updatedGoals = goals.filter((_, i) => i !== index);
          setGoals(updatedGoals);
          showModal("Success", "SMART Goal deleted successfully!", "success", closeModal);
        } catch (err) {
          showModal("Error", err.response?.data?.message || "Failed to delete goal", "error");
        }
      });
    } else {
      const updatedGoals = goals.filter((_, i) => i !== index);
      setGoals(updatedGoals);
    }
  };

  const handleOpenDevModal = useCallback((goal = null) => {
    if (goal) {
      setEditingDevGoal(goal);
      setDevGoalForm({
        title: goal.title || "",
        trainingName: goal.trainingName || "",
        description: goal.description || "",
        selfAssessment: goal.selfAssessment || "",
        managerAssessment: goal.managerAssessment || "",
        status: goal.status || "",
      });
    } else {
      setEditingDevGoal(null);
      setDevGoalForm({ title: "", trainingName: "", description: "", selfAssessment: "", managerAssessment: "", status: "" });
    }
    setDevErrors({});
    setShowDevGoalModal(true);
  }, []);

  const handleCloseDevModal = useCallback(() => {
    setShowDevGoalModal(false);
    setEditingDevGoal(null);
    setDevGoalForm({ title: "", trainingName: "", description: "", selfAssessment: "", managerAssessment: "", status: "" });
    setDevErrors({});
  }, []);

  const validateDevGoal = () => {
    const newErrors = {};
    if (!devGoalForm.title) newErrors.title = "Title is required";
    if (!devGoalForm.trainingName) newErrors.trainingName = "Training name is required";
    if (!devGoalForm.description?.trim()) newErrors.description = "Description is required";
    setDevErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isAssessmentDisabled = useCallback(() => {
    if (editingDevGoal) {
      const status = editingDevGoal.status;
      return status !== "APPROVED" && status !== "MANAGER_REVIEWED" && status !== "ACCEPTED_BY_EMPLOYEE";
    }
    return true;
  }, [editingDevGoal]);

  const saveDevelopmentGoal = async () => {
    if (!validateDevGoal()) return;
    setSubmitting(true);
    const storedEmpId = localStorage.getItem("empId") || empId;
    const payload = {
      employeeId: storedEmpId,
      managerId: employeeData?.reportingManagerEmailId || "",
      title: devGoalForm.title,
      trainingName: devGoalForm.trainingName,
      description: devGoalForm.description,
      selfAssessmentScore: devGoalForm.selfAssessment ? parseInt(devGoalForm.selfAssessment) : null,
    };

    try {
      if (editingDevGoal && editingDevGoal.id) {
        await axios.put(`${BASE_URL_EPMS}/api/development-goals/update/${editingDevGoal.id}`, payload);
        showModal("Success", "Development goal updated successfully!", "success", () => {
          closeModal();
          handleCloseDevModal();
          fetchDevelopmentGoals();
        });
      } else {
        await axios.post(`${BASE_URL_EPMS}/api/development-goals/create/${selectedQuarter}`, payload);
        showModal("Success", "Development goal added successfully!", "success", () => {
          closeModal();
          handleCloseDevModal();
          fetchDevelopmentGoals();
        });
      }
    } catch (err) {
      showModal("Error", err.response?.data?.message || "Failed to save development goal", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteDevelopmentGoal = async (goalId) => {
    showModal("Confirm Delete", "Are you sure you want to delete this development goal?", "warning", async () => {
      try {
        await axios.delete(`${BASE_URL_EPMS}/api/development-goals/${goalId}`);
        showModal("Success", "Development goal deleted successfully!", "success", () => {
          closeModal();
          fetchDevelopmentGoals();
        });
      } catch (err) {
        showModal("Error", "Failed to delete development goal", "error");
      }
    });
  };

  const calculateTotalWeightage = () => {
    return goals.reduce((total, goal) => total + (parseInt(goal.weightage) || 0), 0);
  };

  const validateGoals = () => {
    const newErrors = {};
    let isValid = true;
    const totalWeightage = calculateTotalWeightage();

    goals.forEach((goal, index) => {
      const goalErrors = {};
      if (!goal.title?.trim()) { goalErrors.title = "Goal/Objective is required"; isValid = false; }
      const weightage = parseInt(goal.weightage);
      if (isNaN(weightage)) { goalErrors.weightage = "Weightage is required"; isValid = false; }
      else if (weightage < 0 || weightage > 100) { goalErrors.weightage = "Weightage must be between 0 and 100"; isValid = false; }
      else if (weightage === 0) { goalErrors.weightage = "Weightage cannot be 0%"; isValid = false; }
      if (Object.keys(goalErrors).length > 0) newErrors[index] = goalErrors;
    });

    if (totalWeightage !== 100) {
      setErrors((prev) => ({ ...prev, totalWeightage: `Total weightage must be 100%. Current total: ${totalWeightage}%` }));
      isValid = false;
    } else {
      setErrors((prev) => { const newPrev = { ...prev }; delete newPrev.totalWeightage; return newPrev; });
    }

    setErrors(newErrors);
    return isValid;
  };

  const saveGoal = async (goal) => {
    const storedEmpId = localStorage.getItem("empId") || empId;
    const managerId = employeeData?.reportingManagerEmailId || "";
    
    const weightageValue = parseInt(goal.weightage);
    if (isNaN(weightageValue)) {
        throw new Error("Weightage must be a valid number");
    }
    
    const payload = {
        employeeId: storedEmpId,
        managerId: managerId,
        title: goal.title,
        target: goal.targetOperator,
        weightage: weightageValue,
    };

    console.log("Saving goal payload:", payload);

    if (goal.id) {
        return await axios.put(`${BASE_URL_EPMS}/api/goals/draft/${goal.id}`, payload);
    } else {
        return await axios.post(`${BASE_URL_EPMS}/api/goals/draft/${selectedQuarter}`, payload);
    }
};

  const handleSaveAsDraft = async () => {
    if (goals.length === 0) {
      showModal("Validation Error", "Please add at least one SMART goal before saving.", "error");
      return;
    }
    const invalidGoals = goals.filter((goal) => !goal.title?.trim());
    if (invalidGoals.length > 0) {
      showModal("Validation Error", "Please fill in all goal titles before saving.", "error");
      return;
    }

    setSubmitting(true);
    try {
      for (const goal of goals) await saveGoal(goal);
      showModal("Success", "SMART Goals saved as draft successfully!", "success", () => {
        closeModal();
        navigate(`/EmployeeAppraisal?year=${selectedYear}&quarter=${selectedQuarter}&type=quarterly`);
      });
    } catch (err) {
      showModal("Error", err.response?.data?.message || "Failed to save goals", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!validateGoals()) {
        showModal("Validation Error", "Please fill all required fields and ensure total weightage is 100%", "error");
        return;
    }

    console.log("Goals before submission:", goals.map(g => ({
        id: g.id,
        title: g.title,
        weightage: g.weightage,
        targetOperator: g.targetOperator
    })));

    showModal("Confirm Submission", "Are you sure you want to submit these goals for manager approval?", "warning", async () => {
        setSubmitting(true);
        try {
            const storedEmpId = localStorage.getItem("empId") || empId;
            
            for (const goal of goals) {
                console.log(`Saving goal: ${goal.title} with weightage ${goal.weightage}`);
                await saveGoal(goal);
            }
            
            console.log("Submitting all draft goals via bulk endpoint");
            await axios.post(`${BASE_URL_EPMS}/api/goals/employee/${storedEmpId}/submit-all/${selectedQuarter}?year=${selectedYear}`);
            
            showModal("Success", "SMART Goals submitted for manager approval successfully!", "success", () => {
                closeModal();
                navigate(`/EmployeeAppraisal?year=${selectedYear}&quarter=${selectedQuarter}&type=quarterly`);
            });
        } catch (err) {
            console.error("Error submitting goals:", err);
            console.error("Error response data:", err.response?.data);
            console.error("Error response status:", err.response?.status);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to submit goals. Please try again.";
            showModal("Error", errorMsg, "error");
        } finally {
            setSubmitting(false);
        }
    });
};

  const handleCancel = () => navigate(-1);
  const getQuarterDates = (quarter, year) => {
    const yearNum = parseInt(year);
    const quarterDatesMap = { Q1: `01-Apr-${yearNum} to 30-Jun-${yearNum}`, Q2: `01-Jul-${yearNum} to 30-Sep-${yearNum}`, Q3: `01-Oct-${yearNum} to 31-Dec-${yearNum}`, Q4: `01-Jan-${yearNum + 1} to 31-Mar-${yearNum + 1}` };
    return quarterDatesMap[quarter] || "";
  };

  const totalWeightage = calculateTotalWeightage();
  const isWeightageValid = totalWeightage === 100;
  const weightageProgress = Math.min((totalWeightage / 100) * 100, 100);

  const hasEnteredAnything = useMemo(() => {
    const hasSmartGoalData = goals.some(
      (goal) => (goal.title && goal.title.trim() !== "") || (goal.weightage && goal.weightage.toString().trim() !== "")
    );
    const hasDevGoalData = developmentGoals.length > 0;
    return hasSmartGoalData || hasDevGoalData;
  }, [goals, developmentGoals]);

  const DevelopmentGoalsTable = useMemo(() => {
    return () => (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mt-6">
        <div className="bg-red-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-white text-lg font-semibold flex items-center gap-2"><FaGraduationCap /> Development Goals</h2>
              <p className="text-red-100 text-sm mt-1">Add your training and development goals for the quarter</p>
            </div>
            <button onClick={() => handleOpenDevModal()} className="px-4 py-2 bg-white/20 text-white text-sm rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2">
              <FaPlus className="text-xs" /> Add Development Goal
            </button>
          </div>
        </div>
        <div className="p-6">
          {developmentGoals.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaGraduationCap className="text-red-500 text-3xl" /></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Development Goals</h3>
              <p className="text-gray-500">Click "Add Development Goal" to add your training and development plans.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Training Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {developmentGoals.map((goal, index) => (
                    <tr key={goal.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3"><p className="text-sm font-medium text-gray-800">{goal.title}</p></td>
                      <td className="px-4 py-3"><p className="text-sm text-gray-600">{goal.trainingName}</p></td>
                      <td className="px-4 py-3"><p className="text-sm text-gray-600 line-clamp-2">{goal.description}</p></td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          goal.status === "APPROVED" ? "bg-green-100 text-green-700" :
                          goal.status === "PENDING_APPROVAL" ? "bg-yellow-100 text-yellow-700" :
                          goal.status === "SELF_REVIEWED" ? "bg-purple-100 text-purple-700" :
                          goal.status === "MANAGER_REVIEWED" ? "bg-indigo-100 text-indigo-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>{goal.status?.replace(/_/g, " ") || "Draft"}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => handleOpenDevModal(goal)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit"><FaEdit size={16} /></button>
                          <button onClick={() => deleteDevelopmentGoal(goal.id)} className="text-red-600 hover:text-red-800 transition-colors" title="Delete"><FaTrash size={16} /></button>
                        </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }, [developmentGoals, handleOpenDevModal, deleteDevelopmentGoal]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <LoadingAnimation message="Loading your draft goals..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex justify-center items-center h-96 mt-24">
          <div className="text-center bg-white rounded-xl p-8 shadow-lg max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaTimesCircle className="text-red-500 text-3xl" /></div>
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button onClick={() => navigate("/EmployeeAppraisal")} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      {submitting && <LoadingAnimation message="Saving goals..." />}
      <div className="mt-24 px-4 md:px-8 max-w-7xl mx-auto w-full pb-12">
        <nav className="flex items-center text-sm mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors mr-4 font-medium"
          >
            <FiArrowLeft size={16} />
            Back
          </button>
          <span className="text-gray-400">/</span>
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer text-gray-600 hover:text-red-500 transition-colors ml-2"
          >
            Home
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span
            onClick={() => navigate("/EmployeeAppraisal")}
            className="cursor-pointer text-gray-600 hover:text-red-500 transition-colors"
          >
            My Appraisal
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600">Edit Draft Goals</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaEdit className="text-red-500" /> Edit Your Draft Goals</h1>
          <p className="text-gray-500 mt-1 ml-7">Review and edit your SMART goals and development objectives for the upcoming quarter</p>
        </div>

        {/* Employee Profile Card */}
        <div className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden border border-gray-100">
          <div className="bg-red-600 px-6 py-3"><h2 className="text-white font-semibold flex items-center gap-2"><FaUser /> Employee Information</h2></div>
          <div className="p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center shadow-inner"><FaUser className="text-red-500 text-3xl" /></div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{getEmployeeFullName(employeeData)}</h3>
                <p className="text-gray-500">{employeeData?.designationName || "Designation"}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><FaBuilding className="text-gray-400 text-lg" /><div><p className="text-xs text-gray-500">Employee ID</p><p className="font-semibold text-gray-800">{employeeData?.empCode || localStorage.getItem("empId") || empId}</p></div></div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><FaEnvelope className="text-gray-400 text-lg" /><div><p className="text-xs text-gray-500">Email</p><p className="font-semibold text-gray-800 truncate max-w-[200px]">{employeeData?.emailId || "N/A"}</p></div></div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><FaUserTie className="text-gray-400 text-lg" /><div><p className="text-xs text-gray-500">Reporting To</p><p className="font-semibold text-gray-800">{getManagerFullName(employeeData)}</p></div></div>
            </div>
          </div>
        </div>

        {/* Quarter Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-md mb-6 p-6 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left"><p className="text-sm text-blue-600 font-medium">Financial Year</p><p className="text-2xl font-bold text-gray-800">{selectedYear}-{parseInt(selectedYear) + 1}</p></div>
            <div className="text-center"><p className="text-sm text-blue-600 font-medium">Quarter</p><p className="text-2xl font-bold text-red-600">{selectedQuarter}</p></div>
            <div className="text-center md:text-right"><p className="text-sm text-blue-600 font-medium">Period</p><p className="text-lg font-semibold text-gray-700">{getQuarterDates(selectedQuarter, selectedYear)}</p></div>
          </div>
        </div>

        {/* SMART Goals Form */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gray-800 px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div><h2 className="text-white text-lg font-semibold flex items-center gap-2"><FaClipboardList /> SMART Goals</h2><p className="text-gray-300 text-sm mt-1">Edit your SMART goals for {selectedQuarter} {selectedYear}</p></div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center min-w-[180px]">
                <p className="text-white text-xs">Total Weightage</p>
                <div className="flex items-center gap-2 mt-1"><span className={`text-2xl font-bold ${isWeightageValid ? "text-green-400" : "text-yellow-400"}`}>{totalWeightage}%</span><span className="text-white/60 text-sm">/ 100%</span></div>
                <div className="w-full bg-white/20 rounded-full h-1.5 mt-2"><div className={`h-1.5 rounded-full transition-all duration-500 ${isWeightageValid ? "bg-green-400" : "bg-yellow-400"}`} style={{ width: `${weightageProgress}%` }} /></div>
                {errors.totalWeightage && <p className="text-xs text-yellow-300 mt-1">{errors.totalWeightage}</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            {goals.map((goal, index) => (
              <div key={goal.id || index} className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center"><span className="text-red-600 font-bold text-sm">{index + 1}</span></div><h3 className="font-semibold text-gray-700">SMART Goal {index + 1}</h3>{goal.status === "SENT_BACK" && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">Sent Back</span>}</div>
                  <button onClick={() => removeGoal(index)} className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-lg"><FaTrash size={16} /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2"><FaBullseye className="inline mr-1 text-red-500 text-xs" /> Goal/Objective <span className="text-red-500">*</span></label>
                    <input type="text" value={goal.title} onChange={(e) => handleGoalChange(index, "title", e.target.value)} placeholder="e.g., Increase customer satisfaction score" className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${errors[index]?.title ? "border-red-500 bg-red-50" : "border-gray-300"}`} />
                    {errors[index]?.title && <p className="text-xs text-red-500 mt-1"><FaInfoCircle className="inline mr-1" /> {errors[index].title}</p>}
                  </div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2"><FaClipboardList className="inline mr-1 text-red-500 text-xs" /> Target <span className="text-red-500">*</span></label>
                    <div className="relative"><select value={goal.targetOperator} onChange={(e) => handleGoalChange(index, "targetOperator", e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all appearance-none bg-white">{targetOperatorOptions.map((op) => (<option key={op} value={op}>{op}</option>))}</select><FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" /></div>
                  </div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-2"><FaPercent className="inline mr-1 text-red-500 text-xs" /> Weightage (%) <span className="text-red-500">*</span><span className="text-xs text-gray-400 ml-2">(Total across all SMART goals must be 100%)</span></label>
                    <div className="flex items-center gap-3"><input type="number" value={goal.weightage} onChange={(e) => handleGoalChange(index, "weightage", e.target.value)} placeholder="0" min="0" max="100" className={`w-28 px-4 py-2.5 border rounded-xl text-center focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${errors[index]?.weightage ? "border-red-500 bg-red-50" : "border-gray-300"}`} /><span className="text-gray-500">out of 100</span></div>
                    {errors[index]?.weightage && <p className="text-xs text-red-500 mt-1"><FaInfoCircle className="inline mr-1" /> {errors[index].weightage}</p>}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addNewGoal} className="w-full py-3 border-2 border-dashed border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2 font-medium group"><FaPlus className="group-hover:scale-110 transition-transform" /> Add Another SMART Goal</button>
          </div>
        </div>

        <DevelopmentGoalsTable />

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 mt-4">
          <button onClick={handleCancel} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"><FaArrowLeft /> Cancel</button>
          <button onClick={handleSaveAsDraft} disabled={submitting || !hasEnteredAnything} className="px-6 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? <FaSpinner className="animate-spin" /> : <FaSave />} Save as Draft</button>
          <button onClick={handleSubmitForApproval} disabled={submitting || !hasEnteredAnything} className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">{submitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />} Submit for Approval</button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-700 flex items-start gap-2"><FaInfoCircle className="mt-0.5 flex-shrink-0" /><span><strong>SMART Goals:</strong> Total weightage must equal 100% before submission. <strong>Development Goals:</strong> These are for training and skill development purposes. Self assessment will be enabled after manager approval.</span></p>
        </div>
      </div>

      <DevelopmentGoalModal isOpen={showDevGoalModal} onClose={handleCloseDevModal} onSave={saveDevelopmentGoal} editingGoal={editingDevGoal} devGoalForm={devGoalForm} setDevGoalForm={setDevGoalForm} devErrors={devErrors} titleOptions={titleOptions} trainingNameOptions={trainingNameOptions} isAssessmentDisabled={isAssessmentDisabled()} />
      <CustomModal isOpen={modal.isOpen} onClose={closeModal} onConfirm={modal.onConfirm} title={modal.title} message={modal.message} type={modal.type} isLoading={submitting} />
      <style jsx>{`@keyframes fadeIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}.animate-fadeIn{animation:fadeIn 0.2s ease-out}`}</style>
    </div>
  );
};

export default EditGoalCreation;