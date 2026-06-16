import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { IoEnterOutline } from "react-icons/io5";
import { CgCloseO } from "react-icons/cg";
import axios from "axios";
import { useStore1, useStore3 } from "./ClaimStore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IoEyeSharp } from "react-icons/io5";
import { BASE_URL } from "../../config/Config";

const ManagerAdvApproval = ({ rowData, onClose }) => {
  const [rowDataInfo, setRowDataInfo] = useState([]);
  const [cols, setCols] = useState([]);
  const [wfLevelActions, setWfLevelActions] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [actorRemark, setActorRemark] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const { advReimbursementRecord, setAdvReimbursementRecord } = useStore3();
  const navigate = useNavigate();
  const empCode = localStorage.getItem("empId");
  const [comment, setComment] = useState("");
  const comments = rowData?.empComments ? rowData.empComments.split(",") : [];
  const commentDates = rowData?.empCommentDateTime
    ? rowData.empCommentDateTime.split(",")
    : [];
    const { viewDetailsBtnInfo } = useStore1();
    const [filteredAction, setFilteredAction] = useState("");

  const ReadOnlyInputCell = ({ value }) => (
    <input
      type="text"
      value={value}
      readOnly
      className="border border-gray-300  text-gray-700  w-full h-8 p-1"
    />
  );

  useEffect(() => {
    if (rowData) {
      setRowDataInfo([rowData]);

      let columns = [];
      if (rowData.claimType === "RTA") {
        columns = [
          {
            name: <span className="text-base font-semibold">S.No</span>,
            selector: (row) => 1,
          },
          {
            name: <span className="text-base font-semibold">Date</span>,
            selector: (row) => <ReadOnlyInputCell value={row.date} />,
          },
          {
            name: <span className="text-base font-semibold">Purpose</span>,
            selector: (row) => <ReadOnlyInputCell value={row.purpose} />,
          },
          {
            name: <span className="text-base font-semibold">Currency</span>,
            selector: (row) => <ReadOnlyInputCell value={row.currency} />,
          },
          {
            name: <span className="text-base font-semibold">Amount</span>,
            selector: (row) => <ReadOnlyInputCell value={row.amount} />,
          },
          {
            name: <span className="text-base font-semibold">Documents</span>,
            selector: (row) => (
              <button
                onClick={() => handleOpenPendingDoc(row.docId)}
                className="cursor-pointer text-blue-500 hover:text-blue-700 px-7 text-sm"
                title=" View Document"
              >
                <IoEyeSharp />
              </button>
            ),
          },
        ];
      } else if (rowData.claimType === "IOU") {
        columns = [
          {
            name: <span className="text-base font-semibold">S.No</span>,
            selector: (row) => 1,
          },
          {
            name: <span className="text-base font-semibold">Date</span>,
            selector: (row) => <ReadOnlyInputCell value={row.date} />,
          },
          {
            name: <span className="text-base font-semibold">Purpose</span>,
            selector: (row) => <ReadOnlyInputCell value={row.purpose} />,
          },
          {
            name: <span className="text-base font-semibold">Currency</span>,
            selector: (row) => <ReadOnlyInputCell value={row.currency} />,
          },
          {
            name: <span className="text-base font-semibold">Amount</span>,
            selector: (row) => <ReadOnlyInputCell value={row.amount} />,
          },
          {
            name: <span className="text-base font-semibold">Documents</span>,
            selector: (row) => (
              <button
                onClick={() => handleOpenPendingDoc(row.docId)}
                className="cursor-pointer text-blue-500 hover:text-blue-700 px-7 text-sm"
                title=" View Document"
              >
                <IoEyeSharp />
              </button>
            ),
          },
        ];
      }
      setCols(columns);
    }
  }, [rowData]);

  useEffect(() => {
    if (rowData) {
      const fetchActions = async () => {
        try {
          // const response = await axios.get(`/api/wflevelactions?seqId=${rowData.wfSeqId}`);
          const response = await axios.get(
            `${BASE_URL}:9028/api/workflow/getWfLevelActions/${rowData.claimNum}/${empCode}/${rowData.wfItemSeqNum}`
          );
          setWfLevelActions(response.data);
        } catch (error) {
          console.error("Error fetching workflow level actions", error);
        }
      };
      fetchActions();
    }
  }, [rowData]);

  const handleActionClick = (action) => {
    const filteredAction = action.replace(/[^a-zA-Z]/g, "");
    setFilteredAction(filteredAction);
    setSelectedAction(action);
    setPopupVisible(true);
  };

  const handleActionConfirmation = async () => {    
    try {
     // const url = `${BASE_URL}:9028/api/workflow/getActions/${rowData.claimNum}/${empCode}/${actorRemark}?selectedOption=${selectedAction}`;
       const url =  `${BASE_URL}:9028/api/workflow/getActions/${rowData.claimNum}/${empCode}/${actorRemark}/${rowData.wfItemSeqNum}?selectedOption=${selectedAction}`;
            
      const response = await axios.get(url);

      // Display the success message from the response
      // alert(`Manager has been ${response.data}`);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "custom-toast",
        },
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: "success",
        title: `Manager has been ${response.data}`,
      }).then(() => {
        setPopupVisible(false);
        window.location.reload();
      });
    } catch (error) {
      console.error("Error handling action confirmation", error);
      alert(
        "An error occurred while processing your request. Please try again."
      );
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  

  const submitMgrComment = () => {
    if (comment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }
    const wfSeqId = rowData.claimNum;
    const url = `${BASE_URL}:9028/api/workflow/sendComments/${wfSeqId}/${empCode}`;
    axios
      .post(url, comment, { headers: { "Content-Type": "text/plain" } }) // Sending comment as plain text
      .then((response) => {
        console.log(`Comment posted successfully:`, response.data);
        // alert("Comment added successfully!");
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "custom-toast",
          },
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Message sent successfully!",
        });
        setComment("");
        fetchMgrComment();
      })
      .catch((error) => {
        console.error(`Error posting comment:`, error);
        alert("Failed to post comment. Please try again.");
      });
  };
  useEffect(() => {
    if(viewDetailsBtnInfo){
    fetchMgrComment();}
  }, [rowData]);
  const [commentFetched, setCommentFetched] = useState([]);
  const fetchMgrComment = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}:9028/api/workflow/getAllComments/${rowData.claimNum}`
      );
      setCommentFetched(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleOpenPendingDoc = (docId) => {
    const docViewerUrl = `/doc-viewer/${docId}`;
    window.open(docViewerUrl, "_blank");
  };

  return (
    <div className="">
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4 z-50">
        <div className="bg-white md:p-8 p-3 rounded-lg h-full md:w-full w-[412px] flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-sm font-semibold">Request No: {rowData.claimNum}</h1>
            <button onClick={onClose}>
              <CgCloseO className="text-red-600 text-sm" />
            </button>
          </div>
          <div className="pt-2">
            <div className="border border-gray-300 shadow-md p-2">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                 
                  <div className="grid grid-cols-5 border-b-[1px] border-gray-200 p-3">
                    <div className="col-span-2 text-gray-500 font-medium ">
                      Employee Name
                    </div>
                    <div className="col-span-3 font-medium text-gray-700 ml-5">
                      {rowData.fileAndObjectTypeBean.empResDTO.fullNameAsAadhaar}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 border-b-[1px] border-gray-200 p-3">
                    <div className="col-span-2 text-gray-500 font-medium">
                      Email
                    </div>
                    <div className="col-span-3 font-medium text-gray-700 ml-5">
                      {rowData.fileAndObjectTypeBean.empResDTO.emailId}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 border-b-[1px] border-gray-200 p-3">
                    <div className="col-span-2 text-gray-500 font-medium">
                      Employee Code
                    </div>
                    <div className="col-span-3 font-medium text-gray-700 ml-5">
                      {rowData.empCode}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 border-b-[1px] border-gray-200 p-3">
                    <div className="col-span-2 text-gray-500 font-medium">
                      Reporting manager
                    </div>
                    <div className="col-span-3 font-medium text-gray-700 ml-5">
                      {rowData.fileAndObjectTypeBean.empResDTO.reportingManager}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 border-b-[1px] border-gray-200 p-3">
                    <div className="col-span-2 text-gray-500 font-medium">
                      Mobile Number
                    </div>
                    <div className="col-span-3 font-medium text-gray-700 ml-5">
                      {rowData.fileAndObjectTypeBean.empResDTO.primaryContactNo}
                    </div>
                  </div>
                  <div className="flex md:space-x-36 space-x-[70px] p-3 mt-3 md:text-base text-sm">
                    <div className="font-medium text-gray-700">WBS</div>
                    <div className="ml-5">{rowData.wbsId}</div>
                  </div>
                  <div className="p-3">
                    <h4 className="md:my-2 my-4 md:text-sm text-xs">
                      Choose Advance Type to Continue
                    </h4>
                    <div className="flex md:space-x-20 space-x-2 md:text-base text-sm">
                      <h3 className="font-medium text-gray-700">
                        Advance Type
                      </h3>
                      <select className="ml-5 border border-gray-300" disabled>
                        <option>{rowData.claimType}</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex md:space-x-24 space-x-6 p-3 md:text-base text-sm">
                    <h3>Description</h3>
                    <input
                      disabled
                      type="text"
                      id="desc"
                      className="h-[80px] w-[380px] border border-gray-300"
                      value={rowData.description}
                    />
                  </div>
                </div>
                <div className="col-span-3 text-center">
                  <div className="flex text-sm font-semibold ml-24">
                    <h2>Status : </h2>
                    <h2 className="text-red-500 ml-2">Pending</h2>
                  </div>
                  <div className="border border-gray-300 shadow-lg w-60 h-[154px] text-center p-4 mt-32 ml-8">
                    <h1 className="mt-7 font-medium">Total Advance Amount</h1>
                    <div className="text-red-500 mt-2 text-sm">
                      INR {rowData.amount}
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
                  <h2 className="mb-10 text-sm font-semibold text-center">
                    Application History
                  </h2>
                  <div className="border-l-[2px] border-gray-300">
                    <div className="justify-between items-center p-4">
                      <h2 className="text-sm font-medium text-red-500">
                        Pending
                      </h2>
                      <div className="flex">
                        <div className="text-gray-400 font-medium mr-2">
                          With
                        </div>
                        <div className="text-gray-700 font-medium">Manager</div>
                      </div>
                    </div>
                    <div className="flex p-4">
                      <input
                        className="border border-gray-300 w-full text-sm p-2"
                        placeholder="Enter your text..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <IoEnterOutline
                        className="ml-[-2rem] mt-1 text-sm cursor-pointer"
                        onClick={submitMgrComment}
                      />
                    </div>
                    <div className="mt-3 p-4 text-base">
                      {commentFetched.length > 0 ? (
                        <ul>
                          {commentFetched.map((comment, index) => (
                            <li key={index}>
                              <p className="text-gray-600 font-normal">
                                <strong>{comment.employeeName}</strong> added a{" "}
                                <strong>Comment</strong>
                              </p>
                              <p className="text-gray-500">
                                {comment.comments}
                              </p>
                              <p className="text-gray-400 font-medium mb-4">
                                {comment.commentDateTime}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No comments available.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <h2 className="text-sm font-semibold">Advance Details</h2>
              <DataTable
                data={rowDataInfo}
                columns={cols}
                className="border border-gray-300 shadow-md mt-2"
              />

              <div className="flex justify-center items-center h-full mt-4">
                <div className="flex flex-wrap gap-2">
                  {wfLevelActions &&
                    wfLevelActions.map((action, index) => {
                      // Remove any non-alphabet characters
                      const filteredAction = action.replace(/[^a-zA-Z]/g, "");

                      // Only display buttons for "Reject" and "Approve"
                      if (
                        filteredAction === "Reject" ||
                        filteredAction === "Approve"
                      ) {
                        return (
                          <button
                            key={index}
                            className={`py-2 px-4 rounded-md ${
                              filteredAction === "Reject"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            } text-white`}
                            onClick={() => handleActionClick(action)}
                          >
                            {filteredAction}
                          </button>
                        );
                      }

                      return null;
                    })}
                </div>
              </div>

              {popupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
                  <div className="bg-white p-4 rounded-lg w-full md:w-1/3">
                    <h2 className="text-sm font-semibold">
                      {filteredAction} Request
                    </h2>
                    <textarea
                      value={actorRemark}
                      onChange={(e) => setActorRemark(e.target.value)}
                      className="w-full h-24 border border-gray-300 mt-2 p-2"
                      placeholder="Add your remarks here"
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md"
                        onClick={handleActionConfirmation}
                      >
                        Confirm
                      </button>
                      <button
                        className="bg-gray-500 text-white py-2 px-4 rounded-md ml-2"
                        onClick={handleClosePopup}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerAdvApproval;
