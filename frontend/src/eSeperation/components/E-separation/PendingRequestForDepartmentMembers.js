import React, { useState, useEffect } from "react";
import ExitService from "../../services/ExitService";
import axios from "axios";
import StoreDept from "./DepartmentQuestions/StoreDept";
import AdminDept from "./DepartmentQuestions/AdminDept";
import SalesDept from "./DepartmentQuestions/SalesDept";
import FinanceDept from "./DepartmentQuestions/FinanceDept";
import ITDept from "./DepartmentQuestions/ITDept";
import HRDept from "./DepartmentQuestions/HRDept";
import BUDept from "./DepartmentQuestions/BUDept";
import KTDept from "./DepartmentQuestions/KTDept";
import { FaRegClock, FaArrowRight } from "react-icons/fa";
import DetailedView from "./DetailedView";
import Header from "../../../components/Header";
import BasicEmployeeDetailsForDepartments from "./BasicEmployeeDetailsForDepartments";
import { BASE_URL } from '../../../config/Config';


export const PendingRequestForDepartmentMembers = () => {
  const [data, setData] = useState([]);
  const [wfLevelActions, setWfLevelActions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedSeqId, setSelectedSeqId] = useState(null);
  //const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [actorRemark, setActorRemark] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  console.log(data, "+++++++++++++++++");
  const userId_actor = localStorage.getItem("empId");
  // const [itemStatusInfo, setItemStatusInfo] = useState([]);
  const [deptId, setDeptId] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [selectedDetailEmployee, setSelectedDetailEmployee] = useState(null);
  // console.log(itemStatusInfo.actorId, "{{{{{{{{{{");

  useEffect(() => {
    window.scrollTo(0, 0); // Ensures the page scrolls to the top when loaded
  }, []);
  const getLabel = (emp) => {
    const waiver = emp?.noticePeriodWaiver;
    const waiverByHr = emp?.noticePeriodWaiverByHr;
    const r1Status = emp?.r1Status;

    if (!waiver && !waiverByHr && r1Status === "Pending") {
      return "Last Working Date";
    }

    if (!waiver && !waiverByHr) {
      return "Last Working Date Approved by R1 ";
    }

    if (waiver && !waiverByHr) {
      return "Last Working Date Approved by R1";
    }

    if (!waiver && waiverByHr) {
      return "Last Working Date Approved by HR";
    }

    if (waiver && waiverByHr) {
      return "Last Working Date Approved by HR";
    }

    return "-";
  };
  const openDetailPopup = (employee) => {
    setSelectedDetailEmployee(employee);
    setIsDetailPopupOpen(true);
  };

  const closeDetailPopup = () => {
    setSelectedDetailEmployee(null);
    setIsDetailPopupOpen(false);
  };

  const itemStatus = "Pending,Hold";
  useEffect(() => {

    const fetchData = async () => {
      try {
        // Step 1: Fetch Resignation Details
        let resignData = null;
        console.log(userId_actor, "userId_actoruserId_actor")
        const res = await axios.get(`${BASE_URL}:9028/api/workflow/getexitemployeelist/${userId_actor}/${itemStatus}`);
        resignData = res.data;
        if (resignData.length === 0) {
          console.log("No resignation details found.");
          return;
        }
        console.log(resignData, "Resignation Data before fetching item status");
        const cleanedResignData = (resignData || []).filter(item => item !== null);
        // Remove duplicates based on `wfSeqId`
        // const uniqueResignData =null;
        // const uniqueResignData = [...new Map(resignData.map(item => [item.wfSeqId, item])).values()];
        const uniqueResignData = [
          ...new Map(
            cleanedResignData.map(item => [item.wfSeqId, item])
          ).values()
        ];
        console.log(uniqueResignData, "Unique resignData to prevent duplicate API calls");
        // Step 2: Fetch Item Status for each resignation entry
        const itemStatusResponses = await Promise.all(
          uniqueResignData.map(resignDetail =>
            axios.get(`${BASE_URL}:9028/api/workflow/itemStatus/${resignDetail.wfSeqId}/${userId_actor}/${itemStatus}`)
          )
        );
        console.log(itemStatusResponses, "Raw itemStatusResponses before mapping");
        const itemStatusData = itemStatusResponses.flatMap(response => response.data);
        console.log(itemStatusData, "Final itemStatusData after mapping");

        const mergedResignAndStatusData = itemStatusData.map(itemStatus => {
          const matchingResignDetail = (resignData || []).find(
            resignDetail => resignDetail && resignDetail.wfSeqId === itemStatus.wfSeqId
          ) || {};  // fallback to empty object
          return { ...matchingResignDetail, ...itemStatus };
        });
        console.log(mergedResignAndStatusData, "Merged resignation + item status data");
        // Step 4: Fetch Employee Details
        const employeeResponses = await Promise.all(
          mergedResignAndStatusData.map(resignDetail =>
            axios.get(`${BASE_URL}:9029/api/eSeparation/getEmployee/${resignDetail.empCode}`)
          )
        );
        const empDetails = employeeResponses.map(response => response.data);
        // Step 5: Merge Employee Details with Resignation + Item Status Data
        const finalMergedData = mergedResignAndStatusData.map(resignDetail => {
          const matchingEmpDetail = empDetails.find(empDetail =>
            empDetail.fileAndObjectTypeBean.empResDTO.empCode === resignDetail.empCode
          ) || {}; // Ensure no undefined errors

          return { ...resignDetail, ...matchingEmpDetail };
        });

        setData(finalMergedData);
        console.log(finalMergedData, "Final merged data with employee details");
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [userId_actor]);


  // useEffect(() => {
  //     if (data.length > 0) {
  //         const firstWfSeqId = data[0]?.wfSeqId;

  //         if (firstWfSeqId) {
  //             axios.get(`http://43.205.24.208:9001/api/workflow/itemStatus/${firstWfSeqId}/${userId_actor}`)
  //                 .then((res) => {
  //                     setItemStatusInfo(res.data);
  //                     console.log(res.data, "Item Status Data");
  //                 })
  //                 .catch((error) => {
  //                     console.log("Error fetching item status details", error);
  //                 });
  //         }
  //     }
  // }, [data, userId_actor]);

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return "-";
    }
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // useEffect(() => {
  //     axios.get(`http://43.205.24.208:9001/api/workflow/getexitemployeelist/${userId_item_value}`)
  //         .then(res => {
  //             setData(res.data);
  //             console.log("response data =======", res.data);
  //         })
  //         .catch((error) => {
  //             console.error(error);
  //             alert("Error fetching data");
  //         });
  // }, [userId_item_value]);

  const selectOption = (seqId, userId_actor) => {
    ExitService.getWfLevelActions(seqId, userId_actor)
      .then((response) => {
        setWfLevelActions(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert("Error occurred while fetching actions.");
      });
  };

  const handleOptionChange = (event, seqId) => {
    const selectedValue = event.target.value;
    setSelectedSeqId(seqId);
    //setIsRemarkModalOpen(true);

    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [seqId]: selectedValue,
    }));
  };

  const openPopup = (employee) => {
    setDeptId(employee.deptId);
    setSelectedEmployee(employee);
    setIsPopupOpen(true);
    // if (employee.wfSeqId) {
    //   axios
    //     .get(
    //       `http://localhost:9028/api/workflow/itemStatus/${employee.wfSeqId}/${userId_actor}`
    //     )
    //     .then((res) => {
    //       setItemStatusInfo(res.data);
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching item status details", error);
    //     });
    // }
  };

  const closePopup = () => {
    // setItemStatusInfo([]);
    setDeptId(null);
    setSelectedEmployee(null);
    setIsPopupOpen(false);
  };
  let roles = [];
  try {
    roles = JSON.parse(sessionStorage.getItem("role")) || [];
  } catch (e) {
    console.error("Error parsing roles from sessionStorage:", e);
  }

  // Function to check if the user has a specific role
  const hasRole = (role) => roles.includes(role);
  return (
    <div className="">
      <Header />
      <div className=" mt-20 bg-white-300 h-screen">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-lg text-gray-900 font-semibold mx-16 mt-6">
                Pending Exit List
              </h1>
            </div>
          </div>
          {data.length === 0 ? (
            <div className="mt-10 text-center text-gray-700">
              <h2 className="text-l font-semibold">
                There are no pending requests for this user.
              </h2>
            </div>
          ) : (
            <>
              {data.map((employee, index) => (
                <div
                  key={`${employee.id}-${index}`}
                  className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 lg:mx-16 md:mx-8 mx-4 mt-6 border rounded-lg border-gray-500 p-2 shadow-bottom bg-white"
                >
                  <div className="col-span-1 text-center">
                    <h1 className="text-gray-600 font-semibold">
                      Employee Name
                    </h1>
                    {employee?.fileAndObjectTypeBean?.fileAndContentTypeBean
                      ? (
                        <img
                          src={`data:${employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.contentType};base64,${employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file}`}
                          // src={fileUrl}
                          className="h-[12vh] w-[14vh] rounded-full mt-7 mx-auto"
                          alt="Profile"
                        />
                      ) : (
                        <img
                          src="/profile.webp"
                          className="rounded-full h-[12vh] w-[14vh] mx-auto mt-3"
                          alt="Default Profile"
                        />
                      )}
                    {/* <img src="logo512.png" alt="ProfilePicture" className="h-[12vh] w-[14vh] rounded-full mt-7 mx-auto" /> */}
                    <h1 className="text-sm text-blue-700 font-semibold">
                      {employee?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar}
                    </h1>
                    <h1 className="text-xs -mt-1 text-gray-600">
                      {employee?.fileAndObjectTypeBean?.empResDTO?.designation}
                    </h1>
                    <h1 className="text-gray-800 text-xs">
                      {employee?.fileAndObjectTypeBean?.empResDTO?.empCode}
                    </h1>
                  </div>
                  <div className="col-span-1">
                    <h1 className="mx-4 text-gray-600 font-semibold">
                      Exit Info
                    </h1>
                    <div className="">
                      <div className="grid grid-cols-2  text-xs text-gray-700 p-2">
                        <h1 className="mt-2">Joining Date</h1>
                        <h1 className="mt-2 text-[#00007D]">
                          {formatDate(
                            employee?.fileAndObjectTypeBean?.empResDTO?.dateOfJoining
                          ) || "-"}
                        </h1>
                      </div>
                      <div className="grid grid-cols-2 text-xs text-gray-700 p-2">
                        <h1 className="">Resignation Date</h1>
                        <h1 className=" text-[#00007D]">
                          {formatDate(employee?.dateOfResignation) || "-"}
                        </h1>
                      </div>
                      <div className="grid grid-cols-2 text-xs text-gray-700 p-2">
                        <h1>{getLabel(employee)}</h1>
                        <h1 className="text-[#00007D]">
                          {employee?.expectedLastWorkingDay
                            ? formatDate(employee?.expectedLastWorkingDay) || "-"
                            : formatDate(employee?.lastWorkingDay) || "-"
                          }

                        </h1>
                      </div>

                      <div className="grid grid-cols-2 text-xs text-gray-700 p-2">
                        <h1 className="">Hr Remarks to Reviewer</h1>
                        <h1 className=" text-[#00007D]">
                          {employee?.hrRemarksToReviewer || "-"}
                        </h1>
                      </div>
                      {/* <div className="grid grid-cols-2 text-xs text-gray-700 p-2">
                        <h1>
                          Last Working <br></br>requested Date
                        </h1>
                        <h1 className="text-[#00007D]">
                          {formatDate(employee?.lastWorkingDayRequest) || "-"}
                        </h1>
                      </div> */}
                    </div>
                  </div>
                  <div className="col-span-1 lg:ml-4 md:ml-4 -ml-1">
                    <h1 className="text-gray-600 font-semibold mx-4">
                      Exit Reason
                    </h1>
                    <h1 className="text-gray-800 font-semibold text-sm mt-3 mx-6">
                      {employee?.reason || "-"}
                    </h1>


                    {/* Status Section */}
                    <h1 className="text-gray-600 font-semibold mx-4 mt-6">
                      Status
                    </h1>
                    <h1
                      className={`text-gray-900 p-1 px-3 font-semibold mt-2 mx-4 inline-block mr-6 rounded-md ${employee.status === "Pending" ? "bg-[#FFF44F]" : "bg-[#FF4C4C]"
                        }`}
                    >
                      {employee.status}
                    </h1>


                  </div>

                  <div className="col-span-1 text-center mt-10 mb-10">
                    <button
                      className="hover:bg-[#1B5CAD] bg-[#2970c7] text-white py-2 px-6"
                      onClick={() => openPopup(employee)}
                    >
                      {" "}
                      Click Here
                    </button>
                    {/* <button
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 mt-3"
                      onClick={() => openDetailPopup(employee)}
                    >
                      View Details
                    </button> */}
                    <button
                                    className="flex items-center text-blue-600 border-blue-500 gap-2 ml-[80px] mr-10 mt-10 py-2 hover:bg-blue-50 font-semibold rounded-md  px-1"
                                    onClick={() => openDetailPopup(employee)}>
                                    View Details <FaArrowRight />
                                  </button>
                    {isDetailPopupOpen && selectedDetailEmployee && (
                      <div className="fixed top-10 left-20 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="w-[60%] h-[80vh] bg-white relative overflow-y-auto rounded-lg shadow-lg p-4">
                          <BasicEmployeeDetailsForDepartments
                            selectedEmployee={selectedDetailEmployee}
                            onClose={closeDetailPopup}
                          />
                        </div>
                      </div>
                    )}

                    {isPopupOpen && selectedEmployee && (
                      <div className="fixed top-10 left-20 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="w-[60%] h-[80vh] -top-6 pb-3 bg-white relative overflow-y-auto rounded-lg shadow-lg p-4">

                          {/* <DetailedView selectedEmployee={selectedEmployee} itemStatusInfo={itemStatusInfo} onClose={closePopup} /> */}
                          {deptId === 2 && (
                            <KTDept
                              selectedEmployee={selectedEmployee}
                              onClose={closePopup}
                            />
                          )}
                          {deptId === 3 && (
                            <SalesDept
                              selectedEmployee={selectedEmployee}
                              onClose={closePopup}
                            />
                          )}
                          {deptId === 4 && (
                            <StoreDept
                              selectedEmployee={selectedEmployee}
                              onClose={closePopup}
                            />
                          )}
                          {deptId === 5 && (
                            <AdminDept
                              selectedEmployee={selectedEmployee}
                              onClose={closePopup}
                            />
                          )}
                          {deptId === 6 && (
                            <FinanceDept
                              selectedEmployee={selectedEmployee}
                              onClose={closePopup}
                            />
                          )}
                          {selectedEmployee?.actorId === userId_actor &&
                            deptId === 0 && (
                              <FinanceDept
                                selectedEmployee={selectedEmployee}
                                onClose={closePopup}
                              />
                            )}
                          {deptId === 7 && (
                            <ITDept
                              selectedEmployee={selectedEmployee}
                              onClose={closePopup}
                            />
                          )}
                          {deptId === 8 && (
                            <HRDept
                              selectedEmployee={selectedEmployee}
                              onClose={closePopup}
                            />
                          )}
                          {deptId === 9 && (
                            <BUDept
                              selectedEmployee={selectedEmployee}
                              onClose={closePopup}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingRequestForDepartmentMembers;
