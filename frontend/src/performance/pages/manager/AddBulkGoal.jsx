// pages/manager/AddBulkGoal.jsx
import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  FaSave,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaCheckSquare,
  FaSquare,
  FaUser,
  FaEnvelope,
  FaBriefcase,
  FaCalendar,
  FaLink,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP } from "../../services/api";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import { FiArrowLeft } from "react-icons/fi";

// Helper function to get employee full name with priority to fullNameAsAadhaar
const getEmployeeFullName = (employee) => {
  if (!employee) return "Employee Name";
  
  // Check localStorage first for EmployeeFullName
  const localStorageFullName = localStorage.getItem("EmployeeFullName");
  if (localStorageFullName && localStorageFullName.trim() !== "") {
    return localStorageFullName.trim();
  }
  
  // Check for fullNameAsAadhaar in employee
  if (employee.fullNameAsAadhaar && employee.fullNameAsAadhaar.trim() !== "") {
    return employee.fullNameAsAadhaar.trim();
  }
  
  // Fallback to firstName, middleName, lastName
  const firstName = employee.firstName || "";
  const middleName = employee.middleName || "";
  const lastName = employee.lastName || "";
  const fullName = `${firstName} ${middleName} ${lastName}`.trim();
  
  if (fullName && fullName !== "") {
    return fullName;
  }
  
  return "Employee Name";
};

const AddBulkGoal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quarter: quarterParam } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const quarter = queryParams.get("quarter") || quarterParam || "Q1";
  const yearParam = queryParams.get("year") || "";
  const empCodesParam = queryParams.get("empCodes") || "";
  
  const managerId = localStorage.getItem("empId");
  
  // Get selected employees from location state or from URL params
  const { selectedEmployees: stateSelectedEmployees, quarterData } = location.state || {};
  
  const [goalMasterData, setGoalMasterData] = useState([]);
  const [groupedGoals, setGroupedGoals] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState({});
  const [activeCycle, setActiveCycle] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [employeeStatus, setEmployeeStatus] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmData, setConfirmData] = useState(null);

  // Parse empCodes from URL
  useEffect(() => {
    const fetchEmployeesFromCodes = async () => {
      if (empCodesParam) {
        const empCodesList = empCodesParam.split(',').filter(code => code.trim());
        
        try {
          const response = await axios.get(BASE_URL_EPMS_EMP);
          const allEmployees = response.data;
          
          const employees = empCodesList.map(code => {
            const employee = allEmployees.find(emp => emp.empCode?.toString() === code.toString());
            if (employee) {
              return {
                empCode: employee.empCode,
                id: employee.id,
                firstName: employee.firstName,
                middleName: employee.middleName || "",
                lastName: employee.lastName,
                fullNameAsAadhaar: employee.fullNameAsAadhaar || "",
                emailId: employee.emailId,
                designation: employee.designationName || employee.designation,
                mainDepartment: employee.mainDepartment,
              };
            }
            return {
              empCode: code,
              id: code,
              firstName: `Employee ${code}`,
              middleName: "",
              lastName: "",
              fullNameAsAadhaar: "",
              emailId: "",
              designation: "Not Available",
            };
          });
          
          setSelectedEmployees(employees);
          setEmployeeDetails(employees);
        } catch (error) {
          console.error("Error fetching employee details:", error);
          // Fallback: create basic employee objects from codes
          const employees = empCodesList.map(code => ({
            empCode: code,
            id: code,
            firstName: `Employee ${code}`,
            middleName: "",
            lastName: "",
            fullNameAsAadhaar: "",
            emailId: "",
            designation: "Software Engineer",
          }));
          setSelectedEmployees(employees);
          setEmployeeDetails(employees);
        }
      } else if (stateSelectedEmployees && stateSelectedEmployees.length > 0) {
        setSelectedEmployees(stateSelectedEmployees);
        setEmployeeDetails(stateSelectedEmployees);
      } else {
        setError("No employees selected. Please go back and select employees.");
      }
    };
    
    fetchEmployeesFromCodes();
  }, [empCodesParam, stateSelectedEmployees]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch active cycle if year not provided
  useEffect(() => {
    if (!yearParam) {
      fetchActiveCycle();
    }
  }, [yearParam]);

  // Fetch goal master data and employee statuses
  useEffect(() => {
    if (selectedEmployees && selectedEmployees.length > 0) {
      fetchGoalMasterData();
      fetchEmployeeGoalStatuses();
    }
  }, [selectedEmployees]);

  // Auto hide popup after 3 seconds
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

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

  const fetchGoalMasterData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL_EPMS}/api/goal-master/grouped`);
      
      if (response.data && response.data.success) {
        const groupedData = response.data.data;
        setGoalMasterData(groupedData);
        
        const grouped = {};
        groupedData.forEach((group) => {
          grouped[group.category] = group.items;
        });
        setGroupedGoals(grouped);
        
        // Initialize expanded sections - ALL COLLAPSED by default
        const initialExpanded = {};
        groupedData.forEach((group) => {
          initialExpanded[group.category] = false; // Set to false for collapsed by default
        });
        setExpandedSections(initialExpanded);
        
        // Initialize selected goals
        const initialSelected = {};
        groupedData.forEach((group) => {
          group.items.forEach((item) => {
            initialSelected[item.id] = false;
          });
        });
        setSelectedGoals(initialSelected);
      }
    } catch (err) {
      console.error("Error fetching goal master data:", err);
      setError("Failed to load goal master data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeGoalStatuses = async () => {
    const yearToUse = yearParam || activeCycle?.year;
    if (!yearToUse) return;

    const statusMap = {};
    
    for (const employee of selectedEmployees) {
      const empCode = employee.empCode || employee.id;
      try {
        const response = await axios.get(
          `${BASE_URL_EPMS}/api/goals/predefined/employee/${empCode}/${quarter}`,
          { params: { year: yearToUse }, timeout: 3000 }
        );

        if (response.data?.success && response.data.data) {
          const hasGoals = response.data.data.length > 0;
          const hasSubmittedGoals = response.data.data.some(
            (goal) => goal.submittedToEmployeeAt !== null
          );
          
          statusMap[empCode] = {
            hasGoals,
            hasSubmittedGoals,
            goalsCount: response.data.data.length,
            status: hasSubmittedGoals ? "Submitted" : hasGoals ? "Has Goals" : "No Goals"
          };
        } else {
          statusMap[empCode] = {
            hasGoals: false,
            hasSubmittedGoals: false,
            goalsCount: 0,
            status: "No Goals"
          };
        }
      } catch (error) {
        console.error(`Error fetching goals for employee ${empCode}:`, error);
        statusMap[empCode] = {
          hasGoals: false,
          hasSubmittedGoals: false,
          goalsCount: 0,
          status: "Error"
        };
      }
    }
    
    setEmployeeStatus(statusMap);
  };

  const handleCheckboxChange = (goalId) => {
    setSelectedGoals((prev) => ({
      ...prev,
      [goalId]: !prev[goalId],
    }));
  };

  const handleSelectAll = (category, items) => {
    const newSelected = { ...selectedGoals };
    const allSelected = items.every((item) => selectedGoals[item.id]);
    
    items.forEach((item) => {
      newSelected[item.id] = !allSelected;
    });
    
    setSelectedGoals(newSelected);
  };

  const handleSelectAllGoals = () => {
    const allSelected = Object.values(selectedGoals).every(Boolean);
    const newSelected = { ...selectedGoals };
    
    Object.keys(newSelected).forEach((id) => {
      newSelected[id] = !allSelected;
    });
    
    setSelectedGoals(newSelected);
  };

  const toggleSection = (category) => {
    setExpandedSections((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSaveClick = () => {
    const selectedItems = Object.entries(selectedGoals)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => parseInt(id));

    if (selectedItems.length === 0) {
      setError("Please select at least one goal to add.");
      return;
    }

    const yearToUse = yearParam || activeCycle?.year;
    
    if (!yearToUse) {
      setError("Year is not available. Please try again.");
      return;
    }

    // Filter employees who don't already have submitted goals
    const eligibleEmployees = selectedEmployees.filter(emp => {
      const empCode = emp.empCode || emp.id;
      const status = employeeStatus[empCode];
      return status && status.status !== "Submitted";
    });

    if (eligibleEmployees.length === 0) {
      setError("All selected employees already have submitted goals. Cannot add new goals.");
      return;
    }

    // Show custom confirmation dialog
    setConfirmData({
      selectedItemsCount: selectedItems.length,
      eligibleEmployees: eligibleEmployees,
      selectedItems: selectedItems,
      yearToUse: yearToUse
    });
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmDialog(false);
    setSaving(true);
    setError(null);
    
    try {
      const { selectedItems, eligibleEmployees, yearToUse } = confirmData;

      // Process each employee
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (const employee of eligibleEmployees) {
        try {
          const payload = {
            employeeId: employee.empCode || employee.id,
            managerId: managerId,
            quarter: quarter,
            year: parseInt(yearToUse),
            goalMasterIds: selectedItems,
            createdBy: localStorage.getItem("email") || "SYSTEM",
          };

          const response = await axios.post(
            `${BASE_URL_EPMS}/api/goals/assign-predefined`,
            payload
          );

          if (response.data && response.data.success) {
            successCount++;
          } else {
            errorCount++;
            errors.push(`${getEmployeeFullName(employee)} (${employee.empCode}): ${response.data?.message || "Failed"}`);
          }
        } catch (err) {
          errorCount++;
          errors.push(`${getEmployeeFullName(employee)} (${employee.empCode}): ${err.response?.data?.message || err.message}`);
        }
      }

      if (successCount > 0) {
        setPopupMessage(`Successfully added goals to ${successCount} employee(s). ${errorCount > 0 ? `${errorCount} failed.` : ""}`);
        setShowSuccessPopup(true);
        
        // Build URL with empCodes for redirect to bulk predefined goals page
        const empCodes = selectedEmployees.map(e => e.empCode || e.id).join(',');
        
        // Redirect to ManagerBulkPredefinedGoals page where they can edit and submit goals
        setTimeout(() => {
          navigate(`/manager/bulk-predefined-goals/${quarter}?year=${yearToUse}&empCodes=${empCodes}`, {
            state: { 
              showSuccess: true, 
              message: `Successfully added goals to ${successCount} employee(s). You can now edit and submit them.`,
              selectedEmployees: selectedEmployees,
              quarterData: quarterData,
              quarter: quarter,
              year: yearToUse
            }
          });
        }, 2000);
      } else {
        setError(`Failed to add goals. ${errors.join(", ")}`);
      }
    } catch (err) {
      console.error("Error saving goals:", err);
      setError(err.response?.data?.message || "Failed to save goals. Please try again.");
    } finally {
      setSaving(false);
      setConfirmData(null);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const formatCategoryName = (category) => {
    return category
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const displayYear = yearParam || activeCycle?.year || "";
  const selectedCount = Object.values(selectedGoals).filter(Boolean).length;
  const eligibleEmployees = selectedEmployees?.filter(emp => {
    const empCode = emp.empCode || emp.id;
    const status = employeeStatus[empCode];
    return status && status.status !== "Submitted";
  }) || [];

  // Generate URL for sharing/bookmarking
  const currentUrl = `${window.location.origin}/manager/bulk-add-goals/${quarter}?year=${displayYear}&empCodes=${selectedEmployees.map(e => e.empCode || e.id).join(',')}`;

  if (!selectedEmployees || selectedEmployees.length === 0) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96 mt-24">
          <div className="text-center">
            <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No employees selected</p>
            <button
              onClick={() => navigate("/AppraisalList")}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Go Back to Employee List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading bulk goals..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-content bg-gray-50">
      <Header />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-24 right-4 z-50 animate-slideIn">
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[300px]">
            <FaCheckCircle className="text-green-500 text-xl flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">{popupMessage}</p>
              <p className="text-green-600 text-sm mt-1">Redirecting to appraisal list...</p>
            </div>
            <button 
              onClick={() => setShowSuccessPopup(false)}
              className="text-green-600 hover:text-green-800"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirmation Dialog */}
      {showConfirmDialog && confirmData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">Confirm Goal Assignment</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <FaExclamationTriangle className="text-yellow-500 text-xl mt-0.5" />
                <div>
                  <p className="text-gray-700">
                    You are about to add <strong>{confirmData.selectedItemsCount}</strong> goal(s) to <strong>{confirmData.eligibleEmployees.length}</strong> employee(s).
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Employees:</h4>
                <div className="max-h-40 overflow-y-auto">
                  {confirmData.eligibleEmployees.map((emp, index) => (
                    <div key={emp.empCode || emp.id} className="text-sm text-gray-600 py-1">
                      • {getEmployeeFullName(emp)} ({emp.empCode})
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This action cannot be undone. Goals will be added to the selected employees and will be visible in their appraisal dashboard.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setConfirmData(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSave}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-24 px-4 md:px-6 max-w-7xl mx-auto w-full pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm mb-6">
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
          <span
            onClick={() => navigate("/AppraisalList")}
            className="cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
          >
            Appraisal List
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600">Bulk Add Goals</span>
        </nav>

        {/* URL Info Bar */}
        <div className="bg-gray-100 rounded-lg p-3 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaLink className="text-gray-400" />
            <span className="font-medium">Selected Employees (Emp Codes):</span>
            <span className="text-red-600 font-mono text-xs bg-white px-2 py-1 rounded">
              {selectedEmployees.map(e => e.empCode || e.id).join(', ')}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            <FaCalendar className="inline mr-1" />
            Quarter: {quarter} | Year: {displayYear}
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaUsers className="text-white text-xl" />
                  <h1 className="text-2xl font-bold text-white">
                    Bulk Add Goals
                  </h1>
                </div>
                <p className="text-red-100">
                  Add goals to multiple employees at once
                </p>
                <p className="text-red-100 text-sm mt-1">
                  Quarter {quarter} - {displayYear}
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                  <p className="text-red-100 text-xs">Selected Employees</p>
                  <p className="text-white text-2xl font-bold">{selectedEmployees.length}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                  <p className="text-red-100 text-xs">Eligible Employees</p>
                  <p className="text-white text-2xl font-bold">{eligibleEmployees.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Employees Card */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaUsers className="text-red-500" />
                <h2 className="text-lg font-semibold text-gray-800">Selected Employees</h2>
                <span className="text-sm text-gray-500">({selectedEmployees.length} total)</span>
              </div>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                {previewMode ? "Collapse" : "Expand Details"}
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedEmployees.map((employee) => {
                const empCode = employee.empCode || employee.id;
                const status = employeeStatus[empCode];
                const isEligible = status?.status !== "Submitted";
                
                return (
                  <div
                    key={empCode}
                    className={`border rounded-lg p-4 transition-all ${
                      isEligible
                        ? "border-gray-200 hover:border-green-300 hover:shadow-md"
                        : "border-gray-200 bg-gray-50 opacity-75"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isEligible ? "bg-green-100" : "bg-gray-200"
                      }`}>
                        <FaUser className={isEligible ? "text-green-600" : "text-gray-500"} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {getEmployeeFullName(employee)}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">
                          Emp Code: {empCode}
                        </div>
                        <div className="text-xs text-gray-500">
                          {employee.designation || "Software Engineer"}
                        </div>
                        {status && (
                          <div className="mt-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              status.status === "Submitted"
                                ? "bg-green-100 text-green-700"
                                : status.status === "Has Goals"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {status.status === "Submitted" ? (
                                <FaCheckCircle size={10} />
                              ) : status.status === "Has Goals" ? (
                                <FaClock size={10} />
                              ) : null}
                              {status.status}
                            </span>
                            {status.goalsCount > 0 && (
                              <span className="ml-2 text-xs text-gray-500">
                                {status.goalsCount} goal(s)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {!isEligible && (
                        <div className="text-xs text-gray-400" title="Already has submitted goals">
                          <FaCheckCircle className="text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {eligibleEmployees.length < selectedEmployees.length && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> {selectedEmployees.length - eligibleEmployees.length} employee(s) already have submitted goals and will be skipped.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Goals Selection Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Select Goals to Add
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  These goals will be added to all eligible employees
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSelectAllGoals}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  {Object.values(selectedGoals).every(Boolean)
                    ? "Deselect All"
                    : "Select All Goals"}
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {goalMasterData.map((group, groupIndex) => (
              <div key={group.category} className="overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(group.category)}
                  className="w-full bg-white hover:bg-gray-50 transition-colors px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-800">
                      {formatCategoryName(group.category)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({group.items.length} goals)
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAll(group.category, group.items);
                      }}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      {group.items.every((item) => selectedGoals[item.id])
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                    {expandedSections[group.category] ? (
                      <FaChevronUp className="text-gray-400" />
                    ) : (
                      <FaChevronDown className="text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Section Content - Only show if expanded */}
                {expandedSections[group.category] === true && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                            S.NO
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            PREDEFINED GOAL DEFINITION
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Parameters / Definition
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                            Select
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {group.items.map((item, itemIndex) => {
                          const sno = goalMasterData
                            .slice(0, groupIndex)
                            .reduce((acc, g) => acc + g.items.length, 0) + itemIndex + 1;
                          
                          return (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {sno}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                {item.differentiatorName}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {item.definition}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedGoals[item.id] || false}
                                    onChange={() => handleCheckboxChange(item.id)}
                                    className="h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary Bar */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  <strong>{selectedCount}</strong> goal(s) selected
                </span>
                <span className="text-sm text-gray-600">
                  Will be added to <strong>{eligibleEmployees.length}</strong> employee(s)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaCheckSquare className="text-green-500" />
                <span>{eligibleEmployees.length} employees eligible</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes />
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={saving || selectedCount === 0 || eligibleEmployees.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" />
                Adding Goals...
              </>
            ) : (
              <>
                <FaSave />
                Add Goals to {eligibleEmployees.length} Employee(s)
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <FaUsers className="text-blue-500 text-lg mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-800 mb-1">Bulk Goal Assignment</h4>
              <p className="text-xs text-blue-600">
                All selected goals will be added to the employees listed above. 
                Employees who already have submitted goals will be automatically skipped.
                You can review individual employee goals after assignment.
              </p>
              <p className="text-xs text-blue-600 mt-2 font-mono">
                URL Parameters: quarter={quarter}&year={displayYear}&empCodes={selectedEmployees.map(e => e.empCode || e.id).join(',')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddBulkGoal;