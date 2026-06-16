// pages/manager/ManagerBulkPredefinedGoals.jsx
import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimes,
  FaSpinner,
  FaSave,
  FaChevronDown,
  FaInfoCircle,
  FaCalculator,
  FaUser,
  FaUsers,
  FaEdit,
  FaCopy,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaLink,
  FaCalendar,
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

const ManagerBulkPredefinedGoals = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quarter: quarterParam } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const quarter = queryParams.get("quarter") || quarterParam || "Q1";
  const yearParam = queryParams.get("year") || "";
  const empCodesParam = queryParams.get("empCodes") || "";
  
  const { selectedEmployees: stateSelectedEmployees, showSuccess: stateShowSuccess, message: stateMessage } = location.state || {};
  
  const [employeesData, setEmployeesData] = useState([]);
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCycle, setActiveCycle] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [bulkMode, setBulkMode] = useState(true);
  const [bulkGoalsData, setBulkGoalsData] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [openDropdownIndices, setOpenDropdownIndices] = useState({});
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [originalWeightages, setOriginalWeightages] = useState({});

  const timelineOptions = [
    { value: "Q1", label: "Q1" },
    { value: "Q2", label: "Q2" },
    { value: "Q3", label: "Q3" },
    { value: "Q4", label: "Q4" },
  ];

  // Helper function to normalize category names
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

  // Calculate redistributed weightage based on selected categories
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

  useEffect(() => {
    if (stateShowSuccess && stateMessage) {
      setPopupMessage(stateMessage);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  }, [stateShowSuccess, stateMessage]);

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
                lastName: employee.lastName,
                emailId: employee.emailId,
                designation: employee.designationName || employee.designation,
              };
            }
            return {
              empCode: code,
              id: code,
              firstName: `Employee ${code}`,
              lastName: "",
              emailId: "",
              designation: "Not Available",
            };
          });
          
          setSelectedEmployees(employees);
        } catch (error) {
          console.error("Error fetching employee details:", error);
          const employees = empCodesList.map(code => ({
            empCode: code,
            id: code,
            firstName: `Employee ${code}`,
            lastName: "",
            emailId: "",
            designation: "Software Engineer",
          }));
          setSelectedEmployees(employees);
        }
      } else if (stateSelectedEmployees && stateSelectedEmployees.length > 0) {
        setSelectedEmployees(stateSelectedEmployees);
      } else {
        setErrorPopupMessage("No employees selected. Please go back and select employees.");
        setShowErrorPopup(true);
        setLoading(false);
      }
    };
    
    fetchEmployeesFromCodes();
  }, [empCodesParam, stateSelectedEmployees]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!yearParam) {
      fetchActiveCycle();
    }
  }, [yearParam]);

  useEffect(() => {
    if (selectedEmployees && selectedEmployees.length > 0 && (activeCycle || yearParam)) {
      fetchAllEmployeesGoals();
    }
  }, [selectedEmployees, quarter, yearParam, activeCycle]);

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

  const fetchAllEmployeesGoals = async () => {
    setLoading(true);
    
    const yearToUse = yearParam || activeCycle?.year || new Date().getFullYear().toString();
    const employeesGoals = [];

    for (const employee of selectedEmployees) {
      const empCode = employee.empCode || employee.id;
      try {
        const response = await axios.get(
          `${BASE_URL_EPMS}/api/goals/predefined/employee/${empCode}/${quarter}`,
          { params: { year: yearToUse } }
        );

        if (response.data && response.data.success) {
          const fetchedGoals = response.data.data || [];
          
          const anySubmitted = fetchedGoals.some(
            (goal) => goal.submittedToEmployeeAt !== null && goal.submittedToEmployeeAt !== undefined
          );
          
          let submittedDate = null;
          if (anySubmitted) {
            const submissionDates = fetchedGoals
              .filter(goal => goal.submittedToEmployeeAt)
              .map(goal => new Date(goal.submittedToEmployeeAt));
            if (submissionDates.length > 0) {
              submittedDate = new Date(Math.max(...submissionDates));
            }
          }

          const { groupedGoals, selectedCategories } = groupGoalsByCategory(fetchedGoals);
          
          // Calculate redistributed weightages based on selected categories
          const redistributedWeights = calculateRedistributedWeightage(selectedCategories);
          
          // Apply redistributed weights to grouped goals
          const groupedWithWeights = groupedGoals.map(goal => ({
            ...goal,
            weightage: redistributedWeights[goal.category] || 0
          }));
          
          employeesGoals.push({
            employee: employee,
            goals: fetchedGoals,
            groupedGoals: groupedWithWeights,
            isSubmitted: anySubmitted,
            submittedDate: submittedDate,
            selectedCategories: selectedCategories,
          });
        } else {
          employeesGoals.push({
            employee: employee,
            goals: [],
            groupedGoals: [],
            isSubmitted: false,
            submittedDate: null,
            selectedCategories: [],
          });
        }
      } catch (err) {
        console.error(`Error fetching goals for employee ${empCode}:`, err);
        employeesGoals.push({
          employee: employee,
          goals: [],
          groupedGoals: [],
          isSubmitted: false,
          submittedDate: null,
          selectedCategories: [],
        });
      }
    }

    setEmployeesData(employeesGoals);
    
    // Initialize bulk goals data with the first employee's goals
    if (employeesGoals.length > 0 && employeesGoals[0].groupedGoals.length > 0) {
      const initialBulkData = employeesGoals[0].groupedGoals.map(goal => ({
        ...goal,
        // Store original IDs for later submission
        originalGoalIds: goal.originalGoals?.map(og => og.id) || []
      }));
      setBulkGoalsData(initialBulkData);
      setOriginalWeightages(calculateRedistributedWeightage(employeesGoals[0].selectedCategories));
    }
    
    setLoading(false);
  };

  const groupGoalsByCategory = (goals) => {
    if (!goals || goals.length === 0) return { groupedGoals: [], selectedCategories: [] };
    
    const grouped = {};
    const selectedCategoriesSet = new Set();
    
    goals.forEach((goal) => {
      let category = goal.goalCategory || "Other";
      
      // Format category for display
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
      selectedCategoriesSet.add(displayCategory);

      if (!grouped[displayCategory]) {
        grouped[displayCategory] = [];
      }
      grouped[displayCategory].push(goal);
    });

    const groupedArray = Object.entries(grouped).map(([category, categoryGoals]) => {
      const combinedTitle = categoryGoals.map((g) => g.title).join(", ");
      const combinedGoalDescription = categoryGoals.length === 1
        ? categoryGoals[0].goalDescription || `Complete ${categoryGoals[0].title} training`
        : categoryGoals.map((g, idx) => {
            const desc = g.goalDescription || `Complete ${g.title} training`;
            return idx === 0 ? desc : `and ${desc.toLowerCase()}`;
          }).join(" ");
      
      const combinedTargetKPI = categoryGoals.length === 1
        ? categoryGoals[0].targetKPI || "100% completion"
        : categoryGoals.map((g) => g.targetKPI || "100% completion").join(" and ");
      
      const allTimelines = categoryGoals.flatMap((g) =>
        g.timeline ? (Array.isArray(g.timeline) ? g.timeline : [g.timeline]) : [quarter]
      );
      const uniqueTimelines = [...new Set(allTimelines)];

      return {
        category,
        rawCategory: categoryGoals[0]?.goalCategory || category,
        combinedTitle,
        goalDescription: combinedGoalDescription,
        targetKPI: combinedTargetKPI,
        weightage: 0, // Will be calculated later
        timeline: uniqueTimelines,
        originalGoals: categoryGoals,
      };
    });

    return { groupedGoals: groupedArray, selectedCategories: Array.from(selectedCategoriesSet) };
  };

  // Handle bulk field changes - updates all employees with automatic weightage recalculation
  const handleBulkFieldChange = (groupIndex, field, value) => {
    if (!bulkGoalsData) return;
    
    // Update bulk template
    const updatedBulk = [...bulkGoalsData];
    updatedBulk[groupIndex][field] = value;
    setBulkGoalsData(updatedBulk);
    
    // Update all employees with the new bulk data, preserving weightages
    setEmployeesData(prevData => {
      const newData = [...prevData];
      for (let i = 0; i < newData.length; i++) {
        if (!newData[i].isSubmitted) {
          const updatedGrouped = updatedBulk.map((group, idx) => ({
            ...group,
            weightage: newData[i].groupedGoals[idx]?.weightage || group.weightage,
            originalGoals: newData[i].groupedGoals[idx]?.originalGoals || group.originalGoals || []
          }));
          newData[i].groupedGoals = updatedGrouped;
        }
      }
      return newData;
    });
  };

  // Handle bulk weightage - weightages are auto-calculated, so this is read-only
  const handleBulkWeightageChange = (groupIndex, value) => {
    // Weightages are auto-calculated, so we don't allow manual changes
    // This function is kept for compatibility but does nothing
  };

  const handleBulkTimelineToggle = (groupIndex, quarterValue) => {
    if (!bulkGoalsData) return;
    
    const updatedBulk = [...bulkGoalsData];
    const currentTimeline = updatedBulk[groupIndex].timeline || [];
    
    let newTimeline;
    if (currentTimeline.includes(quarterValue)) {
      newTimeline = currentTimeline.filter((q) => q !== quarterValue);
    } else {
      newTimeline = [...currentTimeline, quarterValue];
    }
    
    updatedBulk[groupIndex].timeline = newTimeline;
    setBulkGoalsData(updatedBulk);
    
    // Update all employees with the new timeline
    setEmployeesData(prevData => {
      const newData = [...prevData];
      for (let i = 0; i < newData.length; i++) {
        if (!newData[i].isSubmitted) {
          const updatedGrouped = [...newData[i].groupedGoals];
          updatedGrouped[groupIndex] = {
            ...updatedGrouped[groupIndex],
            timeline: newTimeline
          };
          newData[i].groupedGoals = updatedGrouped;
        }
      }
      return newData;
    });
  };

  // Individual mode handlers
  const handleIndividualFieldChange = (employeeIndex, groupIndex, field, value) => {
    setEmployeesData(prevData => {
      const newData = [...prevData];
      const updatedGrouped = [...newData[employeeIndex].groupedGoals];
      updatedGrouped[groupIndex][field] = value;
      newData[employeeIndex].groupedGoals = updatedGrouped;
      return newData;
    });
  };

  const handleIndividualWeightageChange = (employeeIndex, groupIndex, value) => {
    // Weightages are auto-calculated, so we don't allow manual changes
    // This function is kept for compatibility but does nothing
  };

  const handleIndividualTimelineToggle = (employeeIndex, groupIndex, quarterValue) => {
    setEmployeesData(prevData => {
      const newData = [...prevData];
      const updatedGrouped = [...newData[employeeIndex].groupedGoals];
      const currentTimeline = updatedGrouped[groupIndex].timeline || [];
      
      let newTimeline;
      if (currentTimeline.includes(quarterValue)) {
        newTimeline = currentTimeline.filter((q) => q !== quarterValue);
      } else {
        newTimeline = [...currentTimeline, quarterValue];
      }
      
      updatedGrouped[groupIndex].timeline = newTimeline;
      newData[employeeIndex].groupedGoals = updatedGrouped;
      return newData;
    });
  };

  const copyFromCurrent = () => {
    const currentEmployee = employeesData[currentEmployeeIndex];
    if (currentEmployee && !currentEmployee.isSubmitted && currentEmployee.groupedGoals.length > 0) {
      const copiedData = currentEmployee.groupedGoals.map(goal => ({
        ...goal,
        originalGoalIds: goal.originalGoals?.map(og => og.id) || []
      }));
      setBulkGoalsData(copiedData);
      
      // Apply to all employees
      setEmployeesData(prevData => {
        const newData = [...prevData];
        for (let i = 0; i < newData.length; i++) {
          if (!newData[i].isSubmitted) {
            newData[i].groupedGoals = copiedData.map((group, idx) => ({
              ...group,
              weightage: newData[i].groupedGoals[idx]?.weightage || group.weightage,
              originalGoals: newData[i].groupedGoals[idx]?.originalGoals || group.originalGoals || []
            }));
          }
        }
        return newData;
      });
      
      setPopupMessage("Copied goals from current employee to all employees!");
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const validateForm = (groupedGoals) => {
    if (!groupedGoals || groupedGoals.length === 0) return "No goals configured";
    
    const totalWeightage = groupedGoals.reduce((sum, goal) => sum + (goal.weightage || 0), 0);
    if (Math.abs(totalWeightage - 100) > 0.01) return `Total weightage must be 100%. Current: ${totalWeightage.toFixed(2)}%`;
    
    const hasZeroWeightage = groupedGoals.some((goal) => goal.weightage === 0);
    if (hasZeroWeightage) return "All goals must have weightage greater than 0";
    
    for (const goal of groupedGoals) {
      if (!goal.goalDescription?.trim()) return "Goal description is required for all categories";
      if (!goal.targetKPI?.trim()) return "Target/KPI is required for all categories";
      if (!goal.timeline || goal.timeline.length === 0) return "At least one timeline quarter must be selected for all categories";
    }
    
    return null;
  };

  const handleSubmit = async () => {
    const errors = [];
    for (const empData of employeesData) {
      if (!empData.isSubmitted) {
        const validationError = validateForm(empData.groupedGoals);
        if (validationError) {
          errors.push(`${empData.employee.firstName} ${empData.employee.lastName} (${empData.employee.empCode}): ${validationError}`);
        }
      }
    }
    
    if (errors.length > 0) {
      setErrorPopupMessage(errors.join("\n"));
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 5000);
      return;
    }
    
    setShowConfirmPopup(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmPopup(false);
    setSaving(true);
    
    const yearToUse = yearParam || activeCycle?.year || new Date().getFullYear().toString();
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    const managerId = localStorage.getItem("empId");

    for (const empData of employeesData) {
      if (empData.isSubmitted) continue;
      
      try {
        // Prepare goals for submission with redistributed weightages
        // This follows the same pattern as ManagerPredefinedGoals
        const allOriginalGoals = [];
        
        // Recalculate weightages for this employee based on their categories
        const selectedCategories = empData.groupedGoals.map(g => g.category);
        const redistributedWeights = calculateRedistributedWeightage(selectedCategories);
        
        empData.groupedGoals.forEach((group) => {
          if (group.originalGoals && group.originalGoals.length > 0) {
            const groupWeightage = redistributedWeights[group.category] || 0;
            
            // Distribute weightage among individual goals within the category
            const goalCount = group.originalGoals.length;
            let remainingWeightage = groupWeightage;
            
            group.originalGoals.forEach((og, idx) => {
              let individualWeightage;
              if (idx === goalCount - 1) {
                // Last goal gets the remaining weightage to ensure exact total
                individualWeightage = remainingWeightage;
              } else {
                // Distribute evenly for first n-1 goals
                individualWeightage = Math.floor(groupWeightage / goalCount);
                remainingWeightage -= individualWeightage;
              }
              
              allOriginalGoals.push({
                id: og.id,
                goalDescription: group.goalDescription,
                targetKPI: group.targetKPI,
                weightage: Number(individualWeightage.toFixed(2)),
                timeline: group.timeline,
              });
            });
          }
        });
        
        if (allOriginalGoals.length === 0) {
          errors.push(`${empData.employee.firstName} ${empData.employee.lastName} (${empData.employee.empCode}): No goals to submit`);
          errorCount++;
          continue;
        }
        
        // STEP 1: Update goals - Same payload as ManagerPredefinedGoals
        const payload = {
          employeeId: empData.employee.empCode || empData.employee.id,
          quarter: quarter,
          year: parseInt(yearToUse),
          goals: allOriginalGoals,
        };
        
        console.log(`Updating goals for employee ${empData.employee.empCode} with payload:`, payload);
        
        const response = await axios.put(
          `${BASE_URL_EPMS}/api/goals/update-predefined`,
          payload
        );
        
        console.log(`Update response for ${empData.employee.empCode}:`, response.data);
        
        if (response.data && response.data.success) {
          // STEP 2: Submit to employee - Same as ManagerPredefinedGoals
          console.log(`Submitting to employee: ${empData.employee.empCode}`);
          
          await axios.put(
            `${BASE_URL_EPMS}/api/goals/manager/submit-to-employee/${managerId}/${empData.employee.empCode}/${quarter}`
          );
          
          // STEP 3: Trigger Email to the Employee using DB Template - Same as ManagerPredefinedGoals
          if (empData.employee.emailId) {
            try {
              const emailPayload = {
                templateId: 2, // Matches the ID in the database
                to: empData.employee.emailId,
                variables: {
                  firstName: empData.employee.firstName || "Employee"
                }
              };
              await axios.post(`${BASE_URL_EPMS}/api/email/send`, emailPayload);
              console.log(`Email notification sent successfully to ${empData.employee.emailId}`);
            } catch (emailError) {
              console.error(`Email notification failed for ${empData.employee.emailId}:`, emailError);
              // Don't fail the whole submission if email fails
            }
          }
          
          successCount++;
        } else {
          errorCount++;
          errors.push(`${empData.employee.firstName} ${empData.employee.lastName} (${empData.employee.empCode}): ${response.data?.message || "Failed to update goals"}`);
        }
      } catch (err) {
        console.error(`Error processing employee ${empData.employee.empCode}:`, err);
        errorCount++;
        if (err.response) {
          errors.push(`${empData.employee.firstName} ${empData.employee.lastName} (${empData.employee.empCode}): ${err.response.data?.message || `Server error: ${err.response.status}`}`);
        } else if (err.request) {
          errors.push(`${empData.employee.firstName} ${empData.employee.lastName} (${empData.employee.empCode}): Network error - Please check if backend server is running on port 9010`);
        } else {
          errors.push(`${empData.employee.firstName} ${empData.employee.lastName} (${empData.employee.empCode}): ${err.message}`);
        }
      }
    }
    
    setSaving(false);
    
    if (successCount > 0) {
      setPopupMessage(`Successfully submitted goals for ${successCount} employee(s). ${errorCount > 0 ? `${errorCount} failed.` : ""}`);
      setShowSuccessPopup(true);
      
      setTimeout(() => {
        setShowSuccessPopup(false);
        // Navigate back to appraisal list
        navigate("/ManagerGoalConfigPerformance", {
          state: { 
            showSuccess: true, 
            message: `Successfully submitted goals for ${successCount} employee(s)`
          }
        });
      }, 3000);
    } else {
      setErrorPopupMessage(`Failed to submit goals. ${errors.join(", ")}`);
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 5000);
    }
  };

  const getTotalWeightage = (groupedGoals) => {
    if (!groupedGoals || groupedGoals.length === 0) return 0;
    return groupedGoals.reduce((sum, goal) => sum + (goal.weightage || 0), 0);
  };

  const getOriginalPredefinedWeightage = (category) => {
    const key = getWeightKey(category);
    return PREDEFINED_WEIGHTAGE[key] || 0;
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const displayYear = yearParam || activeCycle?.year || new Date().getFullYear().toString();
  const currentEmployee = employeesData[currentEmployeeIndex];
  const canSubmit = employeesData.some(emp => !emp.isSubmitted && emp.groupedGoals.length > 0);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-content bg-gray-50">
        <Header />
        <div className="mt-24">
          <LoadingAnimation message="Loading bulk predefined goals..." />
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
            </div>
            <button onClick={() => setShowSuccessPopup(false)} className="text-green-600 hover:text-green-800">
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed top-24 right-4 z-50 animate-slideIn">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[300px]">
            <FaTimes className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-medium whitespace-pre-wrap">{errorPopupMessage}</p>
            </div>
            <button onClick={() => setShowErrorPopup(false)} className="text-red-600 hover:text-red-800">
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 rounded-full p-2">
                  <FaInfoCircle className="text-red-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Submission</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Do you want to submit the predefined goals to all eligible employees?
                <br />
                <span className="text-sm text-gray-500 mt-2 block">
                  This will submit goals to {employeesData.filter(e => !e.isSubmitted).length} employee(s).
                </span>
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmPopup(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmedSubmit}
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
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
          <span className="font-semibold text-red-600">Bulk Predefined Goals</span>
        </nav>

        {/* URL Info Bar */}
        <div className="bg-gray-100 rounded-lg p-3 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaLink className="text-gray-400" />
            <span className="font-medium">Selected Employees (Employee Codes):</span>
            <span className="text-red-600 font-mono text-xs bg-white px-2 py-1 rounded">
              {selectedEmployees.map(e => e.empCode || e.id).join(', ')}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            <FaCalendar className="inline mr-1" />
            Quarter: {quarter} | Year: {displayYear}
          </div>
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
                Weightage is automatically calculated based on predefined values per category.
                {employeesData.length > 0 && employeesData[0]?.groupedGoals?.length > 0 &&
                  employeesData[0].groupedGoals.length < 5 &&
                  ` Since only ${employeesData[0].groupedGoals.length} categories are selected, weightages have been redistributed proportionally.`}
              </p>
              {employeesData.length > 0 && employeesData[0]?.groupedGoals?.length > 0 && (
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

        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaUsers className="text-white text-xl" />
                  <h1 className="text-2xl font-bold text-white">Bulk Predefined Goals</h1>
                </div>
                <p className="text-red-100">
                  Edit and submit goals for multiple employees at once
                </p>
                <p className="text-red-100 text-sm mt-1">
                  Quarter {quarter} - {displayYear}
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                  <p className="text-red-100 text-xs">Selected Employees</p>
                  <p className="text-white text-2xl font-bold">{selectedEmployees?.length || 0}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                  <p className="text-red-100 text-xs">Pending Submission</p>
                  <p className="text-white text-2xl font-bold">{employeesData.filter(e => !e.isSubmitted).length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setBulkMode(true)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  bulkMode ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaUsers />
                Bulk Edit Mode
              </button>
              <button
                onClick={() => setBulkMode(false)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  !bulkMode ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaUser />
                Individual Edit Mode
              </button>
            </div>
            
            {!bulkMode && employeesData.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentEmployeeIndex(Math.max(0, currentEmployeeIndex - 1))}
                  disabled={currentEmployeeIndex === 0}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <FaChevronLeft />
                </button>
                <span className="text-sm text-gray-600">
                  {currentEmployeeIndex + 1} of {employeesData.length}
                </span>
                <button
                  onClick={() => setCurrentEmployeeIndex(Math.min(employeesData.length - 1, currentEmployeeIndex + 1))}
                  disabled={currentEmployeeIndex === employeesData.length - 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <FaChevronRight />
                </button>
                <button
                  onClick={copyFromCurrent}
                  className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-100"
                >
                  <FaCopy />
                  Copy to All Employees
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Employee List Summary */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FaUsers className="text-red-500" />
            Employee Status Summary ({employeesData.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {employeesData.map((emp, idx) => {
              const isValid = !emp.isSubmitted && validateForm(emp.groupedGoals) === null;
              const totalWeight = !emp.isSubmitted ? getTotalWeightage(emp.groupedGoals) : 100;
              
              return (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      emp.isSubmitted ? "bg-green-500" : isValid ? "bg-yellow-500" : "bg-red-500"
                    }`} />
                    <span className="text-sm text-gray-700">
                      {emp.employee.firstName} {emp.employee.lastName}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      ({emp.employee.empCode})
                    </span>
                  </div>
                  {emp.isSubmitted ? (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <FaCheckCircle size={10} /> Submitted
                    </span>
                  ) : (
                    <span className={`text-xs ${Math.abs(totalWeight - 100) <= 0.01 ? "text-green-600" : "text-red-500"}`}>
                      {totalWeight.toFixed(2)}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Employee Info (Individual Mode) */}
        {!bulkMode && currentEmployee && (
          <div className="bg-white rounded-lg shadow-md mb-6 p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaUser className="text-red-500 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {currentEmployee.employee.firstName} {currentEmployee.employee.lastName}
                </h3>
                <p className="text-sm text-gray-500 font-mono">
                  Emp Code: {currentEmployee.employee.empCode || currentEmployee.employee.id}
                </p>
                {currentEmployee.employee.emailId && (
                  <p className="text-xs text-gray-500">{currentEmployee.employee.emailId}</p>
                )}
              </div>
              {currentEmployee.isSubmitted && (
                <div className="ml-auto flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                  <FaCheckCircle />
                  <span className="text-sm">Submitted on {formatDate(currentEmployee.submittedDate)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bulk Edit Section */}
        {bulkMode && bulkGoalsData && bulkGoalsData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <FaEdit className="text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Bulk Edit Template</h2>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Edit these goals once and they will be automatically applied to all eligible employees
              </p>
            </div>
            <GoalsTable
              groupedGoals={bulkGoalsData}
              onFieldChange={handleBulkFieldChange}
              onWeightageChange={handleBulkWeightageChange}
              onTimelineToggle={handleBulkTimelineToggle}
              isSubmitted={false}
              timelineOptions={timelineOptions}
              openDropdownIndices={openDropdownIndices}
              setOpenDropdownIndices={setOpenDropdownIndices}
              isWeightageAutoCalculated={true}
              getOriginalPredefinedWeightage={getOriginalPredefinedWeightage}
            />
          </div>
        )}

        {/* Individual Edit Section */}
        {!bulkMode && currentEmployee && !currentEmployee.isSubmitted && currentEmployee.groupedGoals.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-green-50 border-b border-green-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaEdit className="text-green-600" />
                Editing: {currentEmployee.employee.firstName} {currentEmployee.employee.lastName} ({currentEmployee.employee.empCode})
              </h2>
            </div>
            <GoalsTable
              groupedGoals={currentEmployee.groupedGoals}
              onFieldChange={(groupIndex, field, value) => handleIndividualFieldChange(currentEmployeeIndex, groupIndex, field, value)}
              onWeightageChange={(groupIndex, value) => handleIndividualWeightageChange(currentEmployeeIndex, groupIndex, value)}
              onTimelineToggle={(groupIndex, quarterValue) => handleIndividualTimelineToggle(currentEmployeeIndex, groupIndex, quarterValue)}
              isSubmitted={false}
              timelineOptions={timelineOptions}
              openDropdownIndices={openDropdownIndices}
              setOpenDropdownIndices={setOpenDropdownIndices}
              isWeightageAutoCalculated={true}
              getOriginalPredefinedWeightage={getOriginalPredefinedWeightage}
            />
          </div>
        )}

        {/* Read-Only View for Submitted Employees */}
        {!bulkMode && currentEmployee && currentEmployee.isSubmitted && currentEmployee.groupedGoals.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <FaEye className="text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-800">View Only - Already Submitted</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Submitted on {formatDate(currentEmployee.submittedDate)}
              </p>
            </div>
            <GoalsTable
              groupedGoals={currentEmployee.groupedGoals}
              onFieldChange={() => {}}
              onWeightageChange={() => {}}
              onTimelineToggle={() => {}}
              isSubmitted={true}
              timelineOptions={timelineOptions}
              openDropdownIndices={openDropdownIndices}
              setOpenDropdownIndices={setOpenDropdownIndices}
              isWeightageAutoCalculated={true}
              getOriginalPredefinedWeightage={getOriginalPredefinedWeightage}
            />
          </div>
        )}

        {/* No Goals Message */}
        {bulkMode && (!bulkGoalsData || bulkGoalsData.length === 0) && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No goals found</h3>
            <p className="text-gray-500">
              The selected employees don't have any goals configured.
              Please add goals first using the "Add Goals" option in the appraisal list.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {canSubmit && (
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => navigate("/AppraisalList")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <FaTimes className="inline mr-2" /> Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              Submit All
            </button>
          </div>
        )}
      </div>

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

// Goals Table Component
const GoalsTable = ({ groupedGoals, onFieldChange, onWeightageChange, onTimelineToggle, isSubmitted, timelineOptions, openDropdownIndices, setOpenDropdownIndices, isWeightageAutoCalculated, getOriginalPredefinedWeightage }) => {
  const totalWeightage = groupedGoals.reduce((sum, goal) => sum + (goal.weightage || 0), 0);
  const hasZeroWeightage = groupedGoals.some((goal) => goal.weightage === 0);
  const isWeightageValid = Math.abs(totalWeightage - 100) <= 0.01;

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

  const getOriginalWeight = (category) => {
    if (getOriginalPredefinedWeightage) {
      return getOriginalPredefinedWeightage(category);
    }
    return 0;
  };

  return (
    <>
      <div className="overflow-x-auto">
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
              const originalWeight = getOriginalWeight(group.category);
              const isRedistributed = isWeightageAutoCalculated && originalWeight !== group.weightage && groupedGoals.length !== 5;
              
              return (
                <tr key={group.category} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 align-top bg-gray-50/50 w-48">
                    <div>{group.category}</div>
                    {isRedistributed && !isSubmitted && (
                      <div className="mt-1 text-xs text-red-600">
                        <span className="italic">(Original: {originalWeight}%)</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 align-top w-80">
                    {group.combinedTitle}
                  </td>
                  <td className="px-6 py-4 w-80">
                    {isSubmitted ? (
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm min-h-[100px]">
                        {group.goalDescription || "No description provided"}
                      </div>
                    ) : (
                      <textarea
                        value={group.goalDescription || ""}
                        onChange={(e) => onFieldChange(groupIndex, 'goalDescription', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm min-h-[100px] resize-y focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter combined goal description"
                        rows={4}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 w-64">
                    {isSubmitted ? (
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm min-h-[80px]">
                        {group.targetKPI || "No target/KPI provided"}
                      </div>
                    ) : (
                      <textarea
                        value={group.targetKPI || ""}
                        onChange={(e) => onFieldChange(groupIndex, 'targetKPI', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm min-h-[80px] resize-y focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter combined target/KPI"
                        rows={3}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 w-32">
                    {isSubmitted ? (
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-center font-medium">
                        {group.weightage.toFixed(2)}%
                      </div>
                    ) : (
                      <div
                        className={`w-full px-4 py-3 border rounded-lg text-sm text-center font-medium ${
                          isRedistributed
                            ? "border-red-300 bg-red-50 text-red-700"
                            : isWeightageZero
                            ? "border-orange-300 bg-orange-50 text-orange-700"
                            : "border-gray-200 bg-gray-50 text-gray-900"
                        }`}
                      >
                        {group.weightage.toFixed(2)}%
                      </div>
                    )}
                    {isRedistributed && !isSubmitted && (
                      <div className="mt-1 text-xs text-red-600 text-center">
                        (Auto-calculated)
                      </div>
                    )}
                  </td>
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
                        >
                          <span className={`text-sm ${group.timeline?.length ? "text-gray-900" : "text-gray-400"}`}>
                            {getSelectedTimelineText(group.timeline)}
                          </span>
                          <FaChevronDown className={`text-gray-400 transition-transform ${openDropdownIndices[groupIndex] ? "rotate-180" : ""}`} />
                        </button>
                        {openDropdownIndices[groupIndex] && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => toggleDropdown(groupIndex)} />
                            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {timelineOptions.map((option) => (
                                <div
                                  key={option.value}
                                  onClick={() => onTimelineToggle(groupIndex, option.value)}
                                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={group.timeline?.includes(option.value)}
                                    onChange={() => {}}
                                    className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <span className={`text-sm ${group.timeline?.includes(option.value) ? "font-medium text-red-600" : "text-gray-600"}`}>
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
      </div>

      {/* Total Weightage Footer */}
      {!isSubmitted && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCalculator className="text-gray-400" />
              <span className="text-sm text-gray-600">
                Weightage is automatically allocated based on predefined values per category
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Total Weightage:</span>
              <span className={`text-lg font-bold ${isWeightageValid ? "text-red-600" : "text-red-500"}`}>
                {totalWeightage.toFixed(2)}%
              </span>
              {!isWeightageValid && (
                <span className="text-xs text-red-500">(Total should be 100%)</span>
              )}
              {hasZeroWeightage && (
                <span className="text-xs text-orange-500">(Zero weightage detected)</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManagerBulkPredefinedGoals;