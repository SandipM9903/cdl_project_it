import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimes,
  FaSpinner,
  FaSave,
  FaChevronDown,
  FaInfoCircle,
  FaCalculator,
  FaUser,
  FaBuilding,
  FaEnvelope,
  FaUserTie,
  FaPhone,
  FaLock,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP } from "../../services/api";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import { FiArrowLeft } from "react-icons/fi";

const PREDEFINED_WEIGHTAGE = {
  Values: 15,
  Quality: 20,
  Knowledge: 20,
  Experience: 25,
  Empower: 20,
};

const ManagerPredefinedGoals = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quarter = queryParams.get("quarter") || "Q1";
  const year = queryParams.get("year") || "";

  const [goals, setGoals] = useState([]);
  const [groupedGoals, setGroupedGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeLoading, setEmployeeLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [employeeError, setEmployeeError] = useState(null);
  const [activeCycle, setActiveCycle] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [openDropdownIndices, setOpenDropdownIndices] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedDate, setSubmittedDate] = useState(null);
  const [originalWeightages, setOriginalWeightages] = useState({});

  // New state for confirmation popup
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  // Timeline options
  const timelineOptions = [
    { value: "Q1", label: "Q1" },
    { value: "Q2", label: "Q2" },
    { value: "Q3", label: "Q3" },
    { value: "Q4", label: "Q4" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!year) {
      fetchActiveCycle();
    }

    if (location.state?.showSuccess) {
      setShowSuccessPopup(true);
      setPopupMessage(location.state.message || "Goals assigned successfully!");
      
      // Auto close after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    }

    if (empId) {
      fetchEmployeeDetails();
      fetchPredefinedGoals();
    }
  }, [empId, quarter, year, location.state]);

  const fetchActiveCycle = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL_EPMS}/api/cycles/active`,
      );
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
      const response = await axios.get(
        BASE_URL_EPMS_EMP,
      );
      const employees = response.data;
      const employee = employees.find(
        (emp) => emp.empCode.toString() === empId.toString(),
      );

      if (employee) {
        setEmployeeData(employee);
      } else {
        setEmployeeData(null);
        setEmployeeError("Employee not found in master data");
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
      setEmployeeError(err.message);
      setEmployeeData(null);
    } finally {
      setEmployeeLoading(false);
    }
  };

  const getWeightKey = (cat) => {
    const normalized = cat?.toLowerCase().replace(/[\s_&]+/g, "");

    const map = {
      values: "Values",
      quality: "Quality",
      knowledge: "Knowledge",
      knowledgelevel: "Knowledge",
      experience: "Experience",
      empower: "Empower",
      empowerengagement: "Empower",
    };

    return map[normalized] || cat;
  };

  const calculateRedistributedWeightage = (selectedCategories) => {
    if (!selectedCategories?.length) return {};

    const categoryWeights = selectedCategories.map((cat) => {
      const key = getWeightKey(cat);
      return {
        category: cat,
        weight: PREDEFINED_WEIGHTAGE[key] || 0,
      };
    });

    const totalOriginal = categoryWeights.reduce((sum, c) => sum + c.weight, 0);

    if (categoryWeights.length === 1) {
      return { [categoryWeights[0].category]: 100 };
    }

    const result = {};

    categoryWeights.forEach((c) => {
      result[c.category] = Number(
        ((c.weight / totalOriginal) * 100).toFixed(2),
      );
    });

    const total = Object.values(result).reduce((a, b) => a + b, 0);
    const diff = Number((100 - total).toFixed(2));

    if (Math.abs(diff) > 0) {
      const firstKey = Object.keys(result)[0];
      result[firstKey] += diff;
    }

    return result;
  };

  // Helper function to format combined target KPI without duplicates
  const getCombinedTargetKPI = (categoryGoals) => {
    const kpis = categoryGoals.map(g => g.targetKPI || "100% completion");
    
    // Remove duplicates while preserving order
    const uniqueKPIs = [];
    for (const kpi of kpis) {
      if (!uniqueKPIs.includes(kpi)) {
        uniqueKPIs.push(kpi);
      }
    }
    
    // Join unique KPIs
    if (uniqueKPIs.length === 1) {
      return uniqueKPIs[0];
    } else {
      return uniqueKPIs.join(" and ");
    }
  };

  // Helper function to format combined goal description without duplicates
  const getCombinedGoalDescription = (categoryGoals) => {
    if (categoryGoals.length === 1) {
      return categoryGoals[0].goalDescription ||
             categoryGoals[0].description ||
             `Complete ${categoryGoals[0].title} training`;
    }

    // Get unique descriptions
    const descriptions = [];
    for (const goal of categoryGoals) {
      const desc = goal.goalDescription || 
                   goal.description || 
                   `Complete ${goal.title} training`;
      if (!descriptions.includes(desc)) {
        descriptions.push(desc);
      }
    }

    // Join unique descriptions
    if (descriptions.length === 1) {
      return descriptions[0];
    } else {
      return descriptions.map((desc, idx) => 
        idx === 0 ? desc : `and ${desc.toLowerCase()}`
      ).join(" ");
    }
  };

  const fetchPredefinedGoals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL_EPMS}/api/goals/predefined/employee/${empId}/${quarter}`,
        {
          params: { year: year },
        },
      );

      if (response.data && response.data.success) {
        const fetchedGoals = response.data.data || [];
        setGoals(fetchedGoals);

        const anySubmitted = fetchedGoals.some(
          (goal) =>
            goal.submittedToEmployeeAt !== null &&
            goal.submittedToEmployeeAt !== undefined,
        );
        setIsSubmitted(anySubmitted);

        if (anySubmitted) {
          const submissionDates = fetchedGoals
            .filter((goal) => goal.submittedToEmployeeAt)
            .map((goal) => new Date(goal.submittedToEmployeeAt));
          if (submissionDates.length > 0) {
            const latestDate = new Date(Math.max(...submissionDates));
            setSubmittedDate(latestDate);
          }
        }

        const grouped = {};
        fetchedGoals.forEach((goal) => {
          let category = goal.goalCategory || "Other";

          const formatCategory = (cat) => {
            if (!cat) return "Other";
            return cat
              .split("_")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
              )
              .join(" ");
          };

          const displayCategory = formatCategory(category);

          if (!grouped[displayCategory]) {
            grouped[displayCategory] = [];
          }
          grouped[displayCategory].push(goal);
        });

        const selectedCategories = Object.keys(grouped);

        const redistributedWeights = calculateRedistributedWeightage(
          selectedCategories,
        );
        setOriginalWeightages(redistributedWeights);

        const groupedArray = Object.entries(grouped).map(
          ([category, categoryGoals]) => {
            const combinedTitle = categoryGoals.map((g) => g.title).join(", ");

            // Use the new helper function to avoid duplicate descriptions
            const combinedGoalDescription = getCombinedGoalDescription(categoryGoals);

            // Use the helper function to avoid duplicate "100% completion"
            const combinedTargetKPI = getCombinedTargetKPI(categoryGoals);

            const redistributedWeight = redistributedWeights[category] || 0;

            const allTimelines = categoryGoals.flatMap((g) =>
              g.timeline
                ? Array.isArray(g.timeline)
                  ? g.timeline
                  : [g.timeline]
                : [quarter],
            );
            const uniqueTimelines = [...new Set(allTimelines)];

            return {
              category,
              rawCategory: categoryGoals[0]?.goalCategory || category,
              combinedTitle,
              goalDescription: combinedGoalDescription,
              targetKPI: combinedTargetKPI,
              weightage: redistributedWeight,
              timeline: uniqueTimelines,
              originalGoals: categoryGoals,
            };
          },
        );

        setGroupedGoals(groupedArray);
      } else {
        setGoals([]);
        setGroupedGoals([]);
      }
    } catch (err) {
      console.error("Error fetching predefined goals:", err);
      setError("Failed to load predefined goals");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoreGoals = () => {
    if (isSubmitted) {
      setError(
        "Cannot add more goals as they have already been submitted to the employee.",
      );
      return;
    }

    navigate(
      `/goals/predefined/add/${empId}?quarter=${quarter}&year=${displayYear}&edit=true`,
      {
        state: {
          existingGoals: goals,
        },
      },
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoalDescriptionChange = (groupIndex, value) => {
    if (isSubmitted) return;
    const updated = [...groupedGoals];
    updated[groupIndex].goalDescription = value;
    setGroupedGoals(updated);
  };

  const handleTargetKPIChange = (groupIndex, value) => {
    if (isSubmitted) return;
    const updated = [...groupedGoals];
    updated[groupIndex].targetKPI = value;
    setGroupedGoals(updated);
  };

  const handleTimelineToggle = (groupIndex, quarterValue) => {
    if (isSubmitted) return;

    const updated = [...groupedGoals];
    const currentTimeline = updated[groupIndex].timeline || [];

    if (currentTimeline.includes(quarterValue)) {
      updated[groupIndex].timeline = currentTimeline.filter(
        (q) => q !== quarterValue,
      );
    } else {
      updated[groupIndex].timeline = [...currentTimeline, quarterValue];
    }

    setGroupedGoals(updated);
  };

  const toggleDropdown = (groupIndex) => {
    if (isSubmitted) return;
    setOpenDropdownIndices((prev) => ({
      ...prev,
      [groupIndex]: !prev[groupIndex],
    }));
  };

  const getSelectedTimelineText = (timeline) => {
    if (!timeline || timeline.length === 0) return "Select quarters";
    return timeline.sort().join(", ");
  };

  const handleSubmitClick = async () => {
    if (isSubmitted) {
      setError(
        "Goals have already been submitted to the employee and cannot be modified.",
      );
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setShowConfirmPopup(true);
  };

  const validateForm = () => {
    const totalWeightage = groupedGoals.reduce(
      (sum, goal) => sum + (goal.weightage || 0),
      0,
    );
    if (Math.abs(totalWeightage - 100) > 0.01) {
      return `Total weightage must be 100%. Current total: ${totalWeightage.toFixed(
        2,
      )}%`;
    }

    const hasZeroWeightage = groupedGoals.some((goal) => goal.weightage === 0);
    if (hasZeroWeightage) {
      return "All goals must have weightage greater than 0";
    }

    for (const goal of groupedGoals) {
      if (!goal.goalDescription?.trim()) {
        return "Goal description is required for all categories";
      }
      if (!goal.targetKPI?.trim()) {
        return "Target/KPI is required for all categories";
      }
      if (!goal.timeline || goal.timeline.length === 0) {
        return "At least one timeline quarter must be selected for all categories";
      }
    }

    return null;
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmPopup(false);
    setSubmitting(true);
    setError(null);

    try {
      const allOriginalGoals = groupedGoals.flatMap((group) =>
        group.originalGoals.map((goal) => ({
          id: goal.id,
          goalDescription: group.goalDescription,
          targetKPI: group.targetKPI,
          weightage: group.weightage,
          timeline: group.timeline,
        }))
      );

      const payload = {
        employeeId: empId,
        quarter: quarter,
        year: parseInt(displayYear),
        goals: allOriginalGoals,
      };

      console.log("Updating goals with payload:", payload);

      // STEP 1: Update goals
      const response = await axios.put(
        `${BASE_URL_EPMS}/api/goals/update-predefined`,
        payload
      );

      console.log("Update response:", response.data);

      if (response.data && response.data.success) {
        // STEP 2: Submit to employee
        const managerId = localStorage.getItem("empId");
        
        console.log("Submitting to employee with:", { managerId, employeeId: empId, quarter });

        await axios.put(
          `${BASE_URL_EPMS}/api/goals/manager/submit-to-employee/${managerId}/${empId}/${quarter}`
        );

        // ✅ STEP 3: Trigger Email to the Employee using DB Template
        if (employeeData && employeeData.emailId) {
          try {
            const emailPayload = {
              templateId: 2, // Matches the new ID in the database
              to: employeeData.emailId,
              variables: {
                // Injects the employee's real name into the {{firstName}} tag
                firstName: employeeData.firstName || "Employee"
              }
            };
            
            // Calling the email endpoint
            await axios.post(`${BASE_URL_EPMS}/api/email/send`, emailPayload);
            console.log("Email notification sent successfully to", employeeData.emailId);
          } catch (emailError) {
            console.error("Goals were submitted, but email notification failed:", emailError);
            // Catching this error ensures the user still gets the success popup even if the email server glitches
          }
        }

        // Update the success message to reflect the email
        setPopupMessage("Successfully Submitted and Notified Employee!");
        setShowSuccessPopup(true);
        
        // Auto close success popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
        
        setIsSubmitted(true);
        setSubmittedDate(new Date());

        fetchPredefinedGoals();
      } else {
        throw new Error(response.data?.message || "Failed to update goals");
      }
    } catch (err) {
      console.error("Submission error:", err);
      if (err.response) {
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError("Network error - Please check if the backend server is running on port 9010");
      } else {
        setError(err.message || "Submission failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitted) return;
    fetchPredefinedGoals();
    setError(null);
    setOpenDropdownIndices({});
  };

  const getQuarterDates = (quarter) => {
    const yearToUse =
      year || activeCycle?.year || new Date().getFullYear().toString();
    const quarters = {
      Q1: { start: `01-Apr-${yearToUse}`, end: `30-Jun-${yearToUse}` },
      Q2: { start: `01-Jul-${yearToUse}`, end: `30-Sep-${yearToUse}` },
      Q3: { start: `01-Oct-${yearToUse}`, end: `31-Dec-${yearToUse}` },
      Q4: {
        start: `01-Jan-${parseInt(yearToUse) + 1}`,
        end: `31-Mar-${parseInt(yearToUse) + 1}`,
      },
    };
    return quarters[quarter] || quarters["Q1"];
  };

  const quarterDates = getQuarterDates(quarter);
  const displayYear =
    year || activeCycle?.year || new Date().getFullYear().toString();
  const totalWeightage = groupedGoals.reduce(
    (sum, goal) => sum + (goal.weightage || 0),
    0,
  );

  const isSubmitDisabled =
    isSubmitted ||
    submitting ||
    Math.abs(totalWeightage - 100) > 0.01 ||
    groupedGoals.some((goal) => goal.weightage === 0) ||
    groupedGoals.some((goal) => !goal.goalDescription?.trim()) ||
    groupedGoals.some((goal) => !goal.targetKPI?.trim()) ||
    groupedGoals.some((goal) => !goal.timeline || goal.timeline.length === 0);

  const getDisabledReason = () => {
    if (isSubmitted)
      return "Goals have already been submitted to the employee and cannot be modified";
    if (submitting) return "Form is being submitted...";
    if (groupedGoals.some((goal) => !goal.goalDescription?.trim()))
      return "Goal description is required for all categories";
    if (groupedGoals.some((goal) => !goal.targetKPI?.trim()))
      return "Target/KPI is required for all categories";
    if (
      groupedGoals.some((goal) => !goal.timeline || goal.timeline.length === 0)
    )
      return "Timeline must be selected for all categories";
    if (groupedGoals.some((goal) => goal.weightage === 0))
      return "All goals must have weightage greater than 0";
    if (Math.abs(totalWeightage - 100) > 0.01)
      return `Total weightage must be 100%. Current: ${totalWeightage.toFixed(
        2,
      )}%`;
    return "";
  };

  const hasZeroWeightage = groupedGoals.some((goal) => goal.weightage === 0);

  const getAddButtonLabel = () => {
    return groupedGoals.length === 0 ? "Add Predefined Goals" : "Edit Goals";
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getOriginalPredefinedWeightage = (category) => {
    const key = getWeightKey(category);
    return PREDEFINED_WEIGHTAGE[key] || 0;
  };

  if (loading || employeeLoading) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading predefined goals..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-content bg-gray-50">
      <Header />

      {/* Success Popup - Auto closing, Green color, No close button */}
      {showSuccessPopup && (
        <div className="fixed top-24 right-4 z-50 animate-slideIn">
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[300px]">
            <FaCheckCircle className="text-green-500 text-xl flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">{popupMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 rounded-full p-2">
                  <FaInfoCircle className="text-red-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Submission
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Do you want to Submit the Predefined Goals to Employee?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmPopup(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmedSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  {submitting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaSave />
                  )}
                  Submit
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
          <span className="font-semibold text-red-600 cursor-default">
            Manager Pre-Defined Goals
          </span>
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
                    {employeeData
                      ? `${employeeData.firstName} ${employeeData.lastName}`
                      : "Employee"}
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

        {/* Weightage Info Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-red-500 text-lg mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">
                Weightage Allocation
              </h3>
              <p className="text-sm text-red-700">
                Weightage is automatically calculated based on predefined values
                per category.
                {groupedGoals.length > 0 &&
                  groupedGoals.length < 5 &&
                  ` Since only ${groupedGoals.length} categories are selected, weightages have been redistributed proportionally.`}
              </p>
              {groupedGoals.length > 0 && (
                <div className="mt-2 text-xs text-red-600">
                  <span className="font-medium">
                    Original predefined weightages:
                  </span>
                  {Object.entries(PREDEFINED_WEIGHTAGE).map(([cat, weight]) => (
                    <span key={cat} className="ml-2">
                      {cat}: {weight}%
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Manager Pre-Defined Goals
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Quarter {quarter} ({quarterDates.start} to {quarterDates.end})
              </p>
              {isSubmitted && submittedDate && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                  <FaCheckCircle className="text-green-500" />
                  <span>
                    Submitted to employee on: {formatDate(submittedDate)}
                  </span>
                </div>
              )}
            </div>
            {!isSubmitted && (
              <button
                onClick={handleAddMoreGoals}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <FaEdit /> {getAddButtonLabel()}
              </button>
            )}
            {isSubmitted && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                <FaLock className="text-gray-500" />
                <span>Read Only - Submitted to Employee</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Zero Weightage Warning */}
        {hasZeroWeightage && !isSubmitted && (
          <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg mb-6">
            <FaInfoCircle className="inline mr-2" /> All weightage values must
            be greater than 0
          </div>
        )}

        {groupedGoals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-2">
              No predefined goals found
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-visible">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">
                      VALUE DIFFERENTIATORS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-80">
                      DEFINITION (PARAMETERS)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-80">
                      GOAL DESCRIPTION
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-64">
                      TARGET / KPI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                      WEIGHTAGE (%)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">
                      TIMELINE
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groupedGoals.map((group, groupIndex) => {
                    const isWeightageZero = group.weightage === 0;
                    const originalWeight = getOriginalPredefinedWeightage(
                      group.category,
                    );
                    const isRedistributed =
                      originalWeight !== group.weightage &&
                      groupedGoals.length !== 5;

                    return (
                      <tr key={group.category} className="hover:bg-gray-50">
                        {/* VALUE DIFFERENTIATORS */}
                        <td className="px-6 py-4 align-top bg-gray-50/50 w-48">
                          <div className="font-medium text-gray-900">
                            {group.category}
                          </div>
                          {isRedistributed && !isSubmitted && (
                            <div className="mt-1 text-xs text-red-600">
                              <span className="italic">
                                (Original: {originalWeight}%)
                              </span>
                            </div>
                          )}
                         </td>
                        {/* DEFINITION (PARAMETERS) */}
                        <td className="px-6 py-4 text-sm text-gray-600 align-top w-80">
                          {group.combinedTitle}
                         </td>
                        {/* GOAL DESCRIPTION */}
                        <td className="px-6 py-4 w-80">
                          {isSubmitted ? (
                            <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm min-h-[100px]">
                              {group.goalDescription ||
                                "No description provided"}
                            </div>
                          ) : (
                            <textarea
                              value={group.goalDescription || ""}
                              onChange={(e) =>
                                handleGoalDescriptionChange(
                                  groupIndex,
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm min-h-[100px] resize-y focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Enter combined goal description"
                              rows={4}
                              disabled={isSubmitted}
                            />
                          )}
                         </td>
                        {/* TARGET / KPI */}
                        <td className="px-6 py-4 w-64">
                          {isSubmitted ? (
                            <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm min-h-[80px]">
                              {group.targetKPI || "No target/KPI provided"}
                            </div>
                          ) : (
                            <textarea
                              value={group.targetKPI || ""}
                              onChange={(e) =>
                                handleTargetKPIChange(
                                  groupIndex,
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm min-h-[80px] resize-y focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              placeholder="Enter combined target/KPI"
                              rows={3}
                              disabled={isSubmitted}
                            />
                          )}
                         </td>
                        {/* WEIGHTAGE - READ ONLY */}
                        <td className="px-6 py-4 w-32">
                          <div
                            className={`w-full px-4 py-3 border rounded-lg text-sm text-center font-medium ${
                              isRedistributed && !isSubmitted
                                ? "border-red-300 bg-red-50 text-red-700"
                                : isWeightageZero && !isSubmitted
                                ? "border-orange-300 bg-orange-50 text-orange-700"
                                : "border-gray-200 bg-gray-50 text-gray-900"
                            }`}
                          >
                            {group.weightage.toFixed(2)}%
                          </div>
                          {isRedistributed && !isSubmitted && (
                            <div className="mt-1 text-xs text-red-600 text-center">
                              (Auto-calculated)
                            </div>
                          )}
                         </td>
                        {/* TIMELINE */}
                        <td className="px-6 py-4 w-48">
                          {isSubmitted ? (
                            <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm">
                              {getSelectedTimelineText(group.timeline)}
                            </div>
                          ) : (
                            <div className="relative">
                              <button
                                onClick={() => toggleDropdown(groupIndex)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-gray-400 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                type="button"
                                disabled={isSubmitted}
                              >
                                <span
                                  className={`text-sm ${
                                    group.timeline?.length
                                      ? "text-gray-900"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {getSelectedTimelineText(group.timeline)}
                                </span>
                                <FaChevronDown
                                  className={`text-gray-400 transition-transform ${
                                    openDropdownIndices[groupIndex]
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />
                              </button>
                              {openDropdownIndices[groupIndex] && !isSubmitted && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => toggleDropdown(groupIndex)}
                                  />
                                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {timelineOptions.map((option) => (
                                      <div
                                        key={option.value}
                                        onClick={() => {
                                          handleTimelineToggle(
                                            groupIndex,
                                            option.value,
                                          );
                                        }}
                                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={group.timeline?.includes(
                                            option.value,
                                          )}
                                          onChange={() => {}}
                                          className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <span
                                          className={`text-sm ${
                                            group.timeline?.includes(
                                              option.value,
                                            )
                                              ? "font-medium text-red-600"
                                              : "text-gray-600"
                                          }`}
                                        >
                                          {option.label}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                         </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Total Weightage Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaCalculator className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {isSubmitted
                        ? "Total weightage of all goals"
                        : "Weightage is automatically allocated based on predefined values per category"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">
                      Total Weightage:
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        Math.abs(totalWeightage - 100) <= 0.01
                          ? "text-red-600"
                          : "text-red-600"
                      }`}
                    >
                      {totalWeightage.toFixed(2)}%
                    </span>
                    {Math.abs(totalWeightage - 100) > 0.01 && !isSubmitted && (
                      <span className="text-xs text-red-500">
                        (Total should be 100%)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Only show if not submitted */}
            {!isSubmitted && (
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleCancel}
                  disabled={submitting}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FaTimes className="inline mr-2" /> Cancel
                </button>
                <div className="relative group">
                  <button
                    onClick={handleSubmitClick}
                    disabled={isSubmitDisabled}
                    className={`px-6 py-3 rounded-lg min-w-[120px] transition-colors ${
                      isSubmitDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white`}
                  >
                    {submitting ? (
                      <FaSpinner className="animate-spin inline mr-2" />
                    ) : (
                      <FaSave className="inline mr-2" />
                    )}
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                  {isSubmitDisabled && (
                    <div className="absolute bottom-full mb-2 right-0 w-64 bg-gray-800 text-white text-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-lg">
                      <FaInfoCircle className="inline mr-1 text-red-300" />{" "}
                      {getDisabledReason()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* View Only Message for Submitted Goals */}
            {isSubmitted && (
              <div className="flex justify-center mt-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-lg inline-flex items-center gap-2">
                  <FaEye className="text-red-500" />
                  <span>
                    Viewing submitted goals - modifications are disabled
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerPredefinedGoals;