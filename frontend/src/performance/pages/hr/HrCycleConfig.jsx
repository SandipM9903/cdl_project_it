import React, { useEffect, useState, useRef } from "react";
import Tab from "../../components/common/Tab";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import Select from "../../components/common/Select";
import CreateQuarterlyCycleModal from "./CreateQuarterlyCycleModal";
import CreateAnnualCycleModal from "./CreateAnnualCycleModal";
import LaunchEmailModal from "../../components/hr/LaunchEmailModal";
import ExtendExpiryModal from "./ExtendExpiryModal";
import {
  FiAlertCircle,
  FiClock,
  FiRefreshCw,
  FiLock,
  FiCalendar,
  FiBell,
  FiMail,
  FiCheckCircle,
  FiXCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { MdOutlineCancel, MdOutlineUpdate } from "react-icons/md";
import axios from "axios";
import { BASE_URL_EPMS, BASE_URL_EPMS_EMP } from "../../services/api";
import {
  createCycle,
  createAnnualCycle,
  getCyclesByYear,
  publishCycle,
  closeCycle,
  extendExpiryDate,
  reopenQuarter,
  sendReminder,
  sendUnifiedEmails,
  resetEmployeeData,
  getResetLogs,
} from "../../services/cycleService";

import {
  generateFinancialYears,
  getCurrentFinancialYear,
  getPreviousFinancialYear,
} from "../../utils/dateUtils";

const HrCycleConfig = () => {
  const [activeTab, setActiveTab] = useState("Quarterly Review");
  const [cycleOptions, setCycleOptions] = useState([]);
  const [reviewCycle, setReviewCycle] = useState("");
  const [quarterCycles, setQuarterCycles] = useState([]);
  const [annualCycle, setAnnualCycle] = useState(null);
  const [isQuarterModalOpen, setIsQuarterModalOpen] = useState(false);
  const [isAnnualModalOpen, setIsAnnualModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [reminderLoadingId, setReminderLoadingId] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  
  // Email modal action type
  const [emailModalAction, setEmailModalAction] = useState("LAUNCH");
  const [emailModalExpiryDate, setEmailModalExpiryDate] = useState(null);
  
  // Store cycle temporarily for reopen/extend operations
  const [tempCycle, setTempCycle] = useState(null);

  // Reset Employee Data states
  const [resetScope, setResetScope] = useState("ALL");
  const [resetQuarter, setResetQuarter] = useState("Q1");
  const [resetEmpId, setResetEmpId] = useState("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetLogs, setResetLogs] = useState([]);
  const [loadingResetLogs, setLoadingResetLogs] = useState(false);

  const navigate = useNavigate();
  const emailBatchRef = useRef(null);
  const [isLaunching, setIsLaunching] = useState(false);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const extractYear = (fy) => {
    if (!fy) return null;
    return Number(fy.split("-")[0]);
  };

  const getQuarterOrder = (quarter) => {
    const order = {
      Q1: 1,
      Q2: 2,
      Q3: 3,
      Q4: 4,
    };
    return order[quarter] || 0;
  };

  const getClosedQuarters = () => {
    if (!Array.isArray(quarterCycles)) return [];
    return quarterCycles
      .filter((cycle) => cycle.status === "CLOSED")
      .sort((a, b) => getQuarterOrder(a.quarter) - getQuarterOrder(b.quarter))
      .map((cycle) => cycle.quarter);
  };

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

  const canAddQuarter = (quarter) => {
    const quarterExists = quarterCycles.some((c) => c.quarter === quarter);
    if (quarterExists) return false;
    return isPreviousQuarterClosed(quarter);
  };

  const getAvailableQuartersToAdd = () => {
    const allQuarters = ["Q1", "Q2", "Q3", "Q4"];
    const closedQuarters = getClosedQuarters();

    if (closedQuarters.length === 0) {
      return ["Q1"];
    }

    const lastClosed = closedQuarters[closedQuarters.length - 1];
    const lastIndex = allQuarters.indexOf(lastClosed);

    if (lastIndex === -1 || lastIndex === 3) {
      return [];
    }

    const nextQuarter = allQuarters[lastIndex + 1];
    const quarterExists = quarterCycles.some((c) => c.quarter === nextQuarter);

    return quarterExists ? [] : [nextQuarter];
  };

  const getClosedQuartersList = () => {
    if (!Array.isArray(quarterCycles)) return [];
    return quarterCycles
      .filter((cycle) => cycle.status === "CLOSED")
      .sort((a, b) => getQuarterOrder(a.quarter) - getQuarterOrder(b.quarter))
      .map((cycle) => cycle.quarter);
  };

  const canReopenQuarter = (cycle) => {
    if (cycle.status !== "CLOSED") return false;

    const currentOrder = getQuarterOrder(cycle.quarter);

    const laterQuarters = quarterCycles.filter(
      (c) => getQuarterOrder(c.quarter) > currentOrder,
    );

    if (laterQuarters.length > 0) return false;

    return true;
  };

  const canAddAnyQuarter = () => {
    return quarterCycles.length < 4;
  };

  const isAnyCycleActive =
    (Array.isArray(quarterCycles) &&
      quarterCycles.some((c) => c.status === "ACTIVE")) ||
    annualCycle?.status === "ACTIVE";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const options = generateFinancialYears(3);
    setCycleOptions(options);

    const currentYear = getCurrentFinancialYear();
    setReviewCycle(currentYear);
    fetchCycles(currentYear);
  }, []);

  useEffect(() => {
    if (activeTab === "Quarterly Review") {
      const currentFinancialYear = getCurrentFinancialYear();
      if (reviewCycle !== currentFinancialYear) {
        setReviewCycle(currentFinancialYear);
        fetchCycles(currentFinancialYear);
      }
    } else if (activeTab === "Annual Review") {
      const currentFinancialYear = getCurrentFinancialYear();
      const previousFinancialYear = getPreviousFinancialYear(currentFinancialYear);
      if (reviewCycle !== previousFinancialYear) {
        setReviewCycle(previousFinancialYear);
        fetchCycles(previousFinancialYear);
      }
    } else if (activeTab === "Reset Employee Data") {
      fetchResetLogs(reviewCycle);
    }
  }, [activeTab, reviewCycle]);

  const fetchResetLogs = async (fy) => {
    setLoadingResetLogs(true);
    try {
      const res = await getResetLogs(fy);
      const logs = res?.data?.data || res?.data || [];
      setResetLogs(Array.isArray(logs) ? logs : []);
    } catch (err) {
      console.error("Failed to fetch reset logs:", err);
    } finally {
      setLoadingResetLogs(false);
    }
  };

  const fetchCycles = async (yearValue) => {
    try {
      const financialYear =
        typeof yearValue === "string"
          ? yearValue
          : `${yearValue}-${yearValue + 1}`;
      const res = await getCyclesByYear(financialYear);
      const cycles = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];

      const quarterly = cycles.filter(
        (cycle) => cycle.cycleType === "QUARTERLY",
      );
      const annual = cycles.find((cycle) => cycle.cycleType === "ANNUAL");

      setQuarterCycles(quarterly);
      setAnnualCycle(annual || null);
    } catch (err) {
      console.error("Error fetching cycles", err);
      setQuarterCycles([]);
      setAnnualCycle(null);
      showNotification("error", "Failed to fetch cycles");
    }
  };

  const handleCycleChange = (val) => {
    setReviewCycle(val);
    fetchCycles(val);
  };

  const handleQuarterSave = async (data) => {
    try {
      const financialYear = reviewCycle;
      const startYear = extractYear(financialYear);

      const payload = {
        cycleType: "QUARTERLY",
        financialYear: financialYear,
        year: startYear,
        quarter: data.quarter,
        reminderDays: data.reminderDays ? parseInt(data.reminderDays) : null,
        startDate: new Date().toISOString().split("T")[0],
        endDate: data.expiryDate,
        status: data.status,
      };

      await createCycle(payload);
      await fetchCycles(reviewCycle);
      showNotification("success", "Quarterly cycle created successfully");
    } catch (err) {
      console.error("Error creating cycle", err?.response?.data || err);
      showNotification(
        "error",
        err?.response?.data?.message || "Failed to create cycle",
      );
    }
  };

  const handleAnnualSave = async (data) => {
    try {
      const selectedFinancialYear = reviewCycle;
      const startYear = extractYear(selectedFinancialYear);

      const payload = {
        financialYear: selectedFinancialYear,
        year: startYear,
        reminderDays: null,
        startDate: `${startYear}-04-01`,
        endDate: data.expiryDate,
      };

      const response = await createAnnualCycle(payload);

      showNotification(
        "success",
        `Annual cycle created successfully for financial year ${selectedFinancialYear}`,
      );

      await fetchCycles(reviewCycle);
    } catch (err) {
      console.error("Error creating annual cycle:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create annual cycle";
      showNotification("error", errorMessage);
    }
  };

  // Handle Publish/Launch
  const handlePublishClick = (cycle) => {
    if (cycle.status === "ACTIVE") {
      showNotification("error", "This cycle is already active");
      return;
    }

    setSelectedCycle(cycle);
    setEmailModalAction("LAUNCH");
    setEmailModalExpiryDate(null);
    setIsEmailModalOpen(true);
  };

  // Handle Close
  const handleClose = (cycle) => {
    setSelectedCycle(cycle);
    setEmailModalAction("CLOSE");
    setEmailModalExpiryDate(null);
    setIsEmailModalOpen(true);
  };

  // Handle Extend - Store cycle in temp before opening modal
  const handleExtendExpiry = (cycle) => {
    setTempCycle(cycle);
    setSelectedCycle(cycle);
    setEmailModalAction("EXTEND");
    setIsExtendModalOpen(true);
  };

  const handleExtendSubmit = async (newExpiryDate) => {
    // Use tempCycle if selectedCycle is null
    const cycleToUse = selectedCycle || tempCycle;
    setSelectedCycle(cycleToUse);
    setEmailModalExpiryDate(newExpiryDate);
    setEmailModalAction("EXTEND");
    setIsExtendModalOpen(false);
    setIsEmailModalOpen(true);
  };

  // Handle Reopen - Store cycle in temp before opening modal
  const handleReopenQuarter = (cycle) => {
    setTempCycle(cycle);
    setSelectedCycle(cycle);
    setEmailModalAction("REOPEN");
    setIsExtendModalOpen(true);
  };

  const handleReopenSubmit = async (newExpiryDate) => {
    // Use tempCycle if selectedCycle is null
    const cycleToUse = selectedCycle || tempCycle;
    setSelectedCycle(cycleToUse);
    setEmailModalExpiryDate(newExpiryDate);
    setEmailModalAction("REOPEN");
    setIsExtendModalOpen(false);
    setIsEmailModalOpen(true);
  };

  // Handle Reminder
  const sendReminderNotification = (cycle) => {
    setSelectedCycle(cycle);
    setEmailModalAction("REMINDER");
    setEmailModalExpiryDate(null);
    setIsEmailModalOpen(true);
  };

 // Unified handler for all email actions
const handleUnifiedEmailLaunch = async (emailData) => {
  if (isLaunching) {
    console.log("Already processing, skipping duplicate call");
    return;
  }

  // Get the cycle to use (from selectedCycle or tempCycle)
  const cycleToUse = selectedCycle || tempCycle;
  
  if (!cycleToUse || !cycleToUse.id) {
    console.error("No cycle selected for action:", emailModalAction);
    showNotification("error", "No cycle selected. Please try again.");
    setIsLaunching(false);
    return;
  }

  setIsLaunching(true);

  try {
    setLoadingId(cycleToUse.id);
    setIsEmailModalOpen(false);
    showNotification("info", `Processing ${emailModalAction} action...`);

    let response;
    const payload = {
      subject: emailData.subject,
      body: emailData.body,
    };

    switch (emailModalAction) {
      case "LAUNCH":
        response = await publishCycle(cycleToUse.id, payload);
        break;
      case "CLOSE":
        await closeCycle(cycleToUse.id);
        await sendUnifiedEmails("CLOSE", cycleToUse.id, payload, {});
        response = { status: 200 };
        break;
      case "EXTEND":
        await extendExpiryDate(cycleToUse.id, emailModalExpiryDate);
        await sendUnifiedEmails("EXTEND", cycleToUse.id, payload, { newExpiryDate: emailModalExpiryDate });
        response = { status: 200 };
        break;
      case "REMINDER":
        // ✅ FIX: Use sendUnifiedEmails to send custom email content
        await sendUnifiedEmails("REMINDER", cycleToUse.id, payload, {});
        response = { status: 200 };
        break;
      case "REOPEN":
        await reopenQuarter(cycleToUse.id, emailModalExpiryDate);
        await sendUnifiedEmails("REOPEN", cycleToUse.id, payload, { newExpiryDate: emailModalExpiryDate });
        response = { status: 200 };
        break;
      default:
        throw new Error("Unknown action type");
    }

    if (response && (response.status === 200 || response.status === 201)) {
      showNotification("success", `${emailModalAction} completed successfully.`);
      await fetchCycles(reviewCycle);
    } else {
      throw new Error("Unexpected response from server");
    }
  } catch (err) {
    console.error(`Error in ${emailModalAction}:`, err);
    const errorMessage = err.response?.data?.message || err.message || `Failed to ${emailModalAction}`;
    showNotification("error", errorMessage);
    await fetchCycles(reviewCycle);
  } finally {
    setIsLaunching(false);
    setLoadingId(null);
    setSelectedCycle(null);
    setTempCycle(null);
    setEmailModalAction("LAUNCH");
    setEmailModalExpiryDate(null);
  }
};

  const handleConfirmResetEmployeeData = async () => {
    setIsResetting(true);
    try {
      const currentEmpId = localStorage.getItem("empId") || localStorage.getItem("user") || "HR_ADMIN";
      const payload = {
        financialYear: reviewCycle,
        scope: resetScope,
        quarter: resetScope === "QUARTER" ? resetQuarter : null,
        employeeId: resetEmpId ? resetEmpId.trim() : null,
        resetBy: currentEmpId,
      };
      await resetEmployeeData(payload);
      showNotification(
        "success",
        `Employee data reset successfully for financial year ${reviewCycle}`,
      );
      setIsResetModalOpen(false);
      fetchResetLogs(reviewCycle);
    } catch (err) {
      console.error("Error resetting employee data:", err);
      showNotification(
        "error",
        err?.response?.data?.message || err?.message || "Failed to reset employee data",
      );
    } finally {
      setIsResetting(false);
    }
  };

  const closedQuartersList = getClosedQuartersList();
  const isAnnualCycleCreated = annualCycle !== null;

  const getAnnualReviewDisplayYear = () => {
    return reviewCycle;
  };

  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-3 w-3 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      ACTIVE: {
        bg: "bg-red-50",
        text: "text-red-600",
        icon: FiCheckCircle,
        label: "ACTIVE",
      },
      CLOSED: {
        bg: "bg-gray-100",
        text: "text-gray-600",
        icon: FiXCircle,
        label: "CLOSED",
      },
      NOT_STARTED: {
        bg: "bg-yellow-50",
        text: "text-yellow-600",
        icon: FiClock,
        label: "NOT STARTED",
      },
    };

    const config = statusConfig[status] || statusConfig.NOT_STARTED;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="text-xs" />
        {config.label}
      </span>
    );
  };

  const TableHeader = () => (
    <thead>
      <tr className="bg-red-50 border-b-2 border-red-200">
        <th className="px-4 py-3 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">
          Quarter / Type
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">
          Financial Year
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">
          Created On
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">
          Expiry Date
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-red-600 uppercase tracking-wider">
          Last Reminder
        </th>
        <th className="px-4 py-3 text-center text-xs font-semibold text-red-600 uppercase tracking-wider">
          Status
        </th>
        <th className="px-4 py-3 text-center text-xs font-semibold text-red-600 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 px-6 py-6">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-50 border-l-4 border-green-500"
              : notification.type === "error"
              ? "bg-red-50 border-l-4 border-red-500"
              : "bg-blue-50 border-l-4 border-blue-500"
          } border`}
        >
          <p
            className={`text-sm ${
              notification.type === "success"
                ? "text-green-700"
                : notification.type === "error"
                ? "text-red-700"
                : "text-blue-700"
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
        <span className="font-semibold text-red-600">Performance Cycle Window</span>
      </nav>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Configure & Launch the Performance Cycle
        </h1>

        <div className="mt-6">
          <Select
            label="Financial Year"
            inlineLabel
            value={reviewCycle}
            onChange={handleCycleChange}
            options={cycleOptions.map((cycle) => ({
              label: cycle,
              value: cycle,
            }))}
          />
        </div>

        <div className="mt-6">
          <Tab
            tabs={["Quarterly Review", "Annual Review", "Reset Employee Data"]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeTab === "Quarterly Review" && (
          <>
            {quarterCycles.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <FiClock className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Quarterly Financial Year not started yet
                </h2>
                <p className="mt-2 text-sm text-gray-500 max-w-lg">
                  To start the quarterly review cycle for financial year{" "}
                  {reviewCycle}, click below.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setIsQuarterModalOpen(true)}>
                    Add Quarterly Financial Year
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-600">
                    Showing quarters for financial year:{" "}
                    <span className="font-semibold text-red-600">
                      {reviewCycle}
                    </span>
                  </div>
                  {quarterCycles.length < 4 && (
                    <Button
                      onClick={() => setIsQuarterModalOpen(true)}
                      disabled={!canAddAnyQuarter()}
                    >
                      + Add Quarter
                    </Button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <TableHeader />
                    <tbody className="divide-y divide-gray-100">
                      {quarterCycles
                        .sort(
                          (a, b) =>
                            getQuarterOrder(a.quarter) -
                            getQuarterOrder(b.quarter),
                        )
                        .map((cycle) => (
                          <tr
                            key={cycle.id}
                            className="hover:bg-red-50/30 transition-colors duration-150"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                  <FiCalendar className="text-red-500 text-sm" />
                                </div>
                                <span className="font-semibold text-gray-800">
                                  {cycle.quarter}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm font-mono text-gray-700">
                                {cycle.financialYear || reviewCycle}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                              {cycle.createdAt
                                ? new Date(cycle.createdAt)
                                    .toLocaleDateString("en-GB")
                                    .replace(/\//g, "-")
                                : "-"}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1">
                                <FiClock className="text-gray-400 text-xs" />
                                <span className="text-sm text-gray-600">
                                  {cycle.endDate
                                    ? new Date(cycle.endDate)
                                        .toLocaleDateString("en-GB")
                                        .replace(/\//g, "-")
                                    : "-"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {cycle.lastReminderDate
                                ? new Date(cycle.lastReminderDate)
                                    .toLocaleDateString("en-GB")
                                    .replace(/\//g, "-")
                                : "-"}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <StatusBadge status={cycle.status} />
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-2 justify-center">
                                {cycle.status === "NOT_STARTED" && (
                                  <button
                                    onClick={() => handlePublishClick(cycle)}
                                    disabled={
                                      loadingId === cycle.id || isLaunching
                                    }
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                      loadingId === cycle.id
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                                    }`}
                                  >
                                    {loadingId === cycle.id ? (
                                      <LoadingSpinner />
                                    ) : (
                                      <FiMail className="text-xs" />
                                    )}
                                    <span>LAUNCH</span>
                                  </button>
                                )}

                                {cycle.status === "ACTIVE" && (
                                  <>
                                    <button
                                      onClick={() => handleClose(cycle)}
                                      disabled={loadingId === cycle.id}
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                        loadingId === cycle.id
                                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                          : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                                      }`}
                                    >
                                      {loadingId === cycle.id ? (
                                        <LoadingSpinner />
                                      ) : (
                                        <MdOutlineCancel className="text-sm" />
                                      )}
                                      <span>CLOSE</span>
                                    </button>
                                    <button
                                      onClick={() => handleExtendExpiry(cycle)}
                                      disabled={loadingId === cycle.id}
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                        loadingId === cycle.id
                                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                          : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                                      }`}
                                    >
                                      {loadingId === cycle.id ? (
                                        <LoadingSpinner />
                                      ) : (
                                        <FiCalendar className="text-xs" />
                                      )}
                                      <span>EXTEND</span>
                                    </button>
                                    <button
                                      onClick={() =>
                                        sendReminderNotification(cycle)
                                      }
                                      disabled={reminderLoadingId === cycle.id}
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                        reminderLoadingId === cycle.id
                                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                          : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                                      }`}
                                    >
                                      {reminderLoadingId === cycle.id ? (
                                        <LoadingSpinner />
                                      ) : (
                                        <FiBell className="text-xs" />
                                      )}
                                      <span>REMINDER</span>
                                    </button>
                                  </>
                                )}

                                {cycle.status === "CLOSED" &&
                                  canReopenQuarter(cycle) && (
                                    <button
                                      onClick={() => handleReopenQuarter(cycle)}
                                      disabled={loadingId === cycle.id}
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                        loadingId === cycle.id
                                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                          : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                                      }`}
                                    >
                                      {loadingId === cycle.id ? (
                                        <LoadingSpinner />
                                      ) : (
                                        <FiRefreshCw className="text-xs" />
                                      )}
                                      <span>RE-OPEN</span>
                                    </button>
                                  )}

                                {cycle.status === "CLOSED" &&
                                  !canReopenQuarter(cycle) && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
                                      <FiLock className="text-xs" />
                                      <span>LOCKED</span>
                                    </div>
                                  )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {quarterCycles.length < 4 && !canAddAnyQuarter() && (
                  <div className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                    <p className="flex items-center">
                      <FiAlertCircle className="h-5 w-5 mr-2" />
                      Latest quarter must be closed before adding next quarter.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === "Annual Review" && (
          <>
            {!isAnnualCycleCreated ? (
              <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <FiCalendar className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Annual Review Cycle not started yet
                </h2>
                <p className="mt-2 text-sm text-gray-500 max-w-lg">
                  Create annual review cycle for financial year ({getAnnualReviewDisplayYear()}).
                </p>
                <div className="mt-6">
                  <Button onClick={() => setIsAnnualModalOpen(true)}>
                    Create Annual Review Cycle
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <TableHeader />
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-red-50/30 transition-colors duration-150">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <FiCalendar className="text-red-500 text-sm" />
                          </div>
                          <span className="font-semibold text-gray-800">
                            Annual Review
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-mono text-gray-700">
                          {annualCycle?.financialYear || reviewCycle}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {annualCycle?.createdAt
                          ? new Date(annualCycle.createdAt)
                              .toLocaleDateString("en-GB")
                              .replace(/\//g, "-")
                          : "-"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <FiClock className="text-gray-400 text-xs" />
                          <span className="text-sm text-gray-600">
                            {annualCycle?.endDate
                              ? new Date(annualCycle.endDate)
                                  .toLocaleDateString("en-GB")
                                  .replace(/\//g, "-")
                              : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {annualCycle?.lastReminderDate
                          ? new Date(annualCycle.lastReminderDate)
                              .toLocaleDateString("en-GB")
                              .replace(/\//g, "-")
                          : "-"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <StatusBadge status={annualCycle?.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-center">
                          {annualCycle?.status === "NOT_STARTED" && (
                            <button
                              onClick={() => handlePublishClick(annualCycle)}
                              disabled={
                                loadingId === annualCycle?.id || isLaunching
                              }
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                loadingId === annualCycle?.id
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                              }`}
                            >
                              {loadingId === annualCycle?.id ? (
                                <LoadingSpinner />
                              ) : (
                                <FiMail className="text-xs" />
                              )}
                              <span>LAUNCH</span>
                            </button>
                          )}

                          {annualCycle?.status === "ACTIVE" && (
                            <>
                              <button
                                onClick={() => handleClose(annualCycle)}
                                disabled={loadingId === annualCycle.id}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                  loadingId === annualCycle.id
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                                }`}
                              >
                                {loadingId === annualCycle.id ? (
                                  <LoadingSpinner />
                                ) : (
                                  <MdOutlineCancel className="text-sm" />
                                )}
                                <span>CLOSE</span>
                              </button>
                              <button
                                onClick={() => handleExtendExpiry(annualCycle)}
                                disabled={loadingId === annualCycle.id}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                  loadingId === annualCycle.id
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                                }`}
                              >
                                {loadingId === annualCycle.id ? (
                                  <LoadingSpinner />
                                ) : (
                                  <FiCalendar className="text-xs" />
                                )}
                                <span>EXTEND</span>
                              </button>
                              <button
                                onClick={() =>
                                  sendReminderNotification(annualCycle)
                                }
                                disabled={reminderLoadingId === annualCycle.id}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                  reminderLoadingId === annualCycle.id
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                                }`}
                              >
                                {reminderLoadingId === annualCycle.id ? (
                                  <LoadingSpinner />
                                ) : (
                                  <FiBell className="text-xs" />
                                )}
                                <span>REMINDER</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === "Reset Employee Data" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiRefreshCw className="text-red-500" />
                  Reset Employee Performance Data
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Reset or clear employee goals, evaluations, and performance records for financial year{" "}
                  <span className="font-semibold text-red-600">{reviewCycle}</span>.
                </p>
              </div>
            </div>

            {/* Scope & Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reset Scope */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reset Scope
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all hover:border-red-200 bg-white">
                    <input
                      type="radio"
                      name="resetScope"
                      value="ALL"
                      checked={resetScope === "ALL"}
                      onChange={(e) => setResetScope(e.target.value)}
                      className="accent-red-500 w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">All Quarters & Annual Data</p>
                      <p className="text-xs text-gray-500">Reset SMART goals, development goals & annual review data</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all hover:border-red-200 bg-white">
                    <input
                      type="radio"
                      name="resetScope"
                      value="QUARTER"
                      checked={resetScope === "QUARTER"}
                      onChange={(e) => setResetScope(e.target.value)}
                      className="accent-red-500 w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Specific Quarter Only</p>
                      <p className="text-xs text-gray-500">Reset employee data for a selected quarter</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all hover:border-red-200 bg-white">
                    <input
                      type="radio"
                      name="resetScope"
                      value="ANNUAL"
                      checked={resetScope === "ANNUAL"}
                      onChange={(e) => setResetScope(e.target.value)}
                      className="accent-red-500 w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Annual Review Only</p>
                      <p className="text-xs text-gray-500">Reset annual review self & manager assessments</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                {resetScope === "QUARTER" && (
                  <div>
                    <Select
                      label="Select Quarter"
                      value={resetQuarter}
                      onChange={(val) => setResetQuarter(val)}
                      options={[
                        { label: "Quarter 1 (Q1)", value: "Q1" },
                        { label: "Quarter 2 (Q2)", value: "Q2" },
                        { label: "Quarter 3 (Q3)", value: "Q3" },
                        { label: "Quarter 4 (Q4)", value: "Q4" },
                      ]}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Employee Code / ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={resetEmpId}
                    onChange={(e) => setResetEmpId(e.target.value)}
                    placeholder="Leave blank to reset for ALL employees"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Specify an employee ID if you only want to reset a single employee's data.
                  </p>
                </div>
              </div>
            </div>

            {/* Warning Banner */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
              <FiAlertCircle className="text-amber-600 text-lg flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-800">Important Warning</h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Resetting employee data will revert or clear employee-submitted goals and evaluation progress for the selected scope. Please ensure you have confirmed with management before performing this reset.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsResetModalOpen(true)}
                disabled={isResetting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
              >
                {isResetting ? (
                  <LoadingSpinner />
                ) : (
                  <FiRefreshCw className="text-sm" />
                )}
                <span>Reset Employee Data</span>
              </button>
            </div>

            {/* Audit Log Table */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiClock className="text-red-500" />
                Reset Audit History Log ({reviewCycle})
              </h3>

              {loadingResetLogs ? (
                <div className="py-8 text-center text-gray-500 text-sm">
                  Loading reset history logs...
                </div>
              ) : resetLogs.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No employee data reset actions recorded for financial year {reviewCycle}.
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-red-50 text-red-900 font-semibold uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3">Reset Date & Time</th>
                        <th className="px-4 py-3">Target Employee</th>
                        <th className="px-4 py-3 text-center">Financial Year</th>
                        <th className="px-4 py-3 text-center">Scope / Type</th>
                        <th className="px-4 py-3 text-center">Quarter</th>
                        <th className="px-4 py-3 text-center">Reset By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {resetLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-700">
                            {log.resetAt
                              ? new Date(log.resetAt).toLocaleString("en-GB")
                              : "-"}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-800">
                            {log.employeeId === "ALL" ? (
                              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                                ALL EMPLOYEES
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                                {log.employeeId}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center font-medium text-gray-600">
                            {log.financialYear}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-700">
                              {log.resetScope}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-semibold text-red-600">
                            {log.quarter || "-"}
                          </td>
                          <td className="px-4 py-3 text-center font-medium text-gray-600">
                            {log.resetBy}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <CreateQuarterlyCycleModal
        isOpen={isQuarterModalOpen}
        onClose={() => setIsQuarterModalOpen(false)}
        onSaveQuarter={handleQuarterSave}
        existingQuarters={quarterCycles.map((c) => c.quarter)}
        closedQuarters={closedQuartersList}
      />

      <CreateAnnualCycleModal
        isOpen={isAnnualModalOpen}
        onClose={() => setIsAnnualModalOpen(false)}
        onSaveAnnual={handleAnnualSave}
      />

      <LaunchEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setSelectedCycle(null);
          setTempCycle(null);
          setLoadingId(null);
          setEmailModalAction("LAUNCH");
          setEmailModalExpiryDate(null);
        }}
        onLaunch={handleUnifiedEmailLaunch}
        actionType={emailModalAction}
        cycleQuarter={selectedCycle?.quarter || tempCycle?.quarter}
        cycleType={selectedCycle?.cycleType || tempCycle?.cycleType}
        cycleId={selectedCycle?.id || tempCycle?.id}
        newExpiryDate={emailModalExpiryDate}
      />

      <ExtendExpiryModal
        isOpen={isExtendModalOpen}
        onClose={() => {
          setIsExtendModalOpen(false);
          // Don't clear selectedCycle here - keep it for email modal
        }}
        onExtend={
          (selectedCycle?.status === "CLOSED" || tempCycle?.status === "CLOSED")
            ? handleReopenSubmit
            : handleExtendSubmit
        }
        currentExpiryDate={selectedCycle?.endDate || tempCycle?.endDate}
        isReopen={selectedCycle?.status === "CLOSED" || tempCycle?.status === "CLOSED"}
      />

      {/* Reset Employee Data Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fadeIn border border-gray-100">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="text-red-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Confirm Employee Data Reset
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to reset employee performance data for financial year{" "}
              <span className="font-semibold text-red-600">{reviewCycle}</span>
              {resetEmpId ? ` (Employee: ${resetEmpId})` : " (All Employees)"}?
            </p>

            <div className="bg-gray-50 rounded-xl p-3.5 mb-6 text-xs text-gray-600 space-y-1 border border-gray-100">
              <p><span className="font-semibold">Financial Year:</span> {reviewCycle}</p>
              <p><span className="font-semibold">Scope:</span> {resetScope === "ALL" ? "All Quarters & Annual Review" : resetScope === "QUARTER" ? `Quarter ${resetQuarter}` : "Annual Review Only"}</p>
              <p><span className="font-semibold">Target:</span> {resetEmpId ? `Single Employee (${resetEmpId})` : "All Employees"}</p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsResetModalOpen(false)}
                disabled={isResetting}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResetEmployeeData}
                disabled={isResetting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                {isResetting ? <LoadingSpinner /> : <FiRefreshCw className="text-xs" />}
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrCycleConfig;