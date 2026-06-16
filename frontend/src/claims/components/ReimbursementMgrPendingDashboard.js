import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoIosLogOut } from "react-icons/io";
import ManagerApproval from "./ManagerApproval";
import { useStore3 } from "./ClaimStore";
import axios from "axios";
import { BASE_URL } from "../../config/Config";
import Header from "../../components/Header";

const ReimbursementMgrPendingDashboard = () => {
  const { totalClaims, setTotalClaims } = useStore3();
  const { reimbursementRecord, setReimbursementRecord } = useStore3();
  const [showManagerApproval, setShowManagerApproval] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const empCode = localStorage.getItem("empId");
const BASE_Claim_URL = `${BASE_URL}`; // Adjust the base URL as needed
  useEffect(() => {
    setTotalClaims(reimbursementRecord.length);
  }, [reimbursementRecord, setTotalClaims]);

  const openManagerApproval = (row) => {
    setSelectedRow(row);
    setShowManagerApproval(true);
  };

  const closeManagerApproval = () => {
    setShowManagerApproval(false);
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
              `${BASE_Claim_URL}:9030/api/claims/getFoodClaimPendingList/${empCode}`
            ),
            axios.get(
              `${BASE_Claim_URL}:9030/api/claims/getTravelClaimPendingList/${empCode}`
            ),
            axios.get(
              `${BASE_Claim_URL}:9030/api/claims/getConveyanceClaimPendingList/${empCode}`
            ),
            axios.get(
              `${BASE_Claim_URL}:9030/api/claims/getMobileClaimPendingList/${empCode}`
            ),
            axios.get(
              `${BASE_Claim_URL}:9030/api/claims/getMiscellaneousClaimPendingList/${empCode}`
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

          const claimUserIds = allClaims.map((claim) => claim.empCode);

          const empInfoPromises = claimUserIds.map((claimUserId) =>
            axios.get(
              `${BASE_Claim_URL}:9030/api/claims/getEmpClaimInfo/${claimUserId}`
            )
          );

          const empInfoResponses = await Promise.all(empInfoPromises);
          const empInfoData = empInfoResponses.map((response) => response.data);

          const mergedData = allClaims.map((claim, index) => ({
            ...claim,
            ...empInfoData[index],
          }));

          const listInfo = mergedData.map(({ id, ...rest }) => rest);
          setReimbursementRecord(listInfo);
          setTotalClaims(listInfo.length);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [empCode, reimbursementRecord, setReimbursementRecord, setTotalClaims]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
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
      center: true,
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
      center: true,
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
      center: true,
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

  return (
    <><Header /><div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-start justify-center p-2 mt-20">
      <div className="w-full bg-white rounded-xl shadow-lg px-4 py-6 m-2" style={{ maxWidth: '100%', minHeight: '70vh' }}>
        <div className="flex items-center mb-6">
          <span className="text-2xl font-bold text-gray-800">
            Reimbursement Request
          </span>
          <span className="ml-3 bg-blue-500 text-white rounded-full px-3 py-1 text-base font-semibold shadow">
            {totalClaims}
          </span>
        </div>
        {(!reimbursementRecord || reimbursementRecord.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-24">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No Data"
              className="w-24 h-24 mb-4 opacity-70" />
            <h2 className="text-lg text-gray-500 font-medium">
              There are no records to display
            </h2>
          </div>
        ) : (
          <>
            <DataTable columns={cols} data={reimbursementRecord} />
            {showManagerApproval && selectedRow && (
              <ManagerApproval
                rowData={selectedRow}
                onClose={closeManagerApproval} />
            )}
          </>
        )}
      </div>
    </div></>
  );
};

export default ReimbursementMgrPendingDashboard;