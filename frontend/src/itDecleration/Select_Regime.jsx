import { Box, Modal } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import React, { useState, useEffect } from "react";
import { Checkmark } from "react-checkmark";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { ImCancelCircle } from "react-icons/im";
import { useNavigate } from "react-router-dom";

import { useStoreRegime } from "./useFileStore";
import Header from "../components/Header";
import { FiEdit } from "react-icons/fi";

import Service from "./Service";

function Select_Regime() {
  const [checked, setChecked] = useState(false);
  const [newRegime, setNewRegime] = useState(false);
  const [oldRegime, setOldRegime] = useState(true);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [panNumber, setPanNumber] = useState("");

  const { regime, setRegime } = useStoreRegime();
  const navigate = useNavigate();

  const [panExists, setPanExists] = useState(false);
  const [isPanEditable, setIsPanEditable] = useState(false);

  const empCode =
    localStorage.getItem("empId") ||
    localStorage.getItem("emplId") ||
    "9085173";
  const employeeName =
    localStorage.getItem("EmployeeFullName") ||
    localStorage.getItem("firstName") ||
    "SANDIP MONDAL";
  const submitFinancialYear = localStorage.getItem("submitFinancialYear");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    p: 4,
    borderRadius: 3,
    outline: "none",
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    fetchPanDetails();
  }, []);

  const fetchPanDetails = async () => {
    try {
      const response = await Service.getEmployeePanByEmpCode(empCode);

      if (response?.data?.panNumber) {
        setPanNumber(response.data.panNumber);
        setPanExists(true);
        setIsPanEditable(false);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setPanExists(false);
        setIsPanEditable(true);
      } else {
        console.error("PAN fetch error", error);
      }
    }
  };

  const handlePanEditClick = () => {
    setIsPanEditable(true);
  };

  const handleChanges = (event) => {
    setChecked(event.target.checked);
  };

  const handleToggleNewRegime = () => {
    setNewRegime(true);
    setOldRegime(false);
    setRegime("New Regime");
  };

  const handleToggleOldRegime = () => {
    setNewRegime(false);
    setOldRegime(true);
    setRegime("Old Regime");
  };

  const savePanIfNeeded = async () => {
    try {
      const response = await Service.getEmployeePanByEmpCode(empCode);
      if (isPanEditable) {
        await Service.updateEmployeePan(empCode, {
          empName: employeeName,
          empCode,
          panNumber,
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        await Service.createEmployeePan({
          empName: employeeName,
          empCode,
          panNumber,
        });
      } else {
        throw error;
      }
    }
  };

  const saveOrUpdateRegime = async () => {
    const payload = buildRegimePayload();
    await savePanIfNeeded();
    try {
      const response = await Service.getRegimeByEmpCode(empCode);

      if (!response?.data) {
        await Service.createRegime(payload);
      } else {
        await Service.updateRegimeByEmpCode(empCode, payload);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("Creating regime for empCode:", empCode);
        await Service.createRegime(payload);
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message?.includes("Network Error")
      ) {
        console.error("Network error:", error);
        throw new Error(
          "Network connection failed. Please check your internet connection and try again.",
        );
      } else {
        console.error("Error saving regime:", error);
        throw error;
      }
    }
  };

  const handleNextClick = async () => {
    if (isSubmitting) return;

    if (!panNumber.trim()) {
      alert("Please enter PAN number");
      return;
    }

    if (panNumber.length !== 10) {
      alert("Please enter a valid 10-character PAN number");
      return;
    }

    if (newRegime) {
      setOpen(true);
      return;
    }

    try {
      setIsSubmitting(true);
      await saveOrUpdateRegime();
      navigate("/declaration-dashboard");
    } catch (error) {
      console.error("Old Regime save/update failed", error);
      alert(error.message || "Failed to save regime. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitButton = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await saveOrUpdateRegime();
      setOpen(false);
      navigate("/new-summary");
    } catch (error) {
      console.error("New Regime save/update failed", error);
      alert(error.message || "Failed to save regime. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildRegimePayload = () => ({
    empCode: empCode,
    regime: newRegime ? "NEW" : "OLD",
    financialYear: submitFinancialYear || new Date().getFullYear().toString(),
    panNumber: panNumber,
  });

  const getButtonText = () => {
    if (isSubmitting) return "Processing...";
    return newRegime ? "Submit" : "Next";
  };

  const getTooltipText = () => {
    if (isSubmitting) return "Please wait...";
    if (!panNumber) return "Please enter PAN number";
    return checked ? "" : "Please agree to terms and conditions";
  };

  const isButtonDisabled = () => {
    return !checked || !panNumber || panNumber.length !== 10 || isSubmitting;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-6 mt-20">
          <div className="flex items-center text-sm">
            <span
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer text-gray-600 hover:text-[#dc2626] transition-colors duration-200"
            >
              Home
            </span>
            <span className="mx-2 text-gray-400">/</span>
            <span
              onClick={() => navigate("/tax")}
              className="cursor-pointer text-gray-600 hover:text-[#dc2626] transition-colors duration-200"
            >
              Tax Management
            </span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-semibold text-[#dc2626]">Select Regime</span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with theme color accent */}
          <div className="h-2 bg-[#dc2626]"></div>

          <div className="p-8">
            {/* Employee Information Section */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-1 h-6 bg-[#dc2626] rounded-full mr-3"></span>
                Employee Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Employee Name */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </label>
                  <div className="relative">
                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">
                      {employeeName}
                    </div>
                  </div>
                </div>

                {/* Employee Code */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employee Code
                  </label>
                  <div className="relative">
                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">
                      {empCode}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    PAN Number <span className="text-[#dc2626] ml-1">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      value={panNumber}
                      onChange={(e) =>
                        setPanNumber(e.target.value.toUpperCase())
                      }
                      maxLength={10}
                      placeholder="ENTER PAN NUMBER"
                      disabled={isSubmitting || (panExists && !isPanEditable)}
                      className={`w-full px-4 py-3 border rounded-lg text-sm uppercase pr-10
      ${
        panNumber && panNumber.length !== 10
          ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
          : "border-gray-200 focus:border-[#dc2626] focus:ring-2 focus:ring-red-100"
      }
      focus:outline-none bg-white`}
                    />

                    {/* UPDATE ICON */}
                    {panExists && !isPanEditable && (
                      <Tooltip title="Want to update PAN number?" arrow>
                        <div
                          onClick={handlePanEditClick}
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-[#dc2626]"
                        >
                          <FiEdit size={18} />
                        </div>
                      </Tooltip>
                    )}
                  </div>

                  {/* ✅ VALIDATION MESSAGE RESTORED */}
                  {panNumber && panNumber.length !== 10 && (
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      PAN must be exactly 10 characters
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Regime Selection Section */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-[#dc2626] rounded-full mr-3"></span>
                Select Tax Regime
              </h2>

              <p className="text-sm text-gray-600 mb-2">
                Select any of the Regime before you Click Submit
              </p>
              <p className="text-sm text-gray-500 mb-6">
                By Default Old Regime will be selected, you can change the
                Regime by selecting below
              </p>

              <div className="flex flex-wrap gap-6">
                {/* Old Regime Card */}
                <div
                  className={`flex-1 min-w-[200px] p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    oldRegime
                      ? "border-[#dc2626] bg-red-50 shadow-md"
                      : "border-gray-200 hover:border-[#dc2626] hover:shadow-md"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={!isSubmitting ? handleToggleOldRegime : undefined}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        oldRegime ? "bg-[#dc2626]" : "border-2 border-gray-300"
                      }`}
                    >
                      {oldRegime && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span
                      className={`font-medium ${
                        oldRegime ? "text-[#dc2626]" : "text-gray-700"
                      }`}
                    >
                      Old Regime
                    </span>
                  </div>
                  {oldRegime && (
                    <div className="mt-3 text-xs text-[#dc2626] font-medium">
                      ✓ Currently Selected
                    </div>
                  )}
                </div>

                {/* New Regime Card */}
                <div
                  className={`flex-1 min-w-[200px] p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    newRegime
                      ? "border-[#dc2626] bg-red-50 shadow-md"
                      : "border-gray-200 hover:border-[#dc2626] hover:shadow-md"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={!isSubmitting ? handleToggleNewRegime : undefined}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        newRegime ? "bg-[#dc2626]" : "border-2 border-gray-300"
                      }`}
                    >
                      {newRegime && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span
                      className={`font-medium ${
                        newRegime ? "text-[#dc2626]" : "text-gray-700"
                      }`}
                    >
                      New Regime
                    </span>
                  </div>
                  {newRegime && (
                    <div className="mt-3 text-xs text-[#dc2626] font-medium">
                      ✓ Currently Selected
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Undertaking Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-[#dc2626] rounded-full mr-3"></span>
                Undertaking By Employee
              </h2>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  I hereby declare that the above information is correct and I
                  shall be solely responsible for any queries that may be raised
                  by the Income Tax Department.
                </p>

                <div className="flex items-center">
                  <Checkbox
                    checked={checked}
                    onChange={!isSubmitting ? handleChanges : undefined}
                    disabled={isSubmitting}
                    sx={{
                      color: "#9CA3AF",
                      "&.Mui-checked": {
                        color: "#dc2626",
                      },
                      "&.Mui-disabled": {
                        color: "#D1D5DB",
                      },
                      padding: "4px",
                    }}
                  />
                  <span className="text-sm text-gray-700 ml-2">
                    I agree to the terms and conditions
                  </span>
                </div>
              </div>
            </div>

            {/* Footer with Action Button */}
            <div className="flex justify-end items-center border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <HiOutlineInformationCircle className="text-xl mr-2 text-[#dc2626]" />
                  <span>
                    Click {newRegime ? "Submit" : "Next"} to declare your IT
                  </span>
                </div>

                {!isButtonDisabled() ? (
                  <button
                    onClick={handleNextClick}
                    className="px-8 py-3 bg-[#dc2626] text-white text-sm font-medium rounded-lg hover:bg-[#b91c1c] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {getButtonText()}
                  </button>
                ) : (
                  <Tooltip title={getTooltipText()} arrow>
                    <div className="relative">
                      <button
                        disabled
                        className="px-8 py-3 bg-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed opacity-60"
                      >
                        {getButtonText()}
                      </button>
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for New Regime */}
      {checked && newRegime && (
        <Modal open={open} onClose={() => !isSubmitting && setOpen(false)}>
          <Box sx={style}>
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => !isSubmitting && setOpen(false)}
                disabled={isSubmitting}
                className="absolute -top-2 -right-2 text-gray-400 hover:text-[#dc2626] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ImCancelCircle size={20} />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <HiOutlineInformationCircle className="text-3xl text-[#dc2626]" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
                Confirm Submission
              </h3>

              {/* Message */}
              <p className="text-center text-gray-600 mb-8">
                Are you sure you want to submit your IT Declaration?
              </p>

              {/* Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleSubmitButton}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#dc2626] text-white text-sm font-medium rounded-lg hover:bg-[#b91c1c] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                >
                  {isSubmitting ? "Processing..." : "Submit"}
                </button>

                {!isSubmitting && (
                  <button
                    onClick={() => setOpen(false)}
                    className="px-6 py-2.5 border-2 border-[#dc2626] text-[#dc2626] text-sm font-medium rounded-lg hover:bg-red-50 transition-colors duration-200 min-w-[100px]"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isSubmitting && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Please wait while we process your request...
                </p>
              )}
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
}

export default Select_Regime;
