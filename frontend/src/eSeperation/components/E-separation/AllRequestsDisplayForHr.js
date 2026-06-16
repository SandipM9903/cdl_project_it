import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import ViewExitInterviewForm from './ViewExitInterviewForm';
import { FaRegCircleXmark } from "react-icons/fa6";
import { IoEnterOutline } from "react-icons/io5";
import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";
import { FaRegClock, FaArrowRight } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";
import ExitFormFNF from "./ExitFormFNF";


import Swal from "sweetalert2";
import { BASE_URL } from "../../../config/Config";

function AllRequestsDisplayForHr() {
  const [empDetails, setEmpDetails] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All"); // filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  // const empCode = sessionStorage.getItem("UserId");
  const hrStatus = "Pending";
  const empCode = localStorage.getItem("empId");
  const [selectedResignation, setSelectedResignation] = useState(null);
  const [viewInterviewOpen, setViewInterviewOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedEmployee, setselectedEmployee] = useState(null);
  const [comment, setComment] = useState("");

  const fetchDetails = async () => {
    try {
      // Fetch all resignation data
      const resignResponse = await axios.get(
        `${BASE_URL}:9029/api/eSeparation/getAllResignData/${empCode}`
      );
      const resignData = resignResponse.data;
      console.log(resignData, "resignData");
      // ✅ Sort by createdDate (newest first)
      resignData.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      // Fetch employee details in parallel
      const employeeResponses = await Promise.all(
        resignData.map((resignDetail) =>
          axios.get(
            `${BASE_URL}:9029/api/eSeparation/getEmployee/${resignDetail.empCode}`
          )
        )
      );

      // Extract employee details
      const empDetails = employeeResponses.map((res) => res.data);

      // Merge resignation + employee data
      const mergedData = resignData.map((resignDetail) => {
        const matchingEmpDetail = empDetails.find(
          (empDetail) =>
            empDetail?.fileAndObjectTypeBean?.empResDTO?.empCode ===
            resignDetail.empCode
        );
        return { ...resignDetail, ...(matchingEmpDetail || {}) };
      });

      setEmpDetails(mergedData);
      console.log(mergedData, "mergedData");
    } catch (error) {
      console.error("Error fetching resignation or employee details", error);
    }
  };

  console.log(empDetails, "empDetailsempDetails");

  useEffect(() => {
    fetchDetails();
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

  // // ✅ Apply filter on frontend
  // const filteredEmployees =
  //   selectedStatus === "All"
  //     ? empDetails
  //     : empDetails.filter(
  //       (emp) =>
  //         emp?.overAllStatus?.trim().toLowerCase() ===
  //         selectedStatus.trim().toLowerCase()
  //     );
  const filteredEmployees = empDetails
    ?.filter((emp) => {
      // Filter by dropdown status
      const matchesStatus =
        selectedStatus === "All" ||
        emp?.overAllStatus?.trim().toLowerCase() ===
        selectedStatus.trim().toLowerCase();

      // Extract name & code safely
      const name =
        emp?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar?.toLowerCase() ||
        "";
      const code =
        emp?.fileAndObjectTypeBean?.empResDTO?.empCode?.toLowerCase() || "";

      // Check search match
      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        name.includes(search) ||
        code.includes(search);

      return matchesStatus && matchesSearch;
    });

  const popupStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  };

  const popupContentStyles = {
    top: 0,
    width: "80%",
    height: "90%",
    background: "white",
    position: "relative",
    overflowY: "auto",
    zIndex: 999,
  };
  const initial = (name) => {
    if (name === null) {
      return;
    }
    const word = name;
    let [firstName, lastName] = word.split(" ");
    let firstLetter = firstName.charAt(0);
    let secondLetter = lastName ? lastName.charAt(0) : firstName.charAt(1);
    return `${firstLetter}${secondLetter}`;
  };
  const handleClose = () => {
    setIsPopupOpen(false);
    // setselectedEmployee(null);
  };
  const handleStayInterview = (employee) => {
    console.log("Stay Interview Clicked", employee);

    setSelectedResignation(employee);
    setViewInterviewOpen(true);
  };
  const [showMore, setShowMore] = useState(false);

  // Toggle between showing all comments or only the first three
  const toggleShowMore = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };

  // const viewDetails = (employee) => {
  //   setIsPopupOpen(true);
  //   setselectedEmployee(employee);
  //   console.log("selectedEmployee:::::::" + JSON.stringify(employee));
  //     console.log("Selected Resignation::::", selectedResignation);

  // };
  const viewDetails = (employee) => {
    console.log("View Details clicked:", employee); // ✅ should appear in console
    setselectedEmployee(employee);
    setIsPopupOpen(true);
  };
  const handleOpenPendingDoc = (docId) => {
    if (!docId) {
      Swal.fire({
        icon: "error",
        title: "File Not Available",
        text: "The requested document is not available.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    // const docViewerUrl = `/doc-viewerExit/${docId}`;
    // window.open(docViewerUrl, "_blank");

    window.open(`${BASE_URL}:9029/api/eSeparation/viewExitDocument/${docId}`, "_blank");

  };


  const postComment = () => {
    // Ensure the comment is not empty
    if (comment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    // Define the API URL for posting the comment
    const url = `${BASE_URL}:9029/api/eSeparation/sendHrComments/${selectedEmployee?.fileAndObjectTypeBean?.empResDTO?.empCode}`; // Adjusting the URL

    // Prepare the payload to match the expected format
    const payload = {
      hrComments: comment, // The comment text needs to be sent as 'mgrComments'
    };

    // Make the axios POST request with the correct data structure
    axios
      .post(url, payload, { headers: { "Content-Type": "application/json" } }) // Sending JSON data
      .then((response) => {
        console.log(`Comment posted successfully:`, response.data);

        // Immediately update the combinedComments state to show the new comment
        const newComment = {
          comment,
          dateTime: new Date().toISOString(), // Set current date-time as the comment date
          author: empDetails?.hrName || "HR",
        };

        // Add the new comment to the state
        setCommentFetched((prevComments) => [newComment, ...prevComments]);

        // Use SweetAlert for success notification
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

        // Clear the comment input after successful submission
        setComment("");
        // Optionally re-fetch comments if needed
        // fetchComment();
      })
      .catch((error) => {
        console.error(`Error posting comment:`, error);
        alert("Failed to post comment. Please try again.");
      });
  };

  const [commentFetched, setCommentFetched] = useState([]);
  console.log(empDetails, "empDetails>>>>>>>>>>>>");

  const empDetail =
    empDetails && empDetails.length > 0
      ? empDetails.find((detail) => detail === detail)
      : null;

  // Extract manager and HR comments with corresponding dates
  const mgrComments = empDetail?.mgrComments
    ? empDetail.mgrComments.split(",")
    : [];
  const mgrCommentDates = empDetail?.mgrCommentDateTime
    ? empDetail.mgrCommentDateTime.split(",")
    : [];

  const hrComments = empDetail?.hrComments
    ? empDetail.hrComments.split(",")
    : [];
  const hrCommentDates = empDetail?.hrCommentDateTime
    ? empDetail.hrCommentDateTime.split(",")
    : [];

  const empComments = empDetail?.empComments
    ? empDetail.empComments.split(",")
    : [];
  const empCommentDates = empDetail?.empCommentDateTime
    ? empDetail.empCommentDateTime.split(",")
    : [];

  const fetchComment = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}:9029/api/eSeparation/getHrComments/${empDetails.empCode}`
      );
      setCommentFetched(response.data.comments || []); // Adjust based on actual API response structure
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const combinedComments = [
    ...empComments.map((comment, index) => ({
      comment,
      dateTime: empCommentDates[index],
      author:
        empDetail?.fileAndObjectTypeBean?.empResDTO?.firstName || "Employee", // Use Employee's name
    })),
    ...mgrComments.map((comment, index) => ({
      comment,
      dateTime: mgrCommentDates[index],
      author:
        empDetail?.fileAndObjectTypeBean?.empResDTO?.reportingManager ||
        "Manager",
    })),
    ...hrComments.map((comment, index) => ({
      comment,
      dateTime: hrCommentDates[index],
      author: empDetail?.hrName || "HR",
    })),

    // Filter out comments that contain placeholder text and only map over valid comments
    ...commentFetched
      .filter((comment) => {
        const commentText = comment?.comment?.trim(); // Extract the comment text
        return commentText; //&& commentText !== 'added a Comment';  // Ensure it's not a placeholder
      })
      .map((comment) => ({
        comment: comment.comment,
        dateTime: comment.dateTime,
        author: comment.author,
      })),
  ];

  combinedComments.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const visibleComments = showMore
    ? combinedComments.reverse().slice()
    : combinedComments.reverse().slice(0, 2);


  const exportExitListToExcel = (filteredEmployees) => {
    if (!filteredEmployees || filteredEmployees.length === 0) {
      alert("No data available to export!");
      return;
    }

    // Format final rows for Excel
    const excelRows = filteredEmployees.map((item) => ({
      "Employee Name": item?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar || "",
      "Employee Code": item?.fileAndObjectTypeBean?.empResDTO?.empCode || "",
      "Joining Date": item?.fileAndObjectTypeBean?.empResDTO?.dateOfJoining || "",
      "Resignation Date": item?.dateOfResignation || "",
      "Requested Last Working Date": item?.lastWorkingDayRequest || "",
      "Last Working Date": item?.lastWorkingDay || "",
      "Exit Reason": item?.reason || "",
      "R1 Approval Status": item?.r1Status || "",
      "HR Approval Status": item?.hrStatus || "",
      "Exit Status": item?.overAllStatus || "",
    }));

    // Create Sheet
    const worksheet = XLSX.utils.json_to_sheet(excelRows);

    // Create Workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All_Employee_Resignations");

    // Export
    XLSX.writeFile(workbook, "All_Employees_Resignation_List.xlsx");
  };

  const viewFNF = async (selectedEmployee) => {
    try {
      const res = await axios.get(
        `${BASE_URL}:9029/api/eSeparation/getFnfStatusOfEmployeeinHrDashboard/${selectedEmployee?.id}`
      );

      const fnfStatus = res.data;
      console.log("FNF Status:", fnfStatus);

      if (fnfStatus === "Submitted") {
        setSelectedResignation(selectedEmployee);
        setPopupOpen(true);
      } else {
        Swal.fire({
          icon: "info",
          title: "FNF Not Submitted",
          text: "The employee has not yet submitted the FNF form.",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching FNF status", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to fetch FNF status. Please try again later.",
      });
    }
  };
  const closeFNF = () => {
    setPopupOpen(false);
    setSelectedResignation(null);
  };
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mx-8 mt-3">
        {/* Left side - Title */}
        <h1 className="text-gray-800 text-base font-semibold">
          All Requests
        </h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by employee name or employee code..."
            className="border border-gray-300 rounded-md px-3 py-1 text-sm w-96 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}

          />
        </div>
        {/* Right side - Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-400 rounded-md p-1 text-sm"
          >
            <option value="All">All</option>
            <option value="Submitted to Manager">Submitted to Manager</option>
            <option value="Pending With Interview">Pending With Interview</option>
            <option value="Interview Initiated">Interview Initiated</option>
            <option value="Pending With HR">Pending With HR</option>
            <option value="Not Started">Not Started</option>
            <option value="In progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Exited">Exited</option>
            <option value="Withdrawn">Withdrawn</option>
            <option value="Closed">Closed</option>


          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => exportExitListToExcel(filteredEmployees)}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Export to Excel
          </button>
        </div>

      </div>

      {filteredEmployees.length === 0 ? (
        <div className="mx-8 mt-6 text-gray-600 text-center text-base font-semibold">
          There are no requests.
        </div>
      ) : (
        filteredEmployees.map((employee) => (
          <div
            key={employee?.id}
            className="grid lg:grid-cols-6 md:grid-cols-3 bg-white grid-cols-2 lg:mx-2 md:mx-6 mx-6 mt-6 border rounded-lg border-gray-500 p-2 shadow-bottom"
          >
            <div className="col-span-1 lg:w-40 md:w-full w-full text-center">
              <h1 className="text-gray-600 font-semibold">Employee Name</h1>
              {employee?.fileAndObjectTypeBean &&
                employee?.fileAndObjectTypeBean?.fileAndContentTypeBean &&
                employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file ? (
                <img
                  src={`data:${employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.contentType};base64,${employee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file}`}
                  className="h-[12vh] w-[14vh] rounded-[50%/50%] mt-10 mx-auto"
                  alt="ProfilePicture"
                />
              ) : (
                <img
                  src="profile.webp"
                  alt="ProfilePicture"
                  className="h-[12vh] w-[14vh] rounded-[50%/50%] mt-10 mx-auto"
                />
              )}
              {/* <img src='profile.webp' alt='ProfilePicture' className='h-[12vh] w-[14vh] rounded-[50%/50%] mt-7 mx-auto' /> */}
              <h1 className="text-sm text-blue-700 font-semibold">
                {employee?.fileAndObjectTypeBean?.empResDTO?.fullNameAsAadhaar || "-"}
              </h1>
              <h1 className="text-xs -mt-1 text-gray-600">
                {employee?.fileAndObjectTypeBean?.empResDTO?.designationResDTO
                  .designationName || "-"}
              </h1>
              <h1 className="text-gray-800 text-xs">
                {employee?.fileAndObjectTypeBean?.empResDTO?.empCode || "-"}
              </h1>
            </div>
            <div className="col-span-1 lg:-ml-2 lg:w-48 md:w-full w-full">
              <h1 className="mx-4 text-gray-600 font-semibold">Exit Info</h1>
              <div className="">
                <div className="grid grid-cols-2  text-sm text-gray-700 p-2">
                  <h1 className="mt-2 text-xs">Joining Date</h1>
                  <h1 className="mt-2 text-xs text-[#00007D]">
                    {formatDate(
                      employee?.fileAndObjectTypeBean?.empResDTO?.dateOfJoining
                    ) || "-"}
                  </h1>
                </div>
                <div className="grid grid-cols-2 text-sm text-gray-700 p-2">
                  <h1 className="text-xs">Resignation Date</h1>
                  <h1 className="text-xs text-[#00007D]">
                    {formatDate(employee?.dateOfResignation) || "-"}
                  </h1>
                </div>

                <div className="grid grid-cols-2 text-sm text-gray-700 p-2 text-xs">
                  <h1>
                    Last Working <br></br>requested Date
                  </h1>
                  <h1 className="text-[#00007D]">
                    {formatDate(employee?.lastWorkingDayRequest) || "-"}
                  </h1>
                </div>
                <div className="grid grid-cols-2  text-sm text-gray-700 p-2 text-xs">
                  <h1>{getLabel(employee)}</h1>
                  <h1 className="text-[#00007D] text-xs">
                    {(employee?.noticePeriodWaiver || employee?.noticePeriodWaiverByHr)
                      ? formatDate(employee?.expectedLastWorkingDay) || "-"
                      : formatDate(employee?.lastWorkingDay) || "-"
                    }
                  </h1>
                </div>
              </div>
            </div>
            <div className="col-span-1 lg:w-[200px] md:w-full w-full lg:ml-4">
              <h1 className="text-gray-600 font-semibold mx-4 text-xs">Exit Reason</h1>
              <h1 className="text-gray-800 font-semibold text-sm mt-3 text-xs mx-6">
                {employee?.reason || "-"}
              </h1>
              <h1 className="text-gray-600 text-xs ml-6">
                {employee?.remarks || "-"}
              </h1>
            </div>
            <div className="col-span-1 lg:ml-11 md:ml-0 ml-0 lg:w-32 w-full md:w-full">
              <h1 className="text-gray-600 font-semibold lg:text-center md:text-center text-left lg:mx-1 md:mx-1 mx-4">
                R1 Approval Status
              </h1>
              <h1
                className={`text-gray-900 p-1 px-1 font-semibold mt-5 text-sm lg:mx-6 md:mx-12 mx-6 mr-6 inline-block rounded-md bg-[#A8ED87]`}
              >
                {employee?.r1Status}
              </h1>
            </div>
            <div className="col-span-1 lg:ml-4 md:ml-0 ml-0 lg:w-32 md:w-full w-full">
              <h1 className="text-gray-600 font-semibold lg:text-center md:text-center text-left lg:mx-2 md:mx-1 mx-4">
                HR Approval Status
              </h1>
              <h1
                className={`text-gray-900 p-1 lg:mx-6 md:mx-12 mx-1 font-semibold text-sm mt-5 px-1 inline-block rounded-md bg-[#A8ED87]`}
              >
                {employee?.hrStatus}
              </h1>
            </div>
            <div className="col-span-1 lg:-ml-8 flex flex-col justify-start items-center w-full">
              <div>
                <h1 className="text-gray-600 mt-2 font-semibold text-center whitespace-nowrap">
                  Exit Status
                </h1>
                <h1
                  className={`inline-block px-3 py-[2px]  mt-9 ${employee?.overAllStatus === "Completed"
                    ? "bg-[#A8ED87] text-black"
                    : employee?.overAllStatus === "In progress"
                      ? "bg-[#DFCC22] text-white"
                      : "bg-[#DDDBDB] text-gray-900"
                    } font-semibold text-sm rounded-md mt-2 text-center`}
                >
                  {employee?.overAllStatus}
                </h1>
              </div>

              {/* Add spacing above the button */}
              <button
                className="flex items-center text-blue-600 gap-2 mt-9 py-1 px-2 hover:bg-blue-50 font-semibold rounded-md text-sm"
                onClick={() => viewDetails(employee)}
              >
                View Details <FaArrowRight />
              </button>

            </div>
            


            
          </div>
        ))
      )}

  

              {isPopupOpen && selectedEmployee && (
                <div style={popupStyles} className="fixed top-0 left-0 z-[5000]">
                  <div style={popupContentStyles}>
                    <div>
                      <div className="p-3 text-right">
                        <button
                          className="text-red-500 text-xl"
                          onClick={handleClose}
                        >
                          <FaRegCircleXmark />
                        </button>
                      </div>
                      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:mx-3 mx-0 p-4 shadow-bottom">
                        <div className="col-span-1 p-2  shadow-bottom">
                          <div className="py-3 text-center ">
                            {selectedEmployee?.fileAndObjectTypeBean &&
                              selectedEmployee?.fileAndObjectTypeBean
                                ?.fileAndContentTypeBean &&
                              selectedEmployee?.fileAndObjectTypeBean
                                ?.fileAndContentTypeBean?.file ? (
                              <img
                                src={`data:${selectedEmployee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.contentType};base64,${selectedEmployee?.fileAndObjectTypeBean?.fileAndContentTypeBean?.file}`}
                                className="h-[12vh] w-[14vh] rounded-[50%/50%] mt-10 mx-auto"
                                alt="ProfilePicture"
                              />
                            ) : (
                              <img
                                src="profile.webp"
                                alt="ProfilePicture"
                                className="h-[12vh] w-[14vh] rounded-[50%/50%] mt-10 mx-auto"
                              />
                            )}
                            <h1 className="text-sm text-blue-500 font-bold break-words">
                              {selectedEmployee?.fileAndObjectTypeBean
                                ?.empResDTO?.firstName || "-"}
                            </h1>
                            <h1 className="text-xs text-gray-500 break-words">
                              {selectedEmployee?.fileAndObjectTypeBean
                                ?.empResDTO.designationResDTO
                                ?.designationName || "-"}
                            </h1>
                          </div>
                          <div className="grid grid-cols-3 text-xs px-4 gap-2">
                            <div>
                              <h1 className="text-gray-500">Employee Id</h1>
                              <h1 className="text-[#00007D] break-words">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.empCode || "-"}
                              </h1>
                            </div>
                            <div>
                              <h1 className="text-gray-500">Contact No</h1>
                              <h1 className="text-[#00007D] break-words">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.primaryContactNo || "-"}
                              </h1>
                            </div>
                            <div>
                              <h1 className="text-gray-500">Email</h1>
                              <h1 className="text-[#00007D] break-words">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.emailId || "-"}
                              </h1>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 text-xs p-4 gap-2">
                            <div>
                              <h1 className="text-gray-500">Department</h1>
                              <h1 className="text-[#00007D] break-words">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.mainDeptResDTO
                                  ?.mainDepartment || "-"}
                              </h1>
                            </div>
                            <div>
                              <h1 className="text-gray-500">
                                Reporting to
                              </h1>
                              <h1 className="text-[#00007D] break-words">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.reportingManager || "-"}
                              </h1>
                            </div>
                            <div>
                              <h1 className="text-gray-500">Designation</h1>
                              <h1 className="text-[#00007D] break-words">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.designationResDTO
                                  ?.designationName || "-"}
                              </h1>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 text-xs p-4 gap-2">
                            <div>
                              <h1 className="text-gray-500">Location</h1>
                              <h1 className="text-[#00007D] break-words">
                                {selectedEmployee?.userDTO?.locationResDTO
                                  ?.locationName || "-"}
                              </h1>
                            </div>

                            <div>
                              <h1 className="text-gray-500">
                                Project / Cost Centre
                              </h1>
                              <h1 className="text-[#00007D] break-words">
                                {selectedEmployee?.fileAndObjectTypeBean
                                  ?.empResDTO?.projectResDTO?.projectId || "-"}
                              </h1>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 text-xs p-4 gap-2">
                            <div>
                              <h1 className="text-gray-500">
                                Joining Date
                              </h1>
                              <h1 className="text-[#00007D] break-words">
                                {formatDate(
                                  selectedEmployee?.fileAndObjectTypeBean
                                    ?.empResDTO?.dateOfJoining
                                ) || "-"}
                              </h1>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <div className="col-span-1 flex gap-2 mx-10">
                            <h1 className="font-semibold text-base text-[#2E2F31] whitespace-nowrap">
                              Status :
                            </h1>
                            <h1
                              className={`font-semibold text-base whitespace-nowrap ${selectedEmployee?.overAllStatus ===
                                "In progress"
                                ? "text-[#DFCC22]"
                                : selectedEmployee?.overAllStatus ===
                                  "Completed"
                                  ? "text-[#1FD127]"
                                  : "text-red-500"
                                }`}
                            >
                              {selectedEmployee?.overAllStatus ===
                                "Submitted to Manager"
                                ? "Pending  With Manager"
                                : selectedEmployee?.overAllStatus}
                            </h1>

                            <button
                              className="bg-blue-500 text-white w-[92px] rounded-md text-[15px] ml-auto"
                              onClick={() => viewFNF(selectedEmployee)}
                            >
                              FNF<br></br>Tracker
                            </button>
                          </div>

                          <div className="mx-10 mt-3">
                            <h2 className="mb-1 text-base text-[#2E2F31] font-semibold ml-2">
                              Discussion Thread
                            </h2>
                            <div className="">
                              <div className="grid grid-cols-6 mt-3 items-center">
                                <div className="col-span-1 border-r-2 border-gray-300 h-full mr-3">
                                  <h1 className=" text-xs bg-orange-500 rounded-full h-10 w-10 text-center text-white font-semibold mt-4 pt-[12px]">
                                    {initial(
                                      selectedEmployee?.fileAndObjectTypeBean
                                        ?.empResDTO?.reportingManager
                                    )}
                                  </h1>
                                  <h1 className=" text-xs bg-blue-500 rounded-full h-10 w-10 text-center text-white font-semibold mt-3 pt-[12px]">
                                    {initial(
                                      selectedEmployee?.fileAndObjectTypeBean
                                        ?.empResDTO?.firstName
                                    )}
                                  </h1>
                                </div>
                                <div className="col-span-5">
                                  <h1 className="font-semibold text-gray-800 text-xs mt-4">
                                    {selectedEmployee?.r1Status ===
                                      "Approved" ? (
                                      <h1>
                                        Approved<br></br>{" "}
                                        <span className="text-gray-500 text-xs font-normal">
                                          By{" "}
                                          {
                                            selectedEmployee
                                              ?.fileAndObjectTypeBean
                                              ?.empResDTO?.reportingManager
                                          }
                                        </span>
                                      </h1>
                                    ) : selectedEmployee?.hrStatus ===
                                      "Retained" ? (
                                      <h1>
                                        Retained<br></br>
                                        <span className="text-gray-500 text-xs font-normal">
                                          By{" "}
                                          {
                                            selectedEmployee
                                              ?.fileAndObjectTypeBean
                                              ?.empResDTO?.reportingManager
                                          }
                                        </span>
                                      </h1>
                                    ) : (
                                      <h1>
                                        Pending<br></br>
                                        <span className="text-gray-500 text-xs font-normal">
                                          With{" "}
                                          {
                                            selectedEmployee
                                              ?.fileAndObjectTypeBean
                                              ?.empResDTO?.reportingManager
                                          }
                                        </span>
                                      </h1>
                                    )}
                                  </h1>
                                  <h1 className="text-gray-800 text-xs font-semibold mt-2">
                                    {
                                      selectedEmployee?.fileAndObjectTypeBean
                                        ?.empResDTO?.firstName
                                    }{" "}
                                    <br></br>
                                    <span className="text-gray-500 text-xs font-normal">
                                      has Submitted
                                    </span>
                                  </h1>
                                  <h1 className="text-gray-500 text-xs">
                                    {selectedEmployee?.dateOfResignation}
                                  </h1>
                                </div>
                              </div>
                              <div className="flex p-4">
                                <input
                                  className="border border-gray-300 text-[#2E2F31] w-[80%] text-xs p-1"
                                  placeholder="Add your comment here....."
                                  value={comment}
                                  onChange={(e) =>
                                    setComment(e.target.value)
                                  }
                                />
                                <IoEnterOutline
                                  className="ml-[-2rem] text-gray-800 mt-[4px] text-xl cursor-pointer"
                                  onClick={postComment} // Post the comment on icon click
                                />
                              </div>
                              <div className="mt-3 px-4 text-sm">
                                {combinedComments.length > 0 ? (
                                  <div
                                    className={`overflow-y-auto ${showMore ? "h-52" : ""
                                      }`}
                                  >
                                    <ul>
                                      {visibleComments.map(
                                        (entry, index) => (
                                          <li
                                            key={index}
                                            // style={{ marginBottom: "10px" }}
                                            className="text-xs"
                                          >
                                            <div className="grid grid-cols-6 items-center ">
                                              <div className="mr-2 col-span-1 border-r-2 border-gray-300 h-full ">
                                                <h1
                                                  className={`text-sm ${index % 2 === 0
                                                    ? "bg-blue-500"
                                                    : "bg-orange-500"
                                                    } rounded-full h-10 w-10 text-center text-white font-semibold pt-[8px]`}
                                                >
                                                  {initial(entry.author)}
                                                </h1>
                                              </div>
                                              <div className="col-span-5">
                                                <p className="text-gray-600 text-xs font-normal">
                                                  <strong>
                                                    {entry.author}
                                                  </strong>{" "}
                                                  added a{" "}
                                                  <strong>Comment</strong>
                                                </p>
                                                <p className="text-gray-500 text-xs ">
                                                  {entry.comment}
                                                </p>
                                                <p className="text-gray-400 text-xs font-medium mb-4">
                                                  {entry.dateTime}
                                                </p>
                                              </div>
                                            </div>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                ) : (
                                  <div className="text-gray-800">
                                    No comments available
                                  </div>
                                )}
                                {combinedComments.length > 2 && (
                                  <div>
                                    <button
                                      onClick={toggleShowMore}
                                      className="text-blue-500 mt-4"
                                    >
                                      {showMore ? (
                                        <IoIosArrowDropup
                                          size={24}
                                          className="ml-36 mt-3 text-blue-600"
                                        />
                                      ) : (
                                        <IoIosArrowDropdown
                                          size={24}
                                          className="ml-36 mt-3 text-blue-600"
                                        />
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                      <div className="mx-3 mt-3 shadow-bottom">
                        <div>
                          <h1 className="font-semibold lg:text-base md:text-base text-sm mx-5 mt-4 pt-3 text-gray-700">
                            Employee Exit Details
                          </h1>
                        </div>
                        <div className="grid grid-cols-1">
                          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 items-center px-5 font-normal lg:space-y-3 md:space-y-1 space-y-1">
                            <h1 className="mt-2 text-sm">
                              Resignation Date
                            </h1>
                            <h1 className="border text-sm border-gray-400 py-1 mt-3 px-4 lg:w-[170px] md:w-[140px] w-[130px]">
                              {formatDate(
                                selectedEmployee?.dateOfResignation
                              ) || "="}
                            </h1>
                            <h1 className="text-sm">
                              Last working Date Requested
                            </h1>
                            <h1 className="border text-sm border-gray-400 py-1 px-4 lg:w-[170px] md:w-[140px] w-[130px]">
                              {formatDate(
                                selectedEmployee?.lastWorkingDayRequest
                              ) || "-"}
                            </h1>
                          </div>
                          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 items-center font-normal px-5 lg:py-2 md:py-0 lg:space-y-1 md:space-y-1 space-y-1">
                            <h1 className="mt-4 text-sm">
                              {getLabel(selectedEmployee)}
                            </h1>
                            <h1 className="border text-sm border-gray-400 py-1 px-4 lg:w-[170px] md:w-[140px] w-[130px]">
                              {/* {formatDate(
                                                      selectedEmployee?.lastWorkingDay
                                                    ) || "-"} */}
                              {(selectedEmployee?.noticePeriodWaiver || selectedEmployee?.noticePeriodWaiverByHr)
                                ? formatDate(selectedEmployee?.expectedLastWorkingDay) || "-"
                                : formatDate(selectedEmployee?.lastWorkingDay) || "-"
                              }

                            </h1>
                            <h1 className="text-sm">Reason for Exit</h1>
                            <h1 className="border text-sm border-gray-400 whitespace-normal py-1 px-2 lg:w-[170px] md:w-[140px] w-[130px]">
                              {selectedEmployee?.reason || "-"}
                            </h1>
                          </div>
                          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 items-center lg:py-2 md:py-0  font-normal px-5 lg:pb-3 md:pb-1 pb-1 lg:-space-y-3 md:space-y-2 space-y-1">
                            <h1 className="text-sm">Resignation Mail PDF</h1>
                            <button
                              onClick={() => handleOpenPendingDoc(selectedEmployee?.docId)}
                              className="cursor-pointer text-blue-500 hover:text-blue-700 px-7 text-sm"
                              title=" View Document"
                            >
                              <IoEyeSharp />
                            </button>

                            <h1 className="lg:whitespace-nowrap text-sm md:whitespace-nowrap whitespace-nowrap lg:mt-4 md:mt-0 ">
                              Additional Remarks
                            </h1>
                            <h1 className="text-wrap border text-sm border-gray-400 py-1 px-4 lg:w-[270px] md:w-[200px] w-[145px]">
                              {selectedEmployee?.remarks || "-"}
                            </h1>
                          </div>
                          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 items-center lg:py-2 md:py-0  font-normal px-5 lg:pb-3 md:pb-1 pb-1 lg:-space-y-3 md:space-y-2 space-y-1">
                            <h1 className="text-sm">StayIn Interview Form</h1>
                            <button onClick={() => handleStayInterview(selectedEmployee)}
                              className="cursor-pointer text-blue-500 hover:text-blue-700 px-7 text-sm">
                              <IoEyeSharp />
                            </button>
                            {viewInterviewOpen && selectedResignation && (
                              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-6xl max-h-[90vh] overflow-y-auto">
                                  <ViewExitInterviewForm
                                    resignationDetails={selectedResignation}
                                    closeViewInterview={() => setViewInterviewOpen(false)}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mx-3 mt-3 shadow-bottom">
                        <div>
                          <h1 className="font-semibold text-sm mx-5 mt-4 pt-3 text-gray-700">
                            Filled by Manager
                          </h1>
                        </div>
                        <div className="">
                          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 text-sm px-5 mt-2 items-center font-normal lg:space-y-4 md:space-y-2 space-y-1">
                            <h1 className="whitespace-nowrap mt-4">
                              Notice Period Waiver
                            </h1>
                            <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 px-10 p-1">
                              {selectedEmployee?.noticePeriodWaiver ? "Yes" : "No" || "-"}
                            </h1>
                            <h1 className="lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal">
                              Remarks to Employee
                            </h1>
                            <h1 className="border border-gray-300 lg:w-52 md:w-60 w-36 p-1">
                              {selectedEmployee?.managerRemarksToEmp || "-"}
                            </h1>
                          </div>
                          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 lg:py-3 md:py-0 text-gray-500 text-sm px-5 lg:mt-2 md:mt-0 mt-0 items-center font-normal lg:-space-y-4 md:space-y-2 space-y-1">
                            <h1 className="-mt-3">
                              Final Last working Date
                            </h1>
                            <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 p-1 px-10">
                              {formatDate(
                                selectedEmployee?.expectedLastWorkingDay ||
                                "-"
                              )}
                            </h1>
                            <h1 className="whitespace-nowrap">
                              Remarks to Reviewer
                            </h1>
                            <p className="border border-gray-300 lg:w-52 md:w-60 w-36 p-1">
                              {selectedEmployee?.managerRemarksToReviewer || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* +++++++++++++++++++++++++ */}

                      <div className="mx-3 mt-3 shadow-bottom pb-6">
                        <div>
                          <h1 className="font-semibold text-sm mx-5 mt-4 pt-3 text-gray-700">
                            Filled or To be filled by HR
                          </h1>
                        </div>

                        {/* Grid layout for checkbox and remarks */}
                        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 text-gray-500 text-sm px-5 mt-2 items-center font-normal lg:space-y-4 md:space-y-2 space-y-1">

                          <h1 className="whitespace-nowrap mt-4">
                            FNF Enable for BU
                          </h1>

                          {/* FNF Checkbox */}
                          <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 px-10 p-1">
                            {selectedEmployee?.fnfEnableForBU ? "Yes" : "No" || "-"}
                          </h1>
                          {/* FNF Label */}
                          <h1 className="whitespace-nowrap mt-4">
                            FNF Enable for Sales
                          </h1>

                          {/* FNF Checkbox */}
                          <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 px-10 p-1">
                            {selectedEmployee?.fnfEnableForSales ? "Yes" : "No" || "-"}
                          </h1>
                          <h1 className="waiver whitespace-nowrap mt-4 text-xs">
                            Notice Period Waiver{" "}

                          </h1>
                          <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 px-10 p-1">
                            {selectedEmployee?.noticePeriodWaiverByHr ? "Yes" : "No" || "-"}
                          </h1>

                          <h1 className="mt-0 text-xs">
                            Final Last working Date
                          </h1>
                          <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 p-1 px-10">
                            {formatDate(
                              selectedEmployee?.expectedLastWorkingDay ||
                              "-"
                            )}
                          </h1>
                          {/* Remarks Label */}
                          <h1 className="lg:whitespace-nowrap md:whitespace-nowrap whitespace-normal mt-4">
                            Remarks with Reviewer

                          </h1>

                          {/* Remarks Textarea */}
                          <h1 className="border border-gray-300 lg:w-44 md:w-40 w-32 p-1 px-10">
                            {formatDate(
                              selectedEmployee?.hrRemarksToReviewer ||
                              "-"
                            )}
                          </h1>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              )}

            
 {popupOpen && (
               <div className="fixed top-0 left-0 z-[9999] w-full h-full bg-black bg-opacity-70 flex justify-center items-center">
    <div className="w-[75%] h-[90%] bg-white relative overflow-y-auto z-[10000]">
                    <ExitFormFNF
                      closeFNF={closeFNF}
                      resignationDetails={selectedResignation}
                      resignationData={empDetails} // or a filtered list if needed
                      readOnly={true}
                    />
                  </div>
                </div>
              )}

    </div>

  );


}

export default AllRequestsDisplayForHr;
