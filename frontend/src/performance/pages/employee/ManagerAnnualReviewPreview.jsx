import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "../../../components/Header";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import { FiArrowLeft } from "react-icons/fi";
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
  FaTrophy,
  FaFileAlt,
  FaCheck,
  FaTimes,
  FaEye,
  FaLock,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP, DOC_URL } from "../../services/api";
import { simpleEncrypt } from "../../../simpleEncrypt";

// Helper function to get employee full name with priority to fullNameAsAadhaar
const getEmployeeFullName = (employeeData) => {
  if (!employeeData) return "Employee Name";
  
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

// Helper function to get manager full name with priority to fullNameAsAadhaar
const getManagerFullName = (managerData) => {
  if (!managerData) return "Manager";
  
  // Check for fullNameAsAadhaar in managerData
  if (managerData.fullNameAsAadhaar && managerData.fullNameAsAadhaar.trim() !== "") {
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

const ManagerAnnualReviewPreview = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const yearParam = queryParams.get("year");
  
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]); // Store all employees for lookup
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [docData, setDocData] = useState(null);

  const openDocument = async (docId) => {
    if (!docId) return;
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
      alert("Unable to open document");
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      if (reviewData?.id) {
        try {
          const docResponse = await axios.get(
            `${BASE_URL_EPMS}/api/annual-review/all/${reviewData.id}`
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    setUserRole(role);
    setCurrentUserEmail(email);
    fetchPreviewData();
  }, [empId, yearParam]);

  const fetchEmployeeDetails = async (empCode) => {
    try {
      if (!empCode) return null;
      const response = await axios.get(`${BASE_URL_EPMS_EMP}/${empCode}`);
      
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
      return employee;
    } catch (err) {
      console.error(`Error fetching employee details for ${empCode}:`, err);
      return null;
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
      
      // Fetch the annual review data
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
      
      // Fetch employee details directly using storedEmpId
      const employee = await fetchEmployeeDetails(storedEmpId);
      
      if (employee) {
        setEmployeeData(employee);
        console.log("Employee found:", employee);
        
        // Find manager details using managerId from review data or reportingManagerId from employee
        const managerIdToFetch = reviewDataObj.managerId || employee.reportingManagerId;
        let manager = null;
        if (managerIdToFetch) {
          manager = await fetchEmployeeDetails(managerIdToFetch);
          if (manager) {
            setManagerData(manager);
            console.log("Manager found:", manager);
          }
        }
        
        // Update allEmployees state for any potential backward compatibility
        const fetchedEmployees = [employee, manager].filter(Boolean);
        setAllEmployees(fetchedEmployees);
      } else {
        console.warn("Employee not found with ID:", storedEmpId);
      }
      
    } catch (err) {
      console.error("Error fetching preview data:", err);
      if (err.response && err.response.status === 404) {
        setError("Annual review not found for the selected employee and year.");
      } else if (err.response && err.response.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : "Failed to load review data");
      } else {
        setError("Failed to load review data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getRatingColor = (rating) => {
    switch(rating) {
      case 'A+': return 'text-purple-600 bg-purple-100';
      case 'A': return 'text-blue-600 bg-blue-100';
      case 'B+': return 'text-green-600 bg-green-100';
      case 'B': return 'text-yellow-600 bg-yellow-100';
      case 'C': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRatingLabel = (rating) => {
    switch(rating) {
      case 'A+': return 'OUTSTANDING CONTRIBUTOR';
      case 'A': return 'EXCEEDS EXPECTATIONS';
      case 'B+': return 'MEETS EXPECTATIONS';
      case 'B': return 'PARTIALLY MEETS EXPECTATIONS';
      case 'C': return 'DOES NOT MEET EXPECTATIONS';
      default: return '';
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

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  // Check if current user is a manager
  const isManager = () => {
    return userRole === "MANAGER" || userRole === "HR" || userRole === "ADMIN";
  };

  // Check if current user is the reporting manager
  const isReportingManager = () => {
    if (!managerData || !currentUserEmail) return false;
    const managerEmail = managerData.emailId || managerData.email;
    return managerEmail && managerEmail.toLowerCase() === currentUserEmail.toLowerCase();
  };

  // Determine if Talent & Matrix Assessment should be visible
  const showTalentMatrix = () => {
    return isManager() || isReportingManager();
  };

  // Get employee name using helper function
  const getEmployeeName = () => {
    if (employeeData) {
      return getEmployeeFullName(employeeData);
    }
    return reviewData?.employeeId || reviewData?.empId || empId || "N/A";
  };

  // Get employee designation
  const getEmployeeDesignation = () => {
    return employeeData?.designationName || employeeData?.designation || reviewData?.designation || "N/A";
  };

  // Get employee department
  const getEmployeeDepartment = () => {
    return employeeData?.mainDepartment || employeeData?.department || reviewData?.department || "N/A";
  };

  // Get manager name - returns full name, not email
  const getManagerName = () => {
    // If we have manager data from the API
    if (managerData) {
      return getManagerFullName(managerData);
    }
    
    // If we have employee data with reporting manager info
    if (employeeData) {
      // Check if reportingManagerName is directly available
      if (employeeData.reportingManagerName && employeeData.reportingManagerName.trim() !== "") {
        return employeeData.reportingManagerName;
      }
      
      // Check if fullNameAsAadhaar is available in reportingManager object
      if (employeeData.reportingManager?.fullNameAsAadhaar) {
        return employeeData.reportingManager.fullNameAsAadhaar;
      }
      
      // Try to find manager from all employees using reportingManagerId
      if (employeeData.reportingManagerId && allEmployees.length > 0) {
        const foundManager = allEmployees.find(emp => 
          emp.empCode?.toString() === employeeData.reportingManagerId?.toString()
        );
        if (foundManager) {
          return getManagerFullName(foundManager);
        }
      }
      
      // Try using reportingManager email to find the manager
      if (employeeData.reportingManager && allEmployees.length > 0) {
        const foundManager = allEmployees.find(emp => 
          emp.emailId?.toLowerCase() === employeeData.reportingManager?.toLowerCase()
        );
        if (foundManager) {
          return getManagerFullName(foundManager);
        }
      }
      
      // If we have the email but couldn't find the manager, return a formatted name from email
      if (employeeData.reportingManager) {
        // Extract name from email (e.g., john.doe@company.com -> John Doe)
        const emailName = employeeData.reportingManager.split('@')[0];
        const formattedName = emailName.split('.')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
        return formattedName;
      }
    }
    
    // Fallback to review data
    if (reviewData?.managerName) {
      return reviewData.managerName;
    }
    
    if (reviewData?.managerId) {
      // Try to find manager from all employees by managerId
      if (allEmployees.length > 0) {
        const foundManager = allEmployees.find(emp => 
          emp.empCode?.toString() === reviewData.managerId?.toString()
        );
        if (foundManager) {
          return getManagerFullName(foundManager);
        }
      }
      return reviewData.managerId;
    }
    
    return "Not Assigned";
  };

  // Get financial year
  const getFinancialYear = () => {
    const year = reviewData?.year || yearParam;
    if (year) {
      return `${year}-${parseInt(year) + 1}`;
    }
    return "N/A";
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading annual review preview..." />
        </div>
      </div>
    );
  }

  if (error || !reviewData) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96 mt-24">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-red-50 rounded-full p-4 inline-block mb-4">
              <FaTimes className="text-red-500 text-3xl" />
            </div>
            <p className="text-red-500 text-xl mb-4">{error || "No review data found"}</p>
            <p className="text-gray-500 text-sm mb-6">
              Please check if the annual review has been created for this employee.
            </p>
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

  return (
    <div className="flex flex-col min-h-screen font-content bg-gray-50">
      <Header />

      <div className="mt-24 px-4 md:px-6 max-w-7xl mx-auto w-full pb-8">
        {/* Breadcrumb */}
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
            onClick={() => navigate("/AppraisalList")}
            className="cursor-pointer text-gray-600 hover:text-red-500 transition-colors"
          >
            Appraisal List
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600">Annual Review Preview</span>
        </nav>

        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Annual Performance Review
            </h1>
            <p className="text-gray-500 mt-1">
              Financial Year: {getFinancialYear()}
            </p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft size={14} />
            Back
          </button>
        </div>

        {/* Employee Info Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
            <h2 className="text-white font-semibold text-lg">Employee Information</h2>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-6 flex-wrap">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <FaUser className="text-red-500 text-2xl" />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Employee Name</p>
                  <p className="font-medium text-gray-800">{getEmployeeName()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Employee ID</p>
                  <p className="font-medium text-gray-800">{reviewData.employeeId || reviewData.empId || empId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Designation</p>
                  <p className="font-medium text-gray-800">{getEmployeeDesignation()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <p className="font-medium text-gray-800">{getEmployeeDepartment()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Reporting Manager</p>
                  <p className="font-medium text-gray-800">{getManagerName()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Review Status</p>
                  <p className="font-medium text-gray-800">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      reviewData.status === "SUBMITTED_TO_R1" ? "bg-blue-100 text-blue-700" :
                      reviewData.status === "SUBMITTED_TO_HR" ? "bg-purple-100 text-purple-700" :
                      reviewData.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                      reviewData.status === "SUBMITTED_TO_EMPLOYEE" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {reviewData.status === "SUBMITTED_TO_EMPLOYEE" ? "Pending Employee Response" :
                       reviewData.status === "SUBMITTED_TO_R1" ? "Manager Review Completed" :
                       reviewData.status === "SUBMITTED_TO_HR" ? "Submitted to HR" :
                       reviewData.status === "COMPLETED" ? "Completed" :
                       reviewData.status || "Draft"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of your component remains the same... */}
        {/* Manager Rating Section */}
        {reviewData.managerRating && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-500 to-red-700 px-6 py-4">
              <div className="flex items-center gap-2">
                <FaTrophy className="text-white" />
                <h2 className="text-white font-semibold text-lg">Manager's Rating</h2>
              </div>
            </div>
            <div className="p-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getRatingColor(reviewData.managerRating)}`}>
                <span className="text-2xl font-bold">{reviewData.managerRating}</span>
                <span className="text-sm font-medium">{getRatingLabel(reviewData.managerRating)}</span>
              </div>
              {!isManager() && (
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <FaLock size={10} />
                  This rating is provided by your manager
                </p>
              )}
            </div>
          </div>
        )}

        {/* Key Accomplishments Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
            <div className="flex items-center gap-2">
              <FaAward className="text-white" />
              <h2 className="text-white font-semibold text-lg">Key Accomplishments</h2>
            </div>
          </div>
          <div className="p-6">
            {reviewData.selectedAccomplishments && reviewData.selectedAccomplishments.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 mb-2">Selected from Quarterly Goals:</h3>
                {reviewData.selectedAccomplishments.map((acc, idx) => (
                  <div key={idx} className="p-4 bg-red-50 border border-red-100 rounded-lg">
                    <h4 className="font-semibold text-gray-800">{acc.title || acc.goalTitle}</h4>
                    {acc.description && <p className="text-sm text-gray-600 mt-1">{acc.description}</p>}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Quarter: {acc.quarter}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {reviewData.additionalAccomplishments && reviewData.additionalAccomplishments.length > 0 && (
              <div className="space-y-3 mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Self-Reported Accomplishments:</h3>
                {reviewData.additionalAccomplishments.map((acc, idx) => (
                  <div key={idx} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-gray-800">{acc.title}</h4>
                    {acc.description && <p className="text-sm text-gray-600 mt-1">{acc.description}</p>}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Quarter: {acc.quarter === 'OT' ? 'Others' : acc.quarter}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {reviewData.keyAccomplishment && (
              <div className="space-y-3 mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Overall Key Accomplishments:</h3>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: reviewData.keyAccomplishment }} />
                </div>
              </div>
            )}

            {(!reviewData.selectedAccomplishments || reviewData.selectedAccomplishments.length === 0) &&
             (!reviewData.additionalAccomplishments || reviewData.additionalAccomplishments.length === 0) &&
             !reviewData.keyAccomplishment && (
              <p className="text-gray-500 text-center py-4">No accomplishments recorded</p>
            )}
          </div>
        </div>

        {/* Certifications Section */}
        {((reviewData.certifications && reviewData.certifications.length > 0) || docData?.poshDocId) && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-white" />
                <h2 className="text-white font-semibold text-lg">Certifications & Achievements</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {/* POSH Compliance Certificate */}
                {docData?.poshDocId && (
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-dashed border-red-200">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">POSH Training Certificate</p>
                      <p className="text-xs text-gray-500">Mandatory Annual Compliance</p>
                    </div>
                    <button
                      onClick={() => openDocument(docData.poshDocId)}
                      className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 focus:outline-none"
                    >
                      <FaEye size={12} />
                      View Certificate
                    </button>
                  </div>
                )}

                {/* Professional Certifications */}
                {reviewData.certifications && reviewData.certifications.map((cert, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {typeof cert === 'object' ? cert.name : cert}
                      </p>
                      {typeof cert === 'object' && cert.type && (
                        <p className="text-xs text-gray-500">{cert.type}</p>
                      )}
                    </div>
                    {typeof cert === 'object' && cert.certificateDocId && (
                      <button
                        onClick={() => openDocument(cert.certificateDocId)}
                        className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 focus:outline-none"
                      >
                        <FaEye size={12} />
                        View Certificate
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Talent & Matrix Assessment Section - Only visible to Managers */}
        {showTalentMatrix() && (reviewData.achievementLevel || reviewData.potential || reviewData.performance || reviewData.talentResource || reviewData.matrixCategory || reviewData.nineBoxResult) && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-500 to-red-700 px-6 py-4">
              <div className="flex items-center gap-2">
                <FaChartLine className="text-white" />
                <h2 className="text-white font-semibold text-lg">Talent & Matrix Assessment</h2>
              </div>
              <p className="text-white/80 text-sm mt-1">Confidential - Manager Only</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(reviewData.achievementLevel || reviewData.performanceRating) && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Achievement Level / Performance Rating</p>
                    <p className="font-semibold text-gray-800">
                      {reviewData.achievementLevel || reviewData.performanceRating}
                    </p>
                  </div>
                )}
                {reviewData.potential && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Potential</p>
                    <p className="font-semibold text-gray-800">{reviewData.potential}</p>
                  </div>
                )}
                {reviewData.performance && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Performance</p>
                    <p className="font-semibold text-gray-800">{reviewData.performance}</p>
                  </div>
                )}
                {reviewData.talentResource && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Talent Status</p>
                    <p className="font-semibold text-gray-800">{reviewData.talentResource}</p>
                  </div>
                )}
              </div>

              {(reviewData.matrixCategory || reviewData.nineBoxResult) && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-sm text-green-700 font-medium">Matrix / 9-Box Category</p>
                      <p className="text-2xl font-bold text-green-800 mt-1">
                        {reviewData.matrixCategory || reviewData.nineBoxResult}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Based on Potential & Performance Assessment</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manager's Remarks Section */}
        {reviewData.managerRemarks && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <div className="flex items-center gap-2">
                <FaUserTie className="text-white" />
                <h2 className="text-white font-semibold text-lg">Manager's Remarks</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-wrap">{reviewData.managerRemarks}</p>
            </div>
          </div>
        )}

        {/* HR Remarks Section */}
        {reviewData.hrRemarks && showTalentMatrix() && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
              <div className="flex items-center gap-2">
                <FaUserTie className="text-white" />
                <h2 className="text-white font-semibold text-lg">HR Remarks</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-wrap">{reviewData.hrRemarks}</p>
            </div>
          </div>
        )}

        {/* Employee Feelings Section */}
        {reviewData.employeeFeeling && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <div className="flex items-center gap-2">
                <FaStar className="text-white" />
                <h2 className="text-white font-semibold text-lg">Employee Feedback</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Employee's Feeling</p>
                  <p className="font-medium text-gray-800 capitalize">
                    {reviewData.employeeFeeling?.replace('_', ' ')}
                  </p>
                </div>
                {reviewData.employeeCommentText && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Employee's Comment</p>
                    <p className="text-gray-700">{reviewData.employeeCommentText}</p>
                  </div>
                )}
                {reviewData.additionalFeedback && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Additional Feedback</p>
                    <p className="text-gray-700">{reviewData.additionalFeedback}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submission Info */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-4">
            <div className="flex items-center gap-2">
              <FaFileAlt className="text-white" />
              <h2 className="text-white font-semibold text-lg">Submission Information</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="font-medium text-gray-800">
                  {reviewData.status === "SUBMITTED_TO_EMPLOYEE" ? "Submitted to Employee" :
                   reviewData.status === "SUBMITTED_TO_R1" ? "Manager Review Completed" :
                   reviewData.status === "SUBMITTED_TO_HR" ? "Submitted to HR" :
                   reviewData.status === "COMPLETED" ? "Completed" :
                   reviewData.status === "ACCEPTED_BY_EMPLOYEE" ? "Accepted by Employee" :
                   reviewData.status === "DRAFT" ? "Draft" : reviewData.status || "N/A"}
                </p>
              </div>
              {reviewData.submittedAt && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Employee Submitted Date</p>
                  <p className="font-medium text-gray-800">{formatDateTime(reviewData.submittedAt)}</p>
                </div>
              )}
              {reviewData.managerAnnualReviewSubmissionDate && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Manager Submission Date</p>
                  <p className="font-medium text-gray-800">{formatDateTime(reviewData.managerAnnualReviewSubmissionDate)}</p>
                </div>
              )}
              {reviewData.submittedToHrDate && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">HR Submission Date</p>
                  <p className="font-medium text-gray-800">{formatDateTime(reviewData.submittedToHrDate)}</p>
                </div>
              )}
              {reviewData.createdAt && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Review Created</p>
                  <p className="font-medium text-gray-800">{formatDateTime(reviewData.createdAt)}</p>
                </div>
              )}
              {reviewData.updatedAt && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                  <p className="font-medium text-gray-800">{formatDateTime(reviewData.updatedAt)}</p>
                </div>
              )}
              {reviewData.discussedWithR1 !== undefined && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Discussed with Manager</p>
                  <p className="font-medium text-gray-800">
                    {reviewData.discussedWithR1 ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <FaCheck size={12} /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-yellow-600">
                        <FaTimes size={12} /> No
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">
            This is an official annual review document generated by the EPMS system.
            {reviewData.createdAt && ` Generated on ${formatDate(reviewData.createdAt)}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerAnnualReviewPreview;