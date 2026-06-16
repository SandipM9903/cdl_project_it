import React, { useEffect, useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import axios from "axios";
import ExitFormFNF from "./ExitFormFNF";
import ViewDetails from "./ViewDetails";
import { useNavigate } from "react-router";
import { IoEyeSharp } from "react-icons/io5";
import ExitInterviewForm from "./ExitInterviewForm";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { TiTick } from "react-icons/ti";
import { FaRegClock, FaArrowRight } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { BASE_URL } from '../../../config/Config';
function EmployeeExitPastHistory({ resignationDetails, employeeDetails, resignationData }) {
    const [popupOpen, setPopupOpen] = useState(false);
    const [detailsPopup, setDetailsPopup] = useState(false);
    const [selectedResignation, setSelectedResignation] = useState(null);
    const [fnfData, setFNFData] = useState([]);
    console.log(resignationDetails, "resignationDetailsresignationDetails");
    const [imageUrl, setImageUrl] = useState([]);
    // const empCode = employeeDetails.empCode
    const empCode = localStorage.getItem('empCode');
    const navigate = useNavigate();
    const [feedbackPopup, setFeedbackPopup] = useState(false);
    const [submittedFeedback, setSubmittedFeedback] = useState({});



    const workflowName1 = sessionStorage.getItem("workflowName");
    console.log("WorkFlowName;;;;;;;;55656;;;;;" + workflowName1)
    // const wfSeqId1 = resignationDetails.wfSeqId;
    // console.log("wfseqId;;;;;;;;55656;;;;;"+wfSeqId1)
    const approvedResignation = resignationDetails.find(
        (resignation) => resignation.hrStatus === "Approved"
    );

    function handleFeedbackSubmitted(resignId) {
        setSubmittedFeedback((prev) => ({
            ...prev,
            [resignId]: true,
        }));
        closeExitInterview();
    }
    useEffect(() => {
        // Check if the hrStatus is approved before making the request



        if (approvedResignation) {
            axios
                .get(
                    `${BASE_URL}:9029/api/eSeparation/getExitFormDetails/${approvedResignation.wfSeqId}`
                )
                .then((res) => {
                    setFNFData(res.data);
                })
                .catch(() => {
                    console.log("No data filled yet");
                });
        } else {
            console.log("No resignation with approved HR status found");
        }
    }, [resignationDetails]);


    function fillFNFForm(resignation) {
        setPopupOpen(true);
        setSelectedResignation(resignation);
    }

    function closeFNF() {
        resignationData();
        setPopupOpen(false);
        setSelectedResignation(null);
    }

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

    function viewDetails(resignation) {
        setSelectedResignation(resignation);
        setDetailsPopup(true);
    }

    function closeDetails() {
        setSelectedResignation(null);
        setDetailsPopup(false);
    }

    const handleStatusTracker = (wfSeqId, workflowName) => {
        console.log("Claim Number:", wfSeqId);
        // console.log("seqid====",resign.wfSeqId)
        console.log("Claim Type:", workflowName);
        // sessionStorage.setItem("workflowname", workflowName);
        // sessionStorage.setItem("wfSeqId", wfSeqId);
        navigate('/workflowstatusTracker', { state: { wfSeqId } });
    };

    function openExitInterview(resignation) {
        setSelectedResignation(resignation);
        setFeedbackPopup(true);
    }
    function closeExitInterview() {
        setSelectedResignation(null);
        setFeedbackPopup(false);
    }

    return (

         <div className='py-6'>
              {resignationDetails?.filter((item) => item.overAllStatus === "In progress")
                .length > 0 && fnfData.exitFormStatus !== "Submitted" && (
                  <div className="flex items-center gap-16 bg-[#FDFFAF] py-6 px-8 mx-10 mt-5">
                    <div>
                      <h1 className="text-gray-500 text-5xl">
                        <BsExclamationCircle />
                      </h1>
                    </div>
                    <div className="text-base font-semibold">
                      <h1 className="text-gray-900">Pending Task Message Alert</h1>
                      <p className="text-gray-500">
                        Complete your Exit Process by submitting the Exit Form. Please
                        click 'Initiate Exit Process' in the Exit Process.
                      </p>
                    </div>
        
                  </div>
                )}
              {resignationDetails?.filter(
                (resign) =>
                 resign.overAllStatus === "Withdrawn" ||
                    resign.overAllStatus === "Closed"  ||
                    resign.overAllStatus === "Exited"  ||
                    resign.overAllStatus === "Rejected"
              ).map((resign) => (
                <div
                  key={resign.id}
                // className="bg-white grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 mx-4 mt-4 border rounded-lg border-gray-500 p-2 shadow-bottom"
                >
                  <div className='bg-[#FAFAFA] rounded-[34px] shadow-lg pt-4 pb-4 mb-6'>
                    {/* Top Header */}
                    {/* Top Header */}
                    <div className='flex items-center gap-3  pl-4 pb-3 mt-4'>
                      {/* Profile Section */}
                      {employeeDetails?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file ? (
                        <img
                          src={`data:${employeeDetails.fileAndObjectTypeBean.fileAndContentTypeBean.contentType};base64,${employeeDetails.fileAndObjectTypeBean.fileAndContentTypeBean.file}`}
                          className="h-10 w-10 rounded-full ml-6"
                          alt="ProfilePicture"
                        />
                      ) : (
                        <img
                          src="profile.webp"
                          className="h-10 w-10 rounded-full ml-6"
                          alt="ProfilePicture"
                        />
                      )}
        
                      <div>
                        <h1 className='text-sm font-medium'>
                          {employeeDetails?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar || "-"}
                        </h1>
                        <div className='flex flex-wrap items-center space-x-2 mt-1 text-xs text-[#49454F]'>
                          <span className='flex items-center'>
                            <MdOutlineMailOutline className='mr-1' />
                            {employeeDetails?.fileAndObjectTypeBean?.empResDTO?.emailId || "-"}
                          </span>
                        </div>
                      </div>
        
                      {/* Status Section (Responsive) */}
                      <div className='ml-auto col-span-2 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end sm:gap-4 px-4 py-2'>
                        {/* R1 Status */}
        
                        <div className='flex flex-col sm:flex-row sm:items-center gap-1'>
                          <h1 className='text-[12px] text-[#757575]'>R1 Approval Status</h1>
                          <h1
                            className={`text-[14px] border rounded-[20px] px-2 py-1 flex items-center font-medium
                            ${resign.r1Status === "Approved"
                                ? "text-green-600 bg-green-100 border-green-600"
                                : resign.r1Status === "Rejected"
                                  ? "text-red-600 bg-red-100 border-red-600"
                                  : "text-[#FF9500] bg-[#FF950033] border-[#FF9500]"
                              }`}
                          >
                            {resign.r1Status === "Approved" && <TiTick className='mr-1' />}
                            {resign.r1Status === "Rejected" && <FaCircleXmark className='mr-1' />}
                            {!(resign.r1Status === "Approved" || resign.r1Status === "Rejected") && <FaRegClock className='mr-1' />}
                            <span className='text-[#000000]'>{resign.r1Status}</span>
                          </h1>
                        </div>
        
                        {/* HR Status */}
                        <div className='flex flex-col sm:flex-row sm:items-center gap-1'>
                          <h1 className='text-[12px] text-[#757575]'>HR Status</h1>
                          <h1
                            className={`text-[14px] border rounded-[20px] px-2 py-1 flex items-center font-medium
                              ${resign.hrStatus === "Approved"
                                ? "text-green-600 bg-green-100 border-green-600"
                                : resign.hrStatus === "Rejected"
                                  ? "text-red-600 bg-red-100 border-red-600"
                                  : "text-[#FF9500] bg-[#FF950033] border-[#FF9500]"
                              }`}
                          >
                            {resign.hrStatus === "Approved" && <TiTick className='mr-1' />}
                            {resign.hrStatus === "Rejected" && <FaCircleXmark className='mr-1' />}
                            {!(resign.hrStatus === "Approved" || resign.hrStatus === "Rejected") && <FaRegClock className='mr-1' />}
                            <span className='text-[#000000]'>{resign.hrStatus}</span>
                          </h1>
                        </div>
        
        
                        {/* Overall Status */}
        
                        <div className='flex flex-col sm:flex-row sm:items-center gap-1'>
                          <h1 className='text-[12px] text-[#757575]'>Overall Status</h1>
                          <h1
                            className={`text-[14px] border rounded-[20px] px-2 py-1 flex items-center font-medium
                             ${resign.overAllStatus === "Approved"
                                ? "text-green-600 bg-green-100 border-green-600"
                                : resign.overAllStatus === "Rejected"
                                  ? "text-red-600 bg-red-100 border-red-600"
                                  : "text-[#FF9500] bg-[#FF950033] border-[#FF9500]"
                              }`}
                          >
                            {resign.overAllStatus === "Approved" && <TiTick className='mr-1' />}
                            {resign.overAllStatus === "Rejected" && <FaCircleXmark className='mr-1' />}
                            {!(resign.overAllStatus === "Approved" || resign.overAllStatus === "Rejected") && <FaRegClock className='mr-1' />}
                            <span className='text-[#000000]'>{resign.overAllStatus}</span>
                          </h1>
                        </div>
        
                      </div>
                    </div>
        
                    {/* 🔹 border after Overall Status */}
                    <div className="border-b mx-4"></div>
        
                    {/* Resignation Info */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:border-b mx-4'>
                      <div>
                        <h1 className='text-[14px] text-[#757575]'>Date of Resignation</h1>
                        <h1 className='text-[14px] font-medium text-[#000000]'>{formatDate(resign.dateOfResignation) || "-"}</h1>
                      </div>
                      <div>
                        <h1 className='text-[14px] text-[#757575]'>Requested Last Working Day</h1>
                        <h1 className='text-[14px] font-medium text-[#000000]'>{formatDate(resign.lastWorkingDayRequest) || "NA"}</h1>
                      </div>
                      <div>
                        <h1 className='text-[14px] text-[#757575]'>As per Notice Period (LWD)</h1>
                        <h1 className='text-[14px] font-medium text-[#000000]'>{formatDate(resign.lastWorkingDay) || "-"}</h1>
                      </div>
                      <div>
                        <h1 className='text-[14px] text-[#757575]'>Last Working Day (LWD)</h1>
                        <h1 className='text-[14px] font-medium text-[#000000]'>{formatDate(resign.expectedLastWorkingDay) || "-"}</h1>
                      </div>
        
                    </div>
        
        
                    {/* Reason and CTA */}
                    {/* Reason and Remarks */}
                    <div className='grid grid-cols-1 sm:grid-cols-4 gap-4 px-4 py-2 mx-4'>
                      <div>
                        <h1 className='text-[14px] text-[#757575]'> Exit Type</h1>
                        <h1 className='text-[14px] font-medium text-[#000000]'>{resign.exitType || "-"}</h1>
                      </div>
                      <div>
                        <h1 className='text-[14px] text-[#757575]'>Reason for Exit</h1>
                        <h1 className='text-[14px] font-medium text-[#000000]'>{resign.reason || "-"}</h1>
                      </div>
        
                      <div>
                        <h1 className='text-[14px] text-[#757575]'>Remarks</h1>
                        <h1 className='text-[14px] font-medium text-[#000000]'>{resign.remarks || "-"}</h1>
                      </div>
                    </div>
        
                    {/* View Details button */}
                    <div className='flex justify-end px-4 py-1 mx-4'>
                      <button
                        className='flex items-center gap-2 font-medium text-[#DC3545] hover:text-red-600 transition-colors'
                        onClick={() => viewDetails(resign)}
                      >
                        View Details <FaArrowRight />
                      </button>
        
                      {resign.overAllStatus === "Interview Initiated" && (
                        <button
                          className={`text-green-600 p-1 px-2 font-semibold lg:mt-[70px] md:mt-[30px] mt-[10px] ml-5 ${submittedFeedback[resign.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={submittedFeedback[resign.id]}
                          onClick={() => {
                            if (!submittedFeedback[resign.id]) {
                              openExitInterview(resign);
                            }
                          }}
                        >
                          {submittedFeedback[resign.id] ? 'Feedback Submitted' : 'Stay Interview Form'}
                        </button>
                      )}
                    </div>
        
                    {/* {openExitInterview && ( <ExitInterviewForm/>)} */}
                    {feedbackPopup && (
                      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="w-[80%] h-[90%] bg-white relative overflow-y-auto">
                          <ExitInterviewForm
                            resignationDetails={selectedResignation}
                            closeExitInterview={closeExitInterview}
                            onSubmitSuccess={() => handleFeedbackSubmitted(selectedResignation.id)}
                          />
                        </div>
                      </div>
                    )}
        
                    {detailsPopup && selectedResignation && (
                      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div
                          className={`w-[80%] ${"h=<[90%]" ? "h-auto" : "h-[90%]"
                            } bg-white relative overflow-y-auto`}
                        >
                          <ViewDetails
                            closeDetails={closeDetails}
                            closeFNF={closeFNF}
                            fillFNFForm={fillFNFForm}
                            employeeDetails={employeeDetails}
                            resignationDetails={selectedResignation}
                          />
                        </div>
                      </div>
                    )}
        
                    <div className="col-span-1 lg:w-48 md:w-48 w-full mx-4 lg:ml-0 md:ml-2 -ml-1 ">
                    
                      {(resign.overAllStatus === "In progress" || resign.overAllStatus === "Completed") && (
                        <>
                          <button
                            className={`inline-block px-2 border border-blue-600 text-blue-600 font-semibold rounded-md mt-7 py-1 text-sm text-center ${fnfData.exitFormStatus === 'Submitted' ? 'lg:mx-9 md:mx-10 mx-4' : 'ml-3'}`} onClick={() => { fillFNFForm(resign) }}>{fnfData.exitFormStatus === 'Submitted' ? 'View FNF Form' : 'Fill & Submit FNF Form'}
                          </button>
                          {popupOpen && (
                            <div className=" fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-70 flex justify-center items-center">
                              <div className="w-[75%] h-[90%] bg-white relative overflow-y-auto z-200">
                                <ExitFormFNF
                                  closeFNF={closeFNF}
                                  resignationDetails={selectedResignation}
                                  resignationData={resignationData}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
        
                  </div>
                </div>
              ))}
            </div>
               );
}

export default EmployeeExitPastHistory;
     
 
