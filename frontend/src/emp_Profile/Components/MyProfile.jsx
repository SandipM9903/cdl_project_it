import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import ImagePopup from "../ImagePopup";
import { BASE_URL } from "../../config/Config";


function MyProfile() {
  const [empData, setEmpData] = useState({});
  const [userData, setUserData] = useState({});
  const [fileUrl, setFileUrl] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage form popup visibility
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false); // State to manage image popup visibility
  const email = localStorage.getItem("email");
  const empId = localStorage.getItem("empId");
  console.log(empId +"EmpId");
  const fallbackImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEhbRExVYjkvKlgz03fnIy3QN6HzcGDmE_3w&s"; // Dummy image URL

  useEffect(() => {
    getEmployeeData();
  }, []);

  const getEmployeeData = () => {
    axios

      .get(`${BASE_URL}:9020/employee/by/email/${email}`)

      .then((response) => {
        setEmpData(response.data.fileAndObjectTypeBean.empResDTO);

        setUserData(response.data.userDTO);

        const { file, contentType } =
          response.data.fileAndObjectTypeBean.fileAndContentTypeBean;

        // Decode base64 string

        const byteCharacters = atob(file);

        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], { type: contentType });

        const url = URL.createObjectURL(blob);

        setFileUrl(url);
      })

      .catch((error) => console.log(error));
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the form popup
  };

  const handleImageClick = () => {
    setIsImagePopupOpen(true); // Open the image popup
  };

  const handleCloseImagePopup = () => {
    setIsImagePopupOpen(false); // Close the image popup
  };

  const handleUpdateImage = (file) => {
    // Implement the image upload logic here, e.g., sending the image to the backend

    const formData = new FormData();

    formData.append("image", file);

    axios
      .put(`${BASE_URL}:9020/employee/update/img/${empId}`, formData)

      .then((response) => {
        // Handle the response after image upload

        console.log(response.data);

        getEmployeeData(); // Refresh employee data to get the updated image

        handleCloseImagePopup(); // Close the image popup
      })

      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="bg-white border-[2px] border-gray-200 shadow-lg p-3 rounded-3xl mt-2">
      <div className="pb-5">
     
      </div>
  
      <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3 text-center relative">
  <div
    className="relative group w-[130px] h-[130px] rounded-full mx-auto"
    onClick={handleImageClick}
  >
    <img
      src={fileUrl || fallbackImageUrl}
      alt="Profile"
      className="w-[130px] h-[130px] rounded-full border-2 shadow-lg cursor-pointer"
    />

    {/* Edit button appears on hover */}
    <button
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"
      onClick={handleImageClick}
    >
      Edit
    </button>
  </div>

  <div className="mt-2">
    <p className="text-red-700 text-sm font-semibold">
      {empData?.fullNameAsAadhaar}
    </p>
    <p className="text-red-900 text-xs mt-[5px]">
      {empData?.designationResDTO?.designationName}
    </p>
  </div>
</div>

  
        <div className="col-span-9">
          <div className="grid grid-cols-2 gap-6">
            {/* Employee Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-500 text-xs font-bold mb-2">
                  Employee Code
                </p>
                <p className="text-gray-800 text-xs mb-4 break-words">
                  {empData?.empCode}
                </p>
              </div>
  
              <div>
                <p className="text-gray-500 text-xs font-bold mb-2">
                  Department
                </p>
                <p className="text-gray-800 text-xs mb-4 break-words">
                  {empData?.mainDeptResDTO?.mainDepartment}
                </p>
              </div>
            </div>
  
            {/* Contact and Reporting */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-500 text-xs font-bold mb-2">BU Head (R2)</p>
                <p className="text-gray-800 text-xs mb-4 break-words">
                  {empData?.buHeadName}
                </p>
              </div>
  
              <div>
                <p className="text-gray-500 text-xs font-bold mb-2">Reporting To (R1)</p>
                <p className="text-gray-800 text-xs mb-4 break-words">
                  {empData?.reportingManager}
                </p>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-2 gap-6">
            {/* More Information */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-500 text-xs font-bold mb-2">Email</p>
                <p className="text-gray-800 text-xs mb-4 break-words">
                  {empData?.emailId}
                </p>
              </div>
  
              <div>
                <p className="text-gray-500 text-xs font-bold mb-2">Employment Status</p>
                <div className={`flex space-x-1 text-xs items-center mb-4 ${empData.status ? "text-green-500" : "text-orange-400"}`}>
                  {empData?.status && <FaRegCheckCircle className="mt-0.5" />}
                  <p className="mt-[.5px]">
                    {empData?.status ? "Confirmed" : "Unconfirmed"}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
            {/* Location */}
            <div className="w-full">
              <p className="text-gray-500 text-xs font-bold mb-2">Location</p>
              <p className="text-gray-800 text-xs mb-2 break-words">
                {`${userData?.locationResDTO?.locationName}, ${userData.locationResDTO?.country}`}
              </p>
            </div>
            <div className="w-full">
              <p className="text-gray-500 text-xs font-bold mb-2">Employment Category</p>
              <p className="text-gray-800 text-xs mb-2 break-words">
              {/* {empData.emailId} */} On Payroll - Active 
              </p>
            </div>
            </div>
          </div>
  
          <div className="border-b-[1px] border-gray-200 my-4"></div>
  
          {/* About Me and Skills */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <h2 className="font-semibold text-sm">About me</h2>
              <p className="text-gray-500 text-xs text-justify break-words pr-2">
                {empData?.aboutEmp}
              </p>
            </div>
  
            {/* <div>
              <p className="font-semibold text-sm mb-3">Skills</p>
              <div className="grid grid-cols-4 gap-2">
                {userData.skillResDTOS?.map((skill, index) => (
                  <p key={index} className="text-xs bg-slate-100 rounded-lg p-1 text-center">
                    {skill.name}
                  </p>
                )) || <p>No Skills Available</p>}
              </div>
            </div> */}
          </div>
  
          {/* Popup Components */}
         
          {isImagePopupOpen && (
            <ImagePopup
              fileUrl={fileUrl}
              onClose={handleCloseImagePopup}
              onUpdateImage={handleUpdateImage}
            />
          )}
        </div>
      </div>
    </div>
  );
  
}

export default MyProfile;
