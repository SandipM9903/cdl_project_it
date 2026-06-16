import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { useStore3 } from "./ClaimStore";
import axios from "axios";
import { BASE_URL } from "../../config/Config";

const MgrPendingReqHomePage = () => {
  const navigate = useNavigate();
  const [pendingCounts, setPendingCounts] = useState({
    travel: 0,
    food: 0,
    conveyance: 0,
    mobile: 0,
    miscellaneous: 0,
  });

  const handleNavigation = (requestType) => {
    navigate(`/approvals/${requestType}`);
  };

  const { totalClaims, setTotalClaims } = useStore3();
  const { reimbursementRecord, setReimbursementRecord } = useStore3();
  const { advTotalClaims, setAdvTotalClaims } = useStore3();
  const { advReimbursementRecord, setAdvReimbursementRecord } = useStore3();
  const [pendingClaims, setPendingClaims] = useState(0);
  console.log("reimbursementRecord>>>>", reimbursementRecord);
  const [exitRecord, setExitRecord] = useStore3((state) => [
    state.exitRecord,
    state.setExitRecord,
  ]);
  const [exitTotalClaims, setExitTotalClaims] = useStore3((state) => [
    state.exitTotalClaims,
    state.setExitTotalClaims,
  ]);

  const empCode = localStorage.getItem('empId');
  console.log("employee id>>>>>>>>>>", empCode);
  useEffect(() => {
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
        const foodClaims = foodResponse.data.filter((claim) => claim !== null);
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

        console.log("all claims data=====", allClaims);
        const claimUserIds = allClaims.map((claim) => claim.empCode);
        console.log("claim user id===", claimUserIds);
        const empInfoPromises = claimUserIds.map((claimUserIds) =>
          axios.get(
            `${BASE_URL}:9030/api/claims/getEmpClaimInfo/${claimUserIds}`
          )
        );

        const empInfoResponses = await Promise.all(empInfoPromises);
        console.log("empInfoResponses>>>>>>><<<<<<", empInfoResponses);
        const empInfoData = empInfoResponses.map((response) => response.data);

        const mergedData = allClaims.map((claim, index) => ({
          ...claim,
          ...empInfoData[index],
        }));
        console.log("noraml claim merged data===", mergedData);
        const listInfo = mergedData.map(({ id, ...rest }) => rest);
        setReimbursementRecord(listInfo);

        // Calculate the number of pending claims for each category
        setPendingCounts({
          travel: travelClaims.length,
          food: foodClaims.length,
          conveyance: conveyanceClaims.length,
          mobile: mobileClaims.length,
          miscellaneous: miscellaneousClaims.length,
        });

        // Update the totalClaims state
        setTotalClaims(allClaims.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setTotalClaims, setReimbursementRecord]);

  useEffect(() => {
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
        console.log("claim user id===", claimUserIds);
        const empInfoPromises = claimUserIds.map((claimUserIds) =>
          axios.get(
            `${BASE_URL}:9030/api/claims/getEmpClaimInfo/${claimUserIds}`
          )
        );

        const empInfoResponses = await Promise.all(empInfoPromises);
        console.log("empInfoResponses>>>>>>><<<<<<", empInfoResponses);
        const empInfoData = empInfoResponses.map((response) => response.data);

        const mergedData = allClaims.map((claim, index) => ({
          ...claim,
          ...empInfoData[index],
        }));
        console.log("merged data===", mergedData);
        const listInfo = mergedData.map(({ id, ...rest }) => rest);
        setAdvReimbursementRecord(listInfo);

        // Update the totalClaims state
        setAdvTotalClaims(allClaims.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setAdvTotalClaims, setAdvReimbursementRecord]);

  console.log("reimbursement record====", reimbursementRecord);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}:9029/api/eSeparation/getResignDataByStatus/Pending/${empCode}`
        );
        const resignData = response.data.filter((data) => data !== null);
        const claimUserIds = resignData.map((item) => item.empCode);
        const empInfoPromises = claimUserIds.map((empCode) =>
          axios.get(
            `${BASE_URL}:9030/api/claims/getEmpClaimInfo/${empCode}`
          )
        );
        const empInfoResponses = await Promise.all(empInfoPromises);
        // Map employee info responses to data objects
        const empInfoData = empInfoResponses.map(
          (response) => response.data[0]
        );
        // Merge the resignation data with employee information
        const mergedData = resignData.map((item, index) => ({
          ...item,
          ...empInfoData[index],
        }));
        // Prepare the final list data (excluding the `id` field)
        const listInfo = mergedData.map(({ id, ...rest }) => rest);
        console.log(listInfo, "List Info");
        // Update Zustand state
        setExitRecord(listInfo);
        setExitTotalClaims(resignData.length);

        console.log("reqqqqqqqqq", resignData.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [empCode, setExitTotalClaims, setExitRecord]);

  useEffect(() => {
    setPendingClaims(totalClaims + advTotalClaims + exitTotalClaims);
  }, [totalClaims, advTotalClaims, exitTotalClaims]);

  

  return (
    <div>
      <div className="bg-gray-200 w-full max-w-md ">
        <div className="bg-white rounded-lg  p-4 ">
         
            <table className="table-auto">
              <thead>
                <tr className=" ">
                  <th className=" absolute right text-sm font-bold text-gray-900">
                    Request For Approval
                  </th>
                  <th className="bg-red-500 text-white rounded-lg w-10 text-center font-semibold ">
                    {pendingClaims}
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleNavigation("Appraisal Request")}
                >
                  <td className="px-4 py-2">Appraisal Request</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center h-6 w-6 rounded-full bg-blue-400 text-white text-sm">
                      0
                    </div>
                  </td>
                  
                  <td className="px-4 py-2">
                    <button
                      className="text-xl ml-12 text-blue-600 mt-2"
                      onClick={() => handleNavigation("Appraisal Request")}
                    >
                      <IoIosLogOut />
                    </button>
                  </td>
                </tr>
                <tr
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleNavigation("Reimbursement Request")}
                >
                  <td className="px-4 py-2">Reimbursement Request</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center h-6 w-6 rounded-full bg-blue-400 text-white text-sm">
                      {totalClaims}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="text-xl ml-12 text-blue-600 mt-2"
                      onClick={() => handleNavigation("Reimbursement Request")}
                    >
                      <IoIosLogOut />
                    </button>
                  </td>
                </tr>

                <tr
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    handleNavigation("Advance Reimbursement Request")
                  }
                >
                  <td className="px-4 py-2">Advance Reimbursement Request</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center h-6 w-6 rounded-full bg-blue-400 text-white text-sm">
                      {advTotalClaims}
                    </div>
                  </td>
                  <td className="px-4 py-2 mt-2">
                    <button
                      className="text-xl ml-12 text-blue-600 mt-2"
                      onClick={() =>
                        handleNavigation("Advance Reimbursement Request")
                      }
                    >
                      <IoIosLogOut />
                    </button>
                  </td>
                </tr>
                <tr
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleNavigation("Leave Request")}
                >
                  <td className="px-4 py-2">Leave Request</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center h-6 w-6 rounded-full bg-blue-400 text-white text-sm">
                      0
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="text-xl ml-12 text-blue-600 mt-2"
                      onClick={() => handleNavigation("Leave Request")}
                    >
                      <IoIosLogOut />
                    </button>
                  </td>
                </tr>
                
                <tr
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    handleNavigation("Exit Request");
                    sessionStorage.setItem("workflowName", "E-Separation");
                  }}
                >
                  <td className="px-4 py-2">Exit Request</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center h-6 w-6 rounded-full bg-blue-400 text-white text-sm">
                      {exitTotalClaims}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="text-xl ml-12 text-blue-600 mt-2"
                      onClick={() => {
                        handleNavigation("Exit Request");
                        sessionStorage.setItem("workflowName", "E-Separation");
                      }}
                    >
                      <IoIosLogOut />
                    </button>
                  </td>

                  
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

  );
};

export default MgrPendingReqHomePage;
