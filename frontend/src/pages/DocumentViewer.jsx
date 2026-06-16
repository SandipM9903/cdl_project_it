import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config/Config";

function DocumentViewer() {
  const [fileUrl, setFileUrl] = useState('');
  const [contentType, setContentType] = useState('');
  const { fileName, docName } = useParams();
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}:9023/documents/access/${fileName}`,
          { responseType: "arraybuffer" }
        );

        const type = response.headers["content-type"];
        setContentType(type);

        const blob = new Blob([response.data], { type });
        const url = URL.createObjectURL(blob);
        setFileUrl(url);
      } catch (error) {
        console.error("Failed to fetch document:", error);
        alert("Unable to load the document.");
      }
    };

    fetchDocument();

    // Disable right-click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [fileName, docName]);

  const handleBack = () => {
    window.history.back();
  };

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

    return (
      <p className="text-center text-red-600 font-semibold mt-10">
        Unsupported file format.
      </p>
    );
  };

  return (
    <div>
      <div className="flex justify-end mr-[30px] mt-4">
        <button
          className="p-2 px-4 bg-black text-white rounded hover:bg-gray-800"
          onClick={handleBack}
        >
          Back
        </button>
      </div>

      <div className="mt-4">{renderViewer()}</div>
      <div className="h-[100px]" />
    </div>
  );
}

export default DocumentViewer;

