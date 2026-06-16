import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaSave,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEdit,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";
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

const AddGoal = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const managerId = localStorage.getItem("empId");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quarter = queryParams.get("quarter") || "Q1";
  const year = queryParams.get("year") || "";
  const isEdit = queryParams.get("edit") === "true";

  const existingGoalsFromState = location.state?.existingGoals || [];

  const [goalMasterData, setGoalMasterData] = useState([]);
  const [groupedGoals, setGroupedGoals] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState({});
  const [existingGoalMap, setExistingGoalMap] = useState(new Map());
  const [employeeData, setEmployeeData] = useState(null);
  const [activeCycle, setActiveCycle] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [validationError, setValidationError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    if (!year) {
      fetchActiveCycle();
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadData = async () => {
      setLoading(true);
      await fetchGoalMasterData();
      if (empId) {
        await fetchEmployeeDetails();
      }
    };

    loadData();
  }, [empId]);

  useEffect(() => {
    if (
      isEdit &&
      goalMasterData.length > 0 &&
      existingGoalsFromState.length > 0
    ) {
      console.log(
        "Processing existing goals from state:",
        existingGoalsFromState,
      );

      const goalMap = new Map();
      const updatedSelected = { ...selectedGoals };

      existingGoalsFromState.forEach((existingGoal) => {
        goalMasterData.forEach((group) => {
          group.items.forEach((item) => {
            if (item.differentiatorName === existingGoal.title) {
              updatedSelected[item.id] = true;
              goalMap.set(item.id, existingGoal);
              console.log(
                `Found existing goal: ${item.differentiatorName} (Master ID: ${item.id}, Goal ID: ${existingGoal.id})`,
              );
            }
          });
        });
      });

      setExistingGoalMap(goalMap);
      setSelectedGoals(updatedSelected);
      console.log("Selected goals after processing:", updatedSelected);
      setLoading(false);
    } else if (isEdit && existingGoalsFromState.length === 0) {
      setLoading(false);
    } else if (!isEdit) {
      setLoading(false);
    }
  }, [goalMasterData, existingGoalsFromState, isEdit]);

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
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
    }
  };

  const fetchGoalMasterData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL_EPMS}/api/goal-master/grouped`,
      );

      if (response.data && response.data.success) {
        const groupedData = response.data.data;
        setGoalMasterData(groupedData);

        const grouped = {};
        groupedData.forEach((group) => {
          grouped[group.category] = group.items;
        });
        setGroupedGoals(grouped);

        const initialSelected = {};
        groupedData.forEach((group) => {
          group.items.forEach((item) => {
            initialSelected[item.id] = false;
          });
        });

        setSelectedGoals(initialSelected);

        // Initialize all categories as collapsed (false)
        const initialExpanded = {};
        groupedData.forEach((group) => {
          initialExpanded[group.category] = false;
        });
        setExpandedCategories(initialExpanded);
      }
    } catch (err) {
      console.error("Error fetching goal master data:", err);
      setError("Failed to load goal master data. Please try again.");
    }
  };

  const getSelectedCount = () => {
    return Object.values(selectedGoals).filter(Boolean).length;
  };

  const handleCheckboxChange = (goalId) => {
    setSelectedGoals((prev) => {
      const newState = {
        ...prev,
        [goalId]: !prev[goalId],
      };
      console.log("Updated selected goals state:", newState);
      return newState;
    });
  };

  const handleSelectAll = (category, items) => {
    const newSelected = { ...selectedGoals };
    const allSelected = items.every((item) => selectedGoals[item.id]);

    items.forEach((item) => {
      newSelected[item.id] = !allSelected;
    });

    setSelectedGoals(newSelected);

    if (validationError) {
      setValidationError(null);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setValidationError(null);

    try {
      const selectedMasterIds = Object.entries(selectedGoals)
        .filter(([_, isSelected]) => isSelected === true)
        .map(([id]) => parseInt(id));

      const selectedCount = selectedMasterIds.length;

      console.log("Selected master IDs for save:", selectedMasterIds);

      if (selectedCount === 0) {
        setValidationError("Please select at least one goal to add.");
        setSaving(false);
        return;
      }

      const yearToUse = year || activeCycle?.year;

      if (!yearToUse) {
        setValidationError("Year is not available. Please try again.");
        setSaving(false);
        return;
      }

      if (isEdit) {
        // Get currently existing goal master IDs (from the map)
        const existingMasterIds = Array.from(existingGoalMap.keys());

        // Goals to DELETE: existing but NOT selected
        const masterIdsToDelete = existingMasterIds.filter(
          (id) => !selectedMasterIds.includes(id),
        );

        // Goals to ADD: selected but NOT existing
        const masterIdsToAdd = selectedMasterIds.filter(
          (id) => !existingMasterIds.includes(id),
        );

        console.log("=== UPDATE OPERATION ===");
        console.log("Existing Master IDs:", existingMasterIds);
        console.log("Selected Master IDs:", selectedMasterIds);
        console.log("Master IDs to Delete:", masterIdsToDelete);
        console.log("Master IDs to Add:", masterIdsToAdd);

        // Step 1: Delete unselected goals
        if (masterIdsToDelete.length > 0) {
          const goalsToDelete = masterIdsToDelete
            .map((masterId) => existingGoalMap.get(masterId))
            .filter((goal) => goal && goal.id);

          console.log("Goals to delete:", goalsToDelete);

          const goalIdsToDelete = goalsToDelete.map((g) => g.id);

          await axios.delete(`${BASE_URL_EPMS}/api/goals/bulk`, {
            data: goalIdsToDelete,
          });
        } else {
          console.log("No goals to delete");
        }

        // Step 2: Add new selected goals
        if (masterIdsToAdd.length > 0) {
          const addPayload = {
            employeeId: empId,
            managerId: managerId,
            quarter: quarter,
            year: parseInt(yearToUse),
            goalMasterIds: masterIdsToAdd,
            createdBy: localStorage.getItem("email") || "SYSTEM",
          };

          console.log("Adding new goals with payload:", addPayload);

          const addResponse = await axios.post(
            `${BASE_URL_EPMS}/api/goals/assign-predefined`,
            addPayload,
          );

          if (addResponse.data && addResponse.data.success) {
            console.log(`✓ Added ${masterIdsToAdd.length} new goals`);
          } else {
            throw new Error("Failed to add new goals");
          }
        } else {
          console.log("No new goals to add");
        }

        // If no changes were made
        if (masterIdsToDelete.length === 0 && masterIdsToAdd.length === 0) {
          setPopupMessage("No changes were made to the goals.");
          setShowSuccessPopup(true);
          setTimeout(() => {
            navigate(
              `/manager/predefined-goals/${empId}?quarter=${quarter}&year=${yearToUse}`,
            );
          }, 1500);
          setSaving(false);
          return;
        }

        // Success message
        const deletedCount = masterIdsToDelete.length;
        const addedCount = masterIdsToAdd.length;
        const message = `Successfully updated goals! ${deletedCount > 0 ? `Removed ${deletedCount} goal(s). ` : ""
          }${addedCount > 0 ? `Added ${addedCount} goal(s).` : ""}`;

        setPopupMessage(message);
        setShowSuccessPopup(true);

        setTimeout(() => {
          navigate(
            `/manager/predefined-goals/${empId}?quarter=${quarter}&year=${yearToUse}`,
            {
              state: { showSuccess: true, message: message },
            },
          );
        }, 1500);
      } else {
        // ADD MODE - Create new goals
        const payload = {
          employeeId: empId,
          managerId: managerId,
          quarter: quarter,
          year: parseInt(yearToUse),
          goalMasterIds: selectedMasterIds,
          createdBy: localStorage.getItem("email") || "SYSTEM",
        };

        const response = await axios.post(
          `${BASE_URL_EPMS}/api/goals/assign-predefined`,
          payload,
        );

        if (response.data && response.data.success) {
          setPopupMessage(`Successfully assigned ${selectedCount} goal(s)!`);
          setShowSuccessPopup(true);

          setTimeout(() => {
            navigate(
              `/manager/predefined-goals/${empId}?quarter=${quarter}&year=${yearToUse}`,
              {
                state: {
                  showSuccess: true,
                  message: `Successfully assigned ${selectedCount} goal(s)!`,
                },
              },
            );
          }, 1500);
        } else {
          throw new Error(response.data?.message || "Failed to assign goals");
        }
      }
    } catch (err) {
      console.error("Error saving goals:", err);
      setError(
        err.response?.data?.message ||
        "Failed to save goals. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const formatCategoryName = (category) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const displayYear = year || activeCycle?.year || "";
  const selectedCount = getSelectedCount();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading goal setup..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-content bg-gray-50">
      <Header />

      {showSuccessPopup && (
        <div className="fixed top-24 right-4 z-50 animate-slideIn">
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[300px]">
            <FaCheckCircle className="text-green-500 text-xl flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">{popupMessage}</p>
              <p className="text-green-600 text-sm mt-1">
                Redirecting to goals page...
              </p>
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

      <div className="mt-24 px-4 md:px-6 max-w-7xl mx-auto w-full pb-8">
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
            Performance List
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-semibold text-red-600">
            {isEdit ? "Edit Goals" : "Add Goals"}
          </span>
        </nav>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isEdit
                  ? "Add Goals for Employee"
                  : "Add Goals to the Employee"}
              </h1>
              {employeeData && (
                <p className="text-gray-600 mt-2">
                  {getEmployeeFullName(employeeData)} -{" "}
                  {employeeData.empCode}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Quarter {quarter} {displayYear && `- ${displayYear}`}
              </p>
              {isEdit && existingGoalsFromState.length > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  <FaEdit className="text-blue-500" />
                  <span>
                    Edit Mode: {existingGoalsFromState.length} goal(s) currently
                    selected
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {validationError && (
          <div className="mb-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-sm p-4 flex items-start gap-3">
              <FaExclamationTriangle className="text-yellow-500 text-xl flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-yellow-800 font-medium">Validation Error</p>
                <p className="text-yellow-700 text-sm mt-1">
                  {validationError}
                </p>
              </div>
              <button
                onClick={() => setValidationError(null)}
                className="text-yellow-600 hover:text-yellow-800"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    S.NO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PREDEFINED GOAL DEFINATION
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PARAMETERS / DEFINITION
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    SELECT
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {goalMasterData.length > 0 ? (
                  goalMasterData.map((group, groupIndex) => {
                    const isExpanded = expandedCategories[group.category] || false;
                    const categoryItemCount = group.items.length;
                    const selectedInCategory = group.items.filter(
                      (item) => selectedGoals[item.id]
                    ).length;

                    return (
                      <React.Fragment key={group.category}>
                        {/* Category Header - Clickable to expand/collapse */}
                        <tr
                          className="bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => toggleCategory(group.category)}
                        >
                          <td colSpan="4" className="px-6 py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {isExpanded ? (
                                  <FaChevronDown className="text-gray-600 text-sm" />
                                ) : (
                                  <FaChevronRight className="text-gray-600 text-sm" />
                                )}
                                <span className="font-semibold text-gray-700">
                                  {formatCategoryName(group.category)}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  ({selectedInCategory}/{categoryItemCount} selected)
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectAll(group.category, group.items);
                                  }}
                                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                                >
                                  {group.items.every(
                                    (item) => selectedGoals[item.id],
                                  )
                                    ? "Deselect All"
                                    : "Select All"}
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>

                        {/* Category Items - Only show when expanded */}
                        {isExpanded && group.items.map((item, itemIndex) => {
                          // Calculate global S.NO considering only expanded items
                          // But for simplicity, we'll show sequential number within the expanded view
                          const sno =
                            goalMasterData
                              .slice(0, groupIndex)
                              .reduce((acc, g) => acc + g.items.length, 0) +
                            itemIndex +
                            1;

                          const isSelected = selectedGoals[item.id] || false;

                          return (
                            <tr
                              key={item.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {sno}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {item.differentiatorName}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {item.definition}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleCheckboxChange(item.id)}
                                    className="h-5 w-5 rounded border-gray-300 focus:ring-red-500 cursor-pointer text-red-600"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No goals found in master data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                {selectedCount} goal(s) selected
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || selectedCount === 0}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" />
                {isEdit ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <FaSave />
                {isEdit ? "Update" : "Save"}{" "}
                {selectedCount > 0 ? `(${selectedCount})` : ""}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGoal;