import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import { FiArrowLeft } from "react-icons/fi";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaUserTie,
  FaCheckCircle,
  FaSpinner,
  FaEye,
  FaPlus,
  FaClock,
  FaCheck,
  FaTimesCircle,
  FaAward,
  FaChartLine,
  FaCalendarAlt,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaList,
  FaTh,
  FaEdit,
  FaFileAlt,
  FaPaperPlane,
  FaTrash,
  FaPercent,
  FaBullseye,
  FaCalendar,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL_EPMS, BASE_URL_CDL } from "../../services/api";

// Helper function to get employee full name with priority to fullNameAsAadhaar
const getEmployeeFullName = (employeeData) => {
  if (employeeData && employeeData.fullNameAsAadhaar && employeeData.fullNameAsAadhaar.trim() !== "") {
    return employeeData.fullNameAsAadhaar.trim();
  }
  
  return "Employee Name";
};

// Helper function to get manager full name
const getManagerFullName = (employeeData) => {
  if (!employeeData) return "N/A";

  return employeeData.reportingManager || "N/A";
};

const EmployeeAppraisal = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const yearParam = queryParams.get("year");
  const quarterParam = queryParams.get("quarter");
  const reviewTypeParam = queryParams.get("type");

  const [employeeData, setEmployeeData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Quarter 1");
  const [currentStep, setCurrentStep] = useState(0);
  const [pendingStep, setPendingStep] = useState(null);
  const [blinkPending, setBlinkPending] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    yearParam || new Date().getFullYear().toString(),
  );
  const [selectedQuarter, setSelectedQuarter] = useState(quarterParam || "Q1");
  const [reviewType, setReviewType] = useState(reviewTypeParam || "quarterly");
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [weightageError, setWeightageError] = useState(null);
  
  // State for cycle information
  const [availableCycles, setAvailableCycles] = useState([]);
  const [annualCycleExists, setAnnualCycleExists] = useState(false);
  const [annualCycleData, setAnnualCycleData] = useState(null);
  const [quarterlyCycles, setQuarterlyCycles] = useState([]);
  const [cycleCheckCompleted, setCycleCheckCompleted] = useState(false);
  const [selectedQuarterCycle, setSelectedQuarterCycle] = useState(null);

  const [goalForm, setGoalForm] = useState({
    title: "",
    target: "",
    weightage: "",
    timeline: "",
  });

  // Annual Review specific states
  const [annualReviewData, setAnnualReviewData] = useState(null);
  const [annualReviewStatuses, setAnnualReviewStatuses] = useState({
    q1: { completed: false, goalsCount: 0, submittedDate: null },
    q2: { completed: false, goalsCount: 0, submittedDate: null },
    q3: { completed: false, goalsCount: 0, submittedDate: null },
    q4: { completed: false, goalsCount: 0, submittedDate: null },
    finalReview: {
      completed: false,
      submittedDate: null,
      rating: null,
      status: null,
      isSubmitted: false,
    },
  });
  const [expandedQuarter, setExpandedQuarter] = useState(null);
  const [annualReviewViewMode, setAnnualReviewViewMode] = useState("summary");
  const [pendingAnnualStep, setPendingAnnualStep] = useState(null);
  const [blinkAnnualPending, setBlinkAnnualPending] = useState(null);

  // Quarter tabs mapping
  const quarterTabs = [
    { label: "Quarter 1", value: "Q1" },
    { label: "Quarter 2", value: "Q2" },
    { label: "Quarter 3", value: "Q3" },
    { label: "Quarter 4", value: "Q4" },
  ];

  // Timeline steps for quarterly review
  const timelineSteps = [
    { id: 1, name: "Goal Creation", key: "goalCreation" },
    { id: 2, name: "Manager Approval", key: "managerApproval" },
    { id: 3, name: "Self Review", key: "selfReview" },
    { id: 4, name: "Manager Final Review", key: "managerFinalReview" },
    { id: 5, name: "Self Acceptance", key: "selfAcceptance" },
  ];

  // Annual review timeline steps
  const annualTimelineSteps = [
    {
      id: 1,
      name: "Submitted to R1",
      key: "submitted_to_r1",
      dateField: "submittedAt",
    },
    {
      id: 2,
      name: "Manager Annual Review",
      key: "manager_annual_review",
      dateField: "managerAnnualReviewSubmissionDate",
    },
    {
      id: 3,
      name: "Final Submit to HR",
      key: "final_submit_to_hr",
      dateField: "submittedToHRAt",
    },
  ];

  const getQuarterDates = (quarter, year) => {
    const yearNum = parseInt(year);
    const quarterDatesMap = {
      "Quarter 1": `01-Apr-${yearNum} to 30-Jun-${yearNum}`,
      "Quarter 2": `01-Jul-${yearNum} to 30-Sep-${yearNum}`,
      "Quarter 3": `01-Oct-${yearNum} to 31-Dec-${yearNum}`,
      "Quarter 4": `01-Jan-${yearNum + 1} to 31-Mar-${yearNum + 1}`,
    };
    return quarterDatesMap[quarter] || "";
  };

  // Check if annual cycle exists for the previous financial year
  const checkAnnualCycleExists = async () => {
    try {
      const previousYear = parseInt(selectedYear) - 1;
      const financialYear = `${previousYear}-${previousYear + 1}`;
      console.log("Checking annual cycle for financial year:", financialYear);
      const response = await axios.get(`${BASE_URL_EPMS}/api/cycles/financial-year/${financialYear}`);
      
      if (response.data && response.data.data) {
        const annualCycle = response.data.data.find(cycle => cycle.cycleType === "ANNUAL");
        if (annualCycle) {
          console.log("Annual cycle found:", annualCycle);
          setAnnualCycleExists(true);
          setAnnualCycleData(annualCycle);
          return true;
        }
      }
      console.log("No annual cycle found for financial year:", financialYear);
      setAnnualCycleExists(false);
      setAnnualCycleData(null);
      return false;
    } catch (error) {
      console.error("Error checking annual cycle:", error);
      setAnnualCycleExists(false);
      setAnnualCycleData(null);
      return false;
    }
  };

  // Check if quarterly cycles exist for the selected financial year
  const checkQuarterlyCyclesExist = async () => {
    try {
      const financialYear = `${selectedYear}-${parseInt(selectedYear) + 1}`;
      const response = await axios.get(`${BASE_URL_EPMS}/api/cycles/financial-year/${financialYear}`);
      
      if (response.data && response.data.data) {
        const quarterly = response.data.data.filter(cycle => cycle.cycleType === "QUARTERLY");
        setQuarterlyCycles(quarterly);
        
        // Check if the selected quarter cycle exists
        const selectedQuarterCycleData = quarterly.find(cycle => cycle.quarter === selectedQuarter);
        setSelectedQuarterCycle(selectedQuarterCycleData || null);
        
        return quarterly.length > 0;
      }
      setQuarterlyCycles([]);
      setSelectedQuarterCycle(null);
      return false;
    } catch (error) {
      console.error("Error checking quarterly cycles:", error);
      setQuarterlyCycles([]);
      setSelectedQuarterCycle(null);
      return false;
    }
  };

  // Fetch all available cycles for the employee's year
  const fetchAvailableCycles = async (year) => {
    try {
      const financialYear = `${year}-${year + 1}`;
      const response = await axios.get(`${BASE_URL_EPMS}/api/cycles/financial-year/${financialYear}`);
      if (response.data && response.data.data) {
        setAvailableCycles(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching available cycles:", error);
      setAvailableCycles([]);
    }
  };

  const getQuarterDatesFromCycle = (quarter, cycle) => {
    if (cycle && cycle.startDate && cycle.endDate) {
      return `${formatShortDate(cycle.startDate)} to ${formatShortDate(cycle.endDate)}`;
    }
    return getQuarterDates(quarter, selectedYear);
  };

  const getFinancialYearDisplay = () => {
    if (reviewType === "quarterly") {
      if (selectedQuarterCycle) {
        return selectedQuarterCycle.financialYear || `${selectedYear}-${parseInt(selectedYear) + 1}`;
      }
      return `${selectedYear}-${parseInt(selectedYear) + 1}`;
    }
    if (reviewType === "annual") {
      // For annual review, always show the previous financial year
      const previousYear = parseInt(selectedYear) - 1;
      return `${previousYear}-${previousYear + 1}`;
    }
    return `${selectedYear}-${parseInt(selectedYear) + 1}`;
  };

  const getCycleStatus = () => {
    if (reviewType === "quarterly" && selectedQuarterCycle) {
      return selectedQuarterCycle.status;
    }
    if (reviewType === "annual" && annualCycleData) {
      return annualCycleData.status;
    }
    return null;
  };

  const getCycleEndDate = () => {
    if (reviewType === "quarterly" && selectedQuarterCycle) {
      return selectedQuarterCycle.endDate;
    }
    if (reviewType === "annual" && annualCycleData) {
      return annualCycleData.endDate;
    }
    return null;
  };

  const getAnnualReviewStepStatus = (annualData) => {
    if (!annualData) {
      return { step: 0, completed: false, pendingStep: 1 };
    }

    let currentStep = 0;
    let pendingStep = 1;

    if (annualData.submittedAt) {
      currentStep = 1;
      pendingStep = 2;
    }

    if (annualData.managerAnnualReviewSubmissionDate) {
      currentStep = 2;
      pendingStep = 3;
    }

    if (
      annualData.submittedToHRAt ||
      annualData.submittedToHrDate ||
      annualData.status === "SUBMITTED_TO_HR" ||
      annualData.status === "COMPLETED" ||
      annualData.status === "FINAL_APPROVED"
    ) {
      currentStep = 3;
      pendingStep = null;
    }

    return {
      step: currentStep,
      completed: currentStep === 3,
      pendingStep: pendingStep,
    };
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (quarterParam) setSelectedQuarter(quarterParam);
    if (yearParam) setSelectedYear(yearParam);
    if (reviewTypeParam) setReviewType(reviewTypeParam);
  }, [quarterParam, yearParam, reviewTypeParam]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const initializeCycles = async () => {
      await checkAnnualCycleExists();
      const quarterlyExist = await checkQuarterlyCyclesExist();
      setCycleCheckCompleted(true);
      
      // If quarterly cycles don't exist, don't try to fetch goals
      if (!quarterlyExist && reviewType === "quarterly") {
        setLoading(false);
      }
    };
    initializeCycles();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchAvailableCycles(parseInt(selectedYear));
      checkQuarterlyCyclesExist();
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedQuarter) {
      checkQuarterlyCyclesExist();
    }
  }, [selectedQuarter]);

  useEffect(() => {
    if (reviewType === "annual") {
      if (annualCycleExists) {
        fetchAnnualReviewData();
      } else {
        setLoading(false);
      }
    } else {
      // For quarterly, only fetch if cycles exist
      if (quarterlyCycles.length > 0 && selectedQuarterCycle) {
        fetchQuarterlyData();
      } else {
        setLoading(false);
      }
    }
  }, [selectedQuarter, selectedYear, reviewType, annualCycleExists, quarterlyCycles.length, selectedQuarterCycle]);

  useEffect(() => {
    const tab = quarterTabs.find((t) => t.value === selectedQuarter);
    if (tab) setActiveTab(tab.label);
  }, [selectedQuarter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkPending((prev) => (prev === pendingStep ? null : pendingStep));
    }, 1000);
    return () => clearInterval(interval);
  }, [pendingStep]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkAnnualPending((prev) =>
        prev === pendingAnnualStep ? null : pendingAnnualStep,
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [pendingAnnualStep]);

  useEffect(() => {
    if (annualReviewData) {
      const { pendingStep: annualPending } = getAnnualReviewStepStatus(
        annualReviewData,
      );
      setPendingAnnualStep(annualPending);
    } else {
      setPendingAnnualStep(1);
    }
  }, [annualReviewData]);

  const calculateTotalWeightage = () => {
    return goals.reduce((total, goal) => total + (goal.weightage || 0), 0);
  };

  const validateWeightageForSubmission = () => {
    const total = calculateTotalWeightage();
    if (total !== 100) {
      setWeightageError(
        `Total weightage must be 100%. Current total: ${total}%`,
      );
      return false;
    }
    setWeightageError(null);
    return true;
  };

  const fetchQuarterlyData = async () => {
    setLoading(true);
    try {
      const storedEmpId = localStorage.getItem("empId") || empId;
      if (!storedEmpId) {
        setError("Employee ID not found");
        setLoading(false);
        return;
      }

      await fetchEmployeeDetails(storedEmpId);
      await fetchGoals(storedEmpId, selectedQuarter, selectedYear);
    } catch (err) {
      console.error("Error fetching quarterly data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async (storedEmpId, quarter, year) => {
    try {
      const url = `${BASE_URL_EPMS}/api/goals/employee/${storedEmpId}/${quarter}?year=${year}`;
      console.log(`📊 Fetching goals from: ${url}`);

      const response = await axios.get(url);

      console.log("Response data:", response.data);

      if (response.data && response.data.success === false) {
        console.warn("API returned error:", response.data.message);
        setGoals([]);
        return;
      }

      if (response.data && response.data.data) {
        setGoals(response.data.data);
      } else if (Array.isArray(response.data)) {
        setGoals(response.data);
      } else {
        setGoals([]);
      }
    } catch (err) {
      console.error(`Error fetching goals for ${quarter}:`, err);
      console.error("Error details:", err.response?.data);
      setGoals([]);
    }
  };

  const fetchAnnualReviewData = async () => {
    setLoading(true);
    try {
      const storedEmpId = localStorage.getItem("empId") || empId;
      if (!storedEmpId) {
        setError("Employee ID not found");
        setLoading(false);
        return;
      }

      await fetchEmployeeDetails(storedEmpId);
      await fetchAllQuarterlyGoals(storedEmpId, selectedYear);
      // Use previous year for annual review
      const previousYear = parseInt(selectedYear) - 1;
      await checkAndFetchAnnualReview(storedEmpId, previousYear);
    } catch (err) {
      console.error("Error fetching annual review data:", err);
      setError("Failed to load annual review data");
    } finally {
      setLoading(false);
    }
  };

  const checkAndFetchAnnualReview = async (storedEmpId, year) => {
  try {
    // Use financial year string (previous year - current year)
    const financialYear = `${year}-${year + 1}`;
    const url = `${BASE_URL_EPMS}/api/annual-review/by-financial-year/${storedEmpId}/${financialYear}`;
    console.log("Fetching annual review from:", url);
    
    const response = await axios.get(url);
    console.log("Full API response:", response);
    console.log("Response data:", response.data);
    console.log("Response status:", response.status);
    console.log("Response data structure:", JSON.stringify(response.data, null, 2));

    // Check different possible response structures
    let reviewData = null;
    
    if (response.data && response.data.data) {
      reviewData = response.data.data;
      console.log("Found data in response.data.data");
    } else if (response.data && response.data.id) {
      reviewData = response.data;
      console.log("Found data directly in response.data");
    } else if (response.data && typeof response.data === 'object') {
      reviewData = response.data;
      console.log("Using response.data as is");
    }
    
    console.log("Review data extracted:", reviewData);

    // Check if we have valid review data with an id
    if (reviewData && reviewData.id) {
      console.log("Annual review found with ID:", reviewData.id);
      console.log("Review status:", reviewData.status);
      console.log("Submitted at:", reviewData.submittedAt || reviewData.submitted_at);
      
      setAnnualReviewData(reviewData);

      const isSubmittedToHR =
        reviewData.status === "SUBMITTED_TO_HR" ||
        reviewData.status === "COMPLETED" ||
        reviewData.status === "FINAL_APPROVED" ||
        !!reviewData.submittedToHRAt ||
        !!reviewData.submittedToHrDate ||
        !!reviewData.submitted_to_hr_date;

      // Convert snake_case to camelCase for frontend consistency
      const submittedAt = reviewData.submittedAt || reviewData.submitted_at;
      const managerAnnualReviewSubmissionDate = reviewData.managerAnnualReviewSubmissionDate || reviewData.manager_annual_review_submission_date;
      const submittedToHRAt = reviewData.submittedToHrDate || reviewData.submittedToHRAt || reviewData.submitted_to_hr_date;

      reviewData.submittedToHRAt = submittedToHRAt;

      console.log("Submitted at value:", submittedAt);
      console.log("Is submitted to HR:", isSubmittedToHR);

      setAnnualReviewStatuses((prev) => ({
        ...prev,
        finalReview: {
          completed: isSubmittedToHR,
          submittedDate: submittedToHRAt || submittedAt || null,
          rating: reviewData.finalRating || reviewData.manager_rating || null,
          status: reviewData.status || "DRAFT",
          isSubmitted: !!submittedAt,
          managerComments: reviewData.managerComments || reviewData.manager_remarks || null,
          r1SubmittedDate: submittedAt || null,
          managerReviewedDate: managerAnnualReviewSubmissionDate || null,
          hrSubmittedDate: submittedToHRAt || null,
        },
      }));
    } else {
      console.log("No annual review data found for financial year:", financialYear);
      setAnnualReviewData(null);
      setAnnualReviewStatuses((prev) => ({
        ...prev,
        finalReview: {
          completed: false,
          submittedDate: null,
          rating: null,
          status: null,
          isSubmitted: false,
          managerComments: null,
          r1SubmittedDate: null,
          managerReviewedDate: null,
          hrSubmittedDate: null,
        },
      }));
    }
  } catch (error) {
    console.error("Error fetching annual review:", error);
    console.error("Error response:", error.response);
    console.error("Error response data:", error.response?.data);
    console.error("Error status:", error.response?.status);
    setAnnualReviewData(null);
    setAnnualReviewStatuses((prev) => ({
      ...prev,
      finalReview: {
        completed: false,
        submittedDate: null,
        rating: null,
        status: null,
        isSubmitted: false,
        managerComments: null,
        r1SubmittedDate: null,
        managerReviewedDate: null,
        hrSubmittedDate: null,
      },
    }));
  }
};

  const fetchAllQuarterlyGoals = async (storedEmpId, year) => {
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    const statusMap = {
      q1: { completed: false, goalsCount: 0, submittedDate: null },
      q2: { completed: false, goalsCount: 0, submittedDate: null },
      q3: { completed: false, goalsCount: 0, submittedDate: null },
      q4: { completed: false, goalsCount: 0, submittedDate: null },
    };

    for (const quarter of quarters) {
      try {
        const url = `${BASE_URL_EPMS}/api/goals/employee/${storedEmpId}/${quarter}?year=${year}`;
        const response = await axios.get(url);
        const goalsData =
          response.data?.data ||
          (Array.isArray(response.data) ? response.data : []);

        const hasSubmittedGoals = goalsData.some(
          (goal) =>
            goal.status === "PENDING_APPROVAL" ||
            goal.status === "APPROVED" ||
            goal.status === "SELF_REVIEWED",
        );

        const submittedDates = goalsData
          .filter((goal) => goal.submittedToEmployeeAt)
          .map((goal) => new Date(goal.submittedToEmployeeAt));
        const latestSubmittedDate =
          submittedDates.length > 0
            ? new Date(Math.max(...submittedDates))
            : null;

        statusMap[quarter.toLowerCase()] = {
          completed: hasSubmittedGoals,
          goalsCount: goalsData.length,
          submittedDate: latestSubmittedDate,
          goals: goalsData,
        };
      } catch (error) {
        console.error(`Error fetching ${quarter} goals:`, error);
      }
    }

    setAnnualReviewStatuses((prev) => ({
      ...prev,
      ...statusMap,
    }));
  };

  const fetchEmployeeDetails = async (storedEmpId) => {
    try {
      // Fetch employee details using the new API endpoint with eCode
      const response = await axios.get(`${BASE_URL_CDL}/employee/eCode/${storedEmpId}`);
      console.log("Employee details API response:", response.data);
      
      if (response.data && response.data.fileAndObjectTypeBean) {
        const empResDTO = response.data.fileAndObjectTypeBean.empResDTO;
        const userDTO = response.data.userDTO;
        
        // Map the response data to the expected format
        const mappedData = {
          id: empResDTO?.empId,
          empCode: empResDTO?.empCode,
          firstName: empResDTO?.firstName,
          middleName: empResDTO?.middleName || "",
          lastName: empResDTO?.lastName,
          fullNameAsAadhaar: empResDTO?.fullNameAsAadhaar || "",
          emailId: empResDTO?.emailId,
          designationName: empResDTO?.designationResDTO?.designationName || "N/A",
          mainDepartment: empResDTO?.mainDeptResDTO?.mainDepartment || "N/A",
          reportingManager: empResDTO?.reportingManager || "N/A",
          reportingManagerEmailId: empResDTO?.reportingManagerEmailId || "N/A",
          employmentStatus: empResDTO?.employmentStatusResDTO?.employmentStatus || "N/A",
          // Location from userDTO
          location: userDTO?.locationResDTO?.locationName || "N/A",
          subDept: empResDTO?.subDeptResDTO?.subDept || "N/A",
          projectName: empResDTO?.projectResDTO?.projectName || "N/A",
          // Additional fields that might be useful
          primaryContactNo: empResDTO?.primaryContactNo || "N/A",
          dateOfJoining: empResDTO?.dateOfJoining || "N/A",
          bloodGroup: empResDTO?.bloodGroup || "N/A",
          gender: empResDTO?.gender || "N/A",
          buHeadName: empResDTO?.buHeadName || "N/A",
          organizationName: empResDTO?.organizationResDTO?.organizationName || "N/A",
          orgHierarchy: empResDTO?.orgHierarchyResDTO?.orgHierarchy || "N/A",
        };
        
        console.log("Mapped employee data with location:", mappedData);
        setEmployeeData(mappedData);
      } else {
        setError(`Employee not found with ID: ${storedEmpId}`);
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
      console.error("Error response:", err.response?.data);
      setError("Failed to fetch employee details");
    }
  };

  const handleTabChange = async (tabLabel) => {
    const quarterValue =
      quarterTabs.find((t) => t.label === tabLabel)?.value || "Q1";
    setActiveTab(tabLabel);
    setSelectedQuarter(quarterValue);
    setLoading(true);

    try {
      const storedEmpId = localStorage.getItem("empId") || empId;
      if (storedEmpId && reviewType === "quarterly") {
        const url = new URL(window.location);
        url.searchParams.set("quarter", quarterValue);
        url.searchParams.set("year", selectedYear);
        window.history.pushState({}, "", url);
        
        // Check if the selected quarter cycle exists
        const quarterExists = quarterlyCycles.some(c => c.quarter === quarterValue);
        if (quarterExists) {
          await fetchGoals(storedEmpId, quarterValue, selectedYear);
        } else {
          setGoals([]);
        }
      }
    } catch (err) {
      console.error("Error fetching goals for tab:", err);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate(-1);

  const handleCreateGoal = () => {
    const storedEmpId = localStorage.getItem("empId") || empId;
    navigate(
      `/employee/goal/create/${storedEmpId}?year=${selectedYear}&quarter=${selectedQuarter}`,
    );
  };

  const handleEditDraftGoals = () => {
    const storedEmpId = localStorage.getItem("empId") || empId;
    navigate(
      `/employee/goal/edit/${storedEmpId}?year=${selectedYear}&quarter=${selectedQuarter}`,
    );
  };

  const handlePreviewGoals = () => {
    const storedEmpId = localStorage.getItem("empId") || empId;
    navigate(
      `/employee/goal/preview/${storedEmpId}?year=${selectedYear}&quarter=${selectedQuarter}`,
    );
  };

  const handleSelfReview = () => {
    const storedEmpId = localStorage.getItem("empId") || empId;
    navigate(
      `/employee/goal/self-review/${storedEmpId}?year=${selectedYear}&quarter=${selectedQuarter}`,
    );
  };

  const handleSelfAcceptance = () => {
    const storedEmpId = localStorage.getItem("empId") || empId;
    navigate(
      `/employee/appraisal/acceptance/${storedEmpId}?year=${selectedYear}&quarter=${selectedQuarter}`,
    );
  };

  const handleStartAnnualReview = () => {
    const storedEmpId = localStorage.getItem("empId") || empId;
    // Use previous year for annual review
    const previousYear = parseInt(selectedYear) - 1;
    navigate(`/employee/annual-review/${storedEmpId}?year=${previousYear}`);
  };

  const handleEditAnnualReview = () => {
    const storedEmpId = localStorage.getItem("empId") || empId;
    // Use previous year for annual review
    const previousYear = parseInt(selectedYear) - 1;
    navigate(`/employee/annual-review/${storedEmpId}?year=${previousYear}&edit=true`);
  };

  const handleViewAnnualReview = () => {
    const storedEmpId = localStorage.getItem("empId") || empId;
    // Use previous year for annual review
    const previousYear = parseInt(selectedYear) - 1;
    navigate(
      `/employee/annual-review/preview/${storedEmpId}?year=${previousYear}`,
    );
  };

  const handleViewManagerAnnualReview = () => {
    const storedEmpId = localStorage.getItem("empId") || empId;
    const previousYear = parseInt(selectedYear) - 1;
    navigate(
      `/manager/annual-review/preview/${storedEmpId}?year=${previousYear}`,
    );
  };

  const handleSubmitToR1 = async () => {
    if (!annualReviewData) return;
    setSubmitting(true);
    try {
      const storedEmpId = localStorage.getItem("empId") || empId;
      const previousYear = parseInt(selectedYear) - 1;
      await axios.post(
        `${BASE_URL_EPMS}/api/annual-review/update-and-submit`,
        {
          id: annualReviewData.id,
        },
      );
      await checkAndFetchAnnualReview(storedEmpId, previousYear);
      alert("Annual review submitted to R1 successfully!");
    } catch (error) {
      console.error("Error submitting to R1:", error);
      alert("Failed to submit annual review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitToHR = () => {
    const storedEmpId = localStorage.getItem("empId") || empId;
    const previousYear = parseInt(selectedYear) - 1;
    navigate(
      `/employee/annual-review/submit-to-hr/${storedEmpId}?year=${previousYear}`,
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateProgress = () => {
    if (goals.length === 0) return 0;

    const stats = getSubmissionStats();

    if (stats.hasSelfAcceptance) return 100;
    if (stats.hasManagerFinalReview) return 80;
    if (stats.hasSelfReview) return 60;
    if (stats.hasManagerApproval) return 40;
    if (stats.hasPendingApproval) return 20;
    if (goals.length > 0 && stats.hasDraftGoals) return 10;
    return 0;
  };

  const calculateAnnualProgress = () => {
    let completedCount = 0;
    if (annualReviewStatuses.q1.completed) completedCount++;
    if (annualReviewStatuses.q2.completed) completedCount++;
    if (annualReviewStatuses.q3.completed) completedCount++;
    if (annualReviewStatuses.q4.completed) completedCount++;
    return (completedCount / 4) * 100;
  };

  const getSubmissionStats = () => {
    if (!goals.length) {
      return {
        goalCreationStatus: "No Goals",
        hasDraftGoals: false,
        hasPendingApproval: false,
        hasManagerApproval: false,
        hasSelfReview: false,
        hasManagerFinalReview: false,
        hasSelfAcceptance: false,
        allGoalsApproved: false,
        allGoalsSelfReviewed: false,
        totalGoals: 0,
        totalWeightage: 0,
        createdDate: null,
        hasSubmittedGoals: false,
      };
    }

    const createdDates = goals.map((g) => g.createdAt).filter((date) => date);
    const earliestCreatedDate =
      createdDates.length > 0
        ? new Date(
            Math.min(...createdDates.map((date) => new Date(date).getTime())),
          )
        : null;

    const approvedDates = goals
      .map((g) => g.approvedAt || (g.status === "APPROVED" || g.status === "SELF_REVIEWED" || g.status === "MANAGER_REVIEWED" || g.status === "ACCEPTED_BY_EMPLOYEE" ? g.updatedAt : null))
      .filter((date) => date);
    const latestApprovedDate = 
      approvedDates.length > 0
        ? new Date(
            Math.max(...approvedDates.map((date) => new Date(date).getTime())),
          )
        : null;

    const selfReviewDates = goals.map((g) => g.selfReviewSubmittedDate).filter((date) => date);
    const latestSelfReviewDate = selfReviewDates.length > 0
      ? new Date(Math.max(...selfReviewDates.map((date) => new Date(date).getTime())))
      : goals.find((g) => g.status === "SELF_REVIEWED" || g.status === "MANAGER_REVIEWED" || g.status === "ACCEPTED_BY_EMPLOYEE")?.updatedAt
      ? new Date(goals.find((g) => g.status === "SELF_REVIEWED" || g.status === "MANAGER_REVIEWED" || g.status === "ACCEPTED_BY_EMPLOYEE")?.updatedAt)
      : null;

    const finalReviewDates = goals.map((g) => g.reviewedAt).filter((date) => date);
    const latestFinalReviewDate = finalReviewDates.length > 0
      ? new Date(Math.max(...finalReviewDates.map((date) => new Date(date).getTime())))
      : null;

    const acceptedDates = goals.map((g) => g.selfAcceptedDate).filter((date) => date);
    const latestAcceptedDate = acceptedDates.length > 0
      ? new Date(Math.max(...acceptedDates.map((date) => new Date(date).getTime())))
      : null;

    const hasDraftGoals = goals.some(
      (g) => g.status === "DRAFT" || g.status === "SENT_BACK",
    );
    const hasPendingApproval = goals.some(
      (g) => g.status === "PENDING_APPROVAL",
    );
    const hasSubmittedGoals = goals.some(
      (g) => g.status === "PENDING_APPROVAL" || 
             g.status === "APPROVED" || 
             g.status === "SELF_REVIEWED" ||
             g.status === "MANAGER_REVIEWED" ||
             g.status === "ACCEPTED_BY_EMPLOYEE"
    );
    const hasManagerApproval = goals.every(
      (g) =>
        g.status === "APPROVED" ||
        g.status === "SELF_REVIEWED" ||
        g.status === "MANAGER_REVIEWED" ||
        g.status === "ACCEPTED_BY_EMPLOYEE",
    );
    const allGoalsApproved =
      goals.length > 0 &&
      goals.every(
        (g) =>
          g.status === "APPROVED" ||
          g.status === "SELF_REVIEWED" ||
          g.status === "MANAGER_REVIEWED",
      );
    const hasSelfReview = goals.some(
      (g) =>
        g.status === "SELF_REVIEWED" ||
        g.status === "MANAGER_REVIEWED" ||
        g.status === "ACCEPTED_BY_EMPLOYEE",
    );
    const allGoalsSelfReviewed =
      goals.length > 0 &&
      goals.every(
        (g) => g.status === "SELF_REVIEWED" || g.status === "MANAGER_REVIEWED",
      );
    const hasManagerFinalReview = goals.some(
      (g) =>
        g.status === "MANAGER_REVIEWED" || g.status === "ACCEPTED_BY_EMPLOYEE",
    );
    const hasSelfAcceptance = goals.some(
      (g) => g.status === "ACCEPTED_BY_EMPLOYEE",
    );

    let goalCreationStatus = "Goals Created";
    if (goals.length === 0) goalCreationStatus = "No Goals";
    else if (hasDraftGoals) goalCreationStatus = "Draft In Progress";
    else if (hasPendingApproval) goalCreationStatus = "Pending Approval";
    else if (hasManagerApproval) goalCreationStatus = "Goals Approved";

    return {
      goalCreationStatus,
      hasDraftGoals,
      hasPendingApproval,
      hasManagerApproval,
      hasSelfReview,
      hasManagerFinalReview,
      hasSelfAcceptance,
      allGoalsApproved,
      allGoalsSelfReviewed,
      totalGoals: goals.length,
      totalWeightage: calculateTotalWeightage(),
      createdDate: hasSubmittedGoals ? earliestCreatedDate : null,
      approvedDate: latestApprovedDate,
      selfReviewDate: latestSelfReviewDate,
      finalReviewDate: latestFinalReviewDate,
      acceptedDate: latestAcceptedDate,
      hasSubmittedGoals,
    };
  };

  useEffect(() => {
    if (reviewType === "quarterly") {
      const stats = getSubmissionStats();

      if (goals.length === 0) {
        setCurrentStep(0);
        setPendingStep(1);
      } else if (stats.hasPendingApproval) {
        setCurrentStep(1);
        setPendingStep(2);
      } else if (!stats.hasManagerApproval) {
        setCurrentStep(1);
        setPendingStep(2);
      } else if (!stats.hasSelfReview) {
        setCurrentStep(2);
        setPendingStep(3);
      } else if (!stats.hasManagerFinalReview) {
        setCurrentStep(3);
        setPendingStep(4);
      } else if (!stats.hasSelfAcceptance) {
        setCurrentStep(4);
        setPendingStep(5);
      } else {
        setCurrentStep(5);
        setPendingStep(null);
      }
    }
  }, [goals, reviewType]);

  const handleReviewTypeChange = (type) => {
    setReviewType(type);
    const url = new URL(window.location);
    url.searchParams.set("type", type);
    window.history.pushState({}, "", url);
  };

  // Show loading while checking cycles
  if (loading || !cycleCheckCompleted) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading Performance Details..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96 mt-24">
          <div className="text-center">
            <p className="text-[#EF4444] text-xl mb-4">{error}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = getSubmissionStats();
  const progress = calculateProgress();
  const annualProgress = calculateAnnualProgress();

  const hasExistingAnnualReview = annualReviewData !== null;
  const annualReviewStatus = annualReviewStatuses.finalReview.status;
  const isAnnualReviewSubmitted = annualReviewStatuses.finalReview.isSubmitted;
  const isAnnualReviewCompleted = annualReviewStatuses.finalReview.completed;
  const isSubmittedToHR =
    annualReviewData?.status === "SUBMITTED_TO_HR" ||
    annualReviewData?.status === "COMPLETED" ||
    annualReviewData?.status === "FINAL_APPROVED" ||
    !!annualReviewData?.submittedToHRAt ||
    !!annualReviewData?.submittedToHrDate;

  const annualStepStatus = getAnnualReviewStepStatus(annualReviewData);
  const cycleEndDate = getCycleEndDate();
  const cycleStatus = getCycleStatus();

  // Check if annual review is in DRAFT status
  const isAnnualReviewDraft = annualReviewData && 
    (annualReviewData.status === "DRAFT" && 
     !annualReviewData.submittedAt && 
     !annualReviewData.managerRemarks && 
     !annualReviewData.achievementLevel && 
     !annualReviewData.potential && 
     !annualReviewData.performance);

  const renderQuarterlyReview = () => {
    // Check if there's a quarterly cycle for the selected quarter
    if (!selectedQuarterCycle && quarterlyCycles.length === 0) {
      const financialYear = `${selectedYear}-${parseInt(selectedYear) + 1}`;
      return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-yellow-50 px-6 py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-yellow-600 text-3xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              No Quarterly Cycles Available
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              HR has not created any quarterly review cycles for the financial year {financialYear}.
              <br />
              Please contact HR for more information about the quarterly review schedule.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    // Check if the specific quarter cycle exists
    if (!selectedQuarterCycle && quarterlyCycles.length > 0) {
      return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-yellow-50 px-6 py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-yellow-600 text-3xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {selectedQuarter} Cycle Not Available
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              HR has not created the review cycle for {selectedQuarter} of financial year {selectedYear}-{parseInt(selectedYear) + 1}.
              <br />
              Please contact HR for more information about the review schedule.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {quarterTabs.map((tab) => {
              // Check if this quarter cycle exists
              const quarterExists = quarterlyCycles.some(c => c.quarter === tab.value);
              return (
                <button
                  key={tab.label}
                  onClick={() => quarterExists && handleTabChange(tab.label)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    !quarterExists
                      ? "text-gray-400 cursor-not-allowed"
                      : activeTab === tab.label
                      ? "border-[#EF4444] text-[#EF4444]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  disabled={!quarterExists}
                  title={!quarterExists ? `No cycle created for ${tab.label}` : ""}
                >
                  {tab.label}
                  {!quarterExists && (
                    <span className="ml-2 text-xs text-gray-400">(Not Created)</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#EF4444] px-6 py-4 border-b border-[#DC2626]">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-white">{activeTab}</h2>
                <p className="text-red-100 text-sm mt-1">
                  {getQuarterDatesFromCycle(activeTab, selectedQuarterCycle)}
                </p>
              </div>
              {cycleEndDate && (
                <div className="text-right">
                  <p className="text-xs text-red-100">Cycle End Date</p>
                  <p className="text-sm font-semibold text-white">
                    {formatShortDate(cycleEndDate)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {/* Goal Creation Card */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Goal Creation</h3>
                  <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                    <FaBullseye className="text-[#EF4444] text-sm" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    {stats.hasDraftGoals ? (
                      <p className="text-sm font-medium inline-block px-2 py-1 rounded text-yellow-600 bg-yellow-50">
                        Draft In Progress
                      </p>
                    ) : stats.createdDate ? (
                      <p className="text-sm font-medium flex items-center gap-1 text-green-600">
                        <FaCheckCircle className="text-green-500 text-xs" />
                        Created On {formatDate(stats.createdDate)}
                      </p>
                    ) : (
                      <p className="text-sm font-medium inline-block px-2 py-1 rounded text-[#EF4444] bg-red-50">Not Created</p>
                    )}
                  </div>
                  <div className="pt-2">
                    {/* Check if there are draft goals that need editing */}
                    {stats.hasDraftGoals ? (
                      <button onClick={handleEditDraftGoals} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        <FaEdit className="text-xs" /> Edit Draft Goals
                      </button>
                    ) : goals.length > 0 && stats.hasSubmittedGoals ? (
                      <button onClick={handlePreviewGoals} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#EF4444] text-white text-sm font-medium rounded-lg hover:bg-[#DC2626] transition-colors">
                        <FaEye className="text-xs" /> Preview Goals
                      </button>
                    ) : (
                      <button onClick={handleCreateGoal} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#EF4444] text-white text-sm font-medium rounded-lg hover:bg-[#DC2626] transition-colors">
                        <FaPlus className="text-xs" /> Add Goal
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Manager Approval Card */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Manager Approval</h3>
                  <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                    <FaUserTie className="text-[#EF4444] text-sm" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  {stats.hasManagerApproval && stats.approvedDate ? (
                    <p className="text-sm font-medium flex items-center gap-1 text-green-600">
                      <FaCheckCircle className="text-green-500 text-xs" />
                      Approved On {formatDate(stats.approvedDate)}
                    </p>
                  ) : (
                    <p className={`text-sm font-medium inline-block px-2 py-1 rounded ${
                      stats.hasManagerApproval ? "text-green-600 bg-green-50" :
                      stats.hasPendingApproval ? "text-[#EF4444] bg-red-50" :
                      goals.length > 0 && stats.hasSubmittedGoals ? "text-gray-500 bg-gray-50" : "text-gray-500 bg-gray-50"
                    }`}>
                      {stats.hasManagerApproval ? "Approved" : stats.hasPendingApproval ? "Pending Approval" : goals.length > 0 && stats.hasSubmittedGoals ? "Not Submitted" : "No Goals"}
                    </p>
                  )}
                </div>
              </div>

              {/* Self Review Card */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Self Review</h3>
                  <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                    <FaUser className="text-[#EF4444] text-sm" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    {stats.hasSelfReview && stats.selfReviewDate ? (
                      <p className="text-sm font-medium flex items-center gap-1 text-green-600">
                        <FaCheckCircle className="text-green-500 text-xs" />
                        Completed On {formatDate(stats.selfReviewDate)}
                      </p>
                    ) : (
                      <p className={`text-sm font-medium inline-block px-2 py-1 rounded ${
                        stats.hasSelfReview ? "text-green-600 bg-green-50" :
                        stats.hasManagerApproval ? "text-[#EF4444] bg-red-50" : "text-gray-500 bg-gray-50"
                      }`}>
                        {stats.hasSelfReview ? "Completed" : stats.hasManagerApproval ? "Pending" : "Waiting for Approval"}
                      </p>
                    )}
                  </div>
                  <div className="pt-2">
                    {stats.hasManagerApproval && !stats.hasSelfReview && (
                      <button onClick={handleSelfReview} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#EF4444] text-white text-sm font-medium rounded-lg hover:bg-[#DC2626] transition-colors">
                        <FaEdit className="text-xs" /> Start Self Review
                      </button>
                    )}
                    {stats.hasSelfReview && (
                      <button onClick={handlePreviewGoals} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#EF4444] text-white text-sm font-medium rounded-lg hover:bg-[#DC2626] transition-colors">
                        <FaEye className="text-xs" /> View Self Review
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Manager Final Review Card */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Manager Final Review</h3>
                  <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                    <FaStar className="text-[#EF4444] text-sm" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  {stats.hasManagerFinalReview && stats.finalReviewDate ? (
                    <p className="text-sm font-medium flex items-center gap-1 text-green-600">
                      <FaCheckCircle className="text-green-500 text-xs" />
                      Completed On {formatDate(stats.finalReviewDate)}
                    </p>
                  ) : (
                    <p className={`text-sm font-medium inline-block px-2 py-1 rounded ${
                      stats.hasManagerFinalReview ? "text-green-600 bg-green-50" :
                      stats.hasSelfReview ? "text-[#EF4444] bg-red-50" : "text-gray-500 bg-gray-50"
                    }`}>
                      {stats.hasManagerFinalReview ? "Completed" : stats.hasSelfReview ? "Pending" : "Waiting for Self Review"}
                    </p>
                  )}
                </div>
              </div>

              {/* Self Acceptance Card */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Self Acceptance</h3>
                  <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                    <FaCheckCircle className="text-[#EF4444] text-sm" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    {stats.hasSelfAcceptance && stats.acceptedDate ? (
                      <p className="text-sm font-medium flex items-center gap-1 text-green-600">
                        <FaCheckCircle className="text-green-500 text-xs" />
                        Accepted On {formatDate(stats.acceptedDate)}
                      </p>
                    ) : (
                      <p className={`text-sm font-medium inline-block px-2 py-1 rounded ${stats.hasSelfAcceptance ? "text-green-600 bg-green-50" : "text-gray-500 bg-gray-50"}`}>
                        {stats.hasSelfAcceptance ? "Accepted" : "Pending"}
                      </p>
                    )}
                  </div>
                  <div className="pt-2">
                    {stats.hasManagerFinalReview && !stats.hasSelfAcceptance && (
                      <button onClick={handleSelfAcceptance} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                        <FaCheckCircle className="text-xs" /> Accept & Complete
                      </button>
                    )}
                    {stats.hasSelfAcceptance && (
                      <button onClick={handlePreviewGoals} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#EF4444] text-white text-sm font-medium rounded-lg hover:bg-[#DC2626] transition-colors">
                        <FaEye className="text-xs" /> Final View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {cycleStatus && (
              <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <FaClock className="text-blue-500" />
                  <span className="font-semibold">Cycle Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    cycleStatus === "ACTIVE" ? "bg-green-100 text-green-700" :
                    cycleStatus === "CLOSED" ? "bg-gray-100 text-gray-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {cycleStatus}
                  </span>
                </p>
              </div>
            )}

            {goals.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-700 mb-6">Quarterly Timeline - {selectedQuarter}</h3>
                <div className="relative">
                  <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200"></div>
                  <div className="absolute top-5 left-0 h-0.5 bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                  <div className="relative flex justify-between">
                    {timelineSteps.map((step, index) => {
                      const stepNumber = index + 1;
                      let isCompleted = false;
                      let stepStatus = "Pending";

                      if (step.key === "goalCreation" && stats.hasSubmittedGoals) { isCompleted = true; stepStatus = "Completed"; }
                      else if (step.key === "goalCreation" && stats.hasDraftGoals) { isCompleted = false; stepStatus = "Draft"; }
                      else if (step.key === "managerApproval" && stats.hasManagerApproval) { isCompleted = true; stepStatus = "Completed"; }
                      else if (step.key === "selfReview" && stats.hasSelfReview) { isCompleted = true; stepStatus = "Completed"; }
                      else if (step.key === "managerFinalReview" && stats.hasManagerFinalReview) { isCompleted = true; stepStatus = "Completed"; }
                      else if (step.key === "selfAcceptance" && stats.hasSelfAcceptance) { isCompleted = true; stepStatus = "Completed"; }

                      const isPending = !isCompleted && pendingStep === stepNumber;

                      return (
                        <div key={step.id} className="flex flex-col items-center relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 cursor-pointer ${
                            isCompleted ? "bg-green-500" : stepStatus === "Draft" ? "bg-yellow-500" : "bg-[#EF4444]"
                          } ${isPending && blinkPending ? "animate-pulse ring-4 ring-[#EF4444]/30" : ""} hover:scale-110`}>
                            {isCompleted ? <FaCheckCircle className="text-white text-lg" /> : <span className="text-white text-sm font-medium">{step.id}</span>}
                          </div>
                          <span className={`text-xs font-medium mb-1 ${isCompleted ? "text-green-600" : stepStatus === "Draft" ? "text-yellow-600" : "text-[#EF4444]"}`}>{step.name}</span>
                          <span className={`text-xs ${stepStatus === "Completed" ? "text-green-600" : stepStatus === "Draft" ? "text-yellow-600" : "text-[#EF4444]/60"}`}>{stepStatus}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-12 flex items-center justify-center gap-6 text-xs">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-gray-600">Completed</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div><span className="text-gray-600">Draft</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#EF4444] rounded-full animate-pulse"></div><span className="text-gray-600">Pending / In Progress</span></div>
                </div>
              </div>
            )}

            {goals.length === 0 && selectedQuarterCycle && (
              <div className="mt-8 text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No goals found for {activeTab} {selectedYear}</p>
                <button onClick={handleCreateGoal} className="mt-4 px-4 py-2 bg-[#EF4444] text-white text-sm font-medium rounded-lg hover:bg-[#DC2626] transition-colors flex items-center gap-2 mx-auto">
                  <FaPlus className="text-xs" /> Create Goals for {selectedQuarter}
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderAnnualReview = () => {
    // Check if annual cycle exists
    if (!annualCycleExists) {
      const previousYear = parseInt(selectedYear) - 1;
      const financialYear = `${previousYear}-${previousYear + 1}`;
      return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-yellow-50 px-6 py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-yellow-600 text-3xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Annual Review Cycle Not Available</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              HR has not created the annual review cycle for the financial year {financialYear}.<br />
              Please contact HR for more information about the annual review schedule.
            </p>
            <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors">Go to Dashboard</button>
          </div>
        </div>
      );
    }

    // Check if annual review data exists and has been submitted
    const hasSubmittedToR1 = !!(
      annualReviewData?.submittedAt || 
      annualReviewData?.submitted_at || 
      annualReviewData?.managerRemarks || 
      annualReviewData?.achievementLevel || 
      annualReviewData?.potential || 
      annualReviewData?.performance || 
      annualReviewData?.status === "SUBMITTED_TO_R1" || 
      annualReviewData?.status === "SUBMITTED_TO_EMPLOYEE" || 
      annualReviewData?.status === "SUBMITTED_TO_HR" || 
      annualReviewData?.status === "COMPLETED" || 
      annualReviewData?.status === "FINAL_APPROVED"
    );
    const hasManagerAnnualReview = annualReviewData?.managerAnnualReviewSubmissionDate || false;
    const hasSubmittedToHR = annualReviewData?.status === "SUBMITTED_TO_HR" || 
                             annualReviewData?.status === "COMPLETED" || 
                             annualReviewData?.status === "FINAL_APPROVED" ||
                             annualReviewData?.submittedToHRAt || 
                             annualReviewData?.submitted_to_hr_date || false;

    const annualStats = {
      hasSubmittedToR1: hasSubmittedToR1,
      hasManagerAnnualReview: hasManagerAnnualReview,
      hasSubmittedToHR: hasSubmittedToHR,
      submittedToR1Date: annualReviewData?.submittedAt || annualReviewData?.submitted_at || null,
      managerAnnualReviewDate: annualReviewData?.managerAnnualReviewSubmissionDate || null,
      submittedToHRDate: annualReviewData?.submittedToHrDate || annualReviewData?.submitted_to_hr_date || null,
    };

    const annualStepStatus = getAnnualReviewStepStatus(annualReviewData);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button onClick={() => setAnnualReviewViewMode("summary")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              annualReviewViewMode === "summary" ? "bg-[#EF4444] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
              <FaTh size={14} /> Summary View
            </button>
          </div>
          {annualReviewData && (hasSubmittedToR1 || hasSubmittedToHR) && (
            <button onClick={handleViewAnnualReview} className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors flex items-center gap-2">
              <FaEye size={14} /> {hasSubmittedToHR ? "View Completed Review" : "Preview Review"}
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#EF4444] px-6 py-4 border-b border-[#DC2626]">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-white">Annual Review Status</h2>
                <p className="text-red-100 text-sm mt-1">Final review process for FY {getFinancialYearDisplay()}</p>
              </div>
              {annualCycleData?.endDate && (
                <div className="text-right">
                  <p className="text-xs text-red-100">Cycle End Date</p>
                  <p className="text-sm font-semibold text-white">{formatShortDate(annualCycleData.endDate)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {/* Submitted to R1 Card */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Submitted to R1</h3>
                  <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center"><FaFileAlt className="text-[#EF4444] text-sm" /></div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <p className={`text-sm font-medium inline-block px-2 py-1 rounded ${
                      annualStats.hasSubmittedToR1 || annualReviewData?.status === "SUBMITTED_TO_R1" 
                        ? "text-green-600 bg-green-50" 
                        : annualReviewData?.status === "DRAFT"
                        ? "text-yellow-600 bg-yellow-50"
                        : "text-[#EF4444] bg-red-50"
                    }`}>
                      {annualStats.hasSubmittedToR1 || annualReviewData?.status === "SUBMITTED_TO_R1" 
                        ? "Submitted" 
                        : annualReviewData?.status === "DRAFT"
                        ? "Draft"
                        : "Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Submitted On</p>
                    <p className="text-sm font-medium flex items-center gap-1"><FaClock className="text-gray-400 text-xs" />{annualStats.submittedToR1Date ? formatDate(annualStats.submittedToR1Date) : "Not Submitted"}</p>
                  </div>
                  <div className="pt-2">
                    {annualStats.hasSubmittedToR1 || annualReviewData?.status === "SUBMITTED_TO_R1" ? (
                      <button onClick={handleViewAnnualReview} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#EF4444] text-white text-sm font-medium rounded-lg hover:bg-[#DC2626] transition-colors">
                        <FaEye className="text-xs" /> Preview Self Annual Review
                      </button>
                    ) : annualReviewData && annualReviewData.status === "DRAFT" ? (
                      <button onClick={handleEditAnnualReview} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        <FaEdit className="text-xs" /> Edit Draft
                      </button>
                    ) : annualReviewData && (
                      <button onClick={handleSubmitToR1} disabled={submitting} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#EF4444] text-white text-sm font-medium rounded-lg hover:bg-[#DC2626] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {submitting ? <FaSpinner className="animate-spin text-xs" /> : <FaPaperPlane className="text-xs" />} Submit to R1
                      </button>
                    )}
                    {!annualReviewData && (
                      <button onClick={handleStartAnnualReview} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#EF4444] text-white text-sm font-medium rounded-lg hover:bg-[#DC2626] transition-colors">
                        <FaPlus className="text-xs" /> Start Annual Review
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Manager Annual Review Card */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Manager Annual Review</h3>
                  <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center"><FaUserTie className="text-[#EF4444] text-sm" /></div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <p className={`text-sm font-medium inline-block px-2 py-1 rounded ${
                      annualStats.hasManagerAnnualReview ? "text-green-600 bg-green-50" :
                      annualStats.hasSubmittedToR1 ? "text-[#EF4444] bg-red-50" : "text-gray-500 bg-gray-50"
                    }`}>
                      {annualStats.hasManagerAnnualReview ? "Completed" : annualStats.hasSubmittedToR1 ? "Pending Review" : "Waiting for Submission"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Reviewed On</p>
                    <p className="text-sm font-medium flex items-center gap-1"><FaClock className="text-gray-400 text-xs" />{annualStats.managerAnnualReviewDate ? formatDate(annualStats.managerAnnualReviewDate) : "Not Reviewed"}</p>
                  </div>
                  {annualStats.hasManagerAnnualReview && (
                    <div className="pt-2">
                      <button onClick={handleViewManagerAnnualReview} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#EF4444] text-white text-sm font-medium rounded-lg hover:bg-[#DC2626] transition-colors">
                        <FaEye className="text-xs" /> Preview Manager Review
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Final Submit to HR Card */}
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Final Submit to HR</h3>
                  <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center"><FaCheckCircle className="text-[#EF4444] text-sm" /></div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <p className={`text-sm font-medium inline-block px-2 py-1 rounded ${
                      annualStats.hasSubmittedToHR ? "text-green-600 bg-green-50" :
                      annualStats.hasManagerAnnualReview ? "text-[#EF4444] bg-red-50" : "text-gray-500 bg-gray-50"
                    }`}>
                      {annualStats.hasSubmittedToHR ? "Completed" : annualStats.hasManagerAnnualReview ? "Pending Submission" : "Waiting for Manager Review"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Submitted On</p>
                    <p className="text-sm font-medium flex items-center gap-1"><FaClock className="text-gray-400 text-xs" />{annualStats.submittedToHRDate ? formatDate(annualStats.submittedToHRDate) : "Not Submitted"}</p>
                  </div>
                  <div className="pt-2">
                    {annualStats.hasSubmittedToHR ? (
                      <span className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg"><FaCheck className="text-xs" /> Final Review Completed</span>
                    ) : annualStats.hasManagerAnnualReview && (
                      <button onClick={handleSubmitToHR} disabled={submitting} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#EF4444] text-white text-sm font-medium rounded-lg hover:bg-[#DC2626] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {submitting ? <FaSpinner className="animate-spin text-xs" /> : <FaPaperPlane className="text-xs" />} Submit to HR
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {annualReviewData && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Annual Review Process Timeline</h3>
                <div className="relative">
                  <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
                  <div className="absolute top-6 left-0 h-1 bg-[#EF4444] rounded-full transition-all duration-500" style={{ width: `${(annualStepStatus.step / 3) * 100}%` }}></div>
                  <div className="relative flex justify-between items-start">
                    {annualTimelineSteps.map((step) => {
                      const stepNumber = step.id;
                      let isCompleted = false;
                      let stepDate = null;
                      let stepStatus = "Pending";

                      if (step.key === "submitted_to_r1" && annualStats.hasSubmittedToR1) { isCompleted = true; stepDate = annualStats.submittedToR1Date; stepStatus = "Completed"; }
                      else if (step.key === "manager_annual_review" && annualStats.hasManagerAnnualReview) { isCompleted = true; stepDate = annualStats.managerAnnualReviewDate; stepStatus = "Completed"; }
                      else if (step.key === "final_submit_to_hr" && annualStats.hasSubmittedToHR) { isCompleted = true; stepDate = annualStats.submittedToHRDate; stepStatus = "Completed"; }

                      const isPending = !isCompleted && pendingAnnualStep === stepNumber;
                      const isInProgress = !isCompleted && ((step.key === "manager_annual_review" && annualStats.hasSubmittedToR1 && !annualStats.hasManagerAnnualReview) || (step.key === "final_submit_to_hr" && annualStats.hasManagerAnnualReview && !annualStats.hasSubmittedToHR));
                      if (isInProgress) stepStatus = "In Progress";

                      return (
                        <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 shadow-md ${
                            isCompleted ? "bg-[#EF4444] ring-4 ring-[#EF4444]/20" :
                            isInProgress ? "bg-yellow-500 ring-4 ring-yellow-200" :
                            isPending && blinkAnnualPending === stepNumber ? "bg-yellow-500 animate-pulse ring-4 ring-yellow-300" : "bg-gray-300 ring-4 ring-gray-100"
                          }`}>
                            {isCompleted ? <FaCheckCircle className="text-white text-xl" /> : <span className="text-white text-base font-bold">{step.id}</span>}
                          </div>
                          <span className={`text-sm font-semibold mb-1 text-center ${isCompleted ? "text-[#EF4444]" : isInProgress ? "text-yellow-700" : "text-gray-500"}`}>{step.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full mb-1 ${stepStatus === "Completed" ? "bg-green-100 text-green-700" : stepStatus === "In Progress" ? "bg-yellow-100 text-yellow-700 font-medium" : "bg-gray-100 text-gray-500"}`}>{stepStatus}</span>
                          {stepDate && <span className="text-xs text-gray-500 mt-1 text-center flex items-center gap-1"><FaCalendarAlt className="text-gray-400 text-xs" />{formatShortDate(stepDate)}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-center gap-6 text-xs border-t pt-6">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#EF4444] rounded-full"></div><span className="text-gray-600">Completed</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div><span className="text-gray-600">Pending / In Progress</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-300 rounded-full"></div><span className="text-gray-600">Not Started</span></div>
                </div>
              </div>
            )}

            {!annualReviewData && (
              <div className="mt-8 text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">Start your annual review process for FY {getFinancialYearDisplay()}</p>
                <button onClick={handleStartAnnualReview} className="px-6 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors">Start Annual Review</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen font-content bg-gray-50">
      <Header />
      <div className="mt-24 px-4 md:px-6 max-w-7xl mx-auto w-full pb-8">
        <nav className="flex items-center text-sm mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#EF4444] transition-colors mr-4 font-medium"
          >
            <FiArrowLeft size={16} />
            Back
          </button>
          <span className="text-gray-400">/</span>
          <span onClick={() => navigate("/dashboard")} className="cursor-pointer text-gray-600 hover:text-[#EF4444] transition-colors ml-2">Home</span>
          <span className="mx-2 text-gray-400">/</span>
          <span onClick={() => { setReviewType("quarterly"); const url = new URL(window.location); url.searchParams.set("type", "quarterly"); window.history.pushState({}, "", url); }} className={`cursor-pointer transition-colors ${reviewType === "quarterly" ? "font-semibold text-[#EF4444]" : "text-gray-600 hover:text-[#EF4444]"}`}>Quarterly Review</span>
          <span className="mx-2 text-gray-400">/</span>
          <span onClick={() => { setReviewType("annual"); const url = new URL(window.location); url.searchParams.set("type", "annual"); window.history.pushState({}, "", url); }} className={`cursor-pointer transition-colors ${reviewType === "annual" ? "font-semibold text-[#EF4444]" : "text-gray-600 hover:text-[#EF4444]"}`}>Annual Review</span>
        </nav>

        <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 border border-gray-200 w-fit">
          <button onClick={() => handleReviewTypeChange("quarterly")} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${reviewType === "quarterly" ? "bg-[#EF4444] text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>
            <div className="flex items-center gap-2"><FaCalendarAlt size={14} /> Quarterly Review</div>
          </button>
          <button onClick={() => handleReviewTypeChange("annual")} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${reviewType === "annual" ? "bg-[#EF4444] text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>
            <div className="flex items-center gap-2"><FaAward size={14} /> Annual Review</div>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#EF4444]/10 rounded-full flex items-center justify-center"><FaUser className="text-[#EF4444] text-2xl" /></div>
            <div><h1 className="text-2xl font-bold text-gray-800">{getEmployeeFullName(employeeData)}</h1><p className="text-gray-600">{employeeData?.designationName || "Designation"}</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2"><FaBuilding className="text-gray-400" /><div><p className="text-xs text-gray-500">Employee ID</p><p className="font-medium text-sm">{employeeData?.empCode || localStorage.getItem("empId") || empId}</p></div></div>
            <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /><div><p className="text-xs text-gray-500">Location</p><p className="font-medium text-sm">{employeeData?.location || "N/A"}</p></div></div>
            <div className="flex items-center gap-2"><FaBuilding className="text-gray-400" /><div><p className="text-xs text-gray-500">Department</p><p className="font-medium text-sm">{employeeData?.mainDepartment || "N/A"}</p></div></div>
            <div className="flex items-center gap-2"><FaBuilding className="text-gray-400" /><div><p className="text-xs text-gray-500">Sub Department</p><p className="font-medium text-sm">{employeeData?.subDept || "N/A"}</p></div></div>
            <div className="flex items-center gap-2"><FaBuilding className="text-gray-400" /><div><p className="text-xs text-gray-500">Project Name</p><p className="font-medium text-sm">{employeeData?.projectName || "N/A"}</p></div></div>
            <div className="flex items-center gap-2"><FaUserTie className="text-gray-400" /><div><p className="text-xs text-gray-500">Reporting To (R1)</p><p className="font-medium text-sm">{getManagerFullName(employeeData)}</p></div></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div><p className="text-sm text-gray-500">Financial Year</p><p className="text-lg font-semibold text-gray-800">{getFinancialYearDisplay()}</p></div>
            <div><p className="text-sm text-gray-500">Review Type</p><p className="text-lg font-semibold text-[#EF4444]">{reviewType === "quarterly" ? "Quarterly" : "Annual"}</p></div>
            {reviewType === "quarterly" && (<div><p className="text-sm text-gray-500">Current Quarter</p><p className="text-lg font-semibold text-[#EF4444]">{selectedQuarter}</p></div>)}
            {reviewType === "annual" && (<div><p className="text-sm text-gray-500">Quarterly Goals Progress</p><p className="text-lg font-semibold text-[#EF4444]">{Math.round(annualProgress)}%</p></div>)}
            {cycleEndDate && (<div><p className="text-sm text-gray-500">Cycle End Date</p><p className="text-lg font-semibold text-gray-800">{formatShortDate(cycleEndDate)}</p></div>)}
          </div>
        </div>

        {reviewType === "quarterly" ? renderQuarterlyReview() : renderAnnualReview()}
      </div>
    </div>
  );
};

export default EmployeeAppraisal;