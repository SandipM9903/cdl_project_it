import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../../../components/Header";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import { FiArrowLeft } from "react-icons/fi";
import {
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaBuilding,
  FaUserTie,
  FaStar,
  FaFileAlt,
  FaDownload,
  FaPrint,
  FaAward,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaBullseye,
  FaChartLine,
  FaPercent,
  FaMedal,
  FaCertificate,
  FaQuoteLeft,
  FaTrophy,
  FaTimes,
  FaSmile,
  FaFrown,
  FaMeh,
  FaHeart,
  FaThumbsUp,
  FaCommentDots,
  FaFlag,
  FaUserCheck,
  FaGrinStars,
  FaGrinTears,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP, DOC_URL } from "../../services/api";
import {
  FaFilePdf,
  FaFileExcel,
  FaFileWord,
  FaFileImage,
} from "react-icons/fa";
import { simpleEncrypt } from "../../../simpleEncrypt";
import { BASE_URL } from "../../../config/Config";
import { createPortal } from "react-dom";

// const DOC_URL = `${BASE_URL}:9023/documents/access`;

// Helper function to get employee full name with priority to fullNameAsAadhaar
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

// Helper function to get employee name with priority
const getEmployeeFullName = (employeeData) => {
  if (!employeeData) return "Employee Name";

  // Check localStorage first for EmployeeFullName
  const localStorageFullName = localStorage.getItem("EmployeeFullName");
  if (localStorageFullName && localStorageFullName.trim() !== "") {
    return localStorageFullName.trim();
  }

  const name = getFullName(employeeData);
  if (name) return name;

  return "Employee Name";
};

// Helper function to get manager name with priority
const getManagerFullName = (managerData) => {
  if (!managerData) return "Manager";

  const name = getFullName(managerData);
  if (name) return name;

  return "Manager";
};

// Helper function to get file icon based on extension
const getFileIcon = (fileName) => {
  if (!fileName) return <FaFileAlt className="text-gray-500 text-2xl" />;
  const ext = fileName.toLowerCase().split(".").pop();
  if (ext === "pdf") return <FaFilePdf className="text-red-500 text-2xl" />;
  if (ext === "xlsx" || ext === "xls") return <FaFileExcel className="text-green-600 text-2xl" />;
  if (ext === "docx" || ext === "doc") return <FaFileWord className="text-blue-600 text-2xl" />;
  if (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif") return <FaFileImage className="text-purple-500 text-2xl" />;
  return <FaFileAlt className="text-gray-500 text-2xl" />;
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "SUBMITTED_TO_R1":
        return {
          text: "Submitted to R1",
          color: "bg-blue-100 text-blue-700",
          icon: <FaClock size={12} className="mr-1" />,
        };
      case "SUBMITTED_TO_HR":
      case "FINAL_SUBMITTED_TO_HR":
        return {
          text: "Submitted to HR",
          color: "bg-purple-100 text-purple-700",
          icon: <FaCheckCircle size={12} className="mr-1" />,
        };
      case "ACCEPTED_BY_EMPLOYEE":
        return {
          text: "Accepted by Employee",
          color: "bg-green-100 text-green-700",
          icon: <FaCheckCircle size={12} className="mr-1" />,
        };
      case "MANAGER_REVIEWED":
        return {
          text: "Manager Reviewed",
          color: "bg-indigo-100 text-indigo-700",
          icon: <FaUserTie size={12} className="mr-1" />,
        };
      case "SELF_REVIEWED":
        return {
          text: "Self Reviewed",
          color: "bg-teal-100 text-teal-700",
          icon: <FaStar size={12} className="mr-1" />,
        };
      case "APPROVED":
        return {
          text: "Approved",
          color: "bg-green-100 text-green-700",
          icon: <FaCheckCircle size={12} className="mr-1" />,
        };
      case "PENDING_APPROVAL":
        return {
          text: "Pending Approval",
          color: "bg-yellow-100 text-yellow-700",
          icon: <FaClock size={12} className="mr-1" />,
        };
      case "SENT_BACK":
        return {
          text: "Sent Back",
          color: "bg-red-100 text-red-700",
          icon: <FaInfoCircle size={12} className="mr-1" />,
        };
      case "DRAFT":
        return {
          text: "Draft",
          color: "bg-gray-100 text-gray-700",
          icon: <FaFileAlt size={12} className="mr-1" />,
        };
      case "COMPLETED":
        return {
          text: "Completed",
          color: "bg-green-100 text-green-700",
          icon: <FaCheckCircle size={12} className="mr-1" />,
        };
      default:
        return {
          text: status || "Not Started",
          color: "bg-gray-100 text-gray-500",
          icon: <FaClock size={12} className="mr-1" />,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {config.text}
    </span>
  );
};

// Rating Stars Component
const RatingStars = ({ rating, size = "md" }) => {
  if (!rating || rating === 0)
    return <span className="text-gray-400 text-sm">Not rated</span>;
  const starSize = size === "sm" ? "text-xs" : "text-sm";
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`${starSize} ${i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
    </div>
  );
};

// Rating Badge Component
const RatingBadge = ({ rating }) => {
  const getRatingColor = (rating) => {
    switch (rating) {
      case "A+":
        return "text-purple-600 bg-purple-100 border-purple-200";
      case "A":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "B+":
        return "text-green-600 bg-green-100 border-green-200";
      case "B":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "C":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getRatingLabel = (rating) => {
    switch (rating) {
      case "A+":
        return "OUTSTANDING CONTRIBUTOR";
      case "A":
        return "EXCEEDS EXPECTATIONS";
      case "B+":
        return "MEETS EXPECTATIONS";
      case "B":
        return "PARTIALLY MEETS EXPECTATIONS";
      case "C":
        return "DOES NOT MEET EXPECTATIONS";
      default:
        return "";
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getRatingColor(
        rating,
      )}`}
    >
      <FaTrophy size={14} />
      <span className="font-bold text-lg">{rating}</span>
      <span className="text-xs font-medium">{getRatingLabel(rating)}</span>
    </div>
  );
};

// Enhanced Employee Feeling Component
const feelingOptions = [
  {
    value: "very_happy",
    label: "Very Happy",
    emoji: "😊",
    icon: FaGrinStars,
    description: "Extremely satisfied with the review process",
    color: "bg-green-100 text-green-700 border-green-200",
    hoverColor: "hover:bg-green-200",
  },
  {
    value: "happy",
    label: "Happy",
    emoji: "🙂",
    icon: FaSmile,
    description: "Satisfied with the review process",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    hoverColor: "hover:bg-emerald-200",
  },
  {
    value: "neutral",
    label: "Neutral",
    emoji: "😐",
    icon: FaMeh,
    description: "Neither satisfied nor dissatisfied",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    hoverColor: "hover:bg-yellow-200",
  },
  {
    value: "unhappy",
    label: "Unhappy",
    emoji: "😞",
    icon: FaFrown,
    description: "Dissatisfied with some aspects",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    hoverColor: "hover:bg-orange-200",
  },
  {
    value: "very_unhappy",
    label: "Very Unhappy",
    emoji: "😢",
    icon: FaGrinTears,
    description: "Very dissatisfied with the review process",
    color: "bg-red-100 text-red-700 border-red-200",
    hoverColor: "hover:bg-red-200",
  },
];

const EmployeeFeeling = ({ feelingValue }) => {
  const getFeelingOption = (value) => {
    if (!value) return null;
    const normalizedValue = value.toLowerCase();

    if (
      normalizedValue === "very_happy" ||
      normalizedValue === "very happy" ||
      normalizedValue === "very-happy"
    ) {
      return feelingOptions.find((f) => f.value === "very_happy");
    }
    if (normalizedValue === "happy" || normalizedValue === "satisfied") {
      return feelingOptions.find((f) => f.value === "happy");
    }
    if (normalizedValue === "neutral" || normalizedValue === "okay") {
      return feelingOptions.find((f) => f.value === "neutral");
    }
    if (normalizedValue === "unhappy" || normalizedValue === "dissatisfied") {
      return feelingOptions.find((f) => f.value === "unhappy");
    }
    if (
      normalizedValue === "very_unhappy" ||
      normalizedValue === "very unhappy" ||
      normalizedValue === "very-unhappy"
    ) {
      return feelingOptions.find((f) => f.value === "very_unhappy");
    }
    return null;
  };

  const feeling = getFeelingOption(feelingValue);

  if (!feeling) {
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
          😐
        </div>
        <div>
          <p className="text-xs text-gray-500">Employee Feeling</p>
          <p className="font-medium text-gray-800 capitalize">
            {feelingValue || "Not specified"}
          </p>
        </div>
      </div>
    );
  }

  const IconComponent = feeling.icon;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border ${feeling.color} transition-all duration-200 ${feeling.hoverColor}`}
    >
      <div className="relative">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
          <span className="text-3xl">{feeling.emoji}</span>
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
          <IconComponent size={12} className={feeling.color.split(" ")[1]} />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-gray-800">{feeling.label}</p>
          <span className="text-xs opacity-75">{feeling.emoji}</span>
        </div>
        <p className="text-xs opacity-80">{feeling.description}</p>
      </div>
    </div>
  );
};

const AnnualReviewPreview = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const yearParam = queryParams.get("year");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewData, setReviewData] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const triggerNotification = (message, type = "success") => {
    setNotification({
      show: true,
      message,
      type,
    });
  };

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const customToast = {
    success: (msg) => triggerNotification(msg, "success"),
    error: (msg) => triggerNotification(msg, "error"),
    info: (msg) => triggerNotification(msg, "info"),
    warning: (msg) => triggerNotification(msg, "warning"),
  };
  const [employeeData, setEmployeeData] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const [docData, setDocData] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [quarterlyGoals, setQuarterlyGoals] = useState({
    Q1: {
      goals: [],
      weightage: 0,
      submittedDate: null,
      selfAssessment: 0,
      managerAssessment: 0,
    },
    Q2: {
      goals: [],
      weightage: 0,
      submittedDate: null,
      selfAssessment: 0,
      managerAssessment: 0,
    },
    Q3: {
      goals: [],
      weightage: 0,
      submittedDate: null,
      selfAssessment: 0,
      managerAssessment: 0,
    },
    Q4: {
      goals: [],
      weightage: 0,
      submittedDate: null,
      selfAssessment: 0,
      managerAssessment: 0,
    },
  });

  const financialYear = yearParam
    ? `${yearParam}-${parseInt(yearParam) + 1}`
    : "N/A";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchPreviewData();
  }, [empId, yearParam]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (reviewData?.id) {
        try {
          const docResponse = await axios.get(
            `${BASE_URL_EPMS}/api/annual-review/all/${reviewData.id}`,
          );
          if (docResponse.data && docResponse.data.success) {
            setDocData(docResponse.data.data);
          }
        } catch (docErr) {
          console.log("Error fetching documents:", docErr.message);
        }
      }
    };
    fetchDocuments();
  }, [reviewData?.id]);

  const fetchAllEmployees = async () => {
    try {
      const storedEmpCode = localStorage.getItem("empId");
      if (!storedEmpCode) return [];

      const response = await axios.get(`${BASE_URL_EPMS_EMP}/${storedEmpCode}`);

      let employees = [];
      if (Array.isArray(response.data)) {
        employees = response.data
          .map(
            (item) =>
              item.fileAndObjectTypeBean?.empResDTO || item.empResDTO || item,
          )
          .filter((emp) => emp !== null);
      } else if (response.data && typeof response.data === "object") {
        if (response.data.fileAndObjectTypeBean?.empResDTO) {
          employees = [response.data.fileAndObjectTypeBean.empResDTO];
        } else if (response.data.empResDTO) {
          employees = [response.data.empResDTO];
        } else {
          employees = [response.data];
        }
      }

      console.log(
        "All employees fetched:",
        employees.map((e) => ({
          code: e.empCode,
          name: e.fullNameAsAadhaar || e.firstName,
          fullNameAsAadhaar: e.fullNameAsAadhaar,
        })),
      );

      setAllEmployees(employees);
      return employees;
    } catch (err) {
      console.error("Error fetching employees:", err);
      return [];
    }
  };

  const fetchPreviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedEmpId = empId || localStorage.getItem("empId");
      const year = yearParam || new Date().getFullYear().toString();

      if (!storedEmpId) {
        setError("Employee ID not found");
        setLoading(false);
        return;
      }

      // Fetch all employees first
      const employees = await fetchAllEmployees();

      // Find employee details - use fullNameAsAadhaar
      const employee = employees.find(
        (emp) => emp.empCode?.toString() === storedEmpId?.toString(),
      );

      if (employee) {
        console.log("Employee found:", {
          fullNameAsAadhaar: employee.fullNameAsAadhaar,
          firstName: employee.firstName,
          lastName: employee.lastName,
        });
        setEmployeeData(employee);
      } else {
        console.warn("Employee not found with ID:", storedEmpId);
      }

      // Fetch annual review data
      const annualReviewUrl = `${BASE_URL_EPMS}/api/annual-review/${storedEmpId}/${year}`;
      console.log("Fetching annual review from:", annualReviewUrl);

      const annualReviewResponse = await axios.get(annualReviewUrl);

      if (!annualReviewResponse.data) {
        setError("No review data found");
        setLoading(false);
        return;
      }

      const reviewDataObj = annualReviewResponse.data;
      setReviewData(reviewDataObj);
      console.log("Review data loaded:", reviewDataObj);

      // Find manager details using managerId from review data
      if (reviewDataObj.managerId) {
        const manager = employees.find(
          (emp) =>
            emp.empCode?.toString() === reviewDataObj.managerId?.toString(),
        );
        if (manager) {
          console.log("Manager found:", {
            fullNameAsAadhaar: manager.fullNameAsAadhaar,
            firstName: manager.firstName,
            lastName: manager.lastName,
          });
          setManagerData(manager);
        }
      }

      // If manager not found by ID, try using employee's reporting manager email
      if (!managerData && employee?.reportingManagerEmailId) {
        const manager = employees.find(
          (emp) =>
            emp.emailId?.toLowerCase() ===
            employee.reportingManagerEmailId?.toLowerCase(),
        );
        if (manager) {
          console.log("Manager found by email:", {
            fullNameAsAadhaar: manager.fullNameAsAadhaar,
            firstName: manager.firstName,
          });
          setManagerData(manager);
        }
      }

      // Fetch quarterly goals
      await fetchAllQuarterlyGoals(storedEmpId, year);
    } catch (err) {
      console.error("Error fetching preview data:", err);
      if (err.response && err.response.status === 404) {
        setError("Annual review not found for the selected employee and year.");
      } else if (err.response && err.response.data) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Failed to load review data",
        );
      } else {
        setError("Failed to load preview data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllQuarterlyGoals = async (storedEmpId, year) => {
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    const goalsData = { ...quarterlyGoals };

    for (const quarter of quarters) {
      try {
        const response = await axios.get(
          `${BASE_URL_EPMS}/api/goals/employee/${storedEmpId}/${quarter}?year=${year}`,
        );

        let goals = [];
        if (response.data?.data) {
          goals = response.data.data;
        } else if (Array.isArray(response.data)) {
          goals = response.data;
        }

        if (goals.length > 0) {
          let selfTotal = 0,
            managerTotal = 0;
          let selfCount = 0,
            managerCount = 0;
          let totalWeightage = 0;

          goals.forEach((goal) => {
            totalWeightage += goal.weightage || 0;
            if (goal.selfAssessmentScore && goal.selfAssessmentScore > 0) {
              selfTotal += goal.selfAssessmentScore;
              selfCount++;
            }
            if (
              goal.managerAssessmentScore &&
              goal.managerAssessmentScore > 0
            ) {
              managerTotal += goal.managerAssessmentScore;
              managerCount++;
            }
          });

          goalsData[quarter] = {
            goals: goals,
            weightage: totalWeightage,
            submittedDate: goals[0]?.submittedToEmployeeAt || null,
            selfAssessment:
              selfCount > 0 ? Math.round(selfTotal / selfCount) : 0,
            managerAssessment:
              managerCount > 0 ? Math.round(managerTotal / managerCount) : 0,
          };
        }
      } catch (error) {
        console.error(`Error fetching ${quarter} goals:`, error);
      }
    }
    setQuarterlyGoals(goalsData);
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

  const formatDateTime = (dateString) => {
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

  const handlePrint = () => {
    window.print();
  };

  const calculateOverallScore = () => {
    if (!quarterlyGoals) return 0;
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    let totalScore = 0;
    let count = 0;
    quarters.forEach((q) => {
      if (quarterlyGoals[q]?.managerAssessment > 0) {
        totalScore += quarterlyGoals[q].managerAssessment;
        count++;
      }
    });
    return count > 0 ? Math.round(totalScore / count) : 0;
  };

  const getEmployeeCode = () => {
    return (
      employeeData?.empCode ||
      reviewData?.employeeId ||
      reviewData?.empId ||
      empId ||
      "N/A"
    );
  };

  const getEmployeeName = () => {
    // Then check employeeData
    if (employeeData) {
      // Check for fullNameAsAadhaar in employeeData
      if (
        employeeData.fullNameAsAadhaar &&
        employeeData.fullNameAsAadhaar.trim() !== ""
      ) {
        return employeeData.fullNameAsAadhaar.trim();
      }
    }

    // Then check reviewData
    if (reviewData) {
      if (
        reviewData.fullNameAsAadhaar &&
        reviewData.fullNameAsAadhaar.trim() !== ""
      ) {
        return reviewData.fullNameAsAadhaar.trim();
      }

      if (reviewData.employeeName && reviewData.employeeName.trim() !== "") {
        return reviewData.employeeName.trim();
      }

      if (reviewData.empName && reviewData.empName.trim() !== "") {
        return reviewData.empName.trim();
      }
    }

    return "N/A";
  };

  const getEmployeeDesignation = () => {
    return (
      employeeData?.designationName ||
      employeeData?.designation ||
      reviewData?.designation ||
      "N/A"
    );
  };

  const openDocument = async (docId) => {
    try {
      const encryptedId = simpleEncrypt(docId.toString());
      const response = await axios.get(DOC_URL, {
        responseType: "blob",
        headers: { "X-DOC-TOKEN": encryptedId },
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      customToast.error("Unable to open document");
    }
  };

  const getEmployeeDepartment = () => {
    return (
      employeeData?.mainDepartment ||
      employeeData?.department ||
      reviewData?.department ||
      "N/A"
    );
  };

  // Get reporting manager name using fullNameAsAadhaar
  const getReportingManagerName = () => {
    if (managerData) {
      return getManagerFullName(managerData);
    }

    if (reviewData?.managerName) {
      return reviewData.managerName;
    }

    if (reviewData?.managerId && allEmployees.length > 0) {
      const manager = allEmployees.find(
        (emp) => emp.empCode?.toString() === reviewData.managerId?.toString(),
      );
      if (manager) {
        return getManagerFullName(manager);
      }
    }

    if (employeeData?.reportingManagerEmailId && allEmployees.length > 0) {
      const manager = allEmployees.find(
        (emp) =>
          emp.emailId?.toLowerCase() ===
          employeeData.reportingManagerEmailId?.toLowerCase(),
      );
      if (manager) {
        return getManagerFullName(manager);
      }
      // Extract name from email as fallback
      const emailName = employeeData.reportingManagerEmailId.split("@")[0];
      return emailName
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }

    return "N/A";
  };

  const getManagerDesignation = () => {
    if (managerData?.designationName) {
      return managerData.designationName;
    }
    return "Manager";
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading annual review preview..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96 mt-24">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-red-50 rounded-full p-4 inline-block mb-4">
              <FaInfoCircle className="text-red-500 text-4xl" />
            </div>
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <p className="text-gray-500 text-sm mb-6">
              Please check if the annual review has been created for this
              employee.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const overallScore = calculateOverallScore();

  return (
    <>
      {notification.show && createPortal(
        <div className="fixed top-5 right-5 z-50 animate-slideIn">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md transition-all ${notification.type === "success" ? "bg-green-50/90 border-green-200 text-green-800" :
              notification.type === "error" ? "bg-red-50/90 border-red-200 text-red-800" :
                notification.type === "warning" ? "bg-yellow-50/90 border-yellow-200 text-yellow-800" :
                  "bg-blue-50/90 border-blue-200 text-blue-800"
            }`}>
            {notification.type === "success" && <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />}
            {notification.type === "error" && <FaExclamationTriangle className="text-red-500 text-lg flex-shrink-0" />}
            {notification.type === "warning" && <FaExclamationTriangle className="text-yellow-500 text-lg flex-shrink-0" />}
            {notification.type === "info" && <FaInfoCircle className="text-blue-500 text-lg flex-shrink-0" />}
            <span className="text-sm font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              &times;
            </button>
          </div>
        </div>,
        document.body
      )}
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />

        <div className="mt-20 px-4 md:px-6 max-w-5xl mx-auto w-full pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm mb-6 mt-4 print:hidden">
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
              My Performance
            </span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-semibold text-red-600">Annual Review Preview</span>
          </nav>
          {/* Print Button */}
          <div className="flex justify-end mb-4 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaPrint size={16} />
              Print / Save as PDF
            </button>
          </div>

          {/* Preview Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none border border-gray-100">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    Annual Performance Review
                  </h1>
                  <p className="text-red-100 text-sm mt-1">
                    Official Review Document
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-red-100 text-xs">Financial Year</p>
                  <p className="text-xl font-bold">
                    {reviewData?.financialYear || financialYear}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-red-500/30">
                <div>
                  <p className="text-red-100 text-xs flex items-center gap-1">
                    <FaUser size={10} /> Employee Name
                  </p>
                  <p className="font-semibold">{getEmployeeName()}</p>
                  <p className="text-xs text-red-100">
                    {getEmployeeDesignation()}
                  </p>
                </div>
                <div>
                  <p className="text-red-100 text-xs flex items-center gap-1">
                    <FaBuilding size={10} /> Employee Code
                  </p>
                  <p className="font-semibold">{getEmployeeCode()}</p>
                  <p className="text-xs text-red-100">
                    {getEmployeeDepartment()}
                  </p>
                </div>
                <div>
                  <p className="text-red-100 text-xs flex items-center gap-1">
                    <FaUserTie size={10} /> Reporting Manager
                  </p>
                  <p className="font-semibold">{getReportingManagerName()}</p>
                  <p className="text-xs text-red-100">
                    {getManagerDesignation()}
                  </p>
                </div>
                <div>
                  <p className="text-red-100 text-xs flex items-center gap-1">
                    <FaCalendarAlt size={10} /> Review Status
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={reviewData?.status} />
                  </div>
                  {reviewData?.submittedAt && (
                    <p className="text-xs text-red-100 mt-1">
                      Submitted: {formatDate(reviewData.submittedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Review Timeline Card */}
              {(reviewData?.submittedAt ||
                reviewData?.managerAnnualReviewSubmissionDate ||
                reviewData?.submittedToHrDate) && (
                  <div className="mb-8 bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaClock className="text-red-500" /> Review Timeline
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {reviewData?.submittedAt && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Submitted to R1
                            </p>
                            <p className="text-sm font-medium">
                              {formatDateTime(reviewData.submittedAt)}
                            </p>
                          </div>
                        </div>
                      )}
                      {reviewData?.managerAnnualReviewSubmissionDate && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Manager Reviewed
                            </p>
                            <p className="text-sm font-medium">
                              {formatDateTime(
                                reviewData.managerAnnualReviewSubmissionDate,
                              )}
                            </p>
                            <p className="text-xs text-gray-400">
                              By:{" "}
                              {reviewData?.submittedToHrBy ||
                                getReportingManagerName()}
                            </p>
                          </div>
                        </div>
                      )}
                      {reviewData?.submittedToHrDate && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Submitted to HR
                            </p>
                            <p className="text-sm font-medium">
                              {formatDateTime(reviewData.submittedToHrDate)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Key Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {reviewData?.discussedWithR1 !== undefined && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaUserCheck className="text-blue-600" />
                      <h3 className="font-semibold text-blue-800">
                        Discussion Status
                      </h3>
                    </div>
                    <p className="text-sm text-blue-700">
                      {reviewData.discussedWithR1
                        ? "✓ Discussed with Manager"
                        : "✗ Not Discussed with Manager"}
                    </p>
                  </div>
                )}

                {reviewData?.employeeFeeling && (
                  <div className="col-span-1">
                    <EmployeeFeeling
                      feelingValue={reviewData.employeeFeeling}
                    />
                  </div>
                )}

                {reviewData?.sendBackCount > 0 && (
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaFlag className="text-yellow-600" />
                      <h3 className="font-semibold text-yellow-800">
                        Revision Status
                      </h3>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Sent back for revision: {reviewData.sendBackCount} time(s)
                    </p>
                  </div>
                )}
              </div>

              {/* Manager Rating Section */}
              {reviewData?.managerRating && (
                <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-200">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-yellow-500 flex items-center gap-2">
                    <FaTrophy className="text-yellow-600" /> Manager's Rating
                  </h2>
                  <RatingBadge rating={reviewData.managerRating} />
                </div>
              )}

              {/* Key Accomplishments Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-red-500 flex items-center gap-2">
                  <FaFileAlt className="text-red-500" /> Key Accomplishments
                </h2>
                {reviewData?.keyAccomplishment ? (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: reviewData.keyAccomplishment,
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-xl">
                    <p className="text-gray-400">
                      No key accomplishments recorded
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Feedback Section */}
              {reviewData?.additionalFeedback && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-red-500 flex items-center gap-2">
                    <FaCommentDots className="text-red-500" /> Additional
                    Feedback
                  </h2>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <p className="text-gray-700">
                      {reviewData.additionalFeedback}
                    </p>
                  </div>
                </div>
              )}

              {/* Employee Comment Section */}
              {reviewData?.employeeCommentText && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-red-500 flex items-center gap-2">
                    <FaCommentDots className="text-red-500" /> Employee Comment
                  </h2>
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <p className="text-gray-700">
                      {reviewData.employeeCommentText}
                    </p>
                  </div>
                </div>
              )}

              {/* Manager's Remarks Section */}
              {reviewData?.managerRemarks && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-red-500 flex items-center gap-2">
                    <FaUserTie className="text-red-500" /> Manager's Remarks
                  </h2>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <FaQuoteLeft className="text-red-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 italic">
                        {reviewData.managerRemarks}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents & Certifications Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-red-500 flex items-center gap-2">
                  <FaCertificate className="text-red-500" /> Compliance &
                  Certifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" /> POSH Training
                    </h3>
                    {docData?.poshDocId ? (
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div
                          onClick={() => openDocument(docData.poshDocId)}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          {getFileIcon(docData.poshFileName || "posh.pdf")}
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              POSH Completion Certificate
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No POSH document recorded
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaAward className="text-blue-500" /> Professional
                      Certifications ({docData?.totalCertifications || 0})
                    </h3>
                    <div className="space-y-3">
                      {docData?.certifications?.length > 0 ? (
                        docData.certifications.map((cert) => (
                          <div
                            key={cert.id}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                          >
                            <div
                              className="flex items-center gap-3 cursor-pointer"
                              onClick={() =>
                                openDocument(cert.certificateDocId)
                              }
                            >
                              {getFileIcon(cert.fileName)}
                              <div>
                                <p
                                  className="text-sm font-medium text-gray-700 truncate max-w-[150px]"
                                  title={cert.fileName}
                                >
                                  {cert.name || cert.fileName}
                                </p>
                                <p className="text-[10px] uppercase font-bold text-gray-400">
                                  {cert.type}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          No certifications uploaded
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Send Back Remarks */}
              {reviewData?.sendBackRemarks && (
                <div className="mb-8 bg-yellow-50 rounded-xl p-5 border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <FaInfoCircle /> Revision Requested
                  </h3>
                  <p className="text-sm text-yellow-700">
                    {reviewData.sendBackRemarks}
                  </p>
                  {reviewData.lastSendBackAt && (
                    <p className="text-xs text-yellow-600 mt-2">
                      Requested on: {formatDateTime(reviewData.lastSendBackAt)}
                    </p>
                  )}
                </div>
              )}

              {/* HR Remarks */}
              {reviewData?.hrRemarks && (
                <div className="mb-8 bg-purple-50 rounded-xl p-5 border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">
                    HR Remarks
                  </h3>
                  <p className="text-sm text-purple-700">
                    {reviewData.hrRemarks}
                  </p>
                </div>
              )}

              {/* Critical Flag */}
              {reviewData?.criticalFlag && (
                <div className="mb-8 bg-red-50 rounded-xl p-5 border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <FaFlag className="text-red-600" /> Critical Flag
                  </h3>
                  <p className="text-sm text-red-700">
                    {reviewData.criticalFlag}
                  </p>
                </div>
              )}

              {/* Talent Flag */}
              {reviewData?.talentFlag && (
                <div className="mb-8 bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <FaAward className="text-blue-600" /> Talent Flag
                  </h3>
                  <p className="text-sm text-blue-700">
                    {reviewData.talentFlag}
                  </p>
                </div>
              )}

              {/* Submission Information */}
              <div className="mb-8 bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaFileAlt className="text-gray-500" /> Submission Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Year</p>
                    <p className="font-medium text-gray-800">
                      {reviewData?.year || "N/A"}
                    </p>
                  </div>
                  {reviewData?.submittedToHrBy && (
                    <div>
                      <p className="text-xs text-gray-500">
                        Submitted to HR By
                      </p>
                      <p className="font-medium text-gray-800">
                        {reviewData.submittedToHrBy}
                      </p>
                    </div>
                  )}
                  {reviewData?.createdAt && (
                    <div>
                      <p className="text-xs text-gray-500">Created At</p>
                      <p className="font-medium text-gray-800">
                        {formatDateTime(reviewData.createdAt)}
                      </p>
                    </div>
                  )}
                  {reviewData?.updatedAt && (
                    <div>
                      <p className="text-xs text-gray-500">Last Updated</p>
                      <p className="font-medium text-gray-800">
                        {formatDateTime(reviewData.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center">
                  This is an official annual review document generated by the
                  EPMS system.
                  {reviewData?.createdAt &&
                    ` Generated on ${formatDateTime(reviewData.createdAt)}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media print {
            .print\\:hidden {
              display: none !important;
            }
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            body {
              background: white;
            }
          }
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slideIn { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>
      </div>
    </>
  );
};

export default AnnualReviewPreview;
