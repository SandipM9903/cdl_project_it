import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaCheck,
  FaArrowLeft,
  FaExclamationTriangle,
  FaUser,
  FaStar,
  FaComment,
  FaChartLine,
  FaBolt,
  FaGem,
  FaPercent,
  FaCalendar,
  FaEye,
  FaInfoCircle,
  FaThumbsUp,
  FaBookOpen,
  FaTarget
} from "react-icons/fa";
import {
  FiTarget,
  FiBookOpen,
  FiArrowLeft
} from "react-icons/fi";
import axios from "axios";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP } from "../../services/api";

// Helper function to get employee full name with priority to fullNameAsAadhaar
const getEmployeeFullName = (employeeData) => {
  if (!employeeData) return "Employee Name";

  // Check localStorage first for EmployeeFullName
  const localStorageFullName = localStorage.getItem("EmployeeFullName");
  if (localStorageFullName && localStorageFullName.trim() !== "") {
    return localStorageFullName.trim();
  }

  // Check for fullNameAsAadhaar in employeeData
  if (employeeData.fullNameAsAadhaar && employeeData.fullNameAsAadhaar.trim() !== "") {
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

const EmployeeFinalAcceptance = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const quarter = searchParams.get('quarter');
  const year = searchParams.get('year');
  const employeeId = localStorage.getItem('empId') || empId;

  const [employeeData, setEmployeeData] = useState(null);
  const [smartGoals, setSmartGoals] = useState([]);
  const [developmentGoals, setDevelopmentGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Add this missing state declaration
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const [stats, setStats] = useState({
    totalSmartGoals: 0,
    totalDevGoals: 0,
    smartManagerReviewed: 0,
    devManagerReviewed: 0,
    allManagerReviewed: false,
    overallSelfRating: 0,
    overallManagerRating: 0,
    overallSelfComments: "",
    overallManagerComments: ""
  });

  const hasSmartGoals = smartGoals.length > 0;
  const hasDevelopmentGoals = developmentGoals.length > 0;

  // Determine available sections
  const availableSections = [];
  if (hasSmartGoals) availableSections.push({ name: "SMART Goals", key: "smart", icon: FiTarget });
  if (hasDevelopmentGoals) availableSections.push({ name: "Development Goals", key: "development", icon: FiBookOpen });

  const currentSection = availableSections[activeSectionIndex];
  const isFirstSection = activeSectionIndex === 0;
  const isLastSection = activeSectionIndex === availableSections.length - 1;

  const handleNextSection = () => {
    if (!isLastSection && availableSections.length > 0) {
      setActiveSectionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevSection = () => {
    if (!isFirstSection && availableSections.length > 0) {
      setActiveSectionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!employeeId || !quarter || !year) {
        setError("Missing required parameters");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        await fetchEmployeeDetails();
        await fetchSmartGoals();
        await fetchDevelopmentGoals();
        window.scrollTo(0, 0);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId, quarter, year]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(BASE_URL_EPMS_EMP);
      const employees = response.data;
      const employee = employees.find(
        (emp) => emp.empCode.toString() === employeeId?.toString()
      );
      if (employee) {
        setEmployeeData(employee);
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
    }
  };

  const fetchSmartGoals = async () => {
    try {
      const url = `${BASE_URL_EPMS}/api/goals/employee/${employeeId}/${quarter}?year=${year}`;
      console.log("Fetching SMART goals from:", url);

      const response = await axios.get(url);

      let goalsData = [];
      if (response.data && response.data.data) {
        goalsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        goalsData = response.data;
      }

      // Filter only goals that are MANAGER_REVIEWED (ready for acceptance)
      const managerReviewedSmartGoals = goalsData.filter(g =>
        g.status === "MANAGER_REVIEWED"
      );

      setSmartGoals(managerReviewedSmartGoals);

      // Get overall data from first SMART goal
      const firstGoal = managerReviewedSmartGoals[0];

      setStats(prev => ({
        ...prev,
        totalSmartGoals: goalsData.filter(g => g.goalType === "SMART" || g.goalType === undefined).length,
        smartManagerReviewed: managerReviewedSmartGoals.length,
        overallSelfRating: firstGoal?.overallSelfAssessmentRating || 0,
        overallManagerRating: firstGoal?.managerOverallSelfAssessmentRating || 0,
        overallSelfComments: firstGoal?.overallSelfReviewComments || "",
        overallManagerComments: firstGoal?.managerOverallSelfReviewComments || ""
      }));
    } catch (err) {
      console.error("Error fetching SMART goals:", err);
      throw new Error("Failed to fetch SMART goals");
    }
  };

  const fetchDevelopmentGoals = async () => {
    try {
      const url = `${BASE_URL_EPMS}/api/development-goals/employee/${employeeId}/${quarter}?year=${year}`;
      console.log("Fetching Development goals from:", url);

      const response = await axios.get(url);

      let devGoalsData = [];
      if (response.data && response.data.data) {
        devGoalsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        devGoalsData = response.data;
      }

      // Filter only development goals that are MANAGER_REVIEWED
      const managerReviewedDevGoals = devGoalsData.filter(g =>
        g.status === "MANAGER_REVIEWED"
      );

      setDevelopmentGoals(managerReviewedDevGoals);

      setStats(prev => ({
        ...prev,
        totalDevGoals: devGoalsData.length,
        devManagerReviewed: managerReviewedDevGoals.length,
        allManagerReviewed: (prev.smartManagerReviewed === prev.totalSmartGoals || prev.totalSmartGoals === 0) &&
          (managerReviewedDevGoals.length === devGoalsData.length || devGoalsData.length === 0)
      }));
    } catch (err) {
      console.error("Error fetching development goals:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQuarterDates = (quarterVal, yearVal) => {
    const yearNum = parseInt(yearVal) || new Date().getFullYear();
    const quarterDates = {
      'Q1': `01-Apr-${yearNum} to 30-Jun-${yearNum}`,
      'Q2': `01-Jul-${yearNum} to 30-Sep-${yearNum}`,
      'Q3': `01-Oct-${yearNum} to 31-Dec-${yearNum}`,
      'Q4': `01-Jan-${yearNum + 1} to 31-Mar-${yearNum + 1}`
    };
    return quarterDates[quarterVal] || '';
  };

  const getStatusBadge = (status) => {
    const colors = {
      'MANAGER_REVIEWED': 'bg-green-100 text-green-800',
      'APPROVED': 'bg-blue-100 text-blue-800',
      'PENDING_APPROVAL': 'bg-yellow-100 text-yellow-800',
      'SENT_BACK': 'bg-red-100 text-red-800',
      'SELF_REVIEWED': 'bg-purple-100 text-purple-800',
      'ACCEPTED_BY_EMPLOYEE': 'bg-green-100 text-green-800'
    };
    const displayNames = {
      'MANAGER_REVIEWED': 'Manager Reviewed',
      'APPROVED': 'Approved',
      'PENDING_APPROVAL': 'Pending Approval',
      'SENT_BACK': 'Sent Back',
      'SELF_REVIEWED': 'Self Reviewed',
      'ACCEPTED_BY_EMPLOYEE': 'Accepted'
    };
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {displayNames[status] || status}
      </span>
    );
  };

  const handleGoBack = () => {
    if (empId && quarter && year) {
      navigate(`/employee/goal/preview/${empId}?year=${year}&quarter=${quarter}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleAccept = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Accept SMART goals
      if (smartGoals.length > 0) {
        const smartUrl = `${BASE_URL_EPMS}/api/goals/employee/accept/${employeeId}/${quarter}?year=${year}`;
        console.log("Accepting SMART goals with URL:", smartUrl);
        await axios.put(smartUrl);
      }

      // Accept Development goals
      for (const goal of developmentGoals) {
        const devUrl = `${BASE_URL_EPMS}/api/development-goals/accept/${goal.id}`;
        console.log("Accepting Development goal:", devUrl);
        await axios.put(devUrl);
      }

      // ✅ ADD EMAIL NOTIFICATION AFTER ACCEPTANCE
      try {
        const emailPayload = {
          employeeId: employeeId,
          managerEmailId: employeeData?.reportingManagerEmailId,
          employeeName: getEmployeeFullName(employeeData),
          managerName: employeeData?.reportingManager || "Manager",
          quarter: quarter,
          year: year,
          financialYear: `${year}-${parseInt(year) + 1}`,
          acceptanceDate: new Date().toLocaleDateString('en-GB'),
          acceptanceTime: new Date().toLocaleTimeString('en-GB')
        };

        // Call backend API to send acceptance notification
        await axios.post(`${BASE_URL_EPMS}/api/email/acceptance-notification`, emailPayload);
        console.log("Acceptance email notification sent");
      } catch (emailErr) {
        console.error("Failed to send acceptance email:", emailErr);
        // Don't fail the acceptance if email fails
      }

      setSuccess(true);
      setShowConfirmModal(false);

      setTimeout(() => {
        navigate(`/Dashboard`);
      }, 2000);

    } catch (err) {
      console.error("Acceptance error:", err);
      setError(err.response?.data?.message || "Failed to accept the appraisal. Please try again.");
      setShowConfirmModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  // Star rating component
  const StarRating = ({ rating, size = "sm" }) => {
    const starSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${starSizes[size]} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const ProgressIndicator = () => {
    if (availableSections.length <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-3 mb-6">
        {availableSections.map((section, idx) => (
          <button
            key={section.key}
            onClick={() => {
              setActiveSectionIndex(idx);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeSectionIndex === idx
                ? "bg-red-600 text-white shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
          >
            {React.createElement(section.icon, { size: 14 })}
            <span className="text-sm font-medium">{section.name}</span>
            {activeSectionIndex > idx && (
              <FaCheckCircle size={14} className="text-white" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const NavigationButtons = () => {
    // If no sections, show only the accept button
    if (availableSections.length === 0) {
      return (
        <div className="flex justify-end pt-6 mt-4 border-t border-gray-200">
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl shadow-md text-sm font-medium text-white transition-all flex items-center gap-2 bg-green-600 hover:bg-green-700 cursor-pointer"
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FaThumbsUp />
                Accept & Complete
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-200">
        <button
          onClick={handlePrevSection}
          disabled={isFirstSection}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${!isFirstSection
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          <FaArrowLeft size={14} />
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
            <FaArrowLeft className="rotate-180" size={14} />
          </button>
        ) : (
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl shadow-md text-sm font-medium text-white transition-all flex items-center gap-2 bg-green-600 hover:bg-green-700 cursor-pointer"
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FaThumbsUp />
                Accept & Complete
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  const totalGoals = stats.totalSmartGoals + stats.totalDevGoals;
  const totalReviewed = stats.smartManagerReviewed + stats.devManagerReviewed;
  const progressPercent = totalGoals > 0 ? (totalReviewed / totalGoals) * 100 : 0;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading Performance Details..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-content bg-gray-50">
      <Header />

      <div className="mt-24 px-4 md:px-6 max-w-7xl mx-auto w-full pb-10">
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
            My Performance
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600">Final Acceptance</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Final Acceptance
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Quarter {quarter} · {year} ({getQuarterDates(quarter, year)})
              </p>
            </div>
          </div>
        </div>

        {/* Employee Profile Card */}
        {employeeData && (
          <div className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden border border-gray-100">
            <div className="bg-red-600 px-6 py-3">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <FaUser />
                Employee Information
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center shadow-inner">
                  <FaUser className="text-red-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {getEmployeeFullName(employeeData)}
                  </h3>
                  <p className="text-gray-500">{employeeData?.designationName || "Designation"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 flex items-center">
            <FaCheckCircle className="text-green-500 text-3xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">Successfully Accepted!</h3>
              <p className="text-sm text-green-600">Your appraisal has been accepted. Redirecting...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !success && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start">
            <FaExclamationTriangle className="text-red-500 text-xl mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!success && (
          <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Progress Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Review Progress</h3>
                  <FaCheckCircle className={totalGoals === totalReviewed ? 'text-green-500' : 'text-yellow-500'} />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{totalReviewed}/{totalGoals}</p>
                    <p className="text-xs text-gray-500">Goals Reviewed</p>
                  </div>
                  {totalGoals === totalReviewed && totalGoals > 0 ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      All Reviewed
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      In Progress
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-500 rounded-full h-1.5 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Self Rating Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Your Overall Rating</h3>
                  <FaStar className="text-yellow-500" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.overallSelfRating}</p>
                    <p className="text-xs text-gray-500">out of 5</p>
                  </div>
                  <StarRating rating={stats.overallSelfRating} size="md" />
                </div>
              </div>

              {/* Manager Rating Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Manager's Overall Rating</h3>
                  <FaUser className="text-red-600" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stats.overallManagerRating}</p>
                    <p className="text-xs text-gray-500">out of 5</p>
                  </div>
                  <StarRating rating={stats.overallManagerRating} size="md" />
                </div>
              </div>
            </div>

            {/* Overall Comments Section */}
            {(stats.overallSelfComments || stats.overallManagerComments) && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaComment className="text-red-600" />
                  Overall Assessment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stats.overallSelfComments && (
                    <div>
                      <div className="flex items-center mb-2">
                        <FaStar className="text-yellow-500 mr-2 text-sm" />
                        <h3 className="text-sm font-medium text-gray-700">Your Comments</h3>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-700">{stats.overallSelfComments}</p>
                      </div>
                    </div>
                  )}

                  {stats.overallManagerComments && (
                    <div>
                      <div className="flex items-center mb-2">
                        <FaUser className="text-red-600 mr-2 text-sm" />
                        <h3 className="text-sm font-medium text-gray-700">Manager's Comments</h3>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <p className="text-sm text-gray-700">{stats.overallManagerComments}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            <ProgressIndicator />

            {/* SMART Goals Section */}
            {(currentSection?.key === "smart" || (availableSections.length === 0 && smartGoals.length > 0)) && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FiTarget className="text-red-600" />
                    SMART Goals Assessment
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Review SMART goals and manager's feedback before accepting</p>
                </div>

                {smartGoals.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiTarget className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-gray-500">No SMART goals available for this quarter</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Weightage</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Self Score</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Manager Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager Comments</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {smartGoals.map((goal) => (
                          <tr key={goal.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{goal.title}</div>
                              <div className="text-xs text-gray-500 mt-1">{goal.target}</div>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                <FaPercent className="text-xs" />
                                {goal.weightage}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <span className="text-sm font-semibold text-purple-600">
                                {goal.selfAssessmentScore || 0}
                              </span>
                              <span className="text-xs text-gray-400">/100</span>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <span className="text-sm font-semibold text-green-600">
                                {goal.managerAssessmentScore || 0}
                              </span>
                              <span className="text-xs text-gray-400">/100</span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-600 max-w-xs">
                                {goal.managerComment || "No comments provided"}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              {getStatusBadge(goal.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Development Goals Section */}
            {(currentSection?.key === "development" || (availableSections.length === 0 && developmentGoals.length > 0)) && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FiBookOpen className="text-red-600" />
                    Development Goals Assessment
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Review development goals and manager's feedback before accepting</p>
                </div>

                {developmentGoals.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiBookOpen className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-gray-500">No development goals available for this quarter</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training Name</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Self Score</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Manager Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager Comments</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {developmentGoals.map((goal) => (
                          <tr key={goal.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{goal.title}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">{goal.trainingName || "N/A"}</div>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <span className="text-sm font-semibold text-purple-600">
                                {goal.selfAssessmentScore || 0}
                              </span>
                              <span className="text-xs text-gray-400">/100</span>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <span className="text-sm font-semibold text-green-600">
                                {goal.managerAssessmentScore || 0}
                              </span>
                              <span className="text-xs text-gray-400">/100</span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-600 max-w-xs">
                                {goal.managerComment || "No comments provided"}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              {getStatusBadge(goal.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Information Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <FaInfoCircle className="text-blue-600" />
                Before You Accept
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start">
                  <FaCheckCircle className="text-blue-500 text-xs mt-0.5 mr-2 flex-shrink-0" />
                  <span>Review all goals and manager comments carefully</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-blue-500 text-xs mt-0.5 mr-2 flex-shrink-0" />
                  <span>Ensure all performance scores are correct</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-blue-500 text-xs mt-0.5 mr-2 flex-shrink-0" />
                  <span>Acceptance confirms you agree with the final assessment</span>
                </li>
                <li className="flex items-start">
                  <FaExclamationTriangle className="text-blue-500 text-xs mt-0.5 mr-2 flex-shrink-0" />
                  <span>This action cannot be undone</span>
                </li>
              </ul>
            </div>

            {/* Navigation Buttons */}
            <NavigationButtons />
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-fadeIn">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaThumbsUp className="text-green-600" />
                Confirm Acceptance
              </h2>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaCheck className="text-xl" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Are you sure you want to accept this appraisal?
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <FaExclamationTriangle />
                    <span className="text-sm font-medium">Important!</span>
                  </div>
                  <p className="text-sm text-yellow-600 mt-1">
                    Once accepted, you cannot modify or dispute the assessment.
                    This will be the final record for this quarter.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAccept}
                  disabled={submitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <FaSpinner className="animate-spin" /> : <FaThumbsUp />}
                  Yes, Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default EmployeeFinalAcceptance;