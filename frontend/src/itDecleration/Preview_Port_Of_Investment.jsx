import { Box, Modal, Typography, Checkbox } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BiComment } from "react-icons/bi";
import { BsCheck2Circle } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { ImCancelCircle } from "react-icons/im";
import { TbCircleCheckFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Header from "../components/Header";
import Attachment from "./Attachment";
import Service from "./Service";
import { simpleEncrypt } from "../simpleEncrypt";
import {
  useFileStore,
  useStore,
  useStoreAttachmentStatusAfterSubmit,
  useStoreFinancialYear,
  useStoreRegime,
} from "./useFileStore";
import axios from "axios";
import { AiOutlineEye } from "react-icons/ai";
import { BASE_URL } from "../config/Config";

function Preview_Port_Of_Investment() {
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
  const [checked, setChecked] = useState(false);

  const [openCommentIndex, setOpenCommentIndex] = useState(null);
  const [openAttachIndex, setOpenAttachIndex] = useState(null);
  const [indexInfo, setIndexInfo] = useState(0);

  const handleCommentClick = (itDecId) => {
    setOpenCommentIndex(openCommentIndex === itDecId ? null : itDecId);
  };

  const handleAttachClick = (itDecId) => {
    setIndexInfo(itDecId);
    setOpenAttachIndex(openAttachIndex === itDecId ? null : itDecId);
    fetchUploadedFiles(itDecId);
  };

  // Add the missing handleChange function
  const handleChange = (event) => {
    setChecked(event.target.checked);
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

  // New state for file counts and attachment popup
  const [fileCounts, setFileCounts] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingFileIds, setLoadingFileIds] = useState({});

  // Check if declaration window is closed
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // Jan = 1

  let currentFinancialYear;

  if (currentMonth >= 4) {
    // April to December
    currentFinancialYear = `${currentYear}-${String(currentYear + 1).slice(
      -2,
    )}`;
  } else {
    // January to March
    currentFinancialYear = `${currentYear - 1}-${String(currentYear).slice(
      -2,
    )}`;
  }

  const isCurrentFinancialYear = submitFinancialYear === currentFinancialYear;
  const isDeclarationClosed = !isCurrentFinancialYear;

  // Fetch file counts for all sections
  const fetchFileCounts = async () => {
    try {
      const counts = {};
      for (const section of allSectionName) {
        try {
          const response = await axios.get(
            `${BASE_URL}:9026/it-declaration-file/count/${simpleEncrypt(
              empCode,
            )}/${submitFinancialYear}/${section.itDecId}`,
          );
          counts[section.itDecId] = response.data.data || 0;
        } catch (error) {
          console.error(
            `Error fetching count for section ${section.itDecId}:`,
            error,
          );
          counts[section.itDecId] = 0;
        }
      }
      setFileCounts(counts);
    } catch (error) {
      console.error("Error fetching file counts:", error);
    }
  };

  // Fetch uploaded files for a specific section
  const fetchUploadedFiles = async (itDecId) => {
    setLoadingFiles(true);
    try {
      const response = await axios.get(
        `${BASE_URL}:9026/it-declaration-file/files/${simpleEncrypt(
          empCode,
        )}/${submitFinancialYear}/${itDecId}`,
      );
      setUploadedFiles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      setUploadedFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Handle file viewing
  const handleViewFile = async (itDecDocId) => {
    setLoadingFileIds((prev) => ({ ...prev, [itDecDocId]: true }));
    try {
      const encryptedId = simpleEncrypt(itDecDocId);
      const response = await axios.post(
        `${BASE_URL}:9026/it-declaration-file/download`,
        {
          encDocId: encryptedId,
        },
        {
          responseType: "blob",
        },
      );
      const fileBlob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("View error:", error);
      toast.error("Failed to view file", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoadingFileIds((prev) => ({ ...prev, [itDecDocId]: false }));
    }
  };

  // Fetch info
  const fetchInfo = () => {
    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear,
    ).then((res) => setInfo(res?.data?.data || []));
  };
  useEffect(() => {
    fetchInfo();
  }, []);

  // Fetch master
  const fetchMaster = () => {
    Service.fetchAllSectionName().then((res) =>
      setMaster(res?.data?.data || []),
    );
  };
  useEffect(() => {
    fetchMaster();
  }, []);

  // Fetch proof
  const fetchProofOfinvestment = () => {
    Service.fetchProofOfInvestmentBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear,
    ).then((res) => setProof(res?.data?.data || []));
  };
  useEffect(() => {
    fetchProofOfinvestment();
  }, [proofSaveStatus]);

  // Create a complete list of all sections from master, merging with info and proof data
  useEffect(() => {
    const completeSectionList = master.map((masterItem) => {
      // Find matching declaration info
      const matchingInfo = info.find(
        (item) => Number(item.itDecId) === Number(masterItem.itDecId),
      );

      // Find matching proof data
      const matchingProof = proof.find(
        (item) => Number(item.itDecId) === Number(masterItem.itDecId),
      );

      // Merge all data with priority: proof > info > master
      return {
        ...masterItem,
        ...(matchingInfo || {}),
        ...(matchingProof || {}),
        description: matchingInfo?.description || masterItem.description,
        additionalInformation:
          matchingInfo?.additionalInformation ||
          masterItem.additionalInformation,
        revisedAmount:
          matchingProof?.revisedAmount ||
          matchingInfo?.declarationAmount ||
          null,
      };
    });

    setAllSectionName(completeSectionList);
  }, [info, master, proof]);

  // Fetch file counts when allSectionName changes
  useEffect(() => {
    if (allSectionName.length > 0) {
      fetchFileCounts();
    }
  }, [allSectionName]);

  useEffect(() => {
    getStatusForProofOfInvestmentFunction();
  }, []);

  const handleSaveProofOfInvestment = () => {
    setAllSectionDataProofOfInvestmentFunction();
    setStatusForProofOfInvestmentFunction();
    getStatusForProofOfInvestmentFunction();
  };

  const setAllSectionDataProofOfInvestmentFunction = () => {
    Service.postProofOfInvestment(allSectionName).then(() => {
      alert("saved");
    });
  };

  const setStatusForProofOfInvestmentFunction = () => {
    Service.setStatusForProofOfInvestment(empCode, submitFinancialYear)
      .then(() => {
        toast.success("Saved successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch(() => {
        toast.error("Data Not Saved!", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  const getStatusForProofOfInvestmentFunction = () => {
    Service.getStatusForProofOfInvestmentFunction(
      empCode,
      submitFinancialYear,
    ).then((res) => {
      if (res?.data?.data === true) {
        setProofSaveStatus(res?.data?.data);
      }
    });
  };

  const [allDataProofOfInvestment, setAllDataProofOfInvestment] = useState([]);
  useEffect(() => {
    Service.fetchProofOfInvestmentBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear,
    ).then((res) => setAllDataProofOfInvestment(res.data));
  }, []);

  const handleSubmitFunction = () => {
    setSubmitFileStatus("true");
    setSubmitStatusForProofOfInvestment();
    navigate("/display-proof-of-investment"); // Added navigation here
  };

  const setSubmitStatusForProofOfInvestment = () => {
    Service.setSubmitStatusForProofOfInvestment(
      empCode,
      submitFinancialYear,
      true,
    ).then(() => {
      getSubmitStatusForProofOfInvestment();
    });
  };

  const [
    proofOfInvestmentSubmitStatus,
    setProofOfInvestmentSubmitStatus,
  ] = useState(false);
  const getSubmitStatusForProofOfInvestment = () => {
    Service.getSubmitStatusForProofOfInvestmentFunction(
      empCode,
      submitFinancialYear,
    ).then((res) => setProofOfInvestmentSubmitStatus(res?.data?.data));
  };
  useEffect(() => {
    getSubmitStatusForProofOfInvestment();
  }, []);

  const { attachmentStatusAfterSubmit } = useStoreAttachmentStatusAfterSubmit();

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
        <div className="relative flex items-center h-12 mb-8">
          {/* Breadcrumb – left */}
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

            <span className="font-semibold text-[#dc2626] cursor-default">
              Preview
            </span>
          </div>

          {/* Info Banner – centered */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <div className="bg-red-50 border border-red-100 rounded-lg shadow-sm px-6">
              <div className="flex items-center space-x-3 py-2">
                <HiOutlineInformationCircle className="text-xl text-red-600" />
                <p className="text-gray-600 text-sm font-medium">
                  {isDeclarationClosed
                    ? "Declaration window is closed"
                    : "Declaration window is open"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Year */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-gray-100 py-3 font-semibold text-sm text-gray-700 rounded-t-lg font-header">
              <div className="col-span-5 pl-6">Particulars</div>
              <div className="col-span-2 text-center">Declared Amount</div>
              <div className="col-span-2 text-center">Proofs</div>
              <div className="col-span-3 text-center">Comments</div>
            </div>

            {/* Section 80C */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mt-5">
              <h3 className="px-6 py-3 font-medium text-gray-700 bg-red-50 text-sm uppercase tracking-wide font-header">
                DEDUCTION UNDER SECTION 80C
              </h3>
              <div className="divide-y divide-gray-100">
                {allSectionName
                  ?.sort((a, b) => a.itDecId - b.itDecId)
                  ?.filter((section) =>
                    [1, 2, 4, 5, 9, 18, 19, 20, 21, 22, 23].includes(
                      section.itDecId,
                    ),
                  )
                  ?.map((section) => {
                    return (
                      <div
                        key={section.itDecId}
                        className="grid grid-cols-12 items-center px-6 py-3 hover:bg-gray-50 transition-colors relative"
                      >
                        <div className="col-span-5">
                          <div className="text-sm font-medium text-gray-800">
                            {section.description ||
                              section.declarationName ||
                              "Unknown Section"}
                          </div>
                          {section.additionalInformation && (
                            <div className="text-xs text-gray-500 mt-1">
                              {section.additionalInformation}
                            </div>
                          )}
                        </div>
                        <div className="col-span-2 text-center text-gray-700 font-medium">
                          {section?.revisedAmount
                            ? `₹${Number(section.revisedAmount).toLocaleString(
                                "en-IN",
                              )}`
                            : "-"}
                        </div>
                        <div className="col-span-2 flex justify-center items-center space-x-1 relative">
                          <button
                            className="text-red-600 hover:text-red-800 transition-colors flex items-center font-medium"
                            onClick={() => handleAttachClick(section.itDecId)}
                          >
                            <span className="text-gray-700 text-sm">
                              {fileCounts[section.itDecId] >= 1
                                ? fileCounts[section.itDecId]
                                : "-"}
                            </span>
                          </button>
                        </div>
                        <div className="col-span-3 flex justify-center relative">
                          <button
                            className={`text-lg ${
                              section.comments && section.comments.trim() !== ""
                                ? "text-green-600"
                                : "text-gray-400"
                            } hover:text-red-800 transition-colors`}
                            onClick={() => handleCommentClick(section.itDecId)}
                          >
                            <BiComment />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Section 80D/80DD/80DDB/80U */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mt-5">
              <h3 className="px-6 py-3 font-medium text-gray-700 bg-red-50 text-sm uppercase tracking-wide font-header">
                Section 80D / 80DD / 80DDB / 80U
              </h3>
              <div className="divide-y divide-gray-100">
                {allSectionName
                  ?.sort((a, b) => a.itDecId - b.itDecId)
                  ?.filter((section) =>
                    [7, 8, 10, 11, 15, 16, 17].includes(section.itDecId),
                  )
                  ?.map((section) => {
                    return (
                      <div
                        key={section.itDecId}
                        className="grid grid-cols-12 items-center px-6 py-3 hover:bg-gray-50 transition-colors relative"
                      >
                        <div className="col-span-5">
                          <div className="text-sm font-medium text-gray-800">
                            {section.description ||
                              section.declarationName ||
                              "Unknown Section"}
                          </div>
                          {section.additionalInformation && (
                            <div className="text-xs text-gray-500 mt-1">
                              {section.additionalInformation}
                            </div>
                          )}
                        </div>
                        <div className="col-span-2 text-center text-gray-700 font-medium">
                          {section?.revisedAmount
                            ? `₹${Number(section.revisedAmount).toLocaleString(
                                "en-IN",
                              )}`
                            : "-"}
                        </div>
                        <div className="col-span-2 flex justify-center items-center space-x-1 relative">
                          <button
                            className="text-red-600 hover:text-red-800 transition-colors flex items-center font-medium"
                            onClick={() => handleAttachClick(section.itDecId)}
                          >
                            <span className="text-gray-700 text-sm">
                              {fileCounts[section.itDecId] >= 1
                                ? fileCounts[section.itDecId]
                                : "-"}
                            </span>
                          </button>
                        </div>
                        <div className="col-span-3 flex justify-center relative">
                          <button
                            className={`text-lg ${
                              section.comments && section.comments.trim() !== ""
                                ? "text-green-600"
                                : "text-gray-400"
                            } hover:text-red-800 transition-colors`}
                            onClick={() => handleCommentClick(section.itDecId)}
                          >
                            <BiComment />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Section 80E/10/Housing Loan */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mt-5">
              <h3 className="px-6 py-3 font-medium text-gray-700 bg-red-50 text-sm uppercase tracking-wide font-header">
                Section 80E / 10 / Housing Loan
              </h3>
              <div className="divide-y divide-gray-100">
                {allSectionName
                  ?.sort((a, b) => a.itDecId - b.itDecId)
                  ?.filter((section) => [12, 13, 14].includes(section.itDecId))
                  ?.map((section) => {
                    return (
                      <div
                        key={section.itDecId}
                        className="grid grid-cols-12 items-center px-6 py-3 hover:bg-gray-50 transition-colors relative"
                      >
                        <div className="col-span-5">
                          <div className="text-sm font-medium text-gray-800">
                            {section.description ||
                              section.declarationName ||
                              "Unknown Section"}
                          </div>
                          {section.additionalInformation && (
                            <div className="text-xs text-gray-500 mt-1">
                              {section.additionalInformation}
                            </div>
                          )}
                        </div>
                        <div className="col-span-2 text-center text-gray-700 font-medium">
                          {section?.revisedAmount
                            ? `₹${Number(section.revisedAmount).toLocaleString(
                                "en-IN",
                              )}`
                            : "-"}
                        </div>
                        <div className="col-span-2 flex justify-center items-center space-x-1 relative">
                          <button
                            className="text-red-600 hover:text-red-800 transition-colors flex items-center font-medium"
                            onClick={() => handleAttachClick(section.itDecId)}
                          >
                            <span className="text-gray-700 text-sm">
                              {fileCounts[section.itDecId] >= 1
                                ? fileCounts[section.itDecId]
                                : "-"}
                            </span>
                          </button>
                        </div>
                        <div className="col-span-3 flex justify-center relative">
                          <button
                            className={`text-lg ${
                              section.comments && section.comments.trim() !== ""
                                ? "text-green-600"
                                : "text-gray-400"
                            } hover:text-red-800 transition-colors`}
                            onClick={() => handleCommentClick(section.itDecId)}
                          >
                            <BiComment />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Attachment Modal */}
        <Modal
          open={openAttachIndex !== null}
          onClose={() => setOpenAttachIndex(null)}
        >
          <Box sx={style}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 font-header">
                Uploaded Files
              </h3>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loadingFiles ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-6 h-6 border-2 border-red-200 border-t-red-600 rounded-full animate-spin mb-2"></div>
                  <p className="text-gray-500 text-sm">Loading files...</p>
                </div>
              ) : uploadedFiles.length > 0 ? (
                uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 px-3 text-gray-700 text-sm hover:bg-gray-50 rounded-md"
                  >
                    <span className="truncate max-w-[200px]">
                      {file.docCaption || `File ${index + 1}`}
                    </span>
                    <div className="relative">
                      {loadingFileIds[file.itDecDocId] ? (
                        <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                      ) : (
                        <AiOutlineEye
                          onClick={() => handleViewFile(file.itDecDocId)}
                          className="text-lg cursor-pointer text-red-600 hover:text-red-800 transition-colors"
                          title="View file"
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic py-4 text-center">
                  No files uploaded for this section
                </p>
              )}
            </div>

            <div className="flex justify-end mt-3">
              <button
                onClick={() => setOpenAttachIndex(null)}
                className="px-3 py-1 bg-[#ef4444] hover:bg-[#dc2626] text-white text-sm rounded transition-colors"
              >
                Close
              </button>
            </div>
          </Box>
        </Modal>

        {/* Comment Modal */}
        <Modal
          open={openCommentIndex !== null}
          onClose={() => setOpenCommentIndex(null)}
        >
          <Box sx={style}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 font-header">
                Comment
              </h3>
            </div>

            {comments[openCommentIndex] ||
            (openCommentIndex &&
              allSectionName.find((s) => s.itDecId === openCommentIndex)
                ?.comments) ? (
              <textarea
                readOnly
                rows={4}
                className="border border-gray-300 outline-none p-2 rounded w-full text-sm"
                value={
                  comments[openCommentIndex] ||
                  (openCommentIndex &&
                    allSectionName.find((s) => s.itDecId === openCommentIndex)
                      ?.comments) ||
                  ""
                }
              />
            ) : (
              <p className="text-gray-500 text-sm italic">No comment</p>
            )}

            <div className="flex justify-end mt-3">
              <button
                onClick={() => setOpenCommentIndex(null)}
                className="px-3 py-1 bg-[#ef4444] hover:bg-[#dc2626] text-white text-sm rounded transition-colors"
              >
                Close
              </button>
            </div>
          </Box>
        </Modal>

        {/* Revise Proof Modal */}
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
            setChecked(false); // Reset checkbox when modal closes
          }}
        >
          <Box sx={style}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 font-header">
                Revise Proof of Investment
              </h3>
              <ImCancelCircle
                className="text-red-600 cursor-pointer hover:text-red-800 transition-colors"
                onClick={() => setOpen(false)}
              />
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to withdraw the already submitted POI? You
              can revise your POI while the window is open.
            </p>

            <div className="flex items-center mb-6">
              <Checkbox
                checked={checked}
                onChange={handleChange}
                size="medium"
                sx={{
                  color: "#9ca3af",
                  "&.Mui-checked": {
                    color: "#ef4444",
                  },
                }}
              />
              <span className="text-sm font-medium text-gray-700">I agree</span>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 text-white rounded-md text-sm font-medium ${
                  checked
                    ? "bg-red-600 hover:bg-red-700 transition-colors"
                    : "bg-red-400 cursor-not-allowed"
                }`}
                onClick={handleSubmitFunction}
                disabled={!checked}
              >
                Revise
              </button>
            </div>
          </Box>
        </Modal>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Preview_Port_Of_Investment;
