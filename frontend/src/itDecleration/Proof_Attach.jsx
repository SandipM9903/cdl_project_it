import { Box, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BiComment } from "react-icons/bi";
import { BsCheck2Circle } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { ImAttachment, ImCancelCircle } from "react-icons/im";
import { TbCircleCheckFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Header from "../components/Header";
import Attachment from "./Attachment";
import Service from "./Service";
import { config } from "./Config";
import { simpleEncrypt } from "../simpleEncrypt";
import {
  useFileStore,
  useStore,
  useStoreAttachmentStatusAfterSubmit,
  useStoreFinancialYear,
  useStoreRegime,
} from "./useFileStore";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

function Proof_Attach() {
  const [submittedComments, setSubmittedComments] = useState({});
  const [comments, setComments] = useState({});
  const { regime } = useStoreRegime();
  const empCode = localStorage.getItem("empId");
  const navigate = useNavigate();

  const { setSubmitFileStatus } = useStore();
  const { submitFinancialYear } = useStoreFinancialYear();
  const files = useFileStore((state) => state.files);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(false);

  const [activeModal, setActiveModal] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [indexInfo, setIndexInfo] = useState(0);

  const handleCommentClick = (itDecId, section) => {
    setActiveModal("comment");
    setActiveSection({ ...section, itDecId });
  };

  const handleAttachClick = (itDecId, section) => {
    setActiveModal("attachment");
    setActiveSection({ ...section, itDecId });
    setIndexInfo(itDecId);
  };

  const closeModal = () => {
    setActiveModal(null);
    setActiveSection(null);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "white",
    borderRadius: "8px",
    boxShadow: 25,
    p: 3,
  };

  const [info, setInfo] = useState([]);
  const [master, setMaster] = useState([]);
  const [proof, setProof] = useState([]);
  const [allSectionName, setAllSectionName] = useState([]);
  const [proofSaveStatus, setProofSaveStatus] = useState(false);
  const [fileCounts, setFileCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch stored file counts for each section using Service
  const fetchStoredFileCounts = async () => {
    try {
      const counts = {};
      if (!empCode || !submitFinancialYear) return counts;

      for (const section of allSectionName) {
        if (section?.itDecId) {
          try {
            const response = await Service.getFileCountForSection(
              empCode,
              submitFinancialYear,
              section.itDecId,
            );
            counts[section.itDecId] = response?.data?.data || 0;
          } catch (error) {
            console.error(
              `Error fetching file count for section ${section.itDecId}:`,
              error,
            );
            counts[section.itDecId] = 0;
          }
        }
      }
      setFileCounts(counts);
    } catch (error) {
      console.error("Error fetching file counts:", error);
    }
  };

  // Fetch info
  const fetchInfo = () => {
    if (!empCode || !submitFinancialYear) return;

    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear,
    )
      .then((res) => {
        setInfo(res?.data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching info:", error);
        setInfo([]);
      });
  };

  useEffect(() => {
    if (empCode && submitFinancialYear) {
      fetchInfo();
    }
  }, [empCode, submitFinancialYear]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  // Fetch master
  const fetchMaster = () => {
    Service.fetchAllSectionName()
      .then((res) => {
        setMaster(res?.data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching master:", error);
        setMaster([]);
      });
  };

  useEffect(() => {
    fetchMaster();
  }, []);

  // Fetch proof
  const fetchProofOfinvestment = () => {
    if (!empCode || !submitFinancialYear) return;

    Service.fetchProofOfInvestmentBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear,
    )
      .then((res) => {
        setProof(res?.data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching proof:", error);
        setProof([]);
      });
  };

  useEffect(() => {
    if (empCode && submitFinancialYear) {
      fetchProofOfinvestment();
    }
  }, [empCode, submitFinancialYear, proofSaveStatus]);

  // Merge all data
  useEffect(() => {
    if (master.length === 0) {
      setAllSectionName([]);
      setLoading(false);
      return;
    }

    // First, create a complete list from master
    const completeList = master.map((masterItem) => {
      // Find matching info
      const matchingInfo = info.find(
        (item) => Number(item.itDecId) === Number(masterItem.itDecId),
      );

      // Find matching proof
      const matchingProof = proof.find(
        (item) => Number(item.itDecId) === Number(masterItem.itDecId),
      );

      return {
        ...masterItem,
        ...(matchingInfo || {}),
        ...(matchingProof || {}),
        // Ensure these fields exist
        declarationAmount:
          matchingInfo?.declarationAmount ||
          matchingProof?.declarationAmount ||
          null,
        revisedAmount:
          matchingProof?.revisedAmount ||
          matchingInfo?.declarationAmount ||
          null,
        documentProfId: matchingProof?.documentProfId || null,
        fileEntryId: matchingProof?.fileEntryId || "",
        remarks: matchingProof?.remarks || null,
        landLordName: matchingProof?.landLordName || null,
        landLordPanNo: matchingProof?.landLordPanNo || null,
        comments: matchingProof?.comments || null,
      };
    });

    setAllSectionName(completeList);
    setLoading(false);
  }, [info, master, proof]);

  // Update file counts when files change or sections load
  useEffect(() => {
    if (allSectionName.length > 0 && empCode && submitFinancialYear) {
      fetchStoredFileCounts();
    }
  }, [allSectionName, files, empCode, submitFinancialYear]);

  useEffect(() => {
    if (empCode && submitFinancialYear) {
      getStatusForProofOfInvestmentFunction();
    }
  }, [empCode, submitFinancialYear]);

  const getStatusForProofOfInvestmentFunction = () => {
    Service.getStatusForProofOfInvestmentFunction(empCode, submitFinancialYear)
      .then((res) => {
        if (res?.data?.data === true) {
          setProofSaveStatus(res?.data?.data);
        }
      })
      .catch((error) => {
        console.error("Error getting status:", error);
      });
  };

  const handleSubmitFunction = () => {
    setSubmitFileStatus("true");
    setSubmitStatusForProofOfInvestment();
  };

  const setSubmitStatusForProofOfInvestment = () => {
    console.log("empCode:", empCode);
    console.log("financialYear:", submitFinancialYear);
    console.log("Encrypted empCode:", simpleEncrypt(empCode));
    console.log(typeof submitFinancialYear);
    if (!empCode || !submitFinancialYear) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Employee code or financial year is missing",
        confirmButtonColor: "#d33",
      });
      return;
    }

    // Call the service method - it has the correct URL path
    Service.setSubmitStatusForProofOfInvestment(empCode, submitFinancialYear, 1)
      .then((response) => {
        console.log("Submit status response:", response);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Record Submitted Successfully",
          confirmButtonText: "OK",
          confirmButtonColor: "#d33",
          timer: 3000,
          showConfirmButton: true,
        }).then(() => {
          navigate("/proof-of-investment-edit");
        });
      })
      .catch((error) => {
        console.error("Error submitting:", error);
        console.error("Error response:", error.response?.data);

        let errorMessage = "There was an error submitting your records";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: errorMessage,
          confirmButtonText: "Try Again",
          confirmButtonColor: "#d33",
        });
      });
  };

  const [
    proofOfInvestmentSubmitStatus,
    setProofOfInvestmentSubmitStatus,
  ] = useState(false);

  const getSubmitStatusForProofOfInvestment = () => {
    if (!empCode || !submitFinancialYear) return;

    Service.getSubmitStatusForProofOfInvestmentFunction(
      empCode,
      submitFinancialYear,
    )
      .then((res) => {
        setProofOfInvestmentSubmitStatus(res?.data?.data);
      })
      .catch((error) => {
        console.error("Error getting submit status:", error);
      });
  };

  useEffect(() => {
    if (empCode && submitFinancialYear) {
      getSubmitStatusForProofOfInvestment();
    }
  }, [empCode, submitFinancialYear]);

  const { attachmentStatusAfterSubmit } = useStoreAttachmentStatusAfterSubmit();

  // Function to post comment using Service
  const postComment = async (documentProfId, comment) => {
    try {
      // Since there's no direct service method for comments, we'll use fetch
      // but with the correct URL from the service's base
      const response = await fetch(
        // `${config.ITDeclarationUrl}/proof-of-investment/$${simpleEncrypt(documentProfId)}/comment`,
        `${config.ITDeclarationUrl}/proof-of-investment/${simpleEncrypt(documentProfId)}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: comment || null,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }
      return true;
    } catch (error) {
      console.error("Error posting comment:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-content">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  // Helper function to format amount
  const formatAmount = (amount) => {
    if (
      !amount ||
      amount === "0" ||
      amount === 0 ||
      amount === null ||
      amount === undefined
    )
      return "-";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  // Group sections dynamically by itDecId range
const sections80C = allSectionName
  ?.filter(section =>
    [1, 2, 4, 5, 9, 18, 19, 20, 21, 22, 23].includes(Number(section.itDecId))
  )
  .sort((a, b) => Number(a.itDecId) - Number(b.itDecId));

const sections80D = allSectionName
  ?.filter(section =>
    [7, 8, 10, 11, 15, 16, 17].includes(Number(section.itDecId))
  )
  .sort((a, b) => Number(a.itDecId) - Number(b.itDecId));

const sections80E = allSectionName
  ?.filter(section =>
    [12, 13, 14].includes(Number(section.itDecId))
  )
  .sort((a, b) => Number(a.itDecId) - Number(b.itDecId));

  return (
    <div className="min-h-screen bg-gray-50 font-content">
      <Header />

      <div className="mt-20 bg-white rounded-lg shadow-sm p-6 w-full max-w-6xl mx-auto">
        {/* Header Row */}
        <div className="flex items-center space-x-3 mb-4">
          {message && (
            <div className="flex text-green-600 items-center space-x-4 ml-auto">
              <BsCheck2Circle className="text-xl" />
              <span className="font-medium text-base">
                Your Proof of investment details have been saved successfully
              </span>
            </div>
          )}
        </div>

        {/* Breadcrumb – left */}
        <div className="relative flex items-center h-16 mb-8">
          {/* Breadcrumbs – LEFT */}
          <div className="flex items-center text-sm px-6">
            <span
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer text-gray-700 font-medium hover:text-[#dc2626] hover:underline hover:underline-offset-4"
            >
              Home
            </span>

            <span className="mx-2 text-gray-400">/</span>

            <span
              onClick={() => navigate("/tax")}
              className="cursor-pointer text-gray-700 font-medium hover:text-[#dc2626] hover:underline hover:underline-offset-4"
            >
              Tax Management
            </span>

            <span className="mx-2 text-gray-400">/</span>

            <span
              onClick={() => navigate("/display-proof-of-investment")}
              className="cursor-pointer text-gray-700 font-medium hover:text-[#dc2626] hover:underline hover:underline-offset-4"
            >
              Edit
            </span>

            <span className="mx-2 text-gray-400">/</span>

            <span className="font-semibold text-[#dc2626] cursor-default">
              Update
            </span>
          </div>

          {/* Selected Regime – CENTER */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <div className="bg-red-50 border border-red-100 rounded-lg shadow-sm px-6">
              <div className="flex items-center space-x-4 py-3">
                <TbCircleCheckFilled className="text-3xl text-green-600" />
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">
                    Selected Regime
                  </p>
                  <p className="text-gray-800 font-semibold text-base">
                    {regime === "" || regime === "Old Regime"
                      ? "Old Regime"
                      : "New Regime"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Declaration Summary */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-5">
            <p className="text-base font-semibold text-gray-800 font-header">
              Declaration Summary
            </p>
            <p className="text-sm text-gray-600 bg-gray-100 py-1 px-3 rounded-full">
              Financial Year:{" "}
              <span className="text-gray-900 font-medium">
                {submitFinancialYear}
              </span>
            </p>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm w-full">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-red-50 py-3 font-semibold text-sm text-gray-700 font-header">
              <div className="col-span-4 pl-6">Particulars</div>
              <div className="col-span-2 text-center">Declared Amount</div>
              <div className="col-span-2 text-center">Actual Amount</div>
              <div className="col-span-2 text-center">Proofs</div>
              <div className="col-span-2 text-center">Comments</div>
            </div>

            {/* Section 80C */}
            <div className="border-t border-gray-200">
              <h3 className="px-6 py-3 font-medium text-gray-700 bg-red-50 text-sm uppercase tracking-wide font-header">
                DEDUCTION UNDER SECTION 80C
              </h3>
              <div className="divide-y divide-gray-100">
                {sections80C.length > 0 ? (
                  sections80C.map((section) => {
                    const hasActualAmount =
                      section.revisedAmount &&
                      Number(section.revisedAmount) > 0;
                    return (
                      <div
                        key={section.itDecId}
                        className="grid grid-cols-12 items-center px-6 py-3 hover:bg-gray-50 transition-colors relative"
                      >
                        <div className="col-span-4">
                          <div className="text-sm font-medium text-gray-800">
                            {section.description ||
                              section.declarationName ||
                              `Section ${section.itDecId}`}
                          </div>
                          {section.additionalInformation && (
                            <div className="text-xs text-gray-500 mt-1">
                              {section.additionalInformation}
                            </div>
                          )}
                        </div>
                        <div className="col-span-2 text-center text-gray-700 font-medium">
                          {formatAmount(section.declarationAmount)}
                        </div>
                        <div className="col-span-2 text-center text-gray-700 font-medium">
                          {formatAmount(section.revisedAmount)}
                        </div>
                        <div className="col-span-2 flex justify-center items-center space-x-1 relative">
                          <button
                            className={`text-red-600 hover:text-red-800 transition-colors flex items-center ${
                              !hasActualAmount
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              if (hasActualAmount) {
                                handleAttachClick(section.itDecId, section);
                              }
                            }}
                            disabled={!hasActualAmount}
                          >
                            <ImAttachment className="mr-1" />
                            <span className="text-gray-700 font-medium text-sm">
                              {fileCounts[section.itDecId] >= 1
                                ? fileCounts[section.itDecId]
                                : "-"}
                            </span>
                          </button>
                        </div>
                        <div className="col-span-2 flex justify-center relative">
                          <button
                            className={`text-lg ${
                              section.comments &&
                              String(section.comments).trim() !== ""
                                ? "text-green-600"
                                : "text-red-600"
                            } hover:text-red-800 transition-colors ${
                              !hasActualAmount
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              if (hasActualAmount) {
                                handleCommentClick(section.itDecId, section);
                              }
                            }}
                            disabled={!hasActualAmount}
                          >
                            <BiComment />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-6 py-4 text-center text-gray-500">
                    No sections found
                  </div>
                )}
              </div>
            </div>

            {/* Section 80D/80DD/80DDB/80U */}
            <div className="border-t border-gray-200">
              <h3 className="px-6 py-3 font-medium text-gray-700 bg-red-50 text-sm uppercase tracking-wide font-header">
                Section 80D / 80DD / 80DDB / 80U
              </h3>
              <div className="divide-y divide-gray-100">
                {sections80D.length > 0 ? (
                  sections80D.map((section) => {
                    const hasActualAmount =
                      section.revisedAmount &&
                      Number(section.revisedAmount) > 0;
                    return (
                      <div
                        key={section.itDecId}
                        className="grid grid-cols-12 items-center px-6 py-3 hover:bg-gray-50 transition-colors relative"
                      >
                        <div className="col-span-4">
                          <div className="text-sm font-medium text-gray-800">
                            {section.description ||
                              section.declarationName ||
                              `Section ${section.itDecId}`}
                          </div>
                          {section.additionalInformation && (
                            <div className="text-xs text-gray-500 mt-1">
                              {section.additionalInformation}
                            </div>
                          )}
                        </div>
                        <div className="col-span-2 text-center text-gray-700 font-medium">
                          {formatAmount(section.declarationAmount)}
                        </div>
                        <div className="col-span-2 text-center text-gray-700 font-medium">
                          {formatAmount(section.revisedAmount)}
                        </div>
                        <div className="col-span-2 flex justify-center items-center space-x-1 relative">
                          <button
                            className={`text-red-600 hover:text-red-800 transition-colors flex items-center ${
                              !hasActualAmount
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              if (hasActualAmount) {
                                handleAttachClick(section.itDecId, section);
                              }
                            }}
                            disabled={!hasActualAmount}
                          >
                            <ImAttachment className="mr-1" />
                            <span className="text-gray-700 font-medium text-sm">
                              {fileCounts[section.itDecId] >= 1
                                ? fileCounts[section.itDecId]
                                : "-"}
                            </span>
                          </button>
                        </div>
                        <div className="col-span-2 flex justify-center relative">
                          <button
                            className={`text-lg ${
                              section.comments &&
                              String(section.comments).trim() !== ""
                                ? "text-green-600"
                                : "text-red-600"
                            } hover:text-red-800 transition-colors ${
                              !hasActualAmount
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              if (hasActualAmount) {
                                handleCommentClick(section.itDecId, section);
                              }
                            }}
                            disabled={!hasActualAmount}
                          >
                            <BiComment />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-6 py-4 text-center text-gray-500">
                    No sections found
                  </div>
                )}
              </div>
            </div>

            {/* Section 80E/10/Housing Loan */}
            <div className="border-t border-gray-200">
              <h3 className="px-6 py-3 font-medium text-gray-700 bg-red-50 text-sm uppercase tracking-wide font-header">
                Section 80E / 10 / Housing Loan
              </h3>
              <div className="divide-y divide-gray-100">
                {sections80E.length > 0 ? (
                  sections80E.map((section) => {
                    const hasActualAmount =
                      section.revisedAmount &&
                      Number(section.revisedAmount) > 0;
                    return (
                      <div
                        key={section.itDecId}
                        className="grid grid-cols-12 items-center px-6 py-3 hover:bg-gray-50 transition-colors relative"
                      >
                        <div className="col-span-4">
                          <div className="text-sm font-medium text-gray-800">
                            {section.description ||
                              section.declarationName ||
                              `Section ${section.itDecId}`}
                          </div>
                          {section.additionalInformation && (
                            <div className="text-xs text-gray-500 mt-1">
                              {section.additionalInformation}
                            </div>
                          )}
                        </div>
                        <div className="col-span-2 text-center text-gray-700 font-medium">
                          {formatAmount(section.declarationAmount)}
                        </div>
                        <div className="col-span-2 text-center text-gray-700 font-medium">
                          {formatAmount(section.revisedAmount)}
                        </div>
                        <div className="col-span-2 flex justify-center items-center space-x-1 relative">
                          <button
                            className={`text-red-600 hover:text-red-800 transition-colors flex items-center ${
                              !hasActualAmount
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              if (hasActualAmount) {
                                handleAttachClick(section.itDecId, section);
                              }
                            }}
                            disabled={!hasActualAmount}
                          >
                            <ImAttachment className="mr-1" />
                            <span className="text-gray-700 font-medium text-sm">
                              {fileCounts[section.itDecId] >= 1
                                ? fileCounts[section.itDecId]
                                : "-"}
                            </span>
                          </button>
                        </div>
                        <div className="col-span-2 flex justify-center relative">
                          <button
                            className={`text-lg ${
                              section.comments &&
                              String(section.comments).trim() !== ""
                                ? "text-green-600"
                                : "text-red-600"
                            } hover:text-red-800 transition-colors ${
                              !hasActualAmount
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              if (hasActualAmount) {
                                handleCommentClick(section.itDecId, section);
                              }
                            }}
                            disabled={!hasActualAmount}
                          >
                            <BiComment />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-6 py-4 text-center text-gray-500">
                    No sections found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8 pt-5 border-t border-gray-200">
          <button
            className="px-5 py-2.5 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 transition-all font-medium font-header"
            onClick={() => setOpen(true)}
          >
            Submit
          </button>
        </div>

        {/* Comment Modal */}
        <Modal open={activeModal === "comment"} onClose={closeModal}>
          <Box sx={style}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 font-header">
                Add Comment for{" "}
                {activeSection?.description ||
                  activeSection?.declarationName ||
                  `Section ${activeSection?.itDecId}`}
              </h3>
              <ImCancelCircle
                className="text-red-500 cursor-pointer hover:text-red-700 transition-colors text-xl"
                onClick={closeModal}
              />
            </div>

            <textarea
              placeholder="Write your comment..."
              rows={4}
              className="border border-gray-300 outline-none p-2 rounded w-full text-sm mb-4 font-content"
              value={
                comments[activeSection?.itDecId] ??
                activeSection?.comments ??
                ""
              }
              onChange={(e) =>
                setComments({
                  ...comments,
                  [activeSection?.itDecId]: e.target.value,
                })
              }
            />

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors text-sm font-medium font-content"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors font-content"
                onClick={async () => {
                  const currentComment = comments[
                    activeSection?.itDecId
                  ]?.trim();

                  if (!activeSection?.documentProfId) {
                    toast.error(
                      "No document profile ID found for this section",
                      {
                        position: "top-right",
                        autoClose: 3000,
                      },
                    );
                    return;
                  }

                  try {
                    // Use the postComment function with the documentProfId directly (not encrypted again)
                    // The documentProfId might already be encrypted or needs to be sent as-is
                    await postComment(
                      activeSection?.documentProfId,
                      currentComment,
                    );

                    fetchProofOfinvestment();

                    setSubmittedComments({
                      ...submittedComments,
                      [activeSection?.itDecId]: !!currentComment,
                    });

                    toast.success("Comment submitted successfully!", {
                      position: "top-right",
                      autoClose: 3000,
                    });
                  } catch (error) {
                    console.error("Error posting comment:", error);
                    toast.error("Failed to submit comment. Try again!", {
                      position: "top-right",
                      autoClose: 3000,
                    });
                  }

                  closeModal();
                }}
              >
                Submit Comment
              </button>
            </div>
          </Box>
        </Modal>

        {/* Attachment Modal */}
        <Modal open={activeModal === "attachment"} onClose={closeModal}>
          <Box sx={{ ...style, width: 600 }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 font-header">
                Attachments for{" "}
                {activeSection?.description ||
                  activeSection?.declarationName ||
                  `Section ${activeSection?.itDecId}`}
              </h3>
              <ImCancelCircle
                className="text-red-500 cursor-pointer hover:text-red-700 transition-colors text-xl"
                onClick={closeModal}
              />
            </div>

            <Attachment
              rowId={activeSection?.itDecId}
              onClose={closeModal}
              onFilesUpdated={() => fetchStoredFileCounts()}
            />
          </Box>
        </Modal>

        {/* Submit Modal */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={style}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 font-header">
                Submit Proof of Investment
              </h3>
              <ImCancelCircle
                className="text-red-500 cursor-pointer hover:text-red-700 transition-colors text-xl"
                onClick={() => setOpen(false)}
              />
            </div>

            <p className="text-sm text-gray-600 mb-6 font-content">
              Are you sure you want to submit your Proof of Investment? Once
              submitted, you may need approval to make further changes.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors text-sm font-medium font-content"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors font-content"
                onClick={() => {
                  handleSubmitFunction();
                  setOpen(false);
                }}
              >
                Submit
              </button>
            </div>
          </Box>
        </Modal>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Proof_Attach;
