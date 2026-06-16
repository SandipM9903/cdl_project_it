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
  FaClock,
  FaStar,
  FaAward,
  FaFlag,
  FaChartLine,
  FaCalendarAlt,
  FaArrowLeft,
  FaFileAlt,
  FaComments,
  FaCheck,
  FaExclamationTriangle,
  FaMedal,
  FaPaperPlane,
  FaTimes,
  FaInfoCircle,
  FaPlus,
  FaSmile,
  FaFrown,
  FaMeh,
  FaGrinStars,
  FaGrinTears,
  FaBan,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP } from "../../services/api";

// Helper function to get employee full name with priority to fullNameAsAadhaar
const getEmployeeFullName = (employeeData) => {

  // Check for fullNameAsAadhaar in employeeData
  if (
    employeeData.fullNameAsAadhaar &&
    employeeData.fullNameAsAadhaar.trim() !== ""
  ) {
    return employeeData.fullNameAsAadhaar.trim();
  }
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
  const fullName = `${firstName} ${middleName} ${lastName}`.trim();

  if (fullName && fullName !== "") {
    return fullName;
  }

  return "Manager";
};

// Helper function to get employee name for email (without localStorage priority for consistency)
const getEmployeeNameForEmail = (employeeData) => {
  if (!employeeData) return "Employee";

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

  return "Employee";
};

// Helper function to get manager name for email
const getManagerNameForEmail = (managerData) => {
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
  const fullName = `${firstName} ${middleName} ${lastName}`.trim();

  if (fullName && fullName !== "") {
    return fullName;
  }

  return "Manager";
};

const EmployeeAnnualSubmitToHr = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const yearParam = queryParams.get("year");

  const [annualReview, setAnnualReview] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    discussedWithR1: false,
    employeeComment: false,
    employeeCommentText: "",
    employeeFeeling: null,
    additionalFeedback: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSendBackModal, setShowSendBackModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showSendBackSuccessModal, setShowSendBackSuccessModal] = useState(
    false,
  );
  const [showFeelingsModal, setShowFeelingsModal] = useState(false);
  const [sendBackRemarks, setSendBackRemarks] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [existingDiscussedWithR1, setExistingDiscussedWithR1] = useState(null);
  const [reviewStatus, setReviewStatus] = useState(null);
  const [isSubmittedToHR, setIsSubmittedToHR] = useState(false);
  const [selectedAccomplishments, setSelectedAccomplishments] = useState([]);
  const [additionalAccomplishments, setAdditionalAccomplishments] = useState(
    [],
  );
  const [certifications, setCertifications] = useState([]);
  const [sendBackCount, setSendBackCount] = useState(0);

  // Feelings options
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    fetchAnnualReviewData();
  }, [empId, yearParam]);

  const fetchAnnualReviewData = async () => {
    setLoading(true);
    try {
      const storedEmpId = empId || localStorage.getItem("empId");
      const year = yearParam || new Date().getFullYear().toString();

      if (!storedEmpId) {
        setError("Employee ID not found");
        setLoading(false);
        return;
      }

      const annualReviewUrl = `${BASE_URL_EPMS}/api/annual-review/${storedEmpId}/${year}`;
      console.log("Fetching annual review from:", annualReviewUrl);
      const annualReviewResponse = await axios.get(annualReviewUrl);

      if (annualReviewResponse.data) {
        const reviewData = annualReviewResponse.data;
        setAnnualReview(reviewData);

        const existingDiscussed = reviewData.discussedWithR1 || false;
        setExistingDiscussedWithR1(existingDiscussed);
        setReviewStatus(reviewData.status);

        const submittedToHR = reviewData.status === "SUBMITTED_TO_HR";
        setIsSubmittedToHR(submittedToHR);

        const sendBackCounter = reviewData.sendBackCount || 0;
        setSendBackCount(sendBackCounter);

        setFormData({
          discussedWithR1: existingDiscussed,
          employeeComment: reviewData.employeeComment || false,
          employeeCommentText: reviewData.employeeCommentText || "",
          employeeFeeling: reviewData.employeeFeeling || null,
          additionalFeedback: reviewData.additionalFeedback || "",
        });

        if (reviewData.selectedAccomplishments) {
          setSelectedAccomplishments(reviewData.selectedAccomplishments);
        } else if (reviewData.accomplishments) {
          const selected = reviewData.accomplishments.filter(
            (acc) => acc.type === "SELECTED",
          );
          setSelectedAccomplishments(selected);
        }

        if (reviewData.additionalAccomplishments) {
          setAdditionalAccomplishments(reviewData.additionalAccomplishments);
        } else if (reviewData.accomplishments) {
          const additional = reviewData.accomplishments.filter(
            (acc) => acc.type === "ADDITIONAL",
          );
          setAdditionalAccomplishments(additional);
        }

        if (reviewData.certifications) {
          setCertifications(reviewData.certifications);
        }

        await fetchEmployeeDetails(storedEmpId);

        if (reviewData.managerId) {
          await fetchManagerDetails(reviewData.managerId);
        }
      } else {
        setError("Annual review not found");
      }
    } catch (err) {
      console.error("Error fetching annual review data:", err);
      setError("Failed to load annual review data");
    } finally {
      setLoading(false);
    }
  };

// Helper function to extract employee data from API response
const extractEmployeeFromResponse = (responseData) => {
  if (!responseData) return null;
  
  // Check for nested structure: fileAndObjectTypeBean.empResDTO
  if (responseData.fileAndObjectTypeBean?.empResDTO) {
    return responseData.fileAndObjectTypeBean.empResDTO;
  }
  // Check for direct empResDTO
  if (responseData.empResDTO) {
    return responseData.empResDTO;
  }
  // If it's already a flat structure with empCode
  if (responseData.empCode) {
    return responseData;
  }
  // If response is an array, return as is (will need to be filtered later)
  return responseData;
};

const fetchEmployeeDetails = async (storedEmpId) => {
    try {
      const storedEmpCode = localStorage.getItem("empId");
      const response = await axios.get(`https://mycdl.cms.co.in/employee/${storedEmpCode}`);
      
      console.log("Employee API Response:", response.data);
      
      let employee = null;
      
      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        employee = response.data
          .map(item => item.fileAndObjectTypeBean?.empResDTO || item.empResDTO || item)
          .find(emp => emp?.empCode?.toString() === storedEmpId?.toString());
      } 
      // Check if response.data is a single object
      else if (response.data && typeof response.data === 'object') {
        if (response.data.fileAndObjectTypeBean?.empResDTO) {
          employee = response.data.fileAndObjectTypeBean.empResDTO;
        } else if (response.data.empResDTO) {
          employee = response.data.empResDTO;
        } else {
          employee = response.data;
        }
      }
      
      if (employee) {
        console.log("Full employee object:", employee);
        console.log("fullNameAsAadhaar value:", employee.fullNameAsAadhaar);
        console.log("firstName value:", employee.firstName);
        console.log("lastName value:", employee.lastName);
        
        setEmployeeData(employee);
      } else {
        console.warn("Employee not found with ID:", storedEmpId);
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
    }
  };
