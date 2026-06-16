// import React, { useEffect, useState } from 'react';
// import { ArrowLeft, X, Plus } from 'lucide-react';
// import kycImg1 from '../assets/KYC/KYC Cohort 1 Invite_02.jpg';
// import kycImg2 from '../assets/KYC/KYC- Cohort 1 -  Flow Of events_03.jpg';
// import kycImg3 from '../assets/KYC/KYC Cohort 1 successful completion_04.jpg';
// import kycImg4 from '../assets/KYC/KYC Cohort 2 Invite_06.jpg';
// import kycImg5 from '../assets/KYC/KYC- Cohort 2 - Flow Of Events_05.jpg';
// import kycImg6 from '../assets/KYC/KYC Cohort 2.jpg';
// import kycImg7 from '../assets/KYC/KYC B3_Invite (1).jpg';
// import kycImg8 from '../assets/KYC/KYC- Flow Of Event-C1.jpg';
// import kycImg9 from '../assets/KYC/KYC Cohort 3A (1).jpg';
// import Header from '../components/Header';

// const cohort1Images = [kycImg1, kycImg2, kycImg3];
// const cohort2Images = [kycImg4, kycImg5, kycImg6];
// const cohort3Images = [kycImg7, kycImg8, kycImg9];

// const ALLOWED_EMP_CODES = ['9085176', '9083095', '9082697', '9079597'];

// const KycComponent = ({ onBack }) => {
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [empCode, setEmpCode] = useState(null);

//     useEffect(() => {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         // Fetch empCode from sessionStorage/localStorage
//         const code = localStorage.getItem("empId") || localStorage.getItem("empCode");
//         setEmpCode(code);
//     }, []);

//     const handleAddClick = () => setShowForm(true);
//     const handleCloseForm = () => setShowForm(false);

//     return (
//         <>
//             <Header />
//             <div className="min-h-screen bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] px-4 py-6 md:px-16 font-header mt-20 relative">
                
//                 {/* --- Add Button for Allowed Users --- */}
//                 {ALLOWED_EMP_CODES.includes(empCode) && (
//                     <button
//                         onClick={handleAddClick}
//                         className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all"
//                     >
//                         <Plus size={20} /> Add
//                     </button>
//                 )}

//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-10">
//                     <div className="flex items-center gap-3">
//                         <button
//                             onClick={() => window.history.back()}
//                             className="text-gray-700 hover:text-red-600 transition"
//                         >
//                             <ArrowLeft size={28} />
//                         </button>

//                         <h1 className="text-3xl md:text-4xl font-bold text-red-600 tracking-tight">
//                             Know Your CMS (KYC)
//                         </h1>
//                     </div>
//                 </div>

//                 {/* Objective */}
//                 <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-12">
//                     <h2 className="text-2xl font-semibold text-gray-800 mb-4">Objective</h2>
//                     <p className="text-gray-700 leading-relaxed text-justify font-content">
//                         The KYC Program is designed to provide a comprehensive understanding of the organization—its vision, mission, products, services, and client landscape.
//                         It aims to equip employees to clearly articulate the organization's narrative to clients, partners, and other external stakeholders.
//                         The program fosters organizational alignment around CMS’s unique positioning and value proposition, strengthening its competitive edge in the market.
//                         It also supports employees in demonstrating the ability to create client value by leveraging CMS’s capabilities and acting as effective brand ambassadors in external engagements.
//                     </p>
//                 </div>

//                 {/* Cohort 1 */}
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-red-300 pb-2">Cohort 1</h2>
//                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
//                     {cohort1Images.map((img, idx) => (
//                         <div
//                             key={`c1-${idx}`}
//                             className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer"
//                             onClick={() => setSelectedImage(img)}
//                         >
//                             <img
//                                 src={img}
//                                 alt={`Cohort 1 - Slide ${idx + 1}`}
//                                 className="w-full h-72 object-cover"
//                             />
//                         </div>
//                     ))}
//                 </div>

//                 {/* Cohort 2 */}
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-red-300 pb-2">Cohort 2</h2>
//                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
//                     {cohort2Images.map((img, idx) => (
//                         <div
//                             key={`c2-${idx}`}
//                             className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer"
//                             onClick={() => setSelectedImage(img)}
//                         >
//                             <img
//                                 src={img}
//                                 alt={`Cohort 2 - Slide ${idx + 1}`}
//                                 className="w-full h-72 object-cover"
//                             />
//                         </div>
//                     ))}
//                 </div>

