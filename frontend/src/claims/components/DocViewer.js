import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { BASE_URL } from "../../config/Config";

function DocViewer() {
  const { docId } = useParams();
  const [fileUrl, setFileUrl] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if the page was navigated to internally
  const isNavigated = location.state?.fromInternalNavigation || false;

  const backPage = () => {
    navigate(-1);
  };

  // useEffect(() => {
  //   const showFile = () => {
  //     axios
  //       .get(`${BASE_URL}:9030/api/claims/viewClaimsDocument/${docId}`, {
  //         responseType: "arraybuffer",
  //       })
  //       .then(async (res) => {
  //         const contentType = res.headers["content-type"];
  //         const blob = new Blob([res.data], { type: contentType });
  //         if (contentType.includes("pdf") || contentType.includes("msword")) {
  //           const pdfUrl = URL.createObjectURL(blob);
  //           setFileUrl(pdfUrl);
  //         } else if (
  //           contentType.includes("image/jpeg") ||
  //           contentType.includes("image/jpg") ||
  //           contentType.includes("octet-stream")
  //         ) {
  //           const imageUrl = URL.createObjectURL(blob);
  //           setFileUrl(imageUrl);
  //         } else {
  //           alert("Unsupported file format");
  //         }
  //       })
  //       .catch((err) => {
  //         alert(err);
  //       });
  //   };

  //   showFile();
  // }, []);

  useEffect(() => {
    const showFile = async () => {
      const urls = [
        `${BASE_URL}:9030/api/claims/viewClaimsDocument/${docId}`,
        `${BASE_URL}:9029/api/viewExitDocument/${docId}`
      ];
  
      for (const url of urls) {
        try {
          const res = await axios.get(url, { responseType: "arraybuffer" });
          const contentType = res.headers["content-type"];
          const blob = new Blob([res.data], { type: contentType });
          const fileUrl = URL.createObjectURL(blob);
  
          if (
            contentType.includes("pdf") || 
            contentType.includes("msword") || 
            contentType.includes("image/jpeg") || 
            contentType.includes("image/jpg") || 
            contentType.includes("octet-stream")||
            contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

          ) {
            setFileUrl(fileUrl);
            return; // Exit after the first successful API call
          } else {
            alert("Unsupported file format");
          }
        } catch (err) {
          console.warn(`Error fetching from ${url}:`, err);
        }
      }
      alert("Failed to fetch document from all sources");
    };
  
    showFile();
  }, [docId]);
  

  return (
    <div>
      {/* <div className='flex justify-end mr-[30px]'>
                <button className='p-[10px] bg-black text-white' onClick={backPage}>Back</button>
            </div> */}
      {isNavigated && (
        <div className="flex justify-end mr-[30px]">
          <button className="p-[10px] bg-black text-white" onClick={backPage}>
            Back
          </button>
        </div>
      )}

      <div>
        {
          <embed
            className="object-contain mx-auto"
            src={fileUrl}
            width="1000"
            height="1120"
          />
        }

        <div className="h-[100px]"></div>
      </div>
    </div>
  );
}

export default DocViewer;