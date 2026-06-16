import React, { useState, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import { BASE_URL } from "../config/Config";
import { useNavigate } from "react-router-dom";

const UploadPayslipForm16 = () => {
  const navigate = useNavigate();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2,
  ];

  const isFormValid = () => {
    if (!category) return false;
    if (files.length === 0) return false;

    if (category === "root-payslip") {
      if (!month || !year) return false;
    }

    if (category === "root-form_16") {
      if (!financialYear || !year) return false;
    }

    if (category === "root-my_documents") {
      if (!year) return false;
    }

    return true;
  };

  const [files, setFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [category, setCategory] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState({ success: [], failed: [] });
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const fileInputRef = useRef(null);
  const [retrying, setRetrying] = useState(false);

  const getFinancialYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = -1; i <= 2; i++) {
      const fyStart = currentYear + i;
      const fyEnd = fyStart + 1;
      years.push(`${fyStart}-${fyEnd}`);
    }
    return years;
  };

  const handleFilesSelected = (selected) => {
    const selectedArr = Array.from(selected);
    setFiles(selectedArr);
    setAllFiles(selectedArr);
    setStatus({ success: [], failed: [] });
    setProgress(0);
    setUploadComplete(false);
  };

  const handleFileChange = (e) => handleFilesSelected(e.target.files);
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.length) handleFilesSelected(e.dataTransfer.files);
  };

  const extractName = (entry) => {
    if (!entry) return "";
    if (typeof entry === "string") return entry.split(" - ")[0];
    return String(entry);
  };

  const addUniqueSuccess = (prevSuccessArr, newlySuccessArr) => {
    const seen = new Set(prevSuccessArr.map(extractName));
    const combined = [...prevSuccessArr];
    newlySuccessArr.forEach((name) => {
      if (!seen.has(name)) {
        combined.push(name);
        seen.add(name);
      }
    });
    return combined;
  };

  const addUniqueFailed = (prevFailedArr, newlyFailedArr) => {
    const seen = new Set(prevFailedArr.map(extractName));
    const combined = [...prevFailedArr];
    newlyFailedArr.forEach((entry) => {
      const nm = extractName(entry);
      if (!seen.has(nm)) {
        combined.push(entry);
        seen.add(nm);
      }
    });
    return combined;
  };
  // ---------------------------------------

  const handleUpload = async (customFiles = files) => {
    if (
      !year ||
      (!financialYear && category === "root-form_16") ||
      (!month && category === "root-payslip") ||
      customFiles.length === 0
    ) {
      alert("Please select all required fields and upload at least one file.");
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    customFiles.forEach((file) => formData.append("files", file));
    formData.append("category", category);
    formData.append("year", year);
    if (category === "root-payslip") formData.append("month", month);
    if (category === "root-form_16")
      formData.append("financialYear", financialYear);
    formData.append("passwordProtected", isPasswordProtected);

    try {
      const res = await axios.post(
        `${BASE_URL}:9023/documents/bulk/upload-all`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (evt) => {
            if (evt.total)
              setProgress(Math.round((evt.loaded * 100) / evt.total));
          },
        },
      );

      const data = res.data || {};
      const newlySuccess = (data.success || []).map((s) => s.fileName);
      const newlyFailedFromResp = (data.failed || []).map(
        (f) => `${f.fileName} - Failed Reason: ${f.failedReason || "Unknown"}`,
      );

      setStatus((prev) => {
        const failedAfterRemovingSuccess = prev.failed.filter((item) => {
          const cleanName = extractName(item);
          return !newlySuccess.includes(cleanName);
        });

        const updatedSuccess = addUniqueSuccess(prev.success, newlySuccess);

        const updatedFailed = addUniqueFailed(
          failedAfterRemovingSuccess,
          newlyFailedFromResp,
        );

        return { success: updatedSuccess, failed: updatedFailed };
      });
    } catch (err) {
      console.error("Upload error", err);

      const reasonFromErr =
        err?.response?.data?.message || err?.message || "Upload Failed";
      const newFailedEntries = customFiles.map(
        (f) => `${f.name} - Failed Reason: ${reasonFromErr}`,
      );

      setStatus((prev) => {
        const updatedFailed = addUniqueFailed(prev.failed, newFailedEntries);
        return {
          ...prev,
          failed: updatedFailed,
        };
      });
    } finally {
      setUploading(false);
      setUploadComplete(true);
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRetryFailed = () => {
    const failedFileNames = status.failed.map((item) => item.split(" - ")[0]);

    const failedFiles = allFiles.filter((f) =>
      failedFileNames.includes(f.name),
    );

    if (failedFiles.length === 0) return;

    setRetrying(true);
    handleUpload(failedFiles).finally(() => {
      setRetrying(false);
    });
  };

  const handleRetrySingle = (fileName) => {
    const cleanName = fileName.split(" - ")[0];

    const fileToRetry = allFiles.find((f) => f.name === cleanName);

    if (fileToRetry) {
      setRetrying(true);

      handleUpload([fileToRetry]).finally(() => {
        setRetrying(false);
      });
    }
  };

  const handleNewUpload = () => {
    setMonth("");
    setYear("");
    setFinancialYear("");
    setCategory("");
    setFiles([]);
    setAllFiles([]);
    setStatus({ success: [], failed: [] });
    setProgress(0);
    setIsPasswordProtected(false);
    setUploadComplete(false);
    setSelectedStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteFailedItem = (fileName) => {
    const cleanName = fileName.split(" - ")[0];

    setStatus((prev) => ({
      ...prev,
      failed: prev.failed.filter((item) => item.split(" - ")[0] !== cleanName),
    }));

    setAllFiles((prev) => prev.filter((file) => file.name !== cleanName));
  };

  const successCount = status.success.length;
  const failedCount = status.failed.length;
  const totalCount = allFiles.length;
  const successPercent = totalCount
    ? Math.round((successCount / totalCount) * 100)
    : 0;
  const failPercent = totalCount
    ? Math.round((failedCount / totalCount) * 100)
    : 0;

  return (
    <>
      <Header />

      <div className="flex-1 ml-10 mt-24">
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
            Upload Document
          </span>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-6 font-sans mt-4 h-screen">
        <h2 className="text-2xl font-bold mb-4">
          📁 PaySlip / Form16 / My Documents Upload
        </h2>

        {!uploadComplete && (
          <>
            <div className="bg-gray-100 p-6 rounded-lg shadow mb-4 space-y-4">
              <div>
                <label className="block font-semibold mb-1">
                  Category: <span className="text-red-600">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border rounded px-3 py-2 cursor-pointer"
                >
                  <option value="">Select Category</option>
                  <option value="root-payslip">Payslip</option>
                  <option value="root-form_16">Form 16</option>
                  <option value="root-my_documents">My Documents</option>
                </select>
              </div>

              {category === "root-payslip" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">
                      Month: <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border cursor-pointer bg-white hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm hover:shadow transition-all duration-200"
                    >
                      <option value="">Select Month</option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Year: <span className="text-red-600">*</span>
                    </label>

                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full border rounded px-3 py-2 cursor-pointer"
                    >
                      <option value="">Select Year</option>
                      {yearOptions.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {category === "root-form_16" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">
                      Financial Year: <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={financialYear}
                      onChange={(e) => setFinancialYear(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Financial Year</option>
                      {getFinancialYears().map((fy) => (
                        <option key={fy} value={fy}>
                          {fy}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Year: <span className="text-red-600">*</span>
                    </label>

                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full border rounded px-3 py-2 cursor-pointer"
                    >
                      <option value="">Select Year</option>
                      {yearOptions.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {category === "root-my_documents" && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">
                      Year: <span className="text-red-600">*</span>
                    </label>

                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full border rounded px-3 py-2 cursor-pointer"
                    >
                      <option value="">Select Year</option>
                      {yearOptions.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-6 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isPasswordProtected}
                    onChange={(e) => setIsPasswordProtected(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span>Password Protected</span>
                </label>
              </div>
            </div>

            <div
              className="bg-gray-200 border-2 border-dashed border-gray-400 p-8 rounded-lg text-center cursor-pointer mb-4"
              onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <p className="font-semibold mb-1">
                Upload PDF Files <span className="text-red-600">*</span>
              </p>
              <p>Drag & drop files here or click to select</p>
              <p className="text-sm text-gray-600 mt-1">
                {files.length} file(s) selected
              </p>
              <input
                type="file"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>

            <button
              onClick={() => handleUpload(files)}
              disabled={uploading || !isFormValid()}
              className={`bg-blue-600 text-white font-bold py-2 px-6 rounded
${uploading || !isFormValid() ? "opacity-50 cursor-not-allowed" : ""}
`}
            >
              {uploading ? `Uploading... ${progress}%` : "Start Upload"}
            </button>
          </>
        )}

        {(uploading || uploadComplete) && (
          <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
            <h4 className="font-semibold mb-2">📊 Upload Summary</h4>
            <div className="relative w-full h-6 bg-gray-300 rounded overflow-hidden mb-2">
              <div
                className="absolute top-0 left-0 h-full bg-green-500"
                style={{ width: `${successPercent}%` }}
              />
              <div
                className="absolute top-0 h-full bg-red-500"
                style={{ width: `${failPercent}%`, left: `${successPercent}%` }}
              />
              <div className="absolute inset-0 flex justify-center items-center text-xs font-bold text-white">
                ✅ {successPercent}% | ❌ {failPercent}%
              </div>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span
                onClick={() =>
                  setSelectedStatus(
                    selectedStatus === "success" ? null : "success",
                  )
                }
                className="text-green-600 cursor-pointer"
              >
                ✅ Success: {successCount}
              </span>
              <span
                onClick={() =>
                  setSelectedStatus(
                    selectedStatus === "failed" ? null : "failed",
                  )
                }
                className="text-red-600 cursor-pointer"
              >
                ❌ Failed: {failedCount}
              </span>
              <span>📄 Total: {totalCount}</span>
            </div>
          </div>
        )}

        {uploadComplete && (
          <div className="mt-4 flex space-x-3">
            <button
              disabled={retrying}
              onClick={handleNewUpload}
              className="bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              New Upload
            </button>
            {failedCount > 0 && (
              <button
                disabled={retrying}
                onClick={handleRetryFailed}
                className="bg-orange-600 text-white font-bold py-2 px-4 rounded"
              >
                🔄 Retry Failed
              </button>
            )}
          </div>
        )}

        {selectedStatus && (
          <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
            <h4 className="font-semibold mb-2">
              {selectedStatus === "success"
                ? "✅ Successful Files"
                : "❌ Failed Files"}
            </h4>
            <ul className="divide-y divide-gray-300">
              {(selectedStatus === "success"
                ? status.success
                : status.failed
              ).map((name) => (
                <li
                  key={name}
                  className="py-2 flex justify-between items-center"
                >
                  <span>{name}</span>
                  {selectedStatus === "failed" &&
                    (name.includes("Document Already Exists") ? (
                      <button
                        disabled={retrying}
                        onClick={() => handleDeleteFailedItem(name)}
                        className="bg-red-600 text-white text-xs px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        disabled={retrying}
                        onClick={() => handleRetrySingle(name)}
                        className="bg-blue-600 text-white text-xs px-3 py-1 rounded"
                      >
                        Retry
                      </button>
                    ))}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadPayslipForm16;