//                 {/* Cohort 3 */}
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-red-300 pb-2">Cohort 3</h2>
//                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
//                     {cohort3Images.map((img, idx) => (
//                         <div
//                             key={`c3-${idx}`}
//                             className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer"
//                             onClick={() => setSelectedImage(img)}
//                         >
//                             <img
//                                 src={img}
//                                 alt={`Cohort 3 - Slide ${idx + 1}`}
//                                 className="w-full h-72 object-cover"
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Fullscreen Image Viewer */}
//             {selectedImage && (
//                 <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
//                     <button
//                         onClick={() => setSelectedImage(null)}
//                         className="absolute top-6 right-6 text-white hover:text-red-400 transition"
//                     >
//                         <X size={32} />
//                     </button>
//                     <img
//                         src={selectedImage}
//                         alt="Full View"
//                         className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-xl object-contain"
//                     />
//                 </div>
//             )}

//             {/* Popup Add Form */}
//             {showForm && (
//                 <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
//                     <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-lg p-6 relative">
//                         <button
//                             onClick={handleCloseForm}
//                             className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
//                         >
//                             <X size={28} />
//                         </button>
//                         <h2 className="text-2xl font-semibold text-red-600 mb-4">Add KYC Details</h2>
//                         <form className="space-y-4">
//                             <input
//                                 type="text"
//                                 placeholder="Title"
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
//                             />
//                             <textarea
//                                 placeholder="Description"
//                                 rows={4}
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
//                             ></textarea>
//                             <input
//                                 type="file"
//                                 className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                             />
//                             <div className="flex justify-end">
//                                 <button
//                                     type="button"
//                                     onClick={handleCloseForm}
//                                     className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
//                                 >
//                                     Submit
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default KycComponent;
import React, { useEffect, useState, useCallback } from "react";
import { ArrowLeft, X, Trash2, PlusCircle } from "lucide-react";
import Swal from "sweetalert2";
import Header from "../components/Header";

const API_BASE_URL = "https://mycdl.cms.co.in/documents";
const CURRENT_USER_EMP_CODE = localStorage.getItem("empId");
const AUTHORIZED_EMP_CODES = ["9085176", "9083095", "9082697", "9079597"];

const ORDER_PRIORITY = {
  "Invite": 1,
  "Flow of Events": 2,
  "Successful Completion": 3,
};

