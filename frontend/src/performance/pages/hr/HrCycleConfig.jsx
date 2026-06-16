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
    const availableQuarters = getAvailableQuartersToAdd();
    if (availableQuarters.length === 0) return false;

    if (quarterCycles.length === 0) return true;

    const sortedQuarters = [...quarterCycles].sort(
      (a, b) => getQuarterOrder(b.quarter) - getQuarterOrder(a.quarter),
    );
    const latestQuarter = sortedQuarters[0];

    return latestQuarter.status === "CLOSED";
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
    }
  }, [activeTab]);

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

    if (isAnyCycleActive && cycle.status !== "ACTIVE") {
      showNotification(
        "error",
        "Cannot publish: Another cycle is currently active. Please close the active cycle first.",
      );
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
    showNotification("info", `Processing ${emailModalAction} action and sending emails...`);

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
      showNotification("success", `${emailModalAction} completed successfully with email notifications.`);
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
            tabs={["Quarterly Review", "Annual Review"]}
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
                      title={
                        !canAddAnyQuarter()
                          ? "Latest quarter must be closed before adding next quarter"
                          : ""
                      }
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
                                      loadingId === cycle.id ||
                                      isAnyCycleActive ||
                                      isLaunching
                                    }
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                      loadingId === cycle.id || isAnyCycleActive
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                                    }`}
                                    title={
                                      isAnyCycleActive
                                        ? "Another cycle is currently active. Please close it first."
                                        : ""
                                    }
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
                                loadingId === annualCycle?.id ||
                                isAnyCycleActive ||
                                isLaunching
                              }
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                loadingId === annualCycle?.id ||
                                isAnyCycleActive
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                              }`}
                              title={
                                isAnyCycleActive
                                  ? "Another cycle is currently active. Please close it first."
                                  : ""
                              }
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
      </div>

      <CreateQuarterlyCycleModal
        isOpen={isQuarterModalOpen}
        onClose={() => setIsQuarterModalOpen(false)}
        onSaveQuarter={handleQuarterSave}
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
    </div>
  );
};

export default HrCycleConfig;