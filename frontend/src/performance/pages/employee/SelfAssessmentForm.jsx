import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP } from "../../services/api";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import { FiArrowLeft } from "react-icons/fi";

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

// Helper function to get manager full name
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

  return managerData.reportingManager || "Manager";
};

const SelfAssessmentForm = () => {
  const navigate = useNavigate();
  const { quarter } = useParams();
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const year = searchParams.get("year") || "2025";
  const employeeId = localStorage.getItem("empId");

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Dynamic Manager ID state
  const [managerId, setManagerId] = useState(null);

  // Employee details state for email routing
  const [employeeData, setEmployeeData] = useState(null);

  // State for modals
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [overallRating, setOverallRating] = useState("");
  const [overallComment, setOverallComment] = useState("");
  const [modalErrors, setModalErrors] = useState({});

  // Local state for editable fields
  const [editableGoals, setEditableGoals] = useState({});
  const [customGoals, setCustomGoals] = useState([]);
  const [debugInfo, setDebugInfo] = useState([]);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const addDebugLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { timestamp, message, data };
    setDebugInfo((prev) => [...prev, logEntry]);
    console.log(`[${timestamp}] ${message}`, data || "");
  };

  const fetchEmployeeDetails = async () => {
    try {
      const response = await fetch(BASE_URL_EPMS_EMP);
      const employees = await response.json();
      const currentEmployee = employees.find(
        (emp) => emp.empCode.toString() === employeeId.toString(),
      );
      if (currentEmployee) {
        setEmployeeData(currentEmployee);
        addDebugLog("Employee details loaded:", currentEmployee);
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
    }
  };

  // Function to merge and order all goals
  const mergeAndOrderGoals = (predefinedGoals, smartGoals, developmentGoals, customSmartGoals) => {
    // Convert custom goals to SMART goal format
    const formattedCustomGoals = customSmartGoals.map(customGoal => ({
      ...customGoal,
      goalType: "SMART",
      isCustom: true,
      title: customGoal.title || "Custom SMART Goal",
      goalDescription: customGoal.goalDescription || "",
      targetKPI: customGoal.targetKPI || "",
      achievableTarget: customGoal.achievableTarget || "",
      selfReviewComments: customGoal.selfReviewComments || "",
      weightage: 0
    }));

    // Combine all SMART goals (existing + custom)
    const allSmartGoals = [...smartGoals, ...formattedCustomGoals];

    // Return in order: Predefined → SMART → Development
    return [...predefinedGoals, ...allSmartGoals, ...developmentGoals];
  };

  const fetchGoals = async () => {
    setLoading(true);
    setError(null);
    addDebugLog("Starting to fetch goals...");

    try {
      let predefinedGoalsList = [];
      let smartGoalsList = [];
      let developmentGoalsList = [];

      // Fetch predefined goals
      addDebugLog("Fetching predefined goals...");
      const predefinedResponse = await fetch(
        `${BASE_URL_EPMS}/api/goals/predefined/employee/${employeeId}/${quarter}?year=${year}`,
      );
      const predefinedResult = await predefinedResponse.json();

      if (predefinedResult.success && Array.isArray(predefinedResult.data)) {
        predefinedGoalsList = [...predefinedResult.data];

        // Capture managerId from the predefined goals data
        const foundManagerId = predefinedResult.data.find((g) => g.managerId)
          ?.managerId;
        if (foundManagerId) {
          setManagerId(foundManagerId);
          addDebugLog(
            `Manager ID identified from Predefined Goals: ${foundManagerId}`,
          );
        }
      }

      // Fetch SMART goals (including drafts)
      addDebugLog("Fetching SMART goals...");
      const smartResponse = await fetch(
        `${BASE_URL_EPMS}/api/goals/smart/employee/${employeeId}/${quarter}?year=${year}`,
      );
      const smartResult = await smartResponse.json();

      if (smartResult.success && Array.isArray(smartResult.data)) {
        smartGoalsList = [...smartResult.data];
      }

      // Fetch development goals
      addDebugLog("Fetching development goals...");
      const developmentResponse = await fetch(
        `${BASE_URL_EPMS}/api/goals/development/employee/${employeeId}/${quarter}?year=${year}`,
      );
      const developmentResult = await developmentResponse.json();

      if (developmentResult.success && Array.isArray(developmentResult.data)) {
        developmentGoalsList = [...developmentResult.data];
      }

      // Merge all goals in correct order with custom goals
      const allGoals = mergeAndOrderGoals(
        predefinedGoalsList,
        smartGoalsList,
        developmentGoalsList,
        customGoals
      );

      if (allGoals.length > 0) {
        addDebugLog(`Total goals fetched: ${allGoals.length}`);
        addDebugLog(`Predefined goals: ${predefinedGoalsList.length}`);
        addDebugLog(`SMART goals: ${smartGoalsList.length}`);
        addDebugLog(`Development goals: ${developmentGoalsList.length}`);
        addDebugLog(`Custom SMART goals: ${customGoals.length}`);

        setGoals(allGoals);

        const editable = {};
        allGoals.forEach((goal) => {
          // Only set editable fields for non-custom goals
          if (!goal.id?.toString().startsWith("custom-")) {
            editable[goal.id] = {
              goalDescription: goal.goalDescription || goal.description || "",
              targetKPI: goal.targetKPI || "",
              achievableTarget: goal.achievableTarget || "",
              selfReviewComments: goal.selfReviewComments || "",
            };
          }
        });

        setEditableGoals(editable);
      } else {
        addDebugLog("No goals found");
        setGoals([]);
      }
    } catch (err) {
      console.error("Error fetching goals:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Initial load - fetch goals only once when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    if (employeeId) {
      fetchGoals();
      fetchEmployeeDetails();
    } else {
      setError("Employee ID not found in localStorage");
      setLoading(false);
    }
  }, [quarter, year, employeeId]); // Only depend on these, not customGoals

  // Separate effect to handle customGoals updates without refetching all goals
  useEffect(() => {
    if (!isInitialLoad && customGoals.length >= 0) {
      // Instead of refetching all goals, just update the goals state with new custom goals
      setGoals(prevGoals => {
        // Remove any existing custom goals from the list
        const nonCustomGoals = prevGoals.filter(goal => !goal.id?.toString().startsWith("custom-"));

        // Convert custom goals to the expected format
        const formattedCustomGoals = customGoals.map(customGoal => ({
          ...customGoal,
          goalType: "SMART",
          isCustom: true,
          title: customGoal.title || "Custom SMART Goal",
          goalDescription: customGoal.goalDescription || "",
          targetKPI: customGoal.targetKPI || "",
          achievableTarget: customGoal.achievableTarget || "",
          selfReviewComments: customGoal.selfReviewComments || "",
          weightage: 0
        }));

        // Merge non-custom goals with custom goals
        const allGoals = [...nonCustomGoals, ...formattedCustomGoals];

        // Maintain order: Predefined (already in nonCustomGoals) then SMART custom goals
        return allGoals;
      });
    }
  }, [customGoals, isInitialLoad]);

  const handleGoalEdit = (goalId, field, value) => {
    setEditableGoals((prev) => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        [field]: value,
      },
    }));

    if (validationErrors[goalId]?.[field]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        if (updated[goalId]) {
          delete updated[goalId][field];
          if (Object.keys(updated[goalId]).length === 0) {
            delete updated[goalId];
          }
        }
        return updated;
      });
    }
  };

  /**
   * Delete a SMART goal from the backend
   * @param {number|string} goalId - The ID of the SMART goal to delete
   * @returns {Promise<boolean>} - True if deletion was successful
   */
  const deleteSmartGoalFromBackend = async (goalId) => {
    addDebugLog(`Attempting to delete SMART goal with ID: ${goalId}`);

    try {
      const response = await fetch(
        `${BASE_URL_EPMS}/api/goals/smart/${goalId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to delete goal: HTTP ${response.status}`);
      }

      if (result.success) {
        addDebugLog(`SMART goal ${goalId} deleted successfully from backend`);
        return true;
      } else {
        throw new Error(result.message || "Failed to delete goal");
      }
    } catch (err) {
      addDebugLog(`Error deleting SMART goal: ${err.message}`);
      console.error("Delete SMART goal error:", err);
      throw err;
    }
  };

  /**
   * Handle deletion of a SMART goal (both custom and existing)
   * @param {number|string} goalId - The ID of the goal to delete
   */
  const handleDeleteSmartGoal = async (goalId) => {
    // Check if it's a custom goal (not yet saved to DB) or an existing SMART goal
    const isCustomGoal = goalId.toString().startsWith("custom-");

    if (isCustomGoal) {
      // Remove from customGoals array (frontend-only goal)
      const goalToRemove = customGoals.find(g => g.id === goalId);
      if (goalToRemove) {
        const index = customGoals.indexOf(goalToRemove);
        handleRemoveCustomGoal(index);
      }
      return;
    }

    // Confirm deletion for existing SMART goals in database
    if (!window.confirm("Are you sure you want to delete this SMART goal? This action cannot be undone.")) {
      return;
    }

    setDeleteInProgress(true);

    try {
      // Call the backend delete API
      await deleteSmartGoalFromBackend(goalId);

      // Remove the goal from the goals array
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));

      // Remove from editableGoals
      setEditableGoals((prev) => {
        const updated = { ...prev };
        delete updated[goalId];
        return updated;
      });

      // Remove from validation errors if present
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[goalId];
        return updated;
      });

      // Show success message
      alert("SMART goal deleted successfully!");
      addDebugLog(`SMART goal ${goalId} removed from UI state`);

    } catch (err) {
      console.error("Error deleting SMART goal:", err);
      addDebugLog(`Failed to delete SMART goal: ${err.message}`);
      alert(`Failed to delete goal: ${err.message}`);
    } finally {
      setDeleteInProgress(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    goals.forEach((goal) => {
      // Skip validation for custom goals that are being edited
      if (goal.id?.toString().startsWith("custom-")) {
        return;
      }

      const goalErrors = {};

      if (!editableGoals[goal.id]?.goalDescription?.trim()) {
        goalErrors.goalDescription = "Goal Description is required";
        isValid = false;
      }
      if (!editableGoals[goal.id]?.targetKPI?.trim()) {
        goalErrors.targetKPI = "Target KPI is required";
        isValid = false;
      }
      if (!editableGoals[goal.id]?.achievableTarget?.trim()) {
        goalErrors.achievableTarget = "Achievable Target is required";
        isValid = false;
      }

      if (Object.keys(goalErrors).length > 0) {
        errors[goal.id] = goalErrors;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const validateModal = () => {
    const errors = {};
    let isValid = true;

    if (!overallRating) {
      errors.overallRating = "Overall rating is required";
      isValid = false;
    }
    if (!overallComment?.trim()) {
      errors.overallComment = "Overall comment is required";
      isValid = false;
    }

    setModalErrors(errors);
    return isValid;
  };

  const getErrorMessage = async (response) => {
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        return (
          errorData.message || errorData.error || JSON.stringify(errorData)
        );
      } else {
        return await response.text();
      }
    } catch (e) {
      return `HTTP ${response.status}: ${response.statusText}`;
    }
  };

  const saveAsDraft = async () => {
    setSavingDraft(true);
    setError(null);
    addDebugLog("Starting draft save process...");

    try {
      // 1. Update predefined goals
      const predefinedGoals = goals.filter(
        (goal) => goal.goalType === "PREDEFINED" && !goal.id?.toString().startsWith("custom-"),
      );
      addDebugLog(`Updating ${predefinedGoals.length} predefined goals`);

      for (const goal of predefinedGoals) {
        const updatedData = {
          employeeId: employeeId,
          quarter: quarter,
          year: parseInt(year),
          saveAsDraft: true,
          goals: [
            {
              id: goal.id,
              goalDescription: editableGoals[goal.id]?.goalDescription || null,
              targetKPI: editableGoals[goal.id]?.targetKPI || null,
              achievableTarget:
                editableGoals[goal.id]?.achievableTarget || null,
              selfReviewComments:
                editableGoals[goal.id]?.selfReviewComments || null,
              weightage: goal.weightage || 0,
            },
          ],
        };

        const response = await fetch(
          `${BASE_URL_EPMS}/api/goals/update-predefined`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          },
        );

        if (!response.ok) {
          const errorMsg = await getErrorMessage(response);
          throw new Error(`Predefined goal error: ${errorMsg}`);
        }
      }

      // 2. Update existing SMART goals (those already in the 'goals' array and not custom)
      const smartGoals = goals.filter(
        (goal) => goal.goalType === "SMART" &&
          !goal.id?.toString().startsWith("custom-") &&
          !goal.isCustom
      );
      addDebugLog(`Updating ${smartGoals.length} existing SMART goals`);

      for (const goal of smartGoals) {
        const payload = {
          employeeId: employeeId,
          title: goal.title || "SMART Goal",
          goalDescription: editableGoals[goal.id]?.goalDescription || null,
          targetKPI: editableGoals[goal.id]?.targetKPI || null,
          weightage: goal.weightage || 0,
          achievableTarget: editableGoals[goal.id]?.achievableTarget || null,
          selfReviewComments:
            editableGoals[goal.id]?.selfReviewComments || null,
        };

        const response = await fetch(
          `${BASE_URL_EPMS}/api/goals/smart/draft/${goal.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) throw new Error(await getErrorMessage(response));
      }

      // 3. Handle custom (newly added) goals
      if (customGoals.length > 0) {
        addDebugLog(`Processing ${customGoals.length} custom goals`);

        for (let i = 0; i < customGoals.length; i++) {
          const customGoal = customGoals[i];

          // Skip if there is absolutely no content
          if (!customGoal.title?.trim() && !customGoal.goalDescription?.trim())
            continue;

          const isExistingInDb =
            customGoal.id && !customGoal.id.toString().startsWith("custom-");

          const payload = {
            employeeId: employeeId,
            managerId: managerId,
            title: customGoal.title?.trim() || "Custom SMART Goal",
            goalDescription: customGoal.goalDescription?.trim() || null,
            targetKPI: customGoal.targetKPI?.trim() || null,
            weightage: 0,
            achievableTarget: customGoal.achievableTarget?.trim() || null,
            selfReviewComments: customGoal.selfReviewComments?.trim() || null,
          };

          if (isExistingInDb) {
            const response = await fetch(
              `${BASE_URL_EPMS}/api/goals/smart/draft/${customGoal.id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              },
            );
            if (!response.ok) throw new Error(await getErrorMessage(response));
          } else {
            addDebugLog(`Creating new custom goal: ${payload.title}`);
            const response = await fetch(
              `${BASE_URL_EPMS}/api/goals/smart/draft/${quarter}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              },
            );

            if (!response.ok) {
              const errorMsg = await getErrorMessage(response);
              throw new Error(`Failed to create custom goal: ${errorMsg}`);
            }

            const result = await response.json();
            if (result.success && result.data?.id) {
              setCustomGoals((prev) => {
                const updated = [...prev];
                updated[i] = { ...updated[i], id: result.data.id };
                return updated;
              });
            }
          }
        }
      }

      addDebugLog("Draft save completed successfully");
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error saving draft:", err);
      addDebugLog(`Error in saveAsDraft: ${err.message}`);
      setError(err.message);
      alert(`Save Failed: ${err.message}`);
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstErrorId = Object.keys(validationErrors)[0];
      if (firstErrorId) {
        const element =
          document.getElementById(`goal-${firstErrorId}`) ||
          document.getElementById(firstErrorId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    if (!validateModal()) return;

    setSubmitting(true);
    setError(null);
    setShowModal(false);

    try {
      const goalsForSubmission = goals
        .filter(goal => !goal.id?.toString().startsWith("custom-"))
        .map((goal) => ({
          id: goal.id,
          goalDescription: editableGoals[goal.id]?.goalDescription || "",
          targetKPI: editableGoals[goal.id]?.targetKPI || "",
          achievableTarget: editableGoals[goal.id]?.achievableTarget || "",
          selfReviewComments: editableGoals[goal.id]?.selfReviewComments || "",
          overallSelfAssessmentRating: parseInt(overallRating),
          overallSelfReviewComments: overallComment?.trim(),
        }));

      // ============ API CALL 1: Update existing goals ============
      if (goalsForSubmission.length > 0) {
        const payload = {
          employeeId: employeeId,
          quarter: quarter,
          year: parseInt(year),
          goals: goalsForSubmission,
        };

        const response = await fetch(
          `${BASE_URL_EPMS}/api/goals/self-review/submit`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to update goals");
        }
      }

      // ============ API CALL 2: Create custom goals ============
      for (let i = 0; i < customGoals.length; i++) {
        const customGoal = customGoals[i];

        if (
          !customGoal.goalDescription?.trim() ||
          !customGoal.targetKPI?.trim() ||
          !customGoal.achievableTarget?.trim()
        ) {
          addDebugLog(
            `Skipping custom goal ${i} due to missing required fields for submission`,
          );
          continue;
        }

        const payload = {
          employeeId: employeeId,
          managerId: managerId,
          title: customGoal.title || "Custom SMART Goal",
          goalDescription: customGoal.goalDescription || "",
          targetKPI: customGoal.targetKPI || "",
          weightage: 0,
          achievableTarget: customGoal.achievableTarget || "",
          selfReviewComments: customGoal.selfReviewComments || "",
          overallSelfAssessmentRating: parseInt(overallRating),
          overallSelfReviewComments: overallComment?.trim(),
        };

        if (!payload.managerId) {
          console.error("Manager ID is missing! Cannot create a new goal.");
        }

        const response = await fetch(
          `${BASE_URL_EPMS}/api/goals/smart/with-review/${quarter}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
            `Failed to create custom goal: ${customGoal.title}`,
          );
        }
      }

      // ============ API CALL 3: Trigger Email to Manager ============
      if (employeeData && employeeData.reportingManagerEmailId) {
        try {
          const emailPayload = {
            templateId: 3,
            to: employeeData.reportingManagerEmailId,
            variables: {
              managerName: getManagerFullName(employeeData),
              employeeName: getEmployeeFullName(employeeData),
              quarter: quarter,
            },
          };

          const emailResponse = await fetch(
            `${BASE_URL_EPMS}/api/email/send`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(emailPayload),
            },
          );

          if (!emailResponse.ok) {
            throw new Error("Email API returned non-OK status");
          }
          console.log("Email notification sent to manager successfully");
        } catch (emailError) {
          console.error(
            "Goals submitted, but manager email notification failed:",
            emailError,
          );
        }
      }

      setShowSuccessModal(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
      alert(`Failed to submit: ${err.message}`);
    } finally {
      setSubmitting(false);
      setOverallRating("");
      setOverallComment("");
      setModalErrors({});
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate(
      `/employee/appraisal/preview/${employeeId}?year=${year}&quarter=${quarter}`,
    );
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalErrors({});
  };

  const handleBack = () => {
    navigate(
      `/employee/appraisal/preview/${employeeId}?year=${year}&quarter=${quarter}`,
    );
  };

  const getFieldError = (goalId, field) => {
    return validationErrors[goalId]?.[field] ? (
      <p className="mt-1 text-xs text-red-600">
        {validationErrors[goalId][field]}
      </p>
    ) : null;
  };

  const handleAddCustomGoal = () => {
    const newCustomGoal = {
      id: `custom-${Date.now()}`,
      title: "Custom SMART Goal",
      goalDescription: "",
      targetKPI: "",
      achievableTarget: "",
      selfReviewComments: "",
      goalType: "SMART",
      isCustom: true,
      weightage: 0
    };
    setCustomGoals((prev) => [...prev, newCustomGoal]);
  };

  const handleCustomGoalChange = (index, field, value) => {
    const updatedCustomGoals = [...customGoals];
    updatedCustomGoals[index][field] = value;
    setCustomGoals(updatedCustomGoals);
  };

  const handleRemoveCustomGoal = (indexToRemove) => {
    const updatedCustomGoals = customGoals.filter(
      (_, index) => index !== indexToRemove,
    );
    setCustomGoals(updatedCustomGoals);
  };

  const getGoalTypeLabel = (goal) => {
    if (goal.goalType === "SMART") return "SMART";
    if (goal.goalType === "PREDEFINED") return "Predefined";
    if (goal.goalType === "DEVELOPMENT") return "Development";
    return "Goal";
  };

  return (
    <div className="flex flex-col min-h-screen font-content bg-gray-50">
      <Header />

      <div className="mt-24 px-6 max-w-7xl mx-auto w-full pb-10">
        <nav className="flex items-center text-sm mb-6">
          <button
            onClick={() => navigate(-1)}
            disabled={submitting || savingDraft}
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
            onClick={() => navigate("/EmployeeAppraisal")}
            className="cursor-pointer text-gray-600 hover:text-red-500 transition-colors"
          >
            My Performance
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600">Self Assessment</span>
        </nav>

        {(submitting || savingDraft) && (
          <LoadingAnimation message={submitting ? "Submitting self review..." : "Saving draft..."} />
        )}

        {loading && (
          <LoadingAnimation message="Loading assessment form..." />
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 font-medium">Error: {error}</p>
            <button
              onClick={handleBack}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Go Back
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-800">
                    Self Assessment · {quarter} {year}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Provide your self-assessment for each goal. All fields
                    marked with * are required.
                  </p>
                </div>
              </div>
            </div>

            <form className="space-y-6">
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Goals Assessment
                  </h2>
                  <button
                    type="button"
                    onClick={handleAddCustomGoal}
                    disabled={deleteInProgress}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Add SMART Goal
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Goal
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Goal Type
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Goal Description *
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Target KPI *
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Weightage (%)
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Achievable Target *
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Comments
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {goals.map((goal) => {
                        const isCustomGoal = goal.id?.toString().startsWith("custom-");
                        const isSmartGoal = goal.goalType === "SMART";
                        const isPredefinedGoal = goal.goalType === "PREDEFINED";
                        const isDevelopmentGoal = goal.goalType === "DEVELOPMENT";

                        return (
                          <tr
                            key={goal.id}
                            id={`goal-${goal.id}`}
                            className={`hover:bg-gray-50 ${validationErrors[goal.id] ? "bg-red-50" : ""
                              }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {isCustomGoal ? (
                                <input
                                  type="text"
                                  value={goal.title}
                                  onChange={(e) => {
                                    const customGoalIndex = customGoals.findIndex(g => g.id === goal.id);
                                    if (customGoalIndex !== -1) {
                                      handleCustomGoalChange(customGoalIndex, "title", e.target.value);
                                    }
                                  }}
                                  className="w-full border border-gray-300 px-2 py-1 rounded focus:ring-red-500 focus:border-red-500"
                                  placeholder="Goal Title"
                                />
                              ) : (
                                goal.title
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${isSmartGoal
                                    ? "bg-blue-100 text-blue-800"
                                    : isPredefinedGoal
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                              >
                                {getGoalTypeLabel(goal)}
                                {isCustomGoal && " (New)"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                              <textarea
                                value={
                                  isCustomGoal
                                    ? goal.goalDescription
                                    : (editableGoals[goal.id]?.goalDescription || "")
                                }
                                onChange={(e) => {
                                  if (isCustomGoal) {
                                    const customGoalIndex = customGoals.findIndex(g => g.id === goal.id);
                                    if (customGoalIndex !== -1) {
                                      handleCustomGoalChange(customGoalIndex, "goalDescription", e.target.value);
                                    }
                                  } else {
                                    handleGoalEdit(goal.id, "goalDescription", e.target.value);
                                  }
                                }}
                                className="w-full border border-gray-300 px-2 py-1 rounded focus:ring-red-500 focus:border-red-500"
                                rows="2"
                                placeholder="Enter goal description..."
                                disabled={deleteInProgress}
                              />
                              {!isCustomGoal && getFieldError(goal.id, "goalDescription")}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                              <input
                                value={
                                  isCustomGoal
                                    ? goal.targetKPI
                                    : (editableGoals[goal.id]?.targetKPI || "")
                                }
                                onChange={(e) => {
                                  if (isCustomGoal) {
                                    const customGoalIndex = customGoals.findIndex(g => g.id === goal.id);
                                    if (customGoalIndex !== -1) {
                                      handleCustomGoalChange(customGoalIndex, "targetKPI", e.target.value);
                                    }
                                  } else {
                                    handleGoalEdit(goal.id, "targetKPI", e.target.value);
                                  }
                                }}
                                className="w-full border border-gray-300 px-2 py-1 rounded focus:ring-red-500 focus:border-red-500"
                                placeholder="Enter target KPI..."
                                disabled={deleteInProgress}
                              />
                              {!isCustomGoal && getFieldError(goal.id, "targetKPI")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {goal.weightage ? `${goal.weightage}%` : "0%"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <div>
                                <textarea
                                  rows="2"
                                  value={
                                    isCustomGoal
                                      ? goal.achievableTarget
                                      : (editableGoals[goal.id]?.achievableTarget || "")
                                  }
                                  onChange={(e) => {
                                    if (isCustomGoal) {
                                      const customGoalIndex = customGoals.findIndex(g => g.id === goal.id);
                                      if (customGoalIndex !== -1) {
                                        handleCustomGoalChange(customGoalIndex, "achievableTarget", e.target.value);
                                      }
                                    } else {
                                      handleGoalEdit(goal.id, "achievableTarget", e.target.value);
                                    }
                                  }}
                                  className={`w-full px-2 py-1 border rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm ${!isCustomGoal && validationErrors[goal.id]?.achievableTarget
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-300"
                                    }`}
                                  placeholder="Write your achievable target..."
                                  disabled={deleteInProgress}
                                />
                                {!isCustomGoal && getFieldError(goal.id, "achievableTarget")}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <div>
                                <textarea
                                  rows="2"
                                  value={
                                    isCustomGoal
                                      ? goal.selfReviewComments
                                      : (editableGoals[goal.id]?.selfReviewComments || "")
                                  }
                                  onChange={(e) => {
                                    if (isCustomGoal) {
                                      const customGoalIndex = customGoals.findIndex(g => g.id === goal.id);
                                      if (customGoalIndex !== -1) {
                                        handleCustomGoalChange(customGoalIndex, "selfReviewComments", e.target.value);
                                      }
                                    } else {
                                      handleGoalEdit(goal.id, "selfReviewComments", e.target.value);
                                    }
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                  placeholder="Additional comments (optional)"
                                  disabled={deleteInProgress}
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {(isSmartGoal || isCustomGoal) && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSmartGoal(goal.id)}
                                  disabled={deleteInProgress}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {deleteInProgress ? "Deleting..." : "Remove"}
                                </button>
                              )}
                              {isPredefinedGoal && (
                                <span className="text-xs text-gray-400">
                                  Cannot delete
                                </span>
                              )}
                              {isDevelopmentGoal && (
                                <span className="text-xs text-gray-400">
                                  Cannot delete
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {Object.keys(validationErrors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600 font-medium">
                    Please fill in all required fields:
                  </p>
                  <ul className="mt-2 list-disc list-inside text-sm text-red-600">
                    {Object.keys(validationErrors).map((errorKey) => {
                      const goal = goals.find((g) => g.id === parseInt(errorKey));
                      return Object.keys(validationErrors[errorKey]).map(
                        (field) => (
                          <li key={`${errorKey}-${field}`}>
                            {goal?.title} -{" "}
                            {field === "achievableTarget"
                              ? "Achievable Target"
                              : field === "goalDescription"
                                ? "Goal Description"
                                : "Target KPI"}{" "}
                            is required
                          </li>
                        ),
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={deleteInProgress}
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveAsDraft}
                  disabled={savingDraft || submitting || deleteInProgress}
                  className="inline-flex justify-center items-center px-6 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingDraft ? "Saving..." : "Save as Draft"}
                </button>
                <button
                  type="button"
                  onClick={handleSubmitClick}
                  disabled={submitting || savingDraft || deleteInProgress}
                  className="inline-flex justify-center items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Self Assessment"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Overall Assessment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleModalClose}
          ></div>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Overall Assessment
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Please provide your overall rating and comments for this
                  quarter.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overall Rating (1-5) *
                  </label>
                  <select
                    value={overallRating}
                    onChange={(e) => {
                      setOverallRating(e.target.value);
                      if (modalErrors.overallRating)
                        setModalErrors((prev) => ({
                          ...prev,
                          overallRating: null,
                        }));
                    }}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm ${modalErrors.overallRating
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                      }`}
                  >
                    <option value="">Select rating</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                  {modalErrors.overallRating && (
                    <p className="mt-1 text-xs text-red-600">
                      {modalErrors.overallRating}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overall Comment *
                  </label>
                  <textarea
                    rows="4"
                    value={overallComment}
                    onChange={(e) => {
                      setOverallComment(e.target.value);
                      if (modalErrors.overallComment)
                        setModalErrors((prev) => ({
                          ...prev,
                          overallComment: null,
                        }));
                    }}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm ${modalErrors.overallComment
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                      }`}
                    placeholder="Enter your overall comments for this quarter..."
                  />
                  {modalErrors.overallComment && (
                    <p className="mt-1 text-xs text-red-600">
                      {modalErrors.overallComment}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalSubmit}
                  disabled={submitting}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleSuccessModalClose}
          ></div>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {savingDraft
                    ? "Draft Saved Successfully!"
                    : "Self-Assessment Submitted Successfully!"}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {savingDraft
                    ? "Your draft has been saved. You can continue editing later."
                    : "Your self-assessment has been submitted and sent to your manager for review."}
                </p>
                <button
                  onClick={handleSuccessModalClose}
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfAssessmentForm;