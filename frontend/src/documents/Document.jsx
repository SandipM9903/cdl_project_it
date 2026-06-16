import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { toast } from "react-toastify";
import axios from "axios";
import { simpleEncrypt } from "../simpleEncrypt";
import {
  FaDownload,
  FaCheckCircle,
  FaFilePdf,
  FaTimes,
  FaEye,
  FaChevronRight,
  FaExclamationTriangle,
  FaSpinner,
  FaChevronLeft,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaFilter,
} from "react-icons/fa";

const Documents = () => {
  // Base URLs
  const BASE_URL = "http://43.205.24.208";
  const DOC_SERVICE_PORT = "9023";
  const ACK_SERVICE_PORT = "9027";


  const DOCUMENT_FETCH_URL = `${BASE_URL}:${DOC_SERVICE_PORT}/documents/fetch/my-documents`;
  const DOCUMENT_ACCESS_URL = `${BASE_URL}:${DOC_SERVICE_PORT}/documents/my-docs/access`;

  const ACK_EMPLOYEE_URL = `${BASE_URL}:${ACK_SERVICE_PORT}/api/document-ack/employee`;
  const ACK_SUBMIT_URL = `${BASE_URL}:${ACK_SERVICE_PORT}/api/document-ack`;

  const normalizeDocName = (name) => {
    if (!name) return "";
    return name
      .replace(".pdf", "")
      .replaceAll(" ", "_")
      .toUpperCase();
  };

  const hashCookieName = async (name) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(name);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const arrayBufferToBase64 = (buffer) => {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      bytes.forEach((b) => (binary += String.fromCharCode(b)));
      return btoa(binary);
    };
    return arrayBufferToBase64(hashBuffer)
      .replace(/=/g, "")
      .substring(0, 32);
  };

  const getCookieByName = (cookieName) => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(cookieName + "="));
    return match ? match.split("=")[1] : null;
  };

  const [encryptedEmpCode, setEncryptedEmpCode] = useState(null);

  const navigate = useNavigate();
  const empCode1 = localStorage.getItem("empId");

  const hasFetchedRef = useRef(false);

  const [acknowledgedDocs, setAcknowledgedDocs] = useState({});
  const [showViewer, setShowViewer] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeAckData, setEmployeeAckData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [yearFilter, setYearFilter] = useState("All");

  const [documents, setDocuments] = useState([]);

  const availableYears = useMemo(() => {
    const years = documents.map((doc) => doc.year);
    return ["All", ...Array.from(new Set(years))];
  }, [documents]);

  // Filter documents based on selected year
  const filteredDocuments = useMemo(() => {
    if (yearFilter === "All") {
      return documents;
    }
    return documents.filter((doc) => doc.year === yearFilter);
  }, [yearFilter, documents]);

  useEffect(() => {
    const loadEncryptedEmpCode = async () => {
      const hashedKey = await hashCookieName("emp_code");
      const cookieValue = getCookieByName(hashedKey);

      if (!cookieValue) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      setEncryptedEmpCode(cookieValue);
    };

    loadEncryptedEmpCode();
  }, [navigate]);

  useEffect(() => {
    console.log("DOCUMENTS STATE:", documents);
  }, [documents]);

  useEffect(() => {
    const storedEmpCode = localStorage.getItem("empId");

    if (!storedEmpCode) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    fetchEmployeeAcknowledgmentData(storedEmpCode);
    fetchMyDocuments(storedEmpCode);
  }, [navigate]);

  const fetchEmployeeAcknowledgmentData = async (empCode) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${ACK_EMPLOYEE_URL}/${simpleEncrypt(
          empCode,
        )}`,
      );
      console.log("API RESPONSE DATA:", response.data);
      if (response.data && Array.isArray(response.data)) {
        setEmployeeAckData(response.data);

        const ackMap = {};
        response.data.forEach((item) => {
          if (item.ackStatus === "ACKNOWLEDGED") {
            const key = normalizeDocName(item.documentName);
            ackMap[key] = true;
          }
        });

        setAcknowledgedDocs(ackMap);
        console.log("ACK MAP CREATED:", ackMap);
      }
    } catch (error) {
      console.error("Error fetching acknowledgment data:", error);
      if (error.response && error.response.status !== 404) {
        toast.error("Failed to load document status. Please refresh.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const extractYearFromFileName = (fileName) => {
    if (!fileName) return "NA";

    const match = fileName.match(/(19|20)\d{2}/);
    return match ? match[0] : "NA";
  };

  const fetchMyDocuments = async (empCode) => {
    console.log("fetchMyDocuments called with empCode:", empCode);

    try {
      const response = await axios.get(DOCUMENT_FETCH_URL,
        {
          params: {
            empCode: simpleEncrypt(empCode),
          },
          validateStatus: () => true,
        },
      );

      console.log("HTTP STATUS:", response.status);
      console.log("Response is CMG ::::", response.data);

      if (response.status !== 200) {
        toast.error("Server error while loading documents");
        setDocuments([]);
        return;
      }

      if (!Array.isArray(response.data)) {
        console.warn("Unexpected response format:", response.data);
        setDocuments([]);
        return;
      }

      const mappedDocs = response.data.map((doc) => {
        const fileName = doc.itemName ?? "Unknown Document";
        const year = extractYearFromFileName(fileName);

        return {
          docId: doc.docId,
          type: fileName,
          year: year,
          apiName: normalizeDocName(fileName),
        };
      });

      setDocuments(mappedDocs);
    } catch (error) {
      console.error("Unexpected error fetching documents:", error);
      toast.error("Unable to connect to server");
      setDocuments([]);
    }
  };

  const submitAcknowledgment = async () => {
    const empCode = localStorage.getItem("empId");

    if (!empCode) {
      toast.error("Employee session not found. Please login again.");
      return false;
    }

    const payload = {
      documentName: normalizeDocName(currentDocument.type),
      empCode: empCode,
    };

    try {
      await axios.post(ACK_SUBMIT_URL, payload);

      setAcknowledgedDocs((prev) => ({
        ...prev,
        [currentDocument.apiName]: true,
      }));

      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit acknowledgment. Please try again.");
      return false;
    }
  };

  const isDocumentAcknowledged = (doc) => {
    const key = normalizeDocName(doc.apiName);
    return !!acknowledgedDocs[key];
  };

  const buildSecureViewUrl = async (doc) => {
    if (!empCode1) {
      throw new Error("Missing employee session");
    }

    const docId = doc.docId.toString();

    return (
      `${DOCUMENT_ACCESS_URL}` +
      `?docId=${simpleEncrypt(docId)}` +
      `&empCode=${simpleEncrypt(empCode1)}`
    );
  };

  const handleSecureView = async (doc) => {
    try {
      const newTab = window.open("", "_blank");
      if (!newTab) {
        toast.error("Popup blocked. Please allow popups.");
        return;
      }

      const url = await buildSecureViewUrl(doc);
      newTab.location.href = url;
    } catch (err) {
      console.error(err);
      toast.error("Unable to open document");
    }
  };

  const handleAcknowledgeClick = async (doc) => {
    if (isDocumentAcknowledged(doc)) {
      handleSecureView(doc);
      return;
    }

    try {
      const secureViewUrl = await buildSecureViewUrl(doc);

      setCurrentDocument({
        ...doc,
        secureViewUrl,
      });

      setIsChecked(false);
      setIframeLoaded(false);
      setShowViewer(true);
    } catch (err) {
      toast.error("Unable to load document");
    }
  };

  const handleProceed = () => {
    if (!isChecked) {
      toast.error("Please confirm acknowledgment before proceeding");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleAcknowledgeSubmit = async () => {
    if (!isChecked) {
      toast.error("Please confirm acknowledgment before submitting");
      return;
    }

    const success = await submitAcknowledgment();

    if (!success) return;

    setShowViewer(false);
    setShowConfirmModal(false);
    setCurrentDocument(null);
    setIsChecked(false);

    toast.success("Document acknowledged successfully");
  };

  const handleCancelAcknowledge = () => {
    setShowViewer(false);
    setCurrentDocument(null);
    setIsChecked(false);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmModal(false);
  };

  // Pagination calculations for filtered documents
  const totalDocuments = filteredDocuments.length;
  const totalPages = Math.ceil(totalDocuments / rowsPerPage);

  const indexOfLastDocument = currentPage * rowsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - rowsPerPage;
  const currentDocuments = filteredDocuments.slice(
    indexOfFirstDocument,
    indexOfLastDocument,
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (e) => {
    const newRowsPerPage = parseInt(e.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2),
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [yearFilter]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  const displayDocName = (name) => {
    if (!name) return "";
    return name.replace(/\.pdf\.enc$/i, "").replace(/\.pdf$/i, "");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* PDF Viewer Modal */}
      {showViewer && currentDocument && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-bold font-header">
                {currentDocument.type}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    window.open(currentDocument.secureViewUrl, "_blank")
                  }
                  className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-content"
                >
                  <FaEye className="inline mr-2" />
                  Open in New Tab
                </button>
                <button onClick={handleCancelAcknowledge}>
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 flex-1 overflow-hidden">
              {/* PDF */}
              <div className="col-span-9 p-4">
                <div className="h-full border rounded-lg overflow-hidden bg-white">
                  {!iframeLoaded && (
                    <div className="h-full flex items-center justify-center text-gray-500 font-content">
                      Loading document...
                    </div>
                  )}
                  <iframe
                    src={currentDocument.secureViewUrl}
                    className="w-full h-full"
                    onLoad={() => setIframeLoaded(true)}
                    title="PDF Viewer"
                  />
                </div>
              </div>

              {/* Acknowledgment Panel */}
              <div className="col-span-3 border-l p-6 flex flex-col overflow-y-auto">
                <h3 className="text-lg font-semibold mb-2 font-header">
                  Document Acknowledgment
                </h3>
                <p className="text-sm text-gray-600 mb-6 font-content">
                  Please review the document before proceeding.
                </p>

                {/* Checkbox */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <label className="flex gap-3 cursor-pointer text-red-600 font-content">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="mt-1 accent-red-600"
                    />
                    <span className="text-sm">
                      I confirm that I have read and understood the document.
                    </span>
                  </label>

                  {/* Button to open confirmation modal */}
                  <button
                    onClick={handleProceed}
                    disabled={!isChecked}
                    className={`mt-4 w-full py-2 rounded-lg text-sm font-semibold transition-colors font-content ${
                      isChecked
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue to Acknowledge
                  </button>
                </div>

                {/* Info Note */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700 font-content">
                    <FaExclamationTriangle className="inline mr-1" />
                    After clicking "Continue to Acknowledge", you will be asked
                    to confirm your acknowledgment in a separate window.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal Pop-up */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[60] bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaExclamationTriangle className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 font-header">
                  Confirm Acknowledgment
                </h2>
              </div>
              <button
                onClick={handleCancelConfirmation}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {currentDocument && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <FaFilePdf className="text-red-600" />
                    <div>
                      <p className="font-semibold text-gray-900 font-header">
                        {currentDocument.type}
                      </p>
                      <p className="text-sm text-gray-600 font-content">
                        Year: {currentDocument.year}
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="text-red-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-800 mb-1 font-header">
                          Important Notice
                        </p>
                        <p className="text-sm text-red-700 font-content">
                          By confirming this acknowledgment, you legally accept
                          and agree to the terms in this document. This action
                          is permanent and cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-sm font-medium text-gray-700 font-header">
                      Please verify the following:
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-content">
                      <FaCheckCircle className="text-green-600" />
                      <span>I have thoroughly read the document</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-content">
                      <FaCheckCircle className="text-green-600" />
                      <span>I understand all terms and conditions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-content">
                      <FaCheckCircle className="text-green-600" />
                      <span>I accept this document as binding</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAcknowledgeSubmit}
                  className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-content"
                >
                  <FaCheckCircle />
                  Yes, I Confirm My Acknowledgment
                </button>

                <button
                  onClick={handleCancelConfirmation}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors font-content"
                >
                  No, Take Me Back
                </button>

                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    window.open(currentDocument?.filePath, "_blank");
                  }}
                  className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors font-content"
                >
                  I want to review the document again before confirming
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-gray-50">
              <p className="text-xs text-gray-500 text-center font-content">
                Once confirmed, this acknowledgment will be recorded in your
                employment record.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN PAGE */}
      <main className="pt-20 px-6 pb-10 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex-1 mt-4">
          <div className="flex items-center text-sm">
            <span
              onClick={() => navigate("/dashboard")}
              className="
                cursor-pointer
                text-gray-700
                font-medium
                transition-all
                duration-200
                hover:text-[#dc2626]
                hover:underline
                hover:underline-offset-4
                font-content
              "
            >
              Home
            </span>

            <span className="mx-2 text-gray-400">/</span>

            <span
              className="
                font-semibold
                text-[#dc2626]
                cursor-default
                transition-all
                duration-200
                hover:underline
                hover:underline-offset-4
                font-header
              "
            >
              Document
            </span>
          </div>
        </div>

        <div className="mb-8 mt-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-header">
            Employee Documents
          </h1>
          <p className="text-gray-600 font-content">
            Review and acknowledge your employment documents
          </p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 flex flex-col items-center justify-center">
            <FaSpinner className="animate-spin text-4xl text-red-600 mb-4" />
            <p className="text-gray-600 font-content">
              Loading document status...
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-gray-800 font-header">
                      Available Documents
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 font-content">
                      Click 'Acknowledge' to review and confirm each document
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Year Filter */}
                    <div className="flex items-center gap-2">
                      <FaFilter className="text-gray-500" />
                      <span className="text-sm text-gray-600 font-content">
                        Filter by Year:
                      </span>
                      <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-content min-w-[120px]"
                      >
                        {availableYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rows per page selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-content">
                        Show:
                      </span>
                      <select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-content"
                      >
                        <option value={5}>5 rows</option>
                        <option value={10}>10 rows</option>
                        <option value={15}>15 rows</option>
                        <option value={20}>20 rows</option>
                        <option value={totalDocuments}>All rows</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {filteredDocuments.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 font-content">
                    No documents found for the selected year "{yearFilter}".
                  </p>
                  <button
                    onClick={() => setYearFilter("All")}
                    className="mt-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium font-content"
                  >
                    Clear filter
                  </button>
                </div>
              ) : (
                <>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="px-16 py-4 text-left font-semibold font-header">
                          Document Name
                        </th>

                        <th className="px-6 py-4 text-center font-semibold font-header">
                          Year
                        </th>
                        <th className="px-6 py-4 text-center font-semibold font-header">
                          Download
                        </th>
                        <th className="px-6 py-4 text-center font-semibold font-header">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDocuments.map((doc) => {
                        const acknowledged = isDocumentAcknowledged(doc);

                        return (
                          <tr
                            key={`${doc.type}_${doc.year}`}
                            className="border-t hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 text-left">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-lg">
                                  <FaFilePdf className="text-red-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 font-header">
                                    {displayDocName(doc.type)}
                                  </p>
                                  <p className="text-xs text-gray-500 font-content">
                                    PDF Document
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium font-content">
                                {doc.year}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleSecureView(doc)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-content"
                              >
                                <FaDownload />
                                Download
                              </button>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {acknowledged ? (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-content">
                                  <FaCheckCircle className="text-green-600" />
                                  <span className="font-medium">
                                    Acknowledged
                                  </span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAcknowledgeClick(doc)}
                                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm hover:shadow font-content"
                                >
                                  <FaCheckCircle />
                                  Acknowledge
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {totalDocuments > 0 && (
                    <div className="px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-sm text-gray-600 font-content">
                        Showing{" "}
                        <span className="font-semibold">
                          {Math.min(indexOfFirstDocument + 1, totalDocuments)}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold">
                          {Math.min(indexOfLastDocument, totalDocuments)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">{totalDocuments}</span>{" "}
                        documents
                        {yearFilter !== "All" && (
                          <span className="ml-2 text-red-600">
                            (Filtered by: {yearFilter})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* First Page */}
                        <button
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-lg ${
                            currentPage === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <FaAngleDoubleLeft />
                        </button>

                        {/* Previous Page */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-lg ${
                            currentPage === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <FaChevronLeft />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                          {getPageNumbers().map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium ${
                                currentPage === page
                                  ? "bg-red-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        {/* Next Page */}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-lg ${
                            currentPage === totalPages
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <FaChevronRight />
                        </button>

                        {/* Last Page */}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-lg ${
                            currentPage === totalPages
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <FaAngleDoubleRight />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-content">
                          Go to page:
                        </span>
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={currentPage}
                          onChange={(e) => {
                            const page = parseInt(e.target.value);
                            if (page >= 1 && page <= totalPages) {
                              handlePageChange(page);
                            }
                          }}
                          className="w-16 border rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-content"
                        />
                        <span className="text-sm text-gray-600 font-content">
                          of {totalPages}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Filter Summary */}
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-500" />
                  <span className="text-sm text-gray-700 font-content">
                    Currently viewing:{" "}
                    <span className="font-semibold">
                      {yearFilter === "All"
                        ? "All years"
                        : `Year: ${yearFilter}`}
                    </span>
                  </span>
                  {yearFilter !== "All" && (
                    <button
                      onClick={() => setYearFilter("All")}
                      className="ml-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-content"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
                <div className="text-sm text-gray-600 font-content">
                  <span className="font-semibold">{totalDocuments}</span>{" "}
                  document{totalDocuments !== 1 ? "s" : ""} found
                </div>
              </div>
            </div>
            <div className="sm:hidden bg-white rounded-xl shadow-sm border p-4 mb-6">
              <div className="text-center text-sm text-gray-600 font-content">
                Page <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span> •{" "}
                <span className="font-semibold">{totalDocuments}</span> total
                documents
                {yearFilter !== "All" && (
                  <div className="mt-2">
                    <span className="text-red-600">
                      Filtered by: {yearFilter}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Documents;