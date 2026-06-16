import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../../../components/Header";
import axios from "axios";
import {
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaUserTie,
  FaStar,
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaAward,
  FaChartLine,
  FaFileAlt,
  FaSave,
  FaPaperPlane,
  FaExclamationTriangle,
  FaPlus,
  FaTrash,
  FaCheckSquare,
  FaSquare,
  FaUpload,
  FaDownload,
  FaUserCheck,
  FaInfoCircle,
  FaPercent,
  FaBullseye,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaQuoteRight,
  FaShieldAlt,
  FaFilePdf,
  FaFileExcel,
  FaFileWord,
  FaFileImage,
  FaRedo,
} from "react-icons/fa";
import { FiPlus, FiMinus, FiEye, FiEdit, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP, DOC_URL } from "../../services/api";
import { simpleEncrypt } from "../../../simpleEncrypt";
import { BASE_URL } from "../../../config/Config";
import { createPortal } from "react-dom";
import LoadingAnimation from "../../components/common/LoadingAnimation";

const employeeCode = localStorage.getItem('empId');

const LoadingOverlay = ({ message = "" }) => {
  const getLoadingText = () => {
    const msg = message.toLowerCase();
    
    if (msg.includes("saving") || msg.includes("draft")) {
      return "Saving Draft...";
    } else if (msg.includes("submitting")) {
      return "Submitting Annual Review...";
    } else if (msg.includes("loading") && msg.includes("review")) {
      return "Loading Review Data...";
    } else if (msg.includes("uploading")) {
      return "Uploading Document...";
    }
    
    return message || "Processing...";
  };

  return <LoadingAnimation message={getLoadingText()} />;
};

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "blockquote",
    "code-block",
    "color",
    "background",
    "link",
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="min-h-[300px] custom-quill"
      />
    </div>
  );
};

// Custom Modal Component
const CustomModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  type = "info",
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />;
      case "error":
        return <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />;
      case "warning":
        return <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />;
      default:
        return <FaInfoCircle className="text-red-500 text-5xl mx-auto mb-4" />;
    }
  };

  const handleSuccessClose = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
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
            {type !== "success" && onConfirm && (
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
              <button
                onClick={handleSuccessClose}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "FINAL_SUBMITTED_TO_HR":
      case "SUBMITTED_TO_HR":
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
          icon: <FaUserCheck size={12} className="mr-1" />,
        };
      case "SELF_REVIEWED":
        return {
          text: "Self Reviewed",
          color: "bg-blue-100 text-blue-700",
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
          icon: <FaExclamationTriangle size={12} className="mr-1" />,
        };
      case "DRAFT":
        return {
          text: "Draft",
          color: "bg-gray-100 text-gray-700",
          icon: <FaFileAlt size={12} className="mr-1" />,
        };
      default:
        return {
          text: "Not Started",
          color: "bg-gray-100 text-gray-500",
          icon: <FaClock size={12} className="mr-1" />,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {config.text}
    </span>
  );
};

// Function to strip HTML tags for validation
const stripHtml = (html) => {
  if (!html) return "";
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
};

// Function to open document
const openDocument = async (docId, toast) => {
  if (!docId) {
    toast?.error("Document ID not found");
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
    toast?.error("Unable to open document");
  }
};

