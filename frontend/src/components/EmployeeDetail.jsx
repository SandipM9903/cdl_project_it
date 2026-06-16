// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import Header from "./Header";
// import { BASE_URL } from "../config/Config"; // Assuming BASE_URL is defined here

// // Helper component for consistent field display
// const DetailItem = ({ label, value, className = "" }) => (
//   // Removed bg-gray-50, p-4, rounded-lg, shadow-sm
//   <div className={`mb-4 ${className}`}> {/* Reduced bottom margin */}
//     <h3 className="text-gray-600 text-sm font-header">{label}</h3> {/* Added font-header */}
//     <p className="text-blue-900 font-semibold break-words text-xs mt-0.5"> {/* Reduced top margin */}
//       {value || "N/A"} {/* Default to "N/A" if value is null or undefined */}
//     </p>
//   </div>
// );

// const EmployeeDetail = () => {
//   const { email } = useParams(); // Get email from the URL params
//   const [profileInfo, setProfileInfo] = useState(null);
//   const [fileUrl, setFileUrl] = useState(""); // To store the file URL for the profile image
//   const fallbackImageUrl = "https://placehold.co/160x160/E0E0E0/333333?text=No+Image"; // Fallback image URL
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch employee data based on email when the component mounts
//     axios
//       .get(`${BASE_URL}:9020/employee/by/email/${email}`)
//       .then((response) => {
//         const employeeData = response.data;
//         setProfileInfo(employeeData); // Store the entire profile data

//         // Extract file and content type for the image
//         const { file, contentType } = employeeData?.fileAndObjectTypeBean?.fileAndContentTypeBean || {};

//         if (file && contentType) {
//           // Decode base64 string to create a Blob URL for the image
//           const byteCharacters = atob(file);
//           const byteNumbers = new Array(byteCharacters.length);
//           for (let i = 0; i < byteCharacters.length; i++) {
//             byteNumbers[i] = byteCharacters.charCodeAt(i);
//           }
//           const byteArray = new Uint8Array(byteNumbers);
//           const blob = new Blob([byteArray], { type: contentType });
//           const url = URL.createObjectURL(blob);

//           setFileUrl(url); // Set the image URL
//         } else {
//           setFileUrl(fallbackImageUrl); // Use fallback if no file
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching employee data:", error);
//         setProfileInfo({}); // Set to empty object to stop loading and show N/A
//         setFileUrl(fallbackImageUrl); // Ensure fallback is used on error
//       });
//   }, [email]); // Re-run when the email changes

//   if (!profileInfo) {
//     return (
//       <>
//         <Header />
//         <div className="flex justify-center items-center min-h-screen">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="ml-4 text-gray-700">Loading employee data...</p>
//         </div>
//       </>
//     );
//   }

//   // Safely access nested properties
//   const empResDTO = profileInfo?.fileAndObjectTypeBean?.empResDTO;
//   const userDTO = profileInfo?.userDTO;

//   const handleGoBack = () => {
//     navigate("/Employee"); // Navigate back to the employees list page
//   };

//   return (
//     <>
//       <Header />
//       {/* Reduced mt-24 to mt-20 for less top padding */}
//       <div className="relative mx-auto w-[95%] lg:w-[90%] mt-20 pb-8 min-h-[calc(100vh-64px)]"> 
//         {/* Go Back Button - Reduced mb-6 to mb-4 */}
//         <div className="mb-4">
//           <button
//             onClick={handleGoBack}
//             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//             </svg>
//             Go Back
//           </button>
//         </div>

//         {/* Main content grid - Reduced py-8 to py-4, px-6 to px-4 */}
//         <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-8 gap-y-4 bg-white shadow-lg border py-4 px-4 rounded-lg">

//           {/* Profile Section (col-span-10 lg:col-span-2) - Reduced pb-6 to pb-4, pr-6 to pr-4 */}
//           <div className="col-span-10 lg:col-span-2 flex flex-col items-center lg:items-start border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:pr-4">
//             <div className="relative inline-block">
//               <img
//                 src={fileUrl}
//                 alt="Profile"
//                 className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-500 shadow-md"
//                 onError={(e) => { e.target.onerror = null; e.target.src = fallbackImageUrl; }}
//               />
//               {empResDTO?.status && (
//                 <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center cursor-pointer border-2 border-white" title="Active">
//                   <svg
//                     className="h-4 w-4 text-white"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//               )}
//             </div>
//             <h2 className="font-semibold text-lg text-red-700 mt-3 text-center lg:text-left font-header"> {/* Added font-header */}
//               {empResDTO?.fullNameAsAadhaar || "N/A"}
//             </h2>
//             <p className="font-normal text-gray-700 text-sm text-center lg:text-left">
//               {empResDTO?.designationResDTO?.designationName || "N/A"}
//             </p>
//           </div>

//           {/* Employee Details & Contact Info Section (col-span-10 lg:col-span-8) */}
//           {/* Removed p-4 from this div to reduce inner padding */}
//            <div className="col-span-10 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4 font-content"> {/* Adjusted gap-x and gap-y */}

//             {/* Fields from the image, arranged to mimic its layout */}
//             <DetailItem label="Employee Code" value={empResDTO?.empCode} />
//             <DetailItem label="Email" value={empResDTO?.emailId} />
//             {/* <DetailItem label="Contact Number" value={empResDTO?.primaryContactNo} /> Assuming primaryContactNo for "Contact Number" */}
//             <DetailItem label="Location" value={userDTO?.locationResDTO?.locationName} />

//             <DetailItem label="Project Name" value={empResDTO?.projectResDTO?.projectName} />
//             <DetailItem label="Organization Unit" value={empResDTO?.subDeptResDTO?.orgUnits} />
//             <DetailItem label="Department" value={empResDTO?.mainDeptResDTO?.mainDepartment} />
//             <DetailItem label="Sub-Department" value={empResDTO?.subDeptResDTO?.subDept} />

//             <DetailItem label="Reporting To" value={empResDTO?.reportingManager} />
//             <DetailItem label="BU Head" value={empResDTO?.buHeadName} />
//             <DetailItem label="Employment Status" value={empResDTO?.employmentStatusResDTO?.employmentStatus} />

//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EmployeeDetail;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Mail, Phone, Briefcase, Calendar, CircleDot, ChevronRight, Loader2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./Header";
import { BASE_URL } from "../config/Config";

// Helper component for consistent field display
const DetailItem = ({ label, value, className = "" }) => (
  <div className={`mb-4 ${className}`}>
    <h3 className="text-gray-600 text-sm font-header">{label}</h3>
    <p className="text-blue-900 font-semibold break-words text-xs mt-0.5">
      {value || "N/A"}
    </p>
  </div>
);

