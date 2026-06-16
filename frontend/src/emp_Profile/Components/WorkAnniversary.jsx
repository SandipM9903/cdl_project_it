/* eslint-disable jsx-a11y/img-redundant-alt */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/Config";

function WorkAnniversary() {
  const [workAnniversary, setWorkAnniversary] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    getWorkAnniversary();
  }, []);

  const getWorkAnniversary = () => {
    return axios
      .get(`${BASE_URL}:9020/employee/work/anniversary`)
      .then((res) => {
        setWorkAnniversary(res.data);
        console.log(res.data,"Work Anniversaryyyyyyyyyyyyyyyyyyyyyyy");
      });
  };

  // Function to open Outlook with a pre-filled message
  const openOutlookWithTemplate = (email, fullName, yearsCompleted) => {
    const subject = `Congratulations on your Work Anniversary, ${fullName}!`;
    const body = `Dear ${fullName},\n\n` +
      `Congratulations on completing ${yearsCompleted} years with us! Your dedication and hard work have contributed significantly to our company's success, and we look forward to many more years of working together.\n\n` +
      `Best regards,\nYour Team`;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const toggleWish = (employee) => {
    setSelectedEmployeeId(employee.empId === selectedEmployeeId ? null : employee.empId);
  };

  return (
    <div className="rounded-lg">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow sm:p-4 dark:bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-sm font-bold leading-none text-gray-900 dark:text-black mb-2 mt-2 ml-2">
            Celebrating Work Anniversary
          </h1>
        </div>

        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-grey-500 scrollbar-track-gray-300 scrollbar-track-rounded-full h-[270px]">
          {workAnniversary.map((data, index) => {
            const { empResDTO, fileAndContentTypeBean } = data;
            const yearsCompleted = Math.floor(parseFloat(empResDTO.expWithCurrentCompany));

            return (
              <div className="flex justify-between items-center mb-1" key={index}>
                <div className="flex justify-start gap-3 items-center w-[200px] mt-4">
                  {fileAndContentTypeBean && fileAndContentTypeBean.file ? (
                    <img
                      src={`data:${fileAndContentTypeBean.contentType};base64,${fileAndContentTypeBean.file}`}
                      alt="image"
                      className="w-[30px] h-[30px] rounded-full"
                    />
                  ) : (
                    <img
                      src="https://imgcdn.stablediffusionweb.com/2024/5/3/16055462-ddd7-4167-a576-f2c605b507ed.jpg"
                      alt="default image"
                      className="w-[30px] h-[30px] "
                    />
                  )}
                  <div className="max-w-[150px]">
                    <p className="text-xs truncate">{empResDTO.fullNameAsAadhaar}</p>
                    <p className="mb-2 text-[10px] text-gray-400 truncate">
                      {empResDTO.designationResDTO?.designationName}
                    </p>
                  </div>
                </div>

                <p className="text-green-500 font-bold text-[8px] whitespace-nowrap ml-auto">
                  {yearsCompleted} Years Completed
                </p>

                <div className="flex items-center mt-6 text-sm  min-w-[60px]">
                  <button
                    onClick={() => {
                      toggleWish(empResDTO); // Toggles the button state
                      openOutlookWithTemplate(empResDTO.emailId, empResDTO.fullNameAsAadhaar, yearsCompleted); // Opens Outlook with the message
                    }}
                    className="bg-blue-500 text-white py-1 px-2 rounded cursor-pointer ml-4 w-[60px] text-xs"
                    disabled={selectedEmployeeId === empResDTO.empId}
                  >
                    {selectedEmployeeId === empResDTO.empId ? "Wished" : "Wish"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WorkAnniversary;
