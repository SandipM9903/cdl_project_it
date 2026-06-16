import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { BASE_URL } from "../config/Config";

function DocViewer() {
  const { docId } = useParams();
  const [fileUrl, setFileUrl] = useState("");
  const [contentType, setContentType] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isNavigated = location.state?.fromInternalNavigation || false;

  const backPage = () => {
    navigate("/claimdashboard");
  };

  useEffect(() => {
    const showFile = async () => {
      const urls = [
        `${BASE_URL}:9023/api/claims/viewClaimsDocument/${docId}`,
        `${BASE_URL}:9023/api/viewExitDocument/${docId}`,
      ];

      for (const url of urls) {
        try {
          const res = await axios.get(url, { responseType: "arraybuffer" });
          const type = res.headers["content-type"];
          const blob = new Blob([res.data], { type });
          const urlObj = URL.createObjectURL(blob);

          if (
            type.includes("pdf") ||
            type.includes("msword") ||
            type.includes("image/jpeg") ||
            type.includes("image/jpg") ||
            type.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
            type.includes("octet-stream")
          ) {
            setFileUrl(urlObj);
            setContentType(type);
            return;
          }
        } catch (err) {
          console.warn(`Error fetching from ${url}:`, err);
        }
      }

      alert("Failed to fetch document from all sources");
    };

    showFile();

    // Disable right-click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [docId]);

  const renderViewer = () => {
    if (!fileUrl) return null;

    if (contentType.includes("pdf")) {
      return (
        <iframe
          src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          title="Document Viewer"
          width="100%"
          height="1000px"
          style={{ border: "none" }}
        />
      );
    }

    if (contentType.includes("image/")) {
      return (
        <img
          src={fileUrl}
          alt="Document"
          className="mx-auto object-contain max-h-[1000px] w-full"
        />
      );
    }

    // Basic fallback for unsupported types (you could improve this)
    return (
      <p className="text-center text-red-600 font-semibold mt-10">
        This file type is not viewable here.
      </p>
    );
  };

  return (
    <div>
      {isNavigated && (
        <div className="flex justify-end mr-[30px] mt-4">
          <button
            className="p-[10px] bg-black text-white rounded hover:bg-gray-800"
            onClick={backPage}
          >
            Back
          </button>
        </div>
      )}

      <div className="mt-4">{renderViewer()}</div>

      <div className="h-[100px]"></div>
    </div>
  );
}

export default DocViewer;