const EmployeeDetail = () => {
  const { email } = useParams();
  const [profileInfo, setProfileInfo] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [teamError, setTeamError] = useState(null);
  
  const fallbackImageUrl = "https://placehold.co/160x160/E0E0E0/333333?text=No+Image";
  const navigate = useNavigate();

  // Fetch employee details
  useEffect(() => {
    axios
      .get(`${BASE_URL}:9020/employee/by/email/${email}`)
      .then((response) => {
        const employeeData = response.data;
        setProfileInfo(employeeData);

        const { file, contentType } = employeeData?.fileAndObjectTypeBean?.fileAndContentTypeBean || {};

        if (file && contentType) {
          const byteCharacters = atob(file);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: contentType });
          const url = URL.createObjectURL(blob);
          setFileUrl(url);
        } else {
          setFileUrl(fallbackImageUrl);
        }
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
        setProfileInfo({});
        setFileUrl(fallbackImageUrl);
      });
  }, [email]);

  // Fetch team members when profile info is available
  useEffect(() => {
    if (profileInfo?.fileAndObjectTypeBean?.empResDTO?.empCode) {
      fetchTeamMembers(profileInfo.fileAndObjectTypeBean.empResDTO.empCode);
    }
  }, [profileInfo]);

  const fetchTeamMembers = async (empCode) => {
    try {
      setLoadingTeam(true);
      setTeamError(null);

      const response = await axios.get(`${BASE_URL}:9020/employee/team/${empCode}`);
      const rawEmployeesData = response.data;

      const filteredTeamMembers = rawEmployeesData
        .map(item => item.fileAndObjectTypeBean?.empResDTO)
        .filter(emp => emp && emp.reportTo === empCode);

      setTeamMembers(filteredTeamMembers);
    } catch (err) {
      console.error("Error fetching team data:", err);
      setTeamError("Failed to fetch team data.");
      toast.error("Failed to load team data.");
    } finally {
      setLoadingTeam(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith('XXXX')) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    return status ? 'text-green-600' : 'text-orange-600';
  };

  if (!profileInfo) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="ml-4 text-gray-700">Loading employee data...</p>
        </div>
      </>
    );
  }

  const empResDTO = profileInfo?.fileAndObjectTypeBean?.empResDTO;
  const userDTO = profileInfo?.userDTO;

  const handleGoBack = () => {
    navigate("/Employee");
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <div className="relative mx-auto w-[95%] lg:w-[90%] mt-20 pb-8 min-h-[calc(100vh-64px)]">
        {/* Go Back Button */}
        <div className="mb-4">
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Go Back
          </button>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-8 gap-y-4 bg-white shadow-lg border py-4 px-4 rounded-lg mb-8">

          {/* Profile Section */}
          <div className="col-span-10 lg:col-span-2 flex flex-col items-center lg:items-start border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:pr-4">
            <div className="relative inline-block">
              <img
                src={fileUrl}
                alt="Profile"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-500 shadow-md"
                onError={(e) => { e.target.onerror = null; e.target.src = fallbackImageUrl; }}
              />
              {empResDTO?.status && (
                <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center cursor-pointer border-2 border-white" title="Active">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <h2 className="font-semibold text-lg text-red-700 mt-3 text-center lg:text-left font-header">
              {empResDTO?.fullNameAsAadhaar || "N/A"}
            </h2>
            <p className="font-normal text-gray-700 text-sm text-center lg:text-left">
              {empResDTO?.designationResDTO?.designationName || "N/A"}
            </p>
            
            {/* Contact Info */}
            <div className="mt-4 text-center lg:text-left">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Mail size={16} className="text-red-600" />
                <span>{empResDTO?.emailId || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} className="text-red-600" />
                <span>{empResDTO?.primaryContactNo || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Employee Details */}
          <div className="col-span-10 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4 font-content">
            <DetailItem label="Employee Code" value={empResDTO?.empCode} />
            <DetailItem label="Email" value={empResDTO?.emailId} />
            <DetailItem label="Location" value={userDTO?.locationResDTO?.locationName} />

            <DetailItem label="Project Name" value={empResDTO?.projectResDTO?.projectName} />
            <DetailItem label="Organization Unit" value={empResDTO?.subDeptResDTO?.orgUnits} />
            <DetailItem label="Department" value={empResDTO?.mainDeptResDTO?.mainDepartment} />
            <DetailItem label="Sub-Department" value={empResDTO?.subDeptResDTO?.subDept} />

            <DetailItem label="Reporting To" value={empResDTO?.reportingManager} />
            <DetailItem label="BU Head" value={empResDTO?.buHeadName} />
            <DetailItem label="Employment Status" value={empResDTO?.employmentStatusResDTO?.employmentStatus} />
          </div>
        </div>

        {/* Team Members Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
            Team Members ({teamMembers.length} Direct Reportee{teamMembers.length !== 1 ? 's' : ''})
          </h2>

          {loadingTeam ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-[#DC3545] w-8 h-8 mr-3" />
              <p className="text-gray-700">Loading team members...</p>
            </div>
          ) : teamError ? (
            <div className="text-center py-10 text-red-600">
              <p className="text-lg">Error loading team members.</p>
              <button
                onClick={() => empResDTO?.empCode && fetchTeamMembers(empResDTO.empCode)}
                className="mt-4 px-6 py-2 bg-[#DC3545] text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.empCode || member.empId}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col items-center text-center"
                >
                  <img
                    src={`https://placehold.co/100x100/A0AEC0/FFFFFF?text=${member.firstName?.[0] || 'E'}${member.lastName ? member.lastName[0] : ''}`}
                    alt={member.firstName}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {member.firstName} {member.middleName ? member.middleName + ' ' : ''}{member.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{member.designationResDTO?.designationName || 'N/A'}</p>

                  <div className="text-xs text-gray-500 mb-4 flex flex-col items-center gap-1">
                    <span className="flex items-center gap-1">
                      <Mail size={14} className="text-blue-500" /> {member.emailId}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={14} className="text-blue-500" /> {member.primaryContactNo || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-purple-500" /> Joined: {formatDate(member.dateOfJoining)}
                    </span>
                    <span className={`flex items-center gap-1 font-medium ${getStatusColor(member.status)}`}>
                      <CircleDot size={14} /> {member.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <Link 
                    to={`/employee/${member.emailId}`}
                    className="mt-auto flex items-center justify-center gap-1 px-4 py-2 bg-[#DC3545] text-white text-sm font-medium rounded-full hover:bg-red-600 transition-colors duration-200 shadow-sm"
                  >
                    View Profile <ChevronRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-600">
              <p className="text-lg">No direct reportees found.</p>
              <p className="text-sm mt-2">This employee doesn't have any direct team members reporting to them.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeDetail;
