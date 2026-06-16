import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { BASE_URL } from "../config/Config";

function ExitDocViewer() {
  const { docId } = useParams();
  const [fileUrl, setFileUrl] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isNavigated = location.state?.fromInternalNavigation || false;

  const backPage = () => {
    navigate("/claimdashboard");
  };

  useEffect(() => {
    const showFile = async () => {
      const url = `${BASE_URL}:9029/api/eSeparation/viewExitDocument/${docId}`;
      try {
        const res = await axios.get(url, { responseType: "arraybuffer" });
        const contentType = res.headers["content-type"];
        const blob = new Blob([res.data], { type: contentType });
        const fileUrl = URL.createObjectURL(blob);

        if (
          contentType.includes("pdf") || 
          contentType.includes("msword") || 
          contentType.includes("jpeg") || 
          contentType.includes("jpg") || 
          contentType.includes("octet-stream") ||
          contentType.includes("spreadsheetml")
        ) {
          setFileUrl(fileUrl);
        } else {
          alert("Unsupported file format");
        }
      } catch (err) {
        console.warn(`Error fetching from ${url}:`, err);
        alert("Failed to fetch document.");
      }
    };

    showFile();
  }, [docId]);

  return (
    <div>
      {isNavigated && (
        <div className="flex justify-end mr-[30px]">
          <button className="p-[10px] bg-black text-white" onClick={backPage}>
            Back
          </button>
        </div>
      )}

      <div>
        {fileUrl && (
          <embed
            className="object-contain mx-auto"
            src={fileUrl}
            width="1000"
            height="1120"
          />
        )}
        <div className="h-[100px]"></div>
      </div>
    </div>
  );
}

export default ExitDocViewer;
