import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import DataTable from "react-data-table-component";
import { IoIosLogOut } from "react-icons/io";
import ManagerApproval from "./ManagerApproval";
import { useParams } from "react-router-dom";
import { useStore3 } from "./ClaimStore";
import axios from "axios";
import ManagerAdvApproval from "./ManagerAdvApproval";

import ManagerDashBoardPendingExitForm from "../../eSeperation/components/E-separation/ManagerDashBoardPendingExitForm";
import Header from "../../components/Header";
import AttendancePendingRequests from "../../others/AttendancePandingRequest";
import { BASE_URL } from "../../config/Config";

const MgrPendingReqDashboard = () => {
  const { totalClaims, setTotalClaims } = useStore3();
  const { reimbursementRecord, setReimbursementRecord } = useStore3();
  const [selectedRow, setSelectedRow] = useState(null);
  const [showManagerApproval, setShowManagerApproval] = useState(false);
  const { advTotalClaims, setAdvTotalClaims, exitTotalClaims } = useStore3();
  const { advReimbursementRecord, setAdvReimbursementRecord } = useStore3();
  const [showAdvanceApproval, setShowAdvanceApproval] = useState(false);
  const { requestType } = useParams();
//  const [exitTotalClaims, setExitTotalClaims] = useStore3((state) => [
//      state.exitTotalClaims,
//      state.setExitTotalClaims,
//    ]);
const [exitRecordCount, setExitRecordCount] = useState(0);



    // const pendingCountOfExit = localStorage.getItem("pendingCountOfExit");


  // const empCode = sessionStorage.getItem("UserId");
  const empCode = localStorage.getItem("empId");
  // console.log("myapproval reimburement rec =>>", reimbursementRecord);

  const tabIndexMapping = {
    "Appraisal Request": 0,

    "Reimbursement Request": 1,

    "Advance Reimbursement Request": 2,

    "Leave Request": 3,

    "Exit Request": 4,
  };

  const defaultIndex =
    tabIndexMapping[requestType] !== undefined
      ? tabIndexMapping[requestType]
      : 0;
  const [value, setValue] = useState(defaultIndex);

  console.log(requestType, "requestType");

  console.log(reimbursementRecord, "reimbursementRecord...");

  useEffect(() => {
    setTotalClaims(reimbursementRecord.length);
  }, [reimbursementRecord]);

  console.log(reimbursementRecord, "new reimbursementRecord... ");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const openManagerApproval = (row) => {
    setSelectedRow(row);

    setShowManagerApproval(true);
  };

  const closeManagerApproval = () => {
    setShowManagerApproval(false);

    setSelectedRow(null);
  };

  const openAdvanceApproval = (row) => {
    setSelectedRow(row);

    setShowAdvanceApproval(true);
  };

  const closeAdvanceApproval = () => {
    setShowAdvanceApproval(false);

    setSelectedRow(null);
  };

  useEffect(() => {
    if (!reimbursementRecord || reimbursementRecord.length === 0) {
      const fetchData = async () => {
        try {
          const [
            travelResponse,
            foodResponse,
            conveyanceResponse,
            mobileResponse,
            miscellaneousResponse,
          ] = await Promise.all([
            axios.get(
              `${BASE_URL}:9030/api/claims/getFoodClaimPendingList/${empCode}`
            ),
            axios.get(
              `${BASE_URL}:9030/api/claims/getTravelClaimPendingList/${empCode}`
            ),
            axios.get(
              `${BASE_URL}:9030/api/claims/getConveyanceClaimPendingList/${empCode}`
            ),
            axios.get(
              `${BASE_URL}:9030/api/claims/getMobileClaimPendingList/${empCode}`
            ),
            axios.get(
              `${BASE_URL}:9030/api/claims/getMiscellaneousClaimPendingList/${empCode}`
            ),
          ]);

          const travelClaims = travelResponse.data.filter(
            (claim) => claim !== null
          );
          const foodClaims = foodResponse.data.filter(
            (claim) => claim !== null
          );
          const conveyanceClaims = conveyanceResponse.data.filter(
            (claim) => claim !== null
          );
          const mobileClaims = mobileResponse.data.filter(
            (claim) => claim !== null
          );
          const miscellaneousClaims = miscellaneousResponse.data.filter(
            (claim) => claim !== null
          );

          const allClaims = [
            ...travelClaims,
            ...foodClaims,
            ...conveyanceClaims,
            ...mobileClaims,
            ...miscellaneousClaims,
          ];
          console.log("Allclaims data>>>>>", allClaims);

          const claimUserIds = allClaims.map((claim) => claim.empCode);

          console.log("claim user id===", claimUserIds);
          const empInfoPromises = claimUserIds.map((claimUserId) =>
            axios.get(
              `${BASE_URL}:9030/api/claims/getEmpClaimInfo/${claimUserId}`
            )
          );

          const empInfoResponses = await Promise.all(empInfoPromises);
          console.log("empInfoResponses>>>>>>><<<<<<", empInfoResponses);
          const empInfoData = empInfoResponses.map(response => response.data);
        
          const mergedData = allClaims.map((claim, index) => ({
            ...claim,
            ...empInfoData[index],
          }));
          console.log("all claims data===", allClaims);
          console.log("merged data===", empInfoData);
          const listInfo = mergedData.map(({ id, ...rest }) => rest);
          setReimbursementRecord(listInfo);

          // Update the totalClaims state
          setTotalClaims(listInfo.length);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [setTotalClaims, setReimbursementRecord]);

  // for advance reimbursement

  useEffect(() => {
    if (!advReimbursementRecord || advReimbursementRecord.length === 0) {
      const fetchData = async () => {
        try {
          const [rtaResponse, iouResponse] = await Promise.all([
            axios.get(
              `${BASE_URL}:9030/api/claims/getRtaClaimPendingList/${empCode}`
            ),

            axios.get(
              `${BASE_URL}:9030/api/claims/getIouClaimPendingList/${empCode}`
            ),
          ]);

          const rtaClaims = rtaResponse.data.filter((claim) => claim !== null);

          const iouClaims = iouResponse.data.filter((claim) => claim !== null);

          const allClaims = [...rtaClaims, ...iouClaims];

          const claimUserIds = allClaims.map((claim) => claim.empCode);
          console.log("claim user id===" + claimUserIds);

          const empInfoPromises = claimUserIds.map((claimUserId) =>
            axios.get(
              `${BASE_URL}:9030/api/claims/getEmpClaimInfo/${claimUserId}`
            )
          );

          const empInfoResponses = await Promise.all(empInfoPromises);
          console.log("empInfoResponses>>>>>>><<<<<<", empInfoResponses);
          const empInfoData = empInfoResponses.map(response => response.data);
        
          const mergedData = allClaims.map((claim, index) => ({
            ...claim,
            ...empInfoData[index],
          }));

          const listInfo = mergedData.map(({ id, ...rest }) => rest);

          setAdvReimbursementRecord(listInfo);

          // Update the totalClaims state

          setAdvTotalClaims(allClaims.length);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [setAdvTotalClaims, setAdvReimbursementRecord]);


  useEffect(() => {
  window.scrollTo(0, 0); // Ensures the page scrolls to the top when loaded
}, []);

  //for exit
  useEffect(() => {
    axios
      .get(
        `${BASE_URL}:9029/api/eSeparation/getResignDataByStatus/Pending/${empCode}`
      )
      .then((res) => {
        const count = res.data.length; // assuming res.data is an array
        setExitRecordCount(count);
      })
      .catch((error) => {
        console.error("Error fetching resignation data:", error);
      });
  }, [empCode]);
  

  const cols = [
    {
      name: <div className="text-xs font-medium text-black ml-16">Request</div>,
      maxWidth: "550px",
      cell: (row) => (
        <div className="flex mb-2 hover:cursor-pointer mt-4">
       <img
  src={
    row?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file
      ? `data:${row.fileAndObjectTypeBean.fileAndContentTypeBean.contentType};base64,${row.fileAndObjectTypeBean.fileAndContentTypeBean.file}`
      : '/profile.jpeg'
  }
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // ✅ local default image fallback
  }}
  className="rounded-full h-12 w-12 ml-4"
  alt="Profile"
/>


          <div>
            <div className="ml-12">
              <h3 className="text-base text-gray-800 -ml-8 text-sm">
                {row.fileAndObjectTypeBean.empResDTO.firstName}-{row.empCode}
                <span className="text-gray-500 text-xs px-1">
                  has created the
                </span>
                {row.claimType}
              </h3>
              <h3 className="text-xs text-gray-500 -ml-8">
                {row.fileAndObjectTypeBean.empResDTO.mainDeptResDTO.mainDepartment}
              </h3>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: (
        <div className="text-xs font-medium text-black ml-4">Requested On</div>
      ),
      maxWidth: "200px",
      center: "true",
      selector: (row) => (
        <div className="text-xs ml-2">
          <span className="text-gray-500">{row.createdDate}</span>
        </div>
      ),
    },
    {
      name: (
        <div className="text-xs font-medium text-black ml-4">Due in Days</div>
      ),
      maxWidth: "200px",
      center: "true",
      cell: (row) => {
        const requestedDate = new Date(row.createdDate);
        const currentDate = new Date();
        const timeDiff = Math.abs(
          currentDate.getTime() - requestedDate.getTime()
        );
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return (
          <div className="text-xs ml-2">
            <span className="text-gray-500">Due in {diffDays} Days</span>
          </div>
        );
      },
    },
    {
      name: <div className="text-xs font-medium text-black ml-4"></div>,
      maxWidth: "200px",
      center: "true",

      selector: (row) => (
        <div>
          <div className="text-xl ml-4">
            <button
              className="text-blue-400"
              onClick={() => openManagerApproval(row)}
            >
              <IoIosLogOut />
            </button>
          </div>
        </div>
      ),
    },
  ];

  const advCols = [
    {
      name: <div className="text-xs font-medium text-black ml-16">Request</div>,
      maxWidth: "550px",
      cell: (row) => (
        <div className="flex mb-2 hover:cursor-pointer mt-4">
         <img
  src={
    row?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file
      ? `data:${row.fileAndObjectTypeBean.fileAndContentTypeBean.contentType};base64,${row.fileAndObjectTypeBean.fileAndContentTypeBean.file}`
      : '/profile.jpeg'
  }
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // fallback image
  }}
  className="rounded-full h-12 w-12 ml-4"
  alt="Profile"
/>


          <div>
            <div className="ml-12">
              <h3 className="text-base text-gray-800 -ml-8 text-sm">
                {row.fileAndObjectTypeBean.empResDTO.firstName}-{row.empCode}
                <span className="text-gray-500 text-xs px-1">
                  has created the
                </span>
                {row.claimType}
              </h3>

              <h3 className="text-xs text-gray-500 -ml-8">
                {row.fileAndObjectTypeBean.empResDTO.mainDeptResDTO.mainDepartment}
              </h3>
            </div>
          </div>
        </div>
      ),
    },

    {
      name: (
        <div className="text-xs font-medium text-black ml-4">Requested On</div>
      ),
      maxWidth: "200px",
      center: "true",

      selector: (row) => (
        <div className="text-xs ml-2">
          <span className="text-gray-500">{row.createdDate}</span>
        </div>
      ),
    },

    {
      name: (
        <div className="text-xs font-medium text-black ml-4">Due in Days</div>
      ),
      maxWidth: "200px",
      center: "true",

      cell: (row) => {
        const requestedDate = new Date(row.createdDate);

        const currentDate = new Date();

        const timeDiff = Math.abs(
          currentDate.getTime() - requestedDate.getTime()
        );

        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return (
          <div className="text-xs ml-2">
            <span className="text-gray-500">Due in {diffDays} Days</span>
          </div>
        );
      },
    },

    {
      name: <div className="text-xs font-medium text-black ml-4"></div>,
      maxWidth: "200px",
      center: "true",

      selector: (row) => (
        <div>
          <div className="text-xl ml-4">
            <button
              className="text-blue-400"
              onClick={() => openAdvanceApproval(row)}
            >
              <IoIosLogOut />
            </button>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="">

    <Header/>   
  
      <div className="mt-20 bg-white overflow-y-auto max-h-screen px-4 py-4">
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Appraisal Request" />
        <Tab
          label={<div>
            Reimbursement Request
            <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1">
              {totalClaims}
            </span>
          </div>} />
        <Tab
          label={<div>
            Advance Reimbursement Request
            <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1">
              {advTotalClaims}
            </span>
          </div>} />
        <Tab label="Leave Request" />
        <Tab
  label={
    <div>
      Exit Request
      <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1">
        {exitRecordCount}
      </span>
    </div>
  }
  onClick={() => {
    sessionStorage.setItem('workflowName', 'E-Separation');
  }}
/>
      </Tabs>

      {value === 0 && <div style={{ 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '100vh' 
}}>
  <h2>There are no records to display</h2>
</div>
}
      {value === 1 && (
        <>
          <DataTable columns={cols} data={reimbursementRecord} />
          {showManagerApproval && selectedRow && (
            <ManagerApproval
              rowData={selectedRow}
              onClose={closeManagerApproval} />
          )}
        </>
      )}
      {value === 2 && (
        <>
          <DataTable columns={advCols} data={advReimbursementRecord} />

          {showAdvanceApproval && selectedRow && (
            <ManagerAdvApproval
              rowData={selectedRow}
              onClose={closeAdvanceApproval} />
          )}
        </>
      )}
      {value === 3 && (
  <>
    <h2 className="text-xl font-bold mb-4">Leave and Attendance</h2>
    <AttendancePendingRequests />
  </>
)}

      {value === 4 && <h2><ManagerDashBoardPendingExitForm/></h2>}
    </div>
    </div>
    
  );
};

export default MgrPendingReqDashboard;