const KycComponent = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [descriptions, setDescriptions] = useState({});
  const [cohortTitle, setCohortTitle] = useState("");

  useEffect(() => {
    fetchImages();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ✅ Fetch and Group Images Cohort-wise
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/root-communications-kyc`);
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();

      const grouped = {};
      data.forEach((img) => {
        const caption = img.docCaption?.trim() || "Unknown Cohort";
        if (!grouped[caption]) grouped[caption] = [];
        grouped[caption].push(img);
      });

      // Sort images inside each cohort by description order
      const sortedCohorts = Object.entries(grouped)
        .sort(([aKey, aVal], [bKey, bVal]) => {
          const aDate = new Date(aVal[0]?.createdOn || 0);
          const bDate = new Date(bVal[0]?.createdOn || 0);
          return aDate - bDate;
        })
        .map(([caption, images]) => ({
          caption,
          images: images.sort((a, b) => {
            const aDesc = a.docDescription || "";
            const bDesc = b.docDescription || "";
            const aPriority = ORDER_PRIORITY[aDesc] || 99;
            const bPriority = ORDER_PRIORITY[bDesc] || 99;
            return aPriority - bPriority;
          }),
        }));

      setCohorts(sortedCohorts);
    } catch (error) {
      console.error("Error fetching images:", error);
      Swal.fire("Error ❌", "Failed to load images.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Handle File Selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      Swal.fire("Limit Exceeded ⚠️", "You can only upload up to 3 images.", "warning");
      e.target.value = null;
      return;
    }
    setSelectedFiles(files);

    // Always set descriptions in the correct order regardless of upload sequence
    const defaultOptions = ["Invite", "Flow of Events", "Successful Completion"];
    const descMap = {};
    files.forEach((file, index) => {
      descMap[file.name] = defaultOptions[index];
    });
    setDescriptions(descMap);
  };

  const handleDescriptionChange = (fileName, value) => {
    setDescriptions((prev) => ({ ...prev, [fileName]: value }));
  };

  // ✅ Upload New Cohort with Correct Descriptions
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!cohortTitle.trim()) {
      Swal.fire("Missing Title", "Please enter a valid cohort title.", "info");
      return;
    }

    if (selectedFiles.length === 0) {
      Swal.fire("No Files", "Please select at least one image to upload.", "info");
      return;
    }

    try {
      setLoading(true);
      
      // Upload each file individually with its correct description
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("files", file);

        const documentDTO = {
          empCode: CURRENT_USER_EMP_CODE,
          empOrg: "CMS Computers India Private Ltd.",
          location: "Bengaluru",
          docTags: "kyc",
          docCaption: cohortTitle.trim(),
          docDescription: descriptions[file.name] || "Other",
        };

        formData.append("documentDTO", JSON.stringify(documentDTO));

        const response = await fetch(`${API_BASE_URL}/root-communications-kyc`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
        return response.json();
      });

      await Promise.all(uploadPromises);
      
      Swal.fire({
        title: "Upload Successful 🎉",
        text: `Images uploaded successfully under ${cohortTitle}!`,
        icon: "success",
        confirmButtonColor: "#d33",
      });
      setShowUploadModal(false);
      setSelectedFiles([]);
      setDescriptions({});
      setCohortTitle("");
      fetchImages();
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire("Upload Failed 😔", error.message || "Internal Server Error", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Single Image
  const handleDelete = async (docId, event) => {
    event.stopPropagation();

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the image.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE_URL}/${docId}`, { method: "DELETE" });
        if (response.ok) {
          Swal.fire("Deleted!", "The image has been deleted successfully.", "success");
          fetchImages();
        } else {
          const errorText = await response.text();
          throw new Error(errorText);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to delete the image.", "error");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] px-4 py-6 md:px-16 font-header mt-20">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="text-gray-700 hover:text-red-600 transition"
            >
              <ArrowLeft size={28} />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-red-600 tracking-tight">
              Know Your CMS (KYC)
            </h1>
          </div>

          {AUTHORIZED_EMP_CODES.includes(CURRENT_USER_EMP_CODE) && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
            >
              <PlusCircle size={20} />
              Add Cohort
            </button>
          )}
        </div>

        {/* Objective */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Objective</h2>
          <p className="text-gray-700 leading-relaxed text-justify font-content">
           The KYC Program is designed to provide a comprehensive understanding of the organization—its vision, mission, products, services, and client landscape. It aims to equip employees to clearly articulate the organization's narrative to clients, partners, and other external stakeholders. The program fosters organizational alignment around CMS’s unique positioning and value proposition, strengthening its competitive edge in the market. It also supports employees in demonstrating the ability to create client value by leveraging CMS’s capabilities and acting as effective brand ambassadors in external engagements.
          </p>
        </div>

        {/* Cohorts Display */}
        {loading ? (
          <p className="text-center text-gray-600">Loading images...</p>
        ) : (
          cohorts.map((cohort) => (
            <div key={cohort.caption} className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-red-300 pb-2">
                {cohort.caption}
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {cohort.images.map((img, idx) => (
                  <div
                    key={img.docId || idx}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer relative"
                    onClick={() => setSelectedImage(`${API_BASE_URL}/access/${img.docId}`)}
                  >
                    {AUTHORIZED_EMP_CODES.includes(CURRENT_USER_EMP_CODE) && (
                      <button
                        onClick={(e) => handleDelete(img.docId, e)}
                        className="absolute top-2 right-2 bg-red-600 p-2 rounded-full text-white hover:bg-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    <img
                      src={`${API_BASE_URL}/access/${img.docId}`}
                      alt={`Image ${idx + 1}`}
                      className="w-full h-72 object-cover"
                    />
                    <div className="p-4 bg-gray-50 border-t">
                      <p className="text-sm font-semibold text-gray-700 text-center">
                        {img.docDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image Popup */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-red-400 transition"
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Full View"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-xl object-contain"
          />
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
            <button
              onClick={() => {
                setShowUploadModal(false);
                setSelectedFiles([]);
                setDescriptions({});
                setCohortTitle("");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">
              Upload Cohort Images
            </h2>
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-semibold">
                  Cohort Title
                </label>
                <input
                  type="text"
                  value={cohortTitle}
                  onChange={(e) => setCohortTitle(e.target.value)}
                  placeholder="Enter Cohort Title (e.g., Cohort 1, Cohort 10)"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold">
                  Select up to 3 images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Images will be automatically assigned: 1. Invite, 2. Flow of Events, 3. Successful Completion
                </p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Image Assignments:</h3>
                  {selectedFiles.map((file, index) => (
                    <div key={file.name} className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium truncate w-1/2">
                        {file.name}
                      </span>
                      <select
                        value={descriptions[file.name]}
                        onChange={(e) =>
                          handleDescriptionChange(file.name, e.target.value)
                        }
                        className="border border-gray-300 rounded-lg p-1 text-gray-700"
                      >
                        <option value="Invite">Invite</option>
                        <option value="Flow of Events">Flow of Events</option>
                        <option value="Successful Completion">Successful Completion</option>
                      </select>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Descriptions are automatically assigned in the correct sequence
                  </p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Upload Cohort"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default KycComponent;