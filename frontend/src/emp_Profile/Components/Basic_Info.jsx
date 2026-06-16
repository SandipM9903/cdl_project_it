import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/Config";

function Basic_Info() {
//   const [empBasicInfo, setEmpBasicInfo] = useState({});
  const [empData, setEmpData] = useState({});
  const [userData, setUserData] = useState({});
  const [fileUrl, setFileUrl] = useState('');

  const email = localStorage.getItem('email');

  useEffect(() => {
    axios
    .get(`${BASE_URL}:9020/employee/by/email/${email}`)
    .then((response) => {
        setEmpData(response.data.fileAndObjectTypeBean.empResDTO);
        setUserData(response.data.userDTO);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  return (
    <div className="bg-white w-full rounded-lg">
      <div className="bg-white border-[2px] border-gray-300 shadow-lg w-[380px] rounded-lg py-3 px-4">
        <h4 className="font-semibold mb-1.5">Basic Info</h4>

        <div className="grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs">
          {/* <div className="text-gray-500">Employee Id</div>
          <div className="ml-2 truncate" title={empData.empId}>{empData.empId}</div> */}
        </div>

        <div className="grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs">
          <div className="text-gray-500">First Name</div>
          <div className="ml-2 truncate" title={empData.firstName}>{empData.firstName}</div>
        </div>

        <div className="grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs">
          <div className="text-gray-500">Last Name</div>
          <div className="ml-2 truncate" title={empData.lastName}>{empData.lastName}</div>
        </div>

        <div className="grid grid-cols-2 border-b-[1px] border-gray-200 py-1.5 text-xs">
          <div className="text-gray-500">Email Id</div>
          <div className="ml-2 truncate" title={empData.emailId}>{empData.emailId}</div>
        </div>

  
      </div>
    </div>
  );

}

export default Basic_Info;
