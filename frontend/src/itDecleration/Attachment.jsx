import { Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { AiOutlineEye } from "react-icons/ai";
import {
  useFileStore,
  useStore,
  useStoreAttachmentStatusAfterSubmit,
  useStoreFinancialYear,
} from "./useFileStore";
import { BASE_URL } from "../config/Config";
import { simpleEncrypt } from "../simpleEncrypt";

function Attachment({ rowId, onClose, onFilesUpdated }) {
  const employeeId = localStorage.getItem("empId");
  const { submitFinancialYear } = useStoreFinancialYear();

  const { addItDecId } = useFileStore();
  const globalFiles = useFileStore((state) => state.files);
  const addFiles = useFileStore((state) => state.addFiles);
  const removeFile = useFileStore((state) => state.removeFile);

  const [flag, setFlag] = useState(true);
  const [sectionFiles, setSectionFiles] = useState([]);
  const [storedFiles, setStoredFiles] = useState([]);
  const [loadingFileId, setLoadingFileId] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ Filter files for this specific section
  useEffect(() => {
    const filteredFiles = globalFiles.filter((file) => file.itDecId === rowId);
    setSectionFiles(filteredFiles);
  }, [globalFiles, rowId]);

  // ✅ Fetch stored files from server
  const fetchStoredFiles = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}:9026/it-declaration-file/files/${simpleEncrypt(
          employeeId,
        )}/${submitFinancialYear}/${rowId}`,
      );
      setStoredFiles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching stored files:", error);
      showToast("Error fetching files", "error");
    }
  };

  useEffect(() => {
    fetchStoredFiles();
  }, [rowId]);

  const handleAddFiles = (e, rowId) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      name: file.name,
      file: file,
      itDecId: rowId,
    }));

    addFiles(newFiles);
    addItDecId(rowId);
  };

  const handleRemoveFile = (fileName) => {
    removeFile(fileName);
  };

  const {
    setAttachmentStatusAfterSubmit,
  } = useStoreAttachmentStatusAfterSubmit();
  const { submitFileStatus } = useStore();

  // Custom toast notification function
  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleSubmit = async () => {
    if (sectionFiles.length === 0) {
      return;
    }

    const formData = new FormData();
    sectionFiles.forEach((fileObj) => {
      formData.append("files", fileObj.file);
    });

    formData.append("itDecId", rowId);

    setAttachmentStatusAfterSubmit(false);

    try {
      await axios.post(
        `${BASE_URL}:9026/it-declaration-file/upload/${simpleEncrypt(
          employeeId,
        )}/${submitFinancialYear}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      // ✅ Remove files from local state
      sectionFiles.forEach((fileObj) => {
        removeFile(fileObj.name);
      });

      // ✅ Refresh stored files
      await fetchStoredFiles();

      // ✅ Notify parent component to update file counts
      if (onFilesUpdated) {
        onFilesUpdated();
      }

      // Show success toast notification
      showToast("Files uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      showToast("Failed to submit files", "error");
    }
  };

  const handleDeleteStoredFile = async (itDecDocId) => {
    try {
      await axios.delete(
        `${BASE_URL}:9026/it-declaration-file/delete/${simpleEncrypt(
          itDecDocId,
        )}/${submitFinancialYear}/${itDecDocId}`,
      );
      await fetchStoredFiles();

      // ✅ Notify parent component to update file counts
      if (onFilesUpdated) {
        onFilesUpdated();
      }

      // ✅ Show toast in RED instead of green
      showToast("File deleted successfully", "error");
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage =
        error.response?.status === 404
          ? "File not found or already deleted"
          : "Failed to delete file";
      showToast(errorMessage, "error");
    }
  };

  const handleOff = () => {
    setFlag(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (submitFileStatus === "true") {
      handleSubmit();
    }
  }, [submitFileStatus]);

  // ✅ View file in new browser tab (with loading)
  const handleViewFile = async (itDecDocId) => {
    setLoadingFileId(itDecDocId); // Show loader for this file
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
      showToast("Failed to view file", "error");
    } finally {
      setLoadingFileId(null); // Hide loader
    }
  };

  // ✅ Combine stored files and local files for display
  const allFiles = [
    ...storedFiles.map((file) => ({
      name: file.fileName,
      isStored: true,
      itDecDocId: file.itDecDocId,
      docCaption: file.docCaption,
    })),
    ...sectionFiles.map((file) => ({
      name: file.name,
      isStored: false,
    })),
  ];

  return (
    <div className="font-content">
      {/* Custom Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {flag && (
        <div className="w-full border-[1px] border-red-300 p-4 bg-red-50 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <div className="font-header text-xl font-semibold text-red-800">
              Attachments ({allFiles.length})
            </div>
          </div>

          <div className="border-b-2 border-red-200 mb-4"></div>

          <div className="mb-4 max-h-60 overflow-y-auto">
            {allFiles.length > 0 ? (
              allFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 mb-2 bg-white rounded border border-red-200"
                >
                  <span className="text-gray-700 flex items-center">
                    {file.name}
                    {file.isStored && (
                      <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        {file.docCaption}
                      </span>
                    )}
                  </span>
                  {!file.isStored ? (
                    <BsTrash
                      onClick={() => handleRemoveFile(file.name)}
                      className="text-lg cursor-pointer text-red-500 hover:text-red-700"
                    />
                  ) : (
                    <div className="flex space-x-3 items-center">
                      {loadingFileId === file.itDecDocId ? (
                        <CircularProgress size={18} sx={{ color: "#f69191" }} />
                      ) : (
                        <AiOutlineEye
                          onClick={() => handleViewFile(file.itDecDocId)}
                          className="text-xl cursor-pointer"
                          style={{ color: "#f69191" }}
                        />
                      )}
                      <BsTrash
                        onClick={() => handleDeleteStoredFile(file.itDecDocId)}
                        className="text-lg cursor-pointer text-red-500 hover:text-red-700"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No files attached yet</p>
            )}

            <Button
              component="label"
              variant="outlined"
              startIcon={<ImAttachment />}
              sx={{
                color: "#ef4444",
                borderColor: "#ef4444",
                marginTop: "10px",
                "&:hover": {
                  borderColor: "#dc2626",
                  backgroundColor: "#fef2f2",
                },
              }}
            >
              Add Files
              <input
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleAddFiles(e, rowId)}
                multiple
              />
            </Button>
          </div>

          <div className="mt-4">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ef4444",
                "&:hover": {
                  backgroundColor: "#dc2626",
                },
                "&:disabled": {
                  backgroundColor: "#fca5a5",
                },
              }}
              onClick={handleSubmit}
              disabled={sectionFiles.length === 0}
            >
              Submit All Files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attachment;