const fetchManagerDetails = async (managerId) => {
  try {
    const storedEmpCode = localStorage.getItem("empId");
    const response = await axios.get(`https://mycdl.cms.co.in/employee/${storedEmpCode}`);
    
    let employees = [];
    if (Array.isArray(response.data)) {
      employees = response.data.map(item => 
        item.fileAndObjectTypeBean?.empResDTO || item.empResDTO || item
      ).filter(emp => emp !== null);
    }
    
    const manager = employees.find(
      (emp) => emp.empCode?.toString() === managerId?.toString()
    );
    
    if (manager) {
      // Log the manager object to see what fields are available
      console.log("Full manager object:", manager);
      console.log("Manager fullNameAsAadhaar:", manager.fullNameAsAadhaar);
      
      setManagerData(manager);
    } else {
      console.warn("Manager not found with ID:", managerId);
    }
  } catch (err) {
    console.error("Error fetching manager details:", err);
  }
};

  const handleCheckboxChange = (field) => {
    setFormData({
      ...formData,
      [field]: !formData[field],
    });
  };

  const handleTextChange = (e) => {
    setFormData({
      ...formData,
      employeeCommentText: e.target.value,
    });
  };

  const handleFeelingSelect = (feeling) => {
    setFormData({
      ...formData,
      employeeFeeling: feeling,
    });
  };

  const handleAdditionalFeedbackChange = (e) => {
    setFormData({
      ...formData,
      additionalFeedback: e.target.value,
    });
  };

  const isSendBackAllowed = sendBackCount < 2;

  const openFeelingsModal = () => {
    // If send back limit is reached (2 times), allow submission even if discussedWithR1 is false
    const hasReachedLimit = sendBackCount >= 2;

    if (!formData.discussedWithR1 && !hasReachedLimit) {
      setShowValidationModal(true);
      return;
    }
    setShowFeelingsModal(true);
  };

  const handleFinalSubmitToHR = async () => {
    setShowFeelingsModal(false);
    setSubmitting(true);
    try {
      const storedEmpId = empId || localStorage.getItem("empId");
      const year = yearParam || new Date().getFullYear().toString();
      const url = `${BASE_URL_EPMS}/api/annual-review/submit-to-hr/${annualReview.id}`;

      // If send back limit is reached, force discussedWithR1 to false in the payload
      const hasReachedLimit = sendBackCount >= 2;
      const finalDiscussedWithR1 = hasReachedLimit
        ? false
        : formData.discussedWithR1;

      const payload = {
        employeeId: storedEmpId,
        year: year,
        discussedWithR1: finalDiscussedWithR1,
        employeeComment: formData.employeeComment,
        employeeCommentText: formData.employeeCommentText,
        employeeFeeling: formData.employeeFeeling,
        additionalFeedback: formData.additionalFeedback,
      };

      console.log("Submitting to HR with payload:", payload);
      await axios.put(url, payload);

      setShowSuccessModal(true);
      setTimeout(() => {
        navigate(`/EmployeeAppraisal?type=annual`);
      }, 3000);
    } catch (error) {
      console.error("Error submitting to HR:", error);
      let errorMsg = "Failed to submit to HR. Please try again.";
      if (error.response && error.response.data) {
        errorMsg =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data.message || "Submission failed";
      }
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const sendEmailNotificationToManager = async (
    remarks,
    newCount,
    isLastAttempt,
  ) => {
    try {
      const managerEmail = managerData?.emailId;
      const employeeName = getEmployeeNameForEmail(employeeData);
      const managerName = getManagerNameForEmail(managerData);
      const financialYear = `${annualReview.year}-${parseInt(
        annualReview.year,
      ) + 1}`;

      if (!managerEmail) {
        console.warn("Manager email not found, skipping email notification");
        return;
      }

      const emailPayload = {
        templateId: isLastAttempt ? 10 : 9,
        to: managerEmail,
        subject: isLastAttempt
          ? `URGENT: Final Review Submission Required for ${employeeName}`
          : `Action Required: Annual Review Sent Back by ${employeeName} (Attempt ${newCount}/2)`,
        variables: {
          managerName: managerName,
          employeeName: employeeName,
          financialYear: financialYear,
          remarks: remarks || "No additional remarks provided",
          reviewUrl: `${window.location.origin}/manager/annual-review/${annualReview.employeeId}?year=${annualReview.year}`,
          attemptNumber: newCount,
          isLastAttempt: isLastAttempt,
        },
      };

      console.log("Sending email notification to manager:", managerEmail);
      await axios.post(`${BASE_URL_EPMS}/api/email/send`, emailPayload);
      console.log("Email notification sent successfully to manager");
    } catch (error) {
      console.error("Error sending email notification to manager:", error);
    }
  };

  const handleSendBackToR1 = () => {
    setShowSendBackModal(true);
  };

  const confirmSendBackToR1 = async () => {
    if (!isSendBackAllowed) {
      setErrorMessage(
        "You have already sent back the review 2 times. Please submit directly to HR now.",
      );
      setShowErrorModal(true);
      return;
    }

    if (!sendBackRemarks.trim()) {
      setErrorMessage("Please provide remarks before sending back.");
      setShowErrorModal(true);
      return;
    }

    setSubmitting(true);
    try {
      const newCount = sendBackCount + 1;
      const isLastAttempt = newCount === 2;

      const url = `${BASE_URL_EPMS}/api/annual-review/send-back-to-r1/${annualReview.id}`;

      const response = await axios.put(url, null, {
        params: {
          remarks: sendBackRemarks,
          discussedWithR1: false,
          sendBackCount: newCount,
        },
      });

      console.log("Send back response:", response.data);

      // Send email notification to manager
      await sendEmailNotificationToManager(
        sendBackRemarks,
        newCount,
        isLastAttempt,
      );

      // Update local state
      setSendBackCount(newCount);

      // Reset discussedWithR1 to false since it was sent back
      setFormData((prev) => ({
        ...prev,
        discussedWithR1: false,
      }));

      setShowSendBackModal(false);
      setShowSendBackSuccessModal(true);

      // Refresh data to get updated count from backend
      await fetchAnnualReviewData();

      setTimeout(() => {
        setShowSendBackSuccessModal(false);
      }, 3000);
    } catch (error) {
      console.error("Error sending back to R1:", error);
      let errorMsg = "Failed to send back to R1. Please try again.";
      if (error.response && error.response.data) {
        errorMsg =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data.message || "Send back failed";
      }
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setSubmitting(false);
      setSendBackRemarks("");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getManagerRatingLabel = (rating) => {
    if (!rating) return "Not Rated";
    const ratingMap = {
      "A+": "Outstanding",
      A: "Excellent",
      "B+": "Very Good",
      B: "Good",
      C: "Needs Improvement",
    };
    return ratingMap[rating] || rating;
  };

  const getAchievementLevel = (rating) => {
    if (!rating) return "Not Rated";
    if (rating === "A+" || rating === "A") return "Exceeds";
    if (rating === "B+" || rating === "B") return "Meets";
    return "Below";
  };

  const getQuarterDisplay = (quarter) => {
    const quarterMap = {
      Q1: "Quarter 1 (Apr-Jun)",
      Q2: "Quarter 2 (Jul-Sep)",
      Q3: "Quarter 3 (Oct-Dec)",
      Q4: "Quarter 4 (Jan-Mar)",
      OT: "Other",
    };
    return quarterMap[quarter] || quarter;
  };

  const getSelectedFeeling = () => {
    return feelingOptions.find((f) => f.value === formData.employeeFeeling);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading annual review data..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96 mt-24">
          <div className="text-center">
            <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!annualReview) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96 mt-24">
          <div className="text-center">
            <p className="text-gray-500 text-xl mb-4">
              No annual review data found
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const managerRating = annualReview.managerRating || "Not Rated";
  const achievementLevel = getAchievementLevel(managerRating);
  const isReadyForSubmission = reviewStatus === "SUBMITTED_TO_EMPLOYEE";

  // Update submit button condition: if send back limit is reached, allow submission even if discussedWithR1 is false
  const hasReachedLimit = sendBackCount >= 2;
  const isSubmitDisabled =
    submitting ||
    (hasReachedLimit ? false : formData.discussedWithR1 === false) ||
    isSubmittedToHR ||
    !isReadyForSubmission;

  const isSendBackDisabled =
    submitting ||
    formData.discussedWithR1 ||
    isSubmittedToHR ||
    !isReadyForSubmission ||
    !isSendBackAllowed;

  const financialYear = `${annualReview.year}-${parseInt(annualReview.year) +
    1}`;
  const selectedFeeling = getSelectedFeeling();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      {submitting && <LoadingAnimation message="Submitting to HR..." />}

      <div className="mt-24 px-4 md:px-6 max-w-7xl mx-auto w-full pb-8">
        <nav className="flex items-center text-sm mb-6">
          <button
            onClick={() => navigate(-1)}
            disabled={submitting}
            className={`flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors mr-4 font-medium ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FiArrowLeft size={16} />
            Back
          </button>
          <span className="text-gray-400">/</span>
          <span
            onClick={() => !submitting && navigate("/dashboard")}
            className="cursor-pointer text-gray-600 hover:text-red-500 transition-colors ml-2"
          >
            Home
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span
            onClick={() => !submitting && navigate("/EmployeeAppraisal?type=annual")}
            className="cursor-pointer text-gray-600 hover:text-red-500 transition-colors"
          >
            My Performance
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600">Submit to HR</span>
        </nav>

        {sendBackCount >= 2 && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <FaBan className="text-red-500 text-xl mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800">
                  Send Back Limit Reached
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  You have already sent back this review 2 times. As per company
                  policy, you cannot send it back again. You can now submit
                  directly to HR even without discussing with R1.
                </p>
                <p className="text-sm text-red-700 mt-2 font-medium">
                  Please click on "Submit to HR" button below to proceed with
                  the final submission.
                </p>
              </div>
            </div>
          </div>
        )}

        {sendBackCount > 0 && sendBackCount < 2 && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-yellow-600 text-xl mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">
                  Send Back Attempt: {sendBackCount}/2
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  You have sent back this review {sendBackCount} time(s). After{" "}
                  {2 - sendBackCount} more attempt(s), you will not be able to
                  send it back and must submit directly to HR.
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  You have already used the {sendBackCount} of 2 (final attempt)
                  discussion attempts.
                </p>
                <p className="text-sm text-yellow-700 mt-1 font-medium">
                  After the final attempt, the review will be submitted directly
                  to HR for further processing without requiring R1 discussion.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isReadyForSubmission && !isSubmittedToHR && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-red-500 text-xl mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800">
                  Review Not Ready for Submission
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  This review is currently in {reviewStatus} status. Please wait
                  for the manager to complete the review and submit it to you
                  before proceeding.
                </p>
              </div>
            </div>
          </div>
        )}

        {isSubmittedToHR && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-green-500 text-xl mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">
                  Already Submitted to HR
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  This review has already been submitted to HR on{" "}
                  {formatFullDate(annualReview.submittedToHrDate)}.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaAward className="text-white text-xl" />
                  <p className="text-white/90 text-sm font-medium">
                    Final Annual Review Submission
                  </p>
                </div>
                <h1 className="text-white text-2xl font-bold">
                  {getEmployeeFullName(employeeData)}
                </h1>
                <p className="text-white/80 text-sm mt-1">FY {financialYear}</p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    isSubmittedToHR
                      ? "bg-green-100 text-green-700"
                      : isReadyForSubmission
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {isSubmittedToHR ? (
                    <FaCheckCircle size={14} />
                  ) : isReadyForSubmission ? (
                    <FaClock size={14} />
                  ) : (
                    <FaExclamationTriangle size={14} />
                  )}
                  {isSubmittedToHR
                    ? "Submitted to HR"
                    : isReadyForSubmission
                    ? "Ready for Submission"
                    : `Status: ${reviewStatus}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Manager Review Summary Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gray-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FaUserTie className="text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Manager's Final Review
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">
                      Manager Rating
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">
                      Achievement Level
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">
                      Manager's Summary Comment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 border">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-red-600">
                          {managerRating}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({getManagerRatingLabel(managerRating)})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          achievementLevel === "Exceeds"
                            ? "bg-green-100 text-green-700"
                            : achievementLevel === "Meets"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {achievementLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 border">
                      <p className="text-gray-700">
                        {annualReview.managerRemarks || "No comments provided"}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {annualReview.keyAccomplishment && (
              <div className="mb-6 bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="text-md font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <FaFileAlt className="text-blue-600" />
                  Employee's Key Accomplishments
                </h3>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: annualReview.keyAccomplishment,
                  }}
                />
              </div>
            )}

            {selectedAccomplishments && selectedAccomplishments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Selected Accomplishments from Quarterly Goals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedAccomplishments.map((accomplishment, index) => (
                    <div
                      key={accomplishment.id || index}
                      className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-medium text-gray-800">
                          {accomplishment.title || accomplishment.goalTitle}
                        </span>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          {getQuarterDisplay(accomplishment.quarter)}
                        </span>
                      </div>
                      {accomplishment.description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {accomplishment.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {additionalAccomplishments && additionalAccomplishments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaPlus className="text-blue-500 text-xs" />
                  Self-Reported Accomplishments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {additionalAccomplishments.map((accomplishment, index) => (
                    <div
                      key={accomplishment.id || index}
                      className="border border-blue-200 rounded-lg p-3 bg-blue-50"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-medium text-gray-800">
                          {accomplishment.title}
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {getQuarterDisplay(accomplishment.quarter)}
                        </span>
                      </div>
                      {accomplishment.description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {accomplishment.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications && certifications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaAward className="text-green-500" />
                  Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                    >
                      {cert.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(!selectedAccomplishments ||
              selectedAccomplishments.length === 0) &&
              (!additionalAccomplishments ||
                additionalAccomplishments.length === 0) &&
              !annualReview.keyAccomplishment && (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <FaAward className="text-gray-300 text-4xl mx-auto mb-2" />
                  <p className="text-gray-500">
                    No accomplishments have been recorded for this review.
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* Employee Confirmation Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gray-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FaComments className="text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Employee Confirmation
              </h2>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">
                      Discussed with R1
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {hasReachedLimit
                        ? "Send back limit reached. You can submit to HR directly without discussion."
                        : "Confirm that you have discussed the review with your manager (R1)"}
                    </p>
                    {hasReachedLimit && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        ✓ Since you've reached the send back limit (2 times),
                        you can select either YES or NO and submit directly to
                        HR.
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleCheckboxChange("discussedWithR1")}
                      disabled={isSubmittedToHR || !isReadyForSubmission}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        formData.discussedWithR1 === true
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } ${
                        isSubmittedToHR || !isReadyForSubmission
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <span className="font-medium">YES</span>
                    </button>
                    <button
                      onClick={() =>
                        setFormData({ ...formData, discussedWithR1: false })
                      }
                      disabled={isSubmittedToHR || !isReadyForSubmission}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        formData.discussedWithR1 === false
                          ? "bg-red-100 text-red-700 border border-red-300"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } ${
                        isSubmittedToHR || !isReadyForSubmission
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <span className="font-medium">NO</span>
                    </button>
                  </div>
                </div>

                {formData.discussedWithR1 === false &&
                  isReadyForSubmission &&
                  !isSubmittedToHR &&
                  !hasReachedLimit && (
                    <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                      <div className="flex items-start gap-2">
                        <FaInfoCircle className="text-yellow-600 text-sm mt-0.5" />
                        <p className="text-xs text-yellow-700">
                          You must discuss this review with your R1 before
                          submitting to HR. Please schedule a discussion with
                          your reporting manager to review this appraisal.
                        </p>
                      </div>
                    </div>
                  )}

                {formData.discussedWithR1 === false &&
                  isReadyForSubmission &&
                  !isSubmittedToHR &&
                  hasReachedLimit && (
                    <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-400 rounded-md">
                      <div className="flex items-start gap-2">
                        <FaCheckCircle className="text-green-600 text-sm mt-0.5" />
                        <p className="text-xs text-green-700">
                          ✓ Send back limit reached. You can now submit directly
                          to HR even with "NO" selected.
                        </p>
                      </div>
                    </div>
                  )}
              </div>

              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">
                      Employee Comment
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Do you want to add any comments?
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleCheckboxChange("employeeComment")}
                      disabled={isSubmittedToHR || !isReadyForSubmission}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        formData.employeeComment
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } ${
                        isSubmittedToHR || !isReadyForSubmission
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {formData.employeeComment && <FaCheck size={16} />}
                      <span className="font-medium">YES</span>
                    </button>
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          employeeComment: false,
                          employeeCommentText: "",
                        })
                      }
                      disabled={isSubmittedToHR || !isReadyForSubmission}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        !formData.employeeComment &&
                        formData.employeeComment !== undefined
                          ? "bg-red-100 text-red-700 border border-red-300"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } ${
                        isSubmittedToHR || !isReadyForSubmission
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <span className="font-medium">NO</span>
                    </button>
                  </div>
                </div>

                {formData.employeeComment && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Comment
                    </label>
                    <textarea
                      value={formData.employeeCommentText}
                      onChange={handleTextChange}
                      disabled={isSubmittedToHR || !isReadyForSubmission}
                      rows="4"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        isSubmittedToHR || !isReadyForSubmission
                          ? "bg-gray-100"
                          : ""
                      }`}
                      placeholder="Please provide your comments here..."
                    />
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong>
                </p>
                <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                  <li>
                    If the discussion with your R1 is completed, then you can
                    simply click on{" "}
                    <strong className="text-green-700">"YES"</strong>.
                  </li>
                  <li>
                    If <strong className="text-red-700">"NO"</strong> is
                    selected and you still have send back attempts left, the
                    review will be sent back to R1 for discussion.
                  </li>
                  <li>
                    You may send back the review a maximum of{" "}
                    <strong className="text-red-700">2 times</strong> to R1. The
                    1st send-back will be the first attempt, and the 2nd
                    send-back will be considered the final attempt.
                  </li>
                  <li>
                    <strong className="text-green-700">
                      After both discussion attempts are exhausted (2 times)
                    </strong>
                    , you can submit directly to HR with either{" "}
                    <strong>"YES"</strong> or <strong>"NO"</strong> selected.
                  </li>
                  <li>
                    After submission to HR, no further changes can be made to
                    the review submitted.
                  </li>
                  <li>
                    Please ensure that all details are reviewed carefully before
                    final submission.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          {!isSubmittedToHR && isReadyForSubmission && isSendBackAllowed && (
            <button
              onClick={handleSendBackToR1}
              disabled={isSendBackDisabled}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                !isSendBackDisabled
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FaTimes size={16} />
              Send Back to R1 ({sendBackCount}/2)
            </button>
          )}

          {!isSubmittedToHR && isReadyForSubmission && !isSendBackAllowed && (
            <div className="relative inline-block">
              <button
                disabled={true}
                className="px-6 py-3 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed flex items-center gap-2"
                title="Send back limit reached (2/2). Please submit directly to HR."
              >
                <FaBan size={16} />
                Send Back Disabled (2/2)
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                You have reached the maximum send back limit (2/2)
              </div>
            </div>
          )}

          <button
            onClick={openFeelingsModal}
            disabled={isSubmitDisabled}
            className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
              !isSubmitDisabled
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FaPaperPlane size={16} />
                {isSubmittedToHR ? "Already Submitted" : "Submit to HR"}
              </>
            )}
          </button>
        </div>

        {/* Feelings Modal */}
        {showFeelingsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-fadeIn">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <FaSmile className="text-white text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        How do you feel about this review?
                      </h2>
                      <p className="text-red-100 text-sm mt-0.5">
                        Your feedback helps us improve
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFeelingsModal(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <FaTimes size={22} />
                  </button>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Select your feeling <span className="text-red-500">*</span>
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {feelingOptions.map((feeling) => {
                      const isSelected =
                        formData.employeeFeeling === feeling.value;
                      return (
                        <button
                          key={feeling.value}
                          onClick={() => handleFeelingSelect(feeling.value)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 ${
                            isSelected
                              ? `${feeling.color} border-2 shadow-md scale-105`
                              : "bg-gray-50 border border-gray-200 hover:shadow-md hover:scale-105"
                          }`}
                        >
                          <span className="text-3xl">{feeling.emoji}</span>
                          <span className="text-xs font-medium text-gray-600">
                            {feeling.label}
                          </span>
                          {isSelected && (
                            <FaCheck className="text-xs text-green-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedFeeling && (
                  <div
                    className={`mb-5 p-3 rounded-xl ${selectedFeeling.color} border animate-fadeIn`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selectedFeeling.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold">
                          {selectedFeeling.label}
                        </p>
                        <p className="text-xs opacity-75">
                          {selectedFeeling.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Feedback{" "}
                    <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.additionalFeedback}
                    onChange={handleAdditionalFeedbackChange}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none text-sm"
                    placeholder="Share your thoughts or suggestions for improvement..."
                  />
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <FaInfoCircle size={10} />
                    Your feedback is valuable and will be used to improve the
                    process
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setShowFeelingsModal(false)}
                  className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalSubmitToHR}
                  disabled={!formData.employeeFeeling}
                  className={`px-5 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium ${
                    formData.employeeFeeling
                      ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane size={14} />
                      Confirm & Submit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Validation Modal */}
        {showValidationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaInfoCircle className="text-yellow-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Confirmation Required
                </h3>
                <p className="text-gray-600 mb-4">
                  Please confirm that you have discussed this review with your
                  R1 before submitting to HR.
                </p>
                <button
                  onClick={() => setShowValidationModal(false)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Back Modal */}
        {showSendBackModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Send Back to R1
                </h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to send this review back to R1 for
                  further discussion? This will count as attempt{" "}
                  {sendBackCount + 1}/2.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Remarks <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={sendBackRemarks}
                    onChange={(e) => setSendBackRemarks(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Please provide reason for sending back the review to your manager..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    These remarks will be sent via email to your manager.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSendBackModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSendBackToR1}
                    disabled={submitting || !sendBackRemarks.trim()}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      !sendBackRemarks.trim()
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaTimes size={16} />
                        Send Back ({sendBackCount + 1}/2)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Send Back Success Modal */}
        {showSendBackSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Review Sent Back!
                </h3>
                <p className="text-gray-600 mb-2">
                  The review has been sent back to R1 for further discussion.
                </p>
                <p className="text-sm text-green-600 mb-4">
                  An email notification has been sent to your manager.
                </p>
                <p className="text-sm text-gray-500">
                  {sendBackCount >= 2
                    ? "You have reached the maximum send back limit."
                    : `Remaining send back attempts: ${2 - sendBackCount}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Successfully Submitted!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your annual review has been submitted to HR successfully.
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {errorMessage.includes("send back")
                    ? "Action Failed"
                    : "Submission Failed"}
                </h3>
                <p className="text-gray-600 mb-4">{errorMessage}</p>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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

export default EmployeeAnnualSubmitToHr;
