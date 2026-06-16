import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Proof_Of_Investment from "./Proof_Of_Investment";

import { Box, Modal, Checkbox, Card, CardContent, Chip } from "@mui/material";

import { HiOutlineInformationCircle } from "react-icons/hi2";
import { ImCancelCircle } from "react-icons/im";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

function NewRegimeSummary() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  // Mock / derived values (replace with actual state or API data)
  const value = "one";
  const financialYearFromSession = sessionStorage.getItem("financial-year");

const submitFinancialYear = financialYearFromSession
  ? JSON.parse(financialYearFromSession)?.state?.submitFinancialYear
  : "";

  const regime = "New";
  const quarter = "Quarter 4";
  const financialYearInfo = ["2024-2025"];
  const currentYear = new Date().getFullYear();

  const handleChanges = (e) => {
    setChecked(e.target.checked);
  };

  const handleITDecUpdate = () => {
    setOpen(false);
    // call update API here
    // After API call, navigate to select-regime
    navigate("/select-regime");
  };

  const handleNavigateToSelectRegime = () => {
    setOpen(false); // Close modal first
    setTimeout(() => {
      navigate("/select-regime");
    }, 100); // Small delay to ensure modal is closed
  };

  const isEditAllowed =
    currentYear <= Number(financialYearInfo[0]?.split("-")[0]) ||
    quarter === "Quarter 4";

  return (
    <div className="min-h-screen bg-gray-50 font-content">
      <Header />

      <div className="relative overflow-x-auto sm:rounded-lg w-full max-w-7xl mx-auto px-4 py-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 mt-6">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm">
              <span
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer text-gray-700 font-medium hover:text-red-600 hover:underline"
              >
                Home
              </span>
              <span className="mx-2 text-gray-400">/</span>
              <span
                onClick={() => navigate("/tax")}
                className="cursor-pointer text-gray-700 font-medium hover:text-red-600 hover:underline"
              >
                Tax Management
              </span>
              <span className="mx-2 text-gray-400">/</span>
              <span className="font-semibold text-red-600 cursor-default">
                Declaration
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center bg-red-50 rounded-lg px-4 py-2 border border-red-100">
              <HiOutlineInformationCircle className="text-red-500 text-lg mr-2" />
              <span className="text-sm text-gray-600 font-medium">
                Declaration window is open
              </span>
            </div>

            {/* Financial Year */}
            <div>
              <p className="text-sm text-gray-600 bg-gray-100 py-2 px-4 rounded-full">
                Financial Year:
                <span className="text-gray-900 font-medium ml-1">
                  {submitFinancialYear}
                </span>
              </p>
            </div>
          </div>

          {value === "one" ? (
            <div className="mt-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 font-header">
                  Declaration Summary
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Overview of your tax declarations for the selected financial
                  year
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                {/* Left Content */}
                <div className="lg:col-span-3 mt-10">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm min-h-[160px] flex items-center justify-center text-center px-6">
                    <p className="text-gray-700 text-sm">
                      You have selected the New Tax Regime for the current
                      financial year. No further action is required at this
                      time.
                    </p>
                  </div>
                </div>

                {/* Right Card */}
                {isEditAllowed && (
                  <div className="lg:col-span-1 -mt-7">
                    <Card className="shadow-md border border-gray-200 rounded-lg sticky top-24 mt-[70px]">
                      <CardContent className="p-5">
                        <h2 className="font-semibold text-lg text-gray-800 mb-4">
                          Declaration Status
                        </h2>

                        <div className="flex justify-center mb-5">
                          <Chip
                            label="DECLARED"
                            color="success"
                            sx={{ fontWeight: 600 }}
                          />
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4 mb-5">
                          <p className="text-sm text-blue-700 text-center">
                            You have submitted IT Declaration as per the{" "}
                            {regime} regime
                          </p>
                        </div>

                        <button
                          className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-md w-full font-semibold"
                          onClick={() => setOpen(true)}
                        >
                          Edit Declaration
                        </button>

                        <div className="bg-gray-50 rounded-lg p-3 mt-4">
                          <p className="text-xs text-gray-600 text-center">
                            You can still revise and resubmit while the window
                            is open
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Proof_Of_Investment />
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-red-600"
              onClick={handleNavigateToSelectRegime}
            >
              Revise Declaration
            </h2>

            <ImCancelCircle
              className="text-red-600 cursor-pointer hover:scale-110"
              onClick={() => setOpen(false)}
            />
          </div>

          <p className="text-gray-600 text-sm my-6">
            Are you sure you want to withdraw the submitted IT Declaration? You
            can revise it while the window is open.
          </p>

          <div className="flex items-center mb-6">
            <Checkbox
              checked={checked}
              onChange={handleChanges}
              sx={{
                color: "#9ca3af",
                "&.Mui-checked": { color: "#dc2626" },
              }}
            />
            <span className="text-sm font-medium text-gray-700">
              I understand that I am revising my declaration
            </span>
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              disabled={!checked}
              onClick={handleITDecUpdate}
              className={`px-4 py-2 rounded-md text-white text-sm ${
                checked
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-red-300 cursor-not-allowed"
              }`}
            >
              Revise Declaration
            </button>
          </div>
        </Box>
      </Modal>

      <ToastContainer position="top-right" />
    </div>
  );
}

export default NewRegimeSummary;