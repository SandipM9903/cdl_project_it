import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiPlus,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiUserCheck,
  FiFileText,
  FiCheck,
  FiTrendingUp,
  FiCalendar,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLoader,
  FiChevronDown,
  FiChevronUp,
  FiUsers,
  FiTarget,
  FiChevronLeft,
  FiChevronRight,
  FiAward,
  FiBarChart2,
  FiGrid,
  FiList,
  FiAlertTriangle,
  FiMessageSquare,
  FiThumbsUp,
  FiStar,
  FiEdit2,
  FiX,
  FiBell,
  FiSave,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";
import Button from "../../components/common/Button";
import axios from "axios";
import Header from "../../../components/Header";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP } from "../../services/api";
import LoadingAnimation from "../../components/common/LoadingAnimation";

const getEmployeeFullName = (employee) => {
  if (!employee) return "Employee Name";

  // Check for fullNameAsAadhaar in employee
  if (employee.fullNameAsAadhaar && employee.fullNameAsAadhaar.trim() !== "") {
    return employee.fullNameAsAadhaar.trim();
  }

  // Fallback to firstName, middleName, lastName
  const firstName = employee.firstName || "";
  const middleName = employee.middleName || "";
  const lastName = employee.lastName || "";
  const fullName = `${firstName} ${middleName} ${lastName}`.trim().replace(/\s+/g, ' ');

  if (fullName && fullName !== "") {
    return fullName;
  }

  // Ultimate fallback to employee code if nothing else
  return employee.empCode || "Employee Name";
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
        return (
          <FiCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        );
      case "error":
        return (
          <FiAlertTriangle className="text-red-500 text-5xl mx-auto mb-4" />
        );
      case "warning":
        return (
          <FiAlertTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
        );
      default:
        return (
          <FiMessageSquare className="text-red-500 text-5xl mx-auto mb-4" />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full" style={{ animation: "fadeIn 0.2s ease-out" }}>
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
                onClick={onClose}
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

// Quarter Progress Card Component for Modal
const QuarterProgressCard = ({ quarter, data, onViewDetails }) => {
  const getStatusColor = () => {
    if (data.completed) return "bg-green-100 text-green-700 border-green-200";
    if (data.goalsCount > 0) return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-500 border-gray-200";
  };

  const getIcon = () => {
    if (data.completed) return <FiCheckCircle className="text-green-500" />;
    if (data.goalsCount > 0) return <FiClock className="text-red-500" />;
    return <FiCalendar className="text-gray-400" />;
  };

  return (
    <div className={`rounded-xl border p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="font-semibold text-gray-800">{quarter}</h3>
        </div>
        <span className="text-xs font-medium">{data.goalsCount} Goals</span>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Completion</span>
          <span>
            {data.completed
              ? "100%"
              : `${Math.round(data.goalsCount > 0 ? 50 : 0)}%`}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`rounded-full h-2 transition-all duration-500 ${data.completed ? "bg-green-500" : "bg-red-500"
              }`}
            style={{ width: data.completed ? "100%" : "0%" }}
          />
        </div>
      </div>
      {data.submittedDate && (
        <div className="text-xs text-gray-400 flex items-center gap-1 mb-3">
          <FiCalendar size={10} />
          <span>
            Submitted:{" "}
            {new Date(data.submittedDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })}
          </span>
        </div>
      )}
      <button
        onClick={() => onViewDetails(quarter)}
        className="w-full mt-2 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
      >
        <FiEye size={12} />
        View Details
      </button>
    </div>
  );
};

// Annual Review Status Badge
const AnnualStatusBadge = ({ status }) => {
  const getConfig = () => {
    switch (status) {
      case "COMPLETED":
      case "SUBMITTED_TO_HR":
        return {
          text: "Completed",
          color: "bg-green-100 text-green-700",
          icon: <FiCheckCircle size={12} />,
        };
      case "SUBMITTED_TO_EMPLOYEE":
        return {
          text: "Pending Employee",
          color: "bg-red-100 text-red-700",
          icon: <FiClock size={12} />,
        };
      case "SUBMITTED_TO_R1":
        return {
          text: "Review Submitted",
          color: "bg-yellow-100 text-yellow-700",
          icon: <FiUserCheck size={12} />,
        };
      case "DRAFT":
        return {
          text: "Draft",
          color: "bg-gray-100 text-gray-600",
          icon: <FiFileText size={12} />,
        };
      default:
        return {
          text: "Not Started",
          color: "bg-gray-100 text-gray-500",
          icon: <FiClock size={12} />,
        };
    }
  };

  const config = getConfig();
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {config.text}
    </span>
  );
};

// Preview Modal Component
const PreviewModal = ({ isOpen, onClose, reviewData, employeeName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" style={{ animation: "fadeIn 0.2s ease-out" }}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Annual Review Preview
            </h2>
            <p className="text-sm text-gray-500">Employee: {employeeName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {reviewData?.keyAccomplishment && (
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
                <FiFileText className="text-red-600" />
                Key Accomplishments
              </h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: reviewData.keyAccomplishment,
                }}
              />
            </div>
          )}
          {reviewData?.managerRating && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiStar className="text-red-500" />
                Manager Rating
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-800">
                  {reviewData.managerRating}
                </span>
                <span className="text-sm text-gray-500">
                  - Overall Performance Rating
                </span>
              </div>
            </div>
          )}
          {(reviewData?.achievementLevel ||
            reviewData?.potential ||
            reviewData?.performance ||
            reviewData?.talentResource) && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FiBarChart2 className="text-red-500" />
                  Talent Assessment
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {reviewData?.achievementLevel && (
                    <div>
                      <p className="text-xs text-gray-500">Achievement Level</p>
                      <p className="font-medium text-gray-800">
                        {reviewData.achievementLevel}
                      </p>
                    </div>
                  )}
                  {reviewData?.potential && (
                    <div>
                      <p className="text-xs text-gray-500">Potential</p>
                      <p className="font-medium text-gray-800">
                        {reviewData.potential}
                      </p>
                    </div>
                  )}
                  {reviewData?.performance && (
                    <div>
                      <p className="text-xs text-gray-500">Performance</p>
                      <p className="font-medium text-gray-800">
                        {reviewData.performance}
                      </p>
                    </div>
                  )}
                  {reviewData?.talentResource && (
                    <div>
                      <p className="text-xs text-gray-500">Talent Status</p>
                      <p className="font-medium text-gray-800">
                        {reviewData.talentResource}
                      </p>
                    </div>
                  )}
                </div>
                {reviewData?.matrixCategory && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Matrix Category</p>
                    <p className="font-semibold text-red-700">
                      {reviewData.matrixCategory}
                    </p>
                  </div>
                )}
              </div>
            )}
          {reviewData?.managerRemarks && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiMessageSquare className="text-red-500" />
                Manager's Remarks
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {reviewData.managerRemarks}
              </p>
            </div>
          )}
          {reviewData?.certifications && reviewData.certifications.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiAward className="text-red-500" />
                Certifications
              </h3>
              <div className="space-y-2">
                {reviewData.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <FiCheckCircle className="text-red-500 text-sm" />
                    <span className="text-gray-700">{cert.name}</span>
                    {cert.type && (
                      <span className="text-xs text-gray-500">
                        ({cert.type})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiCalendar className="text-gray-500" />
              Review Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <AnnualStatusBadge status={reviewData?.status} />
              </div>
              {reviewData?.submittedAt && (
                <div>
                  <p className="text-xs text-gray-500">Submitted Date</p>
                  <p className="text-sm text-gray-700">
                    {new Date(reviewData.submittedAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
              )}
              {reviewData?.managerAnnualReviewSubmissionDate && (
                <div>
                  <p className="text-xs text-gray-500">Manager Submitted</p>
                  <p className="text-sm text-gray-700">
                    {new Date(
                      reviewData.managerAnnualReviewSubmissionDate,
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
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

const AppraisalList = () => {
  const [activeTab, setActiveTab] = useState("Quarterly Goal");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerName, setManagerName] = useState("");
  const [quarterData, setQuarterData] = useState(null);
  const [annualData, setAnnualData] = useState(null);

  const [goalStatuses, setGoalStatuses] = useState({});
  const [approvalStatuses, setApprovalStatuses] = useState({});
  const [selfReviewStatuses, setSelfReviewStatuses] = useState({});
  const [finalReviewStatuses, setFinalReviewStatuses] = useState({});
  const [acceptanceStatuses, setAcceptanceStatuses] = useState({});

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [viewMode, setViewMode] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const isAnnual = !!annualData;
  const quarterParam = isAnnual ? "" : quarterData?.quarter;

  const [annualReviewStatuses, setAnnualReviewStatuses] = useState({});
  const [annualReviewData, setAnnualReviewData] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewEmployeeName, setPreviewEmployeeName] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const timelineSteps = [
    {
      id: 1,
      name: "Goal Creation",
      key: "goalCreation",
      icon: FiTarget,
      width: "w-36",
    },
    {
      id: 2,
      name: "Manager Approval",
      key: "managerApproval",
      icon: FiUserCheck,
      width: "w-36",
    },
    {
      id: 3,
      name: "Employee Review",
      key: "selfReview",
      icon: FiUser,
      width: "w-32",
    },
    {
      id: 4,
      name: "Manager Review",
      key: "finalReview",
      icon: FiStar,
      width: "w-32",
    },
    {
      id: 5,
      name: "Employee Acceptance",
      key: "acceptance",
      icon: FiCheckCircle,
      width: "w-36",
    },
  ];

  useEffect(() => {
    if (location.state?.quarterData) {
      setQuarterData(location.state.quarterData);
      setAnnualData(null);
      setActiveTab("Quarterly Goal");
    } else if (location.state?.annualData) {
      setAnnualData(location.state.annualData);
      setQuarterData(null);
      setActiveTab("Annual Review");
    } else {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      let quarter = "Q1";
      if (month >= 4 && month <= 6) quarter = "Q1";
      else if (month >= 7 && month <= 9) quarter = "Q2";
      else if (month >= 10 && month <= 12) quarter = "Q3";
      else quarter = "Q4";
      const year = currentDate.getFullYear();
      setQuarterData({
        quarter,
        year: `${year}-${year + 1}`,
        period: getQuarterPeriod(quarter),
      });
    }
  }, [location.state]);

  useEffect(() => {
    try {
      const email = localStorage.getItem("email");
      const employeeFullName = localStorage.getItem("EmployeeFullName");
      const employeeName = localStorage.getItem("EmployeeName");
      const firstName = localStorage.getItem("firstName");
      const lastName = localStorage.getItem("lastName");

      if (email) setManagerEmail(email.trim());
      if (employeeFullName) setManagerName(employeeFullName);
      else if (employeeName) setManagerName(employeeName);
      else if (firstName && lastName)
        setManagerName(`${firstName} ${lastName}`);
      else if (firstName) setManagerName(firstName);
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, employees, managerEmail]);

  useEffect(() => {
    if (filteredEmployees.length > 0 && (quarterData || annualData)) {
      if (isAnnual) {
        fetchAnnualReviewStatuses();
      } else {
        fetchAllStatuses();
      }
    }
  }, [filteredEmployees, quarterData, annualData]);

  useEffect(() => {
    const newTotalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    setTotalPages(newTotalPages > 0 ? newTotalPages : 1);
    if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(1);
  }, [filteredEmployees, itemsPerPage]);

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

  const getQuarterPeriod = (quarter) => {
    const currentYear = new Date().getFullYear();
    const periods = {
      Q1: `01 April - 30 June ${currentYear}`,
      Q2: `01 July - 30 September ${currentYear}`,
      Q3: `01 October - 31 December ${currentYear}`,
      Q4: `01 January - 31 March ${currentYear + 1}`,
    };
    return periods[quarter] || "";
  };

  const getQuarterDisplayName = (quarter) => {
    const quarterNames = {
      Q1: "Quarter 1 (Apr - Jun)",
      Q2: "Quarter 2 (Jul - Sep)",
      Q3: "Quarter 3 (Oct - Dec)",
      Q4: "Quarter 4 (Jan - Mar)",
    };
    return quarterNames[quarter] || quarter;
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const storedEmpCode = localStorage.getItem('empId');
      let response;
      try {
        response = await axios.get(`https://mycdl.cms.co.in/employee/team/hierarchy/${storedEmpCode}`);
      } catch (err) {
        console.warn("Hierarchy endpoint failed, falling back to team endpoint:", err);
        // response = await axios.get(`https://mycdl.cms.co.in/employee/team/${storedEmpCode}`);
      }

      const rawData = response.data?.teamList || response.data;

      if (rawData && Array.isArray(rawData)) {
        // Extract employee DTO from each item in the response
        const employeesData = rawData.map(item => {
          // Check if the data is wrapped in fileAndObjectTypeBean.empResDTO
          if (item.fileAndObjectTypeBean?.empResDTO) {
            return item.fileAndObjectTypeBean.empResDTO;
          }
          // Check for hierarchy wrapper
          if (item.empHierarchyResDTO) {
            return item.empHierarchyResDTO;
          }
          // Fallback: if it's already a flat structure
          return item;
        });

        console.log("Extracted employees:", employeesData);
        setEmployees(employeesData);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStatuses = async () => {
    const year = quarterData.year.split("-")[0];
    await Promise.all([
      fetchGoalStatuses(year),
      fetchApprovalStatuses(year),
      fetchSelfReviewStatuses(year),
      fetchFinalReviewStatuses(year),
      fetchAcceptanceStatuses(year),
    ]);
  };

  const fetchGoalStatuses = async (year) => {
    const statusMap = {};
    for (const employee of filteredEmployees) {
      const empCode = getEmployeeCode(employee);
      try {
        const response = await axios.get(
          `${BASE_URL_EPMS}/api/goals/employee/${empCode}/${quarterParam}?year=${year}`,
          { timeout: 3000 },
        );
        let goals = [];
        if (response.data?.data) goals = response.data.data;
        else if (Array.isArray(response.data)) goals = response.data;
        const hasGoals = goals.length > 0;
        const createdDate = goals.length > 0 ? goals[0]?.createdAt : null;
        let displayStatus = "Not Created";
        if (hasGoals) {
          const allStatuses = goals.map((g) => g.status);
          if (allStatuses.includes("ACCEPTED_BY_EMPLOYEE"))
            displayStatus = "Accepted";
          else if (allStatuses.includes("MANAGER_REVIEWED"))
            displayStatus = "Manager Reviewed";
          else if (allStatuses.includes("SELF_REVIEWED"))
            displayStatus = "Self Reviewed";
          else if (allStatuses.includes("APPROVED")) displayStatus = "Approved";
          else if (allStatuses.includes("PENDING_APPROVAL"))
            displayStatus = "Pending Approval";
          else if (allStatuses.includes("SENT_BACK"))
            displayStatus = "Sent Back";
          else displayStatus = "Created";
        }
        statusMap[empCode] = {
          status: displayStatus,
          hasGoals: hasGoals,
          createdDate: createdDate,
          goalsCount: goals.length,
        };
      } catch (error) {
        statusMap[empCode] = {
          status: "Not Created",
          hasGoals: false,
          createdDate: null,
          goalsCount: 0,
        };
      }
    }
    setGoalStatuses(statusMap);
  };

  const fetchApprovalStatuses = async (year) => {
    const statusMap = {};
    for (const employee of filteredEmployees) {
      const empCode = getEmployeeCode(employee);
      try {
        const response = await axios.get(
          `${BASE_URL_EPMS}/api/goals/employee/${empCode}/${quarterParam}?year=${year}`,
          { timeout: 3000 },
        );
        let goals = [];
        if (response.data?.data) goals = response.data.data;
        else if (Array.isArray(response.data)) goals = response.data;
        const hasPendingApproval = goals.some(
          (g) => g.status === "PENDING_APPROVAL",
        );
        const allApproved =
          goals.length > 0 &&
          goals.every(
            (g) =>
              g.status === "APPROVED" ||
              g.status === "SELF_REVIEWED" ||
              g.status === "MANAGER_REVIEWED" ||
              g.status === "ACCEPTED_BY_EMPLOYEE",
          );
        let approvalStatus = "No Goals";
        if (goals.length === 0) approvalStatus = "No Goals";
        else if (hasPendingApproval) approvalStatus = "Pending";
        else if (allApproved) approvalStatus = "Approved";
        else if (goals.some((g) => g.status === "APPROVED"))
          approvalStatus = "Partially Approved";
        const approvalDate = goals.find((g) => g.approvedAt)?.approvedAt ||
          goals.find((g) => g.status === "APPROVED")?.updatedAt ||
          goals.find((g) => g.status === "SELF_REVIEWED" || g.status === "MANAGER_REVIEWED" || g.status === "ACCEPTED_BY_EMPLOYEE")?.updatedAt;
        statusMap[empCode] = {
          status: approvalStatus,
          hasPendingApproval: hasPendingApproval,
          allApproved: allApproved,
          approvalDate: approvalDate,
        };
      } catch (error) {
        statusMap[empCode] = {
          status: "No Goals",
          hasPendingApproval: false,
          allApproved: false,
        };
      }
    }
    setApprovalStatuses(statusMap);
  };

  const fetchSelfReviewStatuses = async (year) => {
    const statusMap = {};
    for (const employee of filteredEmployees) {
      const empCode = getEmployeeCode(employee);
      try {
        const response = await axios.get(
          `${BASE_URL_EPMS}/api/goals/employee/${empCode}/${quarterParam}?year=${year}`,
          { timeout: 3000 },
        );
        let goals = [];
        if (response.data?.data) goals = response.data.data;
        else if (Array.isArray(response.data)) goals = response.data;
        const hasSelfReviewed = goals.some(
          (g) =>
            g.status === "SELF_REVIEWED" ||
            g.status === "MANAGER_REVIEWED" ||
            g.status === "ACCEPTED_BY_EMPLOYEE",
        );
        const selfReviewDate = goals.find((g) => g.selfReviewSubmittedDate)
          ?.selfReviewSubmittedDate;
        statusMap[empCode] = {
          status: hasSelfReviewed ? "Completed" : "Pending",
          hasSelfReviewed: hasSelfReviewed,
          selfReviewDate: selfReviewDate,
        };
      } catch (error) {
        statusMap[empCode] = {
          status: "Pending",
          hasSelfReviewed: false,
          selfReviewDate: null,
        };
      }
    }
    setSelfReviewStatuses(statusMap);
  };

  const fetchFinalReviewStatuses = async (year) => {
    const statusMap = {};
    for (const employee of filteredEmployees) {
      const empCode = getEmployeeCode(employee);
      try {
        const response = await axios.get(
          `${BASE_URL_EPMS}/api/goals/employee/${empCode}/${quarterParam}?year=${year}`,
          { timeout: 3000 },
        );
        let goals = [];
        if (response.data?.data) goals = response.data.data;
        else if (Array.isArray(response.data)) goals = response.data;
        const hasFinalReviewed = goals.some(
          (g) =>
            g.status === "MANAGER_REVIEWED" ||
            g.status === "ACCEPTED_BY_EMPLOYEE",
        );
        const finalReviewDate = goals.find((g) => g.reviewedAt)?.reviewedAt;
        statusMap[empCode] = {
          status: hasFinalReviewed ? "Completed" : "Pending",
          hasFinalReviewed: hasFinalReviewed,
          finalReviewDate: finalReviewDate,
        };
      } catch (error) {
        statusMap[empCode] = {
          status: "Pending",
          hasFinalReviewed: false,
          finalReviewDate: null,
        };
      }
    }
    setFinalReviewStatuses(statusMap);
  };

  const fetchAcceptanceStatuses = async (year) => {
    const statusMap = {};
    for (const employee of filteredEmployees) {
      const empCode = getEmployeeCode(employee);
      try {
        const response = await axios.get(
          `${BASE_URL_EPMS}/api/goals/employee/${empCode}/${quarterParam}?year=${year}`,
          { timeout: 3000 },
        );
        let goals = [];
        if (response.data?.data) goals = response.data.data;
        else if (Array.isArray(response.data)) goals = response.data;
        const hasAccepted = goals.some(
          (g) => g.status === "ACCEPTED_BY_EMPLOYEE",
        );
        const acceptedDate = goals.find((g) => g.selfAcceptedDate)
          ?.selfAcceptedDate;
        statusMap[empCode] = {
          status: hasAccepted ? "Accepted" : "Pending",
          hasAccepted: hasAccepted,
          acceptedDate: acceptedDate,
        };
      } catch (error) {
        statusMap[empCode] = {
          status: "Pending",
          hasAccepted: false,
          acceptedDate: null,
        };
      }
    }
    setAcceptanceStatuses(statusMap);
  };

  const fetchAnnualReviewStatuses = async () => {
    const year = annualData.year;
    const statusMap = {};
    const reviewDataMap = {};

    for (const employee of filteredEmployees) {
      const empCode = getEmployeeCode(employee);
      const quarterlyStatuses = {
        Q1: {
          completed: false,
          submittedDate: null,
          goalsCount: 0,
          status: "NOT_STARTED",
        },
        Q2: {
          completed: false,
          submittedDate: null,
          goalsCount: 0,
          status: "NOT_STARTED",
        },
        Q3: {
          completed: false,
          submittedDate: null,
          goalsCount: 0,
          status: "NOT_STARTED",
        },
        Q4: {
          completed: false,
          submittedDate: null,
          goalsCount: 0,
          status: "NOT_STARTED",
        },
      };

      const quarters = ["Q1", "Q2", "Q3", "Q4"];
      for (const quarter of quarters) {
        try {
          const response = await axios.get(
            `${BASE_URL_EPMS}/api/goals/employee/${empCode}/${quarter}?year=${year}`,
            { timeout: 3000 },
          );
          let goals = [];
          if (response.data?.data) goals = response.data.data;
          else if (Array.isArray(response.data)) goals = response.data;
          const hasSubmittedGoals = goals.length > 0;
          const allAccepted =
            goals.length > 0 &&
            goals.every((g) => g.status === "ACCEPTED_BY_EMPLOYEE");
          const submittedDates = goals
            .filter((g) => g.submittedToEmployeeAt)
            .map((g) => new Date(g.submittedToEmployeeAt));
          const latestSubmittedDate =
            submittedDates.length > 0
              ? new Date(Math.max(...submittedDates))
              : null;
          quarterlyStatuses[quarter] = {
            completed: allAccepted,
            submittedDate: latestSubmittedDate,
            goalsCount: goals.length,
            status: allAccepted
              ? "COMPLETED"
              : hasSubmittedGoals
                ? "IN_PROGRESS"
                : "NOT_STARTED",
          };
        } catch (error) {
          console.error(
            `Error fetching ${quarter} goals for ${empCode}:`,
            error,
          );
        }
      }

      try {
        const response = await axios.get(
          `${BASE_URL_EPMS}/api/annual-review/${empCode}/${year}`,
          { timeout: 3000 },
        );
        if (response.data) {
          reviewDataMap[empCode] = response.data;
        }
      } catch (error) {
        console.error(`Error fetching annual review for ${empCode}:`, error);
        reviewDataMap[empCode] = null;
      }
      statusMap[empCode] = quarterlyStatuses;
    }
    setAnnualReviewStatuses(statusMap);
    setAnnualReviewData(reviewDataMap);
  };

  const filterEmployees = () => {
    if (!managerEmail) {
      setFilteredEmployees([]);
      return;
    }

    let filtered = employees.filter((emp) => {
      const reportingEmail = emp.reportingManagerEmailId;
      return (
        !reportingEmail ||
        reportingEmail.toLowerCase().trim() === managerEmail.toLowerCase().trim()
      );
    });

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((emp) => {
        const fullName = getEmployeeFullName(emp);
        const empCode = emp.empCode ? emp.empCode.toString() : "";
        const emailId = emp.emailId || "";
        return (
          fullName.toLowerCase().includes(term) ||
          empCode.includes(term) ||
          emailId.toLowerCase().includes(term)
        );
      });
    }

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortConfig.key) {
        case "name":
          aValue = getEmployeeFullName(a);
          bValue = getEmployeeFullName(b);
          break;
        case "id":
          aValue = getEmployeeCode(a);
          bValue = getEmployeeCode(b);
          break;
        case "progress":
          aValue = calculateProgress(a);
          bValue = calculateProgress(b);
          break;
        default:
          aValue = getEmployeeFullName(a);
          bValue = getEmployeeFullName(b);
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredEmployees(filtered);
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const getCurrentPageEmployees = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const getEmployeeCode = (employee) => employee.empCode || employee.id;

  const getDesignation = (employee) =>
    employee?.designationResDTO?.designationName || employee?.designationName || employee?.designation || "Software Engineer";

  // Helper function to check if annual review is submitted to R1
  const isAnnualReviewSubmittedToR1 = (employee) => {
    const empCode = getEmployeeCode(employee);
    const review = annualReviewData[empCode];
    return review?.status === "SUBMITTED_TO_R1";
  };

  // Helper function to check if annual review is in DRAFT state with data
  const isAnnualReviewDraftWithData = (employee) => {
    const empCode = getEmployeeCode(employee);
    const review = annualReviewData[empCode];
    return (
      review?.status === "DRAFT" &&
      (review?.submittedAt || review?.managerRemarks || review?.achievementLevel || review?.potential || review?.performance) &&
      !review?.managerAnnualReviewSubmissionDate
    );
  };

  const calculateProgress = (employee) => {
    if (isAnnual) {
      const empCode = getEmployeeCode(employee);
      const statuses = annualReviewStatuses[empCode];
      if (!statuses) return 0;
      let completedCount = 0;
      if (statuses.Q1?.completed) completedCount++;
      if (statuses.Q2?.completed) completedCount++;
      if (statuses.Q3?.completed) completedCount++;
      if (statuses.Q4?.completed) completedCount++;
      const annualDataExists = annualReviewData[empCode] !== null;
      if (annualDataExists) completedCount++;
      return Math.min((completedCount / 5) * 100, 100);
    } else {
      const empCode = getEmployeeCode(employee);
      let completedSteps = 0;
      if (goalStatuses[empCode]?.hasGoals) completedSteps++;
      if (approvalStatuses[empCode]?.allApproved) completedSteps++;
      if (selfReviewStatuses[empCode]?.hasSelfReviewed) completedSteps++;
      if (finalReviewStatuses[empCode]?.hasFinalReviewed) completedSteps++;
      if (acceptanceStatuses[empCode]?.hasAccepted) completedSteps++;
      return (completedSteps / 5) * 100;
    }
  };

  const handlePreviewGoals = (employee) => {
    const year = quarterData.year.split("-")[0];
    navigate(
      `/manager/goal/preview/${getEmployeeCode(
        employee,
      )}?year=${year}&quarter=${quarterParam}`,
    );
  };

  const handleApproveGoals = (employee) => {
    const year = quarterData.year.split("-")[0];
    navigate(
      `/manager/goal/approve/${getEmployeeCode(
        employee,
      )}?year=${year}&quarter=${quarterParam}`,
    );
  };

  const handleFinalReview = (employee) => {
    const year = quarterData.year.split("-")[0];
    navigate(
      `/manager/goal/final-review/${getEmployeeCode(
        employee,
      )}?year=${year}&quarter=${quarterParam}`,
    );
  };

  const handlePreviewFinalReview = (employee) => {
    const year = quarterData.year.split("-")[0];
    navigate(
      `/manager/goal/final-review-preview/${getEmployeeCode(
        employee,
      )}?year=${year}&quarter=${quarterParam}`,
    );
  };

  const handleConductAnnualReview = (employee) => {
    navigate(
      `/manager/annual-review/${getEmployeeCode(employee)}?year=${annualData.year
      }`,
    );
  };

  const handleViewAnnualReview = (employee) => {
    navigate(
      `/manager/annual-review/preview/${getEmployeeCode(employee)}?year=${annualData.year
      }`,
    );
  };

  const handlePreviewAnnualReview = (employee) => {
    const empCode = getEmployeeCode(employee);
    const reviewData = annualReviewData[empCode];
    if (reviewData) {
      setPreviewData(reviewData);
      setPreviewEmployeeName(getEmployeeFullName(employee));
      setShowPreviewModal(true);
    }
  };

  const handleViewQuarterGoals = (employee, quarter) => {
    navigate(
      `/manager/goal/preview/${getEmployeeCode(employee)}?year=${annualData.year
      }&quarter=${quarter}`,
    );
  };

  const handleViewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
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

  const StepCell = ({ employee, stepKey }) => {
    const empCode = getEmployeeCode(employee);

    const getStepData = () => {
      switch (stepKey) {
        case "goalCreation":
          return {
            status: goalStatuses[empCode]?.status || "Not Created",
            completed: goalStatuses[empCode]?.hasGoals || false,
            date: goalStatuses[empCode]?.createdDate,
          };
        case "managerApproval":
          return {
            status: approvalStatuses[empCode]?.status || "No Goals",
            completed: approvalStatuses[empCode]?.allApproved || false,
            date: approvalStatuses[empCode]?.approvalDate,
          };
        case "selfReview":
          return {
            status: selfReviewStatuses[empCode]?.status || "Pending",
            completed: selfReviewStatuses[empCode]?.hasSelfReviewed || false,
            date: selfReviewStatuses[empCode]?.selfReviewDate,
          };
        case "finalReview":
          return {
            status: finalReviewStatuses[empCode]?.status || "Pending",
            completed: finalReviewStatuses[empCode]?.hasFinalReviewed || false,
            date: finalReviewStatuses[empCode]?.finalReviewDate,
          };
        case "acceptance":
          return {
            status: acceptanceStatuses[empCode]?.status || "Pending",
            completed: acceptanceStatuses[empCode]?.hasAccepted || false,
            date: acceptanceStatuses[empCode]?.acceptedDate,
          };
        default:
          return { status: "Pending", completed: false, date: null };
      }
    };

    const stepData = getStepData();
    const getStatusColor = () => {
      if (stepData.completed) return "bg-green-100 text-green-700";
      if (stepData.status === "Pending") return "bg-red-100 text-red-700";
      if (stepData.status === "Pending Approval")
        return "bg-red-100 text-red-700";
      if (stepData.status === "Sent Back") return "bg-red-100 text-red-700";
      if (stepData.status === "Not Created") return "bg-gray-100 text-gray-500";
      if (stepData.status === "No Goals") return "bg-gray-100 text-gray-500";
      return "bg-gray-100 text-gray-500";
    };

    const renderActionButton = () => {
      if (stepKey === "goalCreation" && stepData.completed) {
        return (
          <button
            onClick={() => handlePreviewGoals(employee)}
            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
            title="Preview Goals"
          >
            <FiEye size={14} />
          </button>
        );
      }
      if (
        stepKey === "managerApproval" &&
        approvalStatuses[empCode]?.hasPendingApproval
      ) {
        return (
          <button
            onClick={() => handleApproveGoals(employee)}
            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
            title="Approve Goals"
          >
            <FiCheck size={14} />
          </button>
        );
      }
      if (
        stepKey === "managerApproval" &&
        stepData.completed &&
        !approvalStatuses[empCode]?.hasPendingApproval
      ) {
        return (
          <button
            onClick={() => handlePreviewGoals(employee)}
            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
            title="View Goals"
          >
            <FiEye size={14} />
          </button>
        );
      }
      if (
        stepKey === "finalReview" &&
        selfReviewStatuses[empCode]?.hasSelfReviewed &&
        !finalReviewStatuses[empCode]?.hasFinalReviewed
      ) {
        return (
          <button
            onClick={() => handleFinalReview(employee)}
            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
            title="Add Final Review"
          >
            <FiPlus size={14} />
          </button>
        );
      }
      if (stepKey === "finalReview" && stepData.completed) {
        return (
          <button
            onClick={() => handlePreviewFinalReview(employee)}
            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
            title="Preview Final Review"
          >
            <FiEye size={14} />
          </button>
        );
      }
      if (stepKey === "selfReview" && stepData.completed) {
        return (
          <button
            onClick={() => handlePreviewGoals(employee)}
            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
            title="View Self Review"
          >
            <FiEye size={14} />
          </button>
        );
      }
      if (stepKey === "acceptance" && stepData.completed) {
        return (
          <button
            onClick={() => handlePreviewFinalReview(employee)}
            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
            title="View Accepted Review"
          >
            <FiEye size={14} />
          </button>
        );
      }
      return null;
    };

    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
        >
          {stepData.completed ? (
            <FiCheckCircle size={12} />
          ) : (
            <FiClock size={12} />
          )}
          <span>{stepData.status}</span>
        </div>
        {stepData.date && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FiCalendar size={10} />
            <span>{formatDate(stepData.date)}</span>
          </div>
        )}
        <div className="flex gap-1 mt-1">{renderActionButton()}</div>
      </div>
    );
  };

  const ProgressBar = ({ progress }) => {
    const getProgressColor = () => {
      if (progress === 100) return "bg-green-500";
      if (progress >= 75) return "bg-emerald-500";
      if (progress >= 50) return "bg-red-500";
      if (progress >= 25) return "bg-red-400";
      return "bg-red-300";
    };
    return (
      <div className="w-24">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`rounded-full h-2 transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md text-sm"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md text-sm"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredEmployees.length)}
              </span>{" "}
              of <span className="font-medium">{filteredEmployees.length}</span>{" "}
              results
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Rows per page:</label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page
                      ? "bg-red-600 text-white"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const renderAnnualDashboard = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      );
    }

    if (filteredEmployees.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No employees found
          </h3>
          <p className="text-gray-500">
            {!managerEmail
              ? "Manager email not found."
              : searchTerm
                ? "Try adjusting your search criteria"
                : "No employees are reporting to you"}
          </p>
        </div>
      );
    }

    const currentEmployees = getCurrentPageEmployees();

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left sticky left-0 bg-gray-50 z-10">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-red-600"
                  >
                    Employee{" "}
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "asc" ? (
                        <FiChevronUp size={14} />
                      ) : (
                        <FiChevronDown size={14} />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3 text-center">Q1</th>
                <th className="px-4 py-3 text-center">Q2</th>
                <th className="px-4 py-3 text-center">Q3</th>
                <th className="px-4 py-3 text-center">Q4</th>
                <th className="px-4 py-3 text-center">Annual Review</th>
                <th className="px-4 py-3 text-center">Overall Progress</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentEmployees.map((employee) => {
                const empCode = getEmployeeCode(employee);
                const overallProgress = calculateProgress(employee);
                const annualReview = annualReviewData[empCode];
                const annualStatus = annualReview?.status || "NOT_STARTED";
                const quarterStatuses = annualReviewStatuses[empCode] || {};
                const hasSubmittedToR1 = isAnnualReviewSubmittedToR1(employee);
                const isDraftWithData = isAnnualReviewDraftWithData(employee);

                return (
                  <tr
                    key={empCode}
                    className="hover:bg-red-50/30 transition-colors"
                  >
                    <td className="px-4 py-3 sticky left-0 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            {getEmployeeFullName(employee)
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          {/* Notification Dot for SUBMITTED_TO_R1 status */}
                          {hasSubmittedToR1 && (
                            <div className="absolute -top-1 -right-1">
                              <div className="relative">
                                <div className="w-3.5 h-3.5 bg-green-500 rounded-full" style={{ animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite" }}></div>
                                <div className="absolute inset-0 w-3.5 h-3.5 bg-green-500 rounded-full" style={{ animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite", opacity: 0.75 }}></div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {getEmployeeFullName(employee)}
                          </div>
                          <div className="text-xs text-gray-500">{empCode}</div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {getDesignation(employee)}
                          </div>
                        </div>
                      </div>
                    </td>
                    {["Q1", "Q2", "Q3", "Q4"].map((quarter) => {
                      const qData = quarterStatuses[quarter] || {};
                      const isCompleted = qData.completed;
                      return (
                        <td key={quarter} className="px-4 py-3 text-center">
                          <button
                            onClick={() =>
                              handleViewQuarterGoals(employee, quarter)
                            }
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${isCompleted
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : qData.goalsCount > 0
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }`}
                          >
                            {isCompleted ? (
                              <FiCheckCircle size={12} />
                            ) : (
                              <FiClock size={12} />
                            )}
                            {isCompleted
                              ? "Completed"
                              : qData.goalsCount > 0
                                ? "In Progress"
                                : "Not Started"}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center">
                      {annualStatus === "COMPLETED" ||
                        annualStatus === "SUBMITTED_TO_HR" ? (
                        <button
                          onClick={() => handleViewAnnualReview(employee)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-all duration-200 hover:scale-105"
                        >
                          <FiCheckCircle size={12} /> Completed
                        </button>
                      ) : annualStatus === "SUBMITTED_TO_EMPLOYEE" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <FiClock size={12} /> Pending Employee
                        </span>
                      ) : annualStatus === "SUBMITTED_TO_R1" ? (
                        <button
                          onClick={() => handleConductAnnualReview(employee)}
                          className="group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:text-yellow-800 transition-all duration-200 hover:scale-105 hover:shadow-md"
                          style={{ animation: "softPulse 1.5s ease-in-out infinite" }}
                        >
                          <FiUserCheck
                            size={14}
                            className="group-hover:animate-pulse"
                          />
                          <span>Review Submitted</span>
                          <FiArrowRight
                            size={12}
                            className="opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1"
                          />
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            Click to submit manager review
                          </span>
                        </button>
                      ) : isDraftWithData ? (
                        <button
                          onClick={() => handleConductAnnualReview(employee)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                          title="Click to edit/continue your review draft"
                        >
                          <FiEdit2 size={12} /> Edit Draft
                        </button>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-400 cursor-not-allowed transition-colors"
                          title="Pending employee self review submission"
                        >
                          <FiEdit2 size={12} /> Conduct Review
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${overallProgress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {Math.round(overallProgress)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {annualStatus === "SUBMITTED_TO_R1" && (
                          <>
                            <button
                              onClick={() => handlePreviewAnnualReview(employee)}
                              className="p-2 rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200 hover:scale-110"
                              title="View Submitted Review"
                            >
                              <FiEye size={18} />
                            </button>
                            <button
                              onClick={() => handleConductAnnualReview(employee)}
                              className="p-2 rounded-md text-yellow-600 bg-yellow-50 hover:bg-yellow-100 transition-all duration-200 hover:scale-110"
                              title="Conduct Review"
                            >
                              <FiEdit2 size={18} />
                            </button>
                          </>
                        )}
                        {isDraftWithData && (
                          <>
                            <button
                              onClick={() => handlePreviewAnnualReview(employee)}
                              className="p-2 rounded-md text-gray-600 bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                              title="Preview Draft Review"
                            >
                              <FiEye size={18} />
                            </button>
                            <button
                              onClick={() => handleConductAnnualReview(employee)}
                              className="p-2 rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:scale-110"
                              title="Edit Draft Review"
                            >
                              <FiEdit2 size={18} />
                            </button>
                          </>
                        )}
                        {(annualStatus === "COMPLETED" ||
                          annualStatus === "SUBMITTED_TO_HR") && (
                            <button
                              onClick={() => handlePreviewAnnualReview(employee)}
                              className="p-2 rounded-md text-green-600 bg-green-50 hover:bg-green-100 transition-all duration-200 hover:scale-110"
                              title="View Completed Review"
                            >
                              <FiCheck size={18} />
                            </button>
                          )}
                        {annualStatus === "SUBMITTED_TO_EMPLOYEE" && (
                          <button
                            onClick={() => handlePreviewAnnualReview(employee)}
                            className="p-2 rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200 hover:scale-110"
                            title="Preview Employee Response"
                          >
                            <FiEye size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination />
      </div>
    );
  };

  const renderQuarterlyDashboard = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      );
    }

    if (filteredEmployees.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No employees found
          </h3>
          <p className="text-gray-500">
            {!managerEmail
              ? "Manager email not found."
              : searchTerm
                ? "Try adjusting your search criteria"
                : "No employees are reporting to you"}
          </p>
        </div>
      );
    }

    const currentEmployees = getCurrentPageEmployees();

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left sticky left-0 bg-gray-50 z-10">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-red-600"
                  >
                    Employee{" "}
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "asc" ? (
                        <FiChevronUp size={14} />
                      ) : (
                        <FiChevronDown size={14} />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSort("progress")}
                    className="flex items-center justify-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-red-600"
                  >
                    Progress
                  </button>
                </th>
                {timelineSteps.map((step) => (
                  <th
                    key={step.id}
                    className={`px-4 py-3 text-center ${step.width}`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <step.icon className="text-gray-400 text-sm" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {step.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentEmployees.map((employee) => {
                const empCode = getEmployeeCode(employee);
                const progress = calculateProgress(employee);
                return (
                  <tr
                    key={empCode}
                    className="hover:bg-red-50/30 transition-colors"
                  >
                    <td className="px-4 py-3 sticky left-0 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
                          {getEmployeeFullName(employee)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {getEmployeeFullName(employee)}
                          </div>
                          <div className="text-xs text-gray-500">{empCode}</div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {getDesignation(employee)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ProgressBar progress={progress} />
                    </td>
                    <td className="px-4 py-3">
                      <StepCell employee={employee} stepKey="goalCreation" />
                    </td>
                    <td className="px-4 py-3">
                      <StepCell employee={employee} stepKey="managerApproval" />
                    </td>
                    <td className="px-4 py-3">
                      <StepCell employee={employee} stepKey="selfReview" />
                    </td>
                    <td className="px-4 py-3">
                      <StepCell employee={employee} stepKey="finalReview" />
                    </td>
                    <td className="px-4 py-3">
                      <StepCell employee={employee} stepKey="acceptance" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination />
      </div>
    );
  };

  if (!quarterData && !annualData) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading Performance Details..." />
        </div>
      </div>
    );
  }

  // Get financial year display
  const getFinancialYearDisplay = () => {
    if (isAnnual && annualData?.year) {
      const year = annualData.year;
      return `${year}-${parseInt(year) + 1}`;
    }
    if (quarterData?.year) {
      return quarterData.year;
    }
    return "N/A";
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="px-4 md:px-6 py-6 max-w-[1600px] mx-auto">
        <nav className="flex items-center text-sm mb-6 mt-20">
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
          <span className="font-semibold text-red-600">Performance List</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {isAnnual ? "Annual Review Dashboard" : "Team"}
          </h1>
          {managerName && (
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-red-600 text-xs" />
                </div>
                <span>Manager: {managerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMail className="text-gray-400 text-xs" />
                <span>{managerEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="text-gray-400 text-xs" />
                <span>{filteredEmployees.length} Team Member(s)</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {isAnnual ? (
                    <FiAward className="text-red-100 text-sm" />
                  ) : (
                    <FiTrendingUp className="text-red-100 text-sm" />
                  )}
                  <p className="text-red-100 text-xs font-medium">
                    Financial Year
                  </p>
                </div>
                <h2 className="text-white text-xl font-bold">
                  {isAnnual
                    ? `Annual Performance Review ${getFinancialYearDisplay()}`
                    : getQuarterDisplayName(quarterData.quarter)}
                </h2>
                <p className="text-red-100 text-xs mt-1">
                  {quarterData ? quarterData.period : "Full Year Assessment"}
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                  <p className="text-red-100 text-xs font-medium">
                    Financial Year
                  </p>
                  <p className="text-white font-bold">
                    {getFinancialYearDisplay()}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                  <p className="text-red-100 text-xs font-medium">
                    Review Type
                  </p>
                  <p className="text-white font-bold">
                    {quarterData ? "Quarterly" : "Annual"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by employee name, ID, or email..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors text-gray-700 hover:text-red-600">
              <FiFilter size={16} /> Filter
            </button>
          </div>
        </div>

        {isAnnual ? renderAnnualDashboard() : renderQuarterlyDashboard()}
      </div>

      {showDetailsModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ animation: "fadeIn 0.2s ease-out" }}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                  {getEmployeeFullName(selectedEmployee)
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {getEmployeeFullName(selectedEmployee)}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {getEmployeeCode(selectedEmployee)} •{" "}
                    {getDesignation(selectedEmployee)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quarterly Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {["Q1", "Q2", "Q3", "Q4"].map((quarter) => {
                  const empCode = getEmployeeCode(selectedEmployee);
                  const qData = annualReviewStatuses[empCode]?.[quarter] || {
                    completed: false,
                    goalsCount: 0,
                    submittedDate: null,
                  };
                  return (
                    <QuarterProgressCard
                      key={quarter}
                      quarter={quarter}
                      data={{
                        completed: qData.completed,
                        goalsCount: qData.goalsCount,
                        submittedDate: qData.submittedDate,
                      }}
                      onViewDetails={() =>
                        handleViewQuarterGoals(selectedEmployee, quarter)
                      }
                    />
                  );
                })}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Annual Review Status
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                {annualReviewData[getEmployeeCode(selectedEmployee)] ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <FiFileText className="text-gray-400" />
                        <span className="text-gray-600">Review Status:</span>
                        <AnnualStatusBadge
                          status={
                            annualReviewData[getEmployeeCode(selectedEmployee)]
                              ?.status
                          }
                        />
                      </div>
                      {annualReviewData[getEmployeeCode(selectedEmployee)]
                        ?.managerAnnualReviewSubmissionDate && (
                          <div className="flex items-center gap-2">
                            <FiCalendar className="text-gray-400" />
                            <span className="text-gray-600">
                              Manager Submitted:
                            </span>
                            <span className="text-sm">
                              {new Date(
                                annualReviewData[
                                  getEmployeeCode(selectedEmployee)
                                ].managerAnnualReviewSubmissionDate,
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleConductAnnualReview(selectedEmployee);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <FiEdit2 size={14} />
                        {annualReviewData[getEmployeeCode(selectedEmployee)]
                          ?.status === "SUBMITTED_TO_EMPLOYEE"
                          ? "Review Employee Response"
                          : "Conduct Annual Review"}
                      </button>
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleViewAnnualReview(selectedEmployee);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors flex items-center gap-2 text-gray-700 hover:text-red-600"
                      >
                        <FiEye size={14} /> Preview Review
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiAlertTriangle className="text-gray-300 text-5xl mx-auto mb-3" />
                    <p className="text-gray-500">
                      No annual review started for this employee
                    </p>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleConductAnnualReview(selectedEmployee);
                      }}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Start Annual Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        reviewData={previewData}
        employeeName={previewEmployeeName}
      />
      <CustomModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      {/* CSS styles moved to inline styles to avoid jsx attribute warning */}
      <style dangerouslySetInnerHTML={{
        __html: `
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
          
          @keyframes ping {
            75%,
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          
          @keyframes softPulse {
            0% {
              box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4);
              transform: scale(1);
            }
            50% {
              box-shadow: 0 0 0 8px rgba(234, 179, 8, 0.2);
              transform: scale(1.02);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(234, 179, 8, 0);
              transform: scale(1);
            }
          }
        `
      }} />
    </div>
  );
};

export default AppraisalList;