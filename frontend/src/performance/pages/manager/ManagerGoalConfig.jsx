// pages/manager/ManagerGoalConfig.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiChevronDown, FiArrowLeft } from "react-icons/fi";
import Tab from "../../components/common/Tab";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
// import CreateGoalCycleModal from "./CreateGoalCycleModal";
import LaunchEmailModal from "../../components/hr/LaunchEmailModal";

import {
  createCycle,
  getCyclesByYear,
  publishCycle,
  closeCycle,
  getAllCycles, // Add this API function if available
} from "../../services/cycleService";

import {
  generateFinancialYears,
  getCurrentFinancialYear,
  getFinancialYearFromYear,
} from "../../utils/dateUtils";

const ManagerGoalConfig = () => {
  const [activeTab, setActiveTab] = useState("Quarterly Goal");
  const [cycleOptions, setCycleOptions] = useState([]);
  const [reviewCycle, setReviewCycle] = useState("");
  const [quarterCycles, setQuarterCycles] = useState([]);
  const [annualCycles, setAnnualCycles] = useState([]);
  const [allCycles, setAllCycles] = useState([]); // Store all cycles for active year detection
  const [isQuarterModalOpen, setIsQuarterModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const navigate = useNavigate();

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  // Extract starting year from FY string (e.g. 2025-2026 → 2025)
  const extractYear = (fy) => {
    if (!fy) return null;
    return Number(fy.split("-")[0]);
  };

  // Convert year to financial year string
  const getFinancialYearString = (year) => {
    if (!year) return null;
    return `${year}-${year + 1}`;
  };

  // Get the quarter order for comparison
  const getQuarterOrder = (quarter) => {
    const order = {
      Q1: 1,
      Q2: 2,
      Q3: 3,
      Q4: 4,
    };
    return order[quarter] || 0;
  };

  // Format quarter display as a clickable button
  const formatQuarterDisplay = (quarter, onClick) => {
    const quarterNames = {
      Q1: "Quarter 1",
      Q2: "Quarter 2",
      Q3: "Quarter 3",
      Q4: "Quarter 4",
    };

    return (
      <button
        onClick={onClick}
        className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none font-medium transition-colors duration-200"
      >
        {quarterNames[quarter] || quarter}
      </button>
    );
  };

  // Get quarter period
  const getQuarterPeriod = (quarter) => {
    const periods = {
      Q1: "01 Apr - 30 Jun",
      Q2: "01 Jul - 30 Sep",
      Q3: "01 Oct - 31 Dec",
      Q4: "01 Jan - 31 Mar",
    };
    return periods[quarter] || "";
  };

  // Check if previous quarter is closed
  const isPreviousQuarterClosed = (currentQuarter) => {
    if (!Array.isArray(quarterCycles) || quarterCycles.length === 0) {
      return true;
    }

    const currentOrder = getQuarterOrder(currentQuarter);
    if (currentOrder === 1) {
      return true;
    }

    const previousQuarter = `Q${currentOrder - 1}`;
    const previousCycle = quarterCycles.find(
      (c) => c.quarter === previousQuarter,
    );

    return previousCycle?.status === "CLOSED";
  };

  // Check if a specific quarter can be added
  const canAddQuarter = (quarter) => {
    const quarterExists = quarterCycles.some((c) => c.quarter === quarter);
    if (quarterExists) return false;
    return isPreviousQuarterClosed(quarter);
  };

  // Get available quarters to add
  const getAvailableQuartersToAdd = () => {
    const allQuarters = ["Q1", "Q2", "Q3", "Q4"];
    return allQuarters.filter((quarter) => canAddQuarter(quarter));
  };

  // Find financial year with active goals from all cycles
  const getActiveFinancialYearFromCycles = () => {
    // Check quarterly cycles for active status
    const activeQuarterCycle = quarterCycles.find(cycle => cycle.status === "ACTIVE");
    if (activeQuarterCycle) {
      // Use financial_year if available, otherwise construct from year
      if (activeQuarterCycle.financial_year) {
        return activeQuarterCycle.financial_year;
      } else if (activeQuarterCycle.year) {
        return getFinancialYearString(activeQuarterCycle.year);
      }
    }
    
    // Check annual cycles for active status
    const activeAnnualCycle = annualCycles.find(cycle => cycle.status === "ACTIVE");
    if (activeAnnualCycle) {
      if (activeAnnualCycle.financial_year) {
        return activeAnnualCycle.financial_year;
      } else if (activeAnnualCycle.year) {
        return getFinancialYearString(activeAnnualCycle.year);
      }
    }
    
    // If no active cycles, return current financial year
    return getCurrentFinancialYear();
  };

  // Fetch all cycles across all years to find active ones
  const fetchAllCycles = async () => {
    try {
      // If you have an API to get all cycles without year filter, use it
      // Otherwise, fetch for multiple years
      const years = [2024, 2025, 2026, 2027];
      const allCyclesData = [];
      
      for (const year of years) {
        try {
          const res = await getCyclesByYear(year);
          const cycles = Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.data?.data)
            ? res.data.data
            : [];
          allCyclesData.push(...cycles);
        } catch (err) {
          console.error(`Error fetching cycles for year ${year}`, err);
        }
      }
      
      setAllCycles(allCyclesData);
      return allCyclesData;
    } catch (err) {
      console.error("Error fetching all cycles", err);
      return [];
    }
  };

  // Handle tab change with auto financial year switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Find active cycle for the selected tab type
    let activeCycle = null;
    
    if (tab === "Quarterly Goal") {
      activeCycle = quarterCycles.find(cycle => cycle.status === "ACTIVE");
    } else if (tab === "Annual Performance Review") {
      activeCycle = annualCycles.find(cycle => cycle.status === "ACTIVE");
    }
    
    if (activeCycle) {
      // Use financial_year if available, otherwise construct from year
      let activeFinancialYear;
      if (activeCycle.financial_year) {
        activeFinancialYear = activeCycle.financial_year;
      } else if (activeCycle.year) {
        activeFinancialYear = getFinancialYearString(activeCycle.year);
      } else {
        activeFinancialYear = getCurrentFinancialYear();
      }
      
      setReviewCycle(activeFinancialYear);
      fetchCycles(activeFinancialYear);
    } else {
      // If no active cycle, fetch current year's data
      const currentYear = getCurrentFinancialYear();
      setReviewCycle(currentYear);
      fetchCycles(currentYear);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const options = generateFinancialYears(3);
    setCycleOptions(options);

    // Fetch all cycles to find active ones across years
    const initializeData = async () => {
      await fetchAllCycles();
      
      // Get active financial year from all cycles
      const activeFinancialYear = getActiveFinancialYearFromCycles();
      setReviewCycle(activeFinancialYear);
      fetchCycles(activeFinancialYear);
    };
    
    initializeData();
  }, []);

  // Update active financial year when cycles data changes
  useEffect(() => {
    if (quarterCycles.length > 0 || annualCycles.length > 0) {
      const activeYear = getActiveFinancialYearFromCycles();
      if (activeYear !== reviewCycle) {
        setReviewCycle(activeYear);
      }
    }
  }, [quarterCycles, annualCycles]);

  const fetchCycles = async (yearValue) => {
    try {
      const year = typeof yearValue === "string" ? extractYear(yearValue) : yearValue;
      
      if (!year) {
        console.error("Invalid year value:", yearValue);
        setQuarterCycles([]);
        setAnnualCycles([]);
        return;
      }
      
      const res = await getCyclesByYear(year);
      const cycles = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];
      
      // Process cycles to ensure financial_year is set
      const processedCycles = cycles.map(cycle => ({
        ...cycle,
        financial_year: cycle.financial_year || getFinancialYearString(cycle.year),
        displayFinancialYear: cycle.financial_year || getFinancialYearString(cycle.year)
      }));
      
      const quarterly = processedCycles.filter((c) => c.cycleType === "QUARTERLY");
      const annual = processedCycles.filter((c) => c.cycleType === "ANNUAL");
      
      setQuarterCycles(quarterly);
      setAnnualCycles(annual);
    } catch (err) {
      console.error("Error fetching cycles", err);
      setQuarterCycles([]);
      setAnnualCycles([]);
      showNotification("error", "Failed to fetch cycles");
    }
  };

  const handleCycleChange = (val) => {
    setReviewCycle(val);
    fetchCycles(val);
  };

  const handleQuarterSave = async (data) => {
    try {
      const payload = {
        cycleType: "QUARTERLY",
        year: extractYear(reviewCycle),
        financial_year: reviewCycle, // Add financial_year field
        quarter: data.quarter,
        reminderDays: data.reminderDays,
        startDate: new Date().toISOString().split("T")[0],
        endDate: data.expiryDate,
        status: data.status,
      };

      await createCycle(payload);
      await fetchCycles(reviewCycle);
      await fetchAllCycles(); // Refresh all cycles data
      showNotification("success", "Goal cycle created successfully");
      setIsQuarterModalOpen(false);
    } catch (err) {
      console.error("Error creating cycle", err?.response?.data || err);
      showNotification("error", "Failed to create cycle");
    }
  };

  const handlePublishClick = (cycle) => {
    setSelectedCycle(cycle);
    setIsEmailModalOpen(true);
  };

  const handleEmailLaunch = async (emailData) => {
    try {
      setLoadingId(selectedCycle.id);

      // Publish the cycle after email is sent
      await publishCycle(selectedCycle.id);

      // Close modal and refresh
      setIsEmailModalOpen(false);
      await fetchCycles(reviewCycle);
      await fetchAllCycles(); // Refresh all cycles data

      // Show success message
      showNotification(
        "success",
        `Goal cycle ${selectedCycle.quarter} launched successfully`,
      );

      // Reset states
      setSelectedCycle(null);
    } catch (err) {
      console.error("Error launching cycle with email", err);
      showNotification("error", "Failed to launch cycle");
    } finally {
      setLoadingId(null);
    }
  };

  const handleClose = async (id) => {
    try {
      await closeCycle(id);
      await fetchCycles(reviewCycle);
      await fetchAllCycles(); // Refresh all cycles data
      showNotification("success", "Cycle closed successfully");
    } catch (err) {
      console.error("Error closing cycle", err);
      showNotification("error", "Failed to close cycle");
    }
  };

  // Handle quarter click - Navigate to AppraisalList
  const handleQuarterClick = (cycle) => {
    // Prepare quarter data to pass to AppraisalList
    const quarterData = {
      quarter: cycle.quarter,
      year: reviewCycle,
      period: getQuarterPeriod(cycle.quarter),
      cycleId: cycle.id,
      status: cycle.status,
    };

    // Navigate to AppraisalList with quarter data
    navigate("/AppraisalList", {
      state: { quarterData },
    });
  };

  const handleAnnualClick = (cycle) => {
    const annualData = {
      year: cycle.year,
      cycleId: cycle.id,
      status: cycle.status,
      type: "ANNUAL",
    };

    navigate("/AppraisalList", {
      state: { annualData },
    });
  };

  const isQ4Closed =
    Array.isArray(quarterCycles) &&
    quarterCycles.some((c) => c.quarter === "Q4" && c.status === "CLOSED");

  const availableQuartersToAdd = getAvailableQuartersToAdd();
  const canAddAnyQuarter = availableQuartersToAdd.length > 0;

  // Dynamic header title based on active tab
  const getHeaderTitle = () => {
    return activeTab === "Quarterly Goal" ? "Quarterly Goals" : "Annual Performance Review";
  };

  // Dynamic breadcrumb based on active tab
  const getBreadcrumbText = () => {
    return activeTab === "Quarterly Goal" ? "Quarterly Goals" : "Annual Performance Review";
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-6 py-6">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          } border`}
        >
          <p
            className={`text-sm ${
              notification.type === "success"
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {notification.message}
          </p>
        </div>
      )}

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
        <span className="font-semibold text-red-600">{getBreadcrumbText()}</span>
      </nav>

      {/* Header - Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">{getHeaderTitle()}</h1>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Financial Year Selector */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Financial Year
            </span>
            <div className="relative w-48">
              <select
                value={reviewCycle}
                onChange={(e) => handleCycleChange(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {cycleOptions.map((cycle) => (
                  <option key={cycle} value={cycle}>
                    {cycle}
                  </option>
                ))}
              </select>
              <FiChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-gray-200">
          <Tab
            tabs={["Quarterly Goal", "Annual Performance Review"]}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            variant="underline"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "Quarterly Goal" && (
            <>
              {quarterCycles.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Quarterly Goal not started yet
                  </h2>
                </div>
              ) : (
                <>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-50 text-gray-600 text-xs font-medium uppercase tracking-wider">
                          <th className="px-6 py-3 text-left">
                            Appraisal Cycle
                          </th>
                          <th className="px-6 py-3 text-left">Created On</th>
                          <th className="px-6 py-3 text-left">Expiry Date</th>
                          <th className="px-6 py-3 text-left">Status</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200">
                        {quarterCycles
                          .sort(
                            (a, b) =>
                              getQuarterOrder(a.quarter) -
                              getQuarterOrder(b.quarter),
                          )
                          .map((cycle) => (
                            <tr
                              key={cycle.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              {/* Appraisal Cycle */}
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">
                                  {formatQuarterDisplay(cycle.quarter, () =>
                                    handleQuarterClick(cycle),
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {getQuarterPeriod(cycle.quarter)}
                                </div>
                              </td>

                              {/* Created On */}
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {cycle.createdAt
                                  ? new Date(cycle.createdAt)
                                      .toLocaleDateString("en-GB")
                                      .replace(/\//g, "-")
                                  : "-"}
                              </td>

                              {/* Expiry Date */}
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {cycle.endDate
                                  ? new Date(cycle.endDate)
                                      .toLocaleDateString("en-GB")
                                      .replace(/\//g, "-")
                                  : "-"}
                              </td>

                              {/* Status */}
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                    cycle.status === "ACTIVE"
                                      ? "bg-green-100 text-green-700"
                                      : cycle.status === "CLOSED"
                                      ? "bg-gray-200 text-gray-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {cycle.status === "ACTIVE"
                                    ? "Active"
                                    : cycle.status === "CLOSED"
                                    ? "Closed"
                                    : "Not Started"}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Warning Message */}
                  {quarterCycles.length < 4 && !canAddAnyQuarter && (
                    <div className="mt-4 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                      <p className="flex items-center">
                        <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                        Next quarter can only be added after the current quarter
                        is closed.
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === "Annual Performance Review" && (
            <>
              {annualCycles.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Annual Performance Review has not started yet for the selected financial year. Please select an active financial year.
                  </h2>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-xs font-medium uppercase">
                        <th className="px-6 py-3 text-left">Cycle</th>
                        <th className="px-6 py-3 text-left">Created On</th>
                        <th className="px-6 py-3 text-left">Expiry Date</th>
                        <th className="px-6 py-3 text-left">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {annualCycles.map((cycle) => (
                        <tr key={cycle.id}>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleAnnualClick(cycle)}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200"
                            >
                              Annual Cycle
                            </button>
                          </td>

                          <td className="px-6 py-4 text-sm">
                            {cycle.createdAt
                              ? new Date(cycle.createdAt).toLocaleDateString(
                                  "en-GB",
                                )
                              : "-"}
                          </td>

                          <td className="px-6 py-4 text-sm">
                            {cycle.endDate
                              ? new Date(cycle.endDate).toLocaleDateString(
                                  "en-GB",
                                )
                              : "-"}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                cycle.status === "ACTIVE"
                                  ? "bg-green-100 text-green-700"
                                  : cycle.status === "CLOSED"
                                  ? "bg-gray-200 text-gray-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {cycle.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {/* <CreateGoalCycleModal
        isOpen={isQuarterModalOpen}
        onClose={() => setIsQuarterModalOpen(false)}
        onSaveQuarter={handleQuarterSave}
        availableQuarters={availableQuartersToAdd}
      /> */}

      <LaunchEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setSelectedCycle(null);
        }}
        onLaunch={handleEmailLaunch}
        cycleQuarter={selectedCycle?.quarter}
        cycleType="GOAL"
        templateType="LAUNCH"
        cycleId={selectedCycle?.id}
      />
    </div>
  );
};

export default ManagerGoalConfig;