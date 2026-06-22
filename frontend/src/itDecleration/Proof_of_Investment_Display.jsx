import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { TbCircleCheckFilled } from "react-icons/tb";
import { AiOutlineEye } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { simpleEncrypt } from "../simpleEncrypt";

import Service from "./Service";
import Header from "../components/Header";
import {
  useStoreFinancialYear,
  useStoreRegime,
  useStoreSubmitStatusRedirect,
} from "./useFileStore";
import { BASE_URL } from "../config/Config";

function Proof_of_Investment_Display() {
  const SECTION_80C_LIMIT = 150000;
  const SECTION_80CCD_LIMIT = 50000;
  const SECTION_MEDICLAIM_LIMIT = 25000;
  const SECTION_80DDB_LIMIT = 40000;
  const SECTION_HOUSING_LOAN_LIMIT = 200000;

  const SECTION_80C_IDS = [1, 2, 4, 5, 9, 18, 19, 20, 21, 22, 23];

  const SECTION_80CCD_ID = 7;
  const SECTION_MEDICLAIM_ID = 15;
  const SECTION_80DDB_ID = 10;
  const SECTION_HOUSING_LOAN_ID = 14;

  const parseAmt = (amt) => {
    if (amt === null || amt === undefined || amt === "") return 0;
    const n = Number(String(amt).replace(/,/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const location = useLocation();
  const proofInfo = location?.state?.data;
  const documentProfId = location?.state?.documentProfId;

  const empCode = localStorage.getItem("empId");
  const navigate = useNavigate();

  const { regime } = useStoreRegime();
  const { submitStatus } = useStoreSubmitStatusRedirect();
  const { submitFinancialYear } = useStoreFinancialYear();

  const [info, setInfo] = useState([]);
  const [master, setMaster] = useState([]);
  const [proof, setProof] = useState([]);
  const [allSectionName, setAllSectionName] = useState([]);
  const [currentYear, setCurrentYear] = useState(null);
  const [hasExistingRecords, setHasExistingRecords] = useState(false);

  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New state for file counts and attachment popup
  const [fileCounts, setFileCounts] = useState({});
  const [openAttachIndex, setOpenAttachIndex] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingFileIds, setLoadingFileIds] = useState({});

  // Debug log to check the proofInfo value
  console.log("proofInfo from location.state:", proofInfo);
  console.log("location.state:", location.state);
  console.log("documentProfId:", documentProfId);

  // fetch info
  const fetchInfo = () => {
    Service.fetchITDeclarationInfoBasedOnempCodeAndFinancialYear(
      empCode,
      submitFinancialYear,
    ).then((res) => setInfo(res?.data?.data || []));
  };

  const fetchMaster = () => {
    Service.fetchAllSectionName().then((res) =>
      setMaster(res?.data?.data || []),
    );
  };

  const fetchProofOfinvestment = () => {
    if (Number(submitFinancialYear?.split("-")[0]) === 2023) {
      Service.fetchProofOfInvestmentBasedOnempCodeAndFinancialYear(
        empCode,
        submitFinancialYear,
      ).then((res) => setProof(res?.data?.data || []));
    } else {
      Service.fetchNewProofOfInvestmentBasedOnempCodeAndFinancialYear(
        empCode,
        submitFinancialYear,
      ).then((res) => setProof(res?.data?.data || []));
    }
  };

  useEffect(() => {
    fetchInfo();
    fetchMaster();
    fetchProofOfinvestment();
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    fetchProofOfinvestment();
  }, [submitStatus]);

  // --- merge info + master + proof (and AUTO-FILL Actual from Declared) ---
  useEffect(() => {
    if (master.length === 0) {
      setAllSectionName([]);
      return;
    }

    // helper: blank out "-", null, etc.
    const norm = (v) => {
      if (v === null || v === undefined) return "";
      const s = String(v).trim();
      if (s === "-" || s.toLowerCase() === "na") return "";
      return s;
    };

    // Create a complete list of all possible sections from master
    const completeSectionList = master.map((masterItem) => {
      // Find matching item in info data
      const matchingInfo = info.find(
        (item) => Number(item.itDecId) === Number(masterItem.itDecId),
      );

      // Find matching item in proof data
      const matchingProof = proof.find(
        (item) => Number(item.itDecId) === Number(masterItem.itDecId),
      );

      // Determine which documentProfId to use
      let finalDocumentProfId = matchingProof?.documentProfId || null;

      // If we have a documentProfId from location.state and this is the matching item, use it
      const stateDocumentProfId = location.state?.documentProfId;
      if (
        (!finalDocumentProfId || finalDocumentProfId === "undefined") &&
        stateDocumentProfId &&
        stateDocumentProfId !== "empty" &&
        stateDocumentProfId !== "undefined" &&
        proofInfo &&
        Number(masterItem.itDecId) === Number(proofInfo?.itDecId)
      ) {
        finalDocumentProfId = stateDocumentProfId;
      }

      const declarationAmount = norm(matchingInfo?.declarationAmount);
      const revisedAmount =
        norm(matchingProof?.revisedAmount) || declarationAmount;
      const fileEntryId = matchingProof?.fileEntryId || "";

      return {
        ...masterItem,
        // Include info data if available
        ...(matchingInfo || {}),
        // Include proof data if available
        ...(matchingProof || {}),
        // Override with specific values
        documentProfId: finalDocumentProfId,
        declarationAmount,
        revisedAmount,
        fileEntryId,
        remarks: matchingProof?.remarks || null,
        landLordName: matchingProof?.landLordName || null,
        landLordPanNo: matchingProof?.landLordPanNo || null,
        additionalInformation:
          matchingProof?.additionalInformation ||
          matchingInfo?.additionalInformation ||
          null,
        hrSignaturePlace: matchingProof?.hrSignaturePlace || null,
        hrSignatureDate: matchingProof?.hrSignatureDate || null,
      };
    });

    console.log(
      "Merged data with documentProfId:",
      completeSectionList.map((item) => ({
        itDecId: item.itDecId,
        documentProfId: item.documentProfId,
        hasDocumentProfId: !!item.documentProfId,
        revisedAmount: item.revisedAmount,
      })),
    );

    // Check if we have any existing documentProfId values
    const hasRecords = completeSectionList.some(
      (item) => item.documentProfId && item.documentProfId !== "undefined",
    );

    setHasExistingRecords(hasRecords);

    // Also check if we have a documentProfId from location.state
    const stateDocumentProfId = location.state?.documentProfId;
    if (
      stateDocumentProfId &&
      stateDocumentProfId !== "empty" &&
      stateDocumentProfId !== "undefined"
    ) {
      setHasExistingRecords(true);
    }

    // Calculate file counts for each section
    const counts = {};
    completeSectionList.forEach((item) => {
      if (item.fileEntryId) {
        const fileIds = item.fileEntryId
          .split(",")
          .filter((id) => id.trim() !== "");
        counts[item.itDecId] = fileIds.length;
      } else {
        counts[item.itDecId] = 0;
      }
    });
    setFileCounts(counts);

    setAllSectionName(completeSectionList);
  }, [info, master, proof, location.state, proofInfo]);

  // revised amount change (sync both Actual + Declared)
  const handleChangeProofOfInvestment = (itDecId, value) => {
    // ❌ 80CCD Validation (Max 50,000)
    if (Number(itDecId) === SECTION_80CCD_ID) {
      if (Number(value) > SECTION_80CCD_LIMIT) {
        Swal.fire({
          icon: "warning",
          text: "Maximum deduction allowed is ₹50,000 under Section 80CCD.",
          width: "450px",
          confirmButtonColor: "#dc2626",
          backdrop: true,
          didOpen: () => {
            const swalContainer = document.querySelector(".swal2-container");
            if (swalContainer) swalContainer.style.zIndex = "99999";
          },
        });
        return;
      }
    }

    // ❌ Mediclaim Validation (Max 25,000)
    if (Number(itDecId) === SECTION_MEDICLAIM_ID) {
      if (Number(value) > SECTION_MEDICLAIM_LIMIT) {
        Swal.fire({
          icon: "warning",
          text:
            "Maximum deduction allowed is ₹25,000 for Mediclaim Premium (Self, Spouse & Child).",
          width: "500px",
          confirmButtonColor: "#dc2626",
          backdrop: true,
          didOpen: () => {
            const swalContainer = document.querySelector(".swal2-container");
            if (swalContainer) swalContainer.style.zIndex = "99999";
          },
        });
        return;
      }
    }

    // ❌ 80DDB Validation (Max 40,000)
    if (Number(itDecId) === SECTION_80DDB_ID) {
      if (Number(value) > SECTION_80DDB_LIMIT) {
        Swal.fire({
          icon: "warning",
          text: "Maximum deduction allowed is ₹40,000 under Section 80DDB.",
          width: "450px",
          confirmButtonColor: "#dc2626",
          backdrop: true,
          didOpen: () => {
            const swalContainer = document.querySelector(".swal2-container");
            if (swalContainer) swalContainer.style.zIndex = "99999";
          },
        });
        return;
      }
    }

    // ❌ Housing Loan Validation (Max 2,00,000)
    if (Number(itDecId) === SECTION_HOUSING_LOAN_ID) {
      if (Number(value) > SECTION_HOUSING_LOAN_LIMIT) {
        Swal.fire({
          icon: "warning",
          text: "Interest paid on Housing Loan cannot exceed ₹2,00,000",
          width: "450px",
          confirmButtonColor: "#dc2626",
          backdrop: true,
          didOpen: () => {
            const swalContainer = document.querySelector(".swal2-container");
            if (swalContainer) swalContainer.style.zIndex = "99999";
          },
        });
        return;
      }
    }

    // ❌ 80C Total Validation (Max 1,50,000)
    if (SECTION_80C_IDS.includes(Number(itDecId))) {
      const currentTotal = (allSectionName || [])
        .filter((s) => SECTION_80C_IDS.includes(Number(s.itDecId)))
        .reduce((total, s) => {
          if (Number(s.itDecId) === Number(itDecId)) {
            return total + parseAmt(value);
          }
          return total + parseAmt(s.revisedAmount);
        }, 0);

      if (currentTotal > SECTION_80C_LIMIT) {
        Swal.fire({
          icon: "warning",
          text: "Total Section 80C deduction cannot exceed ₹1,50,000",
          width: "450px",
          confirmButtonColor: "#dc2626",
          backdrop: true,
          didOpen: () => {
            const swalContainer = document.querySelector(".swal2-container");
            if (swalContainer) swalContainer.style.zIndex = "99999";
          },
        });
        return;
      }
    }

    // ✅ Update state after validation passed
    setAllSectionName((prev) =>
      prev.map((item) =>
        Number(item.itDecId) === Number(itDecId)
          ? {
              ...item,
              revisedAmount: value,
              declarationAmount: value, // keep sync
            }
          : item,
      ),
    );
  };

  // Handle attachment click to show uploaded files
  const fetchUploadedFiles = async (itDecId) => {
    setLoadingFiles(true);
    try {
      const employeeId = localStorage.getItem("empId");

      const response = await axios.get(
        `${BASE_URL}/it-declaration-file/files/${simpleEncrypt(
          employeeId,
        )}/${submitFinancialYear}/${itDecId}`,
      );

      setUploadedFiles(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching uploaded files:", error);

      // 👇 ADD THIS
      if (error.response?.status === 500) {
        setUploadedFiles([]);
      }
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleAttachClick = async (itDecId) => {
    setOpenAttachIndex(itDecId);
    await fetchUploadedFiles(itDecId);
  };

  const handleViewFile = async (itDecDocId) => {
    // Set loading state for this specific file
    setLoadingFileIds((prev) => ({ ...prev, [itDecDocId]: true }));

    try {
      const encryptedId = simpleEncrypt(itDecDocId);
      const response = await axios.post(
        `${BASE_URL}/it-declaration-file/download`,
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
      Swal.fire({
        icon: "error",
        text: "Failed to view file",
        width: "350px",
        timer: 2000,
        showConfirmButton: false,
        background: "#fef2f2",
      });
    } finally {
      // Clear loading state for this specific file
      setLoadingFileIds((prev) => ({ ...prev, [itDecDocId]: false }));
    }
  };

  const handleSaveProofOfInvestment = () => {
    const payload = allSectionName.map((item) => {
      const revised =
        item.revisedAmount !== null &&
        item.revisedAmount !== undefined &&
        item.revisedAmount !== ""
          ? Number(item.revisedAmount)
          : null;

      return {
        documentProfId: item.documentProfId || null,
        empCode: empCode,
        itDecId: item.itDecId,
        revisedAmount: revised,
        financialYear: submitFinancialYear,
        remarks: item.remarks || null,
        landLordName: item.landLordName || null,
        landLordPanNo: item.landLordPanNo || null,
        additionalInformation: item.additionalInformation || null,
        hrSignaturePlace: item.hrSignaturePlace || null,
        hrSignatureDate: item.hrSignatureDate || null,
      };
    });

    Service.postProofOfInvestment(payload)
      .then(() => {
        // 🔥 Always update declaration table
        const declarationSyncPayload = allSectionName.map((item) => ({
          ...item,
          declarationAmount:
            item.revisedAmount !== null &&
            item.revisedAmount !== undefined &&
            item.revisedAmount !== ""
              ? Number(item.revisedAmount)
              : null,
          empCode: empCode,
          financialYear: submitFinancialYear,
          taxRegime: regime === "Old Regime" ? 0 : 1,
        }));

        return Service.postSection80Data(declarationSyncPayload);
      })
      .then(() => {
        return Service.setStatusForProofOfInvestment(
          empCode,
          submitFinancialYear,
          true,
        );
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          text: "Saved",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/proof-of-investment-update");
      })
      .catch((error) => {
        console.error("Error after saving:", error);

        Swal.fire({
          icon: "error",
          text: "Something went wrong while saving",
          timer: 2500,
          showConfirmButton: false,
        });
      });
  };
  // update existing records
  const handleSaveRevisedProofOfInvestment = () => {
    if (!allSectionName || allSectionName.length === 0) {
      console.error("No records found for update.");
      return;
    }

    // Check if we have a valid documentProfId from location.state
    const stateDocumentProfId = location.state?.documentProfId;
    const useDocumentProfIdFromState =
      stateDocumentProfId &&
      stateDocumentProfId !== "empty" &&
      stateDocumentProfId !== "undefined";

    // Filter items that have documentProfId or can use the one from state
    const itemsToUpdate = allSectionName.filter((item) => {
      const hasOwnDocumentId =
        item.documentProfId && item.documentProfId !== "undefined";
      const canUseStateId =
        useDocumentProfIdFromState &&
        proofInfo &&
        item.itDecId === proofInfo.itDecId;

      return hasOwnDocumentId || canUseStateId;
    });

    if (itemsToUpdate.length === 0) {
      Swal.fire({
        icon: "error",
        text: "No valid records to update (missing document IDs)",
        width: "350px",
        timer: 3000,
      });
      return;
    }

    const updatedData = itemsToUpdate.map((item) => {
      // Determine which documentProfId to use
      let finalDocumentProfId = item.documentProfId;
      if (
        (!finalDocumentProfId || finalDocumentProfId === "undefined") &&
        useDocumentProfIdFromState &&
        proofInfo &&
        item.itDecId === proofInfo.itDecId
      ) {
        finalDocumentProfId = stateDocumentProfId;
      }

      return {
        documentProfId: finalDocumentProfId,
        empCode: empCode,
        itDecId: item.itDecId,
        revisedAmount:
          item.revisedAmount !== null && item.revisedAmount !== undefined
            ? Number(item.revisedAmount)
            : 0,
        financialYear: submitFinancialYear,
        remarks: item.remarks || null,
        landLordName: item.landLordName || null,
        landLordPanNo: item.landLordPanNo || null,
        additionalInformation: item.additionalInformation || null,
        hrSignaturePlace: item.hrSignaturePlace || null,
        hrSignatureDate: item.hrSignatureDate || null,
      };
    });

    console.log(
      "Payload for bulk update:",
      JSON.stringify(updatedData, null, 2),
    );

    axios
      .put(`${BASE_URL}/proof-of-investment/update-bulk`, updatedData)
      .then(() => {
        const declarationSyncPayload = allSectionName.map((item) => {
          // find existing declaration record from info API
          const existingDeclaration = info.find(
            (i) => Number(i.itDecId) === Number(item.itDecId),
          );

          return {
            itInfoId: existingDeclaration?.itInfoId || null, // ✅ update if exists, insert if not
            itDecId: item.itDecId,
            empCode: empCode,
            financialYear: submitFinancialYear,
            taxRegime: regime === "Old Regime" ? 0 : 1,
            declarationAmount:
              item.revisedAmount !== null &&
              item.revisedAmount !== undefined &&
              item.revisedAmount !== ""
                ? Number(item.revisedAmount)
                : null,
          };
        });

        return Service.postSection80Data(declarationSyncPayload);
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          text: `Updated record successfully`,
          width: "350px",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/proof-of-investment-update");
      })
      .catch((error) => {
        console.error(
          "Error updating proof of investment:",
          error.response?.data || error.message,
        );

        Swal.fire({
          icon: "error",
          text:
            "Update failed: " +
            (error.response?.data?.message || error.message),
          width: "350px",
          timer: 3000,
          showConfirmButton: false,
        });
      });
  };

  // file download
  const handleFileEntryId = (fileEntryId) => {
    const fileIds = fileEntryId?.split(",") || [fileEntryId];
    let requests = [];

    if (Number(submitFinancialYear?.split("-")[0]) === 2023) {
      requests = fileIds.map((id) =>
        axios.get(`${BASE_URL}:9023/documents/migration/access/0/${id}`, {
          responseType: "arraybuffer",
        }),
      );
    } else {
      requests = fileIds.map((id) =>
        axios.get(`${BASE_URL}:9023/documents/migration/access/${id}/0`, {
          responseType: "arraybuffer",
        }),
      );
    }

    Promise.allSettled(requests).then((results) => {
      setIsModalOpen(true);
      const successfulResponses = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value.data);
      const files = successfulResponses.map((data, index) => {
        const blob = new Blob([data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        return { id: index, url, fileId: fileIds[index] };
      });
      setFileList(files);
      setSelectedFile(files[0]); // Select first file by default
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setFileList([]);
  };

  const handleBack = () => window.history.back();

  console.log(
    "All Sections:",
    allSectionName.map((s) => ({
      id: s.itDecId,
      desc: s.description,
    })),
  );

  return (
    <div className="min-h-screen bg-gray-50 font-content">
      <Header />

      <div className="mt-20 bg-white rounded-lg shadow-sm p-6 w-full max-w-6xl mx-auto">
        {/* Header Row */}
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
            Edit
          </span>
        </div>
        {/* Regime */}
        <div className="flex justify-center mb-8">
          <div className="bg-red-50 border border-red-100 rounded-lg w-full max-w-md shadow-sm">
            <div className="flex items-center justify-center space-x-4 py-5">
              <TbCircleCheckFilled className="text-4xl text-green-600" />
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
            <div
              className={`grid ${
                hasExistingRecords ? "grid-cols-12" : "grid-cols-11"
              } bg-red-50 py-3 font-semibold text-sm text-gray-700 font-header`}
            >
              <div
                className={
                  hasExistingRecords ? "col-span-5 pl-6" : "col-span-5 pl-6"
                }
              >
                Particulars
              </div>
              <div
                className={
                  hasExistingRecords
                    ? "col-span-3 text-center"
                    : "col-span-3 text-center"
                }
              >
                Declared Amount
              </div>
              <div
                className={
                  hasExistingRecords
                    ? "col-span-3 text-center"
                    : "col-span-3 text-center"
                }
              >
                Actual Amount
              </div>
              {hasExistingRecords && (
                <div className="col-span-1 text-center">Files</div>
              )}
            </div>

            {/* ---- 80C ---- */}
            <div className="border-t border-gray-200">
              <h3 className="px-6 py-3 font-medium text-gray-700 bg-red-50 text-sm uppercase tracking-wide font-header">
                Deduction under section 80C
              </h3>
              <div className="divide-y divide-gray-100">
                {allSectionName
                  ?.filter((s) => SECTION_80C_IDS.includes(Number(s.itDecId)))
                  .map((section) => (
                    <Row
                      key={section.itDecId}
                      section={section}
                      hasExistingRecords={hasExistingRecords}
                      handleChangeProofOfInvestment={
                        handleChangeProofOfInvestment
                      }
                      handleFileEntryId={handleFileEntryId}
                      fileCounts={fileCounts}
                      handleAttachClick={handleAttachClick}
                      openAttachIndex={openAttachIndex}
                      setOpenAttachIndex={setOpenAttachIndex}
                      uploadedFiles={uploadedFiles}
                      loadingFiles={loadingFiles}
                      handleViewFile={handleViewFile}
                      loadingFileIds={loadingFileIds}
                    />
                  ))}
              </div>
            </div>

            {/* ---- 80D ---- */}
            <div className="border-t border-gray-200">
              <h3 className="px-6 py-3 font-medium text-gray-700 bg-red-50 text-sm uppercase tracking-wide font-header">
                Section 80D / 80DD / 80DDB / 80U
              </h3>
              <div className="divide-y divide-gray-100">
                {allSectionName
                  ?.filter((s) =>
                    [7, 8, 10, 11, 15, 16, 17].includes(Number(s.itDecId)),
                  )
                  .map((section) => (
                    <Row
                      key={section.itDecId}
                      section={section}
                      hasExistingRecords={hasExistingRecords}
                      handleChangeProofOfInvestment={
                        handleChangeProofOfInvestment
                      }
                      handleFileEntryId={handleFileEntryId}
                      fileCounts={fileCounts}
                      handleAttachClick={handleAttachClick}
                      openAttachIndex={openAttachIndex}
                      setOpenAttachIndex={setOpenAttachIndex}
                      uploadedFiles={uploadedFiles}
                      loadingFiles={loadingFiles}
                      handleViewFile={handleViewFile}
                      loadingFileIds={loadingFileIds}
                    />
                  ))}
              </div>
            </div>

            {/* ---- 80E ---- */}
            <div className="border-t border-gray-200">
              <h3 className="px-6 py-3 font-medium text-gray-700 bg-red-50 text-sm uppercase tracking-wide font-header">
                Section 80E / 10 / Housing Loan
              </h3>
              <div className="divide-y divide-gray-100">
                {allSectionName
                  ?.filter((s) => [12, 13, 14].includes(Number(s.itDecId)))
                  .map((section) => (
                    <Row
                      key={section.itDecId}
                      section={section}
                      hasExistingRecords={hasExistingRecords}
                      handleChangeProofOfInvestment={
                        handleChangeProofOfInvestment
                      }
                      handleFileEntryId={handleFileEntryId}
                      fileCounts={fileCounts}
                      handleAttachClick={handleAttachClick}
                      openAttachIndex={openAttachIndex}
                      setOpenAttachIndex={setOpenAttachIndex}
                      uploadedFiles={uploadedFiles}
                      loadingFiles={loadingFiles}
                      handleViewFile={handleViewFile}
                      loadingFileIds={loadingFileIds}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-5 border-t border-gray-200 w-full">
          <button
            onClick={() => navigate("/proof-of-investment-update")}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all font-medium font-content"
          >
            Cancel
          </button>
          <button
            onClick={
              hasExistingRecords
                ? handleSaveRevisedProofOfInvestment
                : handleSaveProofOfInvestment
            }
            className="px-5 py-2.5 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 transition-all font-medium font-content"
          >
            {hasExistingRecords ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* Modal for PDF viewing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 font-content">
          <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 font-header">
                {selectedFile?.name ||
                  `Attached Document ${selectedFile?.id + 1} of ${
                    fileList.length
                  }`}
              </h2>
              <div className="flex space-x-2">
                {fileList.length > 1 &&
                  fileList.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`px-3 py-1 text-sm rounded ${
                        selectedFile?.id === file.id
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {file.id + 1}
                    </button>
                  ))}
                <button
                  onClick={closeModal}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <iframe
              src={selectedFile?.url}
              width="100%"
              height="600px"
              title={selectedFile?.name || `PDF ${selectedFile?.id + 1}`}
              className="border border-gray-200 rounded"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ Row component
function Row({
  section,
  hasExistingRecords,
  handleChangeProofOfInvestment,
  handleFileEntryId,
  fileCounts,
  handleAttachClick,
  openAttachIndex,
  setOpenAttachIndex,
  uploadedFiles,
  loadingFiles,
  handleViewFile,
  loadingFileIds,
}) {
  // Format amount display - show "-" for 0 values
  const formatAmount = (amount) => {
    if (!amount || amount === "0" || amount === 0) return "-";
    return `₹${amount}`;
  };

  // Create a ref for the popup container
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (
      openAttachIndex === section.itDecId &&
      popupRef.current &&
      buttonRef.current
    ) {
      const popup = popupRef.current;
      const button = buttonRef.current;
      const buttonRect = button.getBoundingClientRect();

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const popupHeight = popup.offsetHeight;
      const popupWidth = popup.offsetWidth;

      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      // Reset previous positions
      popup.style.top = "";
      popup.style.bottom = "";
      popup.style.left = "";
      popup.style.right = "";

      // Vertical positioning
      if (spaceBelow >= popupHeight + 10) {
        popup.style.top = `${button.offsetHeight + 6}px`; // below
      } else if (spaceAbove >= popupHeight + 10) {
        popup.style.bottom = `${button.offsetHeight + 6}px`; // above
      } else {
        popup.style.top = `${button.offsetHeight + 6}px`;
        popup.style.maxHeight = `${spaceBelow - 10}px`;
        popup.style.overflowY = "auto";
      }

      // Horizontal positioning
      const spaceRight = viewportWidth - buttonRect.left;
      if (spaceRight < popupWidth) {
        popup.style.right = "0";
      } else {
        popup.style.left = "0";
      }
    }
  }, [openAttachIndex, section.itDecId]);

  return (
    <div
      className={`grid ${
        hasExistingRecords ? "grid-cols-12" : "grid-cols-11"
      } items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors w-full font-content`}
    >
      {/* Particulars */}
      <div className={hasExistingRecords ? "col-span-5" : "col-span-5"}>
        <div className="text-sm font-medium text-gray-800">
          {section?.description || "Unknown Section"}
        </div>
        {section.additionalInformation && (
          <p className="text-xs text-gray-500 mt-1">
            {section.additionalInformation}
          </p>
        )}
      </div>

      {/* Declared Amount (display only) */}
      <div
        className={
          hasExistingRecords
            ? "col-span-3 text-gray-700 text-sm font-medium text-center"
            : "col-span-3 text-gray-700 text-sm font-medium text-center"
        }
      >
        {formatAmount(section?.declarationAmount)}
      </div>

      {/* Actual Amount (editable & synced) */}
      <div
        className={
          hasExistingRecords
            ? "col-span-3 flex items-center justify-center w-full ml-4"
            : "col-span-3 flex items-center justify-center w-full ml-4"
        }
      >
        <div className="flex items-center w-full max-w-xs">
          <div className="flex items-center w-full">
            {/* INR section with joined right border */}
            <div className="px-3 py-2 bg-gray-50 text-gray-500 text-sm border border-gray-300 border-r-0 rounded-l-md">
              INR
            </div>
            {/* Input field with joined left border */}
            <input
              type="number"
              min="0"
              value={section?.declarationAmount  || ""}
              onChange={(e) =>
                handleChangeProofOfInvestment(section.itDecId, e.target.value)
              }
              className="w-full px-3 py-2 text-sm outline-none border border-gray-300 rounded-r-md font-content"
              placeholder="Enter amount"
            />
          </div>
        </div>
      </div>

      {/* Files column with count and popup - only show when hasExistingRecords is true */}
      {hasExistingRecords && (
        <div className="col-span-1 flex justify-center items-center space-x-1 relative ml-8">
          <button
            ref={buttonRef}
            className="text-red-600 hover:text-red-800 transition-colors flex items-center font-medium"
            onClick={() => handleAttachClick(section.itDecId)}
          >
            <span className="text-gray-700 text-sm">
              {fileCounts[section.itDecId] !== undefined
                ? fileCounts[section.itDecId] >= 1
                  ? fileCounts[section.itDecId]
                  : "-"
                : "Loading..."}
            </span>
          </button>

          {openAttachIndex === section.itDecId && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div
                ref={popupRef}
                className="bg-white border border-gray-200 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto"
              >
                <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                  <h4 className="text-gray-800 font-medium text-sm">
                    Uploaded Files
                  </h4>
                </div>

                <div className="p-2">
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

                <div className="flex justify-end p-3 border-t border-gray-200 bg-white">
                  <button
                    onClick={() => setOpenAttachIndex(null)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Proof_of_Investment_Display;