// Document Viewer Component
const DocumentViewer = ({ docId, fileName, toast, onReupload }) => {
  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFileAlt className="text-gray-500 text-2xl" />;
    const ext = fileName.toLowerCase().split(".").pop();
    if (ext === "pdf") return <FaFilePdf className="text-red-500 text-2xl" />;
    if (ext === "xlsx" || ext === "xls") return <FaFileExcel className="text-green-600 text-2xl" />;
    if (ext === "docx" || ext === "doc") return <FaFileWord className="text-blue-600 text-2xl" />;
    if (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif") return <FaFileImage className="text-purple-500 text-2xl" />;
    return <FaFileAlt className="text-gray-500 text-2xl" />;
  };

  const fileInputRef = useRef(null);

  const handleReuploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onReupload) {
      onReupload(file);
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          onClick={() => openDocument(docId, toast)}
          className="flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow flex-1"
        >
          {getFileIcon(fileName)}
          <div>
            <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]" title={fileName}>
              {fileName || "Document"}
            </p>
          </div>
        </div>
        {onReupload && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <button
              onClick={handleReuploadClick}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
            >
              <FaRedo size={12} />
              Reupload
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Helper function to get employee full name
const getEmployeeFullName = (employeeData) => {
  if (!employeeData) return "Employee Name";
  if (employeeData.fullNameAsAadhaar && employeeData.fullNameAsAadhaar.trim() !== "") {
    return employeeData.fullNameAsAadhaar.trim();
  }
  return employeeData.fullName || employeeData.employeeName || "Employee Name";
};

const EmployeeAnnualReview = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const yearParam = queryParams.get("year");
  const isEditMode = queryParams.get("edit") === "true";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [managerId, setManagerId] = useState(null);
  const [existingReviewId, setExistingReviewId] = useState(null);
  const [existingReviewStatus, setExistingReviewStatus] = useState(null);

  const [keyAccomplishment, setKeyAccomplishment] = useState("");

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const customToast = {
    success: (msg) => triggerNotification(msg, "success"),
    error: (msg) => triggerNotification(msg, "error"),
    info: (msg) => triggerNotification(msg, "info"),
    warning: (msg) => triggerNotification(msg, "warning"),
  };

  const [poshCertification, setPoshCertification] = useState({
    file: null,
    fileName: null,
    uploaded: false,
    existingDocId: null,
    existingFileName: null,
    isReplaced: false,
  });

  const [certifications, setCertifications] = useState([]);
  const [initialState, setInitialState] = useState({
    keyAccomplishment: "",
    useNAOption: false,
    poshCertification: { existingDocId: null, existingFileName: null },
    certifications: [],
  });
  const [isDraft, setIsDraft] = useState(false);
  const [useNAOption, setUseNAOption] = useState(false);

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const [selectedYear, setSelectedYear] = useState(
    yearParam || new Date().getFullYear().toString(),
  );

  const financialYear = `${selectedYear}-${parseInt(selectedYear) + 1}`;
  const isFY2025_2026 = financialYear === "2025-2026";

  const [quarterlyGoals, setQuarterlyGoals] = useState({
    Q1: { weightage: 0, selfAssessment: 0, managerAssessment: 0, status: "", submittedDate: null, goals: [] },
    Q2: { weightage: 0, selfAssessment: 0, managerAssessment: 0, status: "", submittedDate: null, goals: [] },
    Q3: { weightage: 0, selfAssessment: 0, managerAssessment: 0, status: "", submittedDate: null, goals: [] },
    Q4: { weightage: 0, selfAssessment: 0, managerAssessment: 0, status: "", submittedDate: null, goals: [] },
  });

  useEffect(() => {
    const initialize = async () => {
      await fetchEmployeeDetails();
      if (!isFY2025_2026) {
        await fetchAllQuarterlyGoals();
      }
      await fetchExistingAnnualReview();
    };
    initialize();
  }, [empId, selectedYear]);

  const showModal = (title, message, type = "info", onConfirm = null) => {
    setModal({ isOpen: true, title, message, type, onConfirm });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      title: "",
      message: "",
      type: "info",
      onConfirm: null,
    });
  };

  const fetchEmployeeDetails = async () => {
    try {
      const storedEmpCode = localStorage.getItem('empId');
      console.log("Fetching employee details for code:", storedEmpCode);
      
      if (!storedEmpCode) {
        console.error("No employee code found in localStorage");
        return;
      }
      
      const response = await axios.get(`${BASE_URL_EPMS_EMP}/${storedEmpCode}`);
      console.log("Employee API Response:", response.data);
      
      let employee = null;
      
      if (Array.isArray(response.data)) {
        employee = response.data.find(
          (emp) => emp.empCode?.toString() === storedEmpCode?.toString()
        );
      } else if (response.data && typeof response.data === 'object') {
        employee = response.data;
      }
      
      if (employee) {
        console.log("Found employee:", employee);
        setEmployeeData(employee);
        
        const managerIdValue = employee.reportingManagerEmailId || 
                               employee.managerEmailId || 
                               employee.reportingManager ||
                               employee.managerId;
        
        if (managerIdValue) {
          setManagerId(managerIdValue);
          console.log("Manager ID set to:", managerIdValue);
        } else {
          console.warn("No manager information found in employee data:", employee);
        }
      } else {
        console.error("Employee not found for code:", storedEmpCode);
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
    }
  };

  const fetchExistingAnnualReview = async () => {
    try {
      setLoading(true);
      const url = `${BASE_URL_EPMS}/api/annual-review/${empId}/${selectedYear}`;
      console.log("Fetching existing annual review from:", url);

      const response = await axios.get(url);
      console.log("Existing annual review response:", response.data);

      if (response.data && response.data.id) {
        const reviewData = response.data;
        setExistingReviewId(reviewData.id);
        setExistingReviewStatus(reviewData.status);
        setKeyAccomplishment(reviewData.keyAccomplishment || "");
        setUseNAOption(reviewData.useNAOption || false);

        if (reviewData.managerId) {
          setManagerId(reviewData.managerId);
        }

        let loadedCerts = [];
        if (reviewData.certifications && reviewData.certifications.length > 0) {
          const certsWithFiles = reviewData.certifications.map((cert, index) => ({
            id: cert.id,
            tempId: cert.id || `existing-${index}-${Date.now()}-${Math.random()}`,
            name: cert.name || "",
            type: cert.type || "",
            file: null,
            fileName: cert.fileName || cert.name,
            existingDocId: cert.certificateDocId,
            existingFileName: cert.fileName || cert.name,
            isReplaced: false,
          }));
          setCertifications(certsWithFiles);
          loadedCerts = certsWithFiles;
        } else {
          setCertifications([]);
        }

        const isActuallySubmitted = 
          reviewData.status !== "DRAFT" || 
          reviewData.submittedAt || 
          reviewData.managerRemarks || 
          reviewData.achievementLevel || 
          reviewData.potential || 
          reviewData.performance;

        if (isActuallySubmitted) {
          showModal(
            "Cannot Edit",
            `This annual review has already been submitted and cannot be edited. You can only view it.`,
            "warning",
            () => navigate(`/employee/annual-review/preview/${empId}?year=${selectedYear}`),
          );
          setLoading(false);
          return;
        }

        let loadedPosh = { existingDocId: null, existingFileName: null };
        if (reviewData.id) {
          const poshInfo = await fetchExistingDocuments(reviewData.id);
          if (poshInfo) {
            loadedPosh = {
              existingDocId: poshInfo.existingDocId,
              existingFileName: poshInfo.existingFileName,
            };
          }
        }

        setInitialState({
          keyAccomplishment: reviewData.keyAccomplishment || "",
          useNAOption: reviewData.useNAOption || false,
          poshCertification: loadedPosh,
          certifications: loadedCerts.map(c => ({
            id: c.id,
            name: c.name || "",
            type: c.type || "",
            existingDocId: c.existingDocId || null,
          })),
        });
      } else {
        await fetchSavedDraft();
      }
    } catch (error) {
      console.log("Error fetching existing annual review:", error.response?.status);
      await fetchSavedDraft();
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingDocuments = async (reviewId) => {
    try {
      console.log("Fetching documents for review ID:", reviewId);
      const docResponse = await axios.get(`${BASE_URL_EPMS}/api/annual-review/all/${reviewId}`);
      console.log("Documents response:", docResponse.data);

      if (docResponse.data?.success && docResponse.data?.data) {
        const docData = docResponse.data.data;
        if (docData.poshDocId) {
          const info = {
            file: null,
            fileName: docData.poshFileName || "POSH Certificate",
            uploaded: true,
            existingDocId: docData.poshDocId,
            existingFileName: docData.poshFileName || "POSH Certificate",
            isReplaced: false,
          };
          setPoshCertification(info);
          return info;
        }
      } else if (docResponse.data && docResponse.data.annualReviewId) {
        const docData = docResponse.data;
        if (docData.poshDocId) {
          const info = {
            file: null,
            fileName: docData.poshFileName || "POSH Certificate",
            uploaded: true,
            existingDocId: docData.poshDocId,
            existingFileName: docData.poshFileName || "POSH Certificate",
            isReplaced: false,
          };
          setPoshCertification(info);
          return info;
        }
      }
    } catch (docErr) {
      console.error("Error fetching documents:", docErr);
    }
    return null;
  };

  const fetchSavedDraft = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL_EPMS}/api/annual-review/draft/employee/${empId}?year=${selectedYear}`,
      );
      if (response.data?.success && response.data?.data) {
        const draft = response.data.data;
        setExistingReviewId(draft.id); // Set the review ID
        setKeyAccomplishment(draft.keyAccomplishment || "");
        setUseNAOption(draft.useNAOption || false);
        setIsDraft(true);
        
        if (draft.managerId) {
          setManagerId(draft.managerId);
        }
        
        let loadedCerts = [];
        if (draft.certifications && draft.certifications.length > 0) {
          const certsWithFiles = draft.certifications.map((cert, index) => ({
            id: cert.id,
            tempId: cert.id || `draft-${index}-${Date.now()}-${Math.random()}`,
            name: cert.name || "",
            type: cert.type || "",
            file: null,
            fileName: cert.fileName || cert.name,
            existingDocId: cert.certificateDocId,
            existingFileName: cert.fileName || cert.name,
            isReplaced: false,
          }));
          setCertifications(certsWithFiles);
          loadedCerts = certsWithFiles;
        } else {
          setCertifications([]);
        }
        
        let loadedPosh = { file: null, fileName: null, uploaded: false, existingDocId: null, existingFileName: null, isReplaced: false };
        if (draft.id) {
          const poshInfo = await fetchExistingDocuments(draft.id);
          if (poshInfo) {
            loadedPosh = poshInfo;
          }
        }

        setInitialState({
          keyAccomplishment: draft.keyAccomplishment || "",
          useNAOption: draft.useNAOption || false,
          poshCertification: {
            existingDocId: loadedPosh.existingDocId,
            existingFileName: loadedPosh.existingFileName,
          },
          certifications: loadedCerts.map(c => ({
            id: c.id,
            name: c.name,
            type: c.type,
            existingDocId: c.existingDocId,
          })),
        });
      }
    } catch (error) {
      console.log("No saved draft found");
      setInitialState({
        keyAccomplishment: "",
        useNAOption: false,
        poshCertification: { existingDocId: null, existingFileName: null },
        certifications: [],
      });
    }
  };

  const fetchAllQuarterlyGoals = async () => {
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    const goalsData = { ...quarterlyGoals };

    for (const quarter of quarters) {
      try {
        const response = await axios.get(
          `${BASE_URL_EPMS}/api/goals/employee/${empId}/${quarter}?year=${selectedYear}`,
        );

        let goals = [];
        if (response.data?.data) {
          goals = response.data.data;
        } else if (Array.isArray(response.data)) {
          goals = response.data;
        }

        if (goals.length > 0) {
          const totalWeightage = goals.reduce((sum, goal) => sum + (goal.weightage || 0), 0);
          const hasWeightage = goals.some((goal) => goal.weightage && goal.weightage > 0);

          let selfAssessmentScore = 0;
          let managerAssessmentScore = 0;

          if (hasWeightage) {
            selfAssessmentScore = calculateWeightedAverage(goals, "selfAssessmentScore", "weightage");
            managerAssessmentScore = calculateWeightedAverage(goals, "managerAssessmentScore", "weightage");
          } else {
            selfAssessmentScore = calculateAverage(goals, "selfAssessmentScore");
            managerAssessmentScore = calculateAverage(goals, "managerAssessmentScore");
          }

          goalsData[quarter] = {
            goals: goals,
            weightage: totalWeightage,
            selfAssessment: selfAssessmentScore,
            managerAssessment: managerAssessmentScore,
            status: goals[0]?.status || "DRAFT",
            submittedDate: goals[0]?.submittedToEmployeeAt || goals[0]?.selfReviewSubmittedDate,
          };
        } else {
          goalsData[quarter] = {
            goals: [],
            weightage: 0,
            selfAssessment: 0,
            managerAssessment: 0,
            status: "NOT_STARTED",
            submittedDate: null,
          };
        }
      } catch (error) {
        console.error(`Error fetching ${quarter} goals:`, error);
        goalsData[quarter] = {
          goals: [],
          weightage: 0,
          selfAssessment: 0,
          managerAssessment: 0,
          status: "NOT_STARTED",
          submittedDate: null,
        };
      }
    }

    setQuarterlyGoals(goalsData);
  };

  const calculateWeightedAverage = (goals, assessmentField, weightageField = "weightage") => {
    if (!goals || goals.length === 0) return 0;
    let totalWeightedScore = 0;
    let totalWeightage = 0;
    for (const goal of goals) {
      const score = goal[assessmentField] || 0;
      const weightage = goal[weightageField] || 0;
      totalWeightedScore += score * weightage;
      totalWeightage += weightage;
    }
    if (totalWeightage === 0) return 0;
    return Math.round(totalWeightedScore / totalWeightage);
  };

  const calculateAverage = (goals, assessmentField) => {
    if (!goals || goals.length === 0) return 0;
    let totalScore = 0;
    let count = 0;
    for (const goal of goals) {
      const score = goal[assessmentField];
      if (score !== null && score !== undefined && score > 0) {
        totalScore += score;
        count++;
      }
    }
    if (count === 0) return 0;
    return Math.round(totalScore / count);
  };

  const handlePoshFileUpload = (file) => {
    if (file) {
      setPoshCertification({
        file: file,
        fileName: file.name,
        uploaded: true,
        existingDocId: poshCertification.existingDocId,
        existingFileName: poshCertification.existingFileName,
        isReplaced: !!poshCertification.existingDocId,
      });
      customToast.success("POSH certificate attached successfully");
    }
  };

  const handlePoshReupload = (file) => {
    if (file) {
      setPoshCertification({
        file: file,
        fileName: file.name,
        uploaded: true,
        existingDocId: poshCertification.existingDocId,
        existingFileName: poshCertification.existingFileName,
        isReplaced: true,
      });
      customToast.success("POSH certificate attached successfully");
    }
  };

  const handleRemovePoshFile = () => {
    setPoshCertification({
      file: null,
      fileName: null,
      uploaded: false,
      existingDocId: null,
      existingFileName: null,
      isReplaced: false,
    });
  };

  const handleAddCertification = () => {
    if (certifications.length < 5) {
      setCertifications([
        ...certifications,
        {
          id: null, // IMPORTANT: Use null for new certifications
          tempId: `temp-${Date.now()}-${Math.random()}`,
          name: "",
          type: "",
          file: null,
          fileName: null,
          existingDocId: null,
          existingFileName: null,
          isReplaced: false,
        },
      ]);
    } else {
      showModal("Limit Reached", "Maximum 5 certifications allowed", "warning");
    }
  };

  const handleRemoveCertification = (tempId) => {
    setCertifications(certifications.filter((cert) => cert.tempId !== tempId));
  };

  const handleCertificationChange = (tempId, field, value) => {
    setCertifications(
      certifications.map((cert) =>
        cert.tempId === tempId ? { ...cert, [field]: value } : cert,
      ),
    );
  };

  const handleCertificationFileUpload = (tempId, file) => {
    if (file) {
      setCertifications(
        certifications.map((cert) =>
          cert.tempId === tempId
            ? {
                ...cert,
                file: file,
                fileName: file.name,
                isReplaced: !!cert.existingDocId,
              }
            : cert,
        ),
      );
      customToast.success("Certificate file attached successfully");
    }
  };

  const handleNAOptionChange = () => {
    const newValue = !useNAOption;
    setUseNAOption(newValue);
    if (newValue) {
      setCertifications([]);
    }
  };

  const validateCertificationsBeforeSubmit = () => {
    if (!poshCertification.file && !poshCertification.existingDocId) {
      showModal("Validation Error", "POSH Certificate is mandatory. Please upload your POSH certificate.", "error");
      return false;
    }

    if (useNAOption) {
      return true;
    }

    if (certifications.length === 0) {
      showModal("Validation Error", "Please either add at least one certification or select the 'NA' option.", "error");
      return false;
    }

    for (let i = 0; i < certifications.length; i++) {
      const cert = certifications[i];
      if (!cert.name || !cert.name.trim()) {
        showModal("Validation Error", `Certification ${i + 1}: Please enter certification name.`, "error");
        return false;
      }
      if (!cert.type) {
        showModal("Validation Error", `Certification ${i + 1}: Please select certification type.`, "error");
        return false;
      }
      if (!cert.file && !cert.existingDocId) {
        showModal("Validation Error", `Certification ${i + 1}: Please upload the certificate file.`, "error");
        return false;
      }
    }

    return true;
  };

  const handleSaveDraft = async () => {
    if (savingDraft || submitting) return;
    
    if (!managerId) {
      showModal("Error", "Manager ID not found. Please ensure you have a reporting manager assigned.", "error");
      return;
    }

    try {
      setSavingDraft(true);
      const formData = new FormData();

      const certificationsToKeep = !useNAOption
        ? certifications.filter((cert) => cert.name?.trim() && cert.type?.trim())
        : [];

      const certificationsWithFiles = certificationsToKeep.filter((cert) => cert.file !== null);

      const dto = {
        employeeId: empId,
        managerId: managerId,
        financialYear: financialYear,
        keyAccomplishment: keyAccomplishment,
        useNAOption: useNAOption,
        certifications: certificationsWithFiles.map((cert) => ({
          id: cert.existingDocId && !cert.isReplaced ? cert.existingDocId : (cert.id || null),
          name: cert.name.trim(),
          type: cert.type,
        })),
        replacePoshDocId: poshCertification.isReplaced ? poshCertification.existingDocId : undefined,
      };

      if (existingReviewId) {
        dto.id = existingReviewId;
      }

      formData.append(
        "dto",
        new Blob([JSON.stringify(dto)], { type: "application/json" }),
      );

      if (poshCertification.file) {
        formData.append("poshCertificate", poshCertification.file);
      }

      certificationsWithFiles.forEach((cert) => {
        formData.append("certificateFiles", cert.file);
      });

      const url = existingReviewId
        ? `${BASE_URL_EPMS}/api/annual-review/update/${existingReviewId}`
        : `${BASE_URL_EPMS}/api/annual-review/draft/save`;

      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showModal("Success", "Draft saved successfully!", "success", () => {
        navigate("/EmployeeAppraisal?type=annual");
      });
      setIsDraft(true);
      setError(null);
    } catch (err) {
      console.error("Error saving draft:", err);
      showModal("Error", err.response?.data?.message || "Failed to save draft", "error");
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmitToR1 = async () => {
    if (submitting || savingDraft) return;

    const plainText = stripHtml(keyAccomplishment);

    if (!plainText || plainText.trim() === "") {
      showModal("Validation Error", "Please enter your key accomplishments before submitting.", "error");
      return;
    }

    if (!managerId) {
      showModal("Error", "Manager ID not found. Please ensure you have a reporting manager assigned.", "error");
      return;
    }

    if (!validateCertificationsBeforeSubmit()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let response;

      if (existingReviewId) {
        // First, update the draft with any unsaved changes (new certifications, files, achievements, etc.)
        const formData = new FormData();

        const certificationsToKeep = !useNAOption
          ? certifications.filter((cert) => cert.name?.trim() && cert.type?.trim())
          : [];

        const certificationsWithFiles = certificationsToKeep.filter((cert) => cert.file !== null);

        const dto = {
          id: existingReviewId,
          employeeId: empId,
          managerId: managerId,
          financialYear: financialYear,
          keyAccomplishment: keyAccomplishment,
          useNAOption: useNAOption,
          certifications: certificationsWithFiles.map((cert) => ({
            id: cert.existingDocId && !cert.isReplaced ? cert.existingDocId : (cert.id || null),
            name: cert.name.trim(),
            type: cert.type,
          })),
          replacePoshDocId: poshCertification.isReplaced ? poshCertification.existingDocId : undefined,
        };

        formData.append(
          "dto",
          new Blob([JSON.stringify(dto)], { type: "application/json" }),
        );

        if (poshCertification.file) {
          formData.append("poshCertificate", poshCertification.file);
        }

        certificationsWithFiles.forEach((cert) => {
          formData.append("certificateFiles", cert.file);
        });

        console.log("Updating draft before submission...");
        await axios.post(`${BASE_URL_EPMS}/api/annual-review/update/${existingReviewId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // After draft is updated, perform the submit transition
        const submitDto = { id: existingReviewId };
        console.log("Submitting existing review:", submitDto);
        response = await axios.post(`${BASE_URL_EPMS}/api/annual-review/update-and-submit`, submitDto);
      } else {
        // For new reviews, use multipart form data
        const formData = new FormData();

        const certificationsToKeep = !useNAOption
          ? certifications.filter((cert) => cert.name?.trim() && cert.type?.trim())
          : [];

        const certificationsWithFiles = certificationsToKeep.filter((cert) => cert.file !== null);

        const dto = {
          employeeId: empId,
          managerId: managerId,
          financialYear: financialYear,
          keyAccomplishment: keyAccomplishment,
          useNAOption: useNAOption,
          certifications: certificationsWithFiles.map((cert) => ({
            id: cert.existingDocId && !cert.isReplaced ? cert.existingDocId : (cert.id || null),
            name: cert.name.trim(),
            type: cert.type,
          })),
          replacePoshDocId: undefined,
        };

        formData.append(
          "dto",
          new Blob([JSON.stringify(dto)], { type: "application/json" }),
        );

        if (poshCertification.file) {
          formData.append("poshCertificate", poshCertification.file);
        } else if (!poshCertification.existingDocId) {
          showModal("Validation Error", "POSH certificate is required for new submission.", "error");
          setSubmitting(false);
          return;
        }

        certificationsWithFiles.forEach((cert) => {
          formData.append("certificateFiles", cert.file);
        });

        console.log("Submitting new review with files");
        response = await axios.post(`${BASE_URL_EPMS}/api/annual-review/submit`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      console.log("Submit response:", response.data);
      showModal("Success", "Annual review submitted to R1 successfully!", "success", () => {
        navigate("/EmployeeAppraisal?type=annual");
      });
    } catch (err) {
      console.error("Submit failed:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to submit annual review";
      showModal("Error", errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateOverallProgress = () => {
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    const completedQuarters = quarters.filter(
      (q) => quarterlyGoals[q].status !== "NOT_STARTED" && quarterlyGoals[q].status !== "DRAFT",
    ).length;
    return Math.round((completedQuarters / 4) * 100);
  };

  const isFormModified = () => {
    if (keyAccomplishment !== initialState.keyAccomplishment) return true;
    if (useNAOption !== initialState.useNAOption) return true;
    if (poshCertification.file !== null) return true;
    if (poshCertification.existingDocId !== (initialState.poshCertification?.existingDocId || null)) return true;

    if (certifications.length !== initialState.certifications.length) return true;

    for (let i = 0; i < certifications.length; i++) {
      const current = certifications[i];
      const initial = initialState.certifications[i];

      if (!initial) return true;
      if (current.id !== initial.id) return true;
      if (current.name !== initial.name) return true;
      if (current.type !== initial.type) return true;
      if (current.file !== null) return true;
    }

    return false;
  };

  const isFormComplete = () => {
    const plainText = stripHtml(keyAccomplishment).trim();
    if (!plainText) return false;

    if (!poshCertification.file && !poshCertification.existingDocId) return false;

    if (useNAOption) {
      return true;
    }

    if (certifications.length === 0) return false;

    for (let i = 0; i < certifications.length; i++) {
      const cert = certifications[i];
      if (!cert.name || !cert.name.trim()) return false;
      if (!cert.type) return false;
      if (!cert.file && !cert.existingDocId) return false;
    }

    return true;
  };

  const isAnyActionInProgress = loading || submitting || savingDraft;

  if (loading) {
    return (
      <>
        <Header />
        <LoadingOverlay message="Loading annual review data..." />
      </>
    );
  }

  const overallProgress = calculateOverallProgress();

  return (
    <>
      {/* Custom Notification Toast */}
      {notification.show && createPortal(
        <div className="fixed top-5 right-5 z-[9999] animate-slideIn">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md transition-all ${
            notification.type === "success" ? "bg-green-50/90 border-green-200 text-green-800" :
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
      
      {(submitting || savingDraft) && (
        <LoadingOverlay message={submitting ? "Submitting annual review..." : "Saving draft..."} />
      )}
      
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />

        <div className="mt-20 px-4 md:px-8 max-w-7xl mx-auto w-full pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm mb-6 mt-4">
            <button
              onClick={() => navigate(-1)}
              disabled={isAnyActionInProgress}
              className={`flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors mr-4 font-medium ${
                isAnyActionInProgress ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiArrowLeft size={16} />
              Back
            </button>
            <span className="text-gray-400">/</span>
            <span
              onClick={() => !isAnyActionInProgress && navigate("/dashboard")}
              className={`cursor-pointer text-gray-600 hover:text-red-500 transition-colors ml-2 ${
                isAnyActionInProgress ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Home
            </span>
            <span className="mx-2 text-gray-400">/</span>
            <span
              onClick={() => !isAnyActionInProgress && navigate("/EmployeeAppraisal")}
              className={`cursor-pointer text-gray-600 hover:text-red-500 transition-colors ${
                isAnyActionInProgress ? "pointer-events-none opacity-50" : ""
              }`}
            >
              My Appraisal
            </span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-semibold text-red-600">
              {isEditMode ? "Edit Annual Review" : "Annual Performance Review"}
            </span>
          </nav>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaFileAlt className="text-red-500" />
              {isEditMode ? "Edit Annual Performance Review" : "Annual Performance Review"}
            </h1>
            <p className="text-gray-500 mt-1 ml-7">
              Financial Year {financialYear}
              {isEditMode && existingReviewId && existingReviewStatus === "DRAFT" && " (Editing Draft)"}
            </p>
          </div>

          {/* Employee Information Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-6">
            <div className="bg-red-600 px-6 py-3">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <FaUser />
                Employee Information
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-red-500 text-3xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {getEmployeeFullName(employeeData)}
                  </h3>
                  <p className="text-gray-500">{employeeData?.designationName || "Designation"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaBuilding className="text-gray-400 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500">Employee Code</p>
                    <p className="font-semibold text-gray-800">{empId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaUserTie className="text-gray-400 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500">Manager Name</p>
                    <p className="font-semibold text-gray-800">{employeeData?.reportingManager || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaCalendarAlt className="text-gray-400 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500">Financial Year</p>
                    <p className="font-semibold text-gray-800">{financialYear}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quarterly Goals Summary - Only for non-FY2025-2026 */}
          {!isFY2025_2026 && (
            <>
              <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-6">
                <div className="bg-gray-800 px-6 py-4">
                  <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                    <FaBullseye />
                    Quarterly Goals Summary
                  </h2>
                  <p className="text-gray-300 text-sm mt-1">Overall assessment from all quarters</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quarter</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Weightage</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Self Assessment</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Manager Assessment</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {["Q1", "Q2", "Q3", "Q4"].map((quarter) => {
                        const data = quarterlyGoals[quarter];
                        const isNotStarted = data.status === "NOT_STARTED";
                        const hasWeightage = data.weightage > 0;
                        const hasSelfAssessment = data.selfAssessment > 0;
                        const hasManagerAssessment = data.managerAssessment > 0;

                        return (
                          <tr key={quarter} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                quarter === "Q1" ? "bg-green-100 text-green-700" :
                                quarter === "Q2" ? "bg-blue-100 text-blue-700" :
                                quarter === "Q3" ? "bg-yellow-100 text-yellow-700" :
                                "bg-red-100 text-red-700"
                              }`}>
                                {quarter}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {hasWeightage ? <span className="font-medium text-gray-700">{data.weightage}%</span> :
                                <span className="text-gray-400 text-sm">Not assessed</span>}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {hasSelfAssessment ? (
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  data.selfAssessment >= 80 ? "bg-green-100 text-green-700" :
                                  data.selfAssessment >= 60 ? "bg-yellow-100 text-yellow-700" :
                                  "bg-orange-100 text-orange-700"
                                }`}>
                                  {data.selfAssessment}
                                </span>
                              ) : <span className="text-gray-400 text-sm">Not assessed</span>}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {hasManagerAssessment ? (
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  data.managerAssessment >= 80 ? "bg-green-100 text-green-700" :
                                  data.managerAssessment >= 60 ? "bg-yellow-100 text-yellow-700" :
                                  "bg-orange-100 text-orange-700"
                                }`}>
                                  {data.managerAssessment}
                                </span>
                              ) : <span className="text-gray-400 text-sm">Not assessed</span>}
                            </td>
                            <td className="px-6 py-4">
                              {isNotStarted ? <span className="text-gray-400 text-sm">Not started</span> :
                                <div className="flex flex-col gap-1">
                                  <StatusBadge status={data.status} />
                                  {data.submittedDate && <span className="text-xs text-gray-400">{formatDateTime(data.submittedDate)}</span>}
                                </div>
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Overall Progress Bar */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-6">
                <div className="px-6 py-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">Overall Annual Review Progress</span>
                    <span className="text-sm font-bold text-red-600">{overallProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-red-600 h-3 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {overallProgress === 100 ? "All quarters completed!" : `${4 - overallProgress / 25} quarters remaining for completion`}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Employee's Section - Key Accomplishments */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                <FaFileAlt />
                Employee Section
              </h2>
              <p className="text-red-100 text-sm mt-1">Key Accomplishments for the financial year</p>
            </div>

            <div className="p-6">
              {/* Key Accomplishments */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Key Accomplishments <span className="text-red-500">*</span>
                  </label>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <FaInfoCircle size={12} />
                    <span>Rich text supported</span>
                  </div>
                </div>
                <div className="relative">
                  <RichTextEditor
                    value={keyAccomplishment}
                    onChange={setKeyAccomplishment}
                    placeholder="Describe your key accomplishments for the financial year in detail..."
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
                    {stripHtml(keyAccomplishment).length} characters
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Summarize your key achievements, completed projects, and contributions during this financial year.
                </p>
              </div>

              {/* POSH Certification */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <FaShieldAlt className="text-red-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Compliance Check: POSH Certificate <span className="text-red-600">*</span>
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        Please upload your POSH (Prevention of Sexual Harassment) compliance certificate. This is a mandatory requirement.
                      </p>

                      {poshCertification.existingDocId && !poshCertification.file && (
                        <DocumentViewer
                          docId={poshCertification.existingDocId}
                          fileName={poshCertification.existingFileName || poshCertification.fileName}
                          toast={customToast}
                          onReupload={handlePoshReupload}
                        />
                      )}

                      {poshCertification.file && (
                        <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
                          <FaCheckCircle className="text-green-500" />
                          <span className="text-sm text-gray-700 flex-1">New file ready: {poshCertification.fileName}</span>
                          <button onClick={handleRemovePoshFile} className="text-red-500 hover:text-red-700 ml-2" disabled={isAnyActionInProgress}>
                            <FaTrash size={14} />
                          </button>
                        </div>
                      )}

                      {!poshCertification.existingDocId && !poshCertification.file && (
                        <>
                          <div className="flex items-center gap-3">
                            <input type="file" onChange={(e) => handlePoshFileUpload(e.target.files[0])} className="hidden" id="posh-certificate" accept=".pdf,.jpg,.jpeg,.png" disabled={isAnyActionInProgress} />
                            <label htmlFor="posh-certificate" className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition-colors text-sm font-medium ${isAnyActionInProgress ? "opacity-50 cursor-not-allowed" : ""}`}>
                              <FaUpload size={14} />
                              Upload POSH Certificate
                            </label>
                          </div>
                          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                            <FaExclamationTriangle size={10} />
                            POSH certificate is mandatory. Please upload before submitting.
                          </p>
                        </>
                      )}

                      {poshCertification.isReplaced && (
                        <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                          <FaInfoCircle size={10} />
                          Your existing POSH certificate will be replaced with the new one upon submission.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Certifications <span className="text-red-500">*</span>
                  </label>
                </div>

                {/* NA Option */}
                <div
                  className={`mb-6 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    useNAOption ? "border-red-500 bg-red-50" : "border-gray-200 bg-white hover:border-red-300 hover:bg-red-50/30"
                  } ${isAnyActionInProgress ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => { if (!isAnyActionInProgress) handleNAOptionChange(); }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${useNAOption ? "border-red-500 bg-red-500" : "border-gray-400"}`}>
                      {useNAOption && <FaCheckCircle className="text-white text-xs" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Not Applicable (N/A)</p>
                      <p className="text-xs text-gray-500">Select this if you have no certifications to add</p>
                    </div>
                  </div>
                </div>

                {!useNAOption && (
                  <>
                    {certifications.map((cert) => (
                      <div key={cert.tempId} className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200">
                        {cert.existingDocId && !cert.file && (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Certification Type</label>
                                <p className="text-sm text-gray-800">{cert.type}</p>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Certification Name</label>
                                <p className="text-sm text-gray-800">{cert.name}</p>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Certificate</label>
                              <DocumentViewer
                                docId={cert.existingDocId}
                                fileName={cert.existingFileName || cert.fileName}
                                toast={customToast}
                                onReupload={(file) => handleCertificationFileUpload(cert.tempId, file)}
                              />
                            </div>
                            <button onClick={() => handleRemoveCertification(cert.tempId)} disabled={isAnyActionInProgress} className="mt-3 text-red-500 text-sm hover:text-red-700 transition-colors flex items-center gap-1 disabled:opacity-50">
                              <FaTrash size={12} /> Remove
                            </button>
                          </div>
                        )}

                        {((!cert.existingDocId && !cert.file) || cert.file) && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Certification Type <span className="text-red-500">*</span></label>
                                <select value={cert.type} onChange={(e) => handleCertificationChange(cert.tempId, "type", e.target.value)} disabled={isAnyActionInProgress} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm disabled:bg-gray-100">
                                  <option value="">Select Type</option>
                                  <option value="Technical">Technical</option>
                                  <option value="Soft Skills">Soft Skills</option>
                                  <option value="Management">Management</option>
                                  <option value="Domain">Domain</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Certification Name <span className="text-red-500">*</span></label>
                                <input type="text" value={cert.name} onChange={(e) => handleCertificationChange(cert.tempId, "name", e.target.value)} disabled={isAnyActionInProgress} placeholder="Enter certification name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm disabled:bg-gray-100" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Upload Certificate <span className="text-red-500">*</span></label>
                                <div className="flex items-center gap-2">
                                  <input type="file" onChange={(e) => handleCertificationFileUpload(cert.tempId, e.target.files[0])} className="hidden" id={`file-${cert.tempId}`} disabled={isAnyActionInProgress} />
                                  <label htmlFor={`file-${cert.tempId}`} className={`flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm ${isAnyActionInProgress ? "opacity-50 cursor-not-allowed" : ""}`}>
                                    <FaUpload size={12} />
                                    {cert.file ? "Reupload" : "Choose File"}
                                  </label>
                                  {cert.fileName && cert.file && <span className="text-xs text-gray-500 truncate max-w-[150px]">{cert.fileName}</span>}
                                </div>
                              </div>
                            </div>
                            {cert.existingDocId && cert.file && (
                              <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                                <FaInfoCircle size={10} />
                                Your existing certificate will be replaced with the new one upon submission.
                              </p>
                            )}
                            <button onClick={() => handleRemoveCertification(cert.tempId)} disabled={isAnyActionInProgress} className="mt-3 text-red-500 text-sm hover:text-red-700 transition-colors flex items-center gap-1 disabled:opacity-50">
                              <FaTrash size={12} /> Remove
                            </button>
                          </>
                        )}
                      </div>
                    ))}

                    {certifications.length < 5 && (
                      <button onClick={handleAddCertification} disabled={isAnyActionInProgress} className={`flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors mt-2 ${isAnyActionInProgress ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <FaPlus className="text-sm" />
                        <span>Add Certification</span>
                      </button>
                    )}

                    {certifications.length === 0 && !useNAOption && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-2">
                        <p className="text-sm text-yellow-700 flex items-center gap-2">
                          <FaExclamationTriangle size={14} />
                          Please add at least one certification or select the N/A option above.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {useNAOption && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
                    <p className="text-sm text-blue-700 flex items-center gap-2">
                      <FaInfoCircle size={14} />
                      You've selected N/A. No certifications will be added to your annual review.
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <FaExclamationTriangle className="text-red-500" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveDraft}
                  disabled={savingDraft || submitting || !isFormModified()}
                  className={`px-6 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2 font-medium ${savingDraft || submitting || !isFormModified() ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {savingDraft ? <><FaSpinner className="animate-spin" size={14} /> Saving...</> : <><FaSave size={14} /> Save Draft</>}
                </button>
                <button
                  onClick={handleSubmitToR1}
                  disabled={submitting || savingDraft || !isFormComplete()}
                  className={`px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg ${submitting || savingDraft || !isFormComplete() ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {submitting ? <><FaSpinner className="animate-spin" /> Submitting...</> : <><FaPaperPlane size={14} /> Submit</>}
                </button>
              </div>

              {/* Note */}
              <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
                <p className="text-xs text-red-700 flex items-start gap-2">
                  <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Note:</strong> Your annual review will be sent to your manager (R1) for assessment.
                    POSH certificate is mandatory. Certifications are mandatory - either add at least one certification
                    with file upload or select the N/A option.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <CustomModal
          isOpen={modal.isOpen}
          onClose={closeModal}
          onConfirm={modal.onConfirm}
          title={modal.title}
          message={modal.message}
          type={modal.type}
        />

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slideIn { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .custom-quill .ql-container { min-height: 300px; font-size: 15px; }
          .custom-quill .ql-editor { min-height: 280px; line-height: 1.6; }
          .custom-quill .ql-toolbar { border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; background-color: #f8fafc; border-color: #e2e8f0; }
          .custom-quill .ql-container { border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; border-color: #e2e8f0; }
          .custom-quill .ql-editor.ql-blank::before { font-style: normal; color: #94a3b8; font-size: 15px; }
          .custom-quill .ql-editor strong { font-weight: 600; }
          .custom-quill .ql-editor ul, .custom-quill .ql-editor ol { padding-left: 1.5rem; }
        `}</style>
      </div>
    </>
  );
};

export default EmployeeAnnualReview;