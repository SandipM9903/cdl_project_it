import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaUserTie,
  FaCheckCircle,
  FaPlus,
  FaSpinner,
  FaCalendarAlt,
  FaTag,
  FaClock,
  FaChevronRight,
  FaEye,
} from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP } from "../../services/api";
import LoadingAnimation from "../../components/common/LoadingAnimation";

// Helper function to get employee full name with priority to fullNameAsAadhaar
const getEmployeeFullName = (employeeData) => {
  if (!employeeData) return "Employee";
  
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
  
  return "Employee";
};

const PredefinedGoals = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quarter = queryParams.get("quarter") || "Q1";

  const [year, setYear] = useState(queryParams.get("year") || "");
  const [employeeData, setEmployeeData] = useState(null);
  const [predefinedGoals, setPredefinedGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [employeeError, setEmployeeError] = useState(null);
  const [activeCycle, setActiveCycle] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!year) {
      fetchActiveCycle();
    }

    if (empId) {
      fetchEmployeeDetails();
    } else {
      setEmployeeLoading(false);
      setGoalsLoading(false);
    }
  }, [empId, quarter]);

  useEffect(() => {
    if (activeCycle && !year) {
      setYear(activeCycle.year.toString());
    }
  }, [activeCycle]);

  useEffect(() => {
    if (year && empId) {
      fetchPredefinedGoals();
    }
  }, [year, empId, quarter]);

  useEffect(() => {
    if (!employeeLoading && !goalsLoading) {
      setLoading(false);
    }
  }, [employeeLoading, goalsLoading]);

  const fetchActiveCycle = async () => {
    try {
      const response = await axios.get(`${BASE_URL_EPMS}/api/cycles/active`);
      if (response.data && response.data.success && response.data.data) {
        setActiveCycle(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching active cycle:", err);
    }
  };

  const fetchEmployeeDetails = async () => {
    setEmployeeLoading(true);
    setEmployeeError(null);

    try {
      const response = await axios.get(BASE_URL_EPMS_EMP);
      const employees = response.data;
      const employee = employees.find(
        (emp) => emp.empCode.toString() === empId.toString()
      );

      if (employee) {
        setEmployeeData(employee);
      } else {
        setEmployeeData(null);
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
      setEmployeeError(err.message);
      setEmployeeData(null);
    } finally {
      setEmployeeLoading(false);
    }
  };

  const fetchPredefinedGoals = async () => {
    setGoalsLoading(true);
    setApiError(null);

    try {
      const yearToUse = year || activeCycle?.year;

      if (!yearToUse) {
        setGoalsLoading(false);
        return;
      }

      const response = await axios.get(
        `${BASE_URL_EPMS}/api/goals/predefined/employee/${empId}/${quarter}`,
        {
          params: { year: yearToUse },
          timeout: 5000,
        }
      );

      if (response.data && response.data.success) {
        setPredefinedGoals(response.data.data || []);
      } else {
        setPredefinedGoals([]);
        setApiError("Failed to fetch goals");
      }
    } catch (err) {
      console.error("Error fetching predefined goals:", err);
      setApiError(err.response?.data?.message || "Error fetching goals");
      setPredefinedGoals([]);
    } finally {
      setGoalsLoading(false);
    }
  };

  const handleAddPredefinedGoals = () => {
    const yearToUse = year || activeCycle?.year;
    navigate(
      `/goals/predefined/add/${empId}?quarter=${quarter}&year=${yearToUse}`
    );
  };

  const handleViewAllGoals = () => {
    navigate(`/manager/predefined-goals/${empId}?quarter=${quarter}&year=${displayYear}`, {
      state: {
        employeeData: employeeData,
        quarter: quarter,
        year: displayYear
      }
    });
  };

  const getQuarterDates = (quarter) => {
    const yearToUse = year || activeCycle?.year || new Date().getFullYear();
    const nextYear = parseInt(yearToUse) + 1;

    const quarters = {
      Q1: { start: `01-Apr-${yearToUse}`, end: `30-Jun-${yearToUse}` },
      Q2: { start: `01-Jul-${yearToUse}`, end: `30-Sep-${yearToUse}` },
      Q3: { start: `01-Oct-${yearToUse}`, end: `31-Dec-${yearToUse}` },
      Q4: { start: `01-Jan-${nextYear}`, end: `31-Mar-${nextYear}` },
    };
    return quarters[quarter] || quarters["Q1"];
  };

  const quarterDates = getQuarterDates(quarter);
  const displayYear = year || activeCycle?.year || "";
  const totalWeightage = predefinedGoals.reduce((sum, goal) => sum + (goal.weightage || 0), 0);

  const getStatusColor = (status) => {
    switch(status) {
      case 'NOT_STARTED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SUBMITTED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading appraisal details..." />
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
            Appraisal List
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600">Appraisal Details</span>
        </nav>

        {/* Employee Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {employeeLoading ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="animate-spin text-red-500 text-2xl" />
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-red-500 text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {getEmployeeFullName(employeeData)}
                  </h1>
                  <p className="text-gray-600">
                    {employeeData?.designationName ||
                      "Employee details not available in master data"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Employee Code</p>
                    <p className="font-medium">{empId}</p>
                  </div>
                </div>

                {employeeData && (
                  <>
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{employeeData.emailId}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaBuilding className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium">
                          {employeeData.mainDepartment}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaUserTie className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Reporting To</p>
                        <p className="font-medium">
                          {employeeData.reportingManager || "Not assigned"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Employment Status
                        </p>
                        <p className="font-medium">
                          {employeeData.employmentStatus}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaPhone className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">
                          {employeeData.contactNo || "Not available"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!employeeData && !employeeLoading && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-700 text-sm flex items-center gap-2">
                    <span>⚠️</span>
                    <span>
                      Employee details not found in master data. Showing goals
                      for Employee Code: {empId}
                    </span>
                  </p>
                </div>
              )}

              {employeeError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <span>❌</span>
                    <span>Error loading employee details: {employeeError}</span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quarter Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Quarter {quarter} {displayYear && `- ${displayYear}`}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                <FaCalendarAlt className="inline mr-1" /> {quarterDates.start} to {quarterDates.end}
              </p>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                onClick={handleViewAllGoals}
                disabled={predefinedGoals.length === 0 || goalsLoading}
                className={`font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2 text-sm ${
                  predefinedGoals.length === 0 || goalsLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <FaEye /> View Details
              </button>
              <button
                onClick={handleAddPredefinedGoals}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2 text-sm"
              >
                <FaPlus /> Add Goals
              </button>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">
            Manager Pre-Defined Goals Summary
          </h3>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {apiError}
            </div>
          )}

          {goalsLoading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-red-500 text-3xl" />
            </div>
          ) : predefinedGoals.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg mb-2">No Predefined Goals Found</p>
              <p className="text-gray-400 text-sm mb-6">
                Click the button above to add predefined goals for this employee
              </p>
            </div>
          ) : (
            <div>
              {/* Summary Cards - Showing only totals, not individual goals */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-sm text-blue-600 font-medium">Total Goals</p>
                  <p className="text-3xl font-bold text-blue-700">{predefinedGoals.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <p className="text-sm text-green-600 font-medium">Total Weightage</p>
                  <p className={`text-3xl font-bold ${totalWeightage === 100 ? 'text-green-700' : 'text-orange-600'}`}>
                    {totalWeightage}%
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <p className="text-sm text-purple-600 font-medium">Quarter</p>
                  <p className="text-3xl font-bold text-purple-700">{quarter}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <p className="text-sm text-amber-600 font-medium">Year</p>
                  <p className="text-3xl font-bold text-amber-700">{displayYear}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredefinedGoals;