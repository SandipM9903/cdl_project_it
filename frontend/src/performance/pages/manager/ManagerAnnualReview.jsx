import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../../../components/Header";
import {
  FaArrowLeft,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaAward,
  FaChartLine,
  FaUserTie,
  FaSpinner,
  FaPlus,
  FaTrash,
  FaSave,
  FaPaperPlane,
  FaTrophy,
  FaArrowRight,
  FaArrowLeft as FaArrowLeftIcon,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaEye,
  FaInfoCircle,
  FaFilter,
  FaSearch,
  FaEdit,
  FaCheckSquare,
  FaSquare,
  FaUndoAlt,
  FaFilePdf,
  FaFileExcel,
  FaFileWord,
  FaFileImage,
  FaDownload,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP, DOC_URL } from "../../services/api";
import { simpleEncrypt } from "../../../simpleEncrypt";
import { BASE_URL } from "../../../config/Config";
import { toast, ToastContainer } from "react-toastify";
import { createPortal } from "react-dom";
import { FiArrowLeft } from "react-icons/fi";
import LoadingAnimation from "../../components/common/LoadingAnimation";

const LoadingOverlay = ({ message = "" }) => {
  const getLoadingText = () => {
    const msg = message.toLowerCase();
    if (msg.includes("saving") || msg.includes("draft")) {
      return "Saving Draft...";
    } else if (msg.includes("submitting")) {
      return "Submitting Manager Review...";
    } else if (msg.includes("loading") && msg.includes("review")) {
      return "Loading Review Data...";
    }
    return message || "Processing...";
  };

  return <LoadingAnimation message={getLoadingText()} />;
};

// const DOC_URL = `${BASE_URL}:9023/documents/access`;

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
  const fullName = `${firstName} ${middleName} ${lastName}`
    .trim()
    .replace(/\s+/g, " ");

  if (fullName && fullName !== "") {
    return fullName;
  }

  // Ultimate fallback to employee code
  return employeeData.empCode || "Employee Name";
};

// Helper function to get manager full name with priority to fullNameAsAadhaar
const getManagerFullName = (managerData) => {
  if (!managerData) return "Manager";

  // Check for fullNameAsAadhaar in managerData
  if (
    managerData.fullNameAsAadhaar &&
    managerData.fullNameAsAadhaar.trim() !== ""
  ) {
    return managerData.fullNameAsAadhaar.trim();
  }

  // Fallback to firstName, middleName, lastName
  const firstName = managerData.firstName || "";
  const middleName = managerData.middleName || "";
  const lastName = managerData.lastName || "";
  const fullName = `${firstName} ${middleName} ${lastName}`
    .trim()
    .replace(/\s+/g, " ");

  if (fullName && fullName !== "") {
    return fullName;
  }

  // Try reportingManager field if available
  if (managerData.reportingManager) {
    return managerData.reportingManager;
  }

  return "Manager";
};

// Helper function to get employee designation
const getEmployeeDesignation = (employeeData) => {
  if (!employeeData) return "N/A";

  // Try nested designationResDTO first
  if (employeeData.designationResDTO?.designationName) {
    return employeeData.designationResDTO.designationName;
  }

  // Try direct designationName
  if (employeeData.designationName) {
    return employeeData.designationName;
  }

  return "N/A";
};

// Helper function to get employee department
const getEmployeeDepartment = (employeeData) => {
  if (!employeeData) return "N/A";

  // Try nested mainDeptResDTO first
  if (employeeData.mainDeptResDTO?.mainDepartment) {
    return employeeData.mainDeptResDTO.mainDepartment;
  }

  // Try direct mainDepartment
  if (employeeData.mainDepartment) {
    return employeeData.mainDepartment;
  }

  return "N/A";
};

// Helper function to get employee sub department
const getEmployeeSubDepartment = (employeeData) => {
  if (!employeeData) return "N/A";

  // Try nested subDeptResDTO first
  if (employeeData.subDeptResDTO?.subDept) {
    return employeeData.subDeptResDTO.subDept;
  }

  // Try direct subDept
  if (employeeData.subDept) {
    return employeeData.subDept;
  }

  return "N/A";
};

// Custom Modal Component
const CustomModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "info",
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        );
      case "error":
        return (
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
        );
      case "warning":
        return (
          <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
        );
      default:
        return <FaInfoCircle className="text-red-500 text-5xl mx-auto mb-4" />;
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
          <p className="text-gray-600 mb-6 whitespace-pre-line">{message}</p>
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
                    Confirm
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 9-Box Grid Info Modal Component - CORRECTED MAPPING
const NineBoxGridInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // CORRECTED 9-Box Grid Data based on the image
  const gridData = [
    {
      achievement: "Exceptional",
      potential: "High",
      performance: "High",
      category: "Key Talent",
      rating: "A+",
      description: "Outstanding Contributor",
    },
    {
      achievement: "Excellent",
      potential: "High",
      performance: "Medium",
      category: "Emerging Talent",
      rating: "A",
      description: "Exceeds Expectations",
    },
    {
      achievement: "Performer",
      potential: "High",
      performance: "Low",
      category: "Misfit",
      rating: "B",
      description: "Partially Meets Expectations",
    },
    {
      achievement: "Excellent",
      potential: "Medium",
      performance: "High",
      category: "Talent",
      rating: "A",
      description: "Exceeds Expectations",
    },
    {
      achievement: "Performer",
      potential: "Medium",
      performance: "Medium",
      category: "Critical Resource",
      rating: "B+",
      description: "Strongly Meets Expectations",
    },
    {
      achievement: "Performer",
      potential: "Medium",
      performance: "Low",
      category: "Watch List",
      rating: "B",
      description: "Partially Meets Expectations",
    },
    {
      achievement: "Performer",
      potential: "Low",
      performance: "High",
      category: "Expert",
      rating: "B+",
      description: "Strongly Meets Expectations",
    },
    {
      achievement: "Performer",
      potential: "Low",
      performance: "Medium",
      category: "Stable",
      rating: "B",
      description: "Partially Meets Expectations",
    },
    {
      achievement: "Unsatisfactory",
      potential: "Low",
      performance: "Low",
      category: "Risk",
      rating: "C",
      description: "Does Not Meet Expectations",
    },
  ];

  const getRatingBadgeClass = (rating) => {
    switch (rating) {
      case "A+":
        return "bg-purple-100 text-purple-700";
      case "A":
        return "bg-red-100 text-red-700";
      case "B+":
        return "bg-green-100 text-green-700";
      case "B":
        return "bg-yellow-100 text-yellow-700";
      case "C":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[85vh] overflow-hidden animate-fadeIn">
        <div className="bg-red-600 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaChartLine className="text-white text-xl" />
            <h2 className="text-white font-semibold text-xl">
              9-Box Grid Reference Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-red-200 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="p-6 overflow-auto max-h-[calc(85vh-80px)]">
          <p className="text-gray-600 mb-4 text-sm">
            The 9-Box Grid automatically determines the employee's category,
            rating, and rating description based on the combination of
            Achievement Level, Potential, and Performance.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Achievement Level
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Potential
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Performance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Category (Talent Status)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                    Rating Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gridData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {row.achievement}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {row.potential}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {row.performance}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {row.category}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-bold ${getRatingBadgeClass(
                          row.rating,
                        )}`}
                      >
                        {row.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <FaInfoCircle className="text-blue-600" />
              <strong>Note:</strong> The Category (Talent Status), Rating, and
              Rating Description fields are automatically populated based on the
              selected combination and cannot be edited manually.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ManagerAnnualReview = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const yearParam = queryParams.get("year");
  const reviewIdParam = queryParams.get("reviewId");

  const [employeeData, setEmployeeData] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const [annualReviewData, setAnnualReviewData] = useState(null);
  const [quarterlyGoals, setQuarterlyGoals] = useState({
    Q1: [],
    Q2: [],
    Q3: [],
    Q4: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    yearParam || new Date().getFullYear().toString(),
  );
  const [activeTab, setActiveTab] = useState("accomplishments");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [initialState, setInitialState] = useState({
    achievementLevel: "",
    potential: "",
    performance: "",
    managerRemarks: "",
  });

  const isFormModified = () => {
    if (achievementLevel !== initialState.achievementLevel) return true;
    if (potential !== initialState.potential) return true;
    if (performance !== initialState.performance) return true;
    if (managerRemarks !== initialState.managerRemarks) return true;
    return false;
  };

  // Document viewing state
  const [docData, setDocData] = useState(null);

  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
  });

  // 9-Box Grid Info Modal state
  const [showGridInfo, setShowGridInfo] = useState(false);

  // Form states
  const [selectedAccomplishments, setSelectedAccomplishments] = useState([]);
  const [additionalAccomplishments, setAdditionalAccomplishments] = useState(
    [],
  );
  const [certifications, setCertifications] = useState([]);

  // Talent & Matrix Assessment states
  const [achievementLevel, setAchievementLevel] = useState("");
  const [potential, setPotential] = useState("");
  const [performance, setPerformance] = useState("");

  // 9-Box Grid auto-populated fields (read-only)
  const [matrixCategory, setMatrixCategory] = useState("");
  const [matrixRating, setMatrixRating] = useState("");
  const [matrixRatingDescription, setMatrixRatingDescription] = useState("");

  const [managerRemarks, setManagerRemarks] = useState("");
  const [keyAccomplishment, setKeyAccomplishment] = useState("");

  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    achievementLevel: false,
    potential: false,
    performance: false,
    managerRemarks: false,
  });

  // Tab order
  const tabOrder = ["accomplishments", "managerRemarks", "talentmatrix"];
  const tabLabels = {
    accomplishments: "Key Accomplishments",
    managerRemarks: "Manager's Remarks",
    talentmatrix: "Talent Assessment",
  };

  // CORRECTED 9-Box Grid Mapping based on the image
  const nineBoxGridMapping = {
    // Row 1: High Potential
    "Exceptional-High-High": {
      category: "Key Talent",
      rating: "A+",
      ratingDescription: "Outstanding Contributor",
    },
    "Excellent-High-Medium": {
      category: "Emerging Talent",
      rating: "A",
      ratingDescription: "Exceeds Expectations",
    },
    "Performer-High-Low": {
      category: "Misfit",
      rating: "B",
      ratingDescription: "Partially Meets Expectations",
    },

    // Row 2: Medium Potential
    "Excellent-Medium-High": {
      category: "Talent",
      rating: "A",
      ratingDescription: "Exceeds Expectations",
    },
    "Performer-Medium-Medium": {
      category: "Critical Resource",
      rating: "B+",
      ratingDescription: "Strongly Meets Expectations",
    },
    "Performer-Medium-Low": {
      category: "Watch List",
      rating: "B",
      ratingDescription: "Partially Meets Expectations",
    },

    // Row 3: Low Potential
    "Performer-Low-High": {
      category: "Expert",
      rating: "B+",
      ratingDescription: "Strongly Meets Expectations",
    },
    "Performer-Low-Medium": {
      category: "Stable",
      rating: "B",
      ratingDescription: "Partially Meets Expectations",
    },
    "Unsatisfactory-Low-Low": {
      category: "Risk",
      rating: "C",
      ratingDescription: "Does Not Meet Expectations",
    },
  };

  // All valid combinations for validation
  const validCombinations = Object.keys(nineBoxGridMapping);

  const achievementLevelOptions = [
    { value: "Exceptional", label: "Exceptional" },
    { value: "Excellent", label: "Excellent" },
    { value: "Performer", label: "Performer" },
    { value: "Unsatisfactory", label: "Unsatisfactory" },
  ];

  // Get valid potential options dynamically based on selected achievement and performance
  const getPotentialOptions = (achievement, selectedPerformance) => {
    const potentials = [];

    validCombinations.forEach((key) => {
      const [ach, pot, perf] = key.split("-");

      if (ach === achievement) {
        if (!selectedPerformance || perf === selectedPerformance) {
          potentials.push(pot);
        }
      }
    });

    return [...new Set(potentials)];
  };

  // Get valid performance options dynamically based on selected achievement and potential
  const getPerformanceOptions = (achievement, selectedPotential) => {
    const performances = [];

    validCombinations.forEach((key) => {
      const [ach, pot, perf] = key.split("-");

      if (ach === achievement) {
        if (!selectedPotential || pot === selectedPotential) {
          performances.push(perf);
        }
      }
    });

    return [...new Set(performances)];
  };

  // Check if a combination is valid
  const isValidCombination = (achievement, pot, perf) => {
    if (!achievement || !pot || !perf) return false;
    const key = `${achievement}-${pot}-${perf}`;
    return validCombinations.includes(key);
  };

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
    // Clear performance if the new combination would be invalid
    if (
      performance &&
      !isValidCombination(achievementLevel, value, performance)
    ) {
      setPerformance("");
      setMatrixCategory("");
      setMatrixRating("");
      setMatrixRatingDescription("");
    }
  };

  const handlePerformanceChange = (value) => {
    setPerformance(value);
    // Clear potential if the new combination would be invalid
    if (potential && !isValidCombination(achievementLevel, potential, value)) {
      setPotential("");
      setMatrixCategory("");
      setMatrixRating("");
      setMatrixRatingDescription("");
    }
  };

  // Reset both Potential and Performance fields
  const resetPotentialAndPerformance = () => {
    setPotential("");
    setPerformance("");
    setMatrixCategory("");
    setMatrixRating("");
    setMatrixRatingDescription("");
  };

  const availablePotentialOptions = useMemo(() => {
    return getPotentialOptions(achievementLevel, performance).map((item) => ({
      value: item,
      label: item,
    }));
  }, [achievementLevel, performance]);

  const availablePerformanceOptions = useMemo(() => {
    return getPerformanceOptions(achievementLevel, potential).map((item) => ({
      value: item,
      label: item,
    }));
  }, [achievementLevel, potential]);

  // Function to calculate 9-Box Grid fields
  const calculateNineBoxFields = (achievement, pot, perf) => {
    if (!achievement || !pot || !perf) {
      return { category: "", rating: "", ratingDescription: "" };
    }

    const key = `${achievement}-${pot}-${perf}`;
    const mapping = nineBoxGridMapping[key];

    if (mapping) {
      return {
        category: mapping.category,
        rating: mapping.rating,
        ratingDescription: mapping.ratingDescription,
      };
    }

    return { category: "", rating: "", ratingDescription: "" };
  };

  // Auto-populate matrix fields when achievementLevel, potential, or performance changes
  useEffect(() => {
    const { category, rating, ratingDescription } = calculateNineBoxFields(
      achievementLevel,
      potential,
      performance,
    );
    setMatrixCategory(category);
    setMatrixRating(rating);
    setMatrixRatingDescription(ratingDescription);
  }, [achievementLevel, potential, performance]);

  // Check if submit is enabled
  const isSubmitEnabled = useMemo(() => {
    const allFieldsValid =
      managerRemarks.trim() !== "" &&
      achievementLevel &&
      potential &&
      performance &&
      matrixRating;

    return allFieldsValid;
  }, [managerRemarks, achievementLevel, potential, performance, matrixRating]);

  // Update validation errors based on current tab
  const getCurrentTabValidation = () => {
    switch (activeTab) {
      case "managerRemarks":
        return { managerRemarks: managerRemarks.trim() === "" };
      case "talentmatrix":
        return {
          achievementLevel: !achievementLevel,
          potential: !potential,
          performance: !performance,
        };
      default:
        return {};
    }
  };

  const canProceedToNext = () => {
    const errors = getCurrentTabValidation();
    return Object.values(errors).every((error) => !error);
  };

  // Document viewing function
  const openDocument = async (docId) => {
    if (!docId) {
      toast.error("Document ID not found");
      return;
    }

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
      toast.error("Unable to open document");
    }
  };

  // Fetch documents when annual review data is available
  useEffect(() => {
    const fetchDocuments = async () => {
      if (annualReviewData?.id) {
        try {
          const docResponse = await axios.get(
            `${BASE_URL_EPMS}/api/annual-review/all/${annualReviewData.id}`,
          );
          if (docResponse.data && docResponse.data.success) {
            setDocData(docResponse.data.data);

            // Also update certifications if they have document IDs
            if (docResponse.data.data?.certifications?.length > 0) {
              setCertifications(docResponse.data.data.certifications);
            }
          }
        } catch (docErr) {
          console.log("Error fetching documents:", docErr.message);
        }
      }
    };

    fetchDocuments();
  }, [annualReviewData?.id]);

  // Fetch data on mount
  useEffect(() => {
    fetchAnnualReviewData();
  }, [empId, selectedYear]);

  const fetchAnnualReviewData = async () => {
    setLoading(true);
    try {
      const storedManagerId = localStorage.getItem("empId");
      const employeeId = empId;

      if (!employeeId) {
        setError("Employee ID not found in URL");
        setLoading(false);
        return;
      }

      if (!storedManagerId) {
        setError("Manager ID not found");
        setLoading(false);
        return;
      }

      await fetchManagerDetails(storedManagerId);
      await fetchEmployeeDetails(employeeId);
      await fetchQuarterlyGoals(employeeId, selectedYear);

      await fetchReviewByEmployeeAndYear(employeeId, selectedYear);
    } catch (err) {
      console.error("Error fetching annual review data:", err);
      setError("Failed to load annual review data");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract employee data from API response
  const extractEmployeesFromResponse = (responseData) => {
    if (!responseData) return [];

    const rawData = responseData.teamList || responseData;

    if (!Array.isArray(rawData)) return [];

    return rawData
      .map((item) => {
        // Handle nested structure: fileAndObjectTypeBean.empResDTO
        if (item.fileAndObjectTypeBean?.empResDTO) {
          return item.fileAndObjectTypeBean.empResDTO;
        }
        // Handle direct empResDTO
        if (item.empResDTO) {
          return item.empResDTO;
        }
        // Handle hierarchy structure: empHierarchyResDTO
        if (item.empHierarchyResDTO) {
          return item.empHierarchyResDTO;
        }
        // Already flat structure
        return item;
      })
      .filter((emp) => emp !== null);
  };

  const fetchManagerDetails = async (managerId) => {
    try {
      const storedEmpCode = localStorage.getItem("empId");
      let response;
      try {
        response = await axios.get(
          `https://mycdl.cms.co.in/employee/team/hierarchy/${storedEmpCode}`,
        );
      } catch (err) {
        console.warn("Hierarchy endpoint failed, falling back to team endpoint:", err);
        response = await axios.get(
          `https://mycdl.cms.co.in/employee/team/${storedEmpCode}`,
        );
      }

      const employees = extractEmployeesFromResponse(response.data);

      const manager = employees.find(
        (emp) => emp.empCode?.toString() === managerId?.toString(),
      );
      if (manager) setManagerData(manager);
    } catch (err) {
      console.error("Error fetching manager details:", err);
    }
  };

  const fetchEmployeeDetails = async (employeeId) => {
    try {
      const storedEmpCode = localStorage.getItem("empId");
      let response;
      try {
        response = await axios.get(
          `https://mycdl.cms.co.in/employee/team/hierarchy/${storedEmpCode}`,
        );
      } catch (err) {
        console.warn("Hierarchy endpoint failed, falling back to team endpoint:", err);
        response = await axios.get(
          `https://mycdl.cms.co.in/employee/team/${storedEmpCode}`,
        );
      }

      const employees = extractEmployeesFromResponse(response.data);

      const employee = employees.find(
        (emp) => emp.empCode?.toString() === employeeId?.toString(),
      );
      if (employee) {
        setEmployeeData(employee);
      } else {
        setError(`Employee not found with ID: ${employeeId}`);
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
      throw err;
    }
  };

  const fetchQuarterlyGoals = async (employeeId, year) => {
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    const goalsData = { Q1: [], Q2: [], Q3: [], Q4: [] };

    for (const quarter of quarters) {
      try {
        const response = await axios.get(
          `${BASE_URL_EPMS}/api/goals/employee/${employeeId}/${quarter}?year=${year}`,
        );

        let goals = [];
        if (response.data?.data) goals = response.data.data;
        else if (Array.isArray(response.data)) goals = response.data;

        goalsData[quarter] = goals.filter(
          (goal) => goal.status === "ACCEPTED_BY_EMPLOYEE",
        );
      } catch (error) {
        console.error(`Error fetching ${quarter} goals:`, error);
      }
    }
    setQuarterlyGoals(goalsData);
  };

  const fetchReviewByEmployeeAndYear = async (employeeId, year) => {
    try {
      const url = `${BASE_URL_EPMS}/api/annual-review/${employeeId}/${year}`;
      console.log("Fetching annual review from:", url);
      const response = await axios.get(url);

      console.log("Annual review response:", response.data);

      if (response.data && response.data.id) {
        setAnnualReviewData(response.data);
        populateFormData(response.data);
      } else {
        console.log("No annual review found, creating new one");
        setAnnualReviewData({
          employeeId: employeeId,
          managerId: localStorage.getItem("empId"),
          year: parseInt(year),
          id: null,
        });
        setInitialState({
          achievementLevel: "",
          potential: "",
          performance: "",
          managerRemarks: "",
        });
      }
    } catch (error) {
      console.error("Error fetching annual review:", error);
      setAnnualReviewData({
        employeeId: employeeId,
        managerId: localStorage.getItem("empId"),
        year: parseInt(year),
        id: null,
      });
      setInitialState({
        achievementLevel: "",
        potential: "",
        performance: "",
        managerRemarks: "",
      });
    }
  };

  const populateFormData = (data) => {
    console.log("Populating form with data:", data);

    if (data.keyAccomplishment) {
      setKeyAccomplishment(data.keyAccomplishment);
    }

    if (
      data.selectedAccomplishments &&
      Array.isArray(data.selectedAccomplishments)
    ) {
      setSelectedAccomplishments(data.selectedAccomplishments);
    }

    if (
      data.additionalAccomplishments &&
      Array.isArray(data.additionalAccomplishments)
    ) {
      const formattedAdditional = data.additionalAccomplishments.map((acc) => ({
        title: acc.title,
        quarter: acc.quarter || "OT",
        description: acc.description || "",
      }));
      setAdditionalAccomplishments(formattedAdditional);
    }

    if (data.certifications && Array.isArray(data.certifications)) {
      setCertifications(data.certifications);
    }

    if (data.achievementLevel) setAchievementLevel(data.achievementLevel);
    if (data.potential) setPotential(data.potential);
    if (data.performance) setPerformance(data.performance);
    if (data.matrixCategory) setMatrixCategory(data.matrixCategory);
    if (data.matrixRating) setMatrixRating(data.matrixRating);
    if (data.matrixRatingDescription)
      setMatrixRatingDescription(data.matrixRatingDescription);
    if (data.managerRemarks) setManagerRemarks(data.managerRemarks);

    setInitialState({
      achievementLevel: data.achievementLevel || "",
      potential: data.potential || "",
      performance: data.performance || "",
      managerRemarks: data.managerRemarks || "",
    });
  };

  const handleSave = async () => {
    if (!annualReviewData?.employeeId) {
      showModal(
        "error",
        "Error",
        "Employee information not loaded. Please try again.",
      );
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: annualReviewData.id,
        employeeId: annualReviewData.employeeId,
        managerId: localStorage.getItem("empId"),
        year: parseInt(selectedYear),
        managerRating: matrixRating,
        talentResource: matrixCategory,
        selectedAccomplishments: selectedAccomplishments,
        additionalAccomplishments: additionalAccomplishments.map((acc) => ({
          title: acc.title,
          quarter: acc.quarter || "OT",
        })),
        certifications: certifications,
        achievementLevel: achievementLevel,
        potential: potential,
        performance: performance,
        matrixCategory: matrixCategory,
        matrixRating: matrixRating,
        matrixRatingDescription: matrixRatingDescription,
        managerRemarks: managerRemarks,
      };

      const url = `${BASE_URL_EPMS}/api/annual-review/manager/draft/save`;
      console.log("Saving draft to:", url, payload);
      const response = await axios.put(url, payload);

      if (response.data) {
        showModal(
          "success",
          "Success",
          "Manager review draft saved successfully!",
        );
        await fetchReviewByEmployeeAndYear(
          annualReviewData.employeeId,
          selectedYear,
        );
      }
    } catch (error) {
      console.error("Error saving manager draft:", error);
      showModal(
        "error",
        "Error",
        error.response?.data?.message ||
        "Failed to save manager draft. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitToEmployee = async () => {
    if (!isSubmitEnabled) {
      let missingFields = [];
      if (!managerRemarks.trim()) missingFields.push("Manager's Remarks");
      if (!achievementLevel) missingFields.push("Achievement Level");
      if (!potential) missingFields.push("Potential");
      if (!performance) missingFields.push("Performance");
      if (!matrixRating)
        missingFields.push("Rating (auto-populated from 9-Box Grid)");

      showModal(
        "warning",
        "Incomplete Form",
        `Please complete the following:\n• ${missingFields.join("\n• ")}`,
      );
      return;
    }

    if (!annualReviewData?.employeeId) {
      showModal(
        "error",
        "Error",
        "Employee information not loaded. Please try again.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const financialYear = `${selectedYear}-${parseInt(selectedYear) + 1}`;
      const payload = {
        id: annualReviewData.id ? parseInt(annualReviewData.id) : null,
        employeeId: parseInt(annualReviewData.employeeId),
        managerId: parseInt(localStorage.getItem("empId")),
        year: parseInt(selectedYear),
        financialYear: financialYear,
        managerRating: matrixRating,
        talentResource: matrixCategory,
        selectedAccomplishments: selectedAccomplishments,
        additionalAccomplishments: additionalAccomplishments.map((acc) => ({
          title: acc.title,
          quarter: acc.quarter || "OT",
        })),
        certifications: certifications,
        achievementLevel: achievementLevel,
        potential: potential,
        performance: performance,
        matrixCategory: matrixCategory,
        matrixRating: matrixRating,
        matrixRatingDescription: matrixRatingDescription,
        managerRemarks: managerRemarks,
        status: "SUBMITTED_TO_EMPLOYEE",
        submittedDate: new Date().toISOString(),
      };

      console.log("Submitting payload:", JSON.stringify(payload, null, 2));

      const url = `${BASE_URL_EPMS}/api/annual-review/manager/submit-to-employee`;
      const response = await axios.put(url, payload);

      if (response.data) {
        showModal(
          "success",
          "Success",
          "Annual review submitted to employee successfully!",
          () => {
            navigate("/AppraisalList", {
              state: {
                annualData: { year: parseInt(selectedYear) },
              },
            });
          },
        );
      }
    } catch (error) {
      console.error("Error submitting annual review:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        showModal(
          "error",
          "Error",
          error.response?.data?.message ||
          error.response?.data?.error ||
          `Failed to submit annual review. Server error: ${error.response.status}`,
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        showModal(
          "error",
          "Error",
          "No response received from server. Please check if backend is running.",
        );
      } else {
        console.error("Error message:", error.message);
        showModal(
          "error",
          "Error",
          error.message || "Failed to submit annual review. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const showModal = (type, title, message, onConfirm = null) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      type: "info",
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  const handleModalConfirm = () => {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    closeModal();
  };

  const goToNextTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case "A+":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "A":
        return "bg-red-100 text-red-700 border-red-200";
      case "B+":
        return "bg-green-100 text-green-700 border-green-200";
      case "B":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "C":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getPotentialHelperText = () => {
    if (!achievementLevel) return null;
    switch (achievementLevel) {
      case "Exceptional":
        return (
          <>
            <strong>For "Exceptional" Achievement Level:</strong> the Potential
            field is set as <strong>"High"</strong>.
          </>
        );
      case "Excellent":
        return (
          <>
            <strong>For "Excellent" Achievement Level:</strong> Potential can be{" "}
            <strong>High or Medium</strong>.
          </>
        );
      case "Performer":
        return (
          <>
            <strong>For "Performer" Achievement Level:</strong> Potential can be{" "}
            <strong>High, Medium, or Low</strong> based on employee's capability
            and growth.
          </>
        );
      case "Unsatisfactory":
        return (
          <>
            <strong>For "Unsatisfactory" Achievement Level:</strong> the
            Potential field is set as <strong>"Low"</strong>.
          </>
        );
      default:
        return null;
    }
  };

  const getPerformanceHelperText = () => {
    if (!achievementLevel) return null;
    switch (achievementLevel) {
      case "Exceptional":
        return (
          <>
            <strong>For "Exceptional" Achievement Level:</strong> the
            Performance field is set as <strong>"High"</strong>.
          </>
        );
      case "Excellent":
        return (
          <>
            <strong>For "Excellent" Achievement Level:</strong> Performance can
            be <strong>High or Medium</strong>.
          </>
        );
      case "Performer":
        return (
          <>
            <strong>For "Performer" Achievement Level:</strong> Performance can
            be <strong>High, Medium, or Low</strong> based on employee's work
            output.
          </>
        );
      case "Unsatisfactory":
        return (
          <>
            <strong>For "Unsatisfactory" Achievement Level:</strong> the
            Performance field is set as <strong>"Low"</strong>.
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <LoadingOverlay message="Loading annual review data..." />
      </>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96 mt-24">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const financialYear = `${selectedYear}-${parseInt(selectedYear) + 1}`;

  return (
    <>
      {(submitting || saving) && (
        <LoadingOverlay message={submitting ? "Submitting manager review..." : "Saving draft..."} />
      )}
      {createPortal(
        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
        />,
        document.body,
      )}
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />

        <div className="mt-24 px-4 md:px-6 max-w-7xl mx-auto w-full pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm mb-6">
            <button
              onClick={handleBack}
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
              onClick={() => navigate("/AppraisalList")}
              className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
            >
              Performance List
            </span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-semibold text-red-600">Annual Review</span>
          </nav>

          {/* Header Section */}
          <div className="mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Annual Review - Manager Review
              </h1>
              <p className="text-gray-500 mt-1">
                Financial Year {financialYear}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabOrder.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-red-300"
                    }`}
                >
                  {tabLabels[tab]}
                </button>
              ))}
            </nav>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6 flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Progress:</span>
              <div className="flex gap-1">
                {tabOrder.map((tab, index) => (
                  <div
                    key={tab}
                    className={`h-2 w-8 rounded-full transition-all ${tabOrder.indexOf(activeTab) >= index
                        ? "bg-red-500"
                        : "bg-gray-300"
                      }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                Step {tabOrder.indexOf(activeTab) + 1} of {tabOrder.length}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Current: {tabLabels[activeTab]}
            </div>
          </div>

          {/* Employee Info Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-red-600 px-6 py-4">
              <h2 className="text-white font-semibold text-lg">
                Employee Information
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-6 flex-wrap">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-red-500 text-2xl" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Employee Name</p>
                    <p className="font-medium text-gray-800">
                      {getEmployeeFullName(employeeData)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Employee ID</p>
                    <p className="font-medium text-gray-800">
                      {employeeData?.empCode || empId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Designation</p>
                    <p className="font-medium text-gray-800">
                      {employeeData?.designationResDTO?.designationName ||
                        employeeData?.designationName ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Department</p>
                    <p className="font-medium text-gray-800">
                      {employeeData?.mainDeptResDTO?.mainDepartment ||
                        employeeData?.mainDepartment ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Sub Department</p>
                    <p className="font-medium text-gray-800">
                      {employeeData?.subDeptResDTO?.subDept || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Reporting Manager
                    </p>
                    <p className="font-medium text-gray-800">
                      {employeeData?.reportingManager ||
                        getManagerFullName(managerData) ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Review Year</p>
                    <p className="font-medium text-gray-800">{financialYear}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "accomplishments" && (
            <div className="space-y-6">
              {/* Employee's Key Accomplishment */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-red-600 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-white" />
                    <h2 className="text-white font-semibold text-lg">
                      Employee's Key Accomplishments
                    </h2>
                  </div>
                  <p className="text-red-100 text-sm mt-1">
                    Self-reported accomplishments by the employee
                  </p>
                </div>
                <div className="p-6">
                  {keyAccomplishment ? (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: keyAccomplishment }}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <FaInfoCircle className="text-gray-300 text-5xl mx-auto mb-3" />
                      <p className="text-gray-500">
                        No key accomplishments have been submitted by the
                        employee yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* POSH Document Section */}
              {docData?.poshDocId && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-red-600 px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-white" />
                      <h2 className="text-white font-semibold text-lg">
                        POSH Training Certificate
                      </h2>
                    </div>
                    <p className="text-red-100 text-sm mt-1">
                      POSH completion certificate uploaded by the employee
                    </p>
                  </div>
                  <div className="p-6">
                    <div
                      onClick={() => openDocument(docData.poshDocId)}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FaFilePdf className="text-red-500 text-3xl" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            POSH Completion Certificate
                          </p>
                          <p className="text-xs text-gray-400">
                            Click to view document
                          </p>
                        </div>
                      </div>
                      <FaEye className="text-gray-400 hover:text-red-500 transition-colors" />
                    </div>
                  </div>
                </div>
              )}

              {/* Certifications Section */}
              {certifications.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-red-600 px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FaAward className="text-white" />
                      <h2 className="text-white font-semibold text-lg">
                        Certifications & Achievements
                      </h2>
                    </div>
                    <p className="text-red-100 text-sm mt-1">
                      Certifications completed by the employee
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {certifications.map((cert, idx) => (
                        <div
                          key={idx}
                          onClick={() =>
                            cert.certificateDocId &&
                            openDocument(cert.certificateDocId)
                          }
                          className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${cert.certificateDocId
                              ? "bg-gray-50 border-gray-200 cursor-pointer hover:bg-gray-100"
                              : "bg-gray-50 border-gray-200"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            {cert.fileName?.toLowerCase().endsWith(".pdf") ? (
                              <FaFilePdf className="text-red-500 text-2xl" />
                            ) : cert.fileName
                              ?.toLowerCase()
                              .endsWith(".xlsx") ||
                              cert.fileName?.toLowerCase().endsWith(".xls") ? (
                              <FaFileExcel className="text-green-600 text-2xl" />
                            ) : cert.fileName?.toLowerCase().endsWith(".doc") ||
                              cert.fileName?.toLowerCase().endsWith(".docx") ? (
                              <FaFileWord className="text-blue-600 text-2xl" />
                            ) : (
                              <FaFileImage className="text-purple-500 text-2xl" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {cert.name || cert.fileName || "Certificate"}
                              </p>
                              {cert.type && (
                                <p className="text-xs text-gray-500">
                                  {cert.type}
                                </p>
                              )}
                              {cert.certificateDocId && (
                                <p className="text-xs text-blue-500 mt-1">
                                  Click to view document
                                </p>
                              )}
                            </div>
                          </div>
                          {cert.certificateDocId && (
                            <FaEye className="text-gray-400 hover:text-red-500 transition-colors" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "managerRemarks" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-red-600 px-6 py-4">
                <div className="flex items-center gap-2">
                  <FaUserTie className="text-white" />
                  <h2 className="text-white font-semibold text-lg">
                    Manager's Remarks
                  </h2>
                </div>
                <p className="text-red-100 text-sm mt-1">
                  Provide your detailed assessment and feedback
                </p>
              </div>
              <div className="p-6">
                <textarea
                  value={managerRemarks}
                  onChange={(e) => setManagerRemarks(e.target.value)}
                  rows={8}
                  placeholder="Enter your detailed remarks about the employee's performance, achievements, areas of improvement, and overall assessment..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-red-500 focus:border-red-500 resize-none ${validationErrors.managerRemarks
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                    }`}
                />
                {validationErrors.managerRemarks && (
                  <p className="mt-2 text-sm text-red-600">
                    Manager's remarks are required before proceeding.
                  </p>
                )}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Tips for effective remarks:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Highlight specific achievements and contributions</li>
                    <li>
                      Mention areas of strength and opportunities for growth
                    </li>
                    <li>Provide constructive feedback for development</li>
                    <li>Align remarks with the ratings provided</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "talentmatrix" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-red-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <FaChartLine className="text-white" />
                      <h2 className="text-white font-semibold text-lg">
                        Talent Assessment
                      </h2>
                    </div>

                    <p className="text-red-100 text-sm mt-1">
                      While evaluating a team member, upon selecting the
                      "Achievement Level", "Potential", and "Performance" –
                      Pre-determined "Talent Status" will automatically
                      populate.
                    </p>
                    <p className="text-red-100 text-sm mt-1">
                      In case you wish to modify the selected "Achievement
                      Level", please click on the "Reset" button.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={resetPotentialAndPerformance}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-white text-red-600 rounded-md border border-red-200 hover:bg-red-50 transition-colors"
                      title="Reset Potential and Performance values"
                    >
                      <FaUndoAlt size={12} />
                      <span>Reset</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGridInfo(true)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-white text-red-600 rounded-md border border-red-200 hover:bg-red-50 transition-colors"
                    >
                      <FaInfoCircle size={12} />
                      <span>View Grid Guide</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Achievement Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={achievementLevel}
                      onChange={(e) =>
                        handleAchievementLevelChange(e.target.value)
                      }
                      className={`w-full p-2.5 border rounded-lg focus:ring-red-500 focus:border-red-500 ${validationErrors.achievementLevel
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                        }`}
                    >
                      <option value="">Select Achievement Level</option>
                      {achievementLevelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.achievementLevel && (
                      <p className="mt-1 text-xs text-red-600">Required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Potential <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={potential}
                      onChange={(e) => handlePotentialChange(e.target.value)}
                      className={`w-full p-2.5 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white ${validationErrors.potential
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                        }`}
                      disabled={!achievementLevel}
                    >
                      <option value="">Select Potential</option>
                      {availablePotentialOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.potential && (
                      <p className="mt-1 text-xs text-red-600">Required</p>
                    )}
                    {getPotentialHelperText() && (
                      <p className="mt-1 text-xs text-blue-600">
                        {getPotentialHelperText()}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Performance <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={performance}
                      onChange={(e) => handlePerformanceChange(e.target.value)}
                      className={`w-full p-2.5 border rounded-lg focus:ring-red-500 focus:border-red-500 bg-white ${validationErrors.performance
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                        }`}
                      disabled={!achievementLevel}
                    >
                      <option value="">Select Performance</option>
                      {availablePerformanceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.performance && (
                      <p className="mt-1 text-xs text-red-600">Required</p>
                    )}
                    {getPerformanceHelperText() && (
                      <p className="mt-1 text-xs text-blue-600">
                        {getPerformanceHelperText()}
                      </p>
                    )}
                  </div>
                </div>

                {/* 9-Box Grid Results - Read Only Section */}
                <div className="mt-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FaChartLine className="text-red-600" />
                      <h3 className="text-md font-semibold text-red-800">
                        9-Box Grid Assessment Results
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {matrixCategory ? (
                      <div className="bg-white/60 rounded-lg p-3 border border-red-100">
                        <p className="text-xs text-red-600 font-bold uppercase tracking-wide">
                          Talent Status
                        </p>
                        <p className="text-lg font-bold text-red-800 mt-1">
                          {matrixCategory}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white/60 rounded-lg p-3 border border-red-100">
                        <p className="text-xs text-red-600 font-bold uppercase tracking-wide">
                          Talent Status
                        </p>
                        <p className="text-sm text-gray-500 mt-1 italic">
                          Awaiting selection
                        </p>
                      </div>
                    )}
                    {matrixRating ? (
                      <div className="bg-white/60 rounded-lg p-3 border border-red-100">
                        <p className="text-xs text-red-600 font-bold uppercase tracking-wide">
                          Manager Rating
                        </p>
                        <div className="mt-1">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getRatingColor(
                              matrixRating,
                            )}`}
                          >
                            {matrixRating}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/60 rounded-lg p-3 border border-red-100">
                        <p className="text-xs text-red-600 font-bold uppercase tracking-wide">
                          Manager Rating
                        </p>
                        <p className="text-sm text-gray-500 mt-1 italic">
                          Awaiting selection
                        </p>
                      </div>
                    )}
                    {matrixRatingDescription ? (
                      <div className="bg-white/60 rounded-lg p-3 border border-red-100">
                        <p className="text-xs text-red-600 font-bold uppercase tracking-wide">
                          Rating Description
                        </p>
                        <p className="font-medium text-gray-800 mt-1 text-sm">
                          {matrixRatingDescription}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white/60 rounded-lg p-3 border border-red-100">
                        <p className="text-xs text-red-600 font-bold uppercase tracking-wide">
                          Rating Description
                        </p>
                        <p className="text-sm text-gray-500 mt-1 italic">
                          Awaiting selection
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-red-600 mt-3 italic">
                    * Talent Status, Manager Rating, and Rating Description are
                    automatically populated based on Achievement Level,
                    Potential, and Performance selections and cannot be edited
                    manually.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between gap-3 border-t border-gray-200 pt-6">
            <button
              onClick={goToPreviousTab}
              disabled={tabOrder.indexOf(activeTab) === 0}
              className={`px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${tabOrder.indexOf(activeTab) === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
                }`}
            >
              <FaArrowLeftIcon size={14} />
              Previous
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !isFormModified()}
                className={`px-6 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 ${saving || !isFormModified() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                Save Draft
              </button>

              {tabOrder.indexOf(activeTab) === tabOrder.length - 1 ? (
                <button
                  onClick={handleSubmitToEmployee}
                  disabled={submitting || !isSubmitEnabled}
                  className={`px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 ${isSubmitEnabled
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                >
                  {submitting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane />
                  )}
                  Submit to Employee
                </button>
              ) : (
                <button
                  onClick={goToNextTab}
                  disabled={!canProceedToNext()}
                  className={`px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${canProceedToNext()
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Next
                  <FaArrowRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Validation Summary - Show on last tab only */}
          {activeTab === "talentmatrix" && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 flex items-center gap-2 flex-wrap">
                <FaExclamationTriangle className="text-red-500" />
                <strong>Required fields to complete:</strong>
                {!managerRemarks.trim() && (
                  <span className="ml-1">• Manager's Remarks</span>
                )}
                {!achievementLevel && (
                  <span className="ml-1">• Achievement Level</span>
                )}
                {!potential && <span className="ml-1">• Potential</span>}
                {!performance && <span className="ml-1">• Performance</span>}
                {achievementLevel &&
                  potential &&
                  performance &&
                  !matrixRating && (
                    <span className="ml-1">
                      • Rating will auto-populate once all selections are made
                    </span>
                  )}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-200 pt-6"></div>
        </div>

        {/* Custom Modal */}
        <CustomModal
          isOpen={modal.isOpen}
          onClose={closeModal}
          onConfirm={handleModalConfirm}
          title={modal.title}
          message={modal.message}
          type={modal.type}
        />

        {/* 9-Box Grid Info Modal */}
        <NineBoxGridInfoModal
          isOpen={showGridInfo}
          onClose={() => setShowGridInfo(false)}
        />

        <style>{`
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

          /* Rich text content styling */
          .prose {
            font-family: inherit;
            line-height: 1.6;
          }
          .prose p {
            margin-bottom: 1rem;
          }
          .prose ul,
          .prose ol {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
          }
          .prose h1,
          .prose h2,
          .prose h3 {
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            font-weight: 600;
          }
          .prose strong {
            font-weight: 700;
          }
          .prose em {
            font-style: italic;
          }
        `}</style>
      </div>
    </>
  );
};

export default ManagerAnnualReview;